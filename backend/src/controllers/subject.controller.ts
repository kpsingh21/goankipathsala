import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * List curriculum subjects by class grade with assigned teachers
 */
export async function listSubjects(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    const { classGradeName } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const whereClause: any = { tenantId };
    if (classGradeName && classGradeName !== 'ALL') {
      whereClause.classGrade = { name: classGradeName as string };
    }

    let subjects = await prisma.curriculumSubject.findMany({
      where: whereClause,
      include: {
        classGrade: { select: { id: true, name: true } },
        teacher: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            staffProfile: {
              select: {
                fullName: true,
                designation: true,
                qualification: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // If no subjects found for Class 6, auto-seed standard subjects
    if (subjects.length === 0 && (!classGradeName || classGradeName === 'Class 6')) {
      let classGrade = await prisma.classGrade.findFirst({
        where: { tenantId, name: 'Class 6' },
      });
      if (!classGrade) {
        classGrade = await prisma.classGrade.create({
          data: {
            tenantId,
            name: 'Class 6',
            numericalOrder: 6,
          },
        });
      }

      // Check if we have teachers to map
      const teachers = await prisma.user.findMany({
        where: { tenantId, role: 'TEACHER' },
      });

      const standardSubjects = [
        'Mathematics',
        'Science',
        'Social Studies',
        'English',
        'Hindi',
        'Sanskrit',
        'Computer Science',
        'Physical Education',
      ];

      for (let i = 0; i < standardSubjects.length; i++) {
        const subName = standardSubjects[i];
        const assignedTeacher = teachers[i % teachers.length];
        await prisma.curriculumSubject.create({
          data: {
            tenantId,
            classGradeId: classGrade.id,
            name: subName,
            board: 'CBSE / State Board',
            teacherId: assignedTeacher ? assignedTeacher.id : null,
          },
        });
      }

      subjects = await prisma.curriculumSubject.findMany({
        where: whereClause,
        include: {
          classGrade: { select: { id: true, name: true } },
          teacher: {
            select: {
              id: true,
              email: true,
              phone: true,
              role: true,
              staffProfile: {
                select: {
                  fullName: true,
                  designation: true,
                  qualification: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    }

    return res.json({ subjects });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Assign or reassign a teacher to a subject
 */
export async function assignSubjectTeacher(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { subjectId, teacherId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!subjectId) {
      return res.status(400).json({ error: 'Subject ID is required.' });
    }

    const subject = await prisma.curriculumSubject.findFirst({
      where: { id: subjectId, tenantId },
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    if (teacherId) {
      const teacher = await prisma.user.findFirst({
        where: { id: teacherId, tenantId },
      });
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found in your school.' });
      }
    }

    const updated = await prisma.curriculumSubject.update({
      where: { id: subject.id },
      data: { teacherId: teacherId || null },
      include: {
        classGrade: true,
        teacher: {
          include: { staffProfile: true },
        },
      },
    });

    return res.json({
      message: 'Subject teacher assigned successfully!',
      subject: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Create a new subject for a class grade
 */
export async function createSubject(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { name, classGradeName, board, teacherId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!name || !classGradeName) {
      return res.status(400).json({ error: 'Subject name and class grade are required.' });
    }

    let classGrade = await prisma.classGrade.findFirst({
      where: { tenantId, name: classGradeName.trim() },
    });
    if (!classGrade) {
      classGrade = await prisma.classGrade.create({
        data: {
          tenantId,
          name: classGradeName.trim(),
          numericalOrder: 1,
        },
      });
    }

    const existing = await prisma.curriculumSubject.findUnique({
      where: {
        tenantId_classGradeId_name: {
          tenantId,
          classGradeId: classGrade.id,
          name: name.trim(),
        },
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'Subject already exists for this class grade.' });
    }

    const subject = await prisma.curriculumSubject.create({
      data: {
        tenantId,
        classGradeId: classGrade.id,
        name: name.trim(),
        board: board || 'CBSE',
        teacherId: teacherId || null,
      },
      include: {
        classGrade: true,
        teacher: { include: { staffProfile: true } },
      },
    });

    return res.status(201).json({
      message: 'Subject created successfully',
      subject,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Update subject details
 */
export async function updateSubject(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { name, board, teacherId } = req.body;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Subject ID and tenant context required.' });
    }

    const existing = await prisma.curriculumSubject.findFirst({
      where: { id: id as string, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    const updated = await prisma.curriculumSubject.update({
      where: { id: existing.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(board && { board: board.trim() }),
        ...(teacherId !== undefined && { teacherId: teacherId || null }),
      },
      include: {
        classGrade: true,
        teacher: { include: { staffProfile: true } },
      },
    });

    return res.json({
      message: 'Subject updated successfully!',
      subject: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a curriculum subject
 */
export async function deleteSubject(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { classGradeName, classGradeId, name } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant context required.' });
    }

    let existing = null;
    if (id && id !== 'by-name' && id !== 'undefined') {
      existing = await prisma.curriculumSubject.findFirst({
        where: { id: id as string, tenantId },
      });
    }

    if (!existing && (classGradeName || classGradeId) && name) {
      existing = await prisma.curriculumSubject.findFirst({
        where: {
          tenantId,
          name: (name as string).trim(),
          ...(classGradeId
            ? { classGradeId: classGradeId as string }
            : { classGrade: { name: (classGradeName as string).trim() } }),
        },
      });
    }

    if (!existing) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    await prisma.curriculumSubject.delete({ where: { id: existing.id } });

    return res.json({ message: `Subject "${existing.name}" deleted successfully` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

