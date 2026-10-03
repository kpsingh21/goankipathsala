import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { deflateSync } from 'node:zlib';

// Pre-configured Indian Gazetted & Festive Public Holidays for 2026-2027
export const DEFAULT_PUBLIC_HOLIDAYS_2026 = [
  {
    id: 'pub-2026-01',
    title: "New Year's Day",
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    description: 'First day of the year in the Gregorian calendar.',
    isGazetted: false,
  },
  {
    id: 'pub-2026-02',
    title: 'Makar Sankranti / Pongal',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-01-14',
    endDate: '2026-01-14',
    description: 'Harvest festival celebrated across India (Sankranti, Pongal, Magh Bihu).',
    isGazetted: false,
  },
  {
    id: 'pub-2026-03',
    title: 'Republic Day',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-01-26',
    endDate: '2026-01-26',
    description: 'National holiday honoring the date the Constitution of India came into effect (1950).',
    isGazetted: true,
  },
  {
    id: 'pub-2026-04',
    title: 'Maha Shivratri',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-02-15',
    endDate: '2026-02-15',
    description: 'Hindu festival celebrating the solemn worship and grace of Lord Shiva.',
    isGazetted: false,
  },
  {
    id: 'pub-2026-05',
    title: 'Holi (Dhulandi)',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-03-03',
    endDate: '2026-03-04',
    description: 'Festival of colors marking the arrival of spring and victory of good over evil.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-06',
    title: 'Id-ul-Fitr (Ramzan Id)',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-03-21',
    endDate: '2026-03-21',
    description: 'Islamic festival marking the culmination of the holy month of fasting (Ramadan).',
    isGazetted: true,
  },
  {
    id: 'pub-2026-07',
    title: 'Ram Navami',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-03-27',
    endDate: '2026-03-27',
    description: 'Celebration of the birth of Lord Rama.',
    isGazetted: false,
  },
  {
    id: 'pub-2026-08',
    title: 'Mahavir Jayanti',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-03-31',
    endDate: '2026-03-31',
    description: 'Birth anniversary of Lord Mahavira, the twenty-fourth Tirthankara of Jainism.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-09',
    title: 'Good Friday',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-04-03',
    endDate: '2026-04-03',
    description: 'Christian holiday commemorating the crucifixion of Jesus Christ.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-10',
    title: 'Dr. B.R. Ambedkar Jayanti',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-04-14',
    endDate: '2026-04-14',
    description: 'Commemoration of the birth of Dr. Bhimrao Ramji Ambedkar, Father of the Indian Constitution.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-11',
    title: 'Buddha Purnima',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-05-01',
    endDate: '2026-05-01',
    description: 'Birth, enlightenment, and death of Gautama Buddha.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-12',
    title: 'Summer Vacation Break',
    category: 'VACATION',
    startDate: '2026-05-18',
    endDate: '2026-06-25',
    description: 'Annual summer vacation break for all primary and secondary classes.',
    isGazetted: false,
  },
  {
    id: 'pub-2026-13',
    title: 'Id-ul-Zuha (Bakrid)',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-05-27',
    endDate: '2026-05-27',
    description: 'Feast of the Sacrifice honoring the willingness of Ibrahim to sacrifice his son.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-14',
    title: 'Muharram',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-06-26',
    endDate: '2026-06-26',
    description: 'First month of the Islamic calendar and day of Ashura.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-15',
    title: 'Independence Day',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    description: 'National holiday marking Indian Independence in 1947. Flag hoisting & ceremonies.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-16',
    title: 'Raksha Bandhan',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-08-27',
    endDate: '2026-08-27',
    description: 'Festival celebrating the bond of protection and love between brothers and sisters.',
    isGazetted: false,
  },
  {
    id: 'pub-2026-17',
    title: 'Janmashtami',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-09-04',
    endDate: '2026-09-04',
    description: 'Annual Hindu festival that celebrates the birth of Krishna, the eighth avatar of Vishnu.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-18',
    title: 'Milad-un-Nabi (Id-e-Milad)',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-09-15',
    endDate: '2026-09-15',
    description: 'Observance of the birthday of the Islamic prophet Muhammad.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-19',
    title: 'Mahatma Gandhi Jayanti',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-10-02',
    endDate: '2026-10-02',
    description: 'National holiday honoring the birth of Mohandas Karamchand Gandhi, Father of the Nation.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-20',
    title: 'Dussehra (Vijayadashami)',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    description: 'Major Hindu festival celebrating the victory of Lord Rama over Ravana.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-21',
    title: 'Diwali (Deepavali Break)',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-11-08',
    endDate: '2026-11-10',
    description: 'Festival of Lights, Lakshmi Puja, Govardhan Puja, and Bhai Dooj.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-22',
    title: 'Chhath Puja',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-11-15',
    endDate: '2026-11-16',
    description: 'Ancient Hindu Vedic festival dedicated to the Solar deity Surya and Shashthi Devi.',
    isGazetted: false,
  },
  {
    id: 'pub-2026-23',
    title: 'Guru Nanak Jayanti',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-11-24',
    endDate: '2026-11-24',
    description: 'Celebrates the birth of Guru Nanak Dev Ji, founder of Sikhism and first of the ten Sikh Gurus.',
    isGazetted: true,
  },
  {
    id: 'pub-2026-24',
    title: 'Christmas Day & Winter Break',
    category: 'PUBLIC_HOLIDAY',
    startDate: '2026-12-25',
    endDate: '2026-12-31',
    description: 'Christmas celebration followed by school winter vacation break.',
    isGazetted: true,
  },
];

/**
 * List all Calendar Events (Public Holidays, School Holidays, Exams, and Campus Events)
 */
export async function listCalendarEvents(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      // If tenant context is missing, still return default public holidays
      return res.json({
        events: DEFAULT_PUBLIC_HOLIDAYS_2026,
        publicHolidaysCount: DEFAULT_PUBLIC_HOLIDAYS_2026.length,
        customEventsCount: 0,
        examinationsCount: 0,
      });
    }

    // 1. Fetch excluded holiday IDs for this school
    const excludedNotices = await prisma.notice.findMany({
      where: { tenantId, category: 'EXCLUDED_HOLIDAY' },
      select: { title: true },
    });
    const excludedIds = new Set(excludedNotices.map((n) => n.title));

    // Filter out any default public holidays excluded by this school
    const activePublicHolidays = DEFAULT_PUBLIC_HOLIDAYS_2026
      .filter((h) => !excludedIds.has(h.id))
      .map((h) => ({ ...h, isCustom: false }));

    // 2. Fetch custom notices/events from DB (Holiday, Exam, Event circulars)
    const customEvents = await prisma.notice.findMany({
      where: {
        tenantId,
        category: {
          in: ['HOLIDAY', 'PUBLIC_HOLIDAY', 'SCHOOL_HOLIDAY', 'VACATION', 'EXAM', 'EVENT', 'PTM', 'SPORTS', 'ACADEMIC'],
        },
      },
      orderBy: { publishedAt: 'asc' },
    });

    // 3. Fetch examinations for exam schedule timetable
    const examinations = await prisma.examination.findMany({
      where: { tenantId },
      include: {
        classGrade: { select: { id: true, name: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    // Format examinations as calendar events
    const examEvents = examinations.map((exam) => {
      const startStr = exam.startDate ? new Date(exam.startDate).toISOString().split('T')[0] : '';
      const endStr = exam.endDate ? new Date(exam.endDate).toISOString().split('T')[0] : startStr;
      return {
        id: `exam-${exam.id}`,
        title: `📝 ${exam.name}`,
        category: 'EXAM',
        startDate: startStr,
        endDate: endStr,
        description: `Class: ${exam.classGrade?.name || 'All Classes'}`,
        classGradeName: exam.classGrade?.name || 'All Classes',
        isExam: true,
        examId: exam.id,
      };
    });

    // Format custom notices as calendar events
    const formattedCustom = customEvents.map((ev) => {
      const startStr = new Date(ev.publishedAt).toISOString().split('T')[0];
      const endStr = ev.expiresAt ? new Date(ev.expiresAt).toISOString().split('T')[0] : startStr;
      return {
        id: ev.id,
        title: ev.title,
        category: ev.category,
        startDate: startStr,
        endDate: endStr,
        description: ev.content,
        priority: ev.priority,
        targetAudience: ev.targetAudience,
        isCustom: true,
      };
    });

    // Combine standard public holidays with custom school events and examinations
    const allEvents = [
      ...activePublicHolidays,
      ...formattedCustom,
      ...examEvents,
    ].sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

    return res.json({
      events: allEvents,
      publicHolidaysCount: activePublicHolidays.length,
      customEventsCount: formattedCustom.length,
      examinationsCount: examEvents.length,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Create a School Calendar Event / Holiday / Exam Schedule
 */
export async function createCalendarEvent(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const {
      title,
      category,
      startDate,
      endDate,
      description,
      targetAudience,
      priority,
    } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ error: 'Event title and start date are required.' });
    }

    const eventDate = new Date(startDate);
    const expiryDate = endDate ? new Date(endDate) : eventDate;

    const notice = await prisma.notice.create({
      data: {
        tenantId,
        title: title.trim(),
        content: description ? description.trim() : `${title.trim()} (${category || 'HOLIDAY'})`,
        category: category || 'HOLIDAY',
        priority: priority || 'NORMAL',
        targetAudience: targetAudience || 'ALL',
        publishedAt: eventDate,
        expiresAt: expiryDate,
        isPinned: category === 'EXAM' || category === 'PUBLIC_HOLIDAY',
      },
    });

    return res.status(201).json({
      message: 'Calendar event added successfully',
      event: {
        id: notice.id,
        title: notice.title,
        category: notice.category,
        startDate: new Date(notice.publishedAt).toISOString().split('T')[0],
        endDate: notice.expiresAt ? new Date(notice.expiresAt).toISOString().split('T')[0] : '',
        description: notice.content,
        isCustom: true,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Update / Edit a School Calendar Event or Holiday
 */
export async function updateCalendarEvent(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Event ID and tenant context required.' });
    }

    if (id.startsWith('exam-')) {
      return res.status(400).json({ error: 'Exam schedules should be updated from the Exams & Results section.' });
    }

    const {
      title,
      category,
      startDate,
      endDate,
      description,
      targetAudience,
    } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ error: 'Event title and start date are required.' });
    }

    const eventDate = new Date(startDate);
    const expiryDate = endDate ? new Date(endDate) : eventDate;

    let notice;
    if (id.startsWith('pub-')) {
      // 1. Exclude the original public holiday so it doesn't duplicate
      const existingExclusion = await prisma.notice.findFirst({
        where: { tenantId, category: 'EXCLUDED_HOLIDAY', title: id },
      });
      if (!existingExclusion) {
        await prisma.notice.create({
          data: {
            tenantId,
            title: id,
            content: 'Overridden standard public holiday',
            category: 'EXCLUDED_HOLIDAY',
            publishedAt: new Date(),
            expiresAt: new Date(),
          },
        });
      }

      // 2. Create the customized version as a custom holiday
      notice = await prisma.notice.create({
        data: {
          tenantId,
          title: title.trim(),
          content: description ? description.trim() : `${title.trim()} (${category || 'PUBLIC_HOLIDAY'})`,
          category: category || 'PUBLIC_HOLIDAY',
          priority: 'NORMAL',
          targetAudience: targetAudience || 'ALL',
          publishedAt: eventDate,
          expiresAt: expiryDate,
          isPinned: true,
        },
      });
    } else {
      notice = await prisma.notice.findFirst({
        where: { id, tenantId },
      });

      if (!notice) {
        return res.status(404).json({ error: 'Calendar event not found.' });
      }

      notice = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          content: description ? description.trim() : notice.content,
          category: category || notice.category,
          targetAudience: targetAudience || notice.targetAudience,
          publishedAt: eventDate,
          expiresAt: expiryDate,
        },
      });
    }

    return res.json({
      message: 'Calendar event updated successfully',
      event: {
        id: notice.id,
        title: notice.title,
        category: notice.category,
        startDate: new Date(notice.publishedAt).toISOString().split('T')[0],
        endDate: notice.expiresAt ? new Date(notice.expiresAt).toISOString().split('T')[0] : '',
        description: notice.content,
        isCustom: true,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a calendar event or holiday
 */
export async function deleteCalendarEvent(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Event ID and tenant context required.' });
    }

    // Check if it's an exam or notice
    if (id.startsWith('exam-')) {
      return res.status(400).json({ error: 'Exam entries are managed directly from the Exams & Results section.' });
    }

    if (id.startsWith('pub-')) {
      // Exclude this standard public holiday for this tenant
      const existingExclusion = await prisma.notice.findFirst({
        where: { tenantId, category: 'EXCLUDED_HOLIDAY', title: id },
      });
      if (!existingExclusion) {
        await prisma.notice.create({
          data: {
            tenantId,
            title: id,
            content: 'Excluded standard public holiday',
            category: 'EXCLUDED_HOLIDAY',
            publishedAt: new Date(),
            expiresAt: new Date(),
          },
        });
      }
      return res.json({ message: 'Public holiday removed from calendar successfully.' });
    }

    const notice = await prisma.notice.findFirst({
      where: { id, tenantId },
    });

    if (!notice) {
      return res.status(404).json({ error: 'Calendar event not found.' });
    }

    await prisma.notice.delete({ where: { id } });

    return res.json({ message: 'Calendar event deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


