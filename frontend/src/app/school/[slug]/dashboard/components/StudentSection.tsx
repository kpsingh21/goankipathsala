"use client";

import React from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { API_BASE } from "@/lib/config";

const defaultIdCardConfig: any = {
  showSchoolLogo: true,
  showFatherName: true,
  showBloodGroup: true,
  showParentPhone: true,
  showAddress: true,
  showBarcode: true,
  showPrincipalSignature: true,
  themeColor: "blue",
};

const defaultReportCardConfig: any = {
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
};

export interface StudentSectionProps {
  activeSection?: string;
  setActiveSection?: any;
  isAdmin?: boolean;
  isAccountant?: boolean;
  isAccountantOnly?: boolean;
  isTeacherOnly?: boolean;
  isDriverOnly?: boolean;
  teacherClassNames?: string[];
  loading?: boolean;
  currentUser?: any;
  token?: string | null;
  slug?: string;
  theme?: string;
  landingConfig?: any;
  setLandingConfig?: any;
  filteredStudents?: any[];
  filteredStaff?: any[];
  routeAssignments?: Record<string, any[]>;
  idCardConfig?: any;
  setIdCardConfig?: (updater: (prev: any) => any) => void;
  reportCardConfig?: any;
  setReportCardConfig?: (updater: (prev: any) => any) => void;
  studentSubTab?: any;
  setStudentSubTab?: React.Dispatch<React.SetStateAction<any>>;
  classesList?: any[];
  studentImportModalOpen?: any;
  setStudentImportModalOpen?: React.Dispatch<React.SetStateAction<any>>;
  studentImportRows?: any[];
  setStudentImportRows?: React.Dispatch<React.SetStateAction<any[]>>;
  studentImportLoading?: any;
  studentImportResult?: any;
  setStudentImportResult?: React.Dispatch<React.SetStateAction<any>>;
  studentImportFileName?: any;
  setStudentImportFileName?: React.Dispatch<React.SetStateAction<any>>;
  studentExportModalOpen?: any;
  setStudentExportModalOpen?: React.Dispatch<React.SetStateAction<any>>;
  exportFilterClass?: any;
  setExportFilterClass?: React.Dispatch<React.SetStateAction<any>>;
  exportFilterSection?: any;
  setExportFilterSection?: React.Dispatch<React.SetStateAction<any>>;
  exportFilterGender?: any;
  setExportFilterGender?: React.Dispatch<React.SetStateAction<any>>;
  exportFilterCategory?: any;
  setExportFilterCategory?: React.Dispatch<React.SetStateAction<any>>;
  exportFilterBloodGroup?: any;
  setExportFilterBloodGroup?: React.Dispatch<React.SetStateAction<any>>;
  exportFilterStatus?: any;
  setExportFilterStatus?: React.Dispatch<React.SetStateAction<any>>;
  studentList?: any[];
  setStudentList?: React.Dispatch<React.SetStateAction<any[]>>;
  studentSearch?: any;
  setStudentSearch?: React.Dispatch<React.SetStateAction<any>>;
  studentFilterClass?: any;
  setStudentFilterClass?: React.Dispatch<React.SetStateAction<any>>;
  studentFilterSection?: any;
  setStudentFilterSection?: React.Dispatch<React.SetStateAction<any>>;
  studentFilterCategory?: any;
  setStudentFilterCategory?: React.Dispatch<React.SetStateAction<any>>;
  admissionNo?: any;
  setAdmissionNo?: React.Dispatch<React.SetStateAction<any>>;
  rollNo?: any;
  setRollNo?: React.Dispatch<React.SetStateAction<any>>;
  firstName?: any;
  setFirstName?: React.Dispatch<React.SetStateAction<any>>;
  lastName?: any;
  setLastName?: React.Dispatch<React.SetStateAction<any>>;
  studentAvatarUrl?: any;
  setStudentAvatarUrl?: React.Dispatch<React.SetStateAction<any>>;
  dob?: any;
  gender?: any;
  aadharNumber?: any;
  setAadharNumber?: React.Dispatch<React.SetStateAction<any>>;
  category?: any;
  setCategory?: React.Dispatch<React.SetStateAction<any>>;
  bloodGroup?: any;
  setBloodGroup?: React.Dispatch<React.SetStateAction<any>>;
  fatherName?: any;
  setFatherName?: React.Dispatch<React.SetStateAction<any>>;
  motherName?: any;
  setMotherName?: React.Dispatch<React.SetStateAction<any>>;
  parentPhone?: any;
  setParentPhone?: React.Dispatch<React.SetStateAction<any>>;
  guardianOccupation?: any;
  setGuardianOccupation?: React.Dispatch<React.SetStateAction<any>>;
  villageCity?: any;
  setVillageCity?: React.Dispatch<React.SetStateAction<any>>;
  pincode?: any;
  setPincode?: React.Dispatch<React.SetStateAction<any>>;
  addressText?: any;
  setAddressText?: React.Dispatch<React.SetStateAction<any>>;
  className?: any;
  setClassName?: React.Dispatch<React.SetStateAction<any>>;
  sectionName?: any;
  setSectionName?: React.Dispatch<React.SetStateAction<any>>;
  editModalStudent?: any;
  setEditModalStudent?: React.Dispatch<React.SetStateAction<any>>;
  studentAadharDoc?: any;
  setStudentAadharDoc?: React.Dispatch<React.SetStateAction<any>>;
  studentTcDoc?: any;
  setStudentTcDoc?: React.Dispatch<React.SetStateAction<any>>;
  studentMarksheetDoc?: any;
  setStudentMarksheetDoc?: React.Dispatch<React.SetStateAction<any>>;
  templateCustomizerModal?: string | null;
  setTemplateCustomizerModal?: React.Dispatch<React.SetStateAction<any>>;
  selectedStudentIdsForIdCard?: any[];
  setSelectedStudentIdsForIdCard?: React.Dispatch<React.SetStateAction<any[]>>;
  bulkPrintIdCardsStudents?: any[] | null;
  setBulkPrintIdCardsStudents?: React.Dispatch<React.SetStateAction<any>>;
  profileModalStudent?: any;
  setProfileModalStudent?: React.Dispatch<React.SetStateAction<any>>;
  viewIdCardStudent?: any;
  setViewIdCardStudent?: React.Dispatch<React.SetStateAction<any>>;
  promoteModalOpen?: any;
  setPromoteModalOpen?: React.Dispatch<React.SetStateAction<any>>;
  promoteSourceClass?: any;
  promoteSelectedStudentIds?: any[];
  promoteTargetClass?: any;
  setPromoteTargetClass?: React.Dispatch<React.SetStateAction<any>>;
  promoteTargetSection?: any;
  setPromoteTargetSection?: React.Dispatch<React.SetStateAction<any>>;
  promoteTargetYear?: any;
  setPromoteTargetYear?: React.Dispatch<React.SetStateAction<any>>;
  promoteIsGraduation?: any;
  setPromoteIsGraduation?: React.Dispatch<React.SetStateAction<any>>;
  promotingStudents?: any;
  setMsg?: React.Dispatch<React.SetStateAction<any>>;
  handleOpenPromotionModal?: any;
  handleSourceClassChange?: any;
  handleToggleSelectAllPromote?: any;
  handleToggleStudentPromote?: any;
  handleExecutePromotion?: any;
  uploadDesktopFile?: (e: any, cb: (url: string) => void) => void;
  getFilteredExportStudents?: any;
  handleExportStudents?: any;
  handleRegisterStudent?: any;
  handleUpdateStudent?: any;
  handleDeleteStudent?: any;
  handleFetchReportCard?: any;
  handleDownloadStudentTemplate?: any;
  handleStudentExcelUpload?: any;
  handleExecuteStudentImport?: any;
  [key: string]: any;
}

export default function StudentSection(props: StudentSectionProps) {
  const {
    activeSection = '',
    setActiveSection = () => {},
    isAdmin = false,
    isAccountant = false,
    isAccountantOnly = false,
    isTeacherOnly = false,
    isDriverOnly = false,
    teacherClassNames = [],
    loading = false,
    currentUser,
    token = typeof window !== 'undefined' ? localStorage.getItem('gkp_token') : null,
    slug = '',
    theme = 'blue',
    landingConfig,
    setLandingConfig = () => {},
    filteredStudents = [],
    filteredStaff = [],
    routeAssignments = {},
    idCardConfig = defaultIdCardConfig,
    setIdCardConfig = () => {},
    reportCardConfig = defaultReportCardConfig,
    setReportCardConfig = () => {},
    studentSubTab,
    setStudentSubTab = () => {},
    classesList = [],
    studentImportModalOpen,
    setStudentImportModalOpen = () => {},
    studentImportRows = [],
    setStudentImportRows = () => {},
    studentImportLoading,
    studentImportResult,
    setStudentImportResult = () => {},
    studentImportFileName,
    setStudentImportFileName = () => {},
    studentExportModalOpen,
    setStudentExportModalOpen = () => {},
    exportFilterClass,
    setExportFilterClass = () => {},
    exportFilterSection,
    setExportFilterSection = () => {},
    exportFilterGender,
    setExportFilterGender = () => {},
    exportFilterCategory,
    setExportFilterCategory = () => {},
    exportFilterBloodGroup,
    setExportFilterBloodGroup = () => {},
    exportFilterStatus,
    setExportFilterStatus = () => {},
    studentList = [],
    setStudentList = () => {},
    studentSearch,
    setStudentSearch = () => {},
    studentFilterClass,
    setStudentFilterClass = () => {},
    studentFilterSection,
    setStudentFilterSection = () => {},
    studentFilterCategory,
    setStudentFilterCategory = () => {},
    admissionNo,
    setAdmissionNo = () => {},
    rollNo,
    setRollNo = () => {},
    firstName,
    setFirstName = () => {},
    lastName,
    setLastName = () => {},
    studentAvatarUrl,
    setStudentAvatarUrl = () => {},
    dob,
    gender,
    aadharNumber,
    setAadharNumber = () => {},
    category,
    setCategory = () => {},
    bloodGroup,
    setBloodGroup = () => {},
    fatherName,
    setFatherName = () => {},
    motherName,
    setMotherName = () => {},
    parentPhone,
    setParentPhone = () => {},
    guardianOccupation,
    setGuardianOccupation = () => {},
    villageCity,
    setVillageCity = () => {},
    pincode,
    setPincode = () => {},
    addressText,
    setAddressText = () => {},
    className,
    setClassName = () => {},
    sectionName,
    setSectionName = () => {},
    editModalStudent,
    setEditModalStudent = () => {},
    studentAadharDoc,
    setStudentAadharDoc = () => {},
    studentTcDoc,
    setStudentTcDoc = () => {},
    studentMarksheetDoc,
    setStudentMarksheetDoc = () => {},
    templateCustomizerModal = null,
    setTemplateCustomizerModal = () => {},
    selectedStudentIdsForIdCard = [],
    setSelectedStudentIdsForIdCard = () => {},
    bulkPrintIdCardsStudents = null,
    setBulkPrintIdCardsStudents = () => {},
    profileModalStudent,
    setProfileModalStudent = () => {},
    viewIdCardStudent,
    setViewIdCardStudent = () => {},
    promoteModalOpen,
    setPromoteModalOpen = () => {},
    promoteSourceClass,
    promoteSelectedStudentIds = [],
    promoteTargetClass,
    setPromoteTargetClass = () => {},
    promoteTargetSection,
    setPromoteTargetSection = () => {},
    promoteTargetYear,
    setPromoteTargetYear = () => {},
    promoteIsGraduation,
    setPromoteIsGraduation = () => {},
    promotingStudents,
    setMsg = () => {},
    handleOpenPromotionModal = () => {},
    handleSourceClassChange = () => {},
    handleToggleSelectAllPromote = () => {},
    handleToggleStudentPromote = () => {},
    handleExecutePromotion = () => {},
    uploadDesktopFile = () => {},
    getFilteredExportStudents = () => {},
    handleExportStudents = () => {},
    handleRegisterStudent = () => {},
    handleUpdateStudent = () => {},
    handleDeleteStudent = () => {},
    handleFetchReportCard = () => {},
    handleDownloadStudentTemplate = () => {},
    handleStudentExcelUpload = () => {},
    handleExecuteStudentImport = () => {},
  } = props;

  return (
    <>
      {activeSection === "students" && (
          <div
            className={`space-y-6 transition-all ${"bg-slate-50 text-slate-900 p-6 rounded-3xl border border-slate-200 shadow-sm"
            }`}
          >
            {/* Visual Palette Preview Banner for Students */}
            

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
              <div>
                <h2
                  className={`text-xl font-extrabold flex items-center gap-2 ${"text-slate-900"
                  }`}
                >
                  <span>🎓</span> Student Information
                </h2>
                <p
                  className={`text-xs mt-1 ${"text-slate-600"
                  }`}
                >
                  Manage student profiles, enrollments, parents, village records, and academic status.
                </p>
              </div>

              {/* Action buttons & tabs */}
              <div className="flex items-center flex-wrap gap-2">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentImportModalOpen(true);
                        setStudentImportRows([]);
                        setStudentImportResult(null);
                        setStudentImportFileName("");
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-950"
                    >
                      <span>📥</span>
                      <span>Import via Excel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentExportModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Export student roster to Excel spreadsheet with custom filters"
                    >
                      <span>📤</span>
                      <span>Export to Excel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenPromotionModal()}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                      title="Promote class students to the next grade upon completing academic session"
                    >
                      <span>⚡</span>
                      <span>Promote to New Class</span>
                    </button>
                  </>
                )}

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                  <button
                    onClick={() => setStudentSubTab("list")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      studentSubTab === "list"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    📋 View Students ({studentList.length})
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setStudentSubTab("create");
                        if (!admissionNo) {
                          setAdmissionNo(`ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        studentSubTab === "create"
                          ? "bg-blue-600 text-white font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 font-semibold"
                      }`}
                    >
                      ➕ Enroll Student
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-tab 1: List with filters */}
            {studentSubTab === "list" && (
              <div className="space-y-4">
                {isTeacherOnly && (
                  <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-blue-950 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">👨‍🏫</span>
                      <span>
                        Faculty Portal • Showing students of your assigned class:{" "}
                        <strong className="text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 font-bold">
                          {teacherClassNames.length > 0 ? teacherClassNames.join(", ") : "Assigned Class Only"}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg font-bold shrink-0">
                      Roster & Attendance Access Only
                    </span>
                  </div>
                )}
                {/* Bulk Print & ID Card Look and Feel Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700">
                    {selectedStudentIdsForIdCard.length > 0 ? (
                      <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        {selectedStudentIdsForIdCard.length} of {studentList.length} students selected for bulk action
                      </span>
                    ) : (
                      <span>Showing {studentList.length} enrolled students</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setTemplateCustomizerModal("id_card")}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <span>⚙️</span> ID Card Look & Feel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const targets = selectedStudentIdsForIdCard.length > 0
                          ? studentList.filter((s) => selectedStudentIdsForIdCard.includes(s.id))
                          : studentList;
                        setBulkPrintIdCardsStudents(targets);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition shadow-2xs inline-flex items-center gap-1.5"
                    >
                      <span>🖨️</span> Bulk Print ID Cards {selectedStudentIdsForIdCard.length > 0 ? `(${selectedStudentIdsForIdCard.length})` : `(${studentList.length})`}
                    </button>
                  </div>
                </div>
                {/* Filters */}
                <div
                  className={`p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 ${"bg-white border border-slate-200 shadow-sm text-slate-800"
                  }`}
                >
                  <div>
                    <label
                      className={`block text-[10px] uppercase font-bold mb-1 ${"text-slate-600"
                      }`}
                    >
                      🔍 Search Name, Admission, Mobile
                    </label>
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="e.g. Aarav, ADM-2026..."
                      className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none ${"bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-[10px] uppercase font-bold mb-1 ${"text-slate-600"
                      }`}
                    >
                      Class Grade
                    </label>
                    <select
                      value={studentFilterClass}
                      onChange={(e) => setStudentFilterClass(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none ${"bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                      }`}
                    >
                      <option value="ALL">
                        {isTeacherOnly && teacherClassNames.length > 0
                          ? `My Assigned Classes (${teacherClassNames.join(", ")})`
                          : `All Configured Classes (${classesList.length})`}
                      </option>
                      {(isTeacherOnly && teacherClassNames.length > 0
                        ? classesList.filter((c) => teacherClassNames.includes(c.name))
                        : classesList
                      ).map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-[10px] uppercase font-bold mb-1 ${"text-slate-600"
                      }`}
                    >
                      Section
                    </label>
                    <select
                      value={studentFilterSection}
                      onChange={(e) => setStudentFilterSection(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none ${"bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                      }`}
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
                    <label
                      className={`block text-[10px] uppercase font-bold mb-1 ${"text-slate-600"
                      }`}
                    >
                      Category
                    </label>
                    <select
                      value={studentFilterCategory}
                      onChange={(e) => setStudentFilterCategory(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none ${"bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                      }`}
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
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto overscroll-x-contain touch-auto">
                    <table className="w-full min-w-[650px] text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={filteredStudents.length > 0 && selectedStudentIdsForIdCard.length === filteredStudents.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudentIdsForIdCard(filteredStudents.map((s) => s.id));
                                } else {
                                  setSelectedStudentIdsForIdCard([]);
                                }
                              }}
                              className="accent-blue-600 h-4 w-4 rounded cursor-pointer"
                            />
                          </th>
                          <th className="p-3.5">Student</th>
                          <th className="p-3.5">Admission No (UID)</th>
                          <th className="p-3.5">Roll No</th>
                          <th className="p-3.5">Class & Section</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={selectedStudentIdsForIdCard.includes(s.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentIdsForIdCard([...selectedStudentIdsForIdCard, s.id]);
                                  } else {
                                    setSelectedStudentIdsForIdCard(selectedStudentIdsForIdCard.filter((id) => id !== s.id));
                                  }
                                }}
                                className="accent-blue-600 h-4 w-4 rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 flex items-center gap-3">
                              <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 overflow-hidden flex items-center justify-center font-bold text-blue-700 text-xs shrink-0 shadow-2xs">
                                {s.avatarUrl ? (
                                  <img src={s.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  `${s.firstName[0]}${s.lastName[0]}`
                                )}
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setProfileModalStudent(s)}
                                  className="font-bold text-slate-950 text-sm hover:text-blue-700 hover:underline cursor-pointer text-left block"
                                  title="Click to view comprehensive student profile"
                                >
                                  {s.firstName} {s.lastName}
                                </button>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="font-mono text-blue-700 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/70 inline-block">
                                {s.admissionNumber || "—"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-slate-700 text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                                {s.rollNumber || s.rollNo || s.enrollments?.[0]?.rollNumber || "—"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold inline-block">
                                {s.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} - {s.enrollments?.[0]?.section?.name || "A"}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => setViewIdCardStudent(s)}
                                title="Print Identity Card"
                                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition shadow-2xs inline-flex items-center justify-center text-xs"
                              >
                                🪪
                              </button>
                              <button
                                onClick={() => handleFetchReportCard(s.enrollments?.[0]?.id)}
                                title="View Academic Results & Report Card"
                                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition shadow-2xs inline-flex items-center justify-center text-xs"
                              >
                                📊
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={() =>
                                    setEditModalStudent({
                                      ...s,
                                      classGradeName: s.enrollments?.[0]?.section?.classGrade?.name || "Class 6",
                                      sectionName: s.enrollments?.[0]?.section?.name || "A",
                                    })
                                  }
                                  title="Edit Student Record"
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition shadow-2xs inline-flex items-center justify-center text-xs"
                                >
                                  ✏️
                                </button>
                              )}
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteStudent(s.id, `${s.firstName} ${s.lastName}`)}
                                  title="Delete Student"
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-2xs inline-flex items-center justify-center text-xs"
                                >
                                  🗑️
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
            {studentSubTab === "create" && isAdmin && (
              <form onSubmit={handleRegisterStudent} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + New Student Admission & Profile Enrollment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Admission No (UID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={admissionNo}
                      onChange={(e) => setAdmissionNo(e.target.value)}
                      placeholder="ADM-2026-003"
                      className="w-full px-3 py-2 rounded-lg bg-blue-50/50 border border-blue-200 text-xs text-blue-900 font-bold font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Roll No (Editable)</label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 101"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium font-mono outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-400">Photo / Avatar URL</label>
                      <label className="text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold flex items-center gap-1">
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Grade *</label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Maya Verma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Guardian Occupation</label>
                    <input
                      type="text"
                      value={guardianOccupation}
                      onChange={(e) => setGuardianOccupation(e.target.value)}
                      placeholder="Agriculture / Business"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={addressText}
                      onChange={(e) => setAddressText(e.target.value)}
                      placeholder="Ward No. 4, Near Panchayat Bhavan"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Uploaded Verification Documents (KYC & Academic Records) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <span>📁</span> Uploaded Verification Documents
                      </h4>
                      <p className="text-[11px] text-slate-500">Upload official verification documents (Aadhar Card, Transfer Certificate, Previous Marksheet/Photo).</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Required for Dossier
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Aadhar Document */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-800">🪪 Aadhar Card Document</label>
                        <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span>📁 Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setStudentAadharDoc(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={studentAadharDoc}
                        onChange={(e) => setStudentAadharDoc(e.target.value)}
                        placeholder="Document URL or upload file"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                      />
                      {studentAadharDoc && (
                        <a href={studentAadharDoc} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                          ✓ Document Attached (Preview) ↗
                        </a>
                      )}
                    </div>

                    {/* TC / Birth Certificate */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-800">📜 Transfer Cert (TC) / Birth Cert</label>
                        <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span>📁 Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setStudentTcDoc(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={studentTcDoc}
                        onChange={(e) => setStudentTcDoc(e.target.value)}
                        placeholder="Document URL or upload file"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                      />
                      {studentTcDoc && (
                        <a href={studentTcDoc} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                          ✓ Document Attached (Preview) ↗
                        </a>
                      )}
                    </div>

                    {/* Previous Marksheet */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-800">📊 Previous Marksheet / Records</label>
                        <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span>📁 Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setStudentMarksheetDoc(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={studentMarksheetDoc}
                        onChange={(e) => setStudentMarksheetDoc(e.target.value)}
                        placeholder="Document URL or upload file"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                      />
                      {studentMarksheetDoc && (
                        <a href={studentMarksheetDoc} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                          ✓ Document Attached (Preview) ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                >
                  {loading ? "Enrolling..." : "+ Complete Student Enrollment"}
                </button>
              </form>
            )}
          </div>
      )}

      {studentExportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setStudentExportModalOpen(false)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                  <span>📤</span> Export Student Roster to Excel
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Filter by class, gender, category, status, and download spreadsheet
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStudentExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Filter Matching Counter Badge */}
            {(() => {
              const matchedCount = getFilteredExportStudents().length;
              return (
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-blue-950">
                    <span>📊</span>
                    <span>Matched Students:</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-xs font-black">
                      {matchedCount} of {studentList.length}
                    </span>
                  </div>
                  {(exportFilterClass !== "ALL" || exportFilterGender !== "ALL" || exportFilterSection !== "ALL" || exportFilterCategory !== "ALL" || exportFilterBloodGroup !== "ALL" || exportFilterStatus !== "ALL") && (
                    <button
                      type="button"
                      onClick={() => {
                        setExportFilterClass("ALL");
                        setExportFilterSection("ALL");
                        setExportFilterGender("ALL");
                        setExportFilterCategory("ALL");
                        setExportFilterBloodGroup("ALL");
                        setExportFilterStatus("ALL");
                      }}
                      className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Filter 1: Class Grade */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  🏛️ Class / Grade
                </label>
                <select
                  value={exportFilterClass}
                  onChange={(e) => setExportFilterClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="ALL">All Classes & Grades</option>
                  {Array.from(new Set(studentList.map((s: any) => s.enrollments?.[0]?.section?.classGrade?.name || s.enrollments?.[0]?.classGradeName).filter(Boolean))).map((cls: any) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Section */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  🔤 Section
                </label>
                <select
                  value={exportFilterSection}
                  onChange={(e) => setExportFilterSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="ALL">All Sections</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>

              {/* Filter 3: Gender Wise */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  ⚧️ Gender Wise Filter
                </label>
                <select
                  value={exportFilterGender}
                  onChange={(e) => setExportFilterGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="ALL">All Genders (Boys & Girls)</option>
                  <option value="MALE">👦 Male / Boys Only</option>
                  <option value="FEMALE">👧 Female / Girls Only</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Filter 4: Category / Quota */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  🏷️ Category / Quota
                </label>
                <select
                  value={exportFilterCategory}
                  onChange={(e) => setExportFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="ALL">All Categories</option>
                  <option value="GENERAL">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS (Economically Weaker)</option>
                </select>
              </div>

              {/* Filter 5: Blood Group */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  🩸 Blood Group
                </label>
                <select
                  value={exportFilterBloodGroup}
                  onChange={(e) => setExportFilterBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="ALL">All Blood Groups</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Filter 6: Academic Status */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  📌 Academic Enrollment Status
                </label>
                <select
                  value={exportFilterStatus}
                  onChange={(e) => setExportFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ENROLLED">Enrolled / Active</option>
                  <option value="PROMOTED">Promoted</option>
                  <option value="GRADUATED">Graduated / Passed</option>
                  <option value="INACTIVE">Inactive / Left</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStudentExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={getFilteredExportStudents().length === 0}
                onClick={() => handleExportStudents()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>📥</span> Download Filtered Excel ({getFilteredExportStudents().length})
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalStudent && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditModalStudent(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
              <div>
                <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                  <span>✏️</span> Edit Student: {editModalStudent.firstName} {editModalStudent.lastName}
                </h3>
                <p className="text-[11px] font-mono text-blue-700 font-bold">
                  Admission UID: {editModalStudent.admissionNumber}
                </p>
              </div>
              <button
                onClick={() => setEditModalStudent(null)}
                className="text-slate-600 hover:text-slate-900 font-bold text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.firstName || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editModalStudent.lastName || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Roll No (Editable)</label>
                  <input
                    type="text"
                    value={editModalStudent.rollNumber || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, rollNumber: e.target.value })}
                    placeholder="101"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Aadhar (12 Digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={editModalStudent.aadharNumber || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, aadharNumber: e.target.value })}
                    placeholder="4521 7890 1234"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Grade *</label>
                  <select
                    value={editModalStudent.classGradeName || "Class 6"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, classGradeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                    value={editModalStudent.sectionName || "A"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, sectionName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    {["A", "B", "C", "D"].map((s) => (
                      <option key={s} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editModalStudent.category || "GENERAL"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                    value={editModalStudent.bloodGroup || "B+"}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={editModalStudent.parentPhone || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editModalStudent.fatherName || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={editModalStudent.motherName || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, motherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">Photo / Avatar URL</label>
                    <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span>📁 Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          uploadDesktopFile(e, (url) => setEditModalStudent({ ...editModalStudent, avatarUrl: url }))
                        }
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={editModalStudent.avatarUrl || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, avatarUrl: e.target.value })}
                    placeholder="https://... or uploaded photo"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Village & Address</label>
                  <input
                    type="text"
                    value={editModalStudent.addressText || ""}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, addressText: e.target.value })}
                    placeholder="Ward No. 4, Village"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
              </div>

              {/* Uploaded Verification Documents Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span>📁</span> Uploaded Verification Documents
                    </h4>
                    <p className="text-[11px] text-slate-500">Official student KYC, Aadhar, Transfer Certificate & Academic records.</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Document Center
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Aadhar Document */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-800">🪪 Aadhar Card</label>
                      <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span>📁 Upload</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) =>
                            uploadDesktopFile(e, (url) => setEditModalStudent({ ...editModalStudent, aadharDoc: url }))
                          }
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={editModalStudent.aadharDoc || ""}
                      onChange={(e) => setEditModalStudent({ ...editModalStudent, aadharDoc: e.target.value })}
                      placeholder="Document URL or upload file"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                    />
                    {editModalStudent.aadharDoc && (
                      <a
                        href={editModalStudent.aadharDoc}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        ✓ Document Attached (Preview) ↗
                      </a>
                    )}
                  </div>

                  {/* Transfer Certificate / Birth Certificate */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-800">📜 Transfer Cert (TC)</label>
                      <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span>📁 Upload</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) =>
                            uploadDesktopFile(e, (url) => setEditModalStudent({ ...editModalStudent, tcDoc: url }))
                          }
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={editModalStudent.tcDoc || ""}
                      onChange={(e) => setEditModalStudent({ ...editModalStudent, tcDoc: e.target.value })}
                      placeholder="Document URL or upload file"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                    />
                    {editModalStudent.tcDoc && (
                      <a
                        href={editModalStudent.tcDoc}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        ✓ Document Attached (Preview) ↗
                      </a>
                    )}
                  </div>

                  {/* Previous Marksheet / Records */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-800">📊 Previous Marksheet</label>
                      <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span>📁 Upload</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) =>
                            uploadDesktopFile(e, (url) => setEditModalStudent({ ...editModalStudent, marksheetDoc: url }))
                          }
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={editModalStudent.marksheetDoc || ""}
                      onChange={(e) => setEditModalStudent({ ...editModalStudent, marksheetDoc: e.target.value })}
                      placeholder="Document URL or upload file"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                    />
                    {editModalStudent.marksheetDoc && (
                      <a
                        href={editModalStudent.marksheetDoc}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        ✓ Document Attached (Preview) ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditModalStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  {loading ? "Saving..." : "✓ Save Changes & Verification Documents"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {profileModalStudent && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setProfileModalStudent(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="h-13 w-13 rounded-2xl bg-blue-50 border border-blue-200 overflow-hidden flex items-center justify-center font-black text-blue-700 text-lg shadow-2xs">
                  {profileModalStudent.avatarUrl ? (
                    <img src={profileModalStudent.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    `${profileModalStudent.firstName[0]}${profileModalStudent.lastName[0]}`
                  )}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-950">
                    {profileModalStudent.firstName} {profileModalStudent.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      {profileModalStudent.admissionNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {profileModalStudent.enrollments?.[0]?.section?.classGrade?.name || "Class"} - Sec {profileModalStudent.enrollments?.[0]?.section?.name || "A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const st = profileModalStudent;
                    setProfileModalStudent(null);
                    setViewIdCardStudent(st);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold inline-flex items-center gap-1.5 transition shadow-2xs"
                >
                  🪪 Print ID Card
                </button>
                <button
                  onClick={() => setProfileModalStudent(null)}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Class & Section</span>
                <span className="font-bold text-slate-950 text-sm">
                  {profileModalStudent.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} - Section{" "}
                  {profileModalStudent.enrollments?.[0]?.section?.name || "A"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Aadhar Number</span>
                <span className="font-bold text-blue-800 font-mono text-sm">
                  {profileModalStudent.aadharNumber || "Not Provided"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Father's Name</span>
                <span className="font-bold text-slate-950 text-sm">{profileModalStudent.fatherName || "—"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Mother's Name</span>
                <span className="font-bold text-slate-950 text-sm">{profileModalStudent.motherName || "—"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Parent Contact</span>
                <span className="font-bold text-blue-800 font-mono text-sm">
                  {profileModalStudent.parentPhone || profileModalStudent.user?.phone || "—"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Category & Blood Group</span>
                <span className="font-bold text-slate-950 text-sm">
                  {profileModalStudent.category || "GENERAL"} ({profileModalStudent.bloodGroup || "O+"})
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Village & Address</span>
              <p className="text-slate-900 font-bold mt-1 text-xs leading-relaxed">
                {profileModalStudent.villageCity ? `${profileModalStudent.villageCity}, ` : ""}
                {profileModalStudent.addressText || "Campus Area"}
                {profileModalStudent.pincode ? ` - ${profileModalStudent.pincode}` : ""}
              </p>
            </div>

            {/* Student KYC & Verification Documents */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">
                    📁 Uploaded Verification Documents
                  </span>
                  <span className="text-[11px] text-slate-500">Official student identity & admission verification files</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const st = profileModalStudent;
                    setProfileModalStudent(null);
                    setEditModalStudent({
                      ...st,
                      classGradeName: st.enrollments?.[0]?.section?.classGrade?.name || "Class 6",
                      sectionName: st.enrollments?.[0]?.section?.name || "A",
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
                >
                  <span>✏️</span> Upload / Edit Documents
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Aadhar Card Document */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                      <span>🪪</span> Aadhar Card
                    </span>
                    <label className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                      <span>📁 Upload</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) =>
                          uploadDesktopFile(e, async (url) => {
                            const updated = { ...profileModalStudent, aadharDoc: url };
                            setProfileModalStudent(updated);
                            setStudentList((prev) => prev.map((s) => (s.id === updated.id ? { ...s, aadharDoc: url } : s)));
                            try {
                              await fetch(`${API_BASE}/api/students/${updated.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
                                body: JSON.stringify({ aadharDoc: url }),
                              });
                            } catch (e) {}
                          })
                        }
                      />
                    </label>
                  </div>
                  {profileModalStudent.aadharDoc ? (
                    <a
                      href={profileModalStudent.aadharDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                    >
                      <span>📄 View Document</span> ↗
                    </a>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">Not Uploaded</span>
                  )}
                </div>

                {/* Transfer Certificate (TC) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                      <span>📜</span> Transfer Cert (TC)
                    </span>
                    <label className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                      <span>📁 Upload</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) =>
                          uploadDesktopFile(e, async (url) => {
                            const updated = { ...profileModalStudent, tcDoc: url };
                            setProfileModalStudent(updated);
                            setStudentList((prev) => prev.map((s) => (s.id === updated.id ? { ...s, tcDoc: url } : s)));
                            try {
                              await fetch(`${API_BASE}/api/students/${updated.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
                                body: JSON.stringify({ tcDoc: url }),
                              });
                            } catch (e) {}
                          })
                        }
                      />
                    </label>
                  </div>
                  {profileModalStudent.tcDoc ? (
                    <a
                      href={profileModalStudent.tcDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                    >
                      <span>📄 View TC Copy</span> ↗
                    </a>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">Not Uploaded</span>
                  )}
                </div>

                {/* Previous Marksheet / Records */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                      <span>📊</span> Previous Records
                    </span>
                    <label className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                      <span>📁 Upload</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) =>
                          uploadDesktopFile(e, async (url) => {
                            const updated = { ...profileModalStudent, marksheetDoc: url };
                            setProfileModalStudent(updated);
                            setStudentList((prev) => prev.map((s) => (s.id === updated.id ? { ...s, marksheetDoc: url } : s)));
                            try {
                              await fetch(`${API_BASE}/api/students/${updated.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "X-Tenant-Slug": slug },
                                body: JSON.stringify({ marksheetDoc: url }),
                              });
                            } catch (e) {}
                          })
                        }
                      />
                    </label>
                  </div>
                  {profileModalStudent.marksheetDoc ? (
                    <a
                      href={profileModalStudent.marksheetDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                    >
                      <span>📄 View Marksheet</span> ↗
                    </a>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">Not Uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewIdCardStudent && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:fixed print:inset-0 print:z-[9999] print:bg-white print:p-0 print:overflow-visible print:block"
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
            <div className={`border-2 rounded-2xl overflow-hidden shadow-lg bg-white text-slate-900 ${
              idCardConfig.themeColor === "emerald"
                ? "border-emerald-600 bg-gradient-to-b from-emerald-50 to-white"
                : idCardConfig.themeColor === "burgundy"
                ? "border-rose-900 bg-gradient-to-b from-rose-50 to-white"
                : "border-blue-700 bg-gradient-to-b from-blue-50 to-white"
            }`}>
              {/* Card Header */}
              <div className={`text-white p-3 text-center relative ${
                idCardConfig.themeColor === "emerald"
                  ? "bg-emerald-600"
                  : idCardConfig.themeColor === "burgundy"
                  ? "bg-rose-900"
                  : "bg-blue-700"
              }`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className={`h-7 w-7 rounded-lg bg-white font-black flex items-center justify-center text-sm shadow ${
                    idCardConfig.themeColor === "emerald"
                      ? "text-emerald-700"
                      : idCardConfig.themeColor === "burgundy"
                      ? "text-rose-900"
                      : "text-blue-700"
                  }`}>
                    ग
                  </div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    {currentUser?.schoolName || slug}
                  </h3>
                </div>
                <p className="text-[9px] text-white/90 tracking-wider uppercase font-semibold">
                  Affiliated to CBSE / State Board • Session 2026-27
                </p>
                <div className={`text-[10px] font-bold text-white py-0.5 mt-1 rounded uppercase tracking-widest ${
                  idCardConfig.themeColor === "emerald"
                    ? "bg-emerald-700"
                    : idCardConfig.themeColor === "burgundy"
                    ? "bg-rose-950"
                    : "bg-blue-800"
                }`}>
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

      {studentImportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setStudentImportModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-950 flex items-center gap-2">
                  <span>📥</span> Bulk Import Students from Excel / CSV
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Upload your school's student roster spreadsheet. Download our sample template for standard columns.
                </p>
              </div>
              <button
                onClick={() => setStudentImportModalOpen(false)}
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Template Download & File Upload Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between space-y-3 shadow-2xs">
                <div>
                  <span className="text-[11px] text-emerald-900 uppercase font-black tracking-wider block mb-1">
                    Step 1: Download Standard Format
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    Get the pre-formatted Excel template with sample student records, admission numbers, and grade columns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadStudentTemplate}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <span>⬇️</span> Download Student_Template.xlsx
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between space-y-3 shadow-2xs">
                <div>
                  <span className="text-[11px] text-blue-900 uppercase font-black tracking-wider block mb-1">
                    Step 2: Choose Excel / CSV File
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    Supports <span className="font-mono text-blue-800 font-bold">.xlsx</span>, <span className="font-mono text-blue-800 font-bold">.xls</span>, and <span className="font-mono text-blue-800 font-bold">.csv</span>.
                  </p>
                </div>
                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition">
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
                className={`p-4 rounded-2xl border text-xs shadow-2xs ${
                  studentImportResult.skippedCount > 0
                    ? "bg-amber-50 border-amber-300 text-amber-950"
                    : "bg-emerald-50 border-emerald-300 text-emerald-950"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">
                    {studentImportResult.message}
                  </span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-300">
                    +{studentImportResult.importedCount} Imported
                  </span>
                </div>
                {studentImportResult.errors?.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    <span className="font-bold text-[11px] block text-amber-900">Skipped Rows:</span>
                    {studentImportResult.errors.map((err: any, i: number) => (
                      <div key={i} className="text-[11px] text-amber-900 font-medium">
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
                  <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                    <span>🔍</span> Spreadsheet Live Data Preview ({studentImportRows.length} rows detected)
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold font-mono">
                      ✓ {studentImportRows.filter((r) => r.isValid).length} Valid
                    </span>
                    {studentImportRows.some((r) => !r.isValid) && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold font-mono">
                        ✕ {studentImportRows.filter((r) => !r.isValid).length} Invalid
                      </span>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200 font-bold text-[11px] uppercase tracking-wider">
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
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {studentImportRows.map((r) => (
                        <tr
                          key={r.rowNum}
                          className={r.isValid ? "hover:bg-slate-50 transition" : "bg-rose-50/50 hover:bg-rose-50 transition"}
                        >
                          <td className="p-2.5 text-slate-500">{r.rowNum}</td>
                          <td className="p-2.5">
                            {r.isValid ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                READY
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                ERROR
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-blue-800 font-bold font-mono">{r.admissionNumber || "—"}</td>
                          <td className="p-2.5 text-slate-950 font-bold">
                            {r.firstName} {r.lastName}
                          </td>
                          <td className="p-2.5 text-slate-800 font-medium">
                            {r.classGradeName} - {r.sectionName}
                          </td>
                          <td className="p-2.5 text-slate-700 font-mono">{r.rollNumber || "—"}</td>
                          <td className="p-2.5 text-slate-700 font-mono">{r.parentPhone || "—"}</td>
                          <td className="p-2.5 text-[11px] text-rose-700 font-bold">{r.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-[11px] text-slate-600 font-medium">
                Default portal login password for students is <code className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">student123</code>.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudentImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={studentImportLoading || studentImportRows.filter((r) => r.isValid).length === 0}
                  onClick={handleExecuteStudentImport}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
                >
                  {studentImportLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

      {templateCustomizerModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setTemplateCustomizerModal(null)}
        >
          <div
            className="max-w-5xl w-full bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                  <span>⚙️</span>
                  {templateCustomizerModal === "id_card"
                    ? "Student ID Card Look & Feel Designer"
                    : "CBSE Report Card Look & Feel Designer"}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Configure colors, badges, signatures, and see live printable previews update in real time.
                </p>
              </div>
              <button
                onClick={() => setTemplateCustomizerModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {templateCustomizerModal === "id_card" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Controls Column (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Theme Color Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Color Palette / Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "blue", name: "Royal Blue", bg: "bg-blue-600", border: "border-blue-600" },
                        { id: "emerald", name: "Emerald Green", bg: "bg-emerald-600", border: "border-emerald-600" },
                        { id: "burgundy", name: "Imperial Burgundy", bg: "bg-rose-900", border: "border-rose-900" },
                      ].map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setIdCardConfig((prev) => ({ ...prev, themeColor: th.id }))}
                          className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition ${
                            idCardConfig.themeColor === th.id
                              ? `${th.border} bg-slate-50 font-black shadow-xs`
                              : "border-slate-200 hover:border-slate-300 font-bold"
                          }`}
                        >
                          <span className={`h-4 w-4 rounded-full ${th.bg} shadow-xs shrink-0`}></span>
                          <span className="text-xs text-slate-900 truncate">{th.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Switches */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Badges & Student Details to Display
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { key: "showSchoolLogo", label: "School Emblem / Logo", icon: "🏛️" },
                        { key: "showFatherName", label: "Father's Name", icon: "👨‍👦" },
                        { key: "showBloodGroup", label: "Blood Group Badge", icon: "🩸" },
                        { key: "showParentPhone", label: "Emergency / Parent Phone", icon: "📞" },
                        { key: "showAddress", label: "Village / Residential Address", icon: "📍" },
                        { key: "showBarcode", label: "ID Barcode / QR Code", icon: "🏷️" },
                        { key: "showPrincipalSignature", label: "Principal Stamp & Signature", icon: "✍️" },
                      ].map((opt) => (
                        <label
                          key={opt.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition"
                        >
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span>{opt.icon}</span>
                            <span className="text-[11px]">{opt.label}</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={Boolean((idCardConfig as any)[opt.key])}
                            onChange={(e) =>
                              setIdCardConfig((prev) => ({ ...prev, [opt.key]: e.target.checked }))
                            }
                            className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview Column (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center sticky top-0 shadow-2xs">
                  <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <span>👁️</span> Live Card Preview
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      Standard PVC
                    </span>
                  </div>

                  {/* Rendered Live Card */}
                  <div
                    className={`w-full max-w-[280px] border-2 rounded-2xl overflow-hidden bg-white text-slate-900 shadow-md ${
                      idCardConfig.themeColor === "emerald"
                        ? "border-emerald-600"
                        : idCardConfig.themeColor === "burgundy"
                        ? "border-rose-900"
                        : "border-blue-700"
                    }`}
                  >
                    {/* Header */}
                    <div
                      className={`text-white p-3 text-center ${
                        idCardConfig.themeColor === "emerald"
                          ? "bg-emerald-600"
                          : idCardConfig.themeColor === "burgundy"
                          ? "bg-rose-900"
                          : "bg-blue-700"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-0.5">
                        {idCardConfig.showSchoolLogo && (
                          <div className="h-6 w-6 rounded bg-white overflow-hidden flex items-center justify-center shrink-0 shadow p-0.5">
                            {(landingConfig?.logoUrl || currentUser?.logoUrl) ? (
                              <img
                                src={landingConfig?.logoUrl || currentUser?.logoUrl}
                                alt="Logo"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="font-black text-xs text-blue-700">ग</span>
                            )}
                          </div>
                        )}
                        <h4 className="font-extrabold text-xs uppercase tracking-wide truncate max-w-[190px]">
                          {currentUser?.schoolName || slug}
                        </h4>
                      </div>
                      <p className="text-[8px] text-white/90 uppercase tracking-wider font-semibold">
                        Session 2026-27 • Identity Card
                      </p>
                      <div
                        className={`text-[9px] font-bold text-white py-0.5 mt-1 rounded uppercase tracking-wider ${
                          idCardConfig.themeColor === "emerald"
                            ? "bg-emerald-700"
                            : idCardConfig.themeColor === "burgundy"
                            ? "bg-rose-950"
                            : "bg-blue-800"
                        }`}
                      >
                        Student ID / छात्र पहचान पत्र
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-3 space-y-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-14 w-14 rounded-xl bg-slate-100 border-2 border-slate-300 overflow-hidden flex items-center justify-center shrink-0 font-black text-lg text-slate-400">
                          A
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-black text-xs text-slate-950 truncate leading-tight">
                            Aarav Sharma
                          </h5>
                          <p className="text-[10px] font-bold text-blue-700 font-mono mt-0.5">
                            Adm: ADM-2026-1001
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[9px] border border-slate-200">
                              Class 6 - A
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[9px] border border-slate-200">
                              Roll: 1
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-[10px] border-t border-slate-100 pt-1.5">
                        {idCardConfig.showFatherName && (
                          <div className="flex justify-between text-slate-600">
                            <span className="font-semibold">Father:</span>
                            <span className="font-bold text-slate-900">Ramesh Sharma</span>
                          </div>
                        )}
                        {idCardConfig.showBloodGroup && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="font-semibold">Blood Group:</span>
                            <span className="font-bold px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200 text-[9px]">
                              B+
                            </span>
                          </div>
                        )}
                        {idCardConfig.showParentPhone && (
                          <div className="flex justify-between text-slate-600">
                            <span className="font-semibold">Emergency:</span>
                            <span className="font-mono font-bold text-slate-900">+91 98261 11001</span>
                          </div>
                        )}
                        {idCardConfig.showAddress && (
                          <div className="text-slate-600 pt-0.5">
                            <span className="font-semibold block text-[9px]">Address:</span>
                            <span className="font-medium text-slate-800 line-clamp-1 text-[9px]">
                              Village Hatod, Dist Indore, MP
                            </span>
                          </div>
                        )}
                      </div>

                      {idCardConfig.showBarcode && (
                        <div className="pt-1 flex flex-col items-center justify-center border-t border-slate-100">
                          <div className="font-mono text-[7px] tracking-widest text-slate-400 uppercase">
                            ||||| | |||| || |||||| | |||||
                          </div>
                          <span className="text-[7px] font-mono text-slate-500">ADM-2026-1001</span>
                        </div>
                      )}

                      {idCardConfig.showPrincipalSignature && (
                        <div className="pt-2 flex justify-between items-end border-t border-slate-100">
                          <div className="text-[8px] text-slate-400">Issued: 2026-04</div>
                          <div className="text-center">
                            <div className="h-3 border-b border-slate-400 w-14 mb-0.5"></div>
                            <span className="text-[8px] font-bold text-slate-700">Principal</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Controls Column (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Theme Color Selector for Report Card */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Color Palette / Academic Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "blue", name: "CBSE Blue", bg: "bg-blue-700", border: "border-blue-700" },
                        { id: "emerald", name: "Forest Green", bg: "bg-emerald-700", border: "border-emerald-700" },
                        { id: "burgundy", name: "Heritage Burgundy", bg: "bg-rose-900", border: "border-rose-900" },
                      ].map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setReportCardConfig((prev) => ({ ...prev, themeColor: th.id }))}
                          className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition ${
                            reportCardConfig.themeColor === th.id
                              ? `${th.border} bg-slate-50 font-black shadow-xs`
                              : "border-slate-200 hover:border-slate-300 font-bold"
                          }`}
                        >
                          <span className={`h-4 w-4 rounded-full ${th.bg} shadow-xs shrink-0`}></span>
                          <span className="text-xs text-slate-900 truncate">{th.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Switches for Report Card */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Report Card Sections & Signatures
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { key: "showSchoolHeader", label: "Official School Header & Emblem", icon: "🏛️" },
                        { key: "showAffiliationNo", label: "CBSE Affiliation & School Code", icon: "📜" },
                        { key: "showStudentPhoto", label: "Student Avatar / Photo", icon: "👤" },
                        { key: "showAttendanceStats", label: "Session Attendance Stats", icon: "📊" },
                        { key: "showTeacherRemarks", label: "Class Teacher Remarks", icon: "💬" },
                        { key: "showGradingScale", label: "CBSE 8-Point Grading Key", icon: "📐" },
                        { key: "showClassTeacherSignature", label: "Class Teacher Signature Line", icon: "✍️" },
                        { key: "showPrincipalSignature", label: "Principal & Controller Stamp", icon: "🖋️" },
                      ].map((opt) => (
                        <label
                          key={opt.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition"
                        >
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span>{opt.icon}</span>
                            <span className="text-[11px]">{opt.label}</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={Boolean((reportCardConfig as any)[opt.key])}
                            onChange={(e) =>
                              setReportCardConfig((prev) => ({ ...prev, [opt.key]: e.target.checked }))
                            }
                            className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview Column (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center sticky top-0 shadow-2xs">
                  <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <span>👁️</span> Live Report Card Preview
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      CBSE A4 Format
                    </span>
                  </div>

                  {/* Rendered Live Report Card Miniature */}
                  <div
                    className={`w-full max-w-[320px] border-2 rounded-2xl overflow-hidden bg-white text-slate-900 shadow-md ${
                      reportCardConfig.themeColor === "emerald"
                        ? "border-emerald-600"
                        : reportCardConfig.themeColor === "burgundy"
                        ? "border-rose-900"
                        : "border-blue-700"
                    }`}
                  >
                    {/* Header */}
                    {reportCardConfig.showSchoolHeader && (
                      <div
                        className={`text-white p-3 text-center ${
                          reportCardConfig.themeColor === "emerald"
                            ? "bg-emerald-700"
                            : reportCardConfig.themeColor === "burgundy"
                            ? "bg-rose-900"
                            : "bg-blue-700"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-6 w-6 rounded bg-white overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                            {(landingConfig?.logoUrl || currentUser?.logoUrl) ? (
                              <img
                                src={landingConfig?.logoUrl || currentUser?.logoUrl}
                                alt="Logo"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="font-black text-xs text-blue-700">ग</span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wide truncate max-w-[210px]">
                            {currentUser?.schoolName || slug}
                          </h4>
                        </div>
                        {reportCardConfig.showAffiliationNo && (
                          <p className="text-[8px] text-white/90 font-mono mt-0.5">
                            CBSE Affiliation No: 1030492 • School Code: 50412
                          </p>
                        )}
                        <div className="text-[9px] font-bold text-white bg-black/20 py-0.5 mt-1 rounded uppercase tracking-wider">
                          Academic Progress Report • Session 2026-27
                        </div>
                      </div>
                    )}

                    {/* Student Mini Meta */}
                    <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[10px]">
                      <div>
                        <span className="font-black text-slate-950 block">Aarav Sharma</span>
                        <span className="text-slate-600">Class 6-A • Roll: 01</span>
                      </div>
                      {reportCardConfig.showStudentPhoto && (
                        <div className="h-8 w-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-400 text-xs">
                          👤
                        </div>
                      )}
                    </div>

                    {/* Mini Marks Table */}
                    <div className="p-2.5 space-y-2">
                      <table className="w-full text-left text-[9px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold">
                            <th className="pb-1">Subject</th>
                            <th className="pb-1 text-center">Marks</th>
                            <th className="pb-1 text-right">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          <tr>
                            <td className="py-1 font-semibold text-slate-900">English</td>
                            <td className="py-1 text-center">88 / 100</td>
                            <td className="py-1 text-right font-bold text-emerald-700">A1</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold text-slate-900">Hindi</td>
                            <td className="py-1 text-center">91 / 100</td>
                            <td className="py-1 text-right font-bold text-emerald-700">A1</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold text-slate-900">Mathematics</td>
                            <td className="py-1 text-center">85 / 100</td>
                            <td className="py-1 text-right font-bold text-emerald-700">A2</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold text-slate-900">Science</td>
                            <td className="py-1 text-center">89 / 100</td>
                            <td className="py-1 text-right font-bold text-emerald-700">A1</td>
                          </tr>
                        </tbody>
                      </table>

                      {reportCardConfig.showAttendanceStats && (
                        <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between text-[9px] text-blue-900 font-medium">
                          <span>Attendance:</span>
                          <span className="font-bold">198 / 210 Days (94.2%)</span>
                        </div>
                      )}

                      {reportCardConfig.showTeacherRemarks && (
                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[8px] text-slate-600">
                          <span className="font-bold text-slate-800 block">Class Teacher Remarks:</span>
                          "Consistent academic performance and active leadership."
                        </div>
                      )}

                      {reportCardConfig.showGradingScale && (
                        <div className="text-[7px] text-slate-500 font-mono text-center pt-0.5">
                          A1 (91-100) • A2 (81-90) • B1 (71-80) • B2 (61-70)
                        </div>
                      )}

                      {/* Signatures */}
                      <div className="flex justify-between items-end pt-2 border-t border-slate-200 text-[8px]">
                        {reportCardConfig.showClassTeacherSignature && (
                          <div className="text-center">
                            <div className="h-3 border-b border-slate-400 w-16 mb-0.5"></div>
                            <span className="font-bold text-slate-700">Class Teacher</span>
                          </div>
                        )}
                        {reportCardConfig.showPrincipalSignature && (
                          <div className="text-center">
                            <div className="h-3 border-b border-slate-400 w-16 mb-0.5"></div>
                            <span className="font-bold text-slate-700">Principal</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (templateCustomizerModal === "id_card") {
                    localStorage.setItem("gkp_id_card_config", JSON.stringify(idCardConfig));
                  } else {
                    localStorage.setItem("gkp_report_card_config", JSON.stringify(reportCardConfig));
                  }
                  setMsg({
                    type: "success",
                    text: `${templateCustomizerModal === "id_card" ? "Student ID Card" : "Report Card"} look & feel settings updated successfully!`,
                  });
                  setTemplateCustomizerModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-2 cursor-pointer"
              >
                <span>✓</span> Save & Apply Look & Feel
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkPrintIdCardsStudents && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-start p-4 overflow-y-auto print:fixed print:inset-0 print:z-[9999] print:bg-white print:p-0 print:overflow-visible print:block"
          onClick={() => setBulkPrintIdCardsStudents(null)}
        >
          <div
            className="max-w-5xl w-full bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 print:p-0 print:border-none print:shadow-none print:m-0 print:max-w-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <div>
                <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                  <span>🖨️</span> Bulk Student Identity Cards Batch ({bulkPrintIdCardsStudents.length})
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Format: High-resolution CBSE Student ID Cards ready for PVC / A4 sheet batch printing.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => setTemplateCustomizerModal("id_card")}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>⚙️</span> Look & Feel
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print All ID Cards / PDF
                </button>
                <button
                  onClick={() => setBulkPrintIdCardsStudents(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Grid of Student ID Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
              {bulkPrintIdCardsStudents.map((st: any) => {
                const theme = idCardConfig.themeColor || "blue";
                const borderClass =
                  theme === "emerald"
                    ? "border-emerald-600"
                    : theme === "burgundy"
                    ? "border-rose-900"
                    : "border-blue-700";
                const headerBg =
                  theme === "emerald"
                    ? "bg-emerald-600"
                    : theme === "burgundy"
                    ? "bg-rose-900"
                    : "bg-blue-700";
                const subHeaderBg =
                  theme === "emerald"
                    ? "bg-emerald-700"
                    : theme === "burgundy"
                    ? "bg-rose-950"
                    : "bg-blue-800";
                const logoText =
                  theme === "emerald"
                    ? "text-emerald-700"
                    : theme === "burgundy"
                    ? "text-rose-900"
                    : "text-blue-700";

                const currentEnrollment = st.enrollments?.[0];
                const classNameStr = currentEnrollment?.section?.classGrade?.name || currentEnrollment?.classGradeName || "Class 6";
                const sectionNameStr = currentEnrollment?.section?.name || currentEnrollment?.sectionName || "A";

                return (
                  <div
                    key={st.id}
                    className={`border-2 rounded-2xl overflow-hidden bg-white text-slate-900 shadow-sm print:shadow-none print:break-inside-avoid ${borderClass}`}
                  >
                    {/* Card Header */}
                    <div className={`text-white p-3 text-center ${headerBg}`}>
                      <div className="flex items-center justify-center gap-2 mb-0.5">
                        {idCardConfig.showSchoolLogo && (
                          <div className={`h-6 w-6 rounded bg-white font-black flex items-center justify-center text-xs shadow ${logoText}`}>
                            ग
                          </div>
                        )}
                        <h4 className="font-extrabold text-xs uppercase tracking-wide truncate max-w-[200px]">
                          {currentUser?.schoolName || slug}
                        </h4>
                      </div>
                      <p className="text-[8px] text-white/90 uppercase tracking-wider font-semibold">
                        Session 2026-27 • Identity Card
                      </p>
                      <div className={`text-[9px] font-bold text-white py-0.5 mt-1 rounded uppercase tracking-wider ${subHeaderBg}`}>
                        Student ID / छात्र पहचान पत्र
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-xl bg-slate-100 border-2 border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                          {st.avatarUrl ? (
                            <img src={st.avatarUrl} alt={st.firstName} className="h-full w-full object-cover" />
                          ) : (
                            <span className="font-black text-xl text-slate-400">
                              {st.firstName?.charAt(0) || "S"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-black text-sm text-slate-950 truncate leading-tight">
                            {st.firstName} {st.lastName}
                          </h5>
                          <p className="text-[10px] font-bold text-blue-700 font-mono mt-0.5">
                            Adm: {st.admissionNumber}
                          </p>
                          <p className="text-[10px] font-bold text-slate-800">
                            {classNameStr} - Section {sectionNameStr} {currentEnrollment?.rollNumber ? `• Roll #${currentEnrollment.rollNumber}` : ""}
                          </p>
                          {idCardConfig.showBloodGroup && st.bloodGroup && (
                            <span className="inline-block px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-extrabold font-mono mt-0.5">
                              🩸 {st.bloodGroup}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5 text-[10px] pt-1 border-t border-slate-200">
                        {idCardConfig.showFatherName && st.fatherName && (
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500 font-semibold">Father:</span>
                            <span className="font-bold text-slate-900 truncate max-w-[140px]">{st.fatherName}</span>
                          </div>
                        )}
                        {idCardConfig.showParentPhone && (st.parentPhone || st.user?.phone) && (
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500 font-semibold">Mobile:</span>
                            <span className="font-mono font-bold text-slate-900">{st.parentPhone || st.user?.phone}</span>
                          </div>
                        )}
                        {idCardConfig.showAddress && (st.villageCity || st.addressText) && (
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500 font-semibold">Address:</span>
                            <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                              {st.villageCity || st.addressText}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer Signature */}
                      <div className="pt-2 flex items-end justify-between border-t border-slate-100 text-[9px]">
                        {idCardConfig.showBarcode && (
                          <div className="font-mono text-[8px] text-slate-400 tracking-tighter">
                            ||||| |||| | ||| |||||| {st.admissionNumber}
                          </div>
                        )}
                        {idCardConfig.showPrincipalSignature && (
                          <div className="text-center font-bold text-slate-600 border-t border-slate-400 pt-0.5 px-2">
                            Principal Sign
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {promoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <h3 className="text-lg font-black tracking-tight">Academic Session Student Promotion</h3>
                </div>
                <p className="text-xs text-purple-100 mt-0.5">
                  Roll over enrolled students to the next class grade, section, and academic year
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPromoteModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecutePromotion} className="p-6 space-y-5">
              {/* Step 1: Source Class & Academic Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Source Class (Current Grade)
                  </label>
                  <select
                    value={promoteSourceClass}
                    onChange={(e) => handleSourceClassChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">— Select Source Class —</option>
                    {classesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.studentCount} Students)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Academic Session
                  </label>
                  <input
                    type="text"
                    value={promoteTargetYear}
                    onChange={(e) => setPromoteTargetYear(e.target.value)}
                    placeholder="e.g. 2027-2028"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Graduation / Alumni Toggle */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex items-center justify-between">
                <div className="pr-4">
                  <span className="text-xs font-bold text-purple-950 block">Graduation / Alumni Status</span>
                  <span className="text-[11px] text-purple-700 block">
                    Mark outgoing senior students (e.g. Class 10/12) as graduated alumni instead of moving to a higher grade
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={promoteIsGraduation}
                  onChange={(e) => setPromoteIsGraduation(e.target.checked)}
                  className="h-5 w-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Target Class & Target Section (if not graduating) */}
              {!promoteIsGraduation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Promote To Class / Grade *
                    </label>
                    <input
                      type="text"
                      value={promoteTargetClass}
                      onChange={(e) => setPromoteTargetClass(e.target.value)}
                      placeholder="e.g. Class 7"
                      required={!promoteIsGraduation}
                      list="classes-autocomplete"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <datalist id="classes-autocomplete">
                      {classesList.map((c) => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Target Section *
                    </label>
                    <input
                      type="text"
                      value={promoteTargetSection}
                      onChange={(e) => setPromoteTargetSection(e.target.value)}
                      placeholder="e.g. A"
                      required={!promoteIsGraduation}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Students Selection Roster */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Select Students to Promote ({promoteSelectedStudentIds.length} of{" "}
                    {
                      studentList.filter((s) => {
                        const clsName = s.enrollments?.[0]?.section?.classGrade?.name;
                        return clsName && promoteSourceClass
                          ? clsName.trim().toLowerCase() === promoteSourceClass.trim().toLowerCase()
                          : false;
                      }).length
                    }{" "}
                    selected)
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleSelectAllPromote}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 underline"
                  >
                    Toggle Select All
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
                  {(() => {
                    const filtered = studentList.filter((s) => {
                      const clsName = s.enrollments?.[0]?.section?.classGrade?.name;
                      return clsName && promoteSourceClass
                        ? clsName.trim().toLowerCase() === promoteSourceClass.trim().toLowerCase()
                        : false;
                    });

                    if (!promoteSourceClass) {
                      return (
                        <div className="p-6 text-center text-xs text-slate-500 font-medium">
                          Please select a source class above to load student roster.
                        </div>
                      );
                    }

                    if (filtered.length === 0) {
                      return (
                        <div className="p-6 text-center text-xs text-slate-500 font-medium">
                          No students currently enrolled in {promoteSourceClass}.
                        </div>
                      );
                    }

                    return filtered.map((s) => {
                      const isSelected = promoteSelectedStudentIds.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className={`flex items-center justify-between p-3 cursor-pointer transition ${
                            isSelected ? "bg-purple-50/50" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleStudentPromote(s.id)}
                              className="h-4 w-4 accent-purple-600 rounded cursor-pointer"
                            />
                            <div>
                              <span className="font-bold text-xs text-slate-900">
                                {s.firstName} {s.lastName}
                              </span>
                              <span className="text-[11px] text-slate-500 ml-2 font-mono">
                                (Adm #{s.admissionNumber || "N/A"} • Roll {s.enrollments?.[0]?.rollNumber || "—"})
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 px-2 py-0.5 rounded-md bg-slate-100">
                            Sec {s.enrollments?.[0]?.section?.name || "A"}
                          </span>
                        </label>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPromoteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={promotingStudents || promoteSelectedStudentIds.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {promotingStudents ? (
                    <>
                      <span className="animate-spin inline-block">⏳</span> Promoting...
                    </>
                  ) : (
                    <>
                      <span>⚡</span> Confirm & Promote ({promoteSelectedStudentIds.length} Students)
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
