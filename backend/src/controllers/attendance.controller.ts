import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AttendanceStatus } from '@prisma/client';
import { getTeacherClassScope } from '../lib/teacher-scope.js';

/**
 * Get daily attendance for a specific date and section (scoped to teacher's class if role is TEACHER)
 */
export async function getDailyAttendance(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { date, sectionId } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const scope = await getTeacherClassScope(tenantId, req.user?.userId || '', req.user?.role || '');
    const targetDate = date ? new Date(date as string) : new Date();
    // Normalize to date-only string YYYY-MM-DD
    const dateStr = targetDate.toISOString().split('T')[0];

    if (!scope.hasAccessToAll && scope.classGradeIds.length === 0 && scope.sectionIds.length === 0) {
      return res.json({ date: dateStr, records: [] });
    }

    const whereClause: any = {
      tenantId,
      date: new Date(dateStr),
    };

    if (sectionId) {
      if (!scope.hasAccessToAll) {
        const allowed = scope.sectionIds.includes(sectionId as string);
        if (!allowed) {
          const sec = await prisma.section.findUnique({
            where: { id: sectionId as string },
            select: { classGradeId: true },
          });
          if (!sec || !scope.classGradeIds.includes(sec.classGradeId)) {
            return res.status(403).json({ error: 'Access denied: You are only authorized to view attendance for your assigned class.' });
          }
        }
      }
      whereClause.enrollment = { sectionId: sectionId as string };
    } else if (!scope.hasAccessToAll) {
      whereClause.enrollment = {
        OR: [
          ...(scope.sectionIds.length > 0 ? [{ sectionId: { in: scope.sectionIds } }] : []),
          ...(scope.classGradeIds.length > 0 ? [{ section: { classGradeId: { in: scope.classGradeIds } } }] : []),
        ],
      };
    }

    // Fetch students with attendance on that day
    const records = await prisma.attendanceRecord.findMany({
      where: whereClause,
      include: {
        enrollment: {
          include: {
            student: true,
            section: { include: { classGrade: true } },
          },
        },
      },
    });

    return res.json({ date: dateStr, records });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Mark or Bulk Mark Attendance for Students (Teacher can only mark for their class)
 */
export async function markAttendance(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    const { date, records } = req.body;
    // records: [{ enrollmentId: string, status: "PRESENT"|"ABSENT"|"LATE"|"HALF_DAY", remarks?: string }]

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Attendance records array is required.' });
    }

    const scope = await getTeacherClassScope(tenantId, req.user?.userId || '', req.user?.role || '');
    if (!scope.hasAccessToAll) {
      if (scope.classGradeIds.length === 0 && scope.sectionIds.length === 0) {
        return res.status(403).json({ error: 'Access denied: You are not assigned to any class yet.' });
      }
      const enrollmentIds = records.map((r: any) => r.enrollmentId);
      const invalidEnrollment = await prisma.studentEnrollment.findFirst({
        where: {
          id: { in: enrollmentIds },
          tenantId,
          NOT: {
            OR: [
              ...(scope.sectionIds.length > 0 ? [{ sectionId: { in: scope.sectionIds } }] : []),
              ...(scope.classGradeIds.length > 0 ? [{ section: { classGradeId: { in: scope.classGradeIds } } }] : []),
            ],
          },
        },
      });
      if (invalidEnrollment) {
        return res.status(403).json({ error: 'Access denied: You can only take attendance for students in your assigned class.' });
      }
    }

    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];
    const isoDate = new Date(dateStr);

    const upsertPromises = records.map((r: any) =>
      prisma.attendanceRecord.upsert({
        where: {
          tenantId_enrollmentId_date: {
            tenantId,
            enrollmentId: r.enrollmentId,
            date: isoDate,
          },
        },
        create: {
          tenantId,
          enrollmentId: r.enrollmentId,
          date: isoDate,
          status: (r.status as AttendanceStatus) || AttendanceStatus.PRESENT,
          remarks: r.remarks || null,
          markedByUserId: userId || null,
        },
        update: {
          status: (r.status as AttendanceStatus) || AttendanceStatus.PRESENT,
          remarks: r.remarks || null,
          markedByUserId: userId || null,
        },
      })
    );

    const results = await prisma.$transaction(upsertPromises);

    return res.json({
      message: `Attendance marked successfully for ${results.length} students on ${dateStr}.`,
      count: results.length,
    });
  } catch (error: any) {
    console.error('Mark attendance error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Get monthly attendance matrix & percentage for students in school
 */
export async function getMonthlyAttendance(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { month, classGradeName } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const scope = await getTeacherClassScope(tenantId, req.user?.userId || '', req.user?.role || '');
    const currentYearMonth = month ? (month as string) : new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const [yearStr, monthStr] = currentYearMonth.split('-');
    const year = parseInt(yearStr);
    const monthNum = parseInt(monthStr);

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of month
    const totalDaysInMonth = endDate.getDate();

    if (!scope.hasAccessToAll && scope.classGradeIds.length === 0 && scope.sectionIds.length === 0) {
      return res.json({ month: currentYearMonth, totalDaysInMonth, students: [] });
    }

    const studentWhere: any = { tenantId };
    if (!scope.hasAccessToAll) {
      studentWhere.enrollments = {
        some: {
          OR: [
            ...(scope.sectionIds.length > 0 ? [{ sectionId: { in: scope.sectionIds } }] : []),
            ...(scope.classGradeIds.length > 0 ? [{ section: { classGradeId: { in: scope.classGradeIds } } }] : []),
          ],
        },
      };
    } else if (classGradeName && classGradeName !== 'ALL') {
      studentWhere.enrollments = {
        some: {
          section: { classGrade: { name: classGradeName as string } },
        },
      };
    }

    // Fetch enrolled students
    const students = await prisma.studentProfile.findMany({
      where: studentWhere,
      include: {
        enrollments: {
          include: {
            section: { include: { classGrade: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { firstName: 'asc' },
    });

    // Fetch all attendance records in this month
    const records = await prisma.attendanceRecord.findMany({
      where: {
        tenantId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Map records by enrollmentId
    const recordsByEnrollment: Record<string, Record<string, string>> = {};
    records.forEach((r) => {
      if (!recordsByEnrollment[r.enrollmentId]) {
        recordsByEnrollment[r.enrollmentId] = {};
      }
      const dayStr = r.date.toISOString().split('T')[0];
      recordsByEnrollment[r.enrollmentId][dayStr] = r.status;
    });

    const summaries = students.map((s) => {
      const enr = s.enrollments[0];
      const enrId = enr?.id || '';
      const studentDays = recordsByEnrollment[enrId] || {};

      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let totalRecorded = 0;

      Object.values(studentDays).forEach((st) => {
        totalRecorded++;
        if (st === 'PRESENT') presentCount++;
        else if (st === 'HALF_DAY') presentCount += 0.5;
        else if (st === 'ABSENT') absentCount++;
        else if (st === 'LATE') lateCount++;
      });

      const attendancePercentage = totalRecorded > 0 ? Math.round(((presentCount + lateCount) / totalRecorded) * 100) : 0;

      return {
        studentId: s.id,
        enrollmentId: enrId,
        admissionNumber: s.admissionNumber,
        fullName: `${s.firstName} ${s.lastName}`,
        className: enr?.section?.classGrade?.name || 'Class 6',
        sectionName: enr?.section?.name || 'A',
        totalRecorded,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage,
        dailyRecords: studentDays,
      };
    });

    return res.json({
      month: currentYearMonth,
      totalDaysInMonth,
      summaries,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Seed realistic monthly attendance data for all students in school
 */
export async function seedMonthlyAttendance(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { month } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const currentYearMonth = month || new Date().toISOString().slice(0, 7); // e.g. "2026-09"
    const [yearStr, monthStr] = currentYearMonth.split('-');
    const year = parseInt(yearStr);
    const monthNum = parseInt(monthStr);

    const endDate = new Date(year, monthNum, 0);
    const daysInMonth = endDate.getDate();

    // Get active enrollments
    const enrollments = await prisma.studentEnrollment.findMany({
      where: { tenantId },
    });

    if (enrollments.length === 0) {
      return res.status(400).json({ error: 'No enrolled students found in school to seed attendance.' });
    }

    const recordsToCreate: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const curDate = new Date(year, monthNum - 1, day);
      const dayOfWeek = curDate.getDay(); // 0 is Sunday

      // Skip Sundays
      if (dayOfWeek === 0) continue;

      const dateStr = curDate.toISOString().split('T')[0];
      const isoDate = new Date(dateStr);

      for (const enr of enrollments) {
        // Deterministic pseudo-randomness based on day and student
        const rand = (day * 13 + enr.id.charCodeAt(0) * 7) % 100;
        let status: AttendanceStatus = AttendanceStatus.PRESENT;
        if (rand < 5) status = AttendanceStatus.ABSENT;
        else if (rand < 9) status = AttendanceStatus.LATE;

        recordsToCreate.push({
          tenantId,
          enrollmentId: enr.id,
          date: isoDate,
          status,
        });
      }
    }

    // Upsert records
    for (const r of recordsToCreate) {
      await prisma.attendanceRecord.upsert({
        where: {
          tenantId_enrollmentId_date: {
            tenantId: r.tenantId,
            enrollmentId: r.enrollmentId,
            date: r.date,
          },
        },
        create: r,
        update: { status: r.status },
      });
    }

    return res.status(201).json({
      message: `Successfully generated ${recordsToCreate.length} attendance records for ${currentYearMonth}!`,
      count: recordsToCreate.length,
      month: currentYearMonth,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Reset / Delete daily attendance records for a specific date and section or class
 */
export async function resetAttendance(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { date, sectionId, classGradeName } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date is required to reset attendance.' });
    }

    const scope = await getTeacherClassScope(tenantId, req.user?.userId || '', req.user?.role || '');
    const targetDate = new Date(date);
    const dateStr = targetDate.toISOString().split('T')[0];
    const isoDate = new Date(dateStr);

    const whereClause: any = {
      tenantId,
      date: isoDate,
    };

    if (sectionId) {
      if (!scope.hasAccessToAll) {
        if (!scope.sectionIds.includes(sectionId)) {
          return res.status(403).json({ error: 'Access denied: You can only reset attendance for your assigned class.' });
        }
      }
      whereClause.enrollment = { sectionId };
    } else if (classGradeName && classGradeName !== 'ALL') {
      if (!scope.hasAccessToAll) {
        if (!scope.classGradeNames.includes(classGradeName)) {
          return res.status(403).json({ error: 'Access denied: You can only reset attendance for your assigned class.' });
        }
      }
      whereClause.enrollment = {
        section: { classGrade: { name: classGradeName } },
      };
    } else if (!scope.hasAccessToAll) {
      whereClause.enrollment = {
        OR: [
          ...(scope.sectionIds.length > 0 ? [{ sectionId: { in: scope.sectionIds } }] : []),
          ...(scope.classGradeIds.length > 0 ? [{ section: { classGradeId: { in: scope.classGradeIds } } }] : []),
        ],
      };
    }

    const deleted = await prisma.attendanceRecord.deleteMany({
      where: whereClause,
    });

    return res.json({
      message: `Successfully cleared attendance records for ${dateStr}. (${deleted.count} records removed)`,
      deletedCount: deleted.count,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


