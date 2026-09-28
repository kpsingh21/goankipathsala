import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

// Extend Express Request to hold resolved tenant info
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenantSlug?: string;
    }
  }
}

/**
 * Multi-Tenant Context Resolution Middleware
 * Resolves the school/tenant based on:
 * 1. Subdomain: e.g. "hariom-public-school.localhost:3000" -> slug="hariom-public-school"
 * 2. Explicit header: `X-Tenant-ID` or `X-Tenant-Slug`
 */
export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const host = req.headers.host || '';
    const headerTenantId = req.headers['x-tenant-id'] as string;
    const headerTenantSlug = req.headers['x-tenant-slug'] as string;

    let tenantSlug = headerTenantSlug;

    // Extract from subdomain if not passed explicitly
    if (!tenantSlug && host.includes('.')) {
      const parts = host.split('.');
      if (parts.length > 2 || (parts.length === 2 && !host.includes('localhost'))) {
        tenantSlug = parts[0];
      }
    }

    if (headerTenantId) {
      req.tenantId = headerTenantId;
    }

    if (tenantSlug) {
      req.tenantSlug = tenantSlug.toLowerCase().trim();
      if (!req.tenantId) {
        const tenant = await prisma.tenant.findUnique({
          where: { slug: req.tenantSlug },
          select: { id: true, slug: true },
        });
        if (tenant) {
          req.tenantId = tenant.id;
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
}
