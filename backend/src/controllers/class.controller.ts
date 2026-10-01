import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const DEFAULT_CLASSES = [
  { name: 'Pre-KG', numericalOrder: -3 },
  { name: 'Nursery', numericalOrder: -2 },
  { name: 'LKG', numericalOrder: -1 },
  { name: 'UKG', numericalOrder: 0 },
  { name: 'Class 1', numericalOrder: 1 },
  { name: 'Class 2', numericalOrder: 2 },
  { name: 'Class 3', numericalOrder: 3 },
  { name: 'Class 4', numericalOrder: 4 },
  { name: 'Class 5', numericalOrder: 5 },
  { name: 'Class 6', numericalOrder: 6 },
  { name: 'Class 7', numericalOrder: 7 },
  { name: 'Class 8', numericalOrder: 8 },
  { name: 'Class 9', numericalOrder: 9 },
  { name: 'Class 10', numericalOrder: 10 },
  { name: 'Class 11', numericalOrder: 11 },
  { name: 'Class 12', numericalOrder: 12 },
];

/**
 * List all classes for current school tenant with counts of sections, students, and subjects
 */
export async function listClasses(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    let classes = await prisma.classGrade.findMany({
      where: { tenantId },
      include: {
        sections: {
          select: {
            id: true,
            name: true,
            _count: { select: { enrollments: true } },
          },
        },
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { numericalOrder: 'asc' },
    });

    // If tenant has no classes or only 1, auto-seed standard kindergarten + grades 1-12
    if (classes.length <= 1) {
      for (const item of DEFAULT_CLASSES) {
        const existing = await prisma.classGrade.findFirst({
          where: { tenantId, name: item.name },
        });
        if (!existing) {
          const createdClass = await prisma.classGrade.create({
            data: {
              tenantId,
              name: item.name,
              numericalOrder: item.numericalOrder,
            },
          });
          // Auto create Section A
          await prisma.section.create({
            data: {
              tenantId,
              classGradeId: createdClass.id,
              name: 'Section A',
            },
          });
        }
      }

      classes = await prisma.classGrade.findMany({
        where: { tenantId },
        include: {
          sections: {
            select: {
              id: true,
              name: true,
              _count: { select: { enrollments: true } },
            },
          },
          subjects: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { numericalOrder: 'asc' },
      });
    }

    const formattedClasses = classes.map((c) => {
      const studentCount = c.sections.reduce((sum, s) => sum + s._count.enrollments, 0);
      return {
        id: c.id,
        name: c.name,
        numericalOrder: c.numericalOrder,
        sectionsCount: c.sections.length,
        subjectsCount: c.subjects.length,
        studentCount,
        sections: c.sections.map((s) => ({ id: s.id, name: s.name, studentCount: s._count.enrollments })),
        subjects: c.subjects.map((sub) => sub.name),
        subjectList: c.subjects.map((sub) => ({ id: sub.id, name: sub.name })),
      };
    });

    return res.json({ classes: formattedClasses });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Create a new class / grade
 */
export async function createClass(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const { name, numericalOrder } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Class name is required (e.g. "Pre-KG", "Class 7").' });
    }

    const cleanName = name.trim();
    const existing = await prisma.classGrade.findUnique({
      where: {
        tenantId_name: {
          tenantId,
          name: cleanName,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ error: `Class "${cleanName}" already exists in this school.` });
    }

    const newClass = await prisma.classGrade.create({
      data: {
        tenantId,
        name: cleanName,
        numericalOrder: numericalOrder !== undefined ? parseInt(numericalOrder) : 10,
      },
    });

    // Create default Section A
    await prisma.section.create({
      data: {
        tenantId,
        classGradeId: newClass.id,
        name: 'Section A',
      },
    });

    return res.status(201).json({
      message: `Class "${cleanName}" created successfully with Section A`,
      classGrade: newClass,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Edit an existing class
 */
export async function updateClass(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const id = req.params.id as string;
    const { name, numericalOrder } = req.body;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Tenant context and Class ID required.' });
    }

    const existing = await prisma.classGrade.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Class grade not found.' });
    }

    const updated = await prisma.classGrade.update({
      where: { id: existing.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(numericalOrder !== undefined && { numericalOrder: parseInt(numericalOrder) }),
      },
    });

    return res.json({
      message: 'Class updated successfully',
      classGrade: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a class
 */
export async function deleteClass(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const id = req.params.id as string;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Tenant context and Class ID required.' });
    }

    const existing = await prisma.classGrade.findFirst({
      where: { id, tenantId },
      include: {
        sections: {
          include: {
            _count: { select: { enrollments: true } },
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Class grade not found.' });
    }

    const totalStudents = existing.sections.reduce((sum, s) => sum + s._count.enrollments, 0);
    if (totalStudents > 0) {
      return res.status(400).json({
        error: `Cannot delete class "${existing.name}" because it currently has ${totalStudents} enrolled student(s). Reassign or transfer them first.`,
      });
    }

    // Cascade delete sections, timetable, subjects for this class
    await prisma.$transaction([
      prisma.timetableEntry.deleteMany({ where: { classGradeId: existing.id, tenantId } }),
      prisma.curriculumSubject.deleteMany({ where: { classGradeId: existing.id, tenantId } }),
      prisma.section.deleteMany({ where: { classGradeId: existing.id, tenantId } }),
      prisma.classGrade.delete({ where: { id: existing.id } }),
    ]);

    return res.json({
      message: `Class "${existing.name}" deleted successfully`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
