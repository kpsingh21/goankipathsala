import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { Gender, EnrollmentStatus } from '@prisma/client';

/**
 * List all students enrolled in the school
 */
export async function listStudents(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const students = await prisma.studentProfile.findMany({
      where: { tenantId },
      include: {
        user: {
          select: { email: true, phone: true, status: true },
        },
        enrollments: {
          include: {
            academicYear: { select: { name: true, isCurrent: true } },
            section: {
              include: { classGrade: { select: { name: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ students });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Register a new Student (Creates Student User + Profile + Optional Enrollment)
 */
export async function registerStudent(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const {
      admissionNumber,
      firstName,
      lastName,
      avatarUrl,
      dob,
      gender,
      bloodGroup,
      aadharNumber,
      category,
      fatherName,
      motherName,
      parentPhone,
      guardianOccupation,
      villageCity,
      pincode,
      addressText,
      emergencyContact,
      email,
      phone,
      password,
      classGradeName,
      sectionName,
    } = req.body;

    if (!admissionNumber || !firstName || !lastName || !dob || !gender) {
      return res.status(400).json({
        error: 'Admission number, first name, last name, DOB, and gender are required.',
      });
    }

    // Check duplicate admission number
    const existing = await prisma.studentProfile.findUnique({
      where: {
        tenantId_admissionNumber: {
          tenantId,
          admissionNumber: admissionNumber.trim(),
        },
      },
    });

    if (existing) {
      return res.status(409).json({ error: `Student with admission number "${admissionNumber}" already exists.` });
    }

    const defaultPassword = password || 'student123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const studentRecord = await prisma.$transaction(async (tx) => {
      // 1. Create Student User Account
      const user = await tx.user.create({
        data: {
          tenantId,
          email: email ? email.trim().toLowerCase() : null,
          phone: (parentPhone || phone) ? (parentPhone || phone).trim() : null,
          passwordHash,
          role: 'STUDENT',
          status: 'ACTIVE',
        },
      });

      // 2. Create Student Profile with rich dossier particulars
      const profile = await tx.studentProfile.create({
        data: {
          tenantId,
          userId: user.id,
          admissionNumber: admissionNumber.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          avatarUrl: avatarUrl ? avatarUrl.trim() : null,
          dob: new Date(dob),
          gender: gender as Gender,
          bloodGroup: bloodGroup || null,
          aadharNumber: aadharNumber ? aadharNumber.trim() : null,
          category: category || 'GENERAL',
          fatherName: fatherName ? fatherName.trim() : null,
          motherName: motherName ? motherName.trim() : null,
          parentPhone: parentPhone ? parentPhone.trim() : null,
          guardianOccupation: guardianOccupation || null,
          villageCity: villageCity ? villageCity.trim() : null,
          pincode: pincode ? pincode.trim() : null,
          addressText: addressText ? addressText.trim() : null,
          emergencyContact: emergencyContact || parentPhone || null,
        },
      });

      // 3. Auto-create Academic Year and Class/Section if passed
      if (classGradeName && sectionName) {
        let academicYear = await tx.academicYear.findFirst({
          where: { tenantId, isCurrent: true },
        });

        if (!academicYear) {
          academicYear = await tx.academicYear.create({
            data: {
              tenantId,
              name: '2026-2027',
              startDate: new Date('2026-04-01'),
              endDate: new Date('2027-03-31'),
              isCurrent: true,
            },
          });
        }

        let classGrade = await tx.classGrade.findFirst({
          where: { tenantId, name: classGradeName.trim() },
        });
        if (!classGrade) {
          classGrade = await tx.classGrade.create({
            data: {
              tenantId,
              name: classGradeName.trim(),
              numericalOrder: 1,
            },
          });
        }

        let section = await tx.section.findFirst({
          where: { tenantId, classGradeId: classGrade.id, name: sectionName.trim() },
        });
        if (!section) {
          section = await tx.section.create({
            data: {
              tenantId,
              classGradeId: classGrade.id,
              name: sectionName.trim(),
            },
          });
        }

        await tx.studentEnrollment.create({
          data: {
            tenantId,
            studentId: profile.id,
            academicYearId: academicYear.id,
            sectionId: section.id,
            status: EnrollmentStatus.ENROLLED,
          },
        });
      }

      return profile;
    });

    return res.status(201).json({
      message: 'Student enrolled successfully',
      student: studentRecord,
    });
  } catch (error: any) {
    console.error('Register student error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Update an existing Student Profile
 */
export async function updateStudent(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    const id = req.params.id as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const student = await prisma.studentProfile.findFirst({
      where: { id, tenantId },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found in your school.' });
    }

    const {
      firstName,
      lastName,
      avatarUrl,
      dob,
      gender,
      bloodGroup,
      aadharNumber,
      category,
      fatherName,
      motherName,
      parentPhone,
      guardianOccupation,
      villageCity,
      pincode,
      addressText,
      classGradeName,
      sectionName,
    } = req.body;

    const updated = await prisma.$transaction(async (tx) => {
      const prof = await tx.studentProfile.update({
        where: { id: student.id },
        data: {
          firstName: firstName ? firstName.trim() : student.firstName,
          lastName: lastName ? lastName.trim() : student.lastName,
          avatarUrl: avatarUrl !== undefined ? avatarUrl : student.avatarUrl,
          dob: dob ? new Date(dob) : student.dob,
          gender: gender ? (gender as Gender) : student.gender,
          bloodGroup: bloodGroup !== undefined ? bloodGroup : student.bloodGroup,
          aadharNumber: aadharNumber !== undefined ? aadharNumber : student.aadharNumber,
          category: category !== undefined ? category : student.category,
          fatherName: fatherName !== undefined ? fatherName : student.fatherName,
          motherName: motherName !== undefined ? motherName : student.motherName,
          parentPhone: parentPhone !== undefined ? parentPhone : student.parentPhone,
          guardianOccupation: guardianOccupation !== undefined ? guardianOccupation : student.guardianOccupation,
          villageCity: villageCity !== undefined ? villageCity : student.villageCity,
          pincode: pincode !== undefined ? pincode : student.pincode,
          addressText: addressText !== undefined ? addressText : student.addressText,
        },
      });

      // Update enrollment section if provided
      if (classGradeName && sectionName) {
        let classGrade = await tx.classGrade.findFirst({
          where: { tenantId, name: classGradeName.trim() },
        });
        if (!classGrade) {
          classGrade = await tx.classGrade.create({
            data: { tenantId, name: classGradeName.trim(), numericalOrder: 1 },
          });
        }
        let section = await tx.section.findFirst({
          where: { tenantId, classGradeId: classGrade.id, name: sectionName.trim() },
        });
        if (!section) {
          section = await tx.section.create({
            data: { tenantId, classGradeId: classGrade.id, name: sectionName.trim() },
          });
        }

        const latestEnrollment = await tx.studentEnrollment.findFirst({
          where: { studentId: student.id, tenantId },
          orderBy: { createdAt: 'desc' },
        });
        if (latestEnrollment) {
          await tx.studentEnrollment.update({
            where: { id: latestEnrollment.id },
            data: { sectionId: section.id },
          });
        }
      }

      return prof;
    });

    return res.json({ message: 'Student particulars updated successfully', student: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a student record
 */
export async function deleteStudent(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    const id = req.params.id as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const student = await prisma.studentProfile.findFirst({
      where: { id, tenantId },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found in your school.' });
    }

    await prisma.$transaction(async (tx) => {
      // Find enrollments
      const enrollments = await tx.studentEnrollment.findMany({
        where: { studentId: student.id, tenantId },
        select: { id: true },
      });
      const enrollmentIds = enrollments.map((e) => e.id);

      // Clean up relations
      await tx.attendanceRecord.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      });
      await tx.examResult.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      });
      await tx.feeInvoice.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      });
      await tx.studentEnrollment.deleteMany({
        where: { studentId: student.id, tenantId },
      });
      await tx.studentProfile.delete({
        where: { id: student.id },
      });
      if (student.userId) {
        await tx.user.delete({
          where: { id: student.userId },
        });
      }
    });

    return res.json({ message: `Student ${student.firstName} ${student.lastName} removed.` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
