import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export interface AuthUserPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
  email: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUserPayload;

    // Strict multi-tenant verification:
    // If the request arrived on a tenant subdomain/header, ensure the user belongs to THAT tenant!
    if (req.tenantId && payload.tenantId !== req.tenantId) {
      return res.status(403).json({ error: 'Access denied: Token tenant does not match requested school.' });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

/**
 * Role-Based Access Control Middleware with Hierarchical Role Support
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    const userRole = req.user.role;

    // SuperAdmin and School Admin/Admin/Principal have top-level access to administrative endpoints
    const effectiveRoles = new Set<UserRole>(allowedRoles);

    // Expand administrative synonyms: School Admin, Admin, and Principal have identical top-level administrative authority
    if (
      effectiveRoles.has(UserRole.SCHOOL_ADMIN) ||
      effectiveRoles.has(UserRole.ADMIN) ||
      effectiveRoles.has(UserRole.PRINCIPAL)
    ) {
      effectiveRoles.add(UserRole.SUPERADMIN);
      effectiveRoles.add(UserRole.SCHOOL_ADMIN);
      effectiveRoles.add(UserRole.ADMIN);
      effectiveRoles.add(UserRole.PRINCIPAL);
    }

    // Expand teacher synonyms
    if (
      effectiveRoles.has(UserRole.TEACHER) ||
      effectiveRoles.has(UserRole.CLASS_TEACHER) ||
      effectiveRoles.has(UserRole.SUBJECT_TEACHER)
    ) {
      effectiveRoles.add(UserRole.TEACHER);
      effectiveRoles.add(UserRole.CLASS_TEACHER);
      effectiveRoles.add(UserRole.SUBJECT_TEACHER);
      // School leadership (School Admin, Principal) can also access teacher-level views
      effectiveRoles.add(UserRole.SUPERADMIN);
      effectiveRoles.add(UserRole.SCHOOL_ADMIN);
      effectiveRoles.add(UserRole.ADMIN);
      effectiveRoles.add(UserRole.PRINCIPAL);
    }

    // Expand accountant/financial endpoints: School leadership can also access financial endpoints
    if (effectiveRoles.has(UserRole.ACCOUNTANT)) {
      effectiveRoles.add(UserRole.SUPERADMIN);
      effectiveRoles.add(UserRole.SCHOOL_ADMIN);
      effectiveRoles.add(UserRole.ADMIN);
      effectiveRoles.add(UserRole.PRINCIPAL);
    }

    // Expand transport/driver endpoints: School leadership can also access transport endpoints
    if (effectiveRoles.has(UserRole.DRIVER)) {
      effectiveRoles.add(UserRole.SUPERADMIN);
      effectiveRoles.add(UserRole.SCHOOL_ADMIN);
      effectiveRoles.add(UserRole.ADMIN);
      effectiveRoles.add(UserRole.PRINCIPAL);
    }

    if (!effectiveRoles.has(userRole)) {
      return res.status(403).json({
        error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role. Current role is ${userRole}.`,
      });
    }

    next();
  };
}

/**
 * Optional Authentication: Attaches req.user if a valid token is present, but allows guest access if not
 */
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    if (!req.tenantId || payload.tenantId === req.tenantId) {
      req.user = payload;
    }
  } catch (err) {
    // Non-fatal for optional authentication
  }
  next();
}
