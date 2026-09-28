import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

/**
 * Universal Login for School Staff & Admins
 * Validates credentials against the school tenant (resolved via subdomain or X-Tenant-Slug/ID header)
 */
export async function login(req: Request, res: Response) {
  try {
    const { emailOrPhone, password } = req.body;
    let { tenantId, tenantSlug } = req;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required.' });
    }

    // Resolve tenant if slug provided
    let tenant = null;
    if (tenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    } else if (tenantSlug) {
      tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    }

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant context not found.' });
    }

    // Find user within this specific tenant
    const user = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        OR: [
          { email: emailOrPhone.trim().toLowerCase() },
          { phone: emailOrPhone.trim() },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials for this school.' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Your account is inactive. Please contact school administration.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT scoped to this tenant
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: tenant.id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tenantId: tenant.id,
        schoolName: tenant.name,
        schoolSlug: tenant.slug,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Returns current authenticated user profile
 */
export async function getMe(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Request Password Reset (Generates secure OTP / Token)
 * Works for Admins, Teachers, Staff, and Students
 */
export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { emailOrPhone } = req.body;
    let { tenantId, tenantSlug } = req;

    if (!emailOrPhone) {
      return res.status(400).json({ error: 'Email or phone is required.' });
    }

    let tenant = null;
    if (tenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    } else if (tenantSlug) {
      tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    }

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant context not found.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        OR: [
          { email: emailOrPhone.trim().toLowerCase() },
          { phone: emailOrPhone.trim() },
        ],
      },
    });

    if (!user) {
      // Don't leak if account exists or not in production; return general message
      return res.json({
        message: 'If the account exists in this school, a reset code has been generated.',
      });
    }

    // Generate 6-digit one-time code (or secure token)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetCode,
        resetTokenExpiry: expiry,
      },
    });

    // In local/demo environment, we also return the OTP in response so you can test immediately
    return res.json({
      message: 'Password reset code generated successfully (valid for 15 minutes).',
      debugOtp: process.env.NODE_ENV === 'development' ? resetCode : undefined,
    });
  } catch (error: any) {
    console.error('Request reset error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Confirm Password Reset with Code/Token
 */
export async function confirmPasswordReset(req: Request, res: Response) {
  try {
    const { emailOrPhone, resetCode, newPassword } = req.body;
    let { tenantId, tenantSlug } = req;

    if (!emailOrPhone || !resetCode || !newPassword) {
      return res.status(400).json({ error: 'Email/phone, reset code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    let tenant = null;
    if (tenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    } else if (tenantSlug) {
      tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    }

    if (!tenant) {
      return res.status(404).json({ error: 'School tenant context not found.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        OR: [
          { email: emailOrPhone.trim().toLowerCase() },
          { phone: emailOrPhone.trim() },
        ],
      },
    });

    if (!user || user.resetToken !== resetCode.trim()) {
      return res.status(400).json({ error: 'Invalid or incorrect reset code.' });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'The reset code has expired. Please request a new one.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.json({
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Confirm reset error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Direct Admin Override: School Admin resets password for any of their staff or students directly
 */
export async function adminResetUserPassword(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { targetUserId, newPassword } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (!targetUserId || !newPassword) {
      return res.status(400).json({ error: 'Target user ID and new password are required.' });
    }

    // Verify user belongs to this tenant
    const targetUser = await prisma.user.findFirst({
      where: { id: targetUserId, tenantId },
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found in your school.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        passwordHash: newHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.json({
      message: `Password for ${targetUser.email || targetUser.phone} reset successfully.`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
