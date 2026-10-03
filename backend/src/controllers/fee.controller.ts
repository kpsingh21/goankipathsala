import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { InvoiceStatus } from '@prisma/client';
import { getTeacherClassScope } from '../lib/teacher-scope.js';

/**
 * List all fee structures configured in the school (scoped to teacher class if TEACHER)
 */
export async function listFeeStructures(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const userRole = req.user?.role || '';
    const isFeeAdmin = ['SUPERADMIN', 'SCHOOL_ADMIN', 'ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'CASHIER'].includes(userRole);

    const whereClause: any = { tenantId };

    if (!isFeeAdmin) {
      const scope = await getTeacherClassScope(tenantId, req.user?.userId || '', userRole);

      if (!scope.hasAccessToAll && scope.classGradeIds.length === 0) {
        return res.json({ feeStructures: [] });
      }

      if (!scope.hasAccessToAll) {
        whereClause.classGradeId = { in: scope.classGradeIds };
      }
    }

    const feeStructures = await prisma.feeStructure.findMany({
      where: whereClause,
      include: {
        classGrade: { select: { id: true, name: true } },
        academicYear: { select: { id: true, name: true } },
        _count: { select: { invoices: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ feeStructures });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Create a Fee Structure with breakdown components, frequency, and late fine rules
 */
export async function createFeeStructure(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const {
      name,
      amount,
      dueDate,
      frequency,
      components,
      lateFinePerDay,
      description,
      classGradeName,
      applicableClasses,
    } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!name || !dueDate) {
      return res.status(400).json({ error: 'Fee structure name and due date are required.' });
    }

    // Calculate total amount from components if provided, else use amount
    let calculatedAmount = 0;
    if (Array.isArray(components) && components.length > 0) {
      calculatedAmount = components.reduce((sum: number, c: any) => sum + (parseFloat(c.amount) || 0), 0);
    } else if (amount) {
      calculatedAmount = parseFloat(amount);
    }

    if (calculatedAmount <= 0) {
      return res.status(400).json({ error: 'Fee amount or fee breakdown components with positive amounts are required.' });
    }

    // Ensure active academic year
    let academicYear = await prisma.academicYear.findFirst({
      where: { tenantId, isCurrent: true },
    });
    if (!academicYear) {
      academicYear = await prisma.academicYear.create({
        data: {
          tenantId,
          name: '2026-2027',
          startDate: new Date('2026-04-01'),
          endDate: new Date('2027-03-31'),
          isCurrent: true,
        },
      });
    }

    // Handle applicable classes (single class, multiple classes, or All Classes)
    let gradeName = classGradeName;
    if (Array.isArray(applicableClasses) && applicableClasses.length > 0) {
      if (applicableClasses.length >= 10 || applicableClasses.includes('All Classes') || applicableClasses.includes('ALL')) {
        gradeName = 'All Classes';
      } else {
        gradeName = applicableClasses.join(', ');
      }
    }
    if (!gradeName) {
      gradeName = 'Class 6';
    }

    // Ensure class grade exists
    let classGrade = await prisma.classGrade.findFirst({
      where: { tenantId, name: gradeName },
    });
    if (!classGrade) {
      classGrade = await prisma.classGrade.create({
        data: {
          tenantId,
          name: gradeName,
          numericalOrder: 1,
        },
      });
    }

    const finalDescription = description || (Array.isArray(applicableClasses) && applicableClasses.length > 0
      ? `Applicable Classes: ${applicableClasses.join(', ')}`
      : null);

    const feeStructure = await prisma.feeStructure.create({
      data: {
        tenantId,
        academicYearId: academicYear.id,
        classGradeId: classGrade.id,
        name,
        amount: calculatedAmount,
        dueDate: new Date(dueDate),
        frequency: frequency || 'QUARTERLY',
        components: components || [],
        lateFinePerDay: lateFinePerDay ? parseFloat(lateFinePerDay) : 0.0,
        description: finalDescription,
      },
      include: {
        classGrade: true,
        academicYear: true,
        _count: { select: { invoices: true } },
      },
    });

    return res.status(201).json({
      message: 'Fee structure created successfully',
      feeStructure,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Batch generate invoices for all enrolled students in a class for a fee structure
 */
export async function generateClassInvoices(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { feeStructureId, classGradeName } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!feeStructureId) {
      return res.status(400).json({ error: 'Fee Structure ID is required.' });
    }

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
      include: { classGrade: true },
    });

    if (!feeStructure || feeStructure.tenantId !== tenantId) {
      return res.status(404).json({ error: 'Fee structure not found.' });
    }

    // Determine target classes (supports single class, multi-class list, or All Classes)
    let classGradeIds: string[] = [];
    const structGradeName = feeStructure.classGrade?.name || '';

    if (classGradeName && classGradeName !== 'ALL' && classGradeName !== 'All Classes') {
      const requestedGrade = await prisma.classGrade.findFirst({
        where: { tenantId, name: classGradeName },
      });
      if (requestedGrade) {
        classGradeIds = [requestedGrade.id];
      }
    } else if (structGradeName === 'All Classes' || classGradeName === 'ALL' || classGradeName === 'All Classes') {
      const allClasses = await prisma.classGrade.findMany({
        where: { tenantId },
        select: { id: true },
      });
      classGradeIds = allClasses.map(c => c.id);
    } else if (structGradeName.includes(',')) {
      const names = structGradeName.split(',').map(s => s.trim()).filter(Boolean);
      const matchedGrades = await prisma.classGrade.findMany({
        where: { tenantId, name: { in: names } },
        select: { id: true },
      });
      classGradeIds = matchedGrades.map(c => c.id);
    } else {
      classGradeIds = [feeStructure.classGradeId];
    }

    // Find all active enrollments for target classes
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        section: { classGradeId: { in: classGradeIds } },
      },
      include: {
        student: true,
        section: { include: { classGrade: true } },
        feeInvoices: {
          where: { feeStructureId: feeStructure.id },
        },
      },
    });

    if (enrollments.length === 0) {
      return res.status(400).json({ error: `No students enrolled in target class(es) yet.` });
    }

    const eligibleEnrollments = enrollments.filter(e => e.feeInvoices.length === 0);

    if (eligibleEnrollments.length === 0) {
      return res.status(200).json({
        message: 'All enrolled students already have invoices generated for this fee structure.',
        generatedCount: 0,
      });
    }

    // Create invoices in transaction
    const createdInvoices = await prisma.$transaction(
      eligibleEnrollments.map((enr, idx) => {
        const invoiceNumber = `INV-${Date.now().toString().slice(-5)}-${idx + 1}`;
        return prisma.feeInvoice.create({
          data: {
            tenantId,
            enrollmentId: enr.id,
            feeStructureId: feeStructure.id,
            invoiceNumber,
            totalAmount: feeStructure.amount,
            paidAmount: 0.0,
            status: InvoiceStatus.PENDING,
          },
          include: {
            feeStructure: { select: { name: true, dueDate: true } },
            enrollment: {
              include: {
                student: true,
                section: { include: { classGrade: true } },
              },
            },
          },
        });
      })
    );

    return res.status(201).json({
      message: `Successfully issued ${createdInvoices.length} invoices to ${feeStructure.classGrade.name}!`,
      generatedCount: createdInvoices.length,
      invoices: createdInvoices,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * List Student Invoices with balances
 */
export async function listInvoices(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const userRole = req.user?.role || '';
    const isFeeAdmin = ['SUPERADMIN', 'SCHOOL_ADMIN', 'ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'CASHIER'].includes(userRole);

    const whereClause: any = { tenantId };

    if (!isFeeAdmin) {
      const scope = await getTeacherClassScope(tenantId, req.user?.userId || '', userRole);

      if (!scope.hasAccessToAll && scope.classGradeIds.length === 0 && scope.sectionIds.length === 0) {
        return res.json({ invoices: [] });
      }

      if (!scope.hasAccessToAll) {
        whereClause.enrollment = {
          OR: [
            ...(scope.sectionIds.length > 0 ? [{ sectionId: { in: scope.sectionIds } }] : []),
            ...(scope.classGradeIds.length > 0 ? [{ section: { classGradeId: { in: scope.classGradeIds } } }] : []),
          ],
        };
      }
    }

    const invoices = await prisma.feeInvoice.findMany({
      where: whereClause,
      include: {
        feeStructure: { select: { name: true, dueDate: true } },
        enrollment: {
          include: {
            student: true,
            section: { include: { classGrade: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ invoices });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Generate invoice for an enrolled student
 */
export async function generateInvoice(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { enrollmentId, feeStructureId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!enrollmentId || !feeStructureId) {
      return res.status(400).json({ error: 'Enrollment ID and Fee Structure ID are required.' });
    }

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });
    if (!feeStructure || feeStructure.tenantId !== tenantId) {
      return res.status(404).json({ error: 'Fee structure not found.' });
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const invoice = await prisma.feeInvoice.create({
      data: {
        tenantId,
        enrollmentId,
        feeStructureId,
        invoiceNumber,
        totalAmount: feeStructure.amount,
        paidAmount: 0.0,
        status: InvoiceStatus.PENDING,
      },
      include: {
        feeStructure: true,
        enrollment: { include: { student: true } },
      },
    });

    return res.status(201).json({
      message: 'Fee invoice generated successfully',
      invoice,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Record a payment against an invoice
 */
export async function recordPayment(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { invoiceId, paymentAmount } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const invoice = await prisma.feeInvoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: {
        feeStructure: true,
        enrollment: {
          include: {
            student: true,
            section: { include: { classGrade: true } },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const parsedPay = Math.max(0, parseFloat(paymentAmount) || 0);
    const newPaidAmount = Number(invoice.paidAmount) + parsedPay;
    const total = Number(invoice.totalAmount);

    let newStatus = invoice.status;
    if (newPaidAmount >= total && total > 0) {
      newStatus = InvoiceStatus.PAID;
    } else if (newPaidAmount > 0) {
      newStatus = InvoiceStatus.PARTIALLY_PAID;
    }

    const updated = await prisma.feeInvoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
      include: {
        feeStructure: true,
        enrollment: {
          include: {
            student: true,
            section: { include: { classGrade: true } },
          },
        },
      },
    });

    return res.json({
      message: `Payment of ₹${parsedPay} recorded successfully. Status: ${newStatus}`,
      invoice: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete / Remove Fee Structure or Slot
 */
export async function deleteFeeStructure(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const id = (req.params.id as string) || '';

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'School tenant context and Fee Structure ID are required.' });
    }

    const structure = await prisma.feeStructure.findFirst({
      where: { id, tenantId },
    });

    if (!structure) {
      return res.status(404).json({ error: 'Fee structure not found in this school.' });
    }

    await prisma.feeStructure.delete({
      where: { id },
    });

    return res.json({ message: `Fee structure "${structure.name}" removed successfully.` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a single student invoice
 */
export async function deleteInvoice(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const id = (req.params.id as string) || '';

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'School tenant context and Invoice ID are required.' });
    }

    const invoice = await prisma.feeInvoice.findFirst({
      where: { id, tenantId },
      include: {
        enrollment: { include: { student: true } },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    await prisma.feeInvoice.delete({
      where: { id },
    });

    return res.json({
      message: `Invoice ${invoice.invoiceNumber} for ${invoice.enrollment?.student?.firstName || 'student'} deleted successfully.`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Reset / Bulk clear invoices (by fee structure, class grade, or all)
 */
export async function resetInvoices(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { feeStructureId, classGradeName, status } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const whereClause: any = { tenantId };

    if (feeStructureId && feeStructureId !== 'ALL') {
      whereClause.feeStructureId = feeStructureId;
    }

    if (classGradeName && classGradeName !== 'ALL') {
      whereClause.enrollment = {
        section: { classGrade: { name: classGradeName } },
      };
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    const deleted = await prisma.feeInvoice.deleteMany({
      where: whereClause,
    });

    return res.json({
      message: `Successfully cleared ${deleted.count} invoices from list.`,
      deletedCount: deleted.count,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Adjust Invoice Amount (Add prior remaining balance, apply discount/waiver, or adjust remaining balance)
 */
export async function adjustInvoice(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { invoiceId, adjustmentAmount, type, reason } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!invoiceId) {
      return res.status(400).json({ error: 'Invoice ID is required.' });
    }

    // Strict validation: non-numeric, null, undefined, negative checks
    if (adjustmentAmount === undefined || adjustmentAmount === null || String(adjustmentAmount).trim() === '') {
      return res.status(400).json({ error: 'Adjustment amount is required.' });
    }

    const amountVal = Number(adjustmentAmount);
    if (isNaN(amountVal) || !isFinite(amountVal)) {
      return res.status(400).json({ error: 'Adjustment amount must be a valid numeric number.' });
    }

    if (amountVal < 0) {
      return res.status(400).json({
        error: 'Negative amounts are not allowed. Please enter a positive number and select Add (+), Discount (-), or Set Due.',
      });
    }

    const invoice = await prisma.feeInvoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: {
        feeStructure: true,
        enrollment: {
          include: {
            student: true,
            section: { include: { classGrade: true } },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const currentTotal = Number(invoice.totalAmount);
    const currentPaid = Number(invoice.paidAmount);

    let newTotal = currentTotal;

    if (type === 'SUBTRACT') {
      // Concession, waiver, discount, or credit deduction
      if (amountVal <= 0) {
        return res.status(400).json({ error: 'Discount / deduction amount must be greater than zero.' });
      }
      if (currentTotal - amountVal < currentPaid) {
        const maxDiscount = Math.max(0, currentTotal - currentPaid);
        return res.status(400).json({
          error: `Cannot deduct ₹${amountVal}. Total invoice fee (₹${currentTotal}) cannot be reduced below the amount already received/paid (₹${currentPaid}). Maximum allowable deduction is ₹${maxDiscount}.`,
        });
      }
      newTotal = currentTotal - amountVal;
    } else if (type === 'ADD') {
      // Prior term remaining balance, late fee, or extra charges
      if (amountVal <= 0) {
        return res.status(400).json({ error: 'Amount to add must be greater than zero.' });
      }
      newTotal = currentTotal + amountVal;
    } else if (type === 'SET_REMAINING') {
      // Directly specify the remaining balance due: newTotal = currentPaid + amountVal
      newTotal = currentPaid + amountVal;
    } else {
      return res.status(400).json({ error: 'Invalid adjustment type. Must be ADD, SUBTRACT, or SET_REMAINING.' });
    }

    // Safety guard: total fee cannot be less than received amount
    if (newTotal < currentPaid) {
      return res.status(400).json({
        error: `Total fee (₹${newTotal}) cannot be less than the amount already received (₹${currentPaid}).`,
      });
    }

    let newStatus = invoice.status;
    if (currentPaid >= newTotal && newTotal > 0) {
      newStatus = InvoiceStatus.PAID;
    } else if (currentPaid > 0 && currentPaid < newTotal) {
      newStatus = InvoiceStatus.PARTIALLY_PAID;
    } else if (currentPaid === 0) {
      newStatus = InvoiceStatus.PENDING;
    }

    const updated = await prisma.feeInvoice.update({
      where: { id: invoice.id },
      data: {
        totalAmount: newTotal,
        status: newStatus,
      },
      include: {
        feeStructure: true,
        enrollment: {
          include: {
            student: true,
            section: { include: { classGrade: true } },
          },
        },
      },
    });

    const diff = newTotal - currentTotal;
    const sign = diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`;

    return res.json({
      message: `Invoice adjusted successfully (${sign}). New balance due: ₹${Math.max(0, newTotal - currentPaid)}.`,
      invoice: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Overall School Fee & Revenue Dashboard Summary
 */
export async function getFeeRevenueSummary(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const invoices = await prisma.feeInvoice.findMany({
      where: { tenantId },
      include: {
        feeStructure: { select: { id: true, name: true } },
        enrollment: {
          include: {
            student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true } },
            section: { include: { classGrade: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    let totalDemand = 0;
    let totalCollected = 0;
    let paidCount = 0;
    let partialCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    const classMap: Record<string, {
      className: string;
      totalDemand: number;
      totalCollected: number;
      totalOutstanding: number;
      studentCount: number;
      invoiceCount: number;
    }> = {};

    const structureMap: Record<string, {
      structureName: string;
      totalDemand: number;
      totalCollected: number;
      totalOutstanding: number;
      invoiceCount: number;
    }> = {};

    for (const inv of invoices) {
      const total = Number(inv.totalAmount) || 0;
      const paid = Number(inv.paidAmount) || 0;
      const outstanding = Math.max(0, total - paid);

      totalDemand += total;
      totalCollected += paid;

      if (inv.status === InvoiceStatus.PAID) paidCount++;
      else if (inv.status === InvoiceStatus.PARTIALLY_PAID) partialCount++;
      else if (inv.status === InvoiceStatus.OVERDUE) overdueCount++;
      else pendingCount++;

      // Class breakdown
      const clsName = inv.enrollment?.section?.classGrade?.name || 'Unassigned';
      if (!classMap[clsName]) {
        classMap[clsName] = {
          className: clsName,
          totalDemand: 0,
          totalCollected: 0,
          totalOutstanding: 0,
          studentCount: 0,
          invoiceCount: 0,
        };
      }
      classMap[clsName].totalDemand += total;
      classMap[clsName].totalCollected += paid;
      classMap[clsName].totalOutstanding += outstanding;
      classMap[clsName].invoiceCount += 1;

      // Structure breakdown
      const structName = inv.feeStructure?.name || 'General Fee';
      if (!structureMap[structName]) {
        structureMap[structName] = {
          structureName: structName,
          totalDemand: 0,
          totalCollected: 0,
          totalOutstanding: 0,
          invoiceCount: 0,
        };
      }
      structureMap[structName].totalDemand += total;
      structureMap[structName].totalCollected += paid;
      structureMap[structName].totalOutstanding += outstanding;
      structureMap[structName].invoiceCount += 1;
    }

    const totalOutstanding = Math.max(0, totalDemand - totalCollected);
    const collectionRate = totalDemand > 0 ? ((totalCollected / totalDemand) * 100).toFixed(1) : '0.0';

    const classBreakdown = Object.values(classMap).sort((a, b) => b.totalDemand - a.totalDemand);
    const structureBreakdown = Object.values(structureMap).sort((a, b) => b.totalDemand - a.totalDemand);

    return res.json({
      summary: {
        totalDemand,
        totalCollected,
        totalOutstanding,
        collectionRate: parseFloat(collectionRate),
        totalInvoices: invoices.length,
        paidCount,
        partialCount,
        pendingCount,
        overdueCount,
      },
      classBreakdown,
      structureBreakdown,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


