import { Request, Response, NextFunction } from 'express';
import { getPlatformMasterKey } from '../lib/platform-auth.js';

/**
 * Middleware: Enforces that requests to Platform Super Admin endpoints
 * provide a valid Platform Master Key via headers:
 * - 'x-platform-key': <KEY>
 * or
 * - 'Authorization': 'Bearer <KEY>'
 */
export function requirePlatformMasterKey(req: Request, res: Response, next: NextFunction) {
  const configuredMasterKey = getPlatformMasterKey();

  const providedKey =
    (req.headers['x-platform-key'] as string) ||
    (req.headers['authorization']?.startsWith('Bearer ')
      ? req.headers['authorization'].slice(7).trim()
      : undefined);

  if (!providedKey) {
    return res.status(401).json({
      error: 'Access Denied: Missing Platform Master Authority Key in request headers.',
    });
  }

  if (providedKey !== configuredMasterKey) {
    return res.status(403).json({
      error: 'Access Denied: Invalid Platform Master Authority Key.',
    });
  }

  next();
}
