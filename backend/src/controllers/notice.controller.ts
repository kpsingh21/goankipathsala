import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { getTeacherClassScope } from '../lib/teacher-scope.js';

/**
 * List notices for the school (Public/Tenant-scoped)
 */
export async function listNotices(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const notices = await prisma.notice.findMany({
      where: { tenantId },
      orderBy: [
        { isPinned: 'desc' },
        { publishedAt: 'desc' },
      ],
    });

    return res.json({ notices });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Create a new notice or circular (Admin only)
 */
export async function createNotice(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    if (req.user && req.user.role) {
      const scope = await getTeacherClassScope(tenantId, req.user.userId, req.user.role);
      if (!scope.hasAccessToAll) {
        return res.status(403).json({ error: 'Access forbidden: Teachers are not authorized to configure or broadcast notices.' });
      }
    }

    const {
      title,
      content,
      category,
      priority,
      targetAudience,
      isPinned,
      expiresAt,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Notice title and content are required.' });
    }

    const notice = await prisma.notice.create({
      data: {
        tenantId,
        title: title.trim(),
        content: content.trim(),
        category: category || 'GENERAL',
        priority: priority || 'NORMAL',
        targetAudience: targetAudience || 'ALL',
        isPinned: Boolean(isPinned),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return res.status(201).json({
      message: 'Notice circular posted successfully',
      notice,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a notice (Admin only)
 */
export async function deleteNotice(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Notice ID and tenant context required.' });
    }

    if (req.user && req.user.role) {
      const scope = await getTeacherClassScope(tenantId, req.user.userId, req.user.role);
      if (!scope.hasAccessToAll) {
        return res.status(403).json({ error: 'Access forbidden: Teachers are not authorized to delete notices.' });
      }
    }

    const notice = await prisma.notice.findFirst({
      where: { id: id as string, tenantId },
    });

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found.' });
    }

    await prisma.notice.delete({ where: { id: notice.id } });

    return res.json({ message: 'Notice deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Update a notice (Admin only)
 */
export async function updateNotice(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { title, content, category, priority, targetAudience, isPinned, expiresAt } = req.body;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Notice ID and tenant context required.' });
    }

    if (req.user && req.user.role) {
      const scope = await getTeacherClassScope(tenantId, req.user.userId, req.user.role);
      if (!scope.hasAccessToAll) {
        return res.status(403).json({ error: 'Access forbidden: Teachers are not authorized to edit notices.' });
      }
    }

    const existing = await prisma.notice.findFirst({
      where: { id: id as string, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Notice not found.' });
    }

    const updated = await prisma.notice.update({
      where: { id: existing.id },
      data: {
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        ...(category && { category }),
        ...(priority && { priority }),
        ...(targetAudience && { targetAudience }),
        ...(isPinned !== undefined && { isPinned: Boolean(isPinned) }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      },
    });

    return res.json({
      message: 'Notice circular updated successfully!',
      notice: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

