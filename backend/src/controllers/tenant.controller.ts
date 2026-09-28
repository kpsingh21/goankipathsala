import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

/**
 * Register a new School Tenant + Initial School Admin User in one transaction
 */
export async function registerTenant(req: Request, res: Response) {
  try {
    const {
      name,
      slug,
      customDomain,
      plan,
      adminEmail,
      adminPhone,
      adminPassword,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'School name and subdomain slug are required.' });
    }

    const cleanSlug = slug.toLowerCase().trim();

    // Check if slug already taken
    const existingTenant = await prisma.tenant.findUnique({ where: { slug: cleanSlug } });
    if (existingTenant) {
      return res.status(409).json({ error: `School with subdomain slug "${cleanSlug}" already exists.` });
    }

    // Hash password if admin credentials provided
    let passwordHash = '';
    if (adminPassword) {
      passwordHash = await bcrypt.hash(adminPassword, 10);
    }

    // Atomic transaction: create tenant and admin user together
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name,
          slug: cleanSlug,
          customDomain: customDomain ? customDomain.trim().toLowerCase() : null,
          plan: plan || 'STANDARD',
          settings: {
            onboardingCompleted: false,
          },
        },
      });

      let adminUser = null;
      if (adminEmail && passwordHash) {
        adminUser = await tx.user.create({
          data: {
            tenantId: tenant.id,
            email: adminEmail.trim().toLowerCase(),
            phone: adminPhone ? adminPhone.trim() : null,
            passwordHash,
            role: 'SCHOOL_ADMIN',
            status: 'ACTIVE',
          },
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        });
      }

      return { tenant, adminUser };
    });

    return res.status(201).json({
      message: 'School tenant and administrator registered successfully',
      tenant: result.tenant,
      admin: result.adminUser,
    });
  } catch (error: any) {
    console.error('Failed to register tenant:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Fetch information about the currently resolved tenant with live stats & landing details
 */
export async function getCurrentTenant(req: Request, res: Response) {
  try {
    const { tenantSlug, tenantId } = req;

    if (!tenantSlug && !tenantId) {
      return res.status(400).json({ error: 'No school tenant identified in this request.' });
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          tenantId ? { id: tenantId } : {},
          tenantSlug ? { slug: tenantSlug } : {},
        ],
      },
      include: {
        _count: {
          select: {
            studentProfiles: true,
            users: {
              where: {
                role: { in: ['SCHOOL_ADMIN', 'TEACHER', 'ACCOUNTANT'] },
              },
            },
            classGrades: true,
            sections: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    const currentSettings = (tenant.settings as Record<string, any>) || {};
    const landing = currentSettings.landingConfig || {};

    // Defaults for vibrant school presentation
    const enrichedLanding = {
      tagline: landing.tagline || `Inspiring Excellence & Transforming Education at ${tenant.name}`,
      aboutText: landing.aboutText || `${tenant.name} is dedicated to delivering world-class, digitally enabled education. We blend quality academics with character building, digital literacy, sports, and holistic rural empowerment.`,
      principalName: landing.principalName || "Principal / Headmaster",
      principalMessage: landing.principalMessage || "Our earnest endeavor is to empower every child with knowledge, confidence, and values to excel in the modern world.",
      contactAddress: landing.contactAddress || "School Campus, Main Village Road",
      contactPhone: landing.contactPhone || "+91 91113 93176",
      contactEmail: landing.contactEmail || `info@${tenant.slug}.goankipathsala.in`,
      heroImage: landing.heroImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80",
      galleryImages: landing.galleryImages && landing.galleryImages.length > 0 ? landing.galleryImages : [
        { id: "g1", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80", caption: "Smart Digital Classrooms & Active Learning", category: "Classroom" },
        { id: "g2", url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80", caption: "Annual Sports Meet & Sprint Finals", category: "Sports" },
        { id: "g3", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", caption: "Science & Robotics Innovation Fair", category: "Fun & Science" },
        { id: "g4", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80", caption: "Cultural Dance Performances", category: "Celebrations" },
        { id: "g5", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80", caption: "Modern Reading Library & Resource Room", category: "Campus" },
        { id: "g6", url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80", caption: "Morning Assembly & Yoga Drills", category: "Fun & Science" }
      ],
      videoGallery: landing.videoGallery && landing.videoGallery.length > 0 ? landing.videoGallery : [
        { id: "v1", title: "Campus Walkthrough & Smart Facilities", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnailUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80", description: "Take a digital tour of our classrooms, smart labs, and activity spaces." },
        { id: "v2", title: "Annual Cultural Fest & Stage Performances", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnailUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80", description: "Glimpses of students showcasing music, theatre, and traditional folk dances." },
        { id: "v3", title: "Young Innovators Science & Tech Exhibition", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnailUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", description: "Demonstrations of eco-friendly irrigation, solar energy, and robotics." }
      ],
      facilities: landing.facilities && landing.facilities.length > 0 ? landing.facilities : [
        { id: "f1", name: "Smart Digital Classrooms", icon: "💻", description: "Interactive audio-visual screens and bilingual digital courseware." },
        { id: "f2", name: "Science & Computer Labs", icon: "🔬", description: "Hands-on experiential labs with dedicated student computer workstations." },
        { id: "f3", name: "Playground & Sports Coaching", icon: "⚽", description: "Cricket, volleyball, football pitches and expert physical education." },
        { id: "f4", name: "Safe GPS Bus Fleet", icon: "🚌", description: "Extensive transport network covering 25+ surrounding villages." },
        { id: "f5", name: "Hygienic Mid-Day Meals", icon: "🥗", description: "Nutritious balanced dining with clean RO purified drinking water." },
        { id: "f6", name: "Library & Reading Corner", icon: "📚", description: "Rich library with 5,000+ vernacular and English titles." }
      ]
    };

    const stats = {
      studentCount: tenant._count.studentProfiles,
      staffCount: tenant._count.users,
      classCount: tenant._count.classGrades,
      sectionCount: tenant._count.sections,
      busRoutes: landing.customStats?.busRoutes || 12,
      smartLabs: landing.customStats?.smartLabs || 4,
    };

    return res.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        customDomain: tenant.customDomain,
        plan: tenant.plan,
        status: tenant.status,
        createdAt: tenant.createdAt,
        landingConfig: enrichedLanding,
        stats,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Update School Website Landing Details, Gallery & Videos (Admin only)
 */
export async function updateTenantLanding(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const {
      tagline,
      aboutText,
      principalName,
      principalMessage,
      contactAddress,
      contactPhone,
      contactEmail,
      heroImage,
      galleryImages,
      videoGallery,
      facilities,
      customStats,
    } = req.body;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    const existingSettings = (tenant.settings as Record<string, any>) || {};
    const existingLanding = existingSettings.landingConfig || {};

    const updatedLanding = {
      ...existingLanding,
      ...(tagline !== undefined && { tagline }),
      ...(aboutText !== undefined && { aboutText }),
      ...(principalName !== undefined && { principalName }),
      ...(principalMessage !== undefined && { principalMessage }),
      ...(contactAddress !== undefined && { contactAddress }),
      ...(contactPhone !== undefined && { contactPhone }),
      ...(contactEmail !== undefined && { contactEmail }),
      ...(heroImage !== undefined && { heroImage }),
      ...(galleryImages !== undefined && { galleryImages }),
      ...(videoGallery !== undefined && { videoGallery }),
      ...(facilities !== undefined && { facilities }),
      ...(customStats !== undefined && { customStats }),
    };

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: {
          ...existingSettings,
          landingConfig: updatedLanding,
        },
      },
    });

    return res.json({
      message: 'School website & gallery details updated successfully!',
      landingConfig: updatedLanding,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Fetch all registered school tenants (for SuperAdmin / Platform Overview)
 */
export async function listTenants(req: Request, res: Response) {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        customDomain: true,
        plan: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            studentProfiles: true,
            classGrades: true,
          },
        },
      },
    });

    return res.json({ tenants });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * SuperAdmin: Update Tenant Status (ACTIVE, SUSPENDED, TRIAL)
 */
export async function updateTenantStatus(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { status, plan } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Tenant ID is required.' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(plan && { plan }),
      },
    });

    return res.json({
      message: `School tenant "${updated.name}" updated successfully!`,
      tenant: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * SuperAdmin: Deregister / Delete School Tenant with cascade
 */
export async function deleteTenant(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Tenant ID is required.' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    // Cascade delete via prisma schema relation onDelete: Cascade
    await prisma.tenant.delete({ where: { id } });

    return res.json({
      message: `School tenant "${tenant.name}" (${tenant.slug}) has been completely deregistered.`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * SuperAdmin: Edit Tenant Basic Details
 */
export async function updateTenantDetails(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, customDomain, plan } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Tenant ID is required.' });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      return res.status(404).json({ error: 'School tenant not found.' });
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(customDomain !== undefined && { customDomain: customDomain ? customDomain.trim().toLowerCase() : null }),
        ...(plan && { plan }),
      },
    });

    return res.json({
      message: `School tenant details updated successfully!`,
      tenant: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


