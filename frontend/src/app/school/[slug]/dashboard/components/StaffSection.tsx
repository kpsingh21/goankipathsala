"use client";

import React from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { API_BASE } from "@/lib/config";

export interface StaffSectionProps {
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
  staffSubTab?: any;
  setStaffSubTab?: React.Dispatch<React.SetStateAction<any>>;
  classesList?: any[];
  staffImportModalOpen?: any;
  setStaffImportModalOpen?: React.Dispatch<React.SetStateAction<any>>;
  staffImportRows?: any[];
  setStaffImportRows?: React.Dispatch<React.SetStateAction<any[]>>;
  staffImportLoading?: any;
  staffImportResult?: any;
  setStaffImportResult?: React.Dispatch<React.SetStateAction<any>>;
  staffImportFileName?: any;
  setStaffImportFileName?: React.Dispatch<React.SetStateAction<any>>;
  staffList?: any[];
  staffSearch?: any;
  setStaffSearch?: React.Dispatch<React.SetStateAction<any>>;
  staffFilterRole?: any;
  setStaffFilterRole?: React.Dispatch<React.SetStateAction<any>>;
  staffFilterDept?: any;
  setStaffFilterDept?: React.Dispatch<React.SetStateAction<any>>;
  staffCategoryTab?: any;
  setStaffCategoryTab?: React.Dispatch<React.SetStateAction<any>>;
  newStaffEmployeeNo?: any;
  setNewStaffEmployeeNo?: React.Dispatch<React.SetStateAction<any>>;
  newStaffFullName?: any;
  setNewStaffFullName?: React.Dispatch<React.SetStateAction<any>>;
  newStaffEmail?: any;
  setNewStaffEmail?: React.Dispatch<React.SetStateAction<any>>;
  newStaffPhone?: any;
  setNewStaffPhone?: React.Dispatch<React.SetStateAction<any>>;
  newStaffPassword?: any;
  setNewStaffPassword?: React.Dispatch<React.SetStateAction<any>>;
  newStaffRole?: any;
  setNewStaffRole?: React.Dispatch<React.SetStateAction<any>>;
  newStaffDesignation?: any;
  setNewStaffDesignation?: React.Dispatch<React.SetStateAction<any>>;
  newStaffQualification?: any;
  setNewStaffQualification?: React.Dispatch<React.SetStateAction<any>>;
  newStaffDepartment?: any;
  setNewStaffDepartment?: React.Dispatch<React.SetStateAction<any>>;
  newStaffAvatarUrl?: any;
  setNewStaffAvatarUrl?: React.Dispatch<React.SetStateAction<any>>;
  newStaffSectionId?: any;
  setNewStaffSectionId?: React.Dispatch<React.SetStateAction<any>>;
  newStaffClassFilter?: any;
  setNewStaffClassFilter?: React.Dispatch<React.SetStateAction<any>>;
  newStaffSubjectIds?: any[];
  setNewStaffSubjectIds?: React.Dispatch<React.SetStateAction<any[]>>;
  newStaffBusRouteId?: any;
  setNewStaffBusRouteId?: React.Dispatch<React.SetStateAction<any>>;
  aadharNumber?: any;
  className?: any;
  subjectsList?: any[];
  allSchoolSubjects?: any[];
  subjectClassGrade?: any;
  busRoutesList?: any[];
  staffAadharDoc?: any;
  setStaffAadharDoc?: React.Dispatch<React.SetStateAction<any>>;
  staffDegreeDoc?: any;
  setStaffDegreeDoc?: React.Dispatch<React.SetStateAction<any>>;
  staffResumeDoc?: any;
  setStaffResumeDoc?: React.Dispatch<React.SetStateAction<any>>;
  staffExpDoc?: any;
  setStaffExpDoc?: React.Dispatch<React.SetStateAction<any>>;
  resetModalUser?: any;
  setResetModalUser?: React.Dispatch<React.SetStateAction<any>>;
  overridePassword?: any;
  setOverridePassword?: React.Dispatch<React.SetStateAction<any>>;
  profileModalStaff?: any;
  setProfileModalStaff?: React.Dispatch<React.SetStateAction<any>>;
  assignModalStaff?: any;
  setAssignModalStaff?: React.Dispatch<React.SetStateAction<any>>;
  assignRole?: any;
  setAssignRole?: React.Dispatch<React.SetStateAction<any>>;
  assignSectionId?: any;
  setAssignSectionId?: React.Dispatch<React.SetStateAction<any>>;
  assignClassFilter?: any;
  setAssignClassFilter?: React.Dispatch<React.SetStateAction<any>>;
  assignSubjectIds?: any[];
  setAssignSubjectIds?: React.Dispatch<React.SetStateAction<any[]>>;
  assignBusRouteId?: any;
  setAssignBusRouteId?: React.Dispatch<React.SetStateAction<any>>;
  editSalaryStructureStaff?: any;
  setEditSalaryStructureStaff?: React.Dispatch<React.SetStateAction<any>>;
  editStructureForm?: any;
  setEditStructureForm?: React.Dispatch<React.SetStateAction<any>>;
  roleDropdownOpen?: any;
  setRoleDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveSalaryStructure?: any;
  uploadDesktopFile?: (e: any, cb: (url: string) => void) => void;
  handleOpenAssignModal?: any;
  handleSaveStaffAssignments?: any;
  handleExportStaff?: any;
  handleCreateStaff?: any;
  handleDeleteStaff?: any;
  handleToggleStaffRole?: any;
  handleAdminResetPassword?: any;
  handleDownloadStaffTemplate?: any;
  handleStaffExcelUpload?: any;
  handleExecuteStaffImport?: any;
  [key: string]: any;
}

export default function StaffSection(props: StaffSectionProps) {
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
    staffSubTab,
    setStaffSubTab = () => {},
    classesList = [],
    staffImportModalOpen,
    setStaffImportModalOpen = () => {},
    staffImportRows = [],
    setStaffImportRows = () => {},
    staffImportLoading,
    staffImportResult,
    setStaffImportResult = () => {},
    staffImportFileName,
    setStaffImportFileName = () => {},
    staffList = [],
    staffSearch,
    setStaffSearch = () => {},
    staffFilterRole,
    setStaffFilterRole = () => {},
    staffFilterDept,
    setStaffFilterDept = () => {},
    staffCategoryTab,
    setStaffCategoryTab = () => {},
    newStaffEmployeeNo,
    setNewStaffEmployeeNo = () => {},
    newStaffFullName,
    setNewStaffFullName = () => {},
    newStaffEmail,
    setNewStaffEmail = () => {},
    newStaffPhone,
    setNewStaffPhone = () => {},
    newStaffPassword,
    setNewStaffPassword = () => {},
    newStaffRole,
    setNewStaffRole = () => {},
    newStaffDesignation,
    setNewStaffDesignation = () => {},
    newStaffQualification,
    setNewStaffQualification = () => {},
    newStaffDepartment,
    setNewStaffDepartment = () => {},
    newStaffAvatarUrl,
    setNewStaffAvatarUrl = () => {},
    newStaffSectionId,
    setNewStaffSectionId = () => {},
    newStaffClassFilter,
    setNewStaffClassFilter = () => {},
    newStaffSubjectIds = [],
    setNewStaffSubjectIds = () => {},
    newStaffBusRouteId,
    setNewStaffBusRouteId = () => {},
    aadharNumber,
    className,
    subjectsList = [],
    allSchoolSubjects = [],
    subjectClassGrade,
    busRoutesList = [],
    staffAadharDoc,
    setStaffAadharDoc = () => {},
    staffDegreeDoc,
    setStaffDegreeDoc = () => {},
    staffResumeDoc,
    setStaffResumeDoc = () => {},
    staffExpDoc,
    setStaffExpDoc = () => {},
    resetModalUser,
    setResetModalUser = () => {},
    overridePassword,
    setOverridePassword = () => {},
    profileModalStaff,
    setProfileModalStaff = () => {},
    assignModalStaff,
    setAssignModalStaff = () => {},
    assignRole,
    setAssignRole = () => {},
    assignSectionId,
    setAssignSectionId = () => {},
    assignClassFilter,
    setAssignClassFilter = () => {},
    assignSubjectIds = [],
    setAssignSubjectIds = () => {},
    assignBusRouteId,
    setAssignBusRouteId = () => {},
    editSalaryStructureStaff,
    setEditSalaryStructureStaff = () => {},
    editStructureForm,
    setEditStructureForm = () => {},
    roleDropdownOpen,
    setRoleDropdownOpen = () => {},
    handleSaveSalaryStructure = () => {},
    uploadDesktopFile = () => {},
    handleOpenAssignModal = () => {},
    handleSaveStaffAssignments = () => {},
    handleExportStaff = () => {},
    handleCreateStaff = () => {},
    handleDeleteStaff = () => {},
    handleToggleStaffRole = () => {},
    handleAdminResetPassword = () => {},
    handleDownloadStaffTemplate = () => {},
    handleStaffExcelUpload = () => {},
    handleExecuteStaffImport = () => {},
  } = props;

  return (
    <>
      {activeSection === "staff" && isAdmin && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>👥</span> School Staff & Faculty
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
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
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 shadow-md shadow-amber-950"
                >
                  <span>📥</span>
                  <span>Import Faculty via Excel</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportStaff}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 flex items-center gap-1.5 shadow-2xs"
                  title="Export staff roster to Excel spreadsheet"
                >
                  <span>📤</span>
                  <span>Export Staff Excel</span>
                </button>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                  <button
                    onClick={() => setStaffSubTab("list")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      staffSubTab === "list"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    👥 Staff Directory ({staffList.length})
                  </button>
                  <button
                    onClick={() => setStaffSubTab("create")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      staffSubTab === "create"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
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
                {/* Category Sub-Tabs: All vs Teaching vs Administrative & Support Staff */}
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setStaffCategoryTab("ALL")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      staffCategoryTab === "ALL"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    👥 All Staff & Faculty ({staffList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffCategoryTab("TEACHING")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      staffCategoryTab === "TEACHING"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    👨‍🏫 Teaching Faculty ({staffList.filter((s) => ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL"].includes(s.role)).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffCategoryTab("NON_TEACHING")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      staffCategoryTab === "NON_TEACHING"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    💼 Administrative & Support Staff ({staffList.filter((s) => !["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL"].includes(s.role)).length})
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      🔍 Search Name, Email, Mobile
                    </label>
                    <input
                      type="text"
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      placeholder="e.g. Suresh or @school.edu..."
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Filter by Role
                    </label>
                    <select
                      value={staffFilterRole}
                      onChange={(e) => setStaffFilterRole(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                    >
                      <option value="ALL">All Roles ({staffList.length})</option>
                      <option value="PRINCIPAL">👑 Principal / Headmaster</option>
                      <option value="SCHOOL_ADMIN">🛡️ School Admin</option>
                      <option value="CLASS_TEACHER">🏛️ Class Teacher</option>
                      <option value="SUBJECT_TEACHER">📚 Subject Teacher</option>
                      <option value="ACCOUNTANT">💳 Accountant / Cashier</option>
                      <option value="DRIVER">🚌 Bus Driver</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Filter by Department
                    </label>
                    <select
                      value={staffFilterDept}
                      onChange={(e) => setStaffFilterDept(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
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

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto overscroll-x-contain touch-auto">
                    <table className="w-full min-w-[650px] text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Staff Member</th>
                          <th className="p-3.5">Designation & Workload</th>
                          <th className="p-3.5">Contact Details</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStaff.map((m) => {
                          const prof = m.staffProfile || {};
                          return (
                            <tr key={m.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-3.5">
                                <button
                                  type="button"
                                  onClick={() => setProfileModalStaff(m)}
                                  className="flex items-center gap-3 text-left group cursor-pointer hover:opacity-90 transition"
                                  title="Click to view Staff Profile"
                                >
                                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-200 overflow-hidden flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0 shadow-2xs group-hover:bg-indigo-100">
                                    {prof.avatarUrl ? (
                                      <img src={prof.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      (prof.fullName || m.email || "S").charAt(0).toUpperCase()
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-950 text-sm group-hover:text-blue-700 group-hover:underline transition">
                                      {prof.fullName || m.email?.split("@")[0] || "Staff Member"}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium">{prof.qualification || "Faculty"}</p>
                                  </div>
                                </button>
                              </td>
                              <td className="p-3.5">
                                <p className="text-slate-900 font-semibold text-xs">{prof.designation || m.role}</p>
                                <div className="text-[10px] space-y-1 mt-1">
                                  {m.headedSections && m.headedSections.length > 0 && (
                                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold mr-1">
                                      🏛️ Class Teacher: {m.headedSections.map((s: any) => `${s.classGrade?.name || ''} - ${s.name}`).join(', ')}
                                    </span>
                                  )}
                                  {m.drivenBusRoutes && m.drivenBusRoutes.length > 0 && (
                                    <span className="inline-block px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 text-[10px] font-bold">
                                      🚌 Route: {m.drivenBusRoutes.map((r: any) => `${r.routeNumber} (${r.routeName})`).join(', ')}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5 font-mono text-xs">
                                <div className="font-semibold text-blue-700">{m.email}</div>
                                <div className="text-slate-600 mt-0.5">{m.phone || "—"}</div>
                              </td>
                              <td className="p-3.5">
                                {(() => {
                                  const rawDesignation = prof.designation || "";
                                  const hasRoles = rawDesignation.includes("TEACHER") || rawDesignation.includes("ACCOUNTANT") || rawDesignation.includes("SCHOOL_ADMIN");
                                  const rolesList: string[] = m.assignedRoles || (hasRoles ? rawDesignation.split(",").map((s: string) => s.trim()) : [m.role]);
                                  return (
                                    <div className="flex flex-wrap gap-1">
                                      {rolesList.map((r: string) => (
                                        <span
                                          key={r}
                                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            r === "SCHOOL_ADMIN" || r === "ADMIN"
                                              ? "bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200"
                                              : r === "ACCOUNTANT"
                                              ? "bg-blue-100 text-blue-900 border border-blue-200"
                                              : r === "TEACHER" || r === "CLASS_TEACHER" || r === "SUBJECT_TEACHER"
                                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                              : r === "PRINCIPAL"
                                              ? "bg-purple-100 text-purple-900 border border-purple-200"
                                              : r === "DRIVER"
                                              ? "bg-orange-100 text-orange-900 border border-orange-200"
                                              : "bg-slate-100 text-slate-800 border border-slate-200"
                                          }`}
                                        >
                                          {r}
                                        </span>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenAssignModal(m)}
                                  title="Assign Role, Headed Class & Subject Workload"
                                  className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition shadow-2xs inline-flex items-center justify-center text-xs"
                                >
                                  🎯
                                </button>
                                {m.id !== currentUser.id && (
                                  <>
                                    <button
                                      onClick={() => setResetModalUser(m)}
                                      title="Reset Password"
                                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition shadow-2xs inline-flex items-center justify-center text-xs"
                                    >
                                      🔑
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStaff(m.id, prof.fullName || m.email)}
                                      title="Delete Staff Member"
                                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-2xs inline-flex items-center justify-center text-xs"
                                    >
                                      🗑️
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
              <form onSubmit={handleCreateStaff} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Register Faculty / Staff Member & Assign Workload
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Employee ID (UID) *</label>
                      <button
                        type="button"
                        onClick={() => setNewStaffEmployeeNo(`EMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                        title="Generate New Unique Staff ID"
                      >
                        🔄 Auto
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newStaffEmployeeNo}
                      onChange={(e) => setNewStaffEmployeeNo(e.target.value)}
                      placeholder="EMP-2026-004"
                      className="w-full px-3 py-2 rounded-lg bg-blue-50/50 border border-blue-200 text-xs text-blue-900 font-bold font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStaffFullName}
                      onChange={(e) => setNewStaffFullName(e.target.value)}
                      placeholder="Suresh Kumar Verma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="suresh@school.edu"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Initial Password *</label>
                    <input
                      type="password"
                      required
                      value={newStaffPassword}
                      onChange={(e) => setNewStaffPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Role Authority *</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    >
                      <option value="PRINCIPAL">👑 Principal / Headmaster (Full Command)</option>
                      <option value="SCHOOL_ADMIN">🛡️ School Admin (Full Command)</option>
                      <option value="CLASS_TEACHER">🏛️ Class Teacher (Heads Class & Section)</option>
                      <option value="SUBJECT_TEACHER">📚 Subject Teacher (Curriculum & Subject Marks)</option>
                      <option value="ACCOUNTANT">💳 Accountant / Cashier (Fees & Invoicing)</option>
                      <option value="DRIVER">🚌 Bus Driver / Transport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={newStaffDesignation}
                      onChange={(e) => setNewStaffDesignation(e.target.value)}
                      placeholder="Senior Mathematics Teacher"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={newStaffQualification}
                      onChange={(e) => setNewStaffQualification(e.target.value)}
                      placeholder="B.Ed, M.Sc Mathematics"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={newStaffDepartment}
                      onChange={(e) => setNewStaffDepartment(e.target.value)}
                      placeholder="Science & Maths"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-400">Photo / Avatar</label>
                      <label className="text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold flex items-center gap-1">
                        <span>📁 Upload</span>
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
                      placeholder="https://... or uploaded"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Direct Onboarding Workload Assignments (Classes & Subjects) */}
                {["CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "SCHOOL_ADMIN", "ADMIN"].includes(newStaffRole) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] text-amber-500 font-bold mb-1">
                          🏛️ Assign as Class Teacher for Section (Optional)
                        </label>
                        <p className="text-[10px] text-slate-400 mb-2">Teacher will head this section and take daily attendance.</p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Filter by Class / Grade:
                          </label>
                          <select
                            value={newStaffClassFilter}
                            onChange={(e) => {
                              setNewStaffClassFilter(e.target.value);
                              setNewStaffSectionId("");
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-amber-500"
                          >
                            <option value="">— All Classes & Grades —</option>
                            {classesList.map((cls: any) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Choose Section:
                          </label>
                          <select
                            value={newStaffSectionId}
                            onChange={(e) => setNewStaffSectionId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-amber-500"
                          >
                            <option value="">— None (Not Heading a Class) —</option>
                            {(newStaffClassFilter
                              ? classesList.filter((cls: any) => cls.id === newStaffClassFilter)
                              : classesList
                            ).flatMap((cls: any) =>
                              (cls.sections || []).map((sec: any) => (
                                <option key={sec.id} value={sec.id}>
                                  {cls.name} - Section {sec.name}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1">
                        📚 Assign Curriculum Subjects to Teach (Optional)
                      </label>
                      <p className="text-[10px] text-slate-400 mb-2">Select subjects from school's configured curriculum.</p>
                      <div className="max-h-28 overflow-y-auto space-y-1 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        {(allSchoolSubjects.length > 0 ? allSchoolSubjects : subjectsList).length === 0 ? (
                          <p className="text-[10px] text-slate-500 py-1 text-center">No subjects created yet.</p>
                        ) : (
                          (allSchoolSubjects.length > 0 ? allSchoolSubjects : subjectsList).map((sub: any) => {
                            const checked = newStaffSubjectIds.includes(sub.id);
                            return (
                              <label
                                key={sub.id}
                                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs font-bold transition border ${
                                  checked
                                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                                    : "bg-white text-slate-900 hover:bg-slate-100 border-slate-200"
                                }`}
                              >
                                <span>
                                  {sub.name}{" "}
                                  <span className={`text-[10px] font-semibold ${checked ? "text-blue-100" : "text-slate-500"}`}>
                                    ({sub.classGrade?.name || "Grade"})
                                  </span>
                                </span>
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
                                  className="accent-sky-500 h-3.5 w-3.5"
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
                    <label className="block text-[11px] text-orange-400 font-bold mb-1">
                      🚌 Assign Bus Route (Optional)
                    </label>
                    <select
                      value={newStaffBusRouteId}
                      onChange={(e) => setNewStaffBusRouteId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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

                {/* Staff Verification Credentials & KYC Documents */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span>📁</span> Staff Verification Credentials & Documents
                    </h4>
                    <p className="text-[11px] text-slate-500">Attach official documents for qualification and background verification records.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Aadhar */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-800">🪪 Aadhar Card</label>
                        <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span>📁 Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setStaffAadharDoc(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={staffAadharDoc}
                        onChange={(e) => setStaffAadharDoc(e.target.value)}
                        placeholder="Aadhar Doc URL"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                      />
                      {staffAadharDoc && (
                        <a href={staffAadharDoc} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline">
                          ✓ Attached ↗
                        </a>
                      )}
                    </div>

                    {/* Degree */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-800">🎓 Degree Certificate</label>
                        <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span>📁 Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setStaffDegreeDoc(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={staffDegreeDoc}
                        onChange={(e) => setStaffDegreeDoc(e.target.value)}
                        placeholder="Degree Doc URL"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                      />
                      {staffDegreeDoc && (
                        <a href={staffDegreeDoc} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline">
                          ✓ Attached ↗
                        </a>
                      )}
                    </div>

                    {/* Resume */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-800">📄 Resume / CV</label>
                        <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span>📁 Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setStaffResumeDoc(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={staffResumeDoc}
                        onChange={(e) => setStaffResumeDoc(e.target.value)}
                        placeholder="Resume URL"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                      />
                      {staffResumeDoc && (
                        <a href={staffResumeDoc} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline">
                          ✓ Attached ↗
                        </a>
                      )}
                    </div>

                    {/* Experience Certificate */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-800">📜 Experience Cert</label>
                        <label className="text-[10px] text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span>📁 Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setStaffExpDoc(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={staffExpDoc}
                        onChange={(e) => setStaffExpDoc(e.target.value)}
                        placeholder="Experience Cert URL"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 font-medium outline-none"
                      />
                      {staffExpDoc && (
                        <a href={staffExpDoc} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline">
                          ✓ Attached ↗
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
                  {loading ? "Registering..." : "+ Register Faculty Member"}
                </button>
              </form>
            )}
          </div>
      )}

      {profileModalStaff && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setProfileModalStaff(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="h-13 w-13 rounded-2xl bg-indigo-50 border border-indigo-200 overflow-hidden flex items-center justify-center font-black text-indigo-700 text-lg shadow-2xs">
                  {profileModalStaff.staffProfile?.avatarUrl ? (
                    <img src={profileModalStaff.staffProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (profileModalStaff.staffProfile?.fullName || profileModalStaff.email || "S").charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-950">
                    {profileModalStaff.staffProfile?.fullName || profileModalStaff.email?.split("@")[0]}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                      {profileModalStaff.staffProfile?.designation || profileModalStaff.role}
                    </span>
                    <span className="text-xs font-medium text-slate-500 font-mono">
                      {profileModalStaff.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const st = profileModalStaff;
                    setProfileModalStaff(null);
                    handleOpenAssignModal(st);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold inline-flex items-center gap-1.5 transition shadow-2xs"
                >
                  🎯 Workload & Role
                </button>
                <button
                  onClick={() => setProfileModalStaff(null)}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Department</span>
                <span className="font-bold text-slate-950 text-sm">
                  {profileModalStaff.staffProfile?.department || "General"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Qualification</span>
                <span className="font-bold text-slate-950 text-sm">
                  {profileModalStaff.staffProfile?.qualification || "Faculty Degree"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Email & Phone</span>
                <span className="font-bold text-blue-700 font-mono text-xs block truncate">{profileModalStaff.email}</span>
                <span className="text-slate-700 font-mono text-xs font-semibold block mt-0.5">{profileModalStaff.phone || "—"}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1">Aadhar & Experience</span>
                <span className="font-bold text-slate-950 font-mono text-xs block">
                  {profileModalStaff.staffProfile?.aadharNumber || "—"}
                </span>
                <span className="text-slate-700 font-medium text-xs mt-0.5 block">
                  {profileModalStaff.staffProfile?.experienceYears || 0} Years Experience
                </span>
              </div>
            </div>

            {/* Faculty Credentials & Verification Documents */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-2xs">
              <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">
                📁 Faculty Credentials & Documents
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-1.5 shadow-2xs">
                  <span className="font-bold text-slate-800 text-[11px]">🪪 Aadhar</span>
                  {profileModalStaff.staffProfile?.aadharDoc ? (
                    <a
                      href={profileModalStaff.staffProfile.aadharDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-0.5"
                    >
                      <span>📄 View</span> ↗
                    </a>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">Pending</span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-1.5 shadow-2xs">
                  <span className="font-bold text-slate-800 text-[11px]">🎓 Degree</span>
                  {profileModalStaff.staffProfile?.degreeDoc ? (
                    <a
                      href={profileModalStaff.staffProfile.degreeDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-0.5"
                    >
                      <span>📄 View</span> ↗
                    </a>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">Pending</span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-1.5 shadow-2xs">
                  <span className="font-bold text-slate-800 text-[11px]">📄 Resume</span>
                  {profileModalStaff.staffProfile?.resumeDoc ? (
                    <a
                      href={profileModalStaff.staffProfile.resumeDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-0.5"
                    >
                      <span>📄 View</span> ↗
                    </a>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">Pending</span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-1.5 shadow-2xs">
                  <span className="font-bold text-slate-800 text-[11px]">📜 Experience</span>
                  {profileModalStaff.staffProfile?.expDoc ? (
                    <a
                      href={profileModalStaff.staffProfile.expDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-0.5"
                    >
                      <span>📄 View</span> ↗
                    </a>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">Pending</span>
                  )}
                </div>
              </div>
            </div>

            {/* Escalate / Switch Role: Multi-Role Dropdown Selector */}
            {(() => {
              const rawDesig = profileModalStaff.staffProfile?.designation || "";
              const hasRoles = rawDesig.includes("TEACHER") || rawDesig.includes("ACCOUNTANT") || rawDesig.includes("SCHOOL_ADMIN");
              const currentRoles: string[] = profileModalStaff.assignedRoles || (hasRoles ? rawDesig.split(",").map((s: string) => s.trim()) : [profileModalStaff.role]);

              return (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🛡️</span> Escalate / Switch Role:
                      </span>
                      <p className="text-[11px] text-slate-500">Staff member can hold multiple concurrent roles (e.g. Teacher & Accountant).</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Multi-Role Dropdown
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setRoleDropdownOpen((prev) => !prev)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs hover:border-blue-500 transition"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-500 font-normal">Active Roles:</span>
                        {currentRoles.map((r: string) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              r === "SCHOOL_ADMIN"
                                ? "bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200"
                                : r === "ACCOUNTANT"
                                ? "bg-blue-100 text-blue-900 border border-blue-200"
                                : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-400 text-xs ml-2">{roleDropdownOpen ? "▲" : "▼"}</span>
                    </button>

                    {roleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-2 animate-in fade-in duration-150">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                          Toggle Multiple Roles for {profileModalStaff.staffProfile?.fullName || profileModalStaff.email}
                        </div>
                        {[
                          { id: "PRINCIPAL", label: "PRINCIPAL", desc: "School Leadership & Full Command", color: "purple" },
                          { id: "SCHOOL_ADMIN", label: "SCHOOL_ADMIN", desc: "Full School Administration & Configurations", color: "fuchsia" },
                          { id: "CLASS_TEACHER", label: "CLASS_TEACHER", desc: "Heads Class, Section Attendance & Academic Reports", color: "emerald" },
                          { id: "SUBJECT_TEACHER", label: "SUBJECT_TEACHER", desc: "Curriculum Subject Teaching & Marks Entry", color: "teal" },
                          { id: "ACCOUNTANT", label: "ACCOUNTANT", desc: "Fees, Invoicing, Collection & Receipts", color: "blue" },
                          { id: "DRIVER", label: "DRIVER", desc: "Transport Routes, Vehicle & Student Commute", color: "orange" },
                        ].map((roleOpt) => {
                          const isChecked = currentRoles.includes(roleOpt.id);
                          return (
                            <label
                              key={roleOpt.id}
                              onClick={(e) => e.stopPropagation()}
                              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                                isChecked
                                  ? "bg-blue-50/70 border-blue-300 text-blue-950 font-bold"
                                  : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleStaffRole(profileModalStaff.id, roleOpt.id, currentRoles)}
                                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <div>
                                  <span className="text-xs font-bold block">{roleOpt.label}</span>
                                  <span className="text-[10px] text-slate-500 font-normal">{roleOpt.desc}</span>
                                </div>
                              </div>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  isChecked ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {isChecked ? "Active ✓" : "+ Add"}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {resetModalUser && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setResetModalUser(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-950">
              Reset Password for {resetModalUser.email || resetModalUser.phone}
            </h3>
            <form onSubmit={handleAdminResetPassword} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Enter new password (min 6 chars)"
                value={overridePassword}
                onChange={(e) => setOverridePassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition"
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

      {assignModalStaff && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setAssignModalStaff(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4 shadow-2xl my-8 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <span>🎯</span> Assign Role & Faculty Workload
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Configure administrative authority, class teacher section, subject specialization, or transport driver routes.
                </p>
              </div>
              <button
                onClick={() => setAssignModalStaff(null)}
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
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
                <h4 className="font-bold text-base text-slate-950">
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Primary Role & Authority *
                </label>
                <select
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="PRINCIPAL">👑 Principal / Headmaster (Full Administrative Command)</option>
                  <option value="SCHOOL_ADMIN">🛡️ School Admin (Full Administrative Command)</option>
                  <option value="CLASS_TEACHER">🏛️ Class Teacher (Heads Class & Section)</option>
                  <option value="SUBJECT_TEACHER">📚 Subject Teacher (Curriculum & Subject Marks)</option>
                  <option value="ACCOUNTANT">💳 Accountant / Cashier (Fees & Invoicing)</option>
                  <option value="DRIVER">🚌 Bus Driver / Transport</option>
                </select>
              </div>

              {/* 2. Class Teacher Assignment */}
              {(assignRole === "CLASS_TEACHER" || assignRole === "SCHOOL_ADMIN" || assignRole === "ADMIN" || assignRole === "PRINCIPAL") && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-500 flex items-center gap-1.5">
                      <span>🏛️</span> Assign as Class Teacher for Section:
                    </label>
                    <span className="text-[10px] text-slate-500">Marks daily attendance & class reports</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        1. Filter by Class / Grade:
                      </label>
                      <select
                        value={assignClassFilter}
                        onChange={(e) => {
                          setAssignClassFilter(e.target.value);
                          setAssignSectionId("");
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-amber-500"
                      >
                        <option value="">— All Classes & Grades —</option>
                        {classesList.map((cls: any) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        2. Choose Section:
                      </label>
                      <select
                        value={assignSectionId}
                        onChange={(e) => setAssignSectionId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-amber-500"
                      >
                        <option value="">— None / Not Heading a Class —</option>
                        {(assignClassFilter
                          ? classesList.filter((cls: any) => cls.id === assignClassFilter)
                          : classesList
                        ).flatMap((cls: any) =>
                          (cls.sections || []).map((sec: any) => (
                            <option key={sec.id} value={sec.id}>
                              {cls.name} - Section {sec.name} {sec.classTeacherId === assignModalStaff.id ? "(Currently Assigned)" : ""}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Subject Teacher Assignment */}
              {(assignRole === "SUBJECT_TEACHER" || assignRole === "CLASS_TEACHER" || assignRole === "SCHOOL_ADMIN" || assignRole === "ADMIN" || assignRole === "PRINCIPAL") && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>📚</span> Assign Curriculum Subjects to Teach:
                    </label>
                    <span className="text-[10px] text-slate-500">Selected: {assignSubjectIds.length} subjects</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
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
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition border ${
                              checked
                                ? "bg-blue-600 text-white border-blue-600 font-bold shadow-2xs"
                                : "bg-white text-slate-900 hover:bg-slate-100 border-slate-200 font-bold"
                            }`}
                          >
                            <span className="text-xs">
                              {sub.name}{" "}
                              <span className={`text-[10px] font-semibold ${checked ? "text-blue-100" : "text-slate-500"}`}>
                                ({sub.classGrade?.name || subjectClassGrade || "Curriculum"})
                              </span>
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
              {(assignRole === "DRIVER" || assignRole === "SCHOOL_ADMIN" || assignRole === "ADMIN" || assignRole === "PRINCIPAL") && (
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-orange-500"
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition"
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

      {staffImportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setStaffImportModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900"
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

      {editSalaryStructureStaff && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditSalaryStructureStaff(null)}
        >
          <div
            className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-900 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                  <span>⚙️</span> Configure Salary Structure
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {editSalaryStructureStaff.fullName} • {editSalaryStructureStaff.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditSalaryStructureStaff(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalaryStructure} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Basic Salary (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editStructureForm.baseSalary}
                    onChange={(e) =>
                      setEditStructureForm({ ...editStructureForm, baseSalary: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    HRA (House Rent) (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStructureForm.hra}
                    onChange={(e) =>
                      setEditStructureForm({ ...editStructureForm, hra: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    DA (Dearness) (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStructureForm.da}
                    onChange={(e) =>
                      setEditStructureForm({ ...editStructureForm, da: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Travel / Conveyance (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStructureForm.travelAllowance}
                    onChange={(e) =>
                      setEditStructureForm({ ...editStructureForm, travelAllowance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Special Allowance (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStructureForm.specialAllowance}
                    onChange={(e) =>
                      setEditStructureForm({ ...editStructureForm, specialAllowance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="text-[11px] font-bold text-rose-700 block mb-1">
                    Provident Fund (PF) (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStructureForm.pfDeduction}
                    onChange={(e) =>
                      setEditStructureForm({ ...editStructureForm, pfDeduction: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs font-bold text-rose-900 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-rose-700 block mb-1">
                    Income / Professional Tax (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStructureForm.taxDeduction}
                    onChange={(e) =>
                      setEditStructureForm({ ...editStructureForm, taxDeduction: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs font-bold text-rose-900 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Live Computation Bar */}
              {(() => {
                const gross =
                  Number(editStructureForm.baseSalary || 0) +
                  Number(editStructureForm.hra || 0) +
                  Number(editStructureForm.da || 0) +
                  Number(editStructureForm.travelAllowance || 0) +
                  Number(editStructureForm.specialAllowance || 0);
                const deductions =
                  Number(editStructureForm.pfDeduction || 0) +
                  Number(editStructureForm.taxDeduction || 0);
                const net = Math.max(0, gross - deductions);

                return (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Gross Salary</span>
                      <span className="font-bold text-slate-800 font-mono">₹{gross.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-500 block">Deductions</span>
                      <span className="font-bold text-rose-700 font-mono">-₹{deductions.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-black text-emerald-700 block">Net Monthly Take-Home</span>
                      <span className="font-black text-base text-emerald-700 font-mono">₹{net.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Bank Details */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-800">Bank Account & Payment Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={editStructureForm.paymentMode}
                      onChange={(e) =>
                        setEditStructureForm({ ...editStructureForm, paymentMode: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={editStructureForm.bankAccountNo}
                      onChange={(e) =>
                        setEditStructureForm({ ...editStructureForm, bankAccountNo: e.target.value })
                      }
                      placeholder="e.g. 501004928172"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-medium text-slate-900 outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      value={editStructureForm.bankIfsc}
                      onChange={(e) =>
                        setEditStructureForm({ ...editStructureForm, bankIfsc: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-medium text-slate-900 outline-none focus:border-blue-600 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      value={editStructureForm.panNumber}
                      onChange={(e) =>
                        setEditStructureForm({ ...editStructureForm, panNumber: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-medium text-slate-900 outline-none focus:border-blue-600 uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditSalaryStructureStaff(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Salary Structure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
