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
 * Role-Based Access Control Middleware
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role.`,
      });
    }

    next();
  };
}
