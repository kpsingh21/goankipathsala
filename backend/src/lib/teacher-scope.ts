import { prisma } from './prisma.js';

export interface TeacherScope {
  isTeacher: boolean;
  isAdmin: boolean;
  hasAccessToAll: boolean;
  sectionIds: string[];
  classGradeIds: string[];
  classGradeNames: string[];
}

/**
 * Returns the class and section scope for a teacher.
 * If user is admin/accountant, hasAccessToAll is true.
 * If user is teacher, retrieves sections where they are class teacher,
 * subjects they teach, and timetable entries assigned to them.
 */
export async function getTeacherClassScope(
  tenantId: string,
  userId: string,
  role: string
): Promise<TeacherScope> {
  const adminRoles = ['SUPERADMIN', 'SCHOOL_ADMIN', 'ADMIN', 'PRINCIPAL'];
  if (adminRoles.includes(role)) {
    return {
      isTeacher: false,
      isAdmin: true,
      hasAccessToAll: true,
      sectionIds: [],
      classGradeIds: [],
      classGradeNames: [],
    };
  }

  // Non-teaching specific roles (Accountant, Driver) do not have academic teacher scopes
  if (role === 'ACCOUNTANT' || role === 'DRIVER' || role === 'CASHIER') {
    return {
      isTeacher: false,
      isAdmin: false,
      hasAccessToAll: false,
      sectionIds: [],
      classGradeIds: [],
      classGradeNames: [],
    };
  }

  // 1. Sections where teacher is class teacher
  const headedSections = await prisma.section.findMany({
    where: { tenantId, classTeacherId: userId },
    include: { classGrade: true },
  });

  // 2. Curriculum subjects assigned to teacher
  const taughtSubjects = await prisma.curriculumSubject.findMany({
    where: { tenantId, teacherId: userId },
    include: { classGrade: true },
  });

  // 3. Timetable entries assigned to teacher (matches teacherUserId or teacherName)
  const teacherUser = await prisma.user.findFirst({
    where: { id: userId, tenantId },
    include: { staffProfile: true },
  });
  const teacherFullName = teacherUser?.staffProfile?.fullName?.trim();

  const timetableEntries = await prisma.timetableEntry.findMany({
    where: {
      tenantId,
      OR: [
        { teacherUserId: userId },
        ...(teacherFullName ? [{ teacherName: teacherFullName }] : []),
      ],
    },
    include: { classGrade: true, section: true },
  });

  const sectionIds = new Set<string>();
  const classGradeIds = new Set<string>();
  const classGradeNames = new Set<string>();

  for (const s of headedSections) {
    sectionIds.add(s.id);
    classGradeIds.add(s.classGradeId);
    if (s.classGrade?.name) classGradeNames.add(s.classGrade.name);
  }

  for (const sub of taughtSubjects) {
    classGradeIds.add(sub.classGradeId);
    if (sub.classGrade?.name) classGradeNames.add(sub.classGrade.name);
  }

  for (const t of timetableEntries) {
    if (t.sectionId) sectionIds.add(t.sectionId);
    if (t.classGradeId) classGradeIds.add(t.classGradeId);
    if (t.classGrade?.name) classGradeNames.add(t.classGrade.name);
  }

  return {
    isTeacher: true,
    isAdmin: false,
    hasAccessToAll: false,
    sectionIds: Array.from(sectionIds),
    classGradeIds: Array.from(classGradeIds),
    classGradeNames: Array.from(classGradeNames),
  };
}
