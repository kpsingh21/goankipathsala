"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE } from "@/lib/config";
import * as XLSX from "xlsx";


interface FeeComponent {
  name: string;
  amount: string;
}

export default function SchoolDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

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
  >("students");

  // Two-tab state for each section
  const [studentSubTab, setStudentSubTab] = useState<"list" | "create">("list");
  const [staffSubTab, setStaffSubTab] = useState<"list" | "create">("list");
  const [classSubTab, setClassSubTab] = useState<"list" | "create">("list");
  const [attendanceSubTab, setAttendanceSubTab] = useState<"monthly" | "daily">("monthly");
  const [feeSubTab, setFeeSubTab] = useState<"invoices" | "catalog">("invoices");
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
  const [editClassModal, setEditClassModal] = useState<any | null>(null);

  // Modals for Edit Notice, Route, Subject
  const [editNoticeModal, setEditNoticeModal] = useState<any | null>(null);
  const [editRouteModal, setEditRouteModal] = useState<any | null>(null);
  const [editSubjectModal, setEditSubjectModal] = useState<any | null>(null);

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

  const [newStaffFullName, setNewStaffFullName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("TEACHER");
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

  const [admissionNo, setAdmissionNo] = useState("");
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
  const [subjectClassGrade, setSubjectClassGrade] = useState("Class 6");
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
  const [assignRole, setAssignRole] = useState("TEACHER");
  const [assignSectionId, setAssignSectionId] = useState("");
  const [assignSubjectIds, setAssignSubjectIds] = useState<string[]>([]);
  const [assignBusRouteId, setAssignBusRouteId] = useState("");
  const [uploadingDesktopMedia, setUploadingDesktopMedia] = useState(false);
  const [classInvoiceGenModal, setClassInvoiceGenModal] = useState(false);
  const [classInvoiceGenClass, setClassInvoiceGenClass] = useState("Class 6");
  const [classInvoiceGenStructureId, setClassInvoiceGenStructureId] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("gkp_token") : null;

  // Role authorization helpers
  const isAdmin = currentUser && ["SCHOOL_ADMIN", "ADMIN", "PRINCIPAL", "SUPERADMIN"].includes(currentUser.role);
  const isTeacher = currentUser && ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isClassTeacher = currentUser && ["CLASS_TEACHER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isSubjectTeacher = currentUser && ["SUBJECT_TEACHER", "TEACHER", "CLASS_TEACHER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isAccountant = currentUser && ["ACCOUNTANT", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);
  const isDriver = currentUser && ["DRIVER", "SCHOOL_ADMIN", "ADMIN", "PRINCIPAL"].includes(currentUser.role);

  useEffect(() => {
    const storedUser = localStorage.getItem("gkp_user");
    if (!token || !storedUser) {
      router.push(`/school/${slug}/login`);
      return;
    }
    const user = JSON.parse(storedUser);
    setCurrentUser(user);
    if (user.role === "DRIVER") {
      setActiveSection("transport");
    } else if (user.role === "ACCOUNTANT") {
      setActiveSection("fees");
    } else {
      setActiveSection("students");
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
    fetchExams();
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

  const fetchBusRoutes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/transport/routes`, {
        headers: { "X-Tenant-Slug": slug },
      });
      if (res.ok) {
        const d = await res.json();
        setBusRoutesList(d.routes || []);
      }
    } catch (e) {}
  };

  const fetchSubjects = async (gradeName: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/subjects?classGradeName=${encodeURIComponent(gradeName)}`,
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
        setMonthlyAttendanceList(d.attendance || []);
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
    setAssignRole(staff.role || "TEACHER");
    setAssignSectionId(staff.headedSections?.[0]?.id || "");
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
        setMsg({ type: "success", text: data.message || "Class invoices generated successfully!" });
        setClassInvoiceGenModal(false);
        fetchFeeData();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to generate class invoices." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to generate class invoices." });
    } finally {
      setLoading(false);
    }
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

  const handleAddPhoto = () => {
    if (!newPhotoUrl || !newPhotoCaption) {
      alert("Please provide image URL and caption");
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
      alert("Please provide video title and embed URL");
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
      alert("Please provide facility name and description");
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

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
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
  };

  // Staff handlers
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
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
      setNewStaffFullName("");
      setNewStaffEmail("");
      setNewStaffPhone("");
      setNewStaffPassword("");
      setNewStaffAadhar("");
      setNewStaffSectionId("");
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

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove staff member "${name}"?`)) return;
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
        body: JSON.stringify({ targetUserId, newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: `Staff role escalated to ${newRole}!` });
      fetchStaff();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to update role." });
    }
  };

  // Student handlers
  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          admissionNumber: admissionNo,
          firstName,
          lastName,
          avatarUrl: studentAvatarUrl,
          dob,
          gender,
          aadharNumber,
          category,
          bloodGroup,
          fatherName,
          motherName,
          parentPhone,
          guardianOccupation,
          villageCity,
          pincode,
          addressText,
          classGradeName: className,
          sectionName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: `Student ${firstName} ${lastName} enrolled successfully!` });
      setAdmissionNo("");
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
      setStudentSubTab("list");
      fetchStudents();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to enroll student." });
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
      setMsg({ type: "error", text: err.message || "Failed to update student." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete student "${name}"? This removes their attendance, exam, and billing records.`)) return;
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

  const handleDeleteBusRoute = async (id: string) => {
    if (!confirm("Delete this bus route?")) return;
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
  };

  // Fees handlers
  const handleCreateFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/fees/structures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          name: newFeeName,
          classGradeName: newFeeClassGrade,
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
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "Fee Structure configured successfully!" });
      fetchFeeData();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create fee structure." });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchIssueClassInvoices = async (structureId: string) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/fees/generate-class-invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ feeStructureId: structureId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: data.message });
      setFeeSubTab("invoices");
      fetchFeeData();
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
      setMsg({ type: "success", text: d.message });
      setNewClassName("");
      fetchClasses();
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

  const handleDeleteClass = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete class "${name}"?`)) return;
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

  const handleDeleteSubject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete subject "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/subjects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg({ type: "success", text: d.message });
      fetchSubjects(subjectClassGrade);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to delete subject." });
    }
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
      alert("No valid rows found to import. Please review errors.");
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
        "Role* (TEACHER / CLASS_TEACHER / SUBJECT_TEACHER / PRINCIPAL / DRIVER / ACCOUNTANT)": "TEACHER",
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
        "Role* (TEACHER / CLASS_TEACHER / SUBJECT_TEACHER / PRINCIPAL / DRIVER / ACCOUNTANT)": "CLASS_TEACHER",
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
        "Role* (TEACHER / CLASS_TEACHER / SUBJECT_TEACHER / PRINCIPAL / DRIVER / ACCOUNTANT)": "DRIVER",
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
          const role = getVal("role", "staffrole", "designationrole") || "TEACHER";
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
      alert("No valid rows found to import. Please review errors.");
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
    router.push(`/school/${slug}/login`);
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
    const roleMatch = staffFilterRole === "ALL" || m.role === staffFilterRole;
    const deptMatch =
      staffFilterDept === "ALL" ||
      (prof.department && prof.department.toLowerCase().includes(staffFilterDept.toLowerCase()));
    return searchMatch && roleMatch && deptMatch;
  });

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans">
      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Clean Light CBSE) */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen sticky top-0 h-screen z-30 shadow-xs">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-sm">
            ग
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-sm text-slate-950 truncate">
              {currentUser.schoolName || slug}
            </h1>
            <p className="text-[10px] text-blue-700 font-mono tracking-wider uppercase font-bold">
              {currentUser.role}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
          {currentUser.role !== "DRIVER" && (
            <button
              onClick={() => setActiveSection("students")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "students"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>🎓</span>
                <span>Student SIS</span>
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

          {isAdmin && (
            <button
              onClick={() => setActiveSection("staff")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "staff"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>👥</span>
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

          {isAdmin && (
            <button
              onClick={() => setActiveSection("classes")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "classes"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>🏛️</span>
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

          {currentUser.role !== "DRIVER" && currentUser.role !== "ACCOUNTANT" && (
            <button
              onClick={() => setActiveSection("attendance")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "attendance"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>📋</span>
                <span>Attendance Engine</span>
              </div>
            </button>
          )}

          {currentUser.role !== "DRIVER" && (
            <button
              onClick={() => setActiveSection("fees")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "fees"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>💳</span>
                <span>Fees & Invoices</span>
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

          {currentUser.role !== "DRIVER" && currentUser.role !== "ACCOUNTANT" && (
            <button
              onClick={() => setActiveSection("exams")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "exams"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>📊</span>
                <span>Exams & Report Cards</span>
              </div>
            </button>
          )}

          {currentUser.role !== "DRIVER" && currentUser.role !== "ACCOUNTANT" && (
            <button
              onClick={() => setActiveSection("subjects")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "subjects"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>📚</span>
                <span>Subjects & Teachers</span>
              </div>
            </button>
          )}

          {currentUser.role !== "DRIVER" && currentUser.role !== "ACCOUNTANT" && (
            <button
              onClick={() => setActiveSection("timetable")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "timetable"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>🗓️</span>
                <span>Weekly Timetable</span>
              </div>
            </button>
          )}

          <button
            onClick={() => setActiveSection("transport")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
              activeSection === "transport"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🚌</span>
              <span>Bus Routes</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                activeSection === "transport" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {busRoutesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection("notices")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
              activeSection === "notices"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📢</span>
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

          {isAdmin && (
            <button
              onClick={() => setActiveSection("website")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition ${
                activeSection === "website"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>🌐</span>
                <span>Website & Facilities</span>
              </div>
            </button>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/50">
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
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 p-8 space-y-6 overflow-y-auto bg-slate-100/70">
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

        {/* ======================================================================= */}
        {/* SECTION 1: STUDENT SIS */}
        {/* ======================================================================= */}
                {activeSection === "students" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-950">
                  <span>🎓</span> Student Information System (SIS)
                </h2>
                <p className="text-xs mt-1 text-slate-600">
                  Manage student profiles, enrollments, parents, village records, and academic status.
                </p>
              </div>

              {/* Action buttons & tabs */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStudentImportModalOpen(true);
                    setStudentImportRows([]);
                    setStudentImportResult(null);
                    setStudentImportFileName("");
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
                >
                  <span>📥</span>
                  <span>Import via Excel</span>
                </button>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    onClick={() => setStudentSubTab("list")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      studentSubTab === "list"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-bold"
                    }`}
                  >
                    📋 View Students ({studentList.length})
                  </button>
                  <button
                    onClick={() => setStudentSubTab("create")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      studentSubTab === "create"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-bold"
                    }`}
                  >
                    ➕ Enroll Student
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-tab 1: List with filters */}
            {studentSubTab === "list" && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white border border-slate-200 shadow-xs text-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      🔍 Search Name, Admission, Mobile
                    </label>
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="e.g. Aarav, ADM-2026..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Class Grade
                    </label>
                    <select
                      value={studentFilterClass}
                      onChange={(e) => setStudentFilterClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="ALL">All Configured Classes ({classesList.length})</option>
                      {classesList.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Section
                    </label>
                    <select
                      value={studentFilterSection}
                      onChange={(e) => setStudentFilterSection(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="ALL">All Sections</option>
                      {["A", "B", "C", "D"].map((s) => (
                        <option key={s} value={s}>
                          Section {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={studentFilterCategory}
                      onChange={(e) => setStudentFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="GENERAL">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Student</th>
                          <th className="p-3.5">Admission No</th>
                          <th className="p-3.5">Class & Section</th>
                          <th className="p-3.5">Parents / Contact</th>
                          <th className="p-3.5">Village / Address</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-200 overflow-hidden flex items-center justify-center font-bold text-blue-700 text-xs shrink-0">
                                {s.avatarUrl ? (
                                  <img src={s.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  `${s.firstName[0]}${s.lastName[0]}`
                                )}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-950 text-xs">
                                  {s.firstName} {s.lastName}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {s.gender} • <span className="font-bold text-slate-700">{s.category || "GENERAL"}</span>
                                </p>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-blue-700">
                              <span className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-blue-700">
                                {s.admissionNumber}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                                {s.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} -{" "}
                                {s.enrollments?.[0]?.section?.name || "A"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <p className="text-slate-900 font-bold">{s.fatherName || "—"}</p>
                              <p className="text-xs text-blue-700 font-bold font-mono">{s.parentPhone || "—"}</p>
                            </td>
                            <td className="p-3.5">
                              <p className="text-slate-900 font-semibold">{s.villageCity || "—"}</p>
                              <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                                {s.addressText || "Campus Area"}
                              </p>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <button
                                  onClick={() => setViewIdCardStudent(s)}
                                  title="Print ID Card"
                                  className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                >
                                  🪪
                                </button>
                                <button
                                  onClick={() => setProfileModalStudent(s)}
                                  title="View Profile"
                                  className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                >
                                  👤
                                </button>
                                <button
                                  onClick={() =>
                                    setEditModalStudent({
                                      ...s,
                                      classGradeName: s.enrollments?.[0]?.section?.classGrade?.name || "Class 6",
                                      sectionName: s.enrollments?.[0]?.section?.name || "A",
                                    })
                                  }
                                  title="Edit Student"
                                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                >
                                  ✏️
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteStudent(s.id, `${s.firstName} ${s.lastName}`)}
                                    title="Delete Student"
                                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Enroll New Student Form */}
            {studentSubTab === "create" && (
              <form onSubmit={handleRegisterStudent} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  + New Student Admission & Profile Enrollment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Admission Number *</label>
                    <input
                      type="text"
                      required
                      value={admissionNo}
                      onChange={(e) => setAdmissionNo(e.target.value)}
                      placeholder="ADM-2026-003"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Rohan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Verma"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Photo / Avatar URL</label>
                      <label className="text-[10px] text-blue-600 hover:text-blue-700 cursor-pointer font-bold flex items-center gap-1">
                        <span>📁 Upload Desktop</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => uploadDesktopFile(e, (url) => setStudentAvatarUrl(url))}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={studentAvatarUrl}
                      onChange={(e) => setStudentAvatarUrl(e.target.value)}
                      placeholder="https://... or uploaded file"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Grade *</label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      {classesList.length > 0 ? (
                        classesList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <option value="Class 6">Class 6</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Section *</label>
                    <select
                      value={sectionName}
                      onChange={(e) => setSectionName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      {["A", "B", "C", "D"].map((s) => (
                        <option key={s} value={s}>
                          Section {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Aadhar Number (12 Digits)</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value)}
                      placeholder="4521 7890 1234"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="GENERAL">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Father's Name</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Kailash Verma"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Maya Verma"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+91 98260 11223"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Guardian Occupation</label>
                    <input
                      type="text"
                      value={guardianOccupation}
                      onChange={(e) => setGuardianOccupation(e.target.value)}
                      placeholder="Agriculture / Business"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Village / Town / City</label>
                    <input
                      type="text"
                      value={villageCity}
                      onChange={(e) => setVillageCity(e.target.value)}
                      placeholder="Goradiya Village"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Postal Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="451001"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={addressText}
                      onChange={(e) => setAddressText(e.target.value)}
                      placeholder="Ward No. 4, Near Panchayat Bhavan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  {loading ? "Enrolling..." : "+ Complete Student Enrollment"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 2: STAFF & FACULTY */}
        {/* ======================================================================= */}
        {activeSection === "staff" && isAdmin && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-950">
                  <span>👥</span> School Staff & Faculty Directory
                </h2>
                <p className="text-xs mt-1 text-slate-600">
                  Onboard and assign Principals, Class Teachers, Subject Teachers, Accountants, and Bus Drivers with workload controls.
                </p>
              </div>

              {/* Action buttons & tabs */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStaffImportModalOpen(true);
                    setStaffImportRows([]);
                    setStaffImportResult(null);
                    setStaffImportFileName("");
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-xs"
                >
                  <span>📥</span>
                  <span>Import Faculty via Excel</span>
                </button>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    onClick={() => setStaffSubTab("list")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      staffSubTab === "list"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-bold"
                    }`}
                  >
                    👥 Staff Directory ({staffList.length})
                  </button>
                  <button
                    onClick={() => setStaffSubTab("create")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      staffSubTab === "create"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-bold"
                    }`}
                  >
                    ➕ Register New Staff
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-tab 1: Staff list with filters */}
            {staffSubTab === "list" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 shadow-xs text-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      🔍 Search Name, Email, Mobile
                    </label>
                    <input
                      type="text"
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      placeholder="e.g. Suresh or @school.edu..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Filter by Role
                    </label>
                    <select
                      value={staffFilterRole}
                      onChange={(e) => setStaffFilterRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                    >
                      <option value="ALL">All Roles ({staffList.length})</option>
                      <option value="PRINCIPAL">Principal / Headmaster</option>
                      <option value="ADMIN">Admin / School Admin</option>
                      <option value="CLASS_TEACHER">Class Teacher</option>
                      <option value="SUBJECT_TEACHER">Subject Teacher</option>
                      <option value="TEACHER">General Teacher</option>
                      <option value="ACCOUNTANT">Accountant</option>
                      <option value="DRIVER">Bus Driver</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Filter by Department
                    </label>
                    <select
                      value={staffFilterDept}
                      onChange={(e) => setStaffFilterDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Science">Science & Maths</option>
                      <option value="Humanities">Humanities & Social</option>
                      <option value="Languages">Languages & Literature</option>
                      <option value="Administration">Administration & Accounts</option>
                      <option value="Transport">Transport & Logistics</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Staff Member</th>
                          <th className="p-3.5">Designation & Workload</th>
                          <th className="p-3.5">Contact Details</th>
                          <th className="p-3.5">Aadhar / ID</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {filteredStaff.map((m) => {
                          const prof = m.staffProfile || {};
                          return (
                            <tr key={m.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-3.5 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-200 overflow-hidden flex items-center justify-center font-bold text-blue-700 text-xs shrink-0">
                                  {prof.avatarUrl ? (
                                    <img src={prof.avatarUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    (prof.fullName || m.email || "S").charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <p className="font-extrabold text-slate-950 text-xs">
                                    {prof.fullName || m.email?.split("@")[0] || "Staff Member"}
                                  </p>
                                  <p className="text-[11px] text-slate-500 font-medium">{prof.qualification || "Faculty"}</p>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <p className="text-slate-900 font-bold">{prof.designation || m.role}</p>
                                <div className="text-[10px] space-y-0.5 mt-0.5">
                                  {m.headedSections && m.headedSections.length > 0 && (
                                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold mr-1">
                                      🏛️ Class Teacher: {m.headedSections.map((s: any) => `${s.classGrade?.name || ''} - ${s.name}`).join(', ')}
                                    </span>
                                  )}
                                  {m.taughtSubjects && m.taughtSubjects.length > 0 && (
                                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-bold mr-1">
                                      📚 Subjects: {m.taughtSubjects.map((s: any) => `${s.name} (${s.classGrade?.name || ''})`).join(', ')}
                                    </span>
                                  )}
                                  {m.drivenBusRoutes && m.drivenBusRoutes.length > 0 && (
                                    <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                                      🚌 Route: {m.drivenBusRoutes.map((r: any) => `${r.routeNumber} (${r.routeName})`).join(', ')}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5 font-mono">
                                <div className="font-bold text-blue-700 text-xs">{m.email}</div>
                                <div className="text-blue-700 font-semibold text-[11px]">{m.phone || "—"}</div>
                              </td>
                              <td className="p-3.5 font-mono text-slate-600 text-xs">
                                {prof.aadharNumber ? `•••• ${prof.aadharNumber.slice(-4)}` : "—"}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                    m.role === "PRINCIPAL"
                                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                                      : m.role === "SCHOOL_ADMIN" || m.role === "ADMIN"
                                      ? "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200"
                                      : m.role === "CLASS_TEACHER"
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : m.role === "SUBJECT_TEACHER"
                                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                      : m.role === "TEACHER"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : m.role === "DRIVER"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-slate-100 text-slate-700 border border-slate-200"
                                  }`}
                                >
                                  {m.role}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                  <button
                                    onClick={() => handleOpenAssignModal(m)}
                                    title="Assign Role, Headed Class & Subject Workload"
                                    className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                  >
                                    🎯
                                  </button>
                                  <button
                                    onClick={() => setProfileModalStaff(m)}
                                    title="View Staff Profile"
                                    className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                  >
                                    👤
                                  </button>
                                  {m.id !== currentUser.id && (
                                    <>
                                      <button
                                        onClick={() => setResetModalUser(m)}
                                        title="Reset Password"
                                        className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                      >
                                        🔑
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStaff(m.id, prof.fullName || m.email)}
                                        title="Delete Staff Member"
                                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                      >
                                        🗑️
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Register Staff Form */}
            {staffSubTab === "create" && (
              <form onSubmit={handleCreateStaff} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  + Register Faculty / Staff Member & Assign Workload
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStaffFullName}
                      onChange={(e) => setNewStaffFullName(e.target.value)}
                      placeholder="Suresh Kumar Verma"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email / Login ID *</label>
                    <input
                      type="email"
                      required
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="suresh@school.edu"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Initial Password *</label>
                    <input
                      type="password"
                      required
                      value={newStaffPassword}
                      onChange={(e) => setNewStaffPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Role *</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="TEACHER">General Teacher</option>
                      <option value="CLASS_TEACHER">Class Teacher (Heads a Section)</option>
                      <option value="SUBJECT_TEACHER">Subject Teacher (Specialized)</option>
                      <option value="PRINCIPAL">Principal / Headmaster</option>
                      <option value="ADMIN">Administrative Officer</option>
                      <option value="ACCOUNTANT">Accountant / Cashier</option>
                      <option value="DRIVER">Bus Driver</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={newStaffDesignation}
                      onChange={(e) => setNewStaffDesignation(e.target.value)}
                      placeholder="Senior PGT Mathematics"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Academic Qualification</label>
                    <input
                      type="text"
                      value={newStaffQualification}
                      onChange={(e) => setNewStaffQualification(e.target.value)}
                      placeholder="M.Sc, B.Ed"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={newStaffDepartment}
                      onChange={(e) => setNewStaffDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="Science">Science & Mathematics</option>
                      <option value="Humanities">Humanities & Social Studies</option>
                      <option value="Languages">Languages & Literature</option>
                      <option value="Administration">Administration & Accounts</option>
                      <option value="Transport">Transport & Logistics</option>
                      <option value="Sports">Sports & Physical Ed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      placeholder="+91 98260 99887"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Aadhar Number (12 Digits)</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={newStaffAadhar}
                      onChange={(e) => setNewStaffAadhar(e.target.value)}
                      placeholder="12-digit UIDAI number"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Photo / Avatar URL</label>
                      <label className="text-[10px] text-blue-600 hover:text-blue-700 cursor-pointer font-bold flex items-center gap-1">
                        <span>📁 Upload Desktop</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => uploadDesktopFile(e, (url) => setNewStaffAvatarUrl(url))}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={newStaffAvatarUrl}
                      onChange={(e) => setNewStaffAvatarUrl(e.target.value)}
                      placeholder="https://... or uploaded file"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Direct Onboarding Workload Assignments (Classes & Subjects) */}
                {["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN"].includes(newStaffRole) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-[11px] text-blue-800 font-bold mb-1">
                        🏛️ Assign as Class Teacher for Section (Optional)
                      </label>
                      <p className="text-[10px] text-slate-600 mb-2">Teacher will head this section and take daily attendance.</p>
                      <select
                        value={newStaffSectionId}
                        onChange={(e) => setNewStaffSectionId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                      >
                        <option value="">— None (Not Heading a Class) —</option>
                        {classesList.flatMap((cls: any) =>
                          (cls.sections || []).map((sec: any) => (
                            <option key={sec.id} value={sec.id}>
                              {cls.name} - Section {sec.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-indigo-800 font-bold mb-1">
                        📚 Assign Curriculum Subjects to Teach (Optional)
                      </label>
                      <p className="text-[10px] text-slate-600 mb-2">Select subjects from school's configured curriculum.</p>
                      <div className="max-h-28 overflow-y-auto space-y-1 p-2 rounded-xl bg-white border border-slate-300">
                        {(allSchoolSubjects.length > 0 ? allSchoolSubjects : subjectsList).length === 0 ? (
                          <p className="text-[10px] text-slate-500 py-1 text-center">No subjects created yet.</p>
                        ) : (
                          (allSchoolSubjects.length > 0 ? allSchoolSubjects : subjectsList).map((sub: any) => {
                            const checked = newStaffSubjectIds.includes(sub.id);
                            return (
                              <label
                                key={sub.id}
                                className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer text-xs ${
                                  checked ? "bg-blue-50 text-blue-900 font-bold border border-blue-200" : "text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                <span>{sub.name} <span className="text-[10px] text-slate-500">({sub.classGrade?.name || "Grade"})</span></span>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    if (checked) {
                                      setNewStaffSubjectIds(newStaffSubjectIds.filter((id) => id !== sub.id));
                                    } else {
                                      setNewStaffSubjectIds([...newStaffSubjectIds, sub.id]);
                                    }
                                  }}
                                  className="accent-blue-600 h-3.5 w-3.5"
                                />
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {newStaffRole === "DRIVER" && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-[11px] text-amber-800 font-bold mb-1">
                      🚌 Assign Bus Route (Optional)
                    </label>
                    <select
                      value={newStaffBusRouteId}
                      onChange={(e) => setNewStaffBusRouteId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                    >
                      <option value="">— None / Transport Pool —</option>
                      {busRoutesList.map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.routeNumber}: {r.routeName} ({r.vehicleNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  {loading ? "Registering..." : "+ Register Faculty Member"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 2.5: ACADEMIC CLASSES (Pre-KG to 12) */}
        {/* ======================================================================= */}
        {activeSection === "classes" && isAdmin && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>🏛️</span> Academic Classes & Kindergarten Hierarchy
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Manage class grades from Pre-KG, Nursery, LKG, UKG to Class 12, assign sections, and configure curriculum.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setClassSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    classSubTab === "list"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  🏛️ Classes & Sections ({classesList.length})
                </button>
                <button
                  onClick={() => setClassSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    classSubTab === "create"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  ➕ Add New Class Grade
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Classes list */}
            {classSubTab === "list" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Class / Grade Name</th>
                        <th className="p-3.5">Order</th>
                        <th className="p-3.5">Sections</th>
                        <th className="p-3.5">Enrolled Students</th>
                        <th className="p-3.5">Curriculum Subjects</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {classesList.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3.5 font-extrabold text-slate-950 text-sm">{c.name}</td>
                          <td className="p-3.5 font-mono text-slate-600">{c.numericalOrder}</td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {(c.sections || []).map((sec: any) => (
                                <span
                                  key={sec.id}
                                  className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-mono font-bold text-blue-700 border border-blue-200"
                                >
                                  {sec.name} ({sec.studentCount} studs)
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5 font-bold font-mono text-blue-700">{c.studentCount}</td>
                          <td className="p-3.5 text-slate-700">
                            {c.subjectsCount > 0 ? (
                              <span className="text-xs font-medium">{c.subjects.join(", ")}</span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No subjects mapped yet</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => setEditClassModal(c)}
                                title="Edit Class Configuration"
                                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteClass(c.id, c.name)}
                                title="Delete Class"
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold flex items-center justify-center text-sm shadow-xs transition"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Create Class Form */}
            {classSubTab === "create" && (
              <form onSubmit={handleCreateClass} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 max-w-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  + Add New Class / Academic Level
                </h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Grade Name *</label>
                  <input
                    type="text"
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g. Pre-KG, Nursery, Playgroup, Class 11 Science"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Pre-KG, Nursery, LKG, UKG, and Classes 1 to 12 can be configured.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Numerical Sequence Order</label>
                  <input
                    type="number"
                    value={newClassOrder}
                    onChange={(e) => setNewClassOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none font-mono focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Negative or low numbers for pre-primary (-3 for Pre-KG, -2 for Nursery, etc.)</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  {loading ? "Creating..." : "+ Create Academic Class"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 3: ATTENDANCE */}
        {/* ======================================================================= */}
        {activeSection === "attendance" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>📋</span> Student Attendance System
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Track month-wise aggregate attendance rates and conduct morning roll call.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => {
                    setAttendanceSubTab("monthly");
                    fetchMonthlyAttendance(monthlyAttendanceMonth);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    attendanceSubTab === "monthly"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  📅 Monthly Register & Matrix
                </button>
                <button
                  onClick={() => setAttendanceSubTab("daily")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    attendanceSubTab === "daily"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  ☀️ Daily Roll Call Entry
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Monthly Register */}
            {attendanceSubTab === "monthly" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-700 font-bold">Select Month:</span>
                    <input
                      type="month"
                      value={monthlyAttendanceMonth}
                      onChange={(e) => {
                        setMonthlyAttendanceMonth(e.target.value);
                        fetchMonthlyAttendance(e.target.value);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none font-mono focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  {currentUser.role === "SCHOOL_ADMIN" && (
                    <button
                      onClick={handleSeedMonthlyAttendance}
                      disabled={seedMonthlyLoading}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                    >
                      {seedMonthlyLoading ? "Generating..." : "⚡ Generate Realistic Month Attendance"}
                    </button>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Student Name</th>
                          <th className="p-3.5">Admission No</th>
                          <th className="p-3.5">Class & Section</th>
                          <th className="p-3.5 text-center">Working Days</th>
                          <th className="p-3.5 text-center text-emerald-700">Presents</th>
                          <th className="p-3.5 text-center text-red-600">Absents</th>
                          <th className="p-3.5 text-center text-amber-600">Late / Half</th>
                          <th className="p-3.5 text-right">Attendance Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {monthlyAttendanceList.map((m) => {
                          const pct = m.attendancePercentage || 0;
                          return (
                            <tr key={m.studentId} className="hover:bg-slate-50/80 transition">
                              <td className="p-3.5 font-extrabold text-slate-950 text-xs">{m.studentName}</td>
                              <td className="p-3.5 font-mono font-bold text-blue-700">{m.admissionNumber}</td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                                  {m.classGrade} - {m.section}
                                </span>
                              </td>
                              <td className="p-3.5 text-center font-mono text-slate-700 font-semibold">{m.totalRecordedDays}</td>
                              <td className="p-3.5 text-center font-mono text-emerald-700 font-bold">{m.presentCount}</td>
                              <td className="p-3.5 text-center font-mono text-red-600 font-bold">{m.absentCount}</td>
                              <td className="p-3.5 text-center font-mono text-amber-600 font-bold">{m.lateCount}</td>
                              <td className="p-3.5 text-right">
                                <span
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                                    pct >= 75
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : pct >= 60
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-red-50 text-red-700 border border-red-200"
                                  }`}
                                >
                                  {pct}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Daily Roll Call */}
            {attendanceSubTab === "daily" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-700 font-bold">Attendance Date:</span>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                  >
                    {loading ? "Saving..." : "Save Daily Roll Call"}
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Student</th>
                        <th className="p-3.5">Admission No</th>
                        <th className="p-3.5">Class / Section</th>
                        <th className="p-3.5">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {studentList.map((s) => {
                        const enrId = s.enrollments?.[0]?.id;
                        const status = attendanceStatusMap[enrId] || "PRESENT";
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 font-extrabold text-slate-950 text-xs">
                              {s.firstName} {s.lastName}
                            </td>
                            <td className="p-3.5 font-mono font-bold text-blue-700">{s.admissionNumber}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                                {s.enrollments?.[0]?.section?.classGrade?.name || "Class 6"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                {["PRESENT", "ABSENT", "LATE", "HALF_DAY"].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() =>
                                      setAttendanceStatusMap({ ...attendanceStatusMap, [enrId]: st })
                                    }
                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                                      status === st
                                        ? st === "PRESENT"
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : st === "ABSENT"
                                          ? "bg-red-600 text-white shadow-xs"
                                          : "bg-amber-500 text-white shadow-xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 4: FEES & BILLING */}
        {/* ======================================================================= */}
        {activeSection === "fees" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>💳</span> School Fees & Invoicing Ledger
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Manage fee structures, issue batch invoices, and record student fee payments.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setFeeSubTab("invoices")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    feeSubTab === "invoices"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  💳 Student Billing & Ledger ({invoices.length})
                </button>
                <button
                  onClick={() => setFeeSubTab("catalog")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    feeSubTab === "catalog"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  ⚙️ Fee Structures & Catalog ({feeStructures.length})
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Invoices */}
            {feeSubTab === "invoices" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-600 font-medium">
                    Showing all generated student fee vouchers and transaction ledgers.
                  </div>
                  {(isAdmin || isAccountant) && (
                    <button
                      onClick={() => setClassInvoiceGenModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                    >
                      <span>⚡</span> Generate Invoices for Class
                    </button>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Invoice #</th>
                          <th className="p-3.5">Student</th>
                          <th className="p-3.5">Total Amount</th>
                          <th className="p-3.5">Paid</th>
                          <th className="p-3.5">Balance</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions & Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {invoices.map((inv) => {
                          const stud = inv.enrollment?.student;
                          return (
                            <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-3.5 font-mono font-bold text-blue-700">{inv.invoiceNumber}</td>
                              <td className="p-3.5 font-extrabold text-slate-950 text-xs">
                                {stud ? `${stud.firstName} ${stud.lastName}` : "Student"}
                              </td>
                              <td className="p-3.5 font-mono font-extrabold text-slate-950">₹{inv.totalAmount}</td>
                              <td className="p-3.5 font-mono font-bold text-emerald-700">₹{inv.paidAmount}</td>
                              <td className="p-3.5 font-mono font-bold text-red-600">
                                ₹{inv.totalAmount - inv.paidAmount}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    inv.status === "PAID"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  {inv.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                  <button
                                    onClick={() => setViewInvoiceReceipt(inv)}
                                    title="Print Official Receipt"
                                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                  >
                                    🖨️
                                  </button>
                                  {inv.status !== "PAID" && (
                                    <button
                                      onClick={() => handleRecordPayment(inv.id, inv.totalAmount - inv.paidAmount)}
                                      title={`Collect ₹${inv.totalAmount - inv.paidAmount}`}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                                    >
                                      Collect ₹{inv.totalAmount - inv.paidAmount}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Structures Catalog */}
            {feeSubTab === "catalog" && (
              <div className="space-y-6">
                {(currentUser.role === "SCHOOL_ADMIN" || currentUser.role === "ACCOUNTANT") && (
                  <form onSubmit={handleCreateFeeStructure} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      + Configure New Fee Structure
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Fee Structure Title</label>
                        <input
                          type="text"
                          required
                          value={newFeeName}
                          onChange={(e) => setNewFeeName(e.target.value)}
                          placeholder="e.g. Standard Annual Tuition & Activity Fee"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Applicable Class</label>
                        <select
                          value={newFeeClassGrade}
                          onChange={(e) => setNewFeeClassGrade(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        >
                          {classesList.length > 0 ? (
                            classesList.map((c) => (
                              <option key={c.id || c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))
                          ) : (
                            <option value="Class 6">Class 6</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Billing Frequency</label>
                        <select
                          value={newFeeFrequency}
                          onChange={(e) => setNewFeeFrequency(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        >
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="ANNUAL">Annual</option>
                        </select>
                      </div>
                    </div>

                    {/* Breakdown Components */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-700 font-bold uppercase">
                          Itemized Breakdown Components
                        </span>
                        <button
                          type="button"
                          onClick={() => setFeeComponents([...feeComponents, { name: "Activity Fee", amount: "100" }])}
                          className="text-xs text-blue-700 hover:text-blue-800 font-bold"
                        >
                          + Add Component
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {feeComponents.map((comp, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={comp.name}
                              onChange={(e) => {
                                const copy = [...feeComponents];
                                copy[idx].name = e.target.value;
                                setFeeComponents(copy);
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                            />
                            <input
                              type="number"
                              value={comp.amount}
                              onChange={(e) => {
                                const copy = [...feeComponents];
                                copy[idx].amount = e.target.value;
                                setFeeComponents(copy);
                              }}
                              className="w-24 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-mono outline-none focus:border-blue-600"
                            />
                            <button
                              type="button"
                              onClick={() => setFeeComponents(feeComponents.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 text-xs px-2 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                    >
                      {loading ? "Creating..." : "Save Fee Structure"}
                    </button>
                  </form>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Structure Name</th>
                        <th className="p-3.5">Class Grade</th>
                        <th className="p-3.5">Frequency</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5 text-right">Batch Invoicing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {feeStructures.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3.5 font-extrabold text-slate-950 text-xs">{f.name}</td>
                          <td className="p-3.5 font-bold text-slate-700">{f.classGrade?.name || "Class 6"}</td>
                          <td className="p-3.5 font-mono text-blue-700 font-bold">{f.frequency || "QUARTERLY"}</td>
                          <td className="p-3.5 font-mono font-extrabold text-slate-950">₹{f.totalAmount}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleBatchIssueClassInvoices(f.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                            >
                              ⚡ Issue Invoices to Class
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 5: EXAMS & REPORT CARDS */}
        {/* ======================================================================= */}
        {activeSection === "exams" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>📊</span> Academic Examinations & CBSE Report Cards
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Schedule term exams, record Theory & Practical marks, and print official report cards.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setExamSubTab("report_cards")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    examSubTab === "report_cards"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  📜 Student Report Cards Directory
                </button>
                <button
                  onClick={() => setExamSubTab("marks")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    examSubTab === "marks"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  📝 Record Subject Marks & Schedule Exam
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Report cards list */}
            {examSubTab === "report_cards" && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Admission No</th>
                      <th className="p-3.5">Class & Section</th>
                      <th className="p-3.5 text-right">Generate Report Card</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {studentList.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-extrabold text-slate-950 text-xs">
                          {st.firstName} {st.lastName}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-blue-700">{st.admissionNumber}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                            {st.enrollments?.[0]?.section?.classGrade?.name || "Class 6"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleFetchReportCard(st.enrollments?.[0]?.id)}
                              title="Print Term Report Card"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                            >
                              🖨️
                            </button>
                            <button
                              onClick={() => handleFetchAggregateReportCard(st.enrollments?.[0]?.id)}
                              title="Print Cumulative Annual Card"
                              className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                            >
                              📊
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-tab 2: Record Marks & Schedule Exam */}
            {examSubTab === "marks" && (
              <div className="space-y-6">
                {/* Schedule Exam Term Form */}
                {currentUser.role === "SCHOOL_ADMIN" && (
                  <form onSubmit={handleCreateExam} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      + Schedule Examination Term
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Term Name</label>
                        <input
                          type="text"
                          required
                          value={newExamName}
                          onChange={(e) => setNewExamName(e.target.value)}
                          placeholder="e.g. Unit Test 1, Half-Yearly Exam, Annual Exam"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newExamStartDate}
                          onChange={(e) => setNewExamStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                        >
                          Create Term
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Batch 6-Subject Marks Entry Form with Live Percentage Calculator */}
                <form onSubmit={handleRecordBatchMarks} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                        <span>📝</span> Batch 6-Subject Academic Marks Entry
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Key in marks across all 6 core subjects with automatic real-time percentage and grade computation.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-600 font-medium">Authority Scope:</span>
                      <span className="font-mono px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        {teacherScope.canAccessAll ? "ALL SUBJECTS (ADMIN/HOD)" : teacherScope.isClassTeacher ? "CLASS TEACHER" : "SUBJECT TEACHER"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Examination Term *</label>
                      <select
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      >
                        {examsList.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Enrolled Student *</label>
                      <select
                        value={markStudentEnrollmentId}
                        onChange={(e) => setMarkStudentEnrollmentId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="">— Select Student —</option>
                        {studentList.map((st) => (
                          <option key={st.id} value={st.enrollments?.[0]?.id}>
                            {st.firstName} {st.lastName} (Adm #{st.admissionNumber} • {st.enrollments?.[0]?.section?.classGrade?.name || "Class 6"})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 6 Subjects Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Theory (Max 80)</th>
                          <th className="p-3">Practical / Internal (Max 20)</th>
                          <th className="p-3">Max Marks</th>
                          <th className="p-3">Subject Total</th>
                          <th className="p-3">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {batchMarks.map((bm, idx) => {
                          const th = parseFloat(bm.theoryMarks) || 0;
                          const pr = parseFloat(bm.practicalMarks) || 0;
                          const subTotal = th + pr;
                          const max = parseFloat(bm.maxMarks) || 100;
                          const subPct = max > 0 ? (subTotal / max) * 100 : 0;
                          const subGrade = subPct >= 90 ? "A+" : subPct >= 80 ? "A" : subPct >= 70 ? "B+" : subPct >= 60 ? "B" : subPct >= 50 ? "C" : "D";

                          return (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                              <td className="p-3 font-extrabold text-slate-950">{bm.subjectName}</td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  min={0}
                                  max={80}
                                  value={bm.theoryMarks}
                                  onChange={(e) => {
                                    const next = [...batchMarks];
                                    next[idx].theoryMarks = e.target.value;
                                    setBatchMarks(next);
                                  }}
                                  className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono outline-none focus:bg-white focus:border-blue-600"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={bm.practicalMarks}
                                  onChange={(e) => {
                                    const next = [...batchMarks];
                                    next[idx].practicalMarks = e.target.value;
                                    setBatchMarks(next);
                                  }}
                                  className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono outline-none focus:bg-white focus:border-blue-600"
                                />
                              </td>
                              <td className="p-3 font-mono text-slate-600">{bm.maxMarks}</td>
                              <td className="p-3 font-mono font-black text-blue-700 text-sm">
                                {subTotal}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded font-black font-mono text-xs bg-blue-50 text-blue-800 border border-blue-200">
                                  {subGrade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Live Dynamic Calculation Box */}
                  {(() => {
                    let totalObt = 0;
                    let totalMax = 0;
                    batchMarks.forEach((bm) => {
                      totalObt += (parseFloat(bm.theoryMarks) || 0) + (parseFloat(bm.practicalMarks) || 0);
                      totalMax += (parseFloat(bm.maxMarks) || 100);
                    });
                    const pct = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(2) : "0.00";
                    const numPct = parseFloat(pct);
                    const finalG = numPct >= 90 ? "A+" : numPct >= 80 ? "A" : numPct >= 70 ? "B+" : numPct >= 60 ? "B" : numPct >= 50 ? "C" : numPct >= 33 ? "D" : "F";
                    const status = numPct >= 33 ? "PASSED & PROMOTED" : "NEEDS IMPROVEMENT";

                    return (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-slate-900">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Grand Total Marks</span>
                            <span className="text-xl font-black text-slate-950 font-mono">
                              {totalObt} <span className="text-xs text-slate-500 font-normal">/ {totalMax}</span>
                            </span>
                          </div>
                          <div className="border-l border-slate-200 pl-6">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Overall Percentage</span>
                            <span className="text-2xl font-black text-blue-700 font-mono">{pct}%</span>
                          </div>
                          <div className="border-l border-slate-200 pl-6">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">CBSE Grade</span>
                            <span className="text-xl font-black text-amber-600 font-mono">{finalG}</span>
                          </div>
                          <div className="border-l border-slate-200 pl-6">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Scholastic Status</span>
                            <span className={`text-xs font-black px-2 py-0.5 rounded ${numPct >= 33 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                              {status}
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading || !markStudentEnrollmentId}
                          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-xs"
                        >
                          {loading ? "Recording..." : "Save All 6 Subject Marks →"}
                        </button>
                      </div>
                    );
                  })()}
                </form>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 6: SUBJECTS & TEACHERS */}
        {/* ======================================================================= */}
        {activeSection === "subjects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>📚</span> Class Curriculum Subjects & Faculty
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Assign specialized teachers to curriculum subjects for every class grade.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setSubjectSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    subjectSubTab === "list"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  📚 View Curriculum ({subjectsList.length})
                </button>
                <button
                  onClick={() => setSubjectSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    subjectSubTab === "create"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  ➕ Add New Subject
                </button>
              </div>
            </div>

            {/* Sub-tab 1: List with reassign */}
            {subjectSubTab === "list" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-700 font-bold">Select Class Grade:</span>
                  <select
                    value={subjectClassGrade}
                    onChange={(e) => {
                      setSubjectClassGrade(e.target.value);
                      fetchSubjects(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                  >
                    {classesList.length > 0 ? (
                      classesList.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      ["Pre-KG", "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Subject</th>
                        <th className="p-3.5">Board</th>
                        <th className="p-3.5">Assigned Subject Teacher</th>
                        {currentUser.role === "SCHOOL_ADMIN" && <th className="p-3.5 text-right">Faculty & Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {subjectsList.map((sub) => {
                        const teacher = sub.teacher;
                        const prof = teacher?.staffProfile;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 font-extrabold text-slate-950 text-xs">{sub.name}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold">
                                {sub.board || "CBSE"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {teacher ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                    {(prof?.fullName || teacher.email).charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-950 text-xs">{prof?.fullName || teacher.email}</p>
                                    <p className="text-[10px] text-blue-700 font-mono font-semibold">{prof?.department || teacher.phone || "Faculty"}</p>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-amber-600 font-medium italic text-[11px]">Unassigned</span>
                              )}
                            </td>
                            {currentUser.role === "SCHOOL_ADMIN" && (
                              <td className="p-3.5 text-right">
                                <div className="inline-flex items-center gap-2 justify-end">
                                  <select
                                    value={sub.teacherId || ""}
                                    onChange={(e) => handleAssignSubjectTeacher(sub.id, e.target.value)}
                                    className="px-2 py-1 rounded-lg bg-slate-50 text-xs text-slate-900 border border-slate-300 outline-none focus:border-blue-600"
                                  >
                                    <option value="">— Unassign —</option>
                                    {staffList
                                      .filter((s) => ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(s.role))
                                      .map((t) => (
                                        <option key={t.id} value={t.id}>
                                          {t.staffProfile?.fullName || t.email} ({t.role.replace("_", " ")})
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    onClick={() => setEditSubjectModal(sub)}
                                    title="Edit Subject"
                                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                    title="Delete Subject"
                                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold flex items-center justify-center text-sm shadow-xs transition"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Create Subject */}
            {subjectSubTab === "create" && currentUser.role === "SCHOOL_ADMIN" && (
              <form onSubmit={handleCreateSubject} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  + Add Subject to Curriculum
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Class Grade *</label>
                    <select
                      value={subjectClassGrade}
                      onChange={(e) => setSubjectClassGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      {classesList.length > 0 ? (
                        classesList.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        ["Pre-KG", "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject Name *</label>
                    <input
                      type="text"
                      required
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="e.g. Sanskrit, Moral Science"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Curriculum Board</label>
                    <select
                      value={newSubjectBoard}
                      onChange={(e) => setNewSubjectBoard(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="STATE_BOARD">State Board</option>
                      <option value="ICSE">ICSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assign Teacher</label>
                    <select
                      value={newSubjectTeacherId}
                      onChange={(e) => setNewSubjectTeacherId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="">— Select Teacher —</option>
                      {staffList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.staffProfile?.fullName || t.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  Save Subject to Curriculum
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 7: WEEKLY TIMETABLE */}
        {/* ======================================================================= */}
        {activeSection === "timetable" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>🗓️</span> Weekly Class Timetable Builder
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Six-day schedule (Monday to Saturday, Periods 1 to 7) with room allocations.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setTimetableSubTab("grid")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    timetableSubTab === "grid"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  🗓️ Schedule Matrix Grid
                </button>
                <button
                  onClick={() => setTimetableSubTab("edit")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    timetableSubTab === "edit"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  ✏️ Period Slot Configurator
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Grid */}
            {timetableSubTab === "grid" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-700 font-bold">Select Class Grade:</span>
                  <select
                    value={timetableClassGrade}
                    onChange={(e) => {
                      setTimetableClassGrade(e.target.value);
                      fetchTimetable(e.target.value);
                      fetchSubjects(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                  >
                    {classesList.length > 0 ? (
                      classesList.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="Class 6">Class 6</option>
                    )}
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[800px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-28 font-bold text-slate-900">Day</th>
                          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                            <th key={p} className="p-3 text-center border-l border-slate-200">
                              Period {p}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
                          <tr key={day} className="hover:bg-slate-50/80">
                            <td className="p-3 font-bold text-blue-900 bg-blue-50/50">{day}</td>
                            {[1, 2, 3, 4, 5, 6, 7].map((pNum) => {
                              const entry = timetableEntries.find(
                                (e) => e.dayOfWeek === day && e.periodNumber === pNum
                              );
                              return (
                                <td
                                  key={pNum}
                                  onClick={() => {
                                    const slotTeacher = staffList.find(
                                      (s) => s.id === entry?.teacherUserId || (entry?.teacherName && (s.staffProfile?.fullName === entry.teacherName || s.email?.startsWith(entry.teacherName)))
                                    );
                                    setEditSlotModal({
                                      dayOfWeek: day,
                                      periodNumber: pNum,
                                      startTime: entry?.startTime || "08:30 AM",
                                      endTime: entry?.endTime || "09:15 AM",
                                      subjectName: entry?.subjectName || (subjectsList[0]?.name || "Mathematics"),
                                      teacherName: entry?.teacherName || (slotTeacher?.staffProfile?.fullName || ""),
                                      teacherUserId: entry?.teacherUserId || slotTeacher?.id || "",
                                      roomNumber: entry?.roomNumber || "Room 101",
                                    });
                                    setTimetableSubTab("edit");
                                  }}
                                  className="p-2 border-l border-slate-200 cursor-pointer hover:bg-blue-50/40 transition"
                                >
                                  {entry ? (
                                    <div className="space-y-0.5 text-center">
                                      <p className="font-extrabold text-slate-950 text-[11px] truncate">{entry.subjectName}</p>
                                      <p className="text-[10px] text-blue-700 font-bold truncate">{entry.teacherName}</p>
                                      <span className="text-[9px] text-slate-500 font-mono block">
                                        {entry.roomNumber || entry.startTime}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-center text-slate-400 text-[10px] py-2 hover:text-blue-600 font-medium">+ Add Slot</div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Slot Form */}
            {timetableSubTab === "edit" && (
              <form onSubmit={handleSaveTimetableSlot} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 max-w-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Configure Period Slot for {timetableClassGrade}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Day of Week</label>
                    <select
                      value={editSlotModal?.dayOfWeek || "MONDAY"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), dayOfWeek: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Period Number</label>
                    <select
                      value={editSlotModal?.periodNumber || 1}
                      onChange={(e) =>
                        setEditSlotModal({ ...(editSlotModal || {}), periodNumber: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                        <option key={p} value={p}>
                          Period {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Curriculum Subject *</label>
                  <select
                    required
                    value={editSlotModal?.subjectName || ""}
                    onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), subjectName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">— Select Configured Subject —</option>
                    {subjectsList.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name} ({s.board || "CBSE"})
                      </option>
                    ))}
                    {/* Common core fallback options */}
                    {["Mathematics", "Science", "English", "Hindi", "Social Studies", "Computer Science", "Sports / Physical Ed", "Library", "Art & Craft", "Sanskrit"].map((s) => {
                      if (subjectsList.some((x) => x.name === s)) return null;
                      return <option key={s} value={s}>{s}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Teacher (Faculty) *</label>
                  <select
                    value={editSlotModal?.teacherUserId || ""}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const staffMember = staffList.find((s) => s.id === selId);
                      setEditSlotModal({
                        ...(editSlotModal || {}),
                        teacherUserId: selId,
                        teacherName: staffMember ? (staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "") : editSlotModal?.teacherName || "",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">— Select Teacher from Staff —</option>
                    {staffList
                      .filter((s) => ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(s.role))
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.staffProfile?.fullName || t.email} ({t.role.replace("_", " ")})
                        </option>
                      ))}
                  </select>
                  {editSlotModal?.teacherName && (
                    <p className="text-[10px] text-slate-600 mt-1 font-mono">
                      Faculty Name: <strong className="text-blue-700">{editSlotModal.teacherName}</strong>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="text"
                      value={editSlotModal?.startTime || "08:30 AM"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">End Time</label>
                    <input
                      type="text"
                      value={editSlotModal?.endTime || "09:15 AM"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  Save Period Slot
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 8: TRANSPORT */}
        {/* ======================================================================= */}
        {activeSection === "transport" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>🚌</span> School Transport & Bus Routes
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Manage school bus routes, drivers, timings, stops, and transport fee schedules.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setTransportSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    transportSubTab === "list"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  🚌 View Bus Routes ({busRoutesList.length})
                </button>
                <button
                  onClick={() => setTransportSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    transportSubTab === "create"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  ➕ Configure New Route
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Routes list */}
            {transportSubTab === "list" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {busRoutesList.map((route) => {
                  const stops = Array.isArray(route.stops) ? route.stops : [];
                  return (
                    <div
                      key={route.id}
                      className="p-5 rounded-2xl flex flex-col justify-between transition bg-white border border-slate-200 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-lg font-bold font-mono text-xs bg-blue-600 text-white shadow-xs">
                            {route.routeNumber}
                          </span>
                          <span className="font-mono text-xs text-slate-600">
                            Vehicle: <strong className="text-slate-950 font-bold">{route.vehicleNumber}</strong>
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-950">{route.routeName}</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Driver: <strong className="text-slate-950 font-bold">{route.driverName}</strong> (<span className="text-blue-700 font-mono font-bold">{route.driverPhone}</span>)
                          {route.conductorName && (
                            <> • Conductor: <strong className="text-slate-950 font-bold">{route.conductorName}</strong> {route.conductorPhone ? `(${route.conductorPhone})` : ""}</>
                          )}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-700 mt-2 font-mono font-medium">
                          <span>Pickup: <strong className="text-slate-900">{route.morningPickupTime}</strong></span>
                          <span>Drop: <strong className="text-slate-900">{route.eveningDropTime}</strong></span>
                          <span>Fee: <strong className="text-blue-700 font-bold">₹{route.monthlyFee}/mo</strong></span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                            Stops ({stops.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {stops.map((st: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                              >
                                {st.name} {st.time ? `(${st.time})` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {currentUser.role === "SCHOOL_ADMIN" && (
                        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                          <button
                            onClick={() => setEditRouteModal(route)}
                            title="Edit Bus Route"
                            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteBusRoute(route.id)}
                            title="Delete Bus Route"
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold flex items-center justify-center text-sm shadow-xs transition"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sub-tab 2: Create Route Form */}
            {transportSubTab === "create" && currentUser.role === "SCHOOL_ADMIN" && (
              <form onSubmit={handleCreateBusRoute} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  + Configure New Bus Route & Assign Driver / Conductor
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Route Number *</label>
                    <input
                      type="text"
                      required
                      value={newRouteNumber}
                      onChange={(e) => setNewRouteNumber(e.target.value)}
                      placeholder="e.g. R-03"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Route Name *</label>
                    <input
                      type="text"
                      required
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                      placeholder="e.g. Semliya - Hatod - Badgonda Express"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Reg Number</label>
                    <input
                      type="text"
                      value={newVehicleNumber}
                      onChange={(e) => setNewVehicleNumber(e.target.value)}
                      placeholder="MP-09-EF-9012"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Driver & Conductor Select from Staff */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  {/* Driver Section */}
                  <div className="space-y-2">
                    <label className="block text-[11px] text-blue-800 font-bold">
                      🚌 Select Driver from Staff
                    </label>
                    <select
                      value={newDriverUserId}
                      onChange={(e) => {
                        const selId = e.target.value;
                        setNewDriverUserId(selId);
                        const staffMember = staffList.find((s) => s.id === selId);
                        if (staffMember) {
                          setNewDriverName(staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "");
                          setNewDriverPhone(staffMember.phone || "");
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                    >
                      <option value="">— Select Registered Driver / Staff —</option>
                      {staffList.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-600 font-bold block mb-0.5">Driver Name *</label>
                        <input
                          type="text"
                          required
                          value={newDriverName}
                          onChange={(e) => setNewDriverName(e.target.value)}
                          placeholder="Driver Name"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 font-bold block mb-0.5">Driver Phone *</label>
                        <input
                          type="tel"
                          required
                          value={newDriverPhone}
                          onChange={(e) => setNewDriverPhone(e.target.value)}
                          placeholder="+91..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Conductor Section */}
                  <div className="space-y-2">
                    <label className="block text-[11px] text-amber-800 font-bold">
                      🎫 Select Conductor from Staff
                    </label>
                    <select
                      value={newConductorUserId}
                      onChange={(e) => {
                        const selId = e.target.value;
                        setNewConductorUserId(selId);
                        const staffMember = staffList.find((s) => s.id === selId);
                        if (staffMember) {
                          setNewConductorName(staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "");
                          setNewConductorPhone(staffMember.phone || "");
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                    >
                      <option value="">— Select Registered Conductor / Staff —</option>
                      {staffList.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-600 font-bold block mb-0.5">Conductor Name</label>
                        <input
                          type="text"
                          value={newConductorName}
                          onChange={(e) => setNewConductorName(e.target.value)}
                          placeholder="Conductor Name"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 font-bold block mb-0.5">Conductor Phone</label>
                        <input
                          type="tel"
                          value={newConductorPhone}
                          onChange={(e) => setNewConductorPhone(e.target.value)}
                          placeholder="+91..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pickup Time</label>
                    <input
                      type="text"
                      value={newPickupTime}
                      onChange={(e) => setNewPickupTime(e.target.value)}
                      placeholder="07:20 AM"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Drop Time</label>
                    <input
                      type="text"
                      value={newDropTime}
                      onChange={(e) => setNewDropTime(e.target.value)}
                      placeholder="02:35 PM"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Monthly Bus Fee (₹)</label>
                    <input
                      type="number"
                      value={newMonthlyFee}
                      onChange={(e) => setNewMonthlyFee(e.target.value)}
                      placeholder="500"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Stops & Times (comma-separated)</label>
                    <input
                      type="text"
                      value={newStopsInput}
                      onChange={(e) => setNewStopsInput(e.target.value)}
                      placeholder="Stop 1 (07:25 AM), Stop 2 (07:45 AM)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  Register Bus Route
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 9: NOTICES */}
        {/* ======================================================================= */}
        {activeSection === "notices" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>📢</span> Digital Notice Board & Circulars
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Broadcast notices for examinations, sports events, holidays, and urgent circulars.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setNoticeSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    noticeSubTab === "list"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  📢 Active Circulars ({noticesList.length})
                </button>
                <button
                  onClick={() => setNoticeSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    noticeSubTab === "create"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  ➕ Broadcast New Notice
                </button>
              </div>
            </div>

            {/* Sub-tab 1: List */}
            {noticeSubTab === "list" && (
              <div className="space-y-3">
                {noticesList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200 shadow-xs">
                    No active notices broadcasted yet.
                  </div>
                ) : (
                  noticesList.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {n.isPinned && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                              📌 PINNED
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              n.priority === "URGENT"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : n.priority === "HIGH"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {n.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {n.category}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono font-medium">
                            Audience: {n.targetAudience} • {new Date(n.publishedAt || n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-950">{n.title}</h4>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">{n.content}</p>
                      </div>

                      {currentUser.role === "SCHOOL_ADMIN" && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditNoticeModal(n)}
                            title="Edit Notice"
                            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs transition"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(n.id)}
                            title="Delete Notice"
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold flex items-center justify-center text-sm shadow-xs transition"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub-tab 2: Create Notice Form */}
            {noticeSubTab === "create" && (
              <form onSubmit={handleCreateNotice} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  + Publish New Announcement / Circular
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Notice Title *</label>
                    <input
                      type="text"
                      required
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="e.g. Dussehra & Diwali Autumn Break Schedule 2026"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="GENERAL">General Notice</option>
                      <option value="ACADEMIC">Academic / Curriculum</option>
                      <option value="EXAMINATION">Examination Schedule</option>
                      <option value="HOLIDAY">Holiday & Vacations</option>
                      <option value="SPORTS">Sports & Activities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Priority Level</label>
                    <select
                      value={newNoticePriority}
                      onChange={(e) => setNewNoticePriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High Priority</option>
                      <option value="URGENT">🚨 Urgent Alert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Notice Content *</label>
                  <textarea
                    rows={3}
                    required
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    placeholder="Details of instructions, timings, affected classes..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-bold">
                    <input
                      type="checkbox"
                      checked={newNoticeIsPinned}
                      onChange={(e) => setNewNoticeIsPinned(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 accent-blue-600"
                    />
                    <span>📌 Pin to top alert banner</span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                  >
                    Broadcast Notice
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 10: WEBSITE & FACILITIES */}
        {/* ======================================================================= */}
        {activeSection === "website" && currentUser.role === "SCHOOL_ADMIN" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <span>🌐</span> School Website, Facilities & Media
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Manage the public landing page, campus infrastructure, photo albums, and video highlights.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setWebsiteSubTab("facilities")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    websiteSubTab === "facilities"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  🏛️ World-Class Facilities ({(landingConfig.facilities || []).length})
                </button>
                <button
                  onClick={() => setWebsiteSubTab("media")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    websiteSubTab === "media"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-bold"
                  }`}
                >
                  📸 Campus Info & Media Gallery
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Facilities */}
            {websiteSubTab === "facilities" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Icon / Emoji</label>
                    <select
                      value={newFacilityIcon}
                      onChange={(e) => setNewFacilityIcon(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="🔬">🔬 Science Laboratory</option>
                      <option value="💻">💻 Smart AI Computer Lab</option>
                      <option value="📚">📚 Central Digital Library</option>
                      <option value="🏀">🏀 Sports & Athletics Arena</option>
                      <option value="🚌">🚌 Safe GPS Bus Fleet</option>
                      <option value="☀️">☀️ Green Solar Powered</option>
                      <option value="🎨">🎨 Fine Arts & Culture</option>
                      <option value="🩺">🩺 First-Aid Clinic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Facility Title</label>
                    <input
                      type="text"
                      value={newFacilityName}
                      onChange={(e) => setNewFacilityName(e.target.value)}
                      placeholder="e.g. Modern Physics Lab"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Detailed Description</label>
                    <input
                      type="text"
                      value={newFacilityDesc}
                      onChange={(e) => setNewFacilityDesc(e.target.value)}
                      placeholder="Equipped with hands-on experiment stations..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                    >
                      + Add Facility
                    </button>
                  </div>
                </div>

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(landingConfig.facilities || []).map((fac: any) => (
                    <div
                      key={fac.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-2xl mb-2">{fac.icon}</div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFacility(fac.id)}
                          className="text-red-500 hover:text-red-700 text-xs opacity-0 group-hover:opacity-100 transition p-1 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-950">{fac.name}</h4>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">{fac.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveLanding}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                  >
                    Save All Facilities to Public Portal
                  </button>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Campus Info & Media */}
            {websiteSubTab === "media" && (
              <div className="space-y-6">
                <form onSubmit={handleSaveLanding} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Campus Narrative & Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={landingConfig.tagline || ""}
                        onChange={(e) => setLandingConfig({ ...landingConfig, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Principal Name</label>
                      <input
                        type="text"
                        value={landingConfig.principalName || ""}
                        onChange={(e) => setLandingConfig({ ...landingConfig, principalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">About Narrative</label>
                    <textarea
                      rows={2}
                      value={landingConfig.aboutText || ""}
                      onChange={(e) => setLandingConfig({ ...landingConfig, aboutText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                  >
                    Save Information
                  </button>
                </form>

                {/* Photo Gallery & Video Gallery sections */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Photos of the Fun & Learning
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">Photo URL</label>
                        <label className="text-[10px] text-blue-600 hover:text-blue-700 cursor-pointer font-bold flex items-center gap-1">
                          <span>📁 Upload Desktop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setNewPhotoUrl(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="https://... or uploaded file"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Caption</label>
                      <input
                        type="text"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="Science Fair 2026"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                    >
                      + Add Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(landingConfig.galleryImages || []).map((img: any) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={img.url} alt="" className="w-full aspect-[4/3] object-cover" />
                        <div className="p-2 text-[10px] font-semibold text-slate-800 truncate">{img.caption}</div>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(img.id)}
                          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Video Showcase Embeds & Desktop Videos
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        placeholder="Cultural Fest 2026"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">Video File / URL</label>
                        <label className="text-[10px] text-blue-600 hover:text-blue-700 cursor-pointer font-bold flex items-center gap-1">
                          <span>📁 Upload Video</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setNewVideoUrl(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/... or uploaded file"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                    >
                      + Add Video
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(landingConfig.videoGallery || []).map((vid: any) => (
                      <div key={vid.id} className="rounded-xl overflow-hidden bg-white border border-slate-200 p-2 shadow-xs">
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100">
                          <iframe src={vid.videoUrl} title="" className="w-full h-full border-0"></iframe>
                        </div>
                        <div className="flex items-center justify-between pt-2 text-xs">
                          <span className="font-extrabold text-slate-950 truncate">{vid.title}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="text-red-600 hover:text-red-700 text-[11px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: Edit Student Particulars */}
      {/* ========================================================================= */}
      {editModalStudent && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditModalStudent(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl text-slate-900 overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm text-slate-950">
                Edit Student Record: {editModalStudent.admissionNumber}
              </h3>
              <button
                onClick={() => setEditModalStudent(null)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold transition"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.firstName}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.lastName}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    value={editModalStudent.parentPhone || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editModalStudent.fatherName || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Grade</label>
                  <select
                    value={editModalStudent.classGradeName || "Class 6"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, classGradeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  >
                    {classesList.length > 0 ? (
                      classesList.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="Class 6">Class 6</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={editModalStudent.sectionName || "A"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, sectionName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  >
                    {["A", "B", "C", "D"].map((s) => (
                      <option key={s} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Village & Address</label>
                <input
                  type="text"
                  value={editModalStudent.addressText || ""}
                  onChange={(e) => setEditModalStudent({ ...editModalStudent, addressText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalStudent(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Student Profile Dossier */}
      {/* ========================================================================= */}
      {profileModalStudent && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setProfileModalStudent(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl text-slate-900 overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-emerald-400 text-lg">
                  {profileModalStudent.avatarUrl ? (
                    <img src={profileModalStudent.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    `${profileModalStudent.firstName[0]}${profileModalStudent.lastName[0]}`
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-950">
                    {profileModalStudent.firstName} {profileModalStudent.lastName}
                  </h3>
                  <p className="text-xs font-mono text-emerald-400">{profileModalStudent.admissionNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const st = profileModalStudent;
                    setProfileModalStudent(null);
                    setViewIdCardStudent(st);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-xs font-bold inline-flex items-center gap-1 transition"
                >
                  🪪 Print ID Card
                </button>
                <button
                  onClick={() => setProfileModalStudent(null)}
                  className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Class & Section</span>
                <span className="font-semibold text-white">
                  {profileModalStudent.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} - Section{" "}
                  {profileModalStudent.enrollments?.[0]?.section?.name || "A"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Aadhar Number</span>
                <span className="font-semibold text-white font-mono">
                  {profileModalStudent.aadharNumber || "Not Provided"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Father's Name</span>
                <span className="font-semibold text-white">{profileModalStudent.fatherName || "—"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Mother's Name</span>
                <span className="font-semibold text-white">{profileModalStudent.motherName || "—"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Parent Contact</span>
                <span className="font-semibold text-white font-mono">
                  {profileModalStudent.parentPhone || profileModalStudent.user?.phone || "—"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Category</span>
                <span className="font-semibold text-white">
                  {profileModalStudent.category || "GENERAL"} ({profileModalStudent.bloodGroup || "O+"})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Village & Address</span>
              <p className="text-white mt-1">
                {profileModalStudent.villageCity ? `${profileModalStudent.villageCity}, ` : ""}
                {profileModalStudent.addressText || "Campus Area"}
                {profileModalStudent.pincode ? ` - ${profileModalStudent.pincode}` : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Staff Dossier */}
      {/* ========================================================================= */}
      {profileModalStaff && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setProfileModalStaff(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl text-slate-900 overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-emerald-400 text-lg">
                  {profileModalStaff.staffProfile?.avatarUrl ? (
                    <img src={profileModalStaff.staffProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (profileModalStaff.staffProfile?.fullName || profileModalStaff.email || "S").charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-950">
                    {profileModalStaff.staffProfile?.fullName || profileModalStaff.email?.split("@")[0]}
                  </h3>
                  <p className="text-xs text-emerald-400">
                    {profileModalStaff.staffProfile?.designation || profileModalStaff.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const st = profileModalStaff;
                    setProfileModalStaff(null);
                    handleOpenAssignModal(st);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 text-xs font-bold inline-flex items-center gap-1 transition"
                >
                  🎯 Workload & Role
                </button>
                <button
                  onClick={() => setProfileModalStaff(null)}
                  className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Department</span>
                <span className="font-semibold text-white">
                  {profileModalStaff.staffProfile?.department || "General"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Qualification</span>
                <span className="font-semibold text-white">
                  {profileModalStaff.staffProfile?.qualification || "Faculty Degree"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Email & Phone</span>
                <span className="font-semibold text-white font-mono block">{profileModalStaff.email}</span>
                <span className="text-slate-400 font-mono">{profileModalStaff.phone || "—"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Aadhar & Experience</span>
                <span className="font-semibold text-white font-mono block">
                  {profileModalStaff.staffProfile?.aadharNumber || "—"}
                </span>
                <span className="text-slate-400">
                  {profileModalStaff.staffProfile?.experienceYears || 0} Years Experience
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-400">Escalate / Switch Role:</span>
              <div className="flex gap-1.5">
                {["TEACHER", "ACCOUNTANT", "SCHOOL_ADMIN"].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      handleUpdateRole(profileModalStaff.id, r);
                      setProfileModalStaff(null);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                      profileModalStaff.role === r
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Official CBSE Report Card (Printable) */}
      {/* ========================================================================= */}
      {viewReportCard && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewReportCard(null)}
        >
          <div
            className="max-w-3xl w-full bg-white text-slate-900 border border-slate-300 rounded-3xl p-8 space-y-6 shadow-2xl my-8 print:p-0 print:border-none print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  CBSE Assessment Certification Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print / Save as PDF
                </button>
                <button
                  onClick={() => setViewReportCard(null)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="text-center border-b-2 border-slate-900 pb-4">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-2xl shadow">
                  ग
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                    {viewReportCard.school?.name || slug}
                  </h2>
                  <p className="text-[11px] text-slate-600 font-semibold tracking-wider uppercase">
                    Affiliated to CBSE / State Education Board • Udise No: 23120901234
                  </p>
                </div>
              </div>
              <div className="mt-2 inline-block px-4 py-1 rounded-full bg-blue-600 text-white font-bold text-xs tracking-widest uppercase shadow-xs">
                Official Student Academic Performance Report
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Academic Session: {viewReportCard.student?.academicYear || "2026-2027"}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Student Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{viewReportCard.student?.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Admission No / Roll</span>
                <span className="font-mono font-bold text-emerald-700">
                  {viewReportCard.student?.admissionNumber} / Roll {viewReportCard.student?.rollNumber || 1}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Class & Section</span>
                <span className="font-bold text-slate-800">
                  {viewReportCard.student?.classGrade} - {viewReportCard.student?.section}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Date of Birth</span>
                <span className="font-mono text-slate-800">{viewReportCard.student?.dob || "—"}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Father's Name</span>
                <span className="font-semibold text-slate-800">{viewReportCard.student?.fatherName}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Mother's Name</span>
                <span className="font-semibold text-slate-800">{viewReportCard.student?.motherName}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Aggregate Score</span>
                <span className="font-black text-emerald-700 text-sm">
                  {viewReportCard.summary?.grandTotalObtained || viewReportCard.summary?.totalMarksObtained} / {viewReportCard.summary?.grandTotalMax || viewReportCard.summary?.totalMaxMarks} (
                  {viewReportCard.summary?.cumulativePercentage || viewReportCard.summary?.overallPercentage})
                </span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Final Grade</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-xs inline-block">
                  {viewReportCard.summary?.overallGrade || viewReportCard.summary?.finalGrade || "A+"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  {reportCardMode === "CUMULATIVE" || viewReportCard.subjectsSummary
                    ? "Part 1: Multi-Term Cumulative Academic Matrix (UT-1, Quarterly, Half-Yearly & Annual)"
                    : "Part 1: Scholastic Academic Performance"}
                </h4>
                {viewReportCard.student?.enrollmentId && (
                  <div className="flex gap-1 print:hidden">
                    <button
                      onClick={() => handleFetchReportCard(viewReportCard.student.enrollmentId)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                        reportCardMode === "SINGLE"
                          ? "bg-blue-600 text-white shadow-xs font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Single Term View
                    </button>
                    <button
                      onClick={() => handleFetchAggregateReportCard(viewReportCard.student.enrollmentId)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                        reportCardMode === "CUMULATIVE"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Cumulative 4-Term View
                    </button>
                  </div>
                )}
              </div>

              {reportCardMode === "CUMULATIVE" || viewReportCard.subjectsSummary ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-300">
                      <tr>
                        <th className="p-2.5 font-bold">Subject</th>
                        <th className="p-2.5 text-center font-bold">UT-1 (25)</th>
                        <th className="p-2.5 text-center font-bold">Quarterly (50)</th>
                        <th className="p-2.5 text-center font-bold">Half-Yearly (100)</th>
                        <th className="p-2.5 text-center font-bold">Annual (100)</th>
                        <th className="p-2.5 text-center font-bold bg-slate-200 text-slate-900">Total (275)</th>
                        <th className="p-2.5 text-center font-bold">Percentage</th>
                        <th className="p-2.5 text-center font-bold">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(viewReportCard.subjectsSummary || []).map((sub: any, i: number) => {
                        const ut1 = sub.terms?.["Unit Test 1 (UT-1)"]?.marksObtained ?? "—";
                        const quarterly = sub.terms?.["Quarterly Exam"]?.marksObtained ?? "—";
                        const halfYearly = sub.terms?.["Half-Yearly Exam"]?.marksObtained ?? "—";
                        const annual = sub.terms?.["Annual Examination"]?.marksObtained ?? "—";
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">{sub.subject}</td>
                            <td className="p-2.5 text-center font-mono text-slate-700">{ut1}</td>
                            <td className="p-2.5 text-center font-mono text-slate-700">{quarterly}</td>
                            <td className="p-2.5 text-center font-mono text-slate-700">{halfYearly}</td>
                            <td className="p-2.5 text-center font-mono text-slate-700">{annual}</td>
                            <td className="p-2.5 text-center font-mono font-bold bg-slate-50 text-slate-900">
                              {sub.totalObtained} / {sub.totalMax}
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-emerald-700">
                              {sub.percentage}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                                {sub.finalGrade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <tr>
                        <td className="p-2.5 text-slate-900 uppercase">Grand Cumulative Total</td>
                        <td colSpan={4} className="p-2.5 text-right font-mono text-slate-600">
                          Consolidated Terms Sum:
                        </td>
                        <td className="p-2.5 text-center font-mono font-black text-slate-900 bg-slate-200">
                          {viewReportCard.summary?.grandTotalObtained} / {viewReportCard.summary?.grandTotalMax}
                        </td>
                        <td className="p-2.5 text-center font-mono font-black text-emerald-700">
                          {viewReportCard.summary?.cumulativePercentage}
                        </td>
                        <td className="p-2.5 text-center font-black text-emerald-800">
                          {viewReportCard.summary?.overallGrade}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 text-center">Theory (80)</th>
                      <th className="p-2.5 text-center">Practical (20)</th>
                      <th className="p-2.5 text-center">Total (100)</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {viewReportCard.subjects?.map((sub: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{sub.subject}</td>
                        <td className="p-2.5 text-center font-mono text-slate-700">{sub.theoryMarks}</td>
                        <td className="p-2.5 text-center font-mono text-slate-700">{sub.practicalMarks}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-900">{sub.marksObtained}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-800">
                            {sub.grade}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600 italic text-[11px]">{sub.remarks || "Satisfactory"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-black text-[11px] uppercase tracking-wider text-slate-800">
                  Part 2: Co-Scholastic Traits
                </h5>
                <div className="space-y-1">
                  {(viewReportCard.coScholastic || []).map((cs: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-700">{cs.area}</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {cs.grade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-black text-[11px] uppercase tracking-wider text-slate-800">
                  Part 3: Attendance & Result
                </h5>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Total Working Days</span>
                    <strong className="text-slate-900 font-mono">
                      {viewReportCard.attendance?.totalWorkingDays || 110} Days
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Days Present</span>
                    <strong className="text-emerald-700 font-mono">
                      {viewReportCard.attendance?.presentDays || 104} Days
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Attendance Rate</span>
                    <strong className="text-emerald-700 font-bold">
                      {viewReportCard.attendance?.percentage || "94.5%"} (Meets CBSE 75% Rule)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Promotion Status</span>
                    <span className="font-black text-emerald-700">
                      {viewReportCard.summary?.status || "PASSED & PROMOTED"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Class Teacher Remarks:</span>
              <p className="font-medium text-slate-800 italic mt-0.5">
                "{viewReportCard.summary?.teacherRemarks || "Consistent scholar with keen aptitude for holistic learning."}"
              </p>
            </div>

            <div className="pt-6 grid grid-cols-3 text-center text-xs text-slate-700 border-t border-slate-200">
              <div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 mx-6 pt-1 font-bold">Class Teacher</div>
              </div>
              <div>
                <div className="h-10 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border border-dashed border-slate-400 flex items-center justify-center text-[9px] text-slate-400 uppercase font-mono">
                    SEAL
                  </div>
                </div>
                <div className="border-t border-slate-400 mx-6 pt-1 font-bold">Exam Incharge</div>
              </div>
              <div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 mx-6 pt-1 font-bold">Principal / Headmaster</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Admin Password Override */}
      {/* ========================================================================= */}
      {resetModalUser && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setResetModalUser(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-extrabold text-sm text-slate-950">
              Reset Password for {resetModalUser.email || resetModalUser.phone}
            </h3>
            <form onSubmit={handleAdminResetPassword} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Enter new password (min 6 chars)"
                value={overridePassword}
                onChange={(e) => setOverridePassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-white outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Set New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Class */}
      {/* ========================================================================= */}
      {editClassModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditClassModal(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                <span>🏛️</span> Edit Academic Class / Grade
              </h3>
              <button
                onClick={() => setEditClassModal(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateClass} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Class / Grade Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pre-KG, Nursery, LKG, UKG, Class 1..."
                  value={editClassModal.name || ""}
                  onChange={(e) => setEditClassModal({ ...editClassModal, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Numerical Order (0 for Pre-KG, 1 for Class 1, etc.)
                </label>
                <input
                  type="number"
                  required
                  value={editClassModal.numericalOrder || 1}
                  onChange={(e) => setEditClassModal({ ...editClassModal, numericalOrder: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditClassModal(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Notice */}
      {/* ========================================================================= */}
      {editNoticeModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditNoticeModal(null)}
        >
          <div
            className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                <span>📢</span> Edit Notice Circular
              </h3>
              <button
                onClick={() => setEditNoticeModal(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateNotice} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  required
                  value={editNoticeModal.title || ""}
                  onChange={(e) => setEditNoticeModal({ ...editNoticeModal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Category</label>
                  <select
                    value={editNoticeModal.category || "GENERAL"}
                    onChange={(e) => setEditNoticeModal({ ...editNoticeModal, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAMINATION">Exam</option>
                    <option value="EVENT">Event</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Priority</label>
                  <select
                    value={editNoticeModal.priority || "NORMAL"}
                    onChange={(e) => setEditNoticeModal({ ...editNoticeModal, priority: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Audience</label>
                  <select
                    value={editNoticeModal.targetAudience || "ALL"}
                    onChange={(e) => setEditNoticeModal({ ...editNoticeModal, targetAudience: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  >
                    <option value="ALL">All (Public)</option>
                    <option value="STUDENTS">Students & Parents</option>
                    <option value="FACULTY">Faculty & Staff</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Circular Content & Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={editNoticeModal.content || ""}
                  onChange={(e) => setEditNoticeModal({ ...editNoticeModal, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editNoticePin"
                  checked={Boolean(editNoticeModal.isPinned)}
                  onChange={(e) => setEditNoticeModal({ ...editNoticeModal, isPinned: e.target.checked })}
                  className="rounded border-slate-300 accent-blue-600"
                />
                <label htmlFor="editNoticePin" className="text-xs text-slate-300">
                  Pin to top of school notice board
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditNoticeModal(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Updating..." : "Save Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Bus Route */}
      {/* ========================================================================= */}
      {editRouteModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditRouteModal(null)}
        >
          <div
            className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl text-slate-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                <span>🚌</span> Edit Bus Route Details
              </h3>
              <button
                onClick={() => setEditRouteModal(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateRoute} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Route Number</label>
                  <input
                    type="text"
                    required
                    value={editRouteModal.routeNumber || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, routeNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Vehicle Plate No</label>
                  <input
                    type="text"
                    required
                    value={editRouteModal.vehicleNumber || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Route Corridor / Name</label>
                <input
                  type="text"
                  required
                  value={editRouteModal.routeName || ""}
                  onChange={(e) => setEditRouteModal({ ...editRouteModal, routeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              {/* Driver & Conductor selection */}
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                {/* Driver */}
                <div className="space-y-2">
                  <label className="block text-[11px] text-orange-400 font-bold">
                    🚌 Driver Selection from Staff
                  </label>
                  <select
                    value={editRouteModal.driverUserId || ""}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const staffMember = staffList.find((s: any) => s.id === selId);
                      setEditRouteModal({
                        ...editRouteModal,
                        driverUserId: selId || null,
                        driverName: staffMember ? (staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "") : editRouteModal.driverName,
                        driverPhone: staffMember ? (staffMember.phone || "") : editRouteModal.driverPhone,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  >
                    <option value="">— Select Registered Driver / Staff (or Enter Below) —</option>
                    {staffList.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Driver Name *</label>
                      <input
                        type="text"
                        required
                        value={editRouteModal.driverName || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, driverName: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Driver Phone *</label>
                      <input
                        type="text"
                        required
                        value={editRouteModal.driverPhone || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, driverPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Conductor */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <label className="block text-[11px] text-amber-400 font-bold">
                    🎫 Conductor Selection from Staff
                  </label>
                  <select
                    value={editRouteModal.conductorUserId || ""}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const staffMember = staffList.find((s: any) => s.id === selId);
                      setEditRouteModal({
                        ...editRouteModal,
                        conductorUserId: selId || null,
                        conductorName: staffMember ? (staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "") : editRouteModal.conductorName,
                        conductorPhone: staffMember ? (staffMember.phone || "") : editRouteModal.conductorPhone,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  >
                    <option value="">— Select Registered Conductor / Staff (or Enter Below) —</option>
                    {staffList.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Conductor Name</label>
                      <input
                        type="text"
                        value={editRouteModal.conductorName || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, conductorName: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Conductor Phone</label>
                      <input
                        type="tel"
                        value={editRouteModal.conductorPhone || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, conductorPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={editRouteModal.morningPickupTime || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, morningPickupTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Drop Time</label>
                  <input
                    type="text"
                    value={editRouteModal.eveningDropTime || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, eveningDropTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={editRouteModal.monthlyFee || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, monthlyFee: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditRouteModal(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Updating..." : "Save Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Subject */}
      {/* ========================================================================= */}
      {editSubjectModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditSubjectModal(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                <span>📚</span> Edit Academic Subject
              </h3>
              <button
                onClick={() => setEditSubjectModal(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateSubject} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Subject Title
                </label>
                <input
                  type="text"
                  required
                  value={editSubjectModal.name || ""}
                  onChange={(e) => setEditSubjectModal({ ...editSubjectModal, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Curriculum / Board
                </label>
                <select
                  value={editSubjectModal.board || "CBSE"}
                  onChange={(e) => setEditSubjectModal({ ...editSubjectModal, board: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                >
                  <option value="CBSE">CBSE (Central Board)</option>
                  <option value="ICSE">ICSE / CISCE</option>
                  <option value="STATE_BOARD">State Secondary Education Board</option>
                  <option value="VOCATIONAL">Vocational & Computer Studies</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Assigned Faculty / Subject Teacher
                </label>
                <select
                  value={editSubjectModal.teacherId || ""}
                  onChange={(e) => setEditSubjectModal({ ...editSubjectModal, teacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                >
                  <option value="">— Unassigned Teacher —</option>
                  {staffList
                    .filter((t: any) =>
                      ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(t.role)
                    )
                    .map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.staffProfile?.fullName || t.fullName || t.email} ({t.role || t.designation})
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditSubjectModal(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Updating..." : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Student Identity Card (Printable) */}
      {/* ========================================================================= */}
      {viewIdCardStudent && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewIdCardStudent(null)}
        >
          <div
            className="max-w-md w-full bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 space-y-4 shadow-2xl my-8 print:p-0 print:border-none print:shadow-none print:m-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Student Identity Card
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print / Save PDF
                </button>
                <button
                  onClick={() => setViewIdCardStudent(null)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* The Printable Student ID Card Badge */}
            <div className="border-2 border-emerald-600 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-emerald-50 to-white text-slate-900">
              {/* Card Header */}
              <div className="bg-emerald-600 text-white p-3 text-center relative">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="h-7 w-7 rounded-lg bg-white text-emerald-700 font-black flex items-center justify-center text-sm shadow">
                    ग
                  </div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    {currentUser?.schoolName || slug}
                  </h3>
                </div>
                <p className="text-[9px] text-emerald-100 tracking-wider uppercase font-semibold">
                  Affiliated to CBSE / State Board • Session 2026-27
                </p>
                <div className="text-[10px] font-bold bg-emerald-700 text-white py-0.5 mt-1 rounded uppercase tracking-widest">
                  Student Identity Card / छात्र पहचान पत्र
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 rounded-xl bg-slate-100 border-2 border-emerald-500 overflow-hidden flex items-center justify-center shrink-0 shadow">
                    {viewIdCardStudent.avatarUrl ? (
                      <img src={viewIdCardStudent.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-emerald-600">
                        {viewIdCardStudent.firstName?.[0]}{viewIdCardStudent.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-base text-slate-900 leading-tight">
                      {viewIdCardStudent.firstName} {viewIdCardStudent.lastName}
                    </h4>
                    <p className="text-[11px] font-bold text-emerald-700">
                      Class: {viewIdCardStudent.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} - Sec {viewIdCardStudent.enrollments?.[0]?.section?.name || "A"}
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono">
                      Roll No: <span className="font-bold text-slate-900">{viewIdCardStudent.enrollments?.[0]?.rollNumber || "01"}</span>
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono">
                      Adm No: <span className="font-bold text-slate-900">{viewIdCardStudent.admissionNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-200 pt-2 text-slate-700">
                  <div>
                    <span className="text-slate-500 block">Father's Name:</span>
                    <span className="font-bold text-slate-900">{viewIdCardStudent.fatherName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth:</span>
                    <span className="font-bold text-slate-900">
                      {viewIdCardStudent.dob ? new Date(viewIdCardStudent.dob).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Blood Group:</span>
                    <span className="font-bold text-slate-900">{viewIdCardStudent.bloodGroup || "O+"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Emergency Mobile:</span>
                    <span className="font-bold text-slate-900 font-mono">{viewIdCardStudent.parentPhone || viewIdCardStudent.emergencyContact || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Village / Address:</span>
                    <span className="font-semibold text-slate-900 truncate block">
                      {viewIdCardStudent.villageCity || viewIdCardStudent.addressText || "Campus Residential"}
                    </span>
                  </div>
                </div>

                {/* Card Footer Barcode & Signature */}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-mono text-[9px] tracking-widest text-slate-600">
                      ||| | |||| | ||| |||| || |
                    </div>
                    <div className="font-mono text-[8px] text-slate-500 font-bold">
                      {viewIdCardStudent.admissionNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-serif italic text-emerald-800 font-bold border-b border-slate-400 pb-0.5">
                      Principal
                    </div>
                    <div className="text-[8px] uppercase tracking-wider text-slate-500">
                      Authorized Sign
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Fee Invoice & Official Payment Receipt (Printable) */}
      {/* ========================================================================= */}
      {viewInvoiceReceipt && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewInvoiceReceipt(null)}
        >
          <div
            className="max-w-2xl w-full bg-white text-slate-900 border border-slate-300 rounded-3xl p-8 space-y-6 shadow-2xl my-8 print:p-0 print:border-none print:shadow-none print:m-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Official School Fee Receipt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print / Save as PDF
                </button>
                <button
                  onClick={() => setViewInvoiceReceipt(null)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Receipt Voucher */}
            <div className="border border-slate-300 rounded-2xl p-6 space-y-5 bg-white text-slate-900 shadow-sm print:border-none print:p-0">
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xl shadow">
                    ग
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-black uppercase text-slate-900">
                      {currentUser?.schoolName || slug}
                    </h2>
                    <p className="text-[10px] text-slate-600 font-semibold tracking-wider uppercase">
                      Gramin Shiksha Mission • CBSE / State Board Affiliation
                    </p>
                  </div>
                </div>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-xs">
                  Official Fee Receipt / शुल्क पावती
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Receipt / Invoice #</span>
                  <span className="font-mono font-bold text-slate-900">{viewInvoiceReceipt.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-mono text-slate-900">{new Date(viewInvoiceReceipt.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Academic Session</span>
                  <span className="font-bold text-slate-900">2026-2027</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${viewInvoiceReceipt.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {viewInvoiceReceipt.status}
                  </span>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">Student Name:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {viewInvoiceReceipt.enrollment?.student ? `${viewInvoiceReceipt.enrollment.student.firstName} ${viewInvoiceReceipt.enrollment.student.lastName}` : "Student"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Admission Number:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {viewInvoiceReceipt.enrollment?.student?.admissionNumber || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Class & Section:</span>
                  <span className="font-bold text-slate-900">
                    {viewInvoiceReceipt.enrollment?.section?.classGrade?.name || "Class"} - {viewInvoiceReceipt.enrollment?.section?.name || "A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Father / Guardian:</span>
                  <span className="font-medium text-slate-800">{viewInvoiceReceipt.enrollment?.student?.fatherName || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Contact Mobile:</span>
                  <span className="font-mono text-slate-800">{viewInvoiceReceipt.enrollment?.student?.parentPhone || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Fee Head:</span>
                  <span className="font-medium text-slate-800">{viewInvoiceReceipt.feeStructure?.name || "Term Composite Fee"}</span>
                </div>
              </div>

              {/* Financial Ledger Table */}
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 font-bold">Particulars / Head</th>
                    <th className="p-2.5 text-right font-bold">Billed Amount</th>
                    <th className="p-2.5 text-right font-bold">Paid Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">
                      {viewInvoiceReceipt.feeStructure?.name || "School Composite Fee"}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{viewInvoiceReceipt.totalAmount}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-700">₹{viewInvoiceReceipt.paidAmount}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold">
                  <tr>
                    <td className="p-2.5 text-slate-800">Total Balance Outstanding:</td>
                    <td colSpan={2} className="p-2.5 text-right font-mono text-amber-700 text-sm">
                      ₹{viewInvoiceReceipt.totalAmount - viewInvoiceReceipt.paidAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Signature Block */}
              <div className="flex items-end justify-between pt-6 border-t border-slate-200">
                <div className="text-[10px] text-slate-500">
                  <p>• Computer-generated digital receipt. Valid without physical seal.</p>
                  <p>• Please retain this receipt for annual audit & tax records.</p>
                </div>
                <div className="text-center">
                  <div className="text-xs font-serif italic text-slate-800 font-bold border-b border-slate-400 pb-0.5 px-4">
                    Authorized Cashier / Bursar
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">
                    Accounts Office Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Teacher Profile, Role & Workload Assignment */}
      {/* ========================================================================= */}
      {assignModalStaff && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setAssignModalStaff(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl text-slate-900 p-6 space-y-4 shadow-2xl my-8 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>🎯</span> Assign Role & Faculty Workload
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure administrative authority, class teacher section, subject specialization, or transport driver routes.
                </p>
              </div>
              <button
                onClick={() => setAssignModalStaff(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-lg shrink-0 overflow-hidden">
                {assignModalStaff.staffProfile?.avatarUrl ? (
                  <img src={assignModalStaff.staffProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  (assignModalStaff.staffProfile?.fullName || assignModalStaff.email || "S").charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-slate-950">
                  {assignModalStaff.staffProfile?.fullName || assignModalStaff.email?.split("@")[0]}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {assignModalStaff.staffProfile?.qualification || "Faculty"} • {assignModalStaff.staffProfile?.designation || assignModalStaff.role}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  {assignModalStaff.email} {assignModalStaff.phone ? `• ${assignModalStaff.phone}` : ""}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStaffAssignments} className="space-y-4 text-xs">
              {/* 1. Role Selection */}
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Primary Role & Authority *
                </label>
                <select
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="PRINCIPAL">👑 Principal / Headmaster (Full Administrative Command)</option>
                  <option value="ADMIN">🛡️ School Admin / Co-Admin</option>
                  <option value="CLASS_TEACHER">🏛️ Class Teacher (Heads Class & Section)</option>
                  <option value="SUBJECT_TEACHER">📚 Subject Teacher (Curriculum & Subject Marks)</option>
                  <option value="TEACHER">👨‍🏫 General Teacher</option>
                  <option value="ACCOUNTANT">💳 Accountant / Bursar (Fees & Billing)</option>
                  <option value="DRIVER">🚌 Bus Driver / Transport</option>
                </select>
              </div>

              {/* 2. Class Teacher Assignment */}
              {(assignRole === "CLASS_TEACHER" || assignRole === "TEACHER" || assignRole === "ADMIN" || assignRole === "PRINCIPAL") && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🏛️</span> Assign as Class Teacher for Section:
                    </label>
                    <span className="text-[10px] text-slate-500">Marks daily attendance & class reports</span>
                  </div>
                  <select
                    value={assignSectionId}
                    onChange={(e) => setAssignSectionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none focus:border-amber-500"
                  >
                    <option value="">— None / Not Heading a Class —</option>
                    {classesList.flatMap((cls: any) =>
                      (cls.sections || []).map((sec: any) => (
                        <option key={sec.id} value={sec.id}>
                          {cls.name} - Section {sec.name} {sec.classTeacherId === assignModalStaff.id ? "(Currently Assigned)" : ""}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {/* 3. Subject Teacher Assignment */}
              {(assignRole === "SUBJECT_TEACHER" || assignRole === "CLASS_TEACHER" || assignRole === "TEACHER" || assignRole === "ADMIN" || assignRole === "PRINCIPAL") && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                      <span>📚</span> Assign Curriculum Subjects to Teach:
                    </label>
                    <span className="text-[10px] text-slate-500">Selected: {assignSubjectIds.length} subjects</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-white border border-slate-200">
                    {subjectsList.length === 0 ? (
                      <p className="text-[11px] text-slate-500 text-center py-2">
                        No subjects created yet. Add subjects in "Subjects & Teachers" tab.
                      </p>
                    ) : (
                      subjectsList.map((sub: any) => {
                        const checked = assignSubjectIds.includes(sub.id);
                        return (
                          <label
                            key={sub.id}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                              checked ? "bg-sky-950/70 border border-sky-800/80 text-white" : "hover:bg-slate-800/50 text-slate-300"
                            }`}
                          >
                            <span className="font-semibold text-xs">
                              {sub.name} <span className="text-[10px] text-slate-400 font-normal">({sub.classGrade?.name || subjectClassGrade})</span>
                            </span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                if (checked) {
                                  setAssignSubjectIds(assignSubjectIds.filter((id) => id !== sub.id));
                                } else {
                                  setAssignSubjectIds([...assignSubjectIds, sub.id]);
                                }
                              }}
                              className="accent-sky-500 h-4 w-4"
                            />
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* 4. Bus Driver Route Assignment */}
              {(assignRole === "DRIVER" || assignRole === "ADMIN" || assignRole === "PRINCIPAL") && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-orange-300 flex items-center gap-1.5">
                      <span>🚌</span> Assign Bus Transport Route (Driver):
                    </label>
                    <span className="text-[10px] text-slate-500">Route & vehicle assignment</span>
                  </div>
                  <select
                    value={assignBusRouteId}
                    onChange={(e) => setAssignBusRouteId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none focus:border-orange-500"
                  >
                    <option value="">— None / No Route Assigned —</option>
                    {busRoutesList.map((r: any) => (
                      <option key={r.id} value={r.id}>
                        {r.routeNumber}: {r.routeName} ({r.vehicleNumber}) {r.driverUserId === assignModalStaff.id ? "(Currently Assigned)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAssignModalStaff(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Saving Workload..." : "Save Role & Assignments"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Generate Class Invoices */}
      {/* ========================================================================= */}
      {classInvoiceGenModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setClassInvoiceGenModal(false)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl text-slate-900 p-6 space-y-4 shadow-2xl my-8 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>⚡</span> Generate Class Invoices
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Batch issue fee vouchers for all enrolled students in a class grade.
                </p>
              </div>
              <button
                onClick={() => setClassInvoiceGenModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Target Academic Class Grade</label>
                <select
                  value={classInvoiceGenClass}
                  onChange={(e) => setClassInvoiceGenClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                >
                  <option value="">— Select Academic Class Grade —</option>
                  {classesList.length > 0 ? (
                    classesList.map((c: any) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={`Class ${g}`}>Class {g}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Applicable Fee Structure *</label>
                <select
                  value={classInvoiceGenStructureId}
                  onChange={(e) => setClassInvoiceGenStructureId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-white outline-none"
                >
                  <option value="">— Select Fee Structure —</option>
                  {feeStructures.map((f: any) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (₹{f.amount} - {f.frequency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setClassInvoiceGenModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGenerateClassInvoices}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Generating..." : "⚡ Issue Invoices"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: Bulk Import Students via Excel */}
      {/* ========================================================================= */}
      {studentImportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setStudentImportModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl text-slate-900 p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-950 flex items-center gap-2">
                  <span>📥</span> Bulk Import Students from Excel / CSV
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload your school's student roster spreadsheet. Download our sample template for standard columns.
                </p>
              </div>
              <button
                onClick={() => setStudentImportModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Template Download & File Upload Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-1">
                    Step 1: Download Standard Format
                  </span>
                  <p className="text-xs text-slate-300">
                    Get the pre-formatted Excel template with sample student records, admission numbers, and grade columns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadStudentTemplate}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950 transition"
                >
                  <span>⬇️</span> Download Student_Template.xlsx
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block mb-1">
                    Step 2: Choose Excel / CSV File
                  </span>
                  <p className="text-xs text-slate-300">
                    Supports <span className="font-mono text-emerald-300">.xlsx</span>, <span className="font-mono text-emerald-300">.xls</span>, and <span className="font-mono text-emerald-300">.csv</span>.
                  </p>
                </div>
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-950 transition">
                  <span>📂</span> {studentImportFileName ? `Selected: ${studentImportFileName}` : "Browse & Upload Spreadsheet"}
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleStudentExcelUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Results Alert if any */}
            {studentImportResult && (
              <div
                className={`p-4 rounded-2xl border text-xs ${
                  studentImportResult.skippedCount > 0
                    ? "bg-amber-50 border-amber-300 text-amber-800 font-bold"
                    : "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">
                    {studentImportResult.message}
                  </span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                    +{studentImportResult.importedCount} Imported
                  </span>
                </div>
                {studentImportResult.errors?.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    <span className="font-bold text-[11px] block text-amber-400">Skipped Rows:</span>
                    {studentImportResult.errors.map((err: any, i: number) => (
                      <div key={i} className="text-[11px] text-amber-300">
                        • Row {err.row} ({err.admissionNumber || err.name || "Unknown"}): {err.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Parsed Rows Preview */}
            {studentImportRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span>🔍</span> Spreadsheet Live Data Preview ({studentImportRows.length} rows detected)
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                      ✓ {studentImportRows.filter((r) => r.isValid).length} Valid
                    </span>
                    {studentImportRows.some((r) => !r.isValid) && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold font-mono">
                        ✕ {studentImportRows.filter((r) => !r.isValid).length} Invalid
                      </span>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 w-12 font-mono">#</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Admission No</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">Class & Section</th>
                        <th className="p-2.5">Roll No</th>
                        <th className="p-2.5">Parent Mobile</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {studentImportRows.map((r) => (
                        <tr
                          key={r.rowNum}
                          className={r.isValid ? "hover:bg-slate-50" : "bg-red-50 hover:bg-red-100/60"}
                        >
                          <td className="p-2.5 text-slate-500">{r.rowNum}</td>
                          <td className="p-2.5">
                            {r.isValid ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                READY
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                                ERROR
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-white font-bold">{r.admissionNumber || "—"}</td>
                          <td className="p-2.5 text-slate-200">
                            {r.firstName} {r.lastName}
                          </td>
                          <td className="p-2.5 text-slate-300">
                            {r.classGradeName} - {r.sectionName}
                          </td>
                          <td className="p-2.5 text-slate-400">{r.rollNumber || "—"}</td>
                          <td className="p-2.5 text-slate-400">{r.parentPhone || "—"}</td>
                          <td className="p-2.5 text-[11px] text-amber-400">{r.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-[11px] text-slate-400">
                Default portal login password for students is <code className="text-emerald-400">student123</code>.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudentImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={studentImportLoading || studentImportRows.filter((r) => r.isValid).length === 0}
                  onClick={handleExecuteStudentImport}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 transition flex items-center gap-2"
                >
                  {studentImportLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Importing...</span>
                    </>
                  ) : (
                    <span>
                      ⚡ Confirm & Import ({studentImportRows.filter((r) => r.isValid).length} Students)
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Bulk Import Staff & Faculty via Excel */}
      {/* ========================================================================= */}
      {staffImportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setStaffImportModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl text-slate-900 p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-950 flex items-center gap-2">
                  <span>📥</span> Bulk Import Faculty & Staff from Excel / CSV
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Onboard teachers, principals, drivers, and accounts staff in batch with automatic credentials generation.
                </p>
              </div>
              <button
                onClick={() => setStaffImportModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Template Download & File Upload Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block mb-1">
                    Step 1: Download Staff Format
                  </span>
                  <p className="text-xs text-slate-300">
                    Get pre-formatted template with faculty roles, qualifications, and mobile columns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadStaffTemplate}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-950 transition"
                >
                  <span>⬇️</span> Download Staff_Template.xlsx
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block mb-1">
                    Step 2: Choose Excel / CSV File
                  </span>
                  <p className="text-xs text-slate-300">
                    Supports <span className="font-mono text-amber-300">.xlsx</span>, <span className="font-mono text-amber-300">.xls</span>, and <span className="font-mono text-amber-300">.csv</span>.
                  </p>
                </div>
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-950 transition">
                  <span>📂</span> {staffImportFileName ? `Selected: ${staffImportFileName}` : "Browse & Upload Spreadsheet"}
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleStaffExcelUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Results Alert if any */}
            {staffImportResult && (
              <div
                className={`p-4 rounded-2xl border text-xs ${
                  staffImportResult.skippedCount > 0
                    ? "bg-amber-50 border-amber-300 text-amber-800 font-bold"
                    : "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">
                    {staffImportResult.message}
                  </span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                    +{staffImportResult.importedCount} Imported
                  </span>
                </div>
                {staffImportResult.errors?.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    <span className="font-bold text-[11px] block text-amber-400">Skipped Rows:</span>
                    {staffImportResult.errors.map((err: any, i: number) => (
                      <div key={i} className="text-[11px] text-amber-300">
                        • Row {err.row} ({err.email || err.name || "Unknown"}): {err.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Parsed Rows Preview */}
            {staffImportRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span>🔍</span> Staff Spreadsheet Live Preview ({staffImportRows.length} rows detected)
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                      ✓ {staffImportRows.filter((r) => r.isValid).length} Valid
                    </span>
                    {staffImportRows.some((r) => !r.isValid) && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold font-mono">
                        ✕ {staffImportRows.filter((r) => !r.isValid).length} Invalid
                      </span>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 w-12 font-mono">#</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Full Name</th>
                        <th className="p-2.5">Role</th>
                        <th className="p-2.5">Designation</th>
                        <th className="p-2.5">Email / Login</th>
                        <th className="p-2.5">Phone</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {staffImportRows.map((r) => (
                        <tr
                          key={r.rowNum}
                          className={r.isValid ? "hover:bg-slate-50" : "bg-red-50 hover:bg-red-100/60"}
                        >
                          <td className="p-2.5 text-slate-500">{r.rowNum}</td>
                          <td className="p-2.5">
                            {r.isValid ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                READY
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                                ERROR
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-white font-bold">{r.fullName}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              {r.role}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-300">{r.designation || "—"}</td>
                          <td className="p-2.5 text-slate-400">{r.email || "(auto-generate)"}</td>
                          <td className="p-2.5 text-slate-400">{r.phone || "—"}</td>
                          <td className="p-2.5 text-[11px] text-amber-400">{r.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-[11px] text-slate-400">
                Default portal login password for faculty is <code className="text-amber-400">Staff@123</code>.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStaffImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={staffImportLoading || staffImportRows.filter((r) => r.isValid).length === 0}
                  onClick={handleExecuteStaffImport}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-amber-950 transition flex items-center gap-2"
                >
                  {staffImportLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Importing...</span>
                    </>
                  ) : (
                    <span>
                      ⚡ Confirm & Import ({staffImportRows.filter((r) => r.isValid).length} Staff Members)
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
