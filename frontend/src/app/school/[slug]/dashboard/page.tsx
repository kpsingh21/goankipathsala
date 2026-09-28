"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE } from "@/lib/config";


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

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("gkp_token") : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("gkp_user");
    if (!token || !storedUser) {
      router.push(`/school/${slug}/login`);
      return;
    }
    const user = JSON.parse(storedUser);
    setCurrentUser(user);
    if (user.role === "SCHOOL_ADMIN") {
      setActiveSection("students");
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
      setMsg({ type: "success", text: "Faculty member registered successfully!" });
      setNewStaffFullName("");
      setNewStaffEmail("");
      setNewStaffPhone("");
      setNewStaffPassword("");
      setNewStaffAadhar("");
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
    <div className="min-h-screen bg-slate-950 text-white flex font-sans">
      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-screen sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-lg shadow-emerald-950/50">
            ग
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-sm text-white truncate">
              {currentUser.schoolName || slug}
            </h1>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-semibold">
              {currentUser.role}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
          <button
            onClick={() => setActiveSection("students")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "students"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🎓</span>
              <span>Student SIS</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeSection === "students" ? "bg-slate-950 text-emerald-300" : "bg-slate-800 text-slate-400"
              }`}
            >
              {studentList.length}
            </span>
          </button>

          {currentUser.role === "SCHOOL_ADMIN" && (
            <button
              onClick={() => setActiveSection("staff")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
                activeSection === "staff"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>👥</span>
                <span>Staff & Faculty</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  activeSection === "staff" ? "bg-slate-950 text-emerald-300" : "bg-slate-800 text-slate-400"
                }`}
              >
                {staffList.length}
              </span>
            </button>
          )}

          {currentUser.role === "SCHOOL_ADMIN" && (
            <button
              onClick={() => setActiveSection("classes")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
                activeSection === "classes"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>🏛️</span>
                <span>Academic Classes</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  activeSection === "classes" ? "bg-slate-950 text-emerald-300" : "bg-slate-800 text-slate-400"
                }`}
              >
                {classesList.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveSection("attendance")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "attendance"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📋</span>
              <span>Attendance Engine</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("fees")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "fees"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>💳</span>
              <span>Fees & Invoices</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeSection === "fees" ? "bg-slate-950 text-emerald-300" : "bg-slate-800 text-slate-400"
              }`}
            >
              {feeStructures.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection("exams")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "exams"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📊</span>
              <span>Exams & Report Cards</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("subjects")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "subjects"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📚</span>
              <span>Subjects & Teachers</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("timetable")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "timetable"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🗓️</span>
              <span>Weekly Timetable</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("transport")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "transport"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🚌</span>
              <span>Bus Routes</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeSection === "transport" ? "bg-slate-950 text-emerald-300" : "bg-slate-800 text-slate-400"
              }`}
            >
              {busRoutesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection("notices")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeSection === "notices"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📢</span>
              <span>Notice Board</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeSection === "notices" ? "bg-slate-950 text-emerald-300" : "bg-slate-800 text-slate-400"
              }`}
            >
              {noticesList.length}
            </span>
          </button>

          {currentUser.role === "SCHOOL_ADMIN" && (
            <button
              onClick={() => setActiveSection("website")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
                activeSection === "website"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
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
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href={`/school/${slug}`}
            target="_blank"
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <span>🌐</span> School Campus ↗
          </Link>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 truncate max-w-[120px] font-mono">
              {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 p-8 space-y-6 overflow-y-auto">
        {/* Global Feedback Banner */}
        {msg && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              msg.type === "success"
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                : "bg-red-950/60 border-red-800 text-red-300"
            }`}
          >
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 1: STUDENT SIS */}
        {/* ======================================================================= */}
        {activeSection === "students" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>🎓</span> Student Information System (SIS)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage student profiles, enrollments, parents, village records, and academic status.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setStudentSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    studentSubTab === "list"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📋 View Students Directory ({studentList.length})
                </button>
                <button
                  onClick={() => setStudentSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    studentSubTab === "create"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ➕ Enroll New Student
                </button>
              </div>
            </div>

            {/* Sub-tab 1: List with filters */}
            {studentSubTab === "list" && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                      🔍 Search Name, Admission, Mobile
                    </label>
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="e.g. Aarav, ADM-2026..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Class Grade</label>
                    <select
                      value={studentFilterClass}
                      onChange={(e) => setStudentFilterClass(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="ALL">All Classes</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={`Class ${g}`}>
                          Class {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Section</label>
                    <select
                      value={studentFilterSection}
                      onChange={(e) => setStudentFilterSection(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Category</label>
                    <select
                      value={studentFilterCategory}
                      onChange={(e) => setStudentFilterCategory(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Student</th>
                          <th className="p-3.5">Admission No</th>
                          <th className="p-3.5">Class & Section</th>
                          <th className="p-3.5">Parents / Contact</th>
                          <th className="p-3.5">Village / Address</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-800/30 transition">
                            <td className="p-3.5 flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
                                {s.avatarUrl ? (
                                  <img src={s.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  `${s.firstName[0]}${s.lastName[0]}`
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-white text-xs">
                                  {s.firstName} {s.lastName}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {s.gender} • {s.category || "GENERAL"}
                                </p>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-emerald-400">{s.admissionNumber}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium">
                                {s.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} -{" "}
                                {s.enrollments?.[0]?.section?.name || "A"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <p className="text-slate-200">{s.fatherName || "—"}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{s.parentPhone || "—"}</p>
                            </td>
                            <td className="p-3.5">
                              <p className="text-slate-200">{s.villageCity || "—"}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {s.addressText || "Campus Area"}
                              </p>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => setProfileModalStudent(s)}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold"
                              >
                                Dossier
                              </button>
                              <button
                                onClick={() =>
                                  setEditModalStudent({
                                    ...s,
                                    classGradeName: s.enrollments?.[0]?.section?.classGrade?.name || "Class 6",
                                    sectionName: s.enrollments?.[0]?.section?.name || "A",
                                  })
                                }
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-semibold"
                              >
                                Edit
                              </button>
                              {currentUser.role === "SCHOOL_ADMIN" && (
                                <button
                                  onClick={() => handleDeleteStudent(s.id, `${s.firstName} ${s.lastName}`)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-950/70 hover:text-red-400 text-slate-400 text-[11px] font-semibold"
                                >
                                  Delete
                                </button>
                              )}
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
              <form onSubmit={handleRegisterStudent} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Comprehensive Student Enrollment Dossier
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Admission Number *</label>
                    <input
                      type="text"
                      required
                      value={admissionNo}
                      onChange={(e) => setAdmissionNo(e.target.value)}
                      placeholder="ADM-2026-003"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Rohan"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Verma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Photo / Avatar URL</label>
                    <input
                      type="url"
                      value={studentAvatarUrl}
                      onChange={(e) => setStudentAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Class Grade *</label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={`Class ${g}`}>
                          Class {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Section *</label>
                    <select
                      value={sectionName}
                      onChange={(e) => setSectionName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      {["A", "B", "C", "D"].map((s) => (
                        <option key={s} value={s}>
                          Section {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Aadhar Number (12 Digits)</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value)}
                      placeholder="4521 7890 1234"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="GENERAL">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                    <label className="block text-[11px] text-slate-400 mb-1">Father's Name</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Kailash Verma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Maya Verma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Parent Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+91 98260 11223"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Guardian Occupation</label>
                    <input
                      type="text"
                      value={guardianOccupation}
                      onChange={(e) => setGuardianOccupation(e.target.value)}
                      placeholder="Agriculture / Business"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Village / Town / City</label>
                    <input
                      type="text"
                      value={villageCity}
                      onChange={(e) => setVillageCity(e.target.value)}
                      placeholder="Goradiya Village"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Postal Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="451001"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={addressText}
                      onChange={(e) => setAddressText(e.target.value)}
                      placeholder="Ward No. 4, Near Panchayat Bhavan"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
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
        {activeSection === "staff" && currentUser.role === "SCHOOL_ADMIN" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>👥</span> School Staff & Faculty Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Onboard teachers, accountants, and administrators with comprehensive employee credentials.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setStaffSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    staffSubTab === "list"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  👥 Staff Directory ({staffList.length})
                </button>
                <button
                  onClick={() => setStaffSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    staffSubTab === "create"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ➕ Register New Staff
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Staff list with filters */}
            {staffSubTab === "list" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                      🔍 Search Name, Email, Mobile
                    </label>
                    <input
                      type="text"
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      placeholder="e.g. Suresh or @school.edu..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Filter by Role</label>
                    <select
                      value={staffFilterRole}
                      onChange={(e) => setStaffFilterRole(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="ALL">All Roles ({staffList.length})</option>
                      <option value="SCHOOL_ADMIN">School Admin</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ACCOUNTANT">Accountant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Filter by Department</label>
                    <select
                      value={staffFilterDept}
                      onChange={(e) => setStaffFilterDept(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Science">Science & Maths</option>
                      <option value="Humanities">Humanities & Social</option>
                      <option value="Languages">Languages & Literature</option>
                      <option value="Administration">Administration & Accounts</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Staff Member</th>
                          <th className="p-3.5">Designation & Dept</th>
                          <th className="p-3.5">Contact Details</th>
                          <th className="p-3.5">Aadhar / ID</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredStaff.map((m) => {
                          const prof = m.staffProfile || {};
                          return (
                            <tr key={m.id} className="hover:bg-slate-800/30 transition">
                              <td className="p-3.5 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-emerald-400 text-xs">
                                  {prof.avatarUrl ? (
                                    <img src={prof.avatarUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    (prof.fullName || m.email || "S").charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-xs">
                                    {prof.fullName || m.email?.split("@")[0] || "Staff Member"}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{prof.qualification || "Faculty"}</p>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <p className="text-slate-200 font-medium">{prof.designation || m.role}</p>
                                <p className="text-[10px] text-slate-400">{prof.department || "General"}</p>
                              </td>
                              <td className="p-3.5 font-mono text-[11px] text-slate-300">
                                <div>{m.email}</div>
                                <div className="text-slate-500">{m.phone || "—"}</div>
                              </td>
                              <td className="p-3.5 font-mono text-slate-400">
                                {prof.aadharNumber ? `•••• ${prof.aadharNumber.slice(-4)}` : "—"}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    m.role === "SCHOOL_ADMIN"
                                      ? "bg-purple-950 text-purple-400 border border-purple-800"
                                      : m.role === "TEACHER"
                                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                      : "bg-blue-950 text-blue-400 border border-blue-800"
                                  }`}
                                >
                                  {m.role}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => setProfileModalStaff(m)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                                >
                                  Dossier
                                </button>
                                {m.id !== currentUser.id && (
                                  <>
                                    <button
                                      onClick={() => setResetModalUser(m)}
                                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 text-[11px] text-slate-300"
                                    >
                                      Reset Pass
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStaff(m.id, prof.fullName || m.email)}
                                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-950/70 hover:text-red-400 text-slate-400 text-[11px]"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
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
              <form onSubmit={handleCreateStaff} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Register New Faculty / Staff Member
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStaffFullName}
                      onChange={(e) => setNewStaffFullName(e.target.value)}
                      placeholder="Suresh Kumar Verma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="suresh@school.edu"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Initial Password *</label>
                    <input
                      type="password"
                      required
                      value={newStaffPassword}
                      onChange={(e) => setNewStaffPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Role Authority *</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="TEACHER">Teacher</option>
                      <option value="SCHOOL_ADMIN">Co-School Admin</option>
                      <option value="ACCOUNTANT">Accountant / Cashier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Designation</label>
                    <input
                      type="text"
                      value={newStaffDesignation}
                      onChange={(e) => setNewStaffDesignation(e.target.value)}
                      placeholder="Senior Mathematics Teacher"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={newStaffQualification}
                      onChange={(e) => setNewStaffQualification(e.target.value)}
                      placeholder="B.Ed, M.Sc Mathematics"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Department</label>
                    <input
                      type="text"
                      value={newStaffDepartment}
                      onChange={(e) => setNewStaffDepartment(e.target.value)}
                      placeholder="Science & Maths"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
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
        {activeSection === "classes" && currentUser.role === "SCHOOL_ADMIN" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>🏛️</span> Academic Classes & Kindergarten Hierarchy
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage class grades from Pre-KG, Nursery, LKG, UKG to Class 12, assign sections, and configure curriculum.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setClassSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    classSubTab === "list"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🏛️ Classes & Sections ({classesList.length})
                </button>
                <button
                  onClick={() => setClassSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    classSubTab === "create"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ➕ Add New Class Grade
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Classes list */}
            {classSubTab === "list" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Class / Grade Name</th>
                        <th className="p-3.5">Order</th>
                        <th className="p-3.5">Sections</th>
                        <th className="p-3.5">Enrolled Students</th>
                        <th className="p-3.5">Curriculum Subjects</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {classesList.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3.5 font-bold text-white text-sm">{c.name}</td>
                          <td className="p-3.5 font-mono text-slate-400">{c.numericalOrder}</td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {(c.sections || []).map((sec: any) => (
                                <span
                                  key={sec.id}
                                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-emerald-400 border border-slate-700"
                                >
                                  {sec.name} ({sec.studentCount} studs)
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5 font-bold font-mono text-white">{c.studentCount}</td>
                          <td className="p-3.5 text-slate-300">
                            {c.subjectsCount > 0 ? (
                              <span className="text-xs">{c.subjects.join(", ")}</span>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">No subjects mapped yet</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => setEditClassModal(c)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClass(c.id, c.name)}
                              className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 font-semibold text-[11px] transition"
                            >
                              Delete
                            </button>
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
              <form onSubmit={handleCreateClass} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Add New Class / Academic Level
                </h3>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Class Grade Name *</label>
                  <input
                    type="text"
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g. Pre-KG, Nursery, Playgroup, Class 11 Science"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Pre-KG, Nursery, LKG, UKG, and Classes 1 to 12 can be configured.</p>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Numerical Sequence Order</label>
                  <input
                    type="number"
                    value={newClassOrder}
                    onChange={(e) => setNewClassOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Negative or low numbers for pre-primary (-3 for Pre-KG, -2 for Nursery, etc.)</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>📋</span> Student Attendance System
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track month-wise aggregate attendance rates and conduct morning roll call.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => {
                    setAttendanceSubTab("monthly");
                    fetchMonthlyAttendance(monthlyAttendanceMonth);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    attendanceSubTab === "monthly"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📅 Monthly Register & Matrix
                </button>
                <button
                  onClick={() => setAttendanceSubTab("daily")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    attendanceSubTab === "daily"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ☀️ Daily Roll Call Entry
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Monthly Register */}
            {attendanceSubTab === "monthly" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-bold">Select Month:</span>
                    <input
                      type="month"
                      value={monthlyAttendanceMonth}
                      onChange={(e) => {
                        setMonthlyAttendanceMonth(e.target.value);
                        fetchMonthlyAttendance(e.target.value);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono"
                    />
                  </div>

                  {currentUser.role === "SCHOOL_ADMIN" && (
                    <button
                      onClick={handleSeedMonthlyAttendance}
                      disabled={seedMonthlyLoading}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                    >
                      {seedMonthlyLoading ? "Generating..." : "⚡ Generate Realistic Month Attendance"}
                    </button>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Student Name</th>
                          <th className="p-3.5">Admission No</th>
                          <th className="p-3.5">Class & Section</th>
                          <th className="p-3.5 text-center">Working Days</th>
                          <th className="p-3.5 text-center text-emerald-400">Presents</th>
                          <th className="p-3.5 text-center text-red-400">Absents</th>
                          <th className="p-3.5 text-center text-amber-400">Late / Half</th>
                          <th className="p-3.5 text-right">Attendance Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {monthlyAttendanceList.map((m) => {
                          const pct = m.attendancePercentage || 0;
                          return (
                            <tr key={m.studentId} className="hover:bg-slate-800/30 transition">
                              <td className="p-3.5 font-bold text-white">{m.studentName}</td>
                              <td className="p-3.5 font-mono text-slate-400">{m.admissionNumber}</td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                                  {m.classGrade} - {m.section}
                                </span>
                              </td>
                              <td className="p-3.5 text-center font-mono text-slate-300">{m.totalRecordedDays}</td>
                              <td className="p-3.5 text-center font-mono text-emerald-400 font-bold">{m.presentCount}</td>
                              <td className="p-3.5 text-center font-mono text-red-400">{m.absentCount}</td>
                              <td className="p-3.5 text-center font-mono text-amber-400">{m.lateCount}</td>
                              <td className="p-3.5 text-right">
                                <span
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                                    pct >= 75
                                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                      : pct >= 60
                                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                                      : "bg-red-950 text-red-400 border border-red-800"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-bold">Attendance Date:</span>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    disabled={loading}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
                  >
                    {loading ? "Saving..." : "Save Daily Roll Call"}
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Student</th>
                        <th className="p-3.5">Admission No</th>
                        <th className="p-3.5">Class / Section</th>
                        <th className="p-3.5">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {studentList.map((s) => {
                        const enrId = s.enrollments?.[0]?.id;
                        const status = attendanceStatusMap[enrId] || "PRESENT";
                        return (
                          <tr key={s.id} className="hover:bg-slate-800/30 transition">
                            <td className="p-3.5 font-semibold text-white">
                              {s.firstName} {s.lastName}
                            </td>
                            <td className="p-3.5 font-mono text-slate-400">{s.admissionNumber}</td>
                            <td className="p-3.5">{s.enrollments?.[0]?.section?.classGrade?.name || "Class 6"}</td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                {["PRESENT", "ABSENT", "LATE", "HALF_DAY"].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() =>
                                      setAttendanceStatusMap({ ...attendanceStatusMap, [enrId]: st })
                                    }
                                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                                      status === st
                                        ? st === "PRESENT"
                                          ? "bg-emerald-500 text-slate-950"
                                          : st === "ABSENT"
                                          ? "bg-red-500 text-white"
                                          : "bg-amber-500 text-slate-950"
                                        : "bg-slate-800 text-slate-400 hover:text-white"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>💳</span> School Fees & Invoicing Ledger
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage fee structures, issue batch invoices, and record student fee payments.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setFeeSubTab("invoices")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    feeSubTab === "invoices"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  💳 Student Billing & Ledger ({invoices.length})
                </button>
                <button
                  onClick={() => setFeeSubTab("catalog")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    feeSubTab === "catalog"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ⚙️ Fee Structures & Catalog ({feeStructures.length})
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Invoices */}
            {feeSubTab === "invoices" && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Invoice #</th>
                        <th className="p-3.5">Student</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5">Paid</th>
                        <th className="p-3.5">Balance</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Collect Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {invoices.map((inv) => {
                        const stud = inv.enrollment?.student;
                        return (
                          <tr key={inv.id} className="hover:bg-slate-800/30 transition">
                            <td className="p-3.5 font-mono text-slate-400">{inv.invoiceNumber}</td>
                            <td className="p-3.5 font-semibold text-white">
                              {stud ? `${stud.firstName} ${stud.lastName}` : "Student"}
                            </td>
                            <td className="p-3.5 font-mono font-bold text-white">₹{inv.totalAmount}</td>
                            <td className="p-3.5 font-mono text-emerald-400">₹{inv.paidAmount}</td>
                            <td className="p-3.5 font-mono text-amber-400 font-bold">
                              ₹{inv.totalAmount - inv.paidAmount}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  inv.status === "PAID"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                    : "bg-amber-950 text-amber-400 border border-amber-800"
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              {inv.status !== "PAID" && (
                                <button
                                  onClick={() => handleRecordPayment(inv.id, inv.totalAmount - inv.paidAmount)}
                                  className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition"
                                >
                                  Collect ₹{inv.totalAmount - inv.paidAmount}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Structures Catalog */}
            {feeSubTab === "catalog" && (
              <div className="space-y-6">
                {(currentUser.role === "SCHOOL_ADMIN" || currentUser.role === "ACCOUNTANT") && (
                  <form onSubmit={handleCreateFeeStructure} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      + Configure New Fee Structure
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">Fee Structure Title</label>
                        <input
                          type="text"
                          required
                          value={newFeeName}
                          onChange={(e) => setNewFeeName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Applicable Class</label>
                        <select
                          value={newFeeClassGrade}
                          onChange={(e) => setNewFeeClassGrade(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                            <option key={g} value={`Class ${g}`}>
                              Class {g}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Billing Frequency</label>
                        <select
                          value={newFeeFrequency}
                          onChange={(e) => setNewFeeFrequency(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                        >
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="ANNUAL">Annual</option>
                        </select>
                      </div>
                    </div>

                    {/* Breakdown Components */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-300 font-bold uppercase">
                          Itemized Breakdown Components
                        </span>
                        <button
                          type="button"
                          onClick={() => setFeeComponents([...feeComponents, { name: "Activity Fee", amount: "100" }])}
                          className="text-xs text-emerald-400 font-bold"
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
                              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                            />
                            <input
                              type="number"
                              value={comp.amount}
                              onChange={(e) => {
                                const copy = [...feeComponents];
                                copy[idx].amount = e.target.value;
                                setFeeComponents(copy);
                              }}
                              className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setFeeComponents(feeComponents.filter((_, i) => i !== idx))}
                              className="text-red-400 text-xs px-2"
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
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
                    >
                      {loading ? "Creating..." : "Save Fee Structure"}
                    </button>
                  </form>
                )}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Structure Name</th>
                        <th className="p-3.5">Class Grade</th>
                        <th className="p-3.5">Frequency</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5 text-right">Batch Invoicing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {feeStructures.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3.5 font-bold text-white">{f.name}</td>
                          <td className="p-3.5">{f.classGrade?.name || "Class 6"}</td>
                          <td className="p-3.5 font-mono text-emerald-400">{f.frequency || "QUARTERLY"}</td>
                          <td className="p-3.5 font-mono font-bold text-white">₹{f.totalAmount}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleBatchIssueClassInvoices(f.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>📊</span> Academic Examinations & CBSE Report Cards
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Schedule term exams, record Theory & Practical marks, and print official report cards.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setExamSubTab("report_cards")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    examSubTab === "report_cards"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📜 Student Report Cards Directory
                </button>
                <button
                  onClick={() => setExamSubTab("marks")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    examSubTab === "marks"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📝 Record Subject Marks & Schedule Exam
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Report cards list */}
            {examSubTab === "report_cards" && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Admission No</th>
                      <th className="p-3.5">Class & Section</th>
                      <th className="p-3.5 text-right">Generate Report Card</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {studentList.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-semibold text-white">
                          {st.firstName} {st.lastName}
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">{st.admissionNumber}</td>
                        <td className="p-3.5">{st.enrollments?.[0]?.section?.classGrade?.name || "Class 6"}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleFetchReportCard(st.enrollments?.[0]?.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition inline-flex items-center gap-1"
                          >
                            <span>🖨️</span> Term Card
                          </button>
                          <button
                            onClick={() => handleFetchAggregateReportCard(st.enrollments?.[0]?.id)}
                            className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 text-[11px] font-bold transition inline-flex items-center gap-1"
                          >
                            <span>📊</span> Cumulative Annual Card
                          </button>
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
                  <form onSubmit={handleCreateExam} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      + Schedule Examination Term
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">Term Name</label>
                        <input
                          type="text"
                          required
                          value={newExamName}
                          onChange={(e) => setNewExamName(e.target.value)}
                          placeholder="e.g. Unit Test 1, Half-Yearly Exam, Annual Exam"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newExamStartDate}
                          onChange={(e) => setNewExamStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
                        >
                          Create Term
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Batch 6-Subject Marks Entry Form with Live Percentage Calculator */}
                <form onSubmit={handleRecordBatchMarks} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <span>📝</span> Batch 6-Subject Academic Marks Entry
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Key in marks across all 6 core subjects with automatic real-time percentage and grade computation.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Authority Scope:</span>
                      <span className="font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        {teacherScope.canAccessAll ? "ALL SUBJECTS (ADMIN/HOD)" : teacherScope.isClassTeacher ? "CLASS TEACHER" : "SUBJECT TEACHER"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Select Examination Term *</label>
                      <select
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                      >
                        {examsList.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Select Enrolled Student *</label>
                      <select
                        value={markStudentEnrollmentId}
                        onChange={(e) => setMarkStudentEnrollmentId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
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
                      <tbody className="divide-y divide-slate-800/60">
                        {batchMarks.map((bm, idx) => {
                          const th = parseFloat(bm.theoryMarks) || 0;
                          const pr = parseFloat(bm.practicalMarks) || 0;
                          const subTotal = th + pr;
                          const max = parseFloat(bm.maxMarks) || 100;
                          const subPct = max > 0 ? (subTotal / max) * 100 : 0;
                          const subGrade = subPct >= 90 ? "A+" : subPct >= 80 ? "A" : subPct >= 70 ? "B+" : subPct >= 60 ? "B" : subPct >= 50 ? "C" : "D";

                          return (
                            <tr key={idx} className="hover:bg-slate-800/20">
                              <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                              <td className="p-3 font-bold text-white">{bm.subjectName}</td>
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
                                  className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none"
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
                                  className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none"
                                />
                              </td>
                              <td className="p-3 font-mono text-slate-400">{bm.maxMarks}</td>
                              <td className="p-3 font-mono font-bold text-emerald-400 text-sm">
                                {subTotal}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded font-black font-mono text-xs bg-emerald-950 text-emerald-400 border border-emerald-800">
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
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-emerald-900/60 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Grand Total Marks</span>
                            <span className="text-xl font-black text-white font-mono">
                              {totalObt} <span className="text-xs text-slate-400 font-normal">/ {totalMax}</span>
                            </span>
                          </div>
                          <div className="border-l border-slate-800 pl-6">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Percentage</span>
                            <span className="text-2xl font-black text-emerald-400 font-mono">{pct}%</span>
                          </div>
                          <div className="border-l border-slate-800 pl-6">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">CBSE Grade</span>
                            <span className="text-xl font-black text-amber-400 font-mono">{finalG}</span>
                          </div>
                          <div className="border-l border-slate-800 pl-6">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Scholastic Status</span>
                            <span className={`text-xs font-black px-2 py-0.5 rounded ${numPct >= 33 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
                              {status}
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading || !markStudentEnrollmentId}
                          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>📚</span> Class Curriculum Subjects & Faculty
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Assign specialized teachers to curriculum subjects for every class grade.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setSubjectSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    subjectSubTab === "list"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📚 View Curriculum ({subjectsList.length})
                </button>
                <button
                  onClick={() => setSubjectSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    subjectSubTab === "create"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ➕ Add New Subject
                </button>
              </div>
            </div>

            {/* Sub-tab 1: List with reassign */}
            {subjectSubTab === "list" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 font-bold">Select Class Grade:</span>
                  <select
                    value={subjectClassGrade}
                    onChange={(e) => {
                      setSubjectClassGrade(e.target.value);
                      fetchSubjects(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Subject</th>
                        <th className="p-3.5">Board</th>
                        <th className="p-3.5">Assigned Subject Teacher</th>
                        {currentUser.role === "SCHOOL_ADMIN" && <th className="p-3.5 text-right">Faculty & Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {subjectsList.map((sub) => {
                        const teacher = sub.teacher;
                        const prof = teacher?.staffProfile;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-800/30 transition">
                            <td className="p-3.5 font-bold text-white">{sub.name}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                                {sub.board || "CBSE"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {teacher ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    {(prof?.fullName || teacher.email).charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-xs">{prof?.fullName || teacher.email}</p>
                                    <p className="text-[10px] text-slate-400">{prof?.department || teacher.phone || "Faculty"}</p>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-amber-400/80 italic text-[11px]">Unassigned</span>
                              )}
                            </td>
                            {currentUser.role === "SCHOOL_ADMIN" && (
                              <td className="p-3.5 text-right space-x-2">
                                <select
                                  value={sub.teacherId || ""}
                                  onChange={(e) => handleAssignSubjectTeacher(sub.id, e.target.value)}
                                  className="px-2.5 py-1 rounded bg-slate-800 text-xs text-white border border-slate-700 outline-none"
                                >
                                  <option value="">— Unassign —</option>
                                  {staffList
                                    .filter((s) => s.role === "TEACHER" || s.role === "SCHOOL_ADMIN")
                                    .map((t) => (
                                      <option key={t.id} value={t.id}>
                                        {t.staffProfile?.fullName || t.email}
                                      </option>
                                    ))}
                                </select>
                                <button
                                  onClick={() => setEditSubjectModal(sub)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                  className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 font-semibold text-[11px] transition"
                                >
                                  Delete
                                </button>
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
              <form onSubmit={handleCreateSubject} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Add Subject to Curriculum
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Target Class Grade *</label>
                    <select
                      value={subjectClassGrade}
                      onChange={(e) => setSubjectClassGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                    <label className="block text-[11px] text-slate-400 mb-1">Subject Name *</label>
                    <input
                      type="text"
                      required
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="e.g. Sanskrit, Moral Science"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Curriculum Board</label>
                    <select
                      value={newSubjectBoard}
                      onChange={(e) => setNewSubjectBoard(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="STATE_BOARD">State Board</option>
                      <option value="ICSE">ICSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Assign Teacher</label>
                    <select
                      value={newSubjectTeacherId}
                      onChange={(e) => setNewSubjectTeacherId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>🗓️</span> Weekly Class Timetable Builder
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Six-day schedule (Monday to Saturday, Periods 1 to 7) with room allocations.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setTimetableSubTab("grid")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    timetableSubTab === "grid"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🗓️ Schedule Matrix Grid
                </button>
                <button
                  onClick={() => setTimetableSubTab("edit")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    timetableSubTab === "edit"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ✏️ Period Slot Configurator
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Grid */}
            {timetableSubTab === "grid" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 font-bold">Select Class Grade:</span>
                  <select
                    value={timetableClassGrade}
                    onChange={(e) => {
                      setTimetableClassGrade(e.target.value);
                      fetchTimetable(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={`Class ${g}`}>
                        Class {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[800px]">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3 w-28 font-bold text-white">Day</th>
                          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                            <th key={p} className="p-3 text-center border-l border-slate-800">
                              Period {p}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
                          <tr key={day} className="hover:bg-slate-800/20">
                            <td className="p-3 font-bold text-emerald-400 bg-slate-950/40">{day}</td>
                            {[1, 2, 3, 4, 5, 6, 7].map((pNum) => {
                              const entry = timetableEntries.find(
                                (e) => e.dayOfWeek === day && e.periodNumber === pNum
                              );
                              return (
                                <td
                                  key={pNum}
                                  onClick={() => {
                                    setEditSlotModal({
                                      dayOfWeek: day,
                                      periodNumber: pNum,
                                      startTime: entry?.startTime || "08:30 AM",
                                      endTime: entry?.endTime || "09:15 AM",
                                      subjectName: entry?.subjectName || "Mathematics",
                                      teacherName: entry?.teacherName || "Suresh Kumar Verma",
                                      roomNumber: entry?.roomNumber || "Room 101",
                                    });
                                  }}
                                  className="p-2 border-l border-slate-800 cursor-pointer hover:bg-slate-800/60 transition"
                                >
                                  {entry ? (
                                    <div className="space-y-0.5 text-center">
                                      <p className="font-bold text-white text-[11px] truncate">{entry.subjectName}</p>
                                      <p className="text-[10px] text-slate-400 truncate">{entry.teacherName}</p>
                                      <span className="text-[9px] text-slate-500 font-mono block">
                                        {entry.roomNumber || entry.startTime}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-center text-slate-600 text-[10px] py-2">+ Add Slot</div>
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
              <form onSubmit={handleSaveTimetableSlot} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Configure Period Slot for {timetableClassGrade}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Day of Week</label>
                    <select
                      value={editSlotModal?.dayOfWeek || "MONDAY"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), dayOfWeek: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Period Number</label>
                    <select
                      value={editSlotModal?.periodNumber || 1}
                      onChange={(e) =>
                        setEditSlotModal({ ...(editSlotModal || {}), periodNumber: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                  <label className="block text-[11px] text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={editSlotModal?.subjectName || ""}
                    onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), subjectName: e.target.value })}
                    placeholder="Mathematics"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Teacher</label>
                  <input
                    type="text"
                    required
                    value={editSlotModal?.teacherName || ""}
                    onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), teacherName: e.target.value })}
                    placeholder="Suresh Kumar Verma"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Start Time</label>
                    <input
                      type="text"
                      value={editSlotModal?.startTime || "08:30 AM"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">End Time</label>
                    <input
                      type="text"
                      value={editSlotModal?.endTime || "09:15 AM"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>🚌</span> School Transport & Bus Routes
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage school bus routes, drivers, timings, stops, and transport fee schedules.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setTransportSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    transportSubTab === "list"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🚌 View Bus Routes ({busRoutesList.length})
                </button>
                <button
                  onClick={() => setTransportSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    transportSubTab === "create"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
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
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded font-bold font-mono text-xs bg-emerald-500 text-slate-950">
                            {route.routeNumber}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            Vehicle: <strong className="text-white">{route.vehicleNumber}</strong>
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{route.routeName}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Driver: <strong className="text-slate-200">{route.driverName}</strong> ({route.driverPhone})
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 font-mono">
                          <span>Pickup: {route.morningPickupTime}</span>
                          <span>Drop: {route.eveningDropTime}</span>
                          <span>Fee: ₹{route.monthlyFee}/mo</span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                            Stops ({stops.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {stops.map((st: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                              >
                                {st.name} {st.time ? `(${st.time})` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {currentUser.role === "SCHOOL_ADMIN" && (
                        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-3">
                          <button
                            onClick={() => setEditRouteModal(route)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            Edit Route
                          </button>
                          <button
                            onClick={() => handleDeleteBusRoute(route.id)}
                            className="text-xs text-red-400 hover:text-red-300 font-semibold"
                          >
                            Delete Route
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
              <form onSubmit={handleCreateBusRoute} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Configure New Bus Route
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Route Number *</label>
                    <input
                      type="text"
                      required
                      value={newRouteNumber}
                      onChange={(e) => setNewRouteNumber(e.target.value)}
                      placeholder="e.g. R-03"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Route Name *</label>
                    <input
                      type="text"
                      required
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                      placeholder="e.g. Semliya - Hatod - Badgonda Express"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Vehicle Reg Number</label>
                    <input
                      type="text"
                      value={newVehicleNumber}
                      onChange={(e) => setNewVehicleNumber(e.target.value)}
                      placeholder="MP-09-EF-9012"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Driver Name *</label>
                    <input
                      type="text"
                      required
                      value={newDriverName}
                      onChange={(e) => setNewDriverName(e.target.value)}
                      placeholder="Gopal Singh"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Driver Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newDriverPhone}
                      onChange={(e) => setNewDriverPhone(e.target.value)}
                      placeholder="+91 98262 33445"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Pickup Time</label>
                    <input
                      type="text"
                      value={newPickupTime}
                      onChange={(e) => setNewPickupTime(e.target.value)}
                      placeholder="07:20 AM"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Drop Time</label>
                    <input
                      type="text"
                      value={newDropTime}
                      onChange={(e) => setNewDropTime(e.target.value)}
                      placeholder="02:35 PM"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Bus Fee (₹)</label>
                    <input
                      type="number"
                      value={newMonthlyFee}
                      onChange={(e) => setNewMonthlyFee(e.target.value)}
                      placeholder="500"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Stops & Times (comma-separated)</label>
                    <input
                      type="text"
                      value={newStopsInput}
                      onChange={(e) => setNewStopsInput(e.target.value)}
                      placeholder="Stop 1 (07:25 AM), Stop 2 (07:45 AM)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>📢</span> Digital Notice Board & Circulars
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Broadcast notices for examinations, sports events, holidays, and urgent circulars.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setNoticeSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    noticeSubTab === "list"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📢 Active Circulars ({noticesList.length})
                </button>
                <button
                  onClick={() => setNoticeSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    noticeSubTab === "create"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
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
                  <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
                    No active notices broadcasted yet.
                  </div>
                ) : (
                  noticesList.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {n.isPinned && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                              📌 PINNED
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              n.priority === "URGENT"
                                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                : n.priority === "HIGH"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                            }`}
                          >
                            {n.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {n.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Audience: {n.targetAudience} • {new Date(n.publishedAt || n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{n.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{n.content}</p>
                      </div>

                      {currentUser.role === "SCHOOL_ADMIN" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditNoticeModal(n)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-400 text-slate-300 text-xs transition font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(n.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/80 hover:text-red-400 text-slate-400 text-xs transition"
                          >
                            Delete
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
              <form onSubmit={handleCreateNotice} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Publish New Announcement / Circular
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Notice Title *</label>
                    <input
                      type="text"
                      required
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="e.g. Dussehra & Diwali Autumn Break Schedule 2026"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                    <select
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="GENERAL">General Notice</option>
                      <option value="ACADEMIC">Academic / Curriculum</option>
                      <option value="EXAMINATION">Examination Schedule</option>
                      <option value="HOLIDAY">Holiday & Vacations</option>
                      <option value="SPORTS">Sports & Activities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Priority Level</label>
                    <select
                      value={newNoticePriority}
                      onChange={(e) => setNewNoticePriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High Priority</option>
                      <option value="URGENT">🚨 Urgent Alert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Notice Content *</label>
                  <textarea
                    rows={3}
                    required
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    placeholder="Details of instructions, timings, affected classes..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={newNoticeIsPinned}
                      onChange={(e) => setNewNoticeIsPinned(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500"
                    />
                    <span>📌 Pin to top alert banner</span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>🌐</span> School Website, Facilities & Media
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the public landing page, campus infrastructure, photo albums, and video highlights.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setWebsiteSubTab("facilities")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    websiteSubTab === "facilities"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🏛️ World-Class Facilities ({(landingConfig.facilities || []).length})
                </button>
                <button
                  onClick={() => setWebsiteSubTab("media")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    websiteSubTab === "media"
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📸 Campus Info & Media Gallery
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Facilities */}
            {websiteSubTab === "facilities" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Icon / Emoji</label>
                    <select
                      value={newFacilityIcon}
                      onChange={(e) => setNewFacilityIcon(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white outline-none"
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
                    <label className="block text-[11px] text-slate-400 mb-1">Facility Title</label>
                    <input
                      type="text"
                      value={newFacilityName}
                      onChange={(e) => setNewFacilityName(e.target.value)}
                      placeholder="e.g. Modern Physics Lab"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Detailed Description</label>
                    <input
                      type="text"
                      value={newFacilityDesc}
                      onChange={(e) => setNewFacilityDesc(e.target.value)}
                      placeholder="Equipped with hands-on experiment stations..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
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
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-2xl mb-2">{fac.icon}</div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFacility(fac.id)}
                          className="text-red-400 text-xs opacity-0 group-hover:opacity-100 transition p-1"
                        >
                          ✕
                        </button>
                      </div>
                      <h4 className="font-bold text-xs text-white">{fac.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{fac.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveLanding}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
                  >
                    Save All Facilities to Public Portal
                  </button>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Campus Info & Media */}
            {websiteSubTab === "media" && (
              <div className="space-y-6">
                <form onSubmit={handleSaveLanding} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Campus Narrative & Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={landingConfig.tagline || ""}
                        onChange={(e) => setLandingConfig({ ...landingConfig, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Principal Name</label>
                      <input
                        type="text"
                        value={landingConfig.principalName || ""}
                        onChange={(e) => setLandingConfig({ ...landingConfig, principalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">About Narrative</label>
                    <textarea
                      rows={2}
                      value={landingConfig.aboutText || ""}
                      onChange={(e) => setLandingConfig({ ...landingConfig, aboutText: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow"
                  >
                    Save Information
                  </button>
                </form>

                {/* Photo Gallery & Video Gallery sections */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Photos of the Fun & Learning
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Photo URL</label>
                      <input
                        type="url"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Caption</label>
                      <input
                        type="text"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="Science Fair 2026"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      + Add Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(landingConfig.galleryImages || []).map((img: any) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={img.url} alt="" className="w-full aspect-[4/3] object-cover" />
                        <div className="p-2 text-[10px] truncate">{img.caption}</div>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(img.id)}
                          className="absolute top-2 right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Video Showcase Embeds
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        placeholder="Cultural Fest 2026"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Embed URL</label>
                      <input
                        type="url"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      className="py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      + Add Video
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(landingConfig.videoGallery || []).map((vid: any) => (
                      <div key={vid.id} className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2">
                        <div className="aspect-video w-full">
                          <iframe src={vid.videoUrl} title="" className="w-full h-full border-0"></iframe>
                        </div>
                        <div className="flex items-center justify-between pt-2 text-xs">
                          <span className="font-bold truncate">{vid.title}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="text-red-400 hover:text-red-300 text-[11px]"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditModalStudent(null)}
        >
          <div
            className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                Edit Student Record: {editModalStudent.admissionNumber}
              </h3>
              <button
                onClick={() => setEditModalStudent(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.firstName}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.lastName}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    value={editModalStudent.parentPhone || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editModalStudent.fatherName || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Class Grade</label>
                  <select
                    value={editModalStudent.classGradeName || "Class 6"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, classGradeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={`Class ${g}`}>
                        Class {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Section</label>
                  <select
                    value={editModalStudent.sectionName || "A"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, sectionName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                <label className="block text-[11px] text-slate-400 mb-1">Village & Address</label>
                <input
                  type="text"
                  value={editModalStudent.addressText || ""}
                  onChange={(e) => setEditModalStudent({ ...editModalStudent, addressText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalStudent(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setProfileModalStudent(null)}
        >
          <div
            className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-emerald-400 text-lg">
                  {profileModalStudent.avatarUrl ? (
                    <img src={profileModalStudent.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    `${profileModalStudent.firstName[0]}${profileModalStudent.lastName[0]}`
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {profileModalStudent.firstName} {profileModalStudent.lastName}
                  </h3>
                  <p className="text-xs font-mono text-emerald-400">{profileModalStudent.admissionNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setProfileModalStudent(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Class & Section</span>
                <span className="font-semibold text-white">
                  {profileModalStudent.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} - Section{" "}
                  {profileModalStudent.enrollments?.[0]?.section?.name || "A"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Aadhar Number</span>
                <span className="font-semibold text-white font-mono">
                  {profileModalStudent.aadharNumber || "Not Provided"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Father's Name</span>
                <span className="font-semibold text-white">{profileModalStudent.fatherName || "—"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Mother's Name</span>
                <span className="font-semibold text-white">{profileModalStudent.motherName || "—"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Parent Contact</span>
                <span className="font-semibold text-white font-mono">
                  {profileModalStudent.parentPhone || profileModalStudent.user?.phone || "—"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Category</span>
                <span className="font-semibold text-white">
                  {profileModalStudent.category || "GENERAL"} ({profileModalStudent.bloodGroup || "O+"})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setProfileModalStaff(null)}
        >
          <div
            className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-emerald-400 text-lg">
                  {profileModalStaff.staffProfile?.avatarUrl ? (
                    <img src={profileModalStaff.staffProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (profileModalStaff.staffProfile?.fullName || profileModalStaff.email || "S").charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {profileModalStaff.staffProfile?.fullName || profileModalStaff.email?.split("@")[0]}
                  </h3>
                  <p className="text-xs text-emerald-400">
                    {profileModalStaff.staffProfile?.designation || profileModalStaff.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProfileModalStaff(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Department</span>
                <span className="font-semibold text-white">
                  {profileModalStaff.staffProfile?.department || "General"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Qualification</span>
                <span className="font-semibold text-white">
                  {profileModalStaff.staffProfile?.qualification || "Faculty Degree"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Email & Phone</span>
                <span className="font-semibold text-white font-mono block">{profileModalStaff.email}</span>
                <span className="text-slate-400 font-mono">{profileModalStaff.phone || "—"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Aadhar & Experience</span>
                <span className="font-semibold text-white font-mono block">
                  {profileModalStaff.staffProfile?.aadharNumber || "—"}
                </span>
                <span className="text-slate-400">
                  {profileModalStaff.staffProfile?.experienceYears || 0} Years Experience
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
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
              <div className="mt-2 inline-block px-4 py-1 rounded-full bg-slate-900 text-white font-bold text-xs tracking-widest uppercase">
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
                          ? "bg-slate-900 text-white"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setResetModalUser(null)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-sm text-white">
              Reset Password for {resetModalUser.email || resetModalUser.phone}
            </h3>
            <form onSubmit={handleAdminResetPassword} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Enter new password (min 6 chars)"
                value={overridePassword}
                onChange={(e) => setOverridePassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditClassModal(null)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
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
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 transition"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditNoticeModal(null)}
        >
          <div
            className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Category</label>
                  <select
                    value={editNoticeModal.category || "GENERAL"}
                    onChange={(e) => setEditNoticeModal({ ...editNoticeModal, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editNoticePin"
                  checked={Boolean(editNoticeModal.isPinned)}
                  onChange={(e) => setEditNoticeModal({ ...editNoticeModal, isPinned: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500"
                />
                <label htmlFor="editNoticePin" className="text-xs text-slate-300">
                  Pin to top of school notice board
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
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
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 transition"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditRouteModal(null)}
        >
          <div
            className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Vehicle Plate No</label>
                  <input
                    type="text"
                    required
                    value={editRouteModal.vehicleNumber || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={editRouteModal.driverName || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, driverName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Driver Phone</label>
                  <input
                    type="text"
                    required
                    value={editRouteModal.driverPhone || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, driverPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={editRouteModal.morningPickupTime || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, morningPickupTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Drop Time</label>
                  <input
                    type="text"
                    value={editRouteModal.eveningDropTime || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, eveningDropTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={editRouteModal.monthlyFee || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, monthlyFee: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
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
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 transition"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditSubjectModal(null)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Curriculum / Board
                </label>
                <select
                  value={editSubjectModal.board || "CBSE"}
                  onChange={(e) => setEditSubjectModal({ ...editSubjectModal, board: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                >
                  <option value="">— Unassigned Teacher —</option>
                  {staffList.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.designation || t.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
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
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Updating..." : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
