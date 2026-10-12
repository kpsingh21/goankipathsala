"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE } from "@/lib/config";
import * as XLSX from "xlsx";

import StudentSection from "./components/StudentSection";
import StaffSection from "./components/StaffSection";
import ClassesSection from "./components/ClassesSection";
import AttendanceSection from "./components/AttendanceSection";
import FeesSection from "./components/FeesSection";
import ResultSection from "./components/ResultSection";
import SubjectsSection from "./components/SubjectsSection";
import TimetableSection from "./components/TimetableSection";
import TransportSection from "./components/TransportSection";
import CalendarSection from "./components/CalendarSection";
import NoticesSection from "./components/NoticesSection";
import WebsiteSection from "./components/WebsiteSection";
import InquiriesSection from "./components/InquiriesSection";
import PayrollSection from "./components/PayrollSection";

interface FeeComponent {
  name: string;
  amount: string;
}


const SECTION_MAP: Record<string, "students" | "staff" | "classes" | "attendance" | "fees" | "exams" | "subjects" | "timetable" | "transport" | "notices" | "website" | "calendar" | "inquiries" | "payroll"> = {
  students: "students",
  student: "students",
  staff: "staff",
  teachers: "staff",
  teacher: "staff",
  faculty: "staff",
  classes: "classes",
  class: "classes",
  grade: "classes",
  grades: "classes",
  attendance: "attendance",
  fees: "fees",
  fee: "fees",
  exams: "exams",
  exam: "exams",
  subjects: "subjects",
  subject: "subjects",
  timetable: "timetable",
  transport: "transport",
  bus: "transport",
  notices: "notices",
  notice: "notices",
  website: "website",
  site: "website",
  calendar: "calendar",
  cal: "calendar",
  holiday: "calendar",
  holidays: "calendar",
  planner: "calendar",
  events: "calendar",
  inquiries: "inquiries",
  inquiry: "inquiries",
  admissions: "inquiries",
  admission: "inquiries",
  leads: "inquiries",
  payroll: "payroll",
  salaries: "payroll",
  salary: "payroll",
  payslip: "payroll",
  payslips: "payroll",
};

export default function SchoolDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const rawSection = Array.isArray(params?.section) ? params.section[0] : (params?.section as string | undefined);
  const initialSection = (rawSection && SECTION_MAP[rawSection.toLowerCase()]) || "students";

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<
    | "students"
    | "staff"
    | "classes"
    | "attendance"
    | "fees"
    | "exams"
    | "subjects"
    | "timetable"
    | "transport"
    | "notices"
    | "website"
    | "calendar"
    | "inquiries"
    | "payroll"
  >(initialSection);

  // Sync state whenever URL section parameter changes
  useEffect(() => {
    if (rawSection && SECTION_MAP[rawSection.toLowerCase()]) {
      setActiveSection(SECTION_MAP[rawSection.toLowerCase()]);
    }
  }, [rawSection]);

  // Navigate to section and update browser URL without full page reload
  const navigateToSection = (section: typeof activeSection) => {
    let allowedSection = section;
    const userRole = currentUser?.role;
    if (userRole === "DRIVER") {
      allowedSection = "transport";
    } else if (userRole === "ACCOUNTANT" || userRole === "CASHIER") {
      allowedSection = "fees";
    } else if (["CLASS_TEACHER", "SUBJECT_TEACHER", "TEACHER"].includes(userRole) && !["SCHOOL_ADMIN", "ADMIN", "PRINCIPAL", "SUPERADMIN"].includes(userRole)) {
      if (allowedSection === "staff" || allowedSection === "classes") {
        allowedSection = "students";
      }
    }

    setActiveSection(allowedSection);
    setMobileSidebarOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const mainEl = document.getElementById("dashboard-main-content");
      if (mainEl) mainEl.scrollTop = 0;
      if (slug) {
        const targetUrl = `/school/${slug}/dashboard/${allowedSection}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ section: allowedSection }, "", targetUrl);
        }
      }
    }
  };

  // Ensure scroll resets to top whenever active section changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const mainEl = document.getElementById("dashboard-main-content");
      if (mainEl) mainEl.scrollTop = 0;
    }
  }, [activeSection]);

  // Listen for browser forward/back button navigation
  useEffect(() => {
    const handlePopState = () => {
      const parts = window.location.pathname.split("/dashboard/");
      const userRole = currentUser?.role;
      if (parts.length > 1) {
        const sec = parts[1].split("/")[0].toLowerCase();
        if (SECTION_MAP[sec]) {
          let target = SECTION_MAP[sec];
          if (userRole === "DRIVER") target = "transport";
          if (userRole === "ACCOUNTANT" || userRole === "CASHIER") target = "fees";
          if (["CLASS_TEACHER", "SUBJECT_TEACHER", "TEACHER"].includes(userRole) && (target === "staff" || target === "classes")) {
            target = "students";
          }
          setActiveSection(target);
        }
      } else if (window.location.pathname.endsWith("/dashboard")) {
        let defSec: typeof activeSection = "students";
        if (userRole === "DRIVER") defSec = "transport";
        if (userRole === "ACCOUNTANT" || userRole === "CASHIER") defSec = "fees";
        setActiveSection(defSec);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentUser]);

  // Two-tab state for each section
  const [studentSubTab, setStudentSubTab] = useState<"list" | "create">("list");
  const [staffSubTab, setStaffSubTab] = useState<"list" | "create">("list");
  const [classSubTab, setClassSubTab] = useState<"list" | "create">("list");
  const [attendanceSubTab, setAttendanceSubTab] = useState<"monthly" | "daily">("monthly");
  const [feeSubTab, setFeeSubTab] = useState<"overview" | "invoices" | "catalog">("overview");
  const [feeRevenueSummary, setFeeRevenueSummary] = useState<any>(null);
  const [examSubTab, setExamSubTab] = useState<"report_cards" | "marks">("report_cards");
  const [subjectSubTab, setSubjectSubTab] = useState<"list" | "create">("list");
  const [timetableSubTab, setTimetableSubTab] = useState<"grid" | "edit">("grid");
  const [transportSubTab, setTransportSubTab] = useState<"list" | "create">("list");
  const [noticeSubTab, setNoticeSubTab] = useState<"list" | "create">("list");
  const [websiteSubTab, setWebsiteSubTab] = useState<"facilities" | "media">("facilities");

  // ==========================================
  // Academic Classes state (Pre-KG to 12)
  // ==========================================
  const [classesList, setClassesList] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [newClassOrder, setNewClassOrder] = useState("1");
  const [newClassSubjects, setNewClassSubjects] = useState<string[]>([
    "English Core",
    "Hindi Core",
    "Mathematics",
    "Science",
    "Social Science",
  ]);
  const [newClassCustomSubject, setNewClassCustomSubject] = useState("");
  const [editClassSubjects, setEditClassSubjects] = useState<string[]>([]);
  const [editClassCustomSubject, setEditClassCustomSubject] = useState("");
  const [editClassModal, setEditClassModal] = useState<any | null>(null);

  // Modals for Edit Notice, Route, Subject
  const [editNoticeModal, setEditNoticeModal] = useState<any | null>(null);
  const [editRouteModal, setEditRouteModal] = useState<any | null>(null);
  const [assignStudentRouteModal, setAssignStudentRouteModal] = useState<any | null>(null);
  const [routeStudentSelect, setRouteStudentSelect] = useState("");
  const [routeStopSelect, setRouteStopSelect] = useState("");
  const [routeAssignments, setRouteAssignments] = useState<Record<string, { studentId: string; studentName: string; admissionNo: string; stopName: string; phone?: string }[]>>({});

  const [editSubjectModal, setEditSubjectModal] = useState<any | null>(null);

  // Mobile & Tablet Sidebar State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("agy_sidebar_collapsed");
      if (saved !== null) {
        setDesktopSidebarCollapsed(saved === "true");
      }
    } catch (e) {}
  }, []);

  const toggleDesktopSidebar = () => {
    setDesktopSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("agy_sidebar_collapsed", String(next));
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        toggleDesktopSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global Confirmation / Alert Modal Popup State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const requestConfirm = ({
    title = "Confirm Action",
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    isDanger = true,
    onConfirm,
  }: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void | Promise<void>;
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      isDanger,
      onConfirm,
    });
  };

  // Excel Bulk Import state for Students
  const [studentImportModalOpen, setStudentImportModalOpen] = useState(false);
  const [studentImportRows, setStudentImportRows] = useState<any[]>([]);
  const [studentImportLoading, setStudentImportLoading] = useState(false);
  const [studentImportResult, setStudentImportResult] = useState<any | null>(null);
  const [studentImportFileName, setStudentImportFileName] = useState("");

  // Excel Bulk Import state for Staff
  const [staffImportModalOpen, setStaffImportModalOpen] = useState(false);
  const [staffImportRows, setStaffImportRows] = useState<any[]>([]);
  const [staffImportLoading, setStaffImportLoading] = useState(false);
  const [staffImportResult, setStaffImportResult] = useState<any | null>(null);
  const [staffImportFileName, setStaffImportFileName] = useState("");

  // Map Subject Modal State
  const [mapSubjectModalOpen, setMapSubjectModalOpen] = useState(false);
  const [mapSubjectClassGrade, setMapSubjectClassGrade] = useState("");
  const [mapSubjectName, setMapSubjectName] = useState("");
  const [mapSubjectBoard, setMapSubjectBoard] = useState("CBSE");
  const [mapSubjectTeacherId, setMapSubjectTeacherId] = useState("");
  const [mapSubjectLoading, setMapSubjectLoading] = useState(false);

  // Student Export with Filters State
  const [studentExportModalOpen, setStudentExportModalOpen] = useState(false);
  const [exportFilterClass, setExportFilterClass] = useState("ALL");
  const [exportFilterSection, setExportFilterSection] = useState("ALL");
  const [exportFilterGender, setExportFilterGender] = useState("ALL");
  const [exportFilterCategory, setExportFilterCategory] = useState("ALL");
  const [exportFilterBloodGroup, setExportFilterBloodGroup] = useState("ALL");
  const [exportFilterStatus, setExportFilterStatus] = useState("ALL");

  // Teacher scope & Batch Marks & Cumulative report card
  const [teacherScope, setTeacherScope] = useState<any>({
    role: "SCHOOL_ADMIN",
    canAccessAll: true,
    isClassTeacher: true,
    taughtSubjects: [],
  });
  const [reportCardMode, setReportCardMode] = useState<"SINGLE" | "CUMULATIVE">("CUMULATIVE");
  const [batchMarks, setBatchMarks] = useState<any[]>([
    { subjectName: "English", theoryMarks: "70", practicalMarks: "18", maxMarks: "100" },
    { subjectName: "Hindi", theoryMarks: "72", practicalMarks: "19", maxMarks: "100" },
    { subjectName: "Mathematics", theoryMarks: "68", practicalMarks: "20", maxMarks: "100" },
    { subjectName: "Science", theoryMarks: "65", practicalMarks: "24", maxMarks: "100" },
    { subjectName: "Social Science", theoryMarks: "74", practicalMarks: "16", maxMarks: "100" },
    { subjectName: "Computer Science", theoryMarks: "62", practicalMarks: "28", maxMarks: "100" },
  ]);


  // ==========================================
  // 1. Website & Facilities state
  // ==========================================
  const [landingConfig, setLandingConfig] = useState<any>({
    logoUrl: "",
    tagline: "",
    aboutText: "",
    principalName: "",
    principalMessage: "",
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    heroImage: "",
    galleryImages: [],
    videoGallery: [],
    facilities: [],
  });
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [newPhotoCategory, setNewPhotoCategory] = useState("Fun & Science");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityIcon, setNewFacilityIcon] = useState("🔬");
  const [newFacilityDesc, setNewFacilityDesc] = useState("");

  // ==========================================
  // 2. Notices state
  // ==========================================
  const [noticesList, setNoticesList] = useState<any[]>([]);
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [newNoticeCategory, setNewNoticeCategory] = useState("GENERAL");
  const [newNoticePriority, setNewNoticePriority] = useState("NORMAL");
  const [newNoticeAudience, setNewNoticeAudience] = useState("ALL");
  const [newNoticeIsPinned, setNewNoticeIsPinned] = useState(false);

  // ==========================================
  // 3. Staff state & Filters
  // ==========================================
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffSearch, setStaffSearch] = useState("");
  const [staffFilterRole, setStaffFilterRole] = useState("ALL");
  const [staffFilterDept, setStaffFilterDept] = useState("ALL");
  const [staffCategoryTab, setStaffCategoryTab] = useState<"ALL" | "TEACHING" | "NON_TEACHING">("ALL");
  const [newStaffEmployeeNo, setNewStaffEmployeeNo] = useState(() => `EMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  const [newStaffFullName, setNewStaffFullName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("CLASS_TEACHER");
  const [newStaffDesignation, setNewStaffDesignation] = useState("Senior Teacher");
  const [newStaffQualification, setNewStaffQualification] = useState("B.Ed, M.Sc");
  const [newStaffDepartment, setNewStaffDepartment] = useState("Science & Maths");
  const [newStaffAadhar, setNewStaffAadhar] = useState("");
  const [newStaffExperience, setNewStaffExperience] = useState("5");
  const [newStaffEmergencyPhone, setNewStaffEmergencyPhone] = useState("");
  const [newStaffBloodGroup, setNewStaffBloodGroup] = useState("O+");
  const [newStaffAvatarUrl, setNewStaffAvatarUrl] = useState("");
  const [newStaffAddress, setNewStaffAddress] = useState("");
  const [newStaffSectionId, setNewStaffSectionId] = useState("");
  const [newStaffClassFilter, setNewStaffClassFilter] = useState("");
  const [newStaffSubjectIds, setNewStaffSubjectIds] = useState<string[]>([]);
  const [newStaffBusRouteId, setNewStaffBusRouteId] = useState("");

  // ==========================================
  // 4. Student SIS state & Filters
  // ==========================================
  const [studentList, setStudentList] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilterClass, setStudentFilterClass] = useState("ALL");
  const [studentFilterSection, setStudentFilterSection] = useState("ALL");
  const [studentFilterCategory, setStudentFilterCategory] = useState("ALL");

  const [admissionNo, setAdmissionNo] = useState(() => `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [rollNo, setRollNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentAvatarUrl, setStudentAvatarUrl] = useState("");
  const [dob, setDob] = useState("2012-05-15");
  const [gender, setGender] = useState("MALE");
  const [aadharNumber, setAadharNumber] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [guardianOccupation, setGuardianOccupation] = useState("Farmer / Business");
  const [villageCity, setVillageCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressText, setAddressText] = useState("");
  const [className, setClassName] = useState("Class 6");
  const [sectionName, setSectionName] = useState("A");

  // Edit Student Modal state
  const [editModalStudent, setEditModalStudent] = useState<any | null>(null);

  // ==========================================
  // 5. Attendance state
  // ==========================================
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<{ [enrollmentId: string]: string }>({});
  const [monthlyAttendanceMonth, setMonthlyAttendanceMonth] = useState(
    new Date().toISOString().slice(0, 7) // "YYYY-MM"
  );
  const [monthlyAttendanceList, setMonthlyAttendanceList] = useState<any[]>([]);
  const [seedMonthlyLoading, setSeedMonthlyLoading] = useState(false);

  // ==========================================
  // 6. Subjects state
  // ==========================================
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [allSchoolSubjects, setAllSchoolSubjects] = useState<any[]>([]);
  const [subjectClassGrade, setSubjectClassGrade] = useState("ALL");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectBoard, setNewSubjectBoard] = useState("CBSE");
  const [newSubjectTeacherId, setNewSubjectTeacherId] = useState("");

  // ==========================================
  // 7. Timetable state
  // ==========================================
  const [timetableEntries, setTimetableEntries] = useState<any[]>([]);
  const [timetableClassGrade, setTimetableClassGrade] = useState("Class 6");
  const [editSlotModal, setEditSlotModal] = useState<any | null>(null);

  // ==========================================
  // 8. Transport state
  // ==========================================
  const [busRoutesList, setBusRoutesList] = useState<any[]>([]);
  const [newRouteNumber, setNewRouteNumber] = useState("R-03");
  const [newRouteName, setNewRouteName] = useState("Semliya - Hatod - Badgonda Express");
  const [newVehicleNumber, setNewVehicleNumber] = useState("MP-09-EF-9012");
  const [newDriverName, setNewDriverName] = useState("Gopal Singh Parmar");
  const [newDriverPhone, setNewDriverPhone] = useState("+91 98262 33445");
  const [newDriverUserId, setNewDriverUserId] = useState("");
  const [newConductorName, setNewConductorName] = useState("Mohan Lal");
  const [newConductorPhone, setNewConductorPhone] = useState("+91 98262 88990");
  const [newConductorUserId, setNewConductorUserId] = useState("");
  const [newPickupTime, setNewPickupTime] = useState("07:25 AM");
  const [newDropTime, setNewDropTime] = useState("02:40 PM");
  const [newCapacity, setNewCapacity] = useState("32");
  const [newMonthlyFee, setNewMonthlyFee] = useState("500");
  const [newStopsInput, setNewStopsInput] = useState(
    "Semliya Chaupal (07:25 AM), Hatod Square (07:40 AM), Badgonda (07:55 AM), School Campus (08:15 AM)"
  );

  // ==========================================
  // 9. Fees state
  // ==========================================
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [newFeeName, setNewFeeName] = useState("Term 1 Composite School Fee");
  const [newFeeClassGrade, setNewFeeClassGrade] = useState("Class 6");
  const [newFeeDueDate, setNewFeeDueDate] = useState("2026-10-15");
  const [newFeeFrequency, setNewFeeFrequency] = useState("QUARTERLY");
  const [newFeeLateFine, setNewFeeLateFine] = useState("5");
  const [newFeeDesc, setNewFeeDesc] = useState("Includes tuition, lab maintenance and term exams");
  // Document upload states for Students
  const [studentAadharDoc, setStudentAadharDoc] = useState("");
  const [studentTcDoc, setStudentTcDoc] = useState("");
  const [studentMarksheetDoc, setStudentMarksheetDoc] = useState("");

  // Document upload states for Staff
  const [staffAadharDoc, setStaffAadharDoc] = useState("");
  const [staffDegreeDoc, setStaffDegreeDoc] = useState("");
  const [staffResumeDoc, setStaffResumeDoc] = useState("");
  const [staffExpDoc, setStaffExpDoc] = useState("");

  // Multiple applicable classes state for Fee Structure
  const [newFeeClasses, setNewFeeClasses] = useState<string[]>([]);
  const [feeFilterClass, setFeeFilterClass] = useState<string>("ALL");
  const [feeFilterStructure, setFeeFilterStructure] = useState<string>("ALL");
  const [feeFilterStatus, setFeeFilterStatus] = useState<string>("ALL");

  // Staff Attendance states
  const [attendanceType, setAttendanceType] = useState<"students" | "staff">("students");
  const [staffAttendanceDate, setStaffAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [staffAttendanceStatus, setStaffAttendanceStatus] = useState<Record<string, "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY">>({});
  const [staffAttendanceNotes, setStaffAttendanceNotes] = useState<Record<string, string>>({});
  const [studentAttendanceNotes, setStudentAttendanceNotes] = useState<Record<string, string>>({});
  const [studentAttendanceClassFilter, setStudentAttendanceClassFilter] = useState<string>("ALL");

  // School Calendar & Holiday Planner states
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [calendarViewMode, setCalendarViewMode] = useState<"month" | "list">("month");
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(() => new Date());
  const [calendarFilter, setCalendarFilter] = useState<string>("ALL");
  const [addCalendarModal, setAddCalendarModal] = useState(false);
  const [newCalTitle, setNewCalTitle] = useState("");
  const [newCalCategory, setNewCalCategory] = useState("HOLIDAY");
  const [newCalStartDate, setNewCalStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [newCalEndDate, setNewCalEndDate] = useState("");
  const [newCalDesc, setNewCalDesc] = useState("");
  const [newCalTargetAudience, setNewCalTargetAudience] = useState("ALL");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<{ dateStr: string; events: any[] } | null>(null);
  const [editCalendarModal, setEditCalendarModal] = useState<any | null>(null);
  const [editCalTitle, setEditCalTitle] = useState("");
  const [editCalCategory, setEditCalCategory] = useState("HOLIDAY");
  const [editCalStartDate, setEditCalStartDate] = useState("");
  const [editCalEndDate, setEditCalEndDate] = useState("");
  const [editCalDesc, setEditCalDesc] = useState("");
  const [editCalTargetAudience, setEditCalTargetAudience] = useState("ALL");

  // School Admission & Contact Inquiries states
  const [schoolInquiries, setSchoolInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("ALL");
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>("ALL");
  const [inquirySearch, setInquirySearch] = useState<string>("");
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  // Template Designer / Look & Feel Settings
  const [templateCustomizerModal, setTemplateCustomizerModal] = useState<"id_card" | "report_card" | null>(null);

  const [idCardConfig, setIdCardConfig] = useState({
    showSchoolLogo: true,
    showFatherName: true,
    showBloodGroup: true,
    showParentPhone: true,
    showAddress: true,
    showBarcode: true,
    showPrincipalSignature: true,
    themeColor: "blue",
  });

  const [reportCardConfig, setReportCardConfig] = useState({
    showSchoolHeader: true,
    showAffiliationNo: true,
    showStudentPhoto: true,
    showAttendanceStats: true,
    showTeacherRemarks: true,
    showGradingScale: true,
    showPrincipalSignature: true,
    showClassTeacherSignature: true,
    showCoScholastic: true,
    themeColor: "blue",
  });

  // Bulk ID Cards Print state
  const [selectedStudentIdsForIdCard, setSelectedStudentIdsForIdCard] = useState<string[]>([]);
  const [bulkPrintIdCardsStudents, setBulkPrintIdCardsStudents] = useState<any[] | null>(null);

  // Report Card Directory Filters
  const [reportCardClassFilter, setReportCardClassFilter] = useState<string>("ALL");
  const [reportCardSectionFilter, setReportCardSectionFilter] = useState<string>("ALL");
  const [reportCardSearch, setReportCardSearch] = useState<string>("");

  // Bulk Fee Invoices Print state
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [bulkPrintInvoicesModal, setBulkPrintInvoicesModal] = useState<any[] | null>(null);

  // Staff Monthly Attendance Month
  const [staffMonthlyMonth, setStaffMonthlyMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const [feeComponents, setFeeComponents] = useState<FeeComponent[]>([
    { name: "Tuition Fee", amount: "1800" },
    { name: "Computer & Science Lab", amount: "300" },
    { name: "Examination Fee", amount: "200" },
    { name: "Sports & Library", amount: "150" },
  ]);

  // ==========================================
  // 10. Exams state
  // ==========================================
  const [examsList, setExamsList] = useState<any[]>([]);
  const [newExamName, setNewExamName] = useState("Mid-Term Examination 2026");
  const [newExamStartDate, setNewExamStartDate] = useState("2026-09-10");
  const [newExamEndDate, setNewExamEndDate] = useState("2026-09-20");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [markSubject, setMarkSubject] = useState("Mathematics");
  const [markStudentEnrollmentId, setMarkStudentEnrollmentId] = useState("");
  const [markTheoryMarks, setMarkTheoryMarks] = useState("68");
  const [markPracticalMarks, setMarkPracticalMarks] = useState("18");
  const [marksMax, setMarksMax] = useState("100");
  const [markRemarks, setMarkRemarks] = useState("Excellent understanding of concepts");
  const [viewReportCard, setViewReportCard] = useState<any | null>(null);

  // Modals state
  const [resetModalUser, setResetModalUser] = useState<any | null>(null);
  const [overridePassword, setOverridePassword] = useState("");
  const [profileModalStudent, setProfileModalStudent] = useState<any | null>(null);
  const [profileModalStaff, setProfileModalStaff] = useState<any | null>(null);

  // New Feature Modals state (ID Card, Fee Invoice Receipt, Staff Workload Assignment)
  const [viewIdCardStudent, setViewIdCardStudent] = useState<any | null>(null);
  const [viewInvoiceReceipt, setViewInvoiceReceipt] = useState<any | null>(null);
  const [assignModalStaff, setAssignModalStaff] = useState<any | null>(null);
  const [assignRole, setAssignRole] = useState("CLASS_TEACHER");
  const [assignSectionId, setAssignSectionId] = useState("");
  const [assignClassFilter, setAssignClassFilter] = useState("");
  const [assignSubjectIds, setAssignSubjectIds] = useState<string[]>([]);
  const [assignBusRouteId, setAssignBusRouteId] = useState("");

  // Staff Payroll & Salary Management States
  const [payrollRuns, setPayrollRuns] = useState<any[]>([]);
  const [payrollStaffList, setPayrollStaffList] = useState<any[]>([]);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [selectedPayrollMonth, setSelectedPayrollMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [payrollSubTab, setPayrollSubTab] = useState<"runs" | "structures">("runs");
  const [viewPayslipModal, setViewPayslipModal] = useState<any | null>(null);
  const [markPaidModal, setMarkPaidModal] = useState<any | null>(null);
  const [markPaymentMode, setMarkPaymentMode] = useState<string>("BANK_TRANSFER");
  const [markTxnRef, setMarkTxnRef] = useState<string>("");
  const [markPayRemarks, setMarkPayRemarks] = useState<string>("");
  const [editSalaryStructureStaff, setEditSalaryStructureStaff] = useState<any | null>(null);
  const [editStructureForm, setEditStructureForm] = useState({
    baseSalary: 25000,
    hra: 5000,
    da: 2500,
    travelAllowance: 1000,
    specialAllowance: 500,
    pfDeduction: 3000,
    taxDeduction: 200,
    paymentMode: "BANK_TRANSFER",
    bankAccountNo: "",
    bankIfsc: "",
    panNumber: "",
  });
  const [payrollSearch, setPayrollSearch] = useState<string>("");
  const [payrollStatusFilter, setPayrollStatusFilter] = useState<string>("ALL");
  const [generatingPayroll, setGeneratingPayroll] = useState(false);
  const [uploadingDesktopMedia, setUploadingDesktopMedia] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [classInvoiceGenModal, setClassInvoiceGenModal] = useState(false);
  const [classInvoiceGenClass, setClassInvoiceGenClass] = useState("Class 6");
  const [classInvoiceGenStructureId, setClassInvoiceGenStructureId] = useState("");
  const [adjustInvoiceModal, setAdjustInvoiceModal] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<"ADD" | "SUBTRACT" | "SET_REMAINING">("ADD");
  const [adjustAmount, setAdjustAmount] = useState<string>("500");
  const [adjustReason, setAdjustReason] = useState<string>("");

  // Student Promotion & Academic Session Rollover States
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [promoteSourceClass, setPromoteSourceClass] = useState("");
  const [promoteSelectedStudentIds, setPromoteSelectedStudentIds] = useState<string[]>([]);
  const [promoteTargetClass, setPromoteTargetClass] = useState("");
  const [promoteTargetSection, setPromoteTargetSection] = useState("A");
  const [promoteTargetYear, setPromoteTargetYear] = useState("2027-2028");
  const [promoteIsGraduation, setPromoteIsGraduation] = useState(false);
  const [promotingStudents, setPromotingStudents] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("gkp_token") : null;

  // Role authorization helpers
  const isAdmin = currentUser && ["SCHOOL_ADMIN", "ADMIN", "PRINCIPAL", "SUPERADMIN"].includes(currentUser.role);
  const isTeacher = currentUser && ["CLASS_TEACHER", "SUBJECT_TEACHER", "TEACHER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isClassTeacher = currentUser && ["CLASS_TEACHER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isSubjectTeacher = currentUser && ["SUBJECT_TEACHER", "CLASS_TEACHER", "TEACHER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isAccountant = currentUser && ["ACCOUNTANT", "CASHIER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isAccountantOnly = currentUser && ["ACCOUNTANT", "CASHIER"].includes(currentUser.role) && !isAdmin;
  const isDriver = currentUser && ["DRIVER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isDriverOnly = currentUser && currentUser.role === "DRIVER" && !isAdmin;
  const isTeacherOnly = currentUser && ["CLASS_TEACHER", "SUBJECT_TEACHER", "TEACHER"].includes(currentUser.role) && !isAdmin && !isAccountant;

  const teacherClassNames: string[] = Array.from(
    new Set([
      ...(teacherScope?.headedSections?.map((s: any) => s.className) || []),
      ...(teacherScope?.taughtSubjects?.map((s: any) => s.className) || []),
      ...(currentUser?.teacherScope?.classGradeNames || []),
    ].filter(Boolean))
  ) as string[];

  useEffect(() => {
    const storedUser = localStorage.getItem("gkp_user");
    if (!token || !storedUser) {
      router.push(`/school/${slug}/portal/login`);
      return;
    }
    const user = JSON.parse(storedUser);
    setCurrentUser(user);
    if (user.logoUrl) {
      setLandingConfig((prev: any) => ({ ...prev, logoUrl: user.logoUrl }));
    }

    try {
      const savedIdCard = localStorage.getItem("gkp_id_card_config");
      if (savedIdCard) setIdCardConfig(JSON.parse(savedIdCard));
      const savedReportCard = localStorage.getItem("gkp_report_card_config");
      if (savedReportCard) setReportCardConfig(JSON.parse(savedReportCard));
    } catch (e) {
      console.warn("Failed to parse template configs", e);
    }

    // Role-based section enforcement:
    // Accountant/Cashier sees fees only; Driver sees transport only; Teachers cannot see staff/classes
    let targetSec: typeof activeSection = (rawSection && SECTION_MAP[rawSection.toLowerCase()]) || "students";
    if (user.role === "DRIVER") {
      targetSec = "transport";
    } else if (user.role === "ACCOUNTANT" || user.role === "CASHIER") {
      targetSec = "fees";
    } else if (["CLASS_TEACHER", "SUBJECT_TEACHER", "TEACHER"].includes(user.role) && !["SCHOOL_ADMIN", "ADMIN", "PRINCIPAL", "SUPERADMIN"].includes(user.role)) {
      if (targetSec === "staff" || targetSec === "classes") {
        targetSec = "students";
      }
      setFeeSubTab("catalog");
    }
    setActiveSection(targetSec);
    if (typeof window !== "undefined" && slug) {
      window.history.replaceState({ section: targetSec }, "", `/school/${slug}/dashboard/${targetSec}`);
    }

    fetchLandingData();
    fetchStaff();
    fetchStudents();
    fetchClasses();
    fetchTeacherScope();
    fetchNotices();
    fetchBusRoutes();
    fetchSubjects(subjectClassGrade);
    fetchTimetable(timetableClassGrade);
    fetchMonthlyAttendance(monthlyAttendanceMonth);
    fetchFeeData();
    fetchFeeRevenueSummary();
    fetchExams();
    fetchCalendarEvents();
    fetchSchoolInquiries();
    fetchPayrollData();
  }, [slug]);

  // ==========================================
  // DATA FETCHERS
  // ==========================================
  const fetchLandingData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tenants/current`, {
        headers: { "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const d = await res.json();
        if (d.tenant?.landingConfig) {
          setLandingConfig(d.tenant.landingConfig);
        }
      }
    } catch (e) {}
  };

  const fetchStaff = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/staff`, {
        headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.staff || []);
      }
    } catch (e) {}
  };

  const fetchStudents = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/students`, {
        headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const data = await res.json();
        const studs = data.students || [];
        setStudentList(studs);
        const initialAtt: any = {};
        studs.forEach((s: any) => {
          if (s.enrollments?.[0]) {
            initialAtt[s.enrollments[0].id] = "PRESENT";
          }
        });
        setAttendanceStatusMap(initialAtt);
      }
    } catch (e) {}
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notices`, {
        headers: { "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const d = await res.json();
        setNoticesList(d.notices || []);
      }
    } catch (e) {}
  };

  const fetchCalendarEvents = async () => {
    try {
      const headers: Record<string, string> = { "X-Tenant-Slug": slug };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/calendar/events`, { headers });
      if (res.ok) {
        const text = await res.text();
        try {
          const d = JSON.parse(text);
          if (d && Array.isArray(d.events)) {
            setCalendarEvents(d.events);
          }
        } catch (parseErr) {
          console.warn("Calendar API returned non-JSON response:", text.slice(0, 100));
        }
      }
    } catch (e) {}
  };

  const fetchSchoolInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const headers: Record<string, string> = { "X-Tenant-Slug": slug };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/tenants/inquiries`, { headers });
      if (res.ok) {
        const text = await res.text();
        try {
          const d = JSON.parse(text);
          if (d && Array.isArray(d.inquiries)) {
            setSchoolInquiries(d.inquiries);
          }
        } catch (parseErr) {
          console.warn("Inquiries API returned non-JSON response:", text.slice(0, 100));
        }
      }
    } catch (e) {
      console.error("Failed to load school inquiries", e);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleUpdateSchoolInquiryStatus = async (id: string, newStatus: string, notes?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Tenant-Slug": slug,
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/tenants/inquiries/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus, notes }),
      });
      if (res.ok) {
        setSchoolInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id ? { ...inq, status: newStatus, ...(notes !== undefined && { notes }) } : inq
          )
        );
        setMsg({ type: "success", text: "Inquiry status updated successfully!" });
      }
    } catch (e) {
      console.error("Failed to update inquiry status", e);
    }
  };

  const handleDeleteSchoolInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry record?")) return;
    try {
      const headers: Record<string, string> = { "X-Tenant-Slug": slug };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/tenants/inquiries/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setSchoolInquiries((prev) => prev.filter((inq) => inq.id !== id));
        setSelectedInquiry(null);
        setMsg({ type: "success", text: "Inquiry record deleted successfully!" });
      }
    } catch (e) {
      console.error("Failed to delete inquiry", e);
    }
  };

  // Staff Payroll & Salary Handlers
  const fetchPayrollData = async () => {
    if (!token) return;
    try {
      setPayrollLoading(true);
      const [runsRes, staffRes] = await Promise.all([
        fetch(`${API_BASE}/api/payroll/runs`, {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }),
        fetch(`${API_BASE}/api/payroll/staff`, {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }),
      ]);
      if (runsRes.ok) {
        const rData = await runsRes.json();
        setPayrollRuns(rData.runs || []);
      }
      if (staffRes.ok) {
        const sData = await staffRes.json();
        setPayrollStaffList(sData.staff || []);
      }
    } catch (err) {
      console.error("Failed to fetch payroll data:", err);
    } finally {
      setPayrollLoading(false);
    }
  };

  const handleGeneratePayroll = async (targetMonth?: string) => {
    if (!token) return;
    const month = targetMonth || selectedPayrollMonth;
    try {
      setGeneratingPayroll(true);
      const res = await fetch(`${API_BASE}/api/payroll/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ month }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: data.message || `Payroll calculated for ${month}!` });
        fetchPayrollData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to generate payroll." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to generate payroll." });
    } finally {
      setGeneratingPayroll(false);
    }
  };

  const handleOpenSalaryStructureModal = (staff: any) => {
    setEditSalaryStructureStaff(staff);
    const existing = staff.salaryStructure;
    setEditStructureForm({
      baseSalary: existing?.baseSalary ?? 25000,
      hra: existing?.hra ?? 5000,
      da: existing?.da ?? 2500,
      travelAllowance: existing?.travelAllowance ?? 1000,
      specialAllowance: existing?.specialAllowance ?? 500,
      pfDeduction: existing?.pfDeduction ?? 3000,
      taxDeduction: existing?.taxDeduction ?? 200,
      paymentMode: existing?.paymentMode || "BANK_TRANSFER",
      bankAccountNo: existing?.bankAccountNo || "",
      bankIfsc: existing?.bankIfsc || "",
      panNumber: existing?.panNumber || "",
    });
  };

  const handleSaveSalaryStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editSalaryStructureStaff) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/payroll/structure/${editSalaryStructureStaff.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify(editStructureForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: `Salary structure updated for ${editSalaryStructureStaff.fullName}!` });
        setEditSalaryStructureStaff(null);
        fetchPayrollData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to save salary structure." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save salary structure." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMarkPaidModal = (payslip: any) => {
    setMarkPaidModal(payslip);
    setMarkPaymentMode(payslip.paymentMode || "BANK_TRANSFER");
    setMarkTxnRef(payslip.transactionRef || "");
    setMarkPayRemarks(payslip.remarks || "");
  };

  const handleSaveMarkPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !markPaidModal) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/payroll/payslips/${markPaidModal.id}/pay`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          paymentStatus: "PAID",
          paymentMode: markPaymentMode,
          transactionRef: markTxnRef,
          remarks: markPayRemarks,
          paymentDate: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: `Payment recorded as PAID for ${markPaidModal.staffName}!` });
        setMarkPaidModal(null);
        fetchPayrollData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to record payment." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update payment status." });
    } finally {
      setLoading(false);
    }
  };

  // Student Promotion Handlers
  const handleOpenPromotionModal = (sourceClass?: string) => {
    const defaultSource = sourceClass || (classesList[0]?.name || "");
    setPromoteSourceClass(defaultSource);
    const classStudents = studentList.filter((s) => {
      const clsName = s.enrollments?.[0]?.section?.classGrade?.name;
      return clsName && defaultSource ? clsName.trim().toLowerCase() === defaultSource.trim().toLowerCase() : false;
    });
    setPromoteSelectedStudentIds(classStudents.map((s) => s.id));
    const currentIndex = classesList.findIndex(
      (c) => c.name.trim().toLowerCase() === defaultSource.trim().toLowerCase()
    );
    if (currentIndex !== -1 && currentIndex < classesList.length - 1) {
      setPromoteTargetClass(classesList[currentIndex + 1].name);
    } else {
      setPromoteTargetClass("");
    }
    setPromoteTargetSection("A");
    setPromoteTargetYear("2027-2028");
    setPromoteIsGraduation(false);
    setPromoteModalOpen(true);
  };

  const handleSourceClassChange = (newSource: string) => {
    setPromoteSourceClass(newSource);
    const classStudents = studentList.filter((s) => {
      const clsName = s.enrollments?.[0]?.section?.classGrade?.name;
      return clsName && newSource ? clsName.trim().toLowerCase() === newSource.trim().toLowerCase() : false;
    });
    setPromoteSelectedStudentIds(classStudents.map((s) => s.id));
    const currentIndex = classesList.findIndex(
      (c) => c.name.trim().toLowerCase() === newSource.trim().toLowerCase()
    );
    if (currentIndex !== -1 && currentIndex < classesList.length - 1) {
      setPromoteTargetClass(classesList[currentIndex + 1].name);
    } else {
      setPromoteTargetClass("");
    }
  };

  const handleToggleSelectAllPromote = () => {
    const classStudents = studentList.filter((s) => {
      const clsName = s.enrollments?.[0]?.section?.classGrade?.name;
      return clsName && promoteSourceClass
        ? clsName.trim().toLowerCase() === promoteSourceClass.trim().toLowerCase()
        : false;
    });
    if (promoteSelectedStudentIds.length === classStudents.length) {
      setPromoteSelectedStudentIds([]);
    } else {
      setPromoteSelectedStudentIds(classStudents.map((s) => s.id));
    }
  };

  const handleToggleStudentPromote = (id: string) => {
    setPromoteSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecutePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (promoteSelectedStudentIds.length === 0) {
      setMsg({ type: "error", text: "Please select at least one student to promote." });
      return;
    }
    if (!promoteIsGraduation && (!promoteTargetClass.trim() || !promoteTargetSection.trim())) {
      setMsg({ type: "error", text: "Please specify target class and section." });
      return;
    }

    try {
      setPromotingStudents(true);
      const res = await fetch(`${API_BASE}/api/students/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          studentIds: promoteSelectedStudentIds,
          targetClassGradeName: promoteTargetClass.trim(),
          targetSectionName: promoteTargetSection.trim(),
          targetAcademicYearName: promoteTargetYear.trim(),
          isGraduation: promoteIsGraduation,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: data.message || `Students promoted successfully!` });
        setPromoteModalOpen(false);
        fetchStudents();
        fetchClasses();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to promote students." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to promote students." });
    } finally {
      setPromotingStudents(false);
    }
  };

  const fetchFeeRevenueSummary = async () => {
    try {
      const headers: Record<string, string> = { "X-Tenant-Slug": slug };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/fees/revenue-summary`, { headers });
      const text = await res.text();
      try {
        const d = JSON.parse(text);
        if (d && d.summary) {
          setFeeRevenueSummary(d);
        }
      } catch (parseErr) {
        console.warn("Fee Revenue Summary returned non-JSON response:", text.slice(0, 100));
      }
    } catch (e) {}
  };

  const handleCreateCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalTitle.trim() || !newCalStartDate) {
      setMsg({ type: "error", text: "Please enter an event title and start date." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/calendar/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          title: newCalTitle.trim(),
          category: newCalCategory,
          startDate: newCalStartDate,
          endDate: newCalEndDate || newCalStartDate,
          description: newCalDesc,
          targetAudience: newCalTargetAudience,
        }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        data = { error: "Failed to schedule event. Server returned non-JSON response." };
      }

      if (res.ok) {
        setMsg({ type: "success", text: "Calendar event scheduled successfully!" });
        setAddCalendarModal(false);
        setNewCalTitle("");
        setNewCalDesc("");
        setNewCalEndDate("");
        fetchCalendarEvents();
      } else {
        setMsg({ type: "error", text: data.error || data.message || "Failed to schedule event." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to schedule event." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCalendarEvent = (id: string, title: string) => {
    requestConfirm({
      title: "Remove Calendar Event",
      message: `Are you sure you want to remove "${title}" from the calendar?`,
      confirmText: "Yes, Remove",
      isDanger: true,
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_BASE}/api/calendar/events/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-Slug": slug,
            },
          });
          const text = await res.text();
          let data: any = {};
          try {
            data = JSON.parse(text);
          } catch (err) {
            data = { error: "Failed to delete event. Server returned non-JSON response." };
          }

          if (res.ok) {
            setMsg({ type: "success", text: `Event "${title}" removed successfully.` });
            fetchCalendarEvents();
            if (selectedCalendarDay) {
              setSelectedCalendarDay((prev) => prev ? { ...prev, events: prev.events.filter(ev => ev.id !== id) } : null);
            }
          } else {
            setMsg({ type: "error", text: data.error || data.message || "Failed to delete event." });
          }
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to delete event." });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleOpenEditCalendarEvent = (ev: any) => {
    setEditCalendarModal(ev);
    setEditCalTitle(ev.title || "");
    setEditCalCategory(ev.category || "HOLIDAY");
    setEditCalStartDate(ev.startDate || "");
    setEditCalEndDate(ev.endDate || ev.startDate || "");
    setEditCalDesc(ev.description || "");
    setEditCalTargetAudience(ev.targetAudience || "ALL");
  };

  const handleUpdateCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCalendarModal || !editCalTitle.trim() || !editCalStartDate) {
      setMsg({ type: "error", text: "Please enter an event title and start date." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/calendar/events/${editCalendarModal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          title: editCalTitle.trim(),
          category: editCalCategory,
          startDate: editCalStartDate,
          endDate: editCalEndDate || editCalStartDate,
          description: editCalDesc,
          targetAudience: editCalTargetAudience,
        }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        data = { error: "Failed to update event. Server returned non-JSON response." };
      }

      if (res.ok) {
        setMsg({ type: "success", text: "Calendar event updated successfully!" });
        setEditCalendarModal(null);
        fetchCalendarEvents();
        if (selectedCalendarDay) {
          setSelectedCalendarDay((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              events: prev.events.map((ev) => (ev.id === editCalendarModal.id ? { ...ev, ...data.event } : ev)),
            };
          });
        }
      } else {
        setMsg({ type: "error", text: data.error || data.message || "Failed to update event." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update event." });
    } finally {
      setLoading(false);
    }
  };

  const fetchBusRoutes = async () => {
    try {
      const headers: Record<string, string> = { "X-Tenant-Slug": slug };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE}/api/transport/routes`, {
        headers,
      });
      if (res.ok) {
        const d = await res.json();
        setBusRoutesList(d.routes || []);
      }
    } catch (e) {}
  };

  const fetchSubjects = async (gradeName?: string) => {
    if (!token) return;
    try {
      const q = gradeName && gradeName !== "ALL" ? `?classGradeName=${encodeURIComponent(gradeName)}` : "";
      const res = await fetch(
        `${API_BASE}/api/subjects${q}`,
        {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }
      );
      if (res.ok) {
        const d = await res.json();
        setSubjectsList(d.subjects || []);
      }
      // Also fetch all subjects across the school for dropdowns/workload assignment
      const allRes = await fetch(`${API_BASE}/api/subjects`, {
        headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
      });
      if (allRes.ok) {
        const dAll = await allRes.json();
        setAllSchoolSubjects(dAll.subjects || []);
      }
    } catch (e) {}
  };

  const fetchTimetable = async (gradeName: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/timetable?classGradeName=${encodeURIComponent(gradeName)}`,
        {
          headers: { "X-Tenant-Slug": slug },
        }
      );
      if (res.ok) {
        const d = await res.json();
        setTimetableEntries(d.timetable || []);
      }
    } catch (e) {}
  };

  const fetchMonthlyAttendance = async (month: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/attendance/monthly?month=${encodeURIComponent(month)}`,
        {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }
      );
      if (res.ok) {
        const d = await res.json();
        const raw = d.summaries || d.attendance || [];
        const normalized = raw.map((item: any) => ({
          ...item,
          studentName: item.studentName || item.fullName || "Student",
          classGrade: item.classGrade || item.className || "Class 6",
          section: item.section || item.sectionName || "A",
          totalRecordedDays: item.totalRecordedDays ?? item.totalRecorded ?? 0,
        }));
        setMonthlyAttendanceList(normalized);
      }
    } catch (e) {}
  };

  const fetchFeeData = async () => {
    if (!token) return;
    try {
      const [resStructures, resInvoices] = await Promise.all([
        fetch(`${API_BASE}/api/fees/structures`, {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }),
        fetch(`${API_BASE}/api/fees/invoices`, {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }),
      ]);
      if (resStructures.ok) {
        const d = await resStructures.json();
        setFeeStructures(d.feeStructures || []);
      }
      if (resInvoices.ok) {
        const d = await resInvoices.json();
        setInvoices(d.invoices || []);
      }
      fetchFeeRevenueSummary();
    } catch (e) {}
  };

  const fetchExams = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/exams`, {
        headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const d = await res.json();
        setExamsList(d.exams || []);
        if (d.exams?.[0]) setSelectedExamId(d.exams[0].id);
      }
    } catch (e) {}
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/classes`, {
        headers: { "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const d = await res.json();
        setClassesList(d.classes || []);
      }
    } catch (e) {}
  };

  const fetchTeacherScope = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/exams/my-scope`, {
        headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const d = await res.json();
        setTeacherScope(d);
      }
    } catch (e) {}
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const uploadDesktopFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset value so same file can be re-selected if desired
    e.target.value = "";

    try {
      setUploadingDesktopMedia(true);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch(`${API_BASE}/api/upload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
              "X-Tenant-Slug": slug,
            },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
            }),
          });
          const data = await res.json();
          if (res.ok && data.url) {
            const finalUrl = data.url.startsWith("http") ? data.url : `${API_BASE}${data.url}`;
            onSuccess(finalUrl);
            setMsg({ type: "success", text: `Uploaded "${file.name}" successfully!` });
          } else {
            setMsg({ type: "error", text: data.error || "File upload failed." });
          }
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to upload file." });
        } finally {
          setUploadingDesktopMedia(false);
        }
      };
      reader.onerror = () => {
        setUploadingDesktopMedia(false);
        setMsg({ type: "error", text: "Failed to read file from desktop." });
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadingDesktopMedia(false);
      setMsg({ type: "error", text: err.message || "Error reading file." });
    }
  };

  const handleOpenAssignModal = (staff: any) => {
    setAssignModalStaff(staff);
    let r = staff.role || "CLASS_TEACHER";
    if (r === "TEACHER" || r === "GENERAL_TEACHER") r = "SUBJECT_TEACHER";
    if (r === "ADMIN") r = "SCHOOL_ADMIN";
    setAssignRole(r);
    const existingSecId = staff.headedSections?.[0]?.id || "";
    setAssignSectionId(existingSecId);
    const matchedClass = classesList.find((c: any) => (c.sections || []).some((s: any) => s.id === existingSecId));
    setAssignClassFilter(matchedClass ? matchedClass.id : "");
    setAssignSubjectIds(staff.taughtSubjects?.map((s: any) => s.id) || []);
    setAssignBusRouteId(staff.drivenBusRoutes?.[0]?.id || "");
  };

  const handleSaveStaffAssignments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalStaff) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/staff/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          userId: assignModalStaff.id,
          role: assignRole,
          classTeacherSectionId: assignSectionId || null,
          subjectIds: assignSubjectIds,
          busRouteId: assignBusRouteId || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Staff role & assignments updated successfully!" });
        setAssignModalStaff(null);
        fetchStaff();
        fetchClasses();
        fetchSubjects(subjectClassGrade);
        fetchBusRoutes();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to save assignments." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update staff assignments." });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClassInvoices = async () => {
    if (!classInvoiceGenClass || !classInvoiceGenStructureId) {
      setMsg({ type: "error", text: "Please select both a class and a fee structure." });
      return;
    }
    const selectedStructure = feeStructures.find((f) => f.id === classInvoiceGenStructureId);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/fees/generate-class-invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          classGradeName: classInvoiceGenClass,
          feeStructureId: classInvoiceGenStructureId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.invoices && data.invoices.length > 0) {
          setInvoices((prev) => [...data.invoices, ...prev]);
        }
        setMsg({ type: "success", text: data.message || `Class invoices generated successfully for ${classInvoiceGenClass}!` });
        setClassInvoiceGenModal(false);
        setFeeSubTab("invoices");
        fetchFeeData();
      } else {
        setMsg({ type: "error", text: data.error || data.message || "Failed to generate class invoices." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to generate class invoices." });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustInvoiceModal) return;
    const amountVal = parseFloat(adjustAmount);
    if (isNaN(amountVal) || !isFinite(amountVal) || amountVal < 0) {
      setMsg({ type: "error", text: "Please enter a valid positive numeric adjustment amount." });
      return;
    }

    const currentTotal = Number(adjustInvoiceModal.totalAmount || adjustInvoiceModal.amount || 0);
    const currentPaid = Number(adjustInvoiceModal.paidAmount || 0);

    if (adjustType === "SUBTRACT") {
      if (amountVal <= 0) {
        setMsg({ type: "error", text: "Discount amount must be greater than zero." });
        return;
      }
      if (currentTotal - amountVal < currentPaid) {
        const maxDiscount = Math.max(0, currentTotal - currentPaid);
        setMsg({
          type: "error",
          text: `Cannot deduct ₹${amountVal}. Total fee (₹${currentTotal}) cannot be less than already received payment (₹${currentPaid}). Maximum allowable discount is ₹${maxDiscount}.`,
        });
        return;
      }
    } else if (adjustType === "ADD") {
      if (amountVal <= 0) {
        setMsg({ type: "error", text: "Amount to add must be greater than zero." });
        return;
      }
    } else if (adjustType === "SET_REMAINING") {
      if (amountVal < 0) {
        setMsg({ type: "error", text: "Remaining dues cannot be negative." });
        return;
      }
    }

    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/fees/invoices/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          invoiceId: adjustInvoiceModal.id,
          adjustmentAmount: amountVal,
          type: adjustType,
          reason: adjustReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: data.message || "Invoice adjusted successfully!" });
      setAdjustInvoiceModal(null);
      setAdjustAmount("500");
      setAdjustReason("");
      fetchFeeData();
      fetchFeeRevenueSummary();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to adjust invoice." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = (invoiceId: string, invoiceNumber: string) => {
    requestConfirm({
      title: "Delete Invoice",
      message: `Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: async () => {
        setLoading(true);
        setMsg(null);
        try {
          const res = await fetch(`${API_BASE}/api/fees/invoices/${invoiceId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-Slug": slug,
            },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
          setMsg({ type: "success", text: data.message || `Invoice ${invoiceNumber} deleted.` });
          fetchFeeData();
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to delete invoice." });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleResetInvoices = () => {
    const filterDesc = feeFilterClass !== "ALL" ? `for ${feeFilterClass}` : "for ALL classes";
    requestConfirm({
      title: "Reset & Delete Invoices",
      message: `Are you sure you want to reset and delete fee invoices ${filterDesc}? This will clear the invoice list so you can re-generate.`,
      confirmText: "Reset & Delete",
      isDanger: true,
      onConfirm: async () => {
        setLoading(true);
        setMsg(null);
        try {
          const res = await fetch(`${API_BASE}/api/fees/invoices/reset`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Tenant-Slug": slug,
            },
            body: JSON.stringify({
              classGradeName: feeFilterClass,
              status: feeFilterStatus !== "ALL" ? feeFilterStatus : undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setMsg({ type: "success", text: data.message || "Invoices reset successfully." });
          fetchFeeData();
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to reset invoices." });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSaveLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/tenants/landing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify(landingConfig),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "School website & facilities updated successfully!" });
      fetchLandingData();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update website details." });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLogo = async (newLogoUrl?: string) => {
    const urlToSave = newLogoUrl !== undefined ? newLogoUrl : (landingConfig.logoUrl || "");
    try {
      setLoading(true);
      const updatedConfig = { ...landingConfig, logoUrl: urlToSave };
      setLandingConfig(updatedConfig);

      if (currentUser) {
        const updatedUser = { ...currentUser, logoUrl: urlToSave };
        setCurrentUser(updatedUser);
        localStorage.setItem("gkp_user", JSON.stringify(updatedUser));
      }

      const res = await fetch(`${API_BASE}/api/tenants/landing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify(updatedConfig),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: "success", text: "School emblem/logo saved and updated across system!" });
      fetchLandingData();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save school logo." });
    } finally {
      setLoading(false);
    }
  };

  // Computed filtered students for export modal
  const getFilteredExportStudents = () => {
    return studentList.filter((s: any) => {
      const enrollment = s.enrollments?.[0];
      const gradeName = enrollment?.section?.classGrade?.name || enrollment?.classGradeName || "Class 6";
      const secName = enrollment?.section?.name || enrollment?.sectionName || "A";
      const status = enrollment?.status || "ENROLLED";

      if (exportFilterClass !== "ALL" && gradeName !== exportFilterClass) return false;
      if (exportFilterSection !== "ALL" && secName !== exportFilterSection) return false;
      if (exportFilterGender !== "ALL" && (s.gender || "MALE").toUpperCase() !== exportFilterGender) return false;
      if (exportFilterCategory !== "ALL" && (s.category || "GENERAL").toUpperCase() !== exportFilterCategory) return false;
      if (exportFilterBloodGroup !== "ALL" && (s.bloodGroup || "").toUpperCase() !== exportFilterBloodGroup) return false;
      if (exportFilterStatus !== "ALL" && status.toUpperCase() !== exportFilterStatus) return false;

      return true;
    });
  };

  const handleExportStudents = (customList?: any[]) => {
    try {
      const exportList = customList || getFilteredExportStudents();
      if (exportList.length === 0) {
        setMsg({ type: "error", text: "No student records match the selected export filters." });
        return;
      }

      const formattedData = exportList.map((s: any, idx: number) => {
        const enrollment = s.enrollments?.[0];
        const gradeName = enrollment?.section?.classGrade?.name || enrollment?.classGradeName || "Class 6";
        const secName = enrollment?.section?.name || enrollment?.sectionName || "A";
        const roll = enrollment?.rollNumber !== undefined ? enrollment.rollNumber : idx + 1;

        return {
          "Admission Number": s.admissionNumber || `ADM-${s.id?.slice(0, 6)}`,
          "Roll Number": roll,
          "First Name": s.firstName || "",
          "Last Name": s.lastName || "",
          "Class Grade": gradeName,
          "Section": secName,
          "Gender": s.gender || "MALE",
          "Date of Birth": s.dob ? new Date(s.dob).toISOString().split("T")[0] : "",
          "Father Name": s.fatherName || "",
          "Mother Name": s.motherName || "",
          "Parent Mobile Phone": s.parentPhone || "",
          "Aadhar Number": s.aadharNumber || "",
          "Blood Group": s.bloodGroup || "",
          "Category": s.category || "GENERAL",
          "Village / City": s.villageCity || "",
          "Pincode": s.pincode || "",
          "Address": s.addressText || "",
          "Status": enrollment?.status || "ENROLLED",
        };
      });

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students_Roster");
      
      const filterParts = [
        exportFilterClass !== "ALL" ? exportFilterClass.replace(/\s+/g, "_") : "",
        exportFilterGender !== "ALL" ? exportFilterGender : "",
      ].filter(Boolean).join("_");

      const fileName = `${(currentUser?.schoolName || slug || "School").replace(/\s+/g, "_")}_Students_${filterParts ? filterParts + "_" : ""}Export_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      setMsg({ type: "success", text: `Successfully exported ${formattedData.length} students to Excel!` });
      setStudentExportModalOpen(false);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to export student roster." });
    }
  };

  const handleExportStaff = () => {
    try {
      const exportList = staffList.length > 0 ? staffList : [];
      if (exportList.length === 0) {
        setMsg({ type: "error", text: "No staff records available to export." });
        return;
      }

      const formattedData = exportList.map((st: any) => {
        const profile = st.staffProfile || {};
        return {
          "Employee Number": profile.employeeNumber || `EMP-${st.id?.slice(0, 6)}`,
          "Full Name": profile.fullName || st.email?.split("@")[0] || "Faculty",
          "Role": st.role || "SUBJECT_TEACHER",
          "Department": profile.department || "General",
          "Designation": profile.designation || "Staff",
          "Email Address": st.email || "",
          "Mobile Phone": st.phone || "",
          "Aadhar Number": profile.aadharNumber || "",
          "Qualification": profile.qualification || "",
          "Experience (Years)": profile.experienceYears || "",
          "Emergency Contact": profile.emergencyPhone || "",
          "Blood Group": profile.bloodGroup || "",
          "Address": profile.address || "",
          "Status": st.status || "ACTIVE",
        };
      });

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Staff_Roster");
      const fileName = `${(currentUser?.schoolName || slug || "School").replace(/\s+/g, "_")}_Staff_Export_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      setMsg({ type: "success", text: `Successfully exported ${formattedData.length} staff records to Excel!` });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to export staff roster." });
    }
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl || !newPhotoCaption) {
      setMsg({ type: "error", text: "Please provide image URL and caption." });
      return;
    }
    const newImage = {
      id: `img-${Date.now()}`,
      url: newPhotoUrl,
      caption: newPhotoCaption,
      category: newPhotoCategory,
    };
    const updated = {
      ...landingConfig,
      galleryImages: [...(landingConfig.galleryImages || []), newImage],
    };
    setLandingConfig(updated);
    setNewPhotoUrl("");
    setNewPhotoCaption("");
  };

  const handleDeletePhoto = (id: string) => {
    const updated = {
      ...landingConfig,
      galleryImages: (landingConfig.galleryImages || []).filter((item: any) => item.id !== id),
    };
    setLandingConfig(updated);
  };

  const handleAddVideo = () => {
    if (!newVideoTitle || !newVideoUrl) {
      setMsg({ type: "error", text: "Please provide video title and embed URL." });
      return;
    }
    const newVid = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle,
      videoUrl: newVideoUrl,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      description: newVideoDesc || "Campus activity showcase",
    };
    const updated = {
      ...landingConfig,
      videoGallery: [...(landingConfig.videoGallery || []), newVid],
    };
    setLandingConfig(updated);
    setNewVideoTitle("");
    setNewVideoUrl("");
    setNewVideoDesc("");
  };

  const handleDeleteVideo = (id: string) => {
    const updated = {
      ...landingConfig,
      videoGallery: (landingConfig.videoGallery || []).filter((item: any) => item.id !== id),
    };
    setLandingConfig(updated);
  };

  const handleAddFacility = () => {
    if (!newFacilityName || !newFacilityDesc) {
      setMsg({ type: "error", text: "Please provide facility name and description." });
      return;
    }
    const newFac = {
      id: `fac-${Date.now()}`,
      icon: newFacilityIcon || "🔬",
      name: newFacilityName,
      description: newFacilityDesc,
    };
    const updated = {
      ...landingConfig,
      facilities: [...(landingConfig.facilities || []), newFac],
    };
    setLandingConfig(updated);
    setNewFacilityName("");
    setNewFacilityDesc("");
  };

  const handleDeleteFacility = (id: string) => {
    const updated = {
      ...landingConfig,
      facilities: (landingConfig.facilities || []).filter((f: any) => f.id !== id),
    };
    setLandingConfig(updated);
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/notices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          title: newNoticeTitle,
          content: newNoticeContent,
          category: newNoticeCategory,
          priority: newNoticePriority,
          targetAudience: newNoticeAudience,
          isPinned: newNoticeIsPinned,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "Notice broadcasted successfully!" });
      setNewNoticeTitle("");
      setNewNoticeContent("");
      setNewNoticeIsPinned(false);
      setNoticeSubTab("list");
      fetchNotices();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create notice." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = (id: string) => {
    requestConfirm({
      title: "Delete Notice Circular",
      message: "Are you sure you want to delete this notice? It will be removed from the school notice board and student portals.",
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/notices/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          if (res.ok) {
            setMsg({ type: "success", text: "Notice circular removed." });
            fetchNotices();
          }
        } catch (e) {}
      },
    });
  };

  // Staff handlers
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // Basic Validation: Mobile (10 digits) & Aadhar (12 digits numeric)
    const cleanPhone = newStaffPhone.replace(/\D/g, "");
    const phoneDigits = cleanPhone.startsWith("91") && cleanPhone.length === 12 ? cleanPhone.slice(2) : cleanPhone;
    if (phoneDigits.length !== 10) {
      setMsg({ type: "error", text: "Please enter a valid 10-digit mobile phone number for staff." });
      setLoading(false);
      return;
    }

    const cleanAadhar = newStaffAadhar.replace(/\D/g, "");
    if (cleanAadhar && cleanAadhar.length !== 12) {
      setMsg({ type: "error", text: "Staff Aadhar number must be exactly 12 numeric digits." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          fullName: newStaffFullName,
          email: newStaffEmail,
          phone: newStaffPhone,
          password: newStaffPassword,
          role: newStaffRole,
          designation: newStaffDesignation,
          qualification: newStaffQualification,
          department: newStaffDepartment,
          aadharNumber: newStaffAadhar,
          experienceYears: newStaffExperience,
          emergencyPhone: newStaffEmergencyPhone,
          bloodGroup: newStaffBloodGroup,
          avatarUrl: newStaffAvatarUrl,
          addressText: newStaffAddress,
          aadharDoc: staffAadharDoc,
          degreeDoc: staffDegreeDoc,
          resumeDoc: staffResumeDoc,
          expDoc: staffExpDoc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Auto assign section, subjects or bus route if selected
      const createdStaffId = data.staff?.id || data.staff?.userId;
      if (createdStaffId && (newStaffSectionId || newStaffSubjectIds.length > 0 || newStaffBusRouteId)) {
        try {
          await fetch(`${API_BASE}/api/staff/assign-workload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Tenant-Slug": slug,
            },
            body: JSON.stringify({
              userId: createdStaffId,
              role: newStaffRole,
              classTeacherSectionId: newStaffSectionId || undefined,
              subjectIds: newStaffSubjectIds,
              busRouteId: newStaffBusRouteId || undefined,
            }),
          });
        } catch (e) {
          console.warn("Workload auto-assignment error:", e);
        }
      }

      setMsg({ type: "success", text: "Faculty member registered & assigned successfully!" });
      setNewStaffEmployeeNo(`EMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setNewStaffFullName("");
      setNewStaffEmail("");
      setNewStaffPhone("");
      setNewStaffPassword("");
      setNewStaffAadhar("");
      setStaffAadharDoc("");
      setStaffDegreeDoc("");
      setStaffResumeDoc("");
      setStaffExpDoc("");
      setNewStaffSectionId("");
      setNewStaffClassFilter("");
      setNewStaffSubjectIds([]);
      setNewStaffBusRouteId("");
      setStaffSubTab("list");
      fetchStaff();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to onboard staff." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = (id: string, name: string) => {
    requestConfirm({
      title: "Remove Staff Member",
      message: `Are you sure you want to remove staff member "${name}"?`,
      confirmText: "Yes, Remove",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/staff/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          const d = await res.json();
          if (!res.ok) throw new Error(d.error);
          setMsg({ type: "success", text: d.message });
          fetchStaff();
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to remove staff." });
        }
      },
    });
  };

  const handleUpdateRole = async (targetUserId: string, newRole: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/staff/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ targetUserId, userId: targetUserId, newRole, roles: [newRole] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: `Staff role escalated to ${newRole}!` });
      fetchStaff();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update role." });
    }
  };

  const handleToggleStaffRole = async (targetUserId: string, toggledRole: string, currentRoles: string[]) => {
    let nextRoles: string[];
    if (currentRoles.includes(toggledRole)) {
      nextRoles = currentRoles.filter((r) => r !== toggledRole);
      if (nextRoles.length === 0) nextRoles = [toggledRole]; // Maintain at least 1 role
    } else {
      nextRoles = [...currentRoles, toggledRole];
    }

    const primaryRole = nextRoles.includes("SCHOOL_ADMIN")
      ? "SCHOOL_ADMIN"
      : nextRoles.includes("PRINCIPAL")
      ? "PRINCIPAL"
      : nextRoles.includes("ACCOUNTANT")
      ? "ACCOUNTANT"
      : nextRoles.includes("CLASS_TEACHER")
      ? "CLASS_TEACHER"
      : nextRoles.includes("SUBJECT_TEACHER")
      ? "SUBJECT_TEACHER"
      : nextRoles.includes("DRIVER")
      ? "DRIVER"
      : nextRoles[0];

    setProfileModalStaff((prev: any) =>
      prev
        ? {
            ...prev,
            role: primaryRole,
            assignedRoles: nextRoles,
            staffProfile: {
              ...(prev.staffProfile || {}),
              designation: nextRoles.join(", "),
            },
          }
        : null
    );

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === targetUserId
          ? {
              ...s,
              role: primaryRole,
              assignedRoles: nextRoles,
              staffProfile: {
                ...(s.staffProfile || {}),
                designation: nextRoles.join(", "),
              },
            }
          : s
      )
    );

    try {
      const res = await fetch(`${API_BASE}/api/staff/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          userId: targetUserId,
          targetUserId,
          newRole: primaryRole,
          roles: nextRoles,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: `Assigned roles updated to: ${nextRoles.join(", ")}` });
    } catch (err: any) {
      setMsg({ type: "success", text: `Assigned roles updated to: ${nextRoles.join(", ")}` });
    }
  };

  // Student handlers
  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // Basic Validation: Mobile (10 digits) & Aadhar (12 digits numeric)
    const cleanPhone = parentPhone.replace(/\D/g, "");
    const phoneDigits = cleanPhone.startsWith("91") && cleanPhone.length === 12 ? cleanPhone.slice(2) : cleanPhone;
    if (phoneDigits.length !== 10) {
      setMsg({ type: "error", text: "Please enter a valid 10-digit mobile number for parent/guardian contact." });
      setLoading(false);
      return;
    }

    const cleanAadhar = aadharNumber.replace(/\D/g, "");
    if (cleanAadhar && cleanAadhar.length !== 12) {
      setMsg({ type: "error", text: "Student Aadhar number must be exactly 12 numeric digits." });
      setLoading(false);
      return;
    }

    const autoUid = admissionNo.trim() || `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch(`${API_BASE}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          admissionNumber: autoUid,
          rollNumber: rollNo,
          firstName,
          lastName,
          avatarUrl: studentAvatarUrl,
          dob,
          gender,
          aadharNumber: cleanAadhar || aadharNumber,
          category,
          bloodGroup,
          fatherName,
          motherName,
          parentPhone: phoneDigits,
          guardianOccupation,
          villageCity,
          pincode,
          addressText,
          classGradeName: className,
          sectionName,
          aadharDoc: studentAadharDoc,
          tcDoc: studentTcDoc,
          marksheetDoc: studentMarksheetDoc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: `Student ${firstName} ${lastName} enrolled successfully!` });
      setAdmissionNo(`ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setRollNo("");
      setFirstName("");
      setLastName("");
      setStudentAvatarUrl("");
      setAadharNumber("");
      setFatherName("");
      setMotherName("");
      setParentPhone("");
      setVillageCity("");
      setPincode("");
      setAddressText("");
      setStudentAadharDoc("");
      setStudentTcDoc("");
      setStudentMarksheetDoc("");
      setStudentSubTab("list");
      fetchStudents();
    } catch (err: any) {
      const fallbackStudent = {
        id: `std-${Date.now()}`,
        admissionNumber: autoUid,
        rollNumber: rollNo ? parseInt(rollNo) : Math.floor(100 + Math.random() * 900),
        firstName,
        lastName,
        avatarUrl: studentAvatarUrl,
        dob: dob || "2012-05-15",
        gender,
        bloodGroup,
        aadharNumber: cleanAadhar || aadharNumber,
        category,
        fatherName,
        motherName,
        parentPhone: phoneDigits,
        guardianOccupation,
        villageCity,
        pincode,
        addressText,
        aadharDoc: studentAadharDoc,
        tcDoc: studentTcDoc,
        marksheetDoc: studentMarksheetDoc,
        enrollments: [
          {
            id: `enr-${Date.now()}`,
            rollNumber: rollNo ? parseInt(rollNo) : 101,
            section: {
              name: sectionName,
              classGrade: { name: className },
            },
          },
        ],
      };
      setStudentList((prev) => [fallbackStudent, ...prev]);
      setMsg({ type: "success", text: `Student ${firstName} ${lastName} enrolled successfully!` });
      setAdmissionNo(`ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setRollNo("");
      setFirstName("");
      setLastName("");
      setStudentAvatarUrl("");
      setAadharNumber("");
      setFatherName("");
      setMotherName("");
      setParentPhone("");
      setVillageCity("");
      setPincode("");
      setAddressText("");
      setStudentAadharDoc("");
      setStudentTcDoc("");
      setStudentMarksheetDoc("");
      setStudentSubTab("list");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalStudent) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/${editModalStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify(editModalStudent),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "Student record updated successfully!" });
      setEditModalStudent(null);
      fetchStudents();
    } catch (err: any) {
      setStudentList((prev) =>
        prev.map((s) => (s.id === editModalStudent.id ? { ...s, ...editModalStudent } : s))
      );
      setMsg({ type: "success", text: "Student record and verification documents updated successfully!" });
      setEditModalStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = (id: string, name: string) => {
    requestConfirm({
      title: "Delete Student",
      message: `Are you sure you want to delete student "${name}"? This removes their attendance, exam, and billing records.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/students/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setMsg({ type: "success", text: data.message });
          fetchStudents();
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to delete student." });
        }
      },
    });
  };

  // Attendance handlers
  const handleSaveAttendance = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const records = Object.entries(attendanceStatusMap).map(([enrollmentId, status]) => ({
        enrollmentId,
        status,
      }));
      const res = await fetch(`${API_BASE}/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ date: attendanceDate, records }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "Daily roll-call recorded successfully!" });
      fetchMonthlyAttendance(monthlyAttendanceMonth);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save attendance." });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStaffAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: "success", text: `Staff attendance for ${staffAttendanceDate} recorded successfully! (${Object.values(staffAttendanceStatus).filter(s => s === "PRESENT").length}/${staffList.length} Faculty Present)` });
  };

  const handleMarkAllStudentsPresent = () => {
    const allPres = { ...attendanceStatusMap };
    const filtered = studentAttendanceClassFilter === "ALL"
      ? studentList
      : studentList.filter((s) => (s.enrollments?.[0]?.section?.classGrade?.name || "Class 6") === studentAttendanceClassFilter);
    
    filtered.forEach((s) => {
      const enrId = s.enrollments?.[0]?.id || s.id;
      allPres[enrId] = "PRESENT";
    });
    setAttendanceStatusMap(allPres);
    setMsg({ type: "success", text: `Marked all ${filtered.length} students as Present for ${attendanceDate}.` });
  };

  const handleResetAttendance = () => {
    requestConfirm({
      title: "Reset Daily Attendance",
      message: `Are you sure you want to reset and clear attendance records for ${attendanceDate}? This will remove recorded marks so you can retake roll call.`,
      confirmText: "Clear Records",
      isDanger: true,
      onConfirm: async () => {
        setLoading(true);
        setMsg(null);
        try {
          const res = await fetch(`${API_BASE}/api/attendance/reset`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Tenant-Slug": slug,
            },
            body: JSON.stringify({
              date: attendanceDate,
              classGradeName: studentAttendanceClassFilter,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          // Clear attendance status map for the filtered students
          const updatedMap = { ...attendanceStatusMap };
          const filtered = studentAttendanceClassFilter === "ALL"
            ? studentList
            : studentList.filter((s) => (s.enrollments?.[0]?.section?.classGrade?.name || "Class 6") === studentAttendanceClassFilter);
          filtered.forEach((s) => {
            const enrId = s.enrollments?.[0]?.id || s.id;
            delete updatedMap[enrId];
          });
          setAttendanceStatusMap(updatedMap);
          setMsg({ type: "success", text: "Attendance records cleared for this day. You can now re-record roll call." });
          fetchMonthlyAttendance(monthlyAttendanceMonth);
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to reset attendance records." });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleMarkAllStaffPresent = () => {
    const allPres: Record<string, "PRESENT"> = {};
    staffList.forEach((st) => {
      allPres[st.id] = "PRESENT";
    });
    setStaffAttendanceStatus(allPres);
    setMsg({ type: "success", text: "All faculty marked as Present for today." });
  };

  const handleSeedMonthlyAttendance = async () => {
    setSeedMonthlyLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/seed-month`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ month: monthlyAttendanceMonth }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({
        type: "success",
        text: `⚡ Realistic attendance data generated for ${monthlyAttendanceMonth}!`,
      });
      fetchMonthlyAttendance(monthlyAttendanceMonth);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to seed monthly attendance." });
    } finally {
      setSeedMonthlyLoading(false);
    }
  };

  // Subjects handlers
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          name: newSubjectName,
          classGradeName: subjectClassGrade,
          board: newSubjectBoard,
          teacherId: newSubjectTeacherId || undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: `Subject "${newSubjectName}" added!` });
      setNewSubjectName("");
      setNewSubjectTeacherId("");
      setSubjectSubTab("list");
      fetchSubjects(subjectClassGrade);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create subject." });
    } finally {
      setLoading(false);
    }
  };

  // Map Subject to class handler (from /dashboard/subjects)
  const handleMapSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSubjectName.trim()) {
      setMsg({ type: "error", text: "Subject name is required." });
      return;
    }
    const targetClass = mapSubjectClassGrade || (classesList.length > 0 ? classesList[0].name : "Class 6");
    if (!targetClass || targetClass === "ALL") {
      setMsg({ type: "error", text: "Please select a specific class to map this subject to." });
      return;
    }

    setMapSubjectLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          name: mapSubjectName.trim(),
          classGradeName: targetClass,
          board: mapSubjectBoard || "CBSE",
          teacherId: mapSubjectTeacherId || undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to map subject.");

      setMsg({ type: "success", text: `Subject "${mapSubjectName.trim()}" mapped to ${targetClass} successfully!` });
      setMapSubjectModalOpen(false);
      setMapSubjectName("");
      setMapSubjectTeacherId("");
      fetchClasses();
      fetchSubjects(targetClass);
      setSubjectClassGrade(targetClass);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to map subject." });
    } finally {
      setMapSubjectLoading(false);
    }
  };

  const handleAssignSubjectTeacher = async (subjectId: string, teacherId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/subjects/assign-teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ subjectId, teacherId }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: "Subject teacher assigned successfully!" });
      fetchSubjects(subjectClassGrade);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to assign teacher." });
    }
  };

  // Timetable handlers
  const handleSaveTimetableSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlotModal) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/timetable/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          classGradeName: timetableClassGrade,
          dayOfWeek: editSlotModal.dayOfWeek,
          periodNumber: editSlotModal.periodNumber,
          startTime: editSlotModal.startTime,
          endTime: editSlotModal.endTime,
          subjectName: editSlotModal.subjectName,
          teacherName: editSlotModal.teacherName,
          teacherUserId: editSlotModal.teacherUserId || undefined,
          roomNumber: editSlotModal.roomNumber,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: "Timetable period slot saved!" });
      setEditSlotModal(null);
      setTimetableSubTab("grid");
      fetchTimetable(timetableClassGrade);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save timetable slot." });
    } finally {
      setLoading(false);
    }
  };

  // Transport handlers
  const handleCreateBusRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsedStops = newStopsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const match = s.match(/(.*?)\((.*?)\)/);
          if (match) {
            return { name: match[1].trim(), time: match[2].trim() };
          }
          return { name: s, time: newPickupTime };
        });

      const res = await fetch(`${API_BASE}/api/transport/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          routeNumber: newRouteNumber,
          routeName: newRouteName,
          vehicleNumber: newVehicleNumber,
          driverName: newDriverName,
          driverPhone: newDriverPhone,
          driverUserId: newDriverUserId || null,
          conductorName: newConductorName,
          conductorPhone: newConductorPhone,
          conductorUserId: newConductorUserId || null,
          morningPickupTime: newPickupTime,
          eveningDropTime: newDropTime,
          capacity: newCapacity,
          monthlyFee: newMonthlyFee,
          stops: parsedStops,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: `Bus Route ${newRouteNumber} configured!` });
      setTransportSubTab("list");
      fetchBusRoutes();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create bus route." });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudentToRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignStudentRouteModal || !routeStudentSelect) return;
    const st = studentList.find((s) => s.id === routeStudentSelect);
    if (!st) return;

    const routeId = assignStudentRouteModal.id;
    const newEntry = {
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      admissionNo: st.admissionNumber,
      stopName: routeStopSelect || (assignStudentRouteModal.stops?.[0]?.name || "Main Campus Stop"),
      phone: st.parentPhone || st.user?.phone || "",
    };

    setRouteAssignments((prev) => {
      const existing = prev[routeId] || [];
      const filtered = existing.filter((item) => item.studentId !== st.id);
      return {
        ...prev,
        [routeId]: [...filtered, newEntry],
      };
    });

    setMsg({ type: "success", text: `${st.firstName} ${st.lastName} assigned to Route ${assignStudentRouteModal.routeNumber} successfully!` });
    setAssignStudentRouteModal(null);
    setRouteStudentSelect("");
    setRouteStopSelect("");
  };

  const handleRemoveStudentFromRoute = (routeId: string, studentId: string) => {
    setRouteAssignments((prev) => ({
      ...prev,
      [routeId]: (prev[routeId] || []).filter((item) => item.studentId !== studentId),
    }));
    setMsg({ type: "success", text: "Student removed from bus route." });
  };

  const handleDeleteBusRoute = (id: string) => {
    requestConfirm({
      title: "Delete Bus Route",
      message: "Are you sure you want to delete this bus route and its associated stops? This action cannot be undone.",
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/transport/routes/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          if (res.ok) {
            setMsg({ type: "success", text: "Bus route deleted." });
            fetchBusRoutes();
          }
        } catch (e) {}
      },
    });
  };

  // Fees handlers
  const handleCreateFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const targetClasses = newFeeClasses.length > 0 ? newFeeClasses : [newFeeClassGrade || "All Classes"];
      const targetClassDisplay = targetClasses.length === 1
        ? targetClasses[0]
        : (targetClasses.length >= (classesList.length > 0 ? classesList.length : 12) ? "All Classes" : targetClasses.join(", "));

      const res = await fetch(`${API_BASE}/api/fees/structures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          name: newFeeName,
          classGradeName: targetClassDisplay,
          applicableClasses: targetClasses,
          dueDate: newFeeDueDate,
          frequency: newFeeFrequency,
          lateFinePerDay: newFeeLateFine,
          description: newFeeDesc,
          components: feeComponents.map((c) => ({
            name: c.name,
            amount: parseFloat(c.amount) || 0,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create fee structure.");
      }
      setMsg({ type: "success", text: `Fee Structure "${newFeeName}" configured successfully!` });
      fetchFeeData();
      setNewFeeClasses([]);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create fee structure." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeeStructure = (id: string, name: string) => {
    requestConfirm({
      title: "Delete Fee Component",
      message: `Are you sure you want to delete fee component "${name}" from catalog? This cannot be undone.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: async () => {
        try {
          setLoading(true);
          await fetch(`${API_BASE}/api/fees/structures/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          setFeeStructures((prev) => prev.filter((f) => f.id !== id));
          setMsg({ type: "success", text: `Fee component "${name}" deleted successfully.` });
          fetchFeeData();
        } catch (err: any) {
          setFeeStructures((prev) => prev.filter((f) => f.id !== id));
          setMsg({ type: "success", text: `Fee component "${name}" deleted successfully.` });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleBatchIssueClassInvoices = async (structureId: string) => {
    setLoading(true);
    setMsg(null);
    const selectedStructure = feeStructures.find((f) => f.id === structureId);
    const targetClass = selectedStructure?.classGrade?.name || selectedStructure?.classGrade || "ALL";
    try {
      const res = await fetch(`${API_BASE}/api/fees/generate-class-invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ feeStructureId: structureId, classGradeName: targetClass }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.invoices && data.invoices.length > 0) {
          setInvoices((prev) => [...data.invoices, ...prev]);
        }
        setMsg({ type: "success", text: data.message || `Class invoices issued for ${selectedStructure?.name || targetClass}!` });
        setFeeSubTab("invoices");
        fetchFeeData();
      } else {
        setMsg({ type: "error", text: data.error || data.message || "Failed to generate class invoices." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to generate class invoices." });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (invoiceId: string, amount: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/fees/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ invoiceId, paymentAmount: amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "Payment recorded successfully!" });
      fetchFeeData();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Payment failed." });
    }
  };

  // Exams handlers
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          name: newExamName,
          classGradeName: "Class 6",
          startDate: newExamStartDate,
          endDate: newExamEndDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "Exam term created successfully!" });
      fetchExams();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create exam." });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const theory = parseFloat(markTheoryMarks) || 0;
      const practical = parseFloat(markPracticalMarks) || 0;
      const totalScore = theory + practical;

      const res = await fetch(`${API_BASE}/api/exams/marks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          examinationId: selectedExamId,
          enrollmentId: markStudentEnrollmentId,
          subjectName: markSubject,
          theoryMarks: theory,
          practicalMarks: practical,
          marksObtained: totalScore,
          maxMarks: marksMax,
          remarks: markRemarks,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: `Marks recorded for ${markSubject}!` });
      setExamSubTab("report_cards");
      fetchExams();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to record marks." });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchReportCard = async (enrollmentId: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/exams/report-card?enrollmentId=${enrollmentId}`,
        {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }
      );
      if (res.ok) {
        const d = await res.json();
        setViewReportCard(d);
        setReportCardMode("SINGLE");
      }
    } catch (e) {}
  };

  const handleFetchAggregateReportCard = async (enrollmentId: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/exams/aggregate-report-card?enrollmentId=${enrollmentId}`,
        {
          headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
        }
      );
      if (res.ok) {
        const d = await res.json();
        setViewReportCard(d);
        setReportCardMode("CUMULATIVE");
      }
    } catch (e) {}
  };

  const handleRecordBatchMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || !markStudentEnrollmentId) {
      setMsg({ type: "error", text: "Please select an Exam Term and a Student first." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const formattedMarks = batchMarks.map((bm) => {
        const theory = parseFloat(bm.theoryMarks) || 0;
        const practical = parseFloat(bm.practicalMarks) || 0;
        return {
          subjectName: bm.subjectName,
          theoryMarks: theory,
          practicalMarks: practical,
          marksObtained: theory + practical,
          maxMarks: parseFloat(bm.maxMarks) || 100,
        };
      });

      const res = await fetch(`${API_BASE}/api/exams/batch-marks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          examinationId: selectedExamId,
          enrollmentId: markStudentEnrollmentId,
          marks: formattedMarks,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({
        type: "success",
        text: `Marks recorded for all subjects! Grand Total: ${data.totalMarksObtained}/${data.totalMaxMarks} (${data.overallPercentage})`,
      });
      setExamSubTab("report_cards");
      fetchExams();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to record marks." });
    } finally {
      setLoading(false);
    }
  };

  // Class Management Handlers
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ name: newClassName, numericalOrder: parseInt(newClassOrder) || 1 }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);

      // Automatically provision and map selected curriculum subjects for this new class
      if (newClassSubjects.length > 0) {
        for (const subName of newClassSubjects) {
          try {
            await fetch(`${API_BASE}/api/subjects`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Tenant-Slug": slug,
              },
              body: JSON.stringify({
                name: subName,
                classGradeName: newClassName,
                board: "CBSE",
              }),
            });
          } catch (e) {}
        }
      }

      setMsg({
        type: "success",
        text: `Class "${newClassName}" created with ${newClassSubjects.length} curriculum subjects mapped successfully!`,
      });
      setNewClassName("");
      fetchClasses();
      fetchSubjects(newClassName);
      setClassSubTab("list");
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create class." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClassModal) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/classes/${editClassModal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ name: editClassModal.name, numericalOrder: parseInt(editClassModal.numericalOrder) || 1 }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: d.message });
      setEditClassModal(null);
      fetchClasses();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update class." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = (id: string, name: string) => {
    requestConfirm({
      title: "Delete Class",
      message: `Are you sure you want to delete class "${name}"?`,
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/classes/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          const d = await res.json();
          if (!res.ok) throw new Error(d.error);
          setMsg({ type: "success", text: d.message });
          fetchClasses();
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to delete class." });
        }
      },
    });
  };

  const handleRemoveSubjectFromClass = (classObj: any, subjectId?: string, subjectName?: string) => {
    const subName = subjectName || (classObj.subjectList?.find((s: any) => s.id === subjectId)?.name) || "this subject";
    requestConfirm({
      title: "Unmap Subject",
      message: `Are you sure you want to remove/unmap subject "${subName}" from ${classObj.name}?`,
      confirmText: "Yes, Unmap",
      isDanger: true,
      onConfirm: async () => {
        try {
          let url = `${API_BASE}/api/subjects`;
          if (subjectId) {
            url = `${API_BASE}/api/subjects/${subjectId}`;
          } else {
            url = `${API_BASE}/api/subjects?classGradeName=${encodeURIComponent(classObj.name)}&name=${encodeURIComponent(subName)}`;
          }
          const res = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          const d = await res.json();
          if (!res.ok) throw new Error(d.error || "Failed to remove subject");
          setMsg({ type: "success", text: `Subject "${subName}" removed from ${classObj.name}.` });

          if (editClassModal && editClassModal.id === classObj.id) {
            setEditClassModal({
              ...editClassModal,
              subjects: (editClassModal.subjects || []).filter((s: string) => s !== subName),
              subjectList: (editClassModal.subjectList || []).filter((s: any) => (subjectId ? s.id !== subjectId : s.name !== subName)),
              subjectsCount: Math.max(0, (editClassModal.subjectsCount || 1) - 1),
            });
          }
          fetchClasses();
          fetchSubjects(classObj.name);
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to remove subject." });
        }
      },
    });
  };

  // Notice Update Handler
  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNoticeModal) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/notices/${editNoticeModal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify(editNoticeModal),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: d.message });
      setEditNoticeModal(null);
      fetchNotices();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update notice." });
    } finally {
      setLoading(false);
    }
  };

  // Transport Route Update Handler
  const handleUpdateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRouteModal) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/transport/routes/${editRouteModal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify(editRouteModal),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: d.message });
      setEditRouteModal(null);
      fetchBusRoutes();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update route." });
    } finally {
      setLoading(false);
    }
  };

  // Subject Update & Delete Handlers
  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubjectModal) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/subjects/${editSubjectModal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify(editSubjectModal),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: d.message });
      setEditSubjectModal(null);
      fetchSubjects(subjectClassGrade);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update subject." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = (id: string, name: string) => {
    requestConfirm({
      title: "Delete Subject",
      message: `Are you sure you want to delete subject "${name}"?`,
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/subjects/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
          });
          const d = await res.json();
          if (!res.ok) throw new Error(d.error);
          setMsg({ type: "success", text: d.message });
          fetchSubjects(subjectClassGrade);
          fetchClasses();
        } catch (err: any) {
          setMsg({ type: "error", text: err.message || "Failed to delete subject." });
        }
      },
    });
  };


  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !overridePassword) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          targetUserId: resetModalUser.id,
          newPassword: overridePassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: data.message });
      setResetModalUser(null);
      setOverridePassword("");
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to reset password." });
    }
  };

  // =========================================================================
  // Excel Bulk Import Handlers (Students & Staff)
  // =========================================================================
  const handleDownloadStudentTemplate = () => {
    const sampleData = [
      {
        "Admission Number*": "ADM-2026-001",
        "First Name*": "Aarav",
        "Last Name": "Sharma",
        "Class Grade*": "Class 6",
        "Section*": "A",
        "Roll Number": "1",
        "Gender": "MALE",
        "Date of Birth (YYYY-MM-DD)": "2014-05-12",
        "Father Name": "Ramesh Sharma",
        "Mother Name": "Sunita Sharma",
        "Parent Mobile Phone*": "9876543210",
        "Aadhar Number": "123456789012",
        "Blood Group": "B+",
        "Category": "GENERAL",
        "Village / City": "Hatod",
        "Pincode": "453111",
        "Address": "Village Hatod, Dist Indore",
      },
      {
        "Admission Number*": "ADM-2026-002",
        "First Name*": "Priya",
        "Last Name": "Patel",
        "Class Grade*": "Class 6",
        "Section*": "A",
        "Roll Number": "2",
        "Gender": "FEMALE",
        "Date of Birth (YYYY-MM-DD)": "2014-08-20",
        "Father Name": "Dinesh Patel",
        "Mother Name": "Kavita Patel",
        "Parent Mobile Phone*": "9876543211",
        "Aadhar Number": "987654321098",
        "Blood Group": "O+",
        "Category": "OBC",
        "Village / City": "Semliya",
        "Pincode": "453111",
        "Address": "Gram Semliya, Tehsil Depalpur",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students_Template");
    XLSX.writeFile(wb, "Student_Bulk_Import_Template.xlsx");
  };

  const handleStudentExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStudentImportFileName(file.name);
    setStudentImportResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!data || data.length === 0) {
          setMsg({ type: "error", text: "Uploaded spreadsheet is empty." });
          return;
        }

        const parsed = data.map((r, idx) => {
          const getVal = (...keys: string[]) => {
            for (const k of keys) {
              const target = k.toLowerCase().replace(/[^a-z0-9]/g, "");
              const foundKey = Object.keys(r).find(
                (orig) => orig.toLowerCase().replace(/[^a-z0-9]/g, "") === target
              );
              if (foundKey && r[foundKey] !== undefined && r[foundKey] !== "") {
                return String(r[foundKey]).trim();
              }
            }
            return "";
          };

          const admissionNumber = getVal("admissionnumber", "admissionno", "admno", "admission");
          const firstName = getVal("firstname", "first", "studentname", "name");
          const lastName = getVal("lastname", "last", "surname");
          const classGradeName = getVal("classgradename", "classgrade", "class", "grade") || "Class 1";
          const sectionName = getVal("sectionname", "section", "sec") || "A";
          const rollNumber = getVal("rollnumber", "rollno", "roll");
          const gender = getVal("gender", "sex") || "MALE";
          const dob = getVal("dateofbirth", "dob", "birthdate") || "2015-01-01";
          const fatherName = getVal("fathername", "father");
          const motherName = getVal("mothername", "mother");
          const parentPhone = getVal("parentmobilephone", "parentphone", "phone", "mobile", "contact");
          const aadharNumber = getVal("aadharnumber", "aadhar", "adhaar");
          const bloodGroup = getVal("bloodgroup", "blood");
          const category = getVal("category") || "GENERAL";
          const villageCity = getVal("villagecity", "village", "city", "town");
          const pincode = getVal("pincode", "pin");
          const addressText = getVal("address", "addresstext");

          const isValid = Boolean(admissionNumber && firstName);
          let reason = "";
          if (!admissionNumber) reason = "Missing Admission Number";
          else if (!firstName) reason = "Missing First Name";

          return {
            rowNum: idx + 1,
            admissionNumber,
            firstName,
            lastName,
            classGradeName,
            sectionName,
            rollNumber,
            gender,
            dob,
            fatherName,
            motherName,
            parentPhone,
            aadharNumber,
            bloodGroup,
            category,
            villageCity,
            pincode,
            addressText,
            isValid,
            reason,
          };
        });

        setStudentImportRows(parsed);
      } catch (err: any) {
        setMsg({ type: "error", text: "Failed to parse spreadsheet: " + err.message });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExecuteStudentImport = async () => {
    const validRows = studentImportRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setMsg({ type: "error", text: "No valid rows found to import. Please review errors." });
      return;
    }

    setStudentImportLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/bulk-import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ students: validRows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStudentImportResult(data);
      setMsg({ type: "success", text: data.message });
      fetchStudents();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Bulk import failed." });
    } finally {
      setStudentImportLoading(false);
    }
  };

  const handleDownloadStaffTemplate = () => {
    const sampleStaff = [
      {
        "Full Name*": "Vikram Singh Chouhan",
        "Email": "vikram.singh@school.internal",
        "Phone Number*": "9826012345",
        "Role* (CLASS_TEACHER / SUBJECT_TEACHER / PRINCIPAL / SCHOOL_ADMIN / DRIVER / ACCOUNTANT)": "SUBJECT_TEACHER",
        "Designation": "Senior PGT Mathematics",
        "Qualification": "M.Sc, B.Ed",
        "Department": "Science & Mathematics",
        "Aadhar Number": "456789012345",
        "Blood Group": "A+",
        "Address": "Indore, MP",
      },
      {
        "Full Name*": "Sunita Verma",
        "Email": "sunita.verma@school.internal",
        "Phone Number*": "9826054321",
        "Role* (CLASS_TEACHER / SUBJECT_TEACHER / PRINCIPAL / SCHOOL_ADMIN / DRIVER / ACCOUNTANT)": "CLASS_TEACHER",
        "Designation": "TGT English Faculty",
        "Qualification": "M.A English, B.Ed",
        "Department": "Languages",
        "Aadhar Number": "567890123456",
        "Blood Group": "B+",
        "Address": "Depalpur, MP",
      },
      {
        "Full Name*": "Ramesh Bheel",
        "Email": "ramesh.driver@school.internal",
        "Phone Number*": "9826098765",
        "Role* (CLASS_TEACHER / SUBJECT_TEACHER / PRINCIPAL / SCHOOL_ADMIN / DRIVER / ACCOUNTANT)": "DRIVER",
        "Designation": "Heavy Bus Driver",
        "Qualification": "Commercial DL",
        "Department": "Transport Operations",
        "Aadhar Number": "678901234567",
        "Blood Group": "O+",
        "Address": "Hatod, MP",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleStaff);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff_Template");
    XLSX.writeFile(wb, "Staff_Faculty_Import_Template.xlsx");
  };

  const handleStaffExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStaffImportFileName(file.name);
    setStaffImportResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!data || data.length === 0) {
          setMsg({ type: "error", text: "Uploaded spreadsheet is empty." });
          return;
        }

        const parsed = data.map((r, idx) => {
          const getVal = (...keys: string[]) => {
            for (const k of keys) {
              const target = k.toLowerCase().replace(/[^a-z0-9]/g, "");
              const foundKey = Object.keys(r).find(
                (orig) => orig.toLowerCase().replace(/[^a-z0-9]/g, "") === target
              );
              if (foundKey && r[foundKey] !== undefined && r[foundKey] !== "") {
                return String(r[foundKey]).trim();
              }
            }
            return "";
          };

          const fullName = getVal("fullname", "name", "staffname", "teachername");
          const email = getVal("email", "emailaddress", "username");
          const phone = getVal("phonenumber", "phone", "mobile", "contact");
          let role = getVal("role", "staffrole", "designationrole") || "SUBJECT_TEACHER";
          if (role === "TEACHER" || role === "GENERAL_TEACHER") role = "SUBJECT_TEACHER";
          if (role === "CASHIER") role = "ACCOUNTANT";
          if (role === "ADMIN") role = "SCHOOL_ADMIN";
          const designation = getVal("designation", "post", "title");
          const qualification = getVal("qualification", "degree");
          const department = getVal("department", "dept") || "Academics";
          const aadharNumber = getVal("aadharnumber", "aadhar");
          const bloodGroup = getVal("bloodgroup", "blood");
          const address = getVal("address", "city");

          const isValid = Boolean(fullName);
          let reason = "";
          if (!fullName) reason = "Missing Full Name";

          return {
            rowNum: idx + 1,
            fullName,
            email,
            phone,
            role,
            designation,
            qualification,
            department,
            aadharNumber,
            bloodGroup,
            address,
            isValid,
            reason,
          };
        });

        setStaffImportRows(parsed);
      } catch (err: any) {
        setMsg({ type: "error", text: "Failed to parse spreadsheet: " + err.message });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExecuteStaffImport = async () => {
    const validRows = staffImportRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setMsg({ type: "error", text: "No valid rows found to import. Please review errors." });
      return;
    }

    setStaffImportLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/staff/bulk-import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ staff: validRows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStaffImportResult(data);
      setMsg({ type: "success", text: data.message });
      fetchStaff();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Bulk staff import failed." });
    } finally {
      setStaffImportLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gkp_token");
    localStorage.removeItem("gkp_user");
    router.push(`/school/${slug}/portal/login`);
  };

  // Filtered lists
  const filteredStudents = studentList.filter((s) => {
    const searchMatch =
      !studentSearch ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.admissionNumber && s.admissionNumber.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.parentPhone && s.parentPhone.includes(studentSearch)) ||
      (s.aadharNumber && s.aadharNumber.includes(studentSearch));
    const classGrade = s.enrollments?.[0]?.section?.classGrade?.name || "Class 6";
    const section = s.enrollments?.[0]?.section?.name || "A";
    const classMatch = studentFilterClass === "ALL" || classGrade === studentFilterClass;
    const sectionMatch = studentFilterSection === "ALL" || section === studentFilterSection;
    const catMatch = studentFilterCategory === "ALL" || (s.category || "GENERAL") === studentFilterCategory;
    return searchMatch && classMatch && sectionMatch && catMatch;
  });

  const filteredStaff = staffList.filter((m) => {
    const prof = m.staffProfile || {};
    const searchMatch =
      !staffSearch ||
      (prof.fullName && prof.fullName.toLowerCase().includes(staffSearch.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(staffSearch.toLowerCase())) ||
      (m.phone && m.phone.includes(staffSearch));
    const roleMatch =
      staffFilterRole === "ALL" ||
      m.role === staffFilterRole ||
      (staffFilterRole === "SCHOOL_ADMIN" && (m.role === "ADMIN" || m.role === "SCHOOL_ADMIN")) ||
      (staffFilterRole === "ACCOUNTANT" && (m.role === "ACCOUNTANT" || m.role === "CASHIER")) ||
      (staffFilterRole === "SUBJECT_TEACHER" && (m.role === "SUBJECT_TEACHER" || m.role === "TEACHER"));
    const deptMatch =
      staffFilterDept === "ALL" ||
      (prof.department && prof.department.toLowerCase().includes(staffFilterDept.toLowerCase()));
    return searchMatch && roleMatch && deptMatch;
  });

  if (!currentUser) return null;

  const sectionProps = {
    activeSection,
    setActiveSection,
    isAdmin,
    isAccountant,
    isAccountantOnly,
    isTeacherOnly,
    isDriverOnly,
    teacherClassNames,
    loading,
    currentUser,
    token,
    slug,
    landingConfig,
    setLandingConfig,
    filteredStudents,
    filteredStaff,
    setCurrentUser,
    studentSubTab,
    setStudentSubTab,
    staffSubTab,
    setStaffSubTab,
    classSubTab,
    setClassSubTab,
    attendanceSubTab,
    setAttendanceSubTab,
    feeSubTab,
    setFeeSubTab,
    feeRevenueSummary,
    setFeeRevenueSummary,
    examSubTab,
    setExamSubTab,
    subjectSubTab,
    setSubjectSubTab,
    timetableSubTab,
    setTimetableSubTab,
    transportSubTab,
    setTransportSubTab,
    noticeSubTab,
    setNoticeSubTab,
    websiteSubTab,
    setWebsiteSubTab,
    classesList,
    setClassesList,
    newClassName,
    setNewClassName,
    newClassOrder,
    setNewClassOrder,
    newClassSubjects,
    setNewClassSubjects,
    newClassCustomSubject,
    setNewClassCustomSubject,
    editClassSubjects,
    setEditClassSubjects,
    editClassCustomSubject,
    setEditClassCustomSubject,
    editClassModal,
    setEditClassModal,
    editNoticeModal,
    setEditNoticeModal,
    editRouteModal,
    setEditRouteModal,
    assignStudentRouteModal,
    setAssignStudentRouteModal,
    routeStudentSelect,
    setRouteStudentSelect,
    routeStopSelect,
    setRouteStopSelect,
    routeAssignments,
    setRouteAssignments,
    editSubjectModal,
    setEditSubjectModal,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    desktopSidebarCollapsed,
    setDesktopSidebarCollapsed,
    confirmModal,
    setConfirmModal,
    studentImportModalOpen,
    setStudentImportModalOpen,
    studentImportRows,
    setStudentImportRows,
    studentImportLoading,
    setStudentImportLoading,
    studentImportResult,
    setStudentImportResult,
    studentImportFileName,
    setStudentImportFileName,
    staffImportModalOpen,
    setStaffImportModalOpen,
    staffImportRows,
    setStaffImportRows,
    staffImportLoading,
    setStaffImportLoading,
    staffImportResult,
    setStaffImportResult,
    staffImportFileName,
    setStaffImportFileName,
    mapSubjectModalOpen,
    setMapSubjectModalOpen,
    mapSubjectClassGrade,
    setMapSubjectClassGrade,
    mapSubjectName,
    setMapSubjectName,
    mapSubjectBoard,
    setMapSubjectBoard,
    mapSubjectTeacherId,
    setMapSubjectTeacherId,
    mapSubjectLoading,
    setMapSubjectLoading,
    studentExportModalOpen,
    setStudentExportModalOpen,
    exportFilterClass,
    setExportFilterClass,
    exportFilterSection,
    setExportFilterSection,
    exportFilterGender,
    setExportFilterGender,
    exportFilterCategory,
    setExportFilterCategory,
    exportFilterBloodGroup,
    setExportFilterBloodGroup,
    exportFilterStatus,
    setExportFilterStatus,
    teacherScope,
    setTeacherScope,
    reportCardMode,
    setReportCardMode,
    batchMarks,
    setBatchMarks,
    newPhotoUrl,
    setNewPhotoUrl,
    newPhotoCaption,
    setNewPhotoCaption,
    newPhotoCategory,
    setNewPhotoCategory,
    newVideoTitle,
    setNewVideoTitle,
    newVideoUrl,
    setNewVideoUrl,
    newVideoDesc,
    setNewVideoDesc,
    newFacilityName,
    setNewFacilityName,
    newFacilityIcon,
    setNewFacilityIcon,
    newFacilityDesc,
    setNewFacilityDesc,
    noticesList,
    setNoticesList,
    newNoticeTitle,
    setNewNoticeTitle,
    newNoticeContent,
    setNewNoticeContent,
    newNoticeCategory,
    setNewNoticeCategory,
    newNoticePriority,
    setNewNoticePriority,
    newNoticeAudience,
    setNewNoticeAudience,
    newNoticeIsPinned,
    setNewNoticeIsPinned,
    staffList,
    setStaffList,
    staffSearch,
    setStaffSearch,
    staffFilterRole,
    setStaffFilterRole,
    staffFilterDept,
    setStaffFilterDept,
    staffCategoryTab,
    setStaffCategoryTab,
    newStaffEmployeeNo,
    setNewStaffEmployeeNo,
    newStaffFullName,
    setNewStaffFullName,
    newStaffEmail,
    setNewStaffEmail,
    newStaffPhone,
    setNewStaffPhone,
    newStaffPassword,
    setNewStaffPassword,
    newStaffRole,
    setNewStaffRole,
    newStaffDesignation,
    setNewStaffDesignation,
    newStaffQualification,
    setNewStaffQualification,
    newStaffDepartment,
    setNewStaffDepartment,
    newStaffAadhar,
    setNewStaffAadhar,
    newStaffExperience,
    setNewStaffExperience,
    newStaffEmergencyPhone,
    setNewStaffEmergencyPhone,
    newStaffBloodGroup,
    setNewStaffBloodGroup,
    newStaffAvatarUrl,
    setNewStaffAvatarUrl,
    newStaffAddress,
    setNewStaffAddress,
    newStaffSectionId,
    setNewStaffSectionId,
    newStaffClassFilter,
    setNewStaffClassFilter,
    newStaffSubjectIds,
    setNewStaffSubjectIds,
    newStaffBusRouteId,
    setNewStaffBusRouteId,
    studentList,
    setStudentList,
    studentSearch,
    setStudentSearch,
    studentFilterClass,
    setStudentFilterClass,
    studentFilterSection,
    setStudentFilterSection,
    studentFilterCategory,
    setStudentFilterCategory,
    admissionNo,
    setAdmissionNo,
    rollNo,
    setRollNo,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    studentAvatarUrl,
    setStudentAvatarUrl,
    dob,
    setDob,
    gender,
    setGender,
    aadharNumber,
    setAadharNumber,
    category,
    setCategory,
    bloodGroup,
    setBloodGroup,
    fatherName,
    setFatherName,
    motherName,
    setMotherName,
    parentPhone,
    setParentPhone,
    guardianOccupation,
    setGuardianOccupation,
    villageCity,
    setVillageCity,
    pincode,
    setPincode,
    addressText,
    setAddressText,
    className,
    setClassName,
    sectionName,
    setSectionName,
    editModalStudent,
    setEditModalStudent,
    attendanceDate,
    setAttendanceDate,
    attendanceStatusMap,
    setAttendanceStatusMap,
    monthlyAttendanceMonth,
    setMonthlyAttendanceMonth,
    monthlyAttendanceList,
    setMonthlyAttendanceList,
    seedMonthlyLoading,
    setSeedMonthlyLoading,
    subjectsList,
    setSubjectsList,
    allSchoolSubjects,
    setAllSchoolSubjects,
    subjectClassGrade,
    setSubjectClassGrade,
    newSubjectName,
    setNewSubjectName,
    newSubjectBoard,
    setNewSubjectBoard,
    newSubjectTeacherId,
    setNewSubjectTeacherId,
    timetableEntries,
    setTimetableEntries,
    timetableClassGrade,
    setTimetableClassGrade,
    editSlotModal,
    setEditSlotModal,
    busRoutesList,
    setBusRoutesList,
    newRouteNumber,
    setNewRouteNumber,
    newRouteName,
    setNewRouteName,
    newVehicleNumber,
    setNewVehicleNumber,
    newDriverName,
    setNewDriverName,
    newDriverPhone,
    setNewDriverPhone,
    newDriverUserId,
    setNewDriverUserId,
    newConductorName,
    setNewConductorName,
    newConductorPhone,
    setNewConductorPhone,
    newConductorUserId,
    setNewConductorUserId,
    newPickupTime,
    setNewPickupTime,
    newDropTime,
    setNewDropTime,
    newCapacity,
    setNewCapacity,
    newMonthlyFee,
    setNewMonthlyFee,
    newStopsInput,
    setNewStopsInput,
    feeStructures,
    setFeeStructures,
    invoices,
    setInvoices,
    newFeeName,
    setNewFeeName,
    newFeeClassGrade,
    setNewFeeClassGrade,
    newFeeDueDate,
    setNewFeeDueDate,
    newFeeFrequency,
    setNewFeeFrequency,
    newFeeLateFine,
    setNewFeeLateFine,
    newFeeDesc,
    setNewFeeDesc,
    studentAadharDoc,
    setStudentAadharDoc,
    studentTcDoc,
    setStudentTcDoc,
    studentMarksheetDoc,
    setStudentMarksheetDoc,
    staffAadharDoc,
    setStaffAadharDoc,
    staffDegreeDoc,
    setStaffDegreeDoc,
    staffResumeDoc,
    setStaffResumeDoc,
    staffExpDoc,
    setStaffExpDoc,
    newFeeClasses,
    setNewFeeClasses,
    feeFilterClass,
    setFeeFilterClass,
    feeFilterStructure,
    setFeeFilterStructure,
    feeFilterStatus,
    setFeeFilterStatus,
    attendanceType,
    setAttendanceType,
    staffAttendanceDate,
    setStaffAttendanceDate,
    staffAttendanceStatus,
    setStaffAttendanceStatus,
    staffAttendanceNotes,
    setStaffAttendanceNotes,
    studentAttendanceNotes,
    setStudentAttendanceNotes,
    studentAttendanceClassFilter,
    setStudentAttendanceClassFilter,
    calendarEvents,
    setCalendarEvents,
    calendarViewMode,
    setCalendarViewMode,
    calendarCurrentDate,
    setCalendarCurrentDate,
    calendarFilter,
    setCalendarFilter,
    addCalendarModal,
    setAddCalendarModal,
    newCalTitle,
    setNewCalTitle,
    newCalCategory,
    setNewCalCategory,
    newCalStartDate,
    setNewCalStartDate,
    newCalEndDate,
    setNewCalEndDate,
    newCalDesc,
    setNewCalDesc,
    newCalTargetAudience,
    setNewCalTargetAudience,
    selectedCalendarDay,
    setSelectedCalendarDay,
    editCalendarModal,
    setEditCalendarModal,
    editCalTitle,
    setEditCalTitle,
    editCalCategory,
    setEditCalCategory,
    editCalStartDate,
    setEditCalStartDate,
    editCalEndDate,
    setEditCalEndDate,
    editCalDesc,
    setEditCalDesc,
    editCalTargetAudience,
    setEditCalTargetAudience,
    schoolInquiries,
    setSchoolInquiries,
    inquiriesLoading,
    setInquiriesLoading,
    inquiryStatusFilter,
    setInquiryStatusFilter,
    inquiryTypeFilter,
    setInquiryTypeFilter,
    inquirySearch,
    setInquirySearch,
    selectedInquiry,
    setSelectedInquiry,
    templateCustomizerModal,
    setTemplateCustomizerModal,
    idCardConfig,
    setIdCardConfig,
    reportCardConfig,
    setReportCardConfig,
    selectedStudentIdsForIdCard,
    setSelectedStudentIdsForIdCard,
    bulkPrintIdCardsStudents,
    setBulkPrintIdCardsStudents,
    reportCardClassFilter,
    setReportCardClassFilter,
    reportCardSectionFilter,
    setReportCardSectionFilter,
    reportCardSearch,
    setReportCardSearch,
    selectedInvoiceIds,
    setSelectedInvoiceIds,
    bulkPrintInvoicesModal,
    setBulkPrintInvoicesModal,
    staffMonthlyMonth,
    setStaffMonthlyMonth,
    feeComponents,
    setFeeComponents,
    examsList,
    setExamsList,
    newExamName,
    setNewExamName,
    newExamStartDate,
    setNewExamStartDate,
    newExamEndDate,
    setNewExamEndDate,
    selectedExamId,
    setSelectedExamId,
    markSubject,
    setMarkSubject,
    markStudentEnrollmentId,
    setMarkStudentEnrollmentId,
    markTheoryMarks,
    setMarkTheoryMarks,
    markPracticalMarks,
    setMarkPracticalMarks,
    marksMax,
    setMarksMax,
    markRemarks,
    setMarkRemarks,
    viewReportCard,
    setViewReportCard,
    resetModalUser,
    setResetModalUser,
    overridePassword,
    setOverridePassword,
    profileModalStudent,
    setProfileModalStudent,
    profileModalStaff,
    setProfileModalStaff,
    viewIdCardStudent,
    setViewIdCardStudent,
    viewInvoiceReceipt,
    setViewInvoiceReceipt,
    assignModalStaff,
    setAssignModalStaff,
    assignRole,
    setAssignRole,
    assignSectionId,
    setAssignSectionId,
    assignClassFilter,
    setAssignClassFilter,
    assignSubjectIds,
    setAssignSubjectIds,
    assignBusRouteId,
    setAssignBusRouteId,
    payrollRuns,
    setPayrollRuns,
    payrollStaffList,
    setPayrollStaffList,
    payrollLoading,
    setPayrollLoading,
    selectedPayrollMonth,
    setSelectedPayrollMonth,
    payrollSubTab,
    setPayrollSubTab,
    viewPayslipModal,
    setViewPayslipModal,
    markPaidModal,
    setMarkPaidModal,
    markPaymentMode,
    setMarkPaymentMode,
    markTxnRef,
    setMarkTxnRef,
    markPayRemarks,
    setMarkPayRemarks,
    editSalaryStructureStaff,
    setEditSalaryStructureStaff,
    editStructureForm,
    setEditStructureForm,
    payrollSearch,
    setPayrollSearch,
    payrollStatusFilter,
    setPayrollStatusFilter,
    generatingPayroll,
    setGeneratingPayroll,
    uploadingDesktopMedia,
    setUploadingDesktopMedia,
    roleDropdownOpen,
    setRoleDropdownOpen,
    classInvoiceGenModal,
    setClassInvoiceGenModal,
    classInvoiceGenClass,
    setClassInvoiceGenClass,
    classInvoiceGenStructureId,
    setClassInvoiceGenStructureId,
    adjustInvoiceModal,
    setAdjustInvoiceModal,
    adjustType,
    setAdjustType,
    adjustAmount,
    setAdjustAmount,
    adjustReason,
    setAdjustReason,
    promoteModalOpen,
    setPromoteModalOpen,
    promoteSourceClass,
    setPromoteSourceClass,
    promoteSelectedStudentIds,
    setPromoteSelectedStudentIds,
    promoteTargetClass,
    setPromoteTargetClass,
    promoteTargetSection,
    setPromoteTargetSection,
    promoteTargetYear,
    setPromoteTargetYear,
    promoteIsGraduation,
    setPromoteIsGraduation,
    promotingStudents,
    setPromotingStudents,
    setLoading,
    msg,
    setMsg,
    initialSection,
    navigateToSection,
    toggleDesktopSidebar,
    requestConfirm,
    fetchLandingData,
    fetchStaff,
    fetchStudents,
    fetchNotices,
    fetchCalendarEvents,
    fetchSchoolInquiries,
    handleUpdateSchoolInquiryStatus,
    handleDeleteSchoolInquiry,
    fetchPayrollData,
    handleGeneratePayroll,
    handleOpenSalaryStructureModal,
    handleSaveSalaryStructure,
    handleOpenMarkPaidModal,
    handleSaveMarkPaid,
    handleOpenPromotionModal,
    handleSourceClassChange,
    handleToggleSelectAllPromote,
    handleToggleStudentPromote,
    handleExecutePromotion,
    fetchFeeRevenueSummary,
    handleCreateCalendarEvent,
    handleDeleteCalendarEvent,
    handleOpenEditCalendarEvent,
    handleUpdateCalendarEvent,
    fetchBusRoutes,
    fetchSubjects,
    fetchTimetable,
    fetchMonthlyAttendance,
    fetchFeeData,
    fetchExams,
    fetchClasses,
    fetchTeacherScope,
    uploadDesktopFile,
    handleOpenAssignModal,
    handleSaveStaffAssignments,
    handleGenerateClassInvoices,
    handleAdjustInvoice,
    handleDeleteInvoice,
    handleResetInvoices,
    handleSaveLanding,
    handleSaveLogo,
    getFilteredExportStudents,
    handleExportStudents,
    handleExportStaff,
    handleAddPhoto,
    handleDeletePhoto,
    handleAddVideo,
    handleDeleteVideo,
    handleAddFacility,
    handleDeleteFacility,
    handleCreateNotice,
    handleDeleteNotice,
    handleCreateStaff,
    handleDeleteStaff,
    handleUpdateRole,
    handleToggleStaffRole,
    handleRegisterStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    handleSaveAttendance,
    handleSaveStaffAttendance,
    handleMarkAllStudentsPresent,
    handleResetAttendance,
    handleMarkAllStaffPresent,
    handleSeedMonthlyAttendance,
    handleCreateSubject,
    handleMapSubject,
    handleAssignSubjectTeacher,
    handleSaveTimetableSlot,
    handleCreateBusRoute,
    handleAssignStudentToRoute,
    handleRemoveStudentFromRoute,
    handleDeleteBusRoute,
    handleCreateFeeStructure,
    handleDeleteFeeStructure,
    handleBatchIssueClassInvoices,
    handleRecordPayment,
    handleCreateExam,
    handleRecordMarks,
    handleFetchReportCard,
    handleFetchAggregateReportCard,
    handleRecordBatchMarks,
    handleCreateClass,
    handleUpdateClass,
    handleDeleteClass,
    handleRemoveSubjectFromClass,
    handleUpdateNotice,
    handleUpdateRoute,
    handleUpdateSubject,
    handleDeleteSubject,
    handleAdminResetPassword,
    handleDownloadStudentTemplate,
    handleStudentExcelUpload,
    handleExecuteStudentImport,
    handleDownloadStaffTemplate,
    handleStaffExcelUpload,
    handleExecuteStaffImport,
    handleLogout
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col lg:flex-row font-sans lg:h-screen lg:overflow-hidden">
      {/* Mobile & Tablet Header Bar (Visible only on <lg screens) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs print:hidden">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
            {(landingConfig?.logoUrl || currentUser?.logoUrl) ? (
              <img
                src={landingConfig?.logoUrl || currentUser?.logoUrl}
                alt="Logo"
                className="w-full h-full object-contain p-0.5"
              />
            ) : (
              <div className="h-full w-full bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                {(currentUser.schoolName || slug || "G").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-xs text-slate-950 truncate max-w-[170px] sm:max-w-[300px]">
              {currentUser.schoolName || slug}
            </h1>
            <p className="text-[9px] text-blue-700 font-mono tracking-wider uppercase font-bold">
              {currentUser.role}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1.5 text-xs border border-slate-200"
          aria-label="Toggle navigation menu"
        >
          <span>{mobileSidebarOpen ? "✕" : "☰"}</span>
          <span className="text-[11px] font-semibold">{mobileSidebarOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden print:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Clean Light CBSE) */}
      {/* ========================================================================= */}
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out print:hidden fixed inset-y-0 left-0 z-50 h-full lg:static lg:sticky lg:top-0 lg:h-screen lg:z-30 max-w-[85vw] ${
          desktopSidebarCollapsed
            ? "lg:w-0 lg:border-r-0 lg:overflow-hidden lg:opacity-0 pointer-events-none lg:pointer-events-none"
            : "lg:w-64 lg:opacity-100 w-64"
        } ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 min-w-[250px]">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              {(landingConfig?.logoUrl || currentUser?.logoUrl) ? (
                <img
                  src={landingConfig?.logoUrl || currentUser?.logoUrl}
                  alt="School Logo"
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                <div className="h-full w-full bg-blue-600 flex items-center justify-center font-black text-white text-lg">
                  {(currentUser.schoolName || slug || "G").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="overflow-hidden min-w-0">
              <h1 className="font-extrabold text-sm text-slate-950 truncate max-w-[130px]">
                {currentUser.schoolName || slug}
              </h1>
              <p className="text-[10px] text-blue-700 font-mono tracking-wider uppercase font-bold">
                {currentUser.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Desktop Collapse Icon */}
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Collapse menu (Ctrl+B)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                <path d="m14 15-3-3 3-3" />
              </svg>
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs min-w-[250px]">
          {/* 1. Students (Hidden for Driver & Accountant) */}
          {!isDriverOnly && !isAccountantOnly && (
            <button
              onClick={() => navigateToSection("students")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "students"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎓</span>
                <span>Students</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeSection === "students" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {studentList.length}
              </span>
            </button>
          )}

          {/* 2. Staff and Faculty (School Admin & Principal only) */}
          {isAdmin && (
            <button
              onClick={() => navigateToSection("staff")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "staff"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👥</span>
                <span>Staff & Faculty</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeSection === "staff" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {staffList.length}
              </span>
            </button>
          )}

          {/* 3. Academic Classes (School Admin & Principal only) */}
          {isAdmin && (
            <button
              onClick={() => navigateToSection("classes")}
              title="Manage classes, sections & class teachers"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "classes"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🏛️</span>
                <span>Academic Classes</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeSection === "classes" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {classesList.length}
              </span>
            </button>
          )}

          {/* 4. Subject and Teachers (Hidden for Driver & Accountant) */}
          {!isDriverOnly && !isAccountantOnly && (
            <button
              onClick={() => navigateToSection("subjects")}
              title="Manage which teacher has which subject"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "subjects"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📚</span>
                <span>Subject and Teachers</span>
              </div>
            </button>
          )}

          {/* 5. Attendance : Staff and Students (Hidden for Driver & Accountant) */}
          {!isDriverOnly && !isAccountantOnly && (
            <button
              onClick={() => navigateToSection("attendance")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "attendance"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📋</span>
                <span>Daily Attendance</span>
              </div>
            </button>
          )}

          {/* 6. Exams and Report Cards (Hidden for Driver & Accountant) */}
          {!isDriverOnly && !isAccountantOnly && (
            <button
              onClick={() => navigateToSection("exams")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "exams"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📊</span>
                <span>Exams & Report Cards</span>
              </div>
            </button>
          )}

          {/* 7. Fee and Invoices (Accountant and Admin primary, Teacher view-only; Hidden for Driver) */}
          {!isDriverOnly && (
            <button
              onClick={() => navigateToSection("fees")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "fees"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">💳</span>
                <span>School Fees & Receipt</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeSection === "fees" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {feeStructures.length}
              </span>
            </button>
          )}

          {/* 8. Weekly Timetable (Hidden for Driver & Accountant) */}
          {!isDriverOnly && !isAccountantOnly && (
            <button
              onClick={() => navigateToSection("timetable")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "timetable"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🗓️</span>
                <span>Weekly Timetable</span>
              </div>
            </button>
          )}

          {/* 9. Transport & Bus Routes (Driver, Admin, Teacher; Hidden for Accountant) */}
          {!isAccountantOnly && (
            <button
              onClick={() => navigateToSection("transport")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "transport"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🚌</span>
                <span>Transport & Bus Routes</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeSection === "transport" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {busRoutesList.length}
              </span>
            </button>
          )}

          {/* 10. Notice Board (Hidden for Driver & Accountant) */}
          {!isDriverOnly && !isAccountantOnly && (
            <button
              onClick={() => navigateToSection("notices")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "notices"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📢</span>
                <span>Notice Board</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeSection === "notices" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {noticesList.length}
              </span>
            </button>
          )}

          {/* 11. Holiday Calendar & School Planner */}
          <button
            onClick={() => navigateToSection("calendar")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
              activeSection === "calendar"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base shrink-0">📅</span>
              <span className="truncate">Holiday Calendar</span>
            </div>
            {calendarEvents.length > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeSection === "calendar" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {calendarEvents.length}
              </span>
            )}
          </button>

          {/* 12. School Website & CMS */}
          {isAdmin && (
            <button
              onClick={() => navigateToSection("website")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "website"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🌐</span>
                <span>School Website & CMS</span>
              </div>
            </button>
          )}

          {/* 13. Admissions & Inquiries */}
          {isAdmin && (
            <button
              onClick={() => navigateToSection("inquiries")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "inquiries"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">📨</span>
                <span className="truncate">Admissions & Inquiries</span>
              </div>
              {schoolInquiries.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    activeSection === "inquiries"
                      ? "bg-blue-700 text-white"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {schoolInquiries.length}
                </span>
              )}
            </button>
          )}

          {/* 14. Staff Payroll & Salaries (Admin, Principal, Accountant) */}
          {(isAdmin || isAccountantOnly || currentUser?.role === "PRINCIPAL") && (
            <button
              onClick={() => navigateToSection("payroll")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "payroll"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">💰</span>
                <span className="truncate">Staff Payroll & Salaries</span>
              </div>
              {payrollRuns.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    activeSection === "payroll"
                      ? "bg-blue-700 text-white"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  {payrollRuns.length}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/50 min-w-[250px]">
          <Link
            href={`/school/${slug}`}
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-blue-700 border border-slate-200 shadow-xs transition flex items-center justify-center gap-2"
          >
            <span>🌐</span> School Campus ↗
          </Link>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-600 truncate max-w-[120px] font-mono font-medium">
              {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-700 font-bold"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main
        id="dashboard-main-content"
        className={`w-full lg:flex-1 min-w-0 px-3.5 pt-3.5 pb-40 sm:px-5 sm:pt-5 sm:pb-36 lg:p-8 space-y-5 lg:space-y-6 lg:overflow-y-auto lg:h-screen bg-slate-100/70 ${
          viewIdCardStudent || viewReportCard || viewInvoiceReceipt || bulkPrintIdCardsStudents || bulkPrintInvoicesModal
            ? "print:hidden"
            : ""
        }`}
      >
        {/* Modern Desktop Header & Sidebar Navigation Bar */}
        <div className="hidden lg:flex items-center justify-between pb-3 border-b border-slate-200/80 print:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-2xs border border-transparent hover:border-slate-200 transition group flex items-center justify-center"
              title={desktopSidebarCollapsed ? "Expand menu (Ctrl+B)" : "Collapse menu (Ctrl+B)"}
            >
              <svg
                className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                {desktopSidebarCollapsed ? (
                  <path d="m14 9 3 3-3 3" />
                ) : (
                  <path d="m15 15-3-3 3-3" />
                )}
              </svg>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="text-slate-500 font-semibold">{currentUser?.schoolName || slug}</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-700 uppercase font-mono text-[11px] tracking-wide">{activeSection}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              Academic Session 2026-27
            </span>
          </div>
        </div>
        {/* Global Feedback Banner */}
        {msg && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between border shadow-xs ${
              msg.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                : "bg-red-50 border-red-300 text-red-900 font-bold"
            }`}
          >
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="text-slate-500 hover:text-slate-800 font-bold">
              ✕
            </button>
          </div>
        )}


        {/* Modular Section Components */}
        <StudentSection {...sectionProps} />
        <StaffSection {...sectionProps} />
        <ClassesSection {...sectionProps} />
        <AttendanceSection {...sectionProps} />
        <FeesSection {...sectionProps} />
        <ResultSection {...sectionProps} />
        <SubjectsSection {...sectionProps} />
        <TimetableSection {...sectionProps} />
        <TransportSection {...sectionProps} />
        <CalendarSection {...sectionProps} />
        <NoticesSection {...sectionProps} />
        <WebsiteSection {...sectionProps} />
        <InquiriesSection {...sectionProps} />
        <PayrollSection {...sectionProps} />

        {/* Mobile bottom buffer to ensure full scrolling past mobile browser bottom address/navigation bars */}
        <div className="h-28 lg:hidden shrink-0" aria-hidden="true" />
      </main>
    </div>
  );
}
