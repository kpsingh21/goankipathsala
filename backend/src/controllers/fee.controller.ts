import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { InvoiceStatus } from '@prisma/client';

/**
 * List all fee structures configured in the school
 */
export async function listFeeStructures(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const feeStructures = await prisma.feeStructure.findMany({
      where: { tenantId },
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

    // Ensure class grade exists
    const gradeName = classGradeName || 'Class 6';
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
        description: description || null,
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
    const { feeStructureId } = req.body;

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

    // Find all active enrollments for this class
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        section: { classGradeId: feeStructure.classGradeId },
      },
      include: {
        student: true,
        feeInvoices: {
          where: { feeStructureId: feeStructure.id },
        },
      },
    });

    if (enrollments.length === 0) {
      return res.status(400).json({ error: `No students enrolled in ${feeStructure.classGrade.name} yet.` });
    }

    const eligibleEnrollments = enrollments.filter(e => e.feeInvoices.length === 0);

    if (eligibleEnrollments.length === 0) {
      return res.status(200).json({
        message: 'All students in this class already have invoices generated for this fee structure.',
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
        });
      })
    );

    return res.status(201).json({
      message: `Successfully issued ${createdInvoices.length} invoices to ${feeStructure.classGrade.name}!`,
      generatedCount: createdInvoices.length,
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

    const invoices = await prisma.feeInvoice.findMany({
      where: { tenantId },
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
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const newPaidAmount = Number(invoice.paidAmount) + Number(paymentAmount);
    const total = Number(invoice.totalAmount);

    let newStatus = invoice.status;
    if (newPaidAmount >= total) {
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
    });

    return res.json({
      message: 'Payment recorded successfully',
      invoice: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
