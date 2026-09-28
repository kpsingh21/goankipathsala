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
          in: [UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT],
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

    // Role check: Admin can only create TEACHER, ACCOUNTANT, or SCHOOL_ADMIN
    const validRoles = [UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN];
    if (!validRoles.includes(role)) {
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
          role,
          status: 'ACTIVE',
        },
      });

      const profile = await tx.staffProfile.create({
        data: {
          tenantId,
          userId: user.id,
          fullName: fullName ? fullName.trim() : (cleanEmail.split('@')[0] || 'Staff Member'),
          avatarUrl: avatarUrl || null,
          designation: designation || (role === 'TEACHER' ? 'Teacher' : role === 'ACCOUNTANT' ? 'Accountant' : 'Administrator'),
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
    const { userId, newRole } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!userId || !newRole) {
      return res.status(400).json({ error: 'User ID and new role are required.' });
    }

    const validRoles = [UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: `Invalid role. Allowed: ${validRoles.join(', ')}` });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Member not found in your school.' });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });

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
