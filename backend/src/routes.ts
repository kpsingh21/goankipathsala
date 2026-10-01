import { Router } from 'express';
import {
  registerTenant,
  getCurrentTenant,
  listTenants,
  updateTenantLanding,
  updateTenantStatus,
  deleteTenant,
  updateTenantDetails,
} from './controllers/tenant.controller.js';
import {
  listClasses,
  createClass,
  updateClass,
  deleteClass,
} from './controllers/class.controller.js';
import {
  login,
  getMe,
  requestPasswordReset,
  confirmPasswordReset,
  adminResetUserPassword,
} from './controllers/auth.controller.js';
import { listStaff, createStaff, updateStaffRole, updateStaffProfile, deleteStaff, assignStaffRolesAndWorkload } from './controllers/staff.controller.js';
import { handleFileUpload } from './controllers/upload.controller.js';
import { listStudents, registerStudent, updateStudent, deleteStudent } from './controllers/student.controller.js';
import { bulkImportStudents, bulkImportStaff } from './controllers/import.controller.js';
import {
  getDailyAttendance,
  markAttendance,
  getMonthlyAttendance,
  seedMonthlyAttendance,
} from './controllers/attendance.controller.js';
import {
  listFeeStructures,
  createFeeStructure,
  generateClassInvoices,
  listInvoices,
  generateInvoice,
  recordPayment,
} from './controllers/fee.controller.js';
import {
  listExaminations,
  createExamination,
  recordExamMarks,
  recordBatchMarks,
  getStudentReportCard,
  getAggregateReportCard,
  getTeacherExamScope,
} from './controllers/exam.controller.js';
import { listNotices, createNotice, updateNotice, deleteNotice } from './controllers/notice.controller.js';
import { listBusRoutes, createOrUpdateBusRoute, updateBusRoute, deleteBusRoute } from './controllers/transport.controller.js';
import { listSubjects, createSubject, updateSubject, deleteSubject, assignSubjectTeacher } from './controllers/subject.controller.js';
import { getTimetable, upsertTimetableEntry } from './controllers/timetable.controller.js';
import { authenticate, authorize } from './middleware/auth.middleware.js';
import { UserRole } from '@prisma/client';

const router = Router();

// --------------------------------------------------
// Public & Tenant Management Endpoints
// --------------------------------------------------
router.get('/tenants', listTenants);
router.post('/tenants', registerTenant);
router.get('/tenants/current', getCurrentTenant);
router.put('/tenants/landing', authenticate, authorize(UserRole.SCHOOL_ADMIN), updateTenantLanding);
router.patch('/tenants/:id/status', updateTenantStatus);
router.delete('/tenants/:id', deleteTenant);
router.put('/tenants/:id', updateTenantDetails);

// --------------------------------------------------
// Class & Academic Grades Management (Pre-KG to 12)
// --------------------------------------------------
router.get('/classes', listClasses);
router.post('/classes', authenticate, authorize(UserRole.SCHOOL_ADMIN), createClass);
router.put('/classes/:id', authenticate, authorize(UserRole.SCHOOL_ADMIN), updateClass);
router.delete('/classes/:id', authenticate, authorize(UserRole.SCHOOL_ADMIN), deleteClass);


// --------------------------------------------------
// Authentication & Password Reset (School Scoped)
// --------------------------------------------------
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);
router.post('/auth/forgot-password', requestPasswordReset);
router.post('/auth/reset-password', confirmPasswordReset);
router.post(
  '/auth/admin-reset-password',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  adminResetUserPassword
);

// --------------------------------------------------
// Staff Management (School Admin only)
// --------------------------------------------------
router.get('/staff', authenticate, authorize(UserRole.SCHOOL_ADMIN), listStaff);
router.post('/staff', authenticate, authorize(UserRole.SCHOOL_ADMIN), createStaff);
router.post('/staff/bulk-import', authenticate, authorize(UserRole.SCHOOL_ADMIN), bulkImportStaff);
router.patch('/staff/role', authenticate, authorize(UserRole.SCHOOL_ADMIN), updateStaffRole);
router.put('/staff/profile', authenticate, authorize(UserRole.SCHOOL_ADMIN), updateStaffProfile);
router.post('/staff/assignments', authenticate, authorize(UserRole.SCHOOL_ADMIN), assignStaffRolesAndWorkload);
router.delete('/staff/:id', authenticate, authorize(UserRole.SCHOOL_ADMIN), deleteStaff);

// --------------------------------------------------
// Desktop File & Media Upload
// --------------------------------------------------
router.post('/upload', authenticate, handleFileUpload);

// --------------------------------------------------
// Student Management (Admin & Teachers)
// --------------------------------------------------
router.get(
  '/students',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT),
  listStudents
);
router.post(
  '/students',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  registerStudent
);
router.post(
  '/students/bulk-import',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  bulkImportStudents
);
router.put(
  '/students/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  updateStudent
);
router.delete(
  '/students/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  deleteStudent
);

// --------------------------------------------------
// Daily & Monthly Attendance Engine
// --------------------------------------------------
router.get(
  '/attendance',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  getDailyAttendance
);
router.post(
  '/attendance',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  markAttendance
);
router.get(
  '/attendance/monthly',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT),
  getMonthlyAttendance
);
router.post(
  '/attendance/seed-month',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  seedMonthlyAttendance
);

// --------------------------------------------------
// Fees & Financial Invoicing Engine
// --------------------------------------------------
router.get(
  '/fees/structures',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT, UserRole.TEACHER),
  listFeeStructures
);
router.post(
  '/fees/structures',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT),
  createFeeStructure
);
router.post(
  '/fees/generate-class-invoices',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT),
  generateClassInvoices
);
router.get(
  '/fees/invoices',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT, UserRole.TEACHER),
  listInvoices
);
router.post(
  '/fees/invoices',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT),
  generateInvoice
);
router.post(
  '/fees/pay',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT),
  recordPayment
);

// --------------------------------------------------
// Examination & Report Card Engine
// --------------------------------------------------
router.get(
  '/exams',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  listExaminations
);
router.post(
  '/exams',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  createExamination
);
router.post(
  '/exams/marks',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  recordExamMarks
);
router.post(
  '/exams/batch-marks',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  recordBatchMarks
);
router.get(
  '/exams/report-card',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  getStudentReportCard
);
router.get(
  '/exams/aggregate-report-card',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  getAggregateReportCard
);
router.get(
  '/exams/my-scope',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  getTeacherExamScope
);

// --------------------------------------------------
// Digital Notice Board & Circulars
// --------------------------------------------------
router.get('/notices', listNotices);
router.post(
  '/notices',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  createNotice
);
router.put(
  '/notices/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  updateNotice
);
router.delete(
  '/notices/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  deleteNotice
);

// --------------------------------------------------
// School Transport & Bus Routes
// --------------------------------------------------
router.get('/transport/routes', listBusRoutes);
router.post(
  '/transport/routes',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  createOrUpdateBusRoute
);
router.put(
  '/transport/routes/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  updateBusRoute
);
router.delete(
  '/transport/routes/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  deleteBusRoute
);

// --------------------------------------------------
// Subjects & Subject Teacher Assignment
// --------------------------------------------------
router.get(
  '/subjects',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN, UserRole.TEACHER),
  listSubjects
);
router.post(
  '/subjects',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  createSubject
);
router.put(
  '/subjects/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  updateSubject
);
router.delete(
  '/subjects/:id',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  deleteSubject
);
router.delete(
  '/subjects',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  deleteSubject
);
router.post(
  '/subjects/assign-teacher',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  assignSubjectTeacher
);


// --------------------------------------------------
// Weekly Timetable Engine
// --------------------------------------------------
router.get(
  '/timetable',
  getTimetable
);
router.post(
  '/timetable/entry',
  authenticate,
  authorize(UserRole.SCHOOL_ADMIN),
  upsertTimetableEntry
);

export default router;
