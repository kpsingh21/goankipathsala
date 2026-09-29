import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * Get weekly timetable for a class grade
 */
export async function getTimetable(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    const { classGradeName } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const gradeName = (classGradeName as string) || 'Class 6';

    const classGrade = await prisma.classGrade.findFirst({
      where: { tenantId, name: gradeName },
    });

    if (!classGrade) {
      return res.json({ timetable: [] });
    }

    let entries = await prisma.timetableEntry.findMany({
      where: { tenantId, classGradeId: classGrade.id },
      include: {
        teacherUser: {
          select: {
            id: true,
            email: true,
            phone: true,
            staffProfile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
    });

    // If no entries exist yet, auto seed a standard weekly schedule
    if (entries.length === 0) {
      const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const periodTemplates = [
        { periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subjectName: 'Mathematics', teacherName: 'Suresh Kumar Verma', roomNumber: 'Room 101' },
        { periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subjectName: 'Science', teacherName: 'Meena Sharma', roomNumber: 'Room 101' },
        { periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subjectName: 'English', teacherName: 'Pooja Tiwari', roomNumber: 'Room 101' },
        { periodNumber: 4, startTime: '11:15 AM', endTime: '12:00 PM', subjectName: 'Social Studies', teacherName: 'Vikram Solanki', roomNumber: 'Room 101' },
        { periodNumber: 5, startTime: '12:00 PM', endTime: '12:45 PM', subjectName: 'Hindi', teacherName: 'Anil Rajput', roomNumber: 'Room 101' },
        { periodNumber: 6, startTime: '12:45 PM', endTime: '01:30 PM', subjectName: 'Computer Science', teacherName: 'Sunil Sen', roomNumber: 'Computer Lab' },
        { periodNumber: 7, startTime: '01:30 PM', endTime: '02:15 PM', subjectName: 'Sports / Library', teacherName: 'Physical Instructor', roomNumber: 'Playground' },
      ];

      for (const day of days) {
        for (const p of periodTemplates) {
          await prisma.timetableEntry.create({
            data: {
              tenantId,
              classGradeId: classGrade.id,
              dayOfWeek: day,
              periodNumber: p.periodNumber,
              startTime: p.startTime,
              endTime: p.endTime,
              subjectName: p.subjectName,
              teacherName: p.teacherName,
              roomNumber: p.roomNumber,
            },
          });
        }
      }

      entries = await prisma.timetableEntry.findMany({
        where: { tenantId, classGradeId: classGrade.id },
        include: {
          teacherUser: {
            select: {
              id: true,
              email: true,
              phone: true,
              staffProfile: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
      });
    }

    return res.json({ timetable: entries, classGrade });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Upsert a timetable entry slot
 */
export async function upsertTimetableEntry(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const {
      classGradeName,
      dayOfWeek,
      periodNumber,
      startTime,
      endTime,
      subjectName,
      teacherName,
      teacherUserId,
      roomNumber,
    } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!classGradeName || !dayOfWeek || !periodNumber || !subjectName) {
      return res.status(400).json({
        error: 'Class grade, day of week, period number, and subject name are required.',
      });
    }

    let resolvedTeacherName = teacherName ? teacherName.trim() : null;
    if (teacherUserId) {
      const teacher = await prisma.user.findFirst({
        where: { id: teacherUserId, tenantId },
        include: { staffProfile: true },
      });
      if (teacher) {
        resolvedTeacherName = teacher.staffProfile?.fullName || teacher.email?.split('@')[0] || resolvedTeacherName;
      }
    }

    let classGrade = await prisma.classGrade.findFirst({
      where: { tenantId, name: classGradeName },
    });
    if (!classGrade) {
      classGrade = await prisma.classGrade.create({
        data: {
          tenantId,
          name: classGradeName,
          numericalOrder: 1,
        },
      });
    }

    const entry = await prisma.timetableEntry.upsert({
      where: {
        tenantId_classGradeId_dayOfWeek_periodNumber: {
          tenantId,
          classGradeId: classGrade.id,
          dayOfWeek,
          periodNumber: parseInt(periodNumber),
        },
      },
      create: {
        tenantId,
        classGradeId: classGrade.id,
        dayOfWeek,
        periodNumber: parseInt(periodNumber),
        startTime: startTime || '08:30 AM',
        endTime: endTime || '09:15 AM',
        subjectName: subjectName.trim(),
        teacherName: resolvedTeacherName,
        teacherUserId: teacherUserId || null,
        roomNumber: roomNumber ? roomNumber.trim() : 'Room 101',
      },
      update: {
        startTime: startTime || '08:30 AM',
        endTime: endTime || '09:15 AM',
        subjectName: subjectName.trim(),
        teacherName: resolvedTeacherName,
        teacherUserId: teacherUserId !== undefined ? (teacherUserId || null) : undefined,
        roomNumber: roomNumber ? roomNumber.trim() : 'Room 101',
      },
      include: {
        teacherUser: {
          select: {
            id: true,
            email: true,
            phone: true,
            staffProfile: { select: { fullName: true } },
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Timetable period updated successfully',
      entry,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
