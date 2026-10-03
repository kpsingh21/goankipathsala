import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma.js';

const PAYROLL_DATA_DIR = path.resolve(process.cwd(), 'data', 'payroll');

function ensurePayrollDir() {
  if (!fs.existsSync(PAYROLL_DATA_DIR)) {
    fs.mkdirSync(PAYROLL_DATA_DIR, { recursive: true });
  }
}

function readTenantPayrollFile(slug: string): any {
  try {
    ensurePayrollDir();
    const filePath = path.join(PAYROLL_DATA_DIR, `${slug}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading payroll file:', err);
  }
  return { salaryStructures: {}, monthlyRuns: [] };
}

function writeTenantPayrollFile(slug: string, data: any) {
  try {
    ensurePayrollDir();
    const filePath = path.join(PAYROLL_DATA_DIR, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing payroll file:', err);
  }
}

function getDefaultSalaryForRole(role?: string): { base: number; hra: number; da: number; pf: number } {
  switch (role) {
    case 'PRINCIPAL':
      return { base: 45000, hra: 9000, da: 4500, pf: 5400 };
    case 'SCHOOL_ADMIN':
    case 'ADMIN':
      return { base: 35000, hra: 7000, da: 3500, pf: 4200 };
    case 'ACCOUNTANT':
      return { base: 25000, hra: 5000, da: 2500, pf: 3000 };
    case 'TEACHER':
    case 'CLASS_TEACHER':
    case 'SUBJECT_TEACHER':
      return { base: 24000, hra: 4800, da: 2400, pf: 2880 };
    case 'DRIVER':
      return { base: 16000, hra: 3200, da: 1600, pf: 1920 };
    default:
      return { base: 20000, hra: 4000, da: 2000, pf: 2400 };
  }
}

/**
 * School: Fetch all staff and their configured salary structures
 */
export async function getStaffSalaryStructures(req: Request, res: Response) {
  try {
    const tenantId = (req as any).user?.tenantId || (req.query.tenantId as string);
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant context required.' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        staffProfiles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const existingSettings = (tenant.settings as Record<string, any>) || {};
    const payrollSettings = existingSettings.payroll || readTenantPayrollFile(tenant.slug);
    const structures = payrollSettings.salaryStructures || {};

    const staffWithSalary = tenant.staffProfiles.map((staff) => {
      const existing = structures[staff.id] || structures[staff.userId] || null;
      const def = getDefaultSalaryForRole(staff.user?.role);

      const baseSalary = existing ? Number(existing.baseSalary || 0) : def.base;
      const hra = existing ? Number(existing.hra || 0) : def.hra;
      const da = existing ? Number(existing.da || 0) : def.da;
      const travelAllowance = existing ? Number(existing.travelAllowance || 0) : 1000;
      const specialAllowance = existing ? Number(existing.specialAllowance || 0) : 500;
      const pfDeduction = existing ? Number(existing.pfDeduction || 0) : def.pf;
      const taxDeduction = existing ? Number(existing.taxDeduction || 0) : 200;

      const grossSalary = baseSalary + hra + da + travelAllowance + specialAllowance;
      const totalDeductions = pfDeduction + taxDeduction;
      const netSalary = Math.max(0, grossSalary - totalDeductions);

      return {
        id: staff.id,
        userId: staff.userId,
        fullName: staff.fullName,
        designation: staff.designation || 'Staff',
        department: staff.department || 'General',
        role: staff.user?.role || 'TEACHER',
        email: staff.user?.email || null,
        phone: staff.user?.phone || null,
        status: staff.user?.status || 'ACTIVE',
        joiningDate: staff.joiningDate || null,
        salaryStructure: {
          baseSalary,
          hra,
          da,
          travelAllowance,
          specialAllowance,
          pfDeduction,
          taxDeduction,
          grossSalary,
          totalDeductions,
          netSalary,
          paymentMode: existing?.paymentMode || 'BANK_TRANSFER',
          bankAccountNo: existing?.bankAccountNo || '',
          bankIfsc: existing?.bankIfsc || '',
          panNumber: existing?.panNumber || '',
          isCustomized: !!existing,
        },
      };
    });

    return res.json({
      success: true,
      staff: staffWithSalary,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch staff salary structures.' });
  }
}

/**
 * School: Update or configure salary structure for a specific staff member
 */
export async function updateStaffSalaryStructure(req: Request, res: Response) {
  try {
    const tenantId = (req as any).user?.tenantId;
    const staffId = req.params.staffId as string;
    const structureData = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant context required.' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const existingSettings = (tenant.settings as Record<string, any>) || {};
    const payroll = existingSettings.payroll || readTenantPayrollFile(tenant.slug);
    const structures = payroll.salaryStructures || {};

    structures[staffId] = {
      baseSalary: Number(structureData.baseSalary || 0),
      hra: Number(structureData.hra || 0),
      da: Number(structureData.da || 0),
      travelAllowance: Number(structureData.travelAllowance || 0),
      specialAllowance: Number(structureData.specialAllowance || 0),
      pfDeduction: Number(structureData.pfDeduction || 0),
      taxDeduction: Number(structureData.taxDeduction || 0),
      paymentMode: structureData.paymentMode || 'BANK_TRANSFER',
      bankAccountNo: structureData.bankAccountNo ? String(structureData.bankAccountNo).trim() : '',
      bankIfsc: structureData.bankIfsc ? String(structureData.bankIfsc).trim().toUpperCase() : '',
      panNumber: structureData.panNumber ? String(structureData.panNumber).trim().toUpperCase() : '',
      updatedAt: new Date().toISOString(),
    };

    payroll.salaryStructures = structures;

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        settings: {
          ...existingSettings,
          payroll,
        },
      },
    });

    writeTenantPayrollFile(tenant.slug, payroll);

    return res.json({
      success: true,
      message: 'Staff salary structure configured successfully.',
      structure: structures[staffId],
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update salary structure.' });
  }
}

/**
 * School: Fetch monthly payroll runs and summary
 */
export async function getMonthlyPayrollRuns(req: Request, res: Response) {
  try {
    const tenantId = (req as any).user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant context required.' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const existingSettings = (tenant.settings as Record<string, any>) || {};
    const payroll = existingSettings.payroll || readTenantPayrollFile(tenant.slug);
    const runs = payroll.monthlyRuns || [];

    return res.json({
      success: true,
      runs,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch payroll runs.' });
  }
}

/**
 * School: Generate or recalculate payroll run for a specific month
 */
export async function generateMonthlyPayroll(req: Request, res: Response) {
  try {
    const tenantId = (req as any).user?.tenantId;
    const { month } = req.body; // e.g. "2026-10"

    if (!tenantId || !month) {
      return res.status(400).json({ error: 'Tenant and target month (YYYY-MM) are required.' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        staffProfiles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const existingSettings = (tenant.settings as Record<string, any>) || {};
    const payroll = existingSettings.payroll || readTenantPayrollFile(tenant.slug);
    const structures = payroll.salaryStructures || {};
    const runs: any[] = payroll.monthlyRuns || [];

    // Parse month display label
    const [yearStr, monthStr] = month.split('-');
    const dateObj = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
    const monthLabel = dateObj.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    // Existing run for this month? Keep existing payment status if present
    const existingRunIndex = runs.findIndex((r) => r.month === month);
    const existingPayslipsMap = new Map();
    if (existingRunIndex !== -1 && Array.isArray(runs[existingRunIndex].payslips)) {
      runs[existingRunIndex].payslips.forEach((ps: any) => {
        existingPayslipsMap.set(ps.staffId, ps);
      });
    }

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    let paidCount = 0;

    const payslips = tenant.staffProfiles.map((staff) => {
      const existingStructure = structures[staff.id] || structures[staff.userId] || null;
      const def = getDefaultSalaryForRole(staff.user?.role);

      const baseSalary = existingStructure ? Number(existingStructure.baseSalary || 0) : def.base;
      const hra = existingStructure ? Number(existingStructure.hra || 0) : def.hra;
      const da = existingStructure ? Number(existingStructure.da || 0) : def.da;
      const travelAllowance = existingStructure ? Number(existingStructure.travelAllowance || 0) : 1000;
      const specialAllowance = existingStructure ? Number(existingStructure.specialAllowance || 0) : 500;
      const pfDeduction = existingStructure ? Number(existingStructure.pfDeduction || 0) : def.pf;
      const taxDeduction = existingStructure ? Number(existingStructure.taxDeduction || 0) : 200;

      const grossSalary = baseSalary + hra + da + travelAllowance + specialAllowance;
      const deductions = pfDeduction + taxDeduction;
      const netSalary = Math.max(0, grossSalary - deductions);

      totalGross += grossSalary;
      totalDeductions += deductions;
      totalNet += netSalary;

      // Check if previous payment was recorded
      const prevSlip = existingPayslipsMap.get(staff.id);
      const isPaid = prevSlip?.paymentStatus === 'PAID';
      if (isPaid) paidCount++;

      return {
        id: `slip_${month.replace('-', '')}_${staff.id.substring(0, 8)}`,
        staffId: staff.id,
        userId: staff.userId,
        staffName: staff.fullName,
        role: staff.user?.role || 'TEACHER',
        designation: staff.designation || 'Staff',
        department: staff.department || 'General',
        month,
        monthLabel,
        baseSalary,
        allowances: {
          hra,
          da,
          travel: travelAllowance,
          special: specialAllowance,
        },
        deductions: {
          pf: pfDeduction,
          tax: taxDeduction,
          unpaidLeaves: 0,
        },
        grossSalary,
        totalDeductions: deductions,
        netSalary,
        paymentStatus: isPaid ? 'PAID' : 'UNPAID',
        paymentMode: prevSlip?.paymentMode || existingStructure?.paymentMode || 'BANK_TRANSFER',
        paymentDate: prevSlip?.paymentDate || null,
        transactionRef: prevSlip?.transactionRef || null,
        bankAccountNo: existingStructure?.bankAccountNo || '',
        bankIfsc: existingStructure?.bankIfsc || '',
        panNumber: existingStructure?.panNumber || '',
        remarks: prevSlip?.remarks || '',
      };
    });

    const runStatus =
      paidCount === payslips.length && payslips.length > 0
        ? 'PAID'
        : paidCount > 0
        ? 'PARTIALLY_PAID'
        : 'GENERATED';

    const newRun = {
      id: `run_${month.replace('-', '_')}`,
      month,
      monthLabel,
      generatedAt: new Date().toISOString(),
      staffCount: payslips.length,
      totalGross,
      totalDeductions,
      totalNet,
      paidCount,
      unpaidCount: payslips.length - paidCount,
      status: runStatus,
      payslips,
    };

    if (existingRunIndex !== -1) {
      runs[existingRunIndex] = newRun;
    } else {
      runs.unshift(newRun);
    }

    payroll.monthlyRuns = runs;

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        settings: {
          ...existingSettings,
          payroll,
        },
      },
    });

    writeTenantPayrollFile(tenant.slug, payroll);

    return res.status(201).json({
      success: true,
      message: `Payroll for ${monthLabel} calculated successfully for ${payslips.length} staff members.`,
      run: newRun,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to generate payroll run.' });
  }
}

/**
 * School: Mark payslip payment status (PAID/UNPAID) with payment details
 */
export async function updatePayslipPaymentStatus(req: Request, res: Response) {
  try {
    const tenantId = (req as any).user?.tenantId;
    const payslipId = req.params.payslipId as string;
    const { paymentStatus, paymentMode, transactionRef, paymentDate, remarks } = req.body;

    if (!tenantId || !payslipId) {
      return res.status(400).json({ error: 'Tenant and payslip ID are required.' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const existingSettings = (tenant.settings as Record<string, any>) || {};
    const payroll = existingSettings.payroll || readTenantPayrollFile(tenant.slug);
    const runs: any[] = payroll.monthlyRuns || [];

    let updatedSlip: any = null;

    for (const run of runs) {
      if (Array.isArray(run.payslips)) {
        const slip = run.payslips.find((p: any) => p.id === payslipId);
        if (slip) {
          slip.paymentStatus = paymentStatus || slip.paymentStatus;
          slip.paymentMode = paymentMode || slip.paymentMode;
          slip.transactionRef = transactionRef !== undefined ? transactionRef : slip.transactionRef;
          slip.paymentDate = paymentDate || (paymentStatus === 'PAID' ? new Date().toISOString().split('T')[0] : null);
          slip.remarks = remarks !== undefined ? remarks : slip.remarks;
          slip.updatedAt = new Date().toISOString();

          // Recalculate run counters
          const paid = run.payslips.filter((p: any) => p.paymentStatus === 'PAID').length;
          run.paidCount = paid;
          run.unpaidCount = run.payslips.length - paid;
          run.status = paid === run.payslips.length ? 'PAID' : paid > 0 ? 'PARTIALLY_PAID' : 'GENERATED';

          updatedSlip = slip;
          break;
        }
      }
    }

    if (!updatedSlip) {
      return res.status(404).json({ error: 'Payslip not found.' });
    }

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        settings: {
          ...existingSettings,
          payroll,
        },
      },
    });

    writeTenantPayrollFile(tenant.slug, payroll);

    return res.json({
      success: true,
      message: 'Payslip payment status updated successfully.',
      payslip: updatedSlip,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update payslip.' });
  }
}

// -------------------------------------------------------------------------
// Super Admin Multi-Tenant Payroll Oversight Endpoints
// -------------------------------------------------------------------------

/**
 * Super Admin: High-level institutional payroll summary across all partner schools
 */
export async function getPlatformPayrollOverview(req: Request, res: Response) {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: {
              where: {
                role: { in: ['SCHOOL_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'SUBJECT_TEACHER', 'ACCOUNTANT', 'DRIVER'] },
              },
            },
            staffProfiles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalStaffAcrossAllSchools = 0;
    let totalMonthlyBudget = 0;
    let totalDisbursedAmount = 0;
    let totalPendingAmount = 0;

    const schoolSummaries = tenants.map((tenant) => {
      const existingSettings = (tenant.settings as Record<string, any>) || {};
      const payroll = existingSettings.payroll || readTenantPayrollFile(tenant.slug);
      const runs = payroll.monthlyRuns || [];
      const latestRun = runs[0] || null;

      const staffCount = tenant._count.staffProfiles || tenant._count.users || 0;
      totalStaffAcrossAllSchools += staffCount;

      let monthlyTotal = 0;
      let disbursed = 0;
      let pending = 0;
      let status = 'NO_RUN';

      if (latestRun) {
        monthlyTotal = Number(latestRun.totalNet || 0);
        status = latestRun.status;
        const paidCount = Number(latestRun.paidCount || 0);
        const totalCount = Number(latestRun.staffCount || 1);
        disbursed = Math.round((paidCount / totalCount) * monthlyTotal);
        pending = monthlyTotal - disbursed;
      } else {
        // Estimated budget based on 22,000 avg staff salary
        monthlyTotal = staffCount * 22000;
        pending = monthlyTotal;
      }

      totalMonthlyBudget += monthlyTotal;
      totalDisbursedAmount += disbursed;
      totalPendingAmount += pending;

      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        staffCount,
        monthlyPayrollBudget: monthlyTotal,
        disbursedAmount: disbursed,
        pendingAmount: pending,
        latestRunMonth: latestRun?.monthLabel || 'Not Generated',
        status,
        lastDisbursedDate: latestRun?.generatedAt || null,
        runsCount: runs.length,
      };
    });

    return res.json({
      success: true,
      summary: {
        totalSchools: tenants.length,
        totalStaff: totalStaffAcrossAllSchools,
        totalMonthlyBudget,
        totalDisbursed: totalDisbursedAmount,
        totalPending: totalPendingAmount,
      },
      schools: schoolSummaries,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch platform payroll overview.' });
  }
}

/**
 * Super Admin: Drill-down into a specific school's complete payroll ledger
 */
export async function getPlatformSchoolPayroll(req: Request, res: Response) {
  try {
    const tenantId = req.params.tenantId as string;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        staffProfiles: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const existingSettings = (tenant.settings as Record<string, any>) || {};
    const payroll = existingSettings.payroll || readTenantPayrollFile(tenant.slug);

    return res.json({
      success: true,
      school: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
      },
      payroll,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch school payroll details.' });
  }
}
