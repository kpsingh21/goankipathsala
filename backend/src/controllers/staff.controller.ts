import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { UserRole } from '@prisma/client';

/**
 * List all staff members (Teachers, Accountants, Admins) for the school
 */
export async function listStaff(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const staff = await prisma.user.findMany({
      where: {
        tenantId,
        role: {
          in: [
            UserRole.SCHOOL_ADMIN,
            UserRole.ADMIN,
            UserRole.PRINCIPAL,
            UserRole.TEACHER,
            UserRole.CLASS_TEACHER,
            UserRole.SUBJECT_TEACHER,
            UserRole.ACCOUNTANT,
            UserRole.DRIVER,
          ],
        },
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        staffProfile: true,
        headedSections: {
          select: {
            id: true,
            name: true,
            classGrade: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        taughtSubjects: {
          select: {
            id: true,
            name: true,
            classGrade: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        drivenBusRoutes: {
          select: {
            id: true,
            routeNumber: true,
            routeName: true,
            vehicleNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ staff });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * School Admin: Create a new Staff Member (Teacher / Accountant / Sub-Admin) with full profile
 */
export async function createStaff(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const {
      email,
      phone,
      password,
      role,
      fullName,
      avatarUrl,
      designation,
      qualification,
      department,
      aadharNumber,
      joiningDate,
      experienceYears,
      emergencyPhone,
      bloodGroup,
      address,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    // Role mapping: General teacher removed -> maps to SUBJECT_TEACHER; CASHIER maps to ACCOUNTANT
    let targetRole: UserRole = role as UserRole;
    if ((role as string) === 'TEACHER' || (role as string) === 'GENERAL_TEACHER') {
      targetRole = UserRole.SUBJECT_TEACHER;
    } else if ((role as string) === 'CASHIER') {
      targetRole = UserRole.ACCOUNTANT;
    }

    // Supported active staff roles
    const validRoles: UserRole[] = [
      UserRole.SCHOOL_ADMIN,
      UserRole.ADMIN,
      UserRole.PRINCIPAL,
      UserRole.CLASS_TEACHER,
      UserRole.SUBJECT_TEACHER,
      UserRole.ACCOUNTANT,
      UserRole.DRIVER,
    ];
    if (!validRoles.includes(targetRole)) {
      return res.status(400).json({ error: `Invalid staff role. Allowed: ${validRoles.join(', ')}` });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : null;

    // Check if staff already exists in this school
    const existing = await prisma.user.findFirst({
      where: {
        tenantId,
        OR: [{ email: cleanEmail }, ...(cleanPhone ? [{ phone: cleanPhone }] : [])],
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'A staff member with this email or phone already exists in this school.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const staffMember = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          tenantId,
          email: cleanEmail,
          phone: cleanPhone,
          passwordHash,
          role: targetRole,
          status: 'ACTIVE',
        },
      });

      const profile = await tx.staffProfile.create({
        data: {
          tenantId,
          userId: user.id,
          fullName: fullName ? fullName.trim() : (cleanEmail.split('@')[0] || 'Staff Member'),
          avatarUrl: avatarUrl || null,
          designation: designation || (
            targetRole === UserRole.CLASS_TEACHER ? 'Class Teacher' :
            targetRole === UserRole.SUBJECT_TEACHER ? 'Subject Teacher' :
            targetRole === UserRole.ACCOUNTANT ? ((role as string) === 'CASHIER' ? 'Cashier' : 'Accountant') :
            targetRole === UserRole.DRIVER ? 'Bus Driver' :
            targetRole === UserRole.PRINCIPAL ? 'Principal / Headmaster' :
            targetRole === UserRole.SCHOOL_ADMIN ? 'School Administrator' : 'Staff Member'
          ),
          qualification: qualification || null,
          department: department || null,
          aadharNumber: aadharNumber || null,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          emergencyPhone: emergencyPhone || null,
          bloodGroup: bloodGroup || null,
          address: address || null,
        },
      });

      return {
        ...user,
        staffProfile: profile,
      };
    });

    return res.status(201).json({
      message: 'Staff member created successfully with profile',
      staff: staffMember,
    });
  } catch (error: any) {
    console.error('Create staff error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Super Admin privilege: Update member role (e.g. promote Teacher to SCHOOL_ADMIN)
 */
export async function updateStaffRole(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const userId = req.body.userId || req.body.targetUserId;
    const { newRole, roles } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!userId || !newRole) {
      return res.status(400).json({ error: 'User ID and new role are required.' });
    }

    // Role mapping: General teacher removed -> maps to SUBJECT_TEACHER; CASHIER maps to ACCOUNTANT
    let targetNewRole: UserRole = newRole as UserRole;
    if ((newRole as string) === 'TEACHER' || (newRole as string) === 'GENERAL_TEACHER') {
      targetNewRole = UserRole.SUBJECT_TEACHER;
    } else if ((newRole as string) === 'CASHIER') {
      targetNewRole = UserRole.ACCOUNTANT;
    }

    const validRoles: UserRole[] = [
      UserRole.SCHOOL_ADMIN,
      UserRole.ADMIN,
      UserRole.PRINCIPAL,
      UserRole.CLASS_TEACHER,
      UserRole.SUBJECT_TEACHER,
      UserRole.ACCOUNTANT,
      UserRole.DRIVER,
    ];
    if (!validRoles.includes(targetNewRole)) {
      return res.status(400).json({ error: `Invalid role. Allowed: ${validRoles.join(', ')}` });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: { staffProfile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Member not found in your school.' });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: targetNewRole },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });

    if (user.staffProfile && Array.isArray(roles) && roles.length > 0) {
      await prisma.staffProfile.update({
        where: { id: user.staffProfile.id },
        data: { designation: roles.join(', ') },
      });
    }

    return res.json({
      message: `Role for ${updated.email || updated.phone} updated to ${updated.role} successfully.`,
      user: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Update Staff Profile details (Admin only)
 */
export async function updateStaffProfile(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : (req.params.userId as string);
    const {
      fullName,
      avatarUrl,
      designation,
      qualification,
      department,
      aadharNumber,
      joiningDate,
      experienceYears,
      emergencyPhone,
      bloodGroup,
      address,
    } = req.body;

    if (!tenantId || !userId) {
      return res.status(400).json({ error: 'School tenant context or User ID missing.' });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: { staffProfile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Staff member not found in your school.' });
    }

    let updatedProfile;
    if (user.staffProfile) {
      updatedProfile = await prisma.staffProfile.update({
        where: { id: user.staffProfile.id },
        data: {
          fullName: fullName ?? user.staffProfile.fullName,
          avatarUrl: avatarUrl !== undefined ? avatarUrl : user.staffProfile.avatarUrl,
          designation: designation ?? user.staffProfile.designation,
          qualification: qualification ?? user.staffProfile.qualification,
          department: department ?? user.staffProfile.department,
          aadharNumber: aadharNumber ?? user.staffProfile.aadharNumber,
          joiningDate: joiningDate ? new Date(joiningDate) : user.staffProfile.joiningDate,
          experienceYears: experienceYears !== undefined ? parseInt(experienceYears) : user.staffProfile.experienceYears,
          emergencyPhone: emergencyPhone ?? user.staffProfile.emergencyPhone,
          bloodGroup: bloodGroup ?? user.staffProfile.bloodGroup,
          address: address ?? user.staffProfile.address,
        },
      });
    } else {
      updatedProfile = await prisma.staffProfile.create({
        data: {
          tenantId,
          userId: user.id,
          fullName: fullName || user.email?.split('@')[0] || 'Staff Member',
          avatarUrl: avatarUrl || null,
          designation: designation || null,
          qualification: qualification || null,
          department: department || null,
          aadharNumber: aadharNumber || null,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          emergencyPhone: emergencyPhone || null,
          bloodGroup: bloodGroup || null,
          address: address || null,
        },
      });
    }

    return res.json({
      message: 'Staff profile updated successfully',
      staffProfile: updatedProfile,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a staff member (Admin only)
 */
export async function deleteStaff(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    const id = req.params.id as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (id === req.user?.userId) {
      return res.status(400).json({ error: 'Cannot delete your own administrative account.' });
    }

    const staffUser = await prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!staffUser) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    await prisma.$transaction(async (tx) => {
      // Unlink taught subjects
      await tx.curriculumSubject.updateMany({
        where: { teacherId: id },
        data: { teacherId: null },
      });
      // Delete staff profile
      await tx.staffProfile.deleteMany({
        where: { userId: id },
      });
      // Delete user
      await tx.user.delete({
        where: { id },
      });
    });

    return res.json({ message: 'Staff member removed successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Assign Staff Workload & Roles (Class Teacher Section, Subject Teacher Subjects, Driver Bus Route)
 */
export async function assignStaffRolesAndWorkload(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { userId, role, classTeacherSectionId, subjectIds, busRouteId } = req.body;

    if (!tenantId || !userId) {
      return res.status(400).json({ error: 'School tenant context and User ID are required.' });
    }

    const staffUser = await prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: { staffProfile: true },
    });

    if (!staffUser) {
      return res.status(404).json({ error: 'Staff member not found in this school.' });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update role if provided
      if (role) {
        let assignedRole: UserRole = role as UserRole;
        if ((role as string) === 'TEACHER' || (role as string) === 'GENERAL_TEACHER') {
          assignedRole = UserRole.SUBJECT_TEACHER;
        } else if ((role as string) === 'CASHIER') {
          assignedRole = UserRole.ACCOUNTANT;
        }
        await tx.user.update({
          where: { id: userId },
          data: { role: assignedRole },
        });
      }

      // 2. Class Teacher assignment: If sectionId provided, set classTeacherId
      if (classTeacherSectionId !== undefined) {
        // Clear previous class teacher sections for this teacher
        await tx.section.updateMany({
          where: { tenantId, classTeacherId: userId },
          data: { classTeacherId: null },
        });

        if (classTeacherSectionId) {
          await tx.section.update({
            where: { id: classTeacherSectionId },
            data: { classTeacherId: userId },
          });
          // Also set role to CLASS_TEACHER if currently general teacher
          if (staffUser.role === UserRole.TEACHER || !role) {
            await tx.user.update({
              where: { id: userId },
              data: { role: UserRole.CLASS_TEACHER },
            });
          }
        }
      }

      // 3. Subject Teacher assignment: If subjectIds array provided
      if (Array.isArray(subjectIds)) {
        // Unlink old subjects not in array
        await tx.curriculumSubject.updateMany({
          where: { tenantId, teacherId: userId, id: { notIn: subjectIds } },
          data: { teacherId: null },
        });

        // Link new subjects
        if (subjectIds.length > 0) {
          await tx.curriculumSubject.updateMany({
            where: { tenantId, id: { in: subjectIds } },
            data: { teacherId: userId },
          });
          // If role is general teacher, update to SUBJECT_TEACHER
          if (staffUser.role === UserRole.TEACHER && !role && !classTeacherSectionId) {
            await tx.user.update({
              where: { id: userId },
              data: { role: UserRole.SUBJECT_TEACHER },
            });
          }
        }
      }

      // 4. Driver Bus Route assignment: If busRouteId provided
      if (busRouteId !== undefined) {
        // Unlink previous routes for this driver
        await tx.busRoute.updateMany({
          where: { tenantId, driverUserId: userId },
          data: { driverUserId: null },
        });

        if (busRouteId) {
          await tx.busRoute.update({
            where: { id: busRouteId },
            data: {
              driverUserId: userId,
              driverName: staffUser.staffProfile?.fullName || staffUser.email?.split('@')[0] || 'Driver',
              driverPhone: staffUser.phone || '',
            },
          });
          // Ensure role is DRIVER
          await tx.user.update({
            where: { id: userId },
            data: { role: UserRole.DRIVER },
          });
        }
      }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        staffProfile: true,
        headedSections: {
          select: { id: true, name: true, classGrade: { select: { id: true, name: true } } },
        },
        taughtSubjects: {
          select: { id: true, name: true, classGrade: { select: { id: true, name: true } } },
        },
        drivenBusRoutes: {
          select: { id: true, routeNumber: true, routeName: true, vehicleNumber: true },
        },
      },
    });

    return res.json({
      message: 'Staff workload and assignments updated successfully.',
      staff: updatedUser,
    });
  } catch (error: any) {
    console.error('Assign staff error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

