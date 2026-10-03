import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getPlatformMasterKey } from '../lib/platform-auth.js';

// Default configuration for the main platform landing portal
const DEFAULT_PLATFORM_CONFIG = {
  logoUrl: '',
  brandName: 'Goan Ki Pathshala',
  brandTagline: 'गाँव की पाठशाला • Multitenant School Operating System',
  heroBadge: '🌾 Transforming Rural & Semi-Urban Education',
  heroTitle: 'Empowering Every School with World-Class Digital Infrastructure.',
  heroDescription:
    'Goan Ki Pathshala (गाँव की पाठशाला) is an enterprise-grade multi-tenant school operating system. Inspired by leading EdTech models like LEAD School, each campus receives its own isolated subdomain, bilingual CBSE curriculum delivery, smart student dossiers, itemized fee billing, and real-time fleet transport tracking.',
  exploreButtonText: 'Explore Partner Schools',
  announcementBanner: {
    enabled: true,
    text: '🚀 Admissions open across all partner schools for Academic Session 2026-27.',
  },
  contact: {
    email: 'contact@goankipathsala.in',
    phone: '+91 98765 43210',
    address: 'Rural EdTech Innovation Hub, Cyber City, India',
  },
  features: [
    {
      icon: '📜',
      title: 'CBSE Cumulative Report Cards',
      description:
        'Unit tests, quarterly, half-yearly, and annual aggregate grading with automatic percentage computation.',
    },
    {
      icon: '📋',
      title: 'Attendance Matrix Engine',
      description:
        'Morning roll call and monthly attendance registers with automated working-day percentage calculation.',
    },
    {
      icon: '💳',
      title: 'Fee Structures & Ledger',
      description:
        'Itemized breakdown (Tuition, Lab, Sports, Library) with batch invoice issuance and payment receipts.',
    },
    {
      icon: '🚌',
      title: 'Village Bus Route Network',
      description:
        'Route milestones, pickup/drop times, driver phone numbers, and transport fee management.',
    },
    {
      icon: '🧑‍🏫',
      title: 'Role-Based Teacher Access',
      description:
        'Subject teachers manage assigned subjects; class teachers and admins hold 360° academic oversight.',
    },
    {
      icon: '📢',
      title: 'Digital Circular Notice Board',
      description:
        'Targeted school notices with priority tagging, emergency broadcasts, and instant editing.',
    },
    {
      icon: '🌐',
      title: 'Isolated Subdomain Websites',
      description:
        'Each school enjoys a dedicated public branding portal with custom facilities, photo gallery, and videos.',
    },
    {
      icon: '🔒',
      title: 'Multi-Tenant Tenant Isolation',
      description:
        'PostgreSQL row-level isolation via tenant UUIDs guaranteeing zero data overlap across institutions.',
    },
  ],
};

const CONFIG_FILE_PATH = path.resolve(process.cwd(), 'data', 'platform-website-config.json');

function readPlatformConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return { ...DEFAULT_PLATFORM_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading platform website config:', err);
  }
  return DEFAULT_PLATFORM_CONFIG;
}

function writePlatformConfig(config: any) {
  const dir = path.dirname(CONFIG_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Verify Platform Master Key (for login gate)
 */
export async function verifyPlatformKey(req: Request, res: Response) {
  const configuredMasterKey = getPlatformMasterKey();
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: 'Master Key is required.' });
  }

  if (key !== configuredMasterKey) {
    return res.status(403).json({ error: 'Invalid Platform Master Authority Key.' });
  }

  return res.json({
    success: true,
    message: 'Platform Authority Key verified successfully.',
  });
}

/**
 * Get Public Website Configuration for Main Portal
 */
export async function getPlatformWebsiteConfig(req: Request, res: Response) {
  try {
    const config = readPlatformConfig();
    return res.json({ config });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to load website config.' });
  }
}

/**
 * Update Website Configuration (Requires Master Key)
 */
export async function updatePlatformWebsiteConfig(req: Request, res: Response) {
  try {
    const newConfig = req.body;
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration data.' });
    }

    const currentConfig = readPlatformConfig();
    const mergedConfig = {
      ...currentConfig,
      ...newConfig,
      announcementBanner: {
        ...currentConfig.announcementBanner,
        ...(newConfig.announcementBanner || {}),
      },
      contact: {
        ...currentConfig.contact,
        ...(newConfig.contact || {}),
      },
    };

    writePlatformConfig(mergedConfig);

    return res.json({
      success: true,
      message: 'Platform website configuration updated successfully.',
      config: mergedConfig,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update website config.' });
  }
}

// ----------------------------------------------------
// Platform Contact & Inquiries Management
// ----------------------------------------------------

const INQUIRIES_FILE_PATH = path.resolve(process.cwd(), 'data', 'platform-inquiries.json');

function readPlatformInquiries(): any[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE_PATH)) {
      const data = fs.readFileSync(INQUIRIES_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading platform inquiries:', err);
  }
  return [];
}

function writePlatformInquiries(inquiries: any[]) {
  const dir = path.dirname(INQUIRIES_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(INQUIRIES_FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
}

/**
 * Public endpoint: Submit Contact / Onboarding inquiry from landing page
 */
export async function submitContactInquiry(req: Request, res: Response) {
  try {
    const { fullName, email, phone, schoolName, inquiryType, message } = req.body;

    if (!fullName || (!email && !phone) || !message) {
      return res.status(400).json({
        error: 'Please provide your Full Name, at least one contact channel (Email or Phone), and your message.',
      });
    }

    const inquiries = readPlatformInquiries();

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: String(fullName).trim(),
      email: email ? String(email).trim() : null,
      phone: phone ? String(phone).trim() : null,
      schoolName: schoolName ? String(schoolName).trim() : null,
      inquiryType: inquiryType ? String(inquiryType).trim() : 'General Inquiry',
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: 'NEW',
    };

    inquiries.unshift(newInquiry);
    writePlatformInquiries(inquiries);

    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting Goan Ki Pathshala! Our team will reach out to you shortly.',
      inquiry: newInquiry,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to submit contact inquiry.' });
  }
}

/**
 * Super Admin endpoint: Fetch all contact inquiries (requires Master Key)
 */
export async function getContactInquiries(req: Request, res: Response) {
  try {
    const inquiries = readPlatformInquiries();
    return res.json({ inquiries });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch inquiries.' });
  }
}

/**
 * Super Admin endpoint: Update inquiry status (requires Master Key)
 */
export async function updateContactInquiryStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiries = readPlatformInquiries();
    const index = inquiries.findIndex((inq: any) => inq.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    inquiries[index].status = status || inquiries[index].status;
    inquiries[index].updatedAt = new Date().toISOString();
    writePlatformInquiries(inquiries);

    return res.json({
      success: true,
      message: 'Inquiry status updated successfully.',
      inquiry: inquiries[index],
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update inquiry status.' });
  }
}

