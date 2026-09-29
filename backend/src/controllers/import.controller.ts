import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { Gender, UserRole, EnrollmentStatus } from '@prisma/client';

/**
 * Bulk Import Students via JSON or parsed spreadsheet rows
 */
export async function bulkImportStudents(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const rows = Array.isArray(req.body.students) ? req.body.students : req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of student records to import.' });
    }

    if (rows.length > 500) {
      return res.status(400).json({ error: 'Maximum 500 students can be imported in a single batch.' });
    }

    // Pre-fetch existing admission numbers in this school to avoid duplicates
    const admissionNumbers = rows
      .map((r: any) => (r.admissionNumber ? String(r.admissionNumber).trim() : ''))
      .filter(Boolean);

    const existingStudents = await prisma.studentProfile.findMany({
      where: {
        tenantId,
        admissionNumber: { in: admissionNumbers },
      },
      select: { admissionNumber: true },
    });
    const existingSet = new Set(existingStudents.map((s) => s.admissionNumber.toLowerCase()));

    // Get current Academic Year
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

    // Cache class grades and sections for quick ID lookup
    const existingClasses = await prisma.classGrade.findMany({
      where: { tenantId },
      include: { sections: true },
    });
    const classMap = new Map<string, { id: string; sections: Map<string, string> }>();
    for (const cg of existingClasses) {
      const secMap = new Map<string, string>();
      for (const s of cg.sections) {
        secMap.set(s.name.toUpperCase(), s.id);
      }
      classMap.set(cg.name.toLowerCase().trim(), { id: cg.id, sections: secMap });
    }

    const defaultPasswordHash = await bcrypt.hash('student123', 10);
    const errors: Array<{ row: number; admissionNumber?: string; name?: string; reason: string }> = [];
    let importedCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      const admissionNumber = row.admissionNumber ? String(row.admissionNumber).trim() : '';
      const firstName = row.firstName ? String(row.firstName).trim() : '';
      const lastName = row.lastName ? String(row.lastName).trim() : '';

      if (!admissionNumber) {
        errors.push({ row: rowNum, reason: 'Missing Admission Number' });
        continue;
      }
      if (!firstName) {
        errors.push({ row: rowNum, admissionNumber, reason: 'Missing First Name' });
        continue;
      }

      if (existingSet.has(admissionNumber.toLowerCase())) {
        errors.push({
          row: rowNum,
          admissionNumber,
          name: `${firstName} ${lastName}`.trim(),
          reason: `Admission number "${admissionNumber}" already exists in this school`,
        });
        continue;
      }

      // Parse DOB safely
      let dob = new Date('2015-01-01');
      if (row.dob) {
        const parsed = new Date(row.dob);
        if (!isNaN(parsed.getTime())) {
          dob = parsed;
        }
      }

      // Parse Gender
      let gender: Gender = Gender.MALE;
      const rawGender = String(row.gender || '').toUpperCase().trim();
      if (rawGender.startsWith('F')) gender = Gender.FEMALE;
      else if (rawGender.startsWith('O')) gender = Gender.OTHER;

      // Class and Section resolution
      const rawClassName = row.classGradeName || row.classGrade || row.class || 'Class 1';
      const cleanClassName = String(rawClassName).trim();
      const rawSecName = row.sectionName || row.section || 'A';
      const cleanSecName = String(rawSecName).trim().toUpperCase();

      let classInfo = classMap.get(cleanClassName.toLowerCase());
      if (!classInfo) {
        const newClass = await prisma.classGrade.create({
          data: {
            tenantId,
            name: cleanClassName,
            numericalOrder: 1,
          },
        });
        classInfo = { id: newClass.id, sections: new Map() };
        classMap.set(cleanClassName.toLowerCase(), classInfo);
      }

      let sectionId = classInfo.sections.get(cleanSecName);
      if (!sectionId) {
        const newSection = await prisma.section.create({
          data: {
            tenantId,
            classGradeId: classInfo.id,
            name: cleanSecName,
            capacity: 50,
          },
        });
        sectionId = newSection.id;
        classInfo.sections.set(cleanSecName, sectionId);
      }

      const email = row.email ? String(row.email).trim().toLowerCase() : null;
      const phone = row.parentPhone || row.phone ? String(row.parentPhone || row.phone).trim() : null;

      try {
        await prisma.$transaction(async (tx) => {
          // Create User
          const user = await tx.user.create({
            data: {
              tenantId,
              email: email || null,
              phone: phone || null,
              passwordHash: defaultPasswordHash,
              role: 'STUDENT',
              status: 'ACTIVE',
            },
          });

          // Create Student Profile
          const profile = await tx.studentProfile.create({
            data: {
              tenantId,
              userId: user.id,
              admissionNumber,
              firstName,
              lastName,
              dob,
              gender,
              bloodGroup: row.bloodGroup ? String(row.bloodGroup).trim() : null,
              aadharNumber: row.aadharNumber ? String(row.aadharNumber).trim() : null,
              category: row.category ? String(row.category).trim() : 'GENERAL',
              fatherName: row.fatherName ? String(row.fatherName).trim() : null,
              motherName: row.motherName ? String(row.motherName).trim() : null,
              parentPhone: phone,
              guardianOccupation: row.guardianOccupation || null,
              villageCity: row.villageCity || row.city || null,
              pincode: row.pincode ? String(row.pincode).trim() : null,
              addressText: row.addressText || row.address || null,
              emergencyContact: row.emergencyContact || phone || null,
            },
          });

          // Create Enrollment
          const rollNumParsed = row.rollNumber ? parseInt(String(row.rollNumber).replace(/\D/g, ''), 10) : null;
          await tx.studentEnrollment.create({
            data: {
              tenantId,
              studentId: profile.id,
              sectionId,
              academicYearId: academicYear.id,
              rollNumber: isNaN(rollNumParsed as number) ? null : rollNumParsed,
              status: EnrollmentStatus.ENROLLED,
            },
          });
        });

        existingSet.add(admissionNumber.toLowerCase());
        importedCount++;
      } catch (err: any) {
        errors.push({
          row: rowNum,
          admissionNumber,
          name: `${firstName} ${lastName}`.trim(),
          reason: err.message || 'Database transaction error',
        });
      }
    }

    return res.json({
      success: true,
      message: `Processed ${rows.length} rows. Imported: ${importedCount}, Skipped/Failed: ${errors.length}`,
      total: rows.length,
      importedCount,
      skippedCount: errors.length,
      errors,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error during bulk import' });
  }
}

/**
 * Bulk Import Staff & Faculty via JSON or parsed spreadsheet rows
 */
export async function bulkImportStaff(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const rows = Array.isArray(req.body.staff) ? req.body.staff : req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of staff members to import.' });
    }

    if (rows.length > 200) {
      return res.status(400).json({ error: 'Maximum 200 staff members can be imported in a single batch.' });
    }

    const defaultPasswordHash = await bcrypt.hash('Staff@123', 10);
    const errors: Array<{ row: number; email?: string; name?: string; reason: string }> = [];
    let importedCount = 0;

    // Allowed roles
    const validRoles: Record<string, UserRole> = {
      TEACHER: UserRole.TEACHER,
      CLASS_TEACHER: UserRole.CLASS_TEACHER,
      SUBJECT_TEACHER: UserRole.SUBJECT_TEACHER,
      PRINCIPAL: UserRole.PRINCIPAL,
      ADMIN: UserRole.ADMIN,
      SCHOOL_ADMIN: UserRole.SCHOOL_ADMIN,
      ACCOUNTANT: UserRole.ACCOUNTANT,
      DRIVER: UserRole.DRIVER,
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      const fullName = row.fullName || row.name ? String(row.fullName || row.name).trim() : '';
      let email = row.email ? String(row.email).trim().toLowerCase() : '';
      const phone = row.phone ? String(row.phone).trim() : null;

      if (!fullName) {
        errors.push({ row: rowNum, reason: 'Missing Full Name' });
        continue;
      }

      // If email is missing, generate placeholder unique email from name and phone/random
      if (!email) {
        const slugName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomPin = Math.floor(1000 + Math.random() * 9000);
        email = `${slugName}${randomPin}@schoolstaff.internal`;
      }

      // Role resolution
      const rawRole = String(row.role || 'TEACHER').trim().toUpperCase().replace(/\s+/g, '_');
      const role = validRoles[rawRole] || UserRole.TEACHER;

      // Check if user already exists in this school
      const existingUser = await prisma.user.findFirst({
        where: {
          tenantId,
          OR: [{ email }, ...(phone ? [{ phone }] : [])],
        },
      });

      if (existingUser) {
        errors.push({
          row: rowNum,
          email,
          name: fullName,
          reason: `Staff with email "${email}" or phone already exists in this school`,
        });
        continue;
      }

      try {
        await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              tenantId,
              email,
              phone: phone || null,
              passwordHash: defaultPasswordHash,
              role,
              status: 'ACTIVE',
            },
          });

          await tx.staffProfile.create({
            data: {
              tenantId,
              userId: user.id,
              fullName,
              designation: row.designation ? String(row.designation).trim() : role.replace('_', ' '),
              qualification: row.qualification ? String(row.qualification).trim() : null,
              department: row.department ? String(row.department).trim() : 'Academics',
              aadharNumber: row.aadharNumber ? String(row.aadharNumber).trim() : null,
              bloodGroup: row.bloodGroup ? String(row.bloodGroup).trim() : null,
              address: row.address ? String(row.address).trim() : null,
              joiningDate: row.joiningDate ? new Date(row.joiningDate) : new Date(),
            },
          });
        });

        importedCount++;
      } catch (err: any) {
        errors.push({
          row: rowNum,
          email,
          name: fullName,
          reason: err.message || 'Database error during staff onboarding',
        });
      }
    }

    return res.json({
      success: true,
      message: `Processed ${rows.length} rows. Imported: ${importedCount}, Skipped/Failed: ${errors.length}`,
      total: rows.length,
      importedCount,
      skippedCount: errors.length,
      errors,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error during staff import' });
  }
}
