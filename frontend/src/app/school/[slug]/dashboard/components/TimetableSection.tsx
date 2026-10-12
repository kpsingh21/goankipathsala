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

export interface TimetableSectionProps {
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
  setIdCardConfig?: React.Dispatch<React.SetStateAction<any>>;
  reportCardConfig?: any;
  setReportCardConfig?: React.Dispatch<React.SetStateAction<any>>;
  timetableSubTab?: any;
  setTimetableSubTab?: React.Dispatch<React.SetStateAction<any>>;
  classesList?: any[];
  staffList?: any[];
  className?: any;
  subjectsList?: any[];
  timetableEntries?: any[];
  timetableClassGrade?: any;
  setTimetableClassGrade?: React.Dispatch<React.SetStateAction<any>>;
  editSlotModal?: any;
  setEditSlotModal?: React.Dispatch<React.SetStateAction<any>>;
  fetchSubjects?: any;
  fetchTimetable?: any;
  handleSaveTimetableSlot?: any;
  [key: string]: any;
}

export default function TimetableSection(props: TimetableSectionProps) {
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
    timetableSubTab,
    setTimetableSubTab = () => {},
    classesList = [],
    staffList = [],
    className,
    subjectsList = [],
    timetableEntries = [],
    timetableClassGrade,
    setTimetableClassGrade = () => {},
    editSlotModal,
    setEditSlotModal = () => {},
    fetchSubjects = () => {},
    fetchTimetable = () => {},
    handleSaveTimetableSlot = () => {},
  } = props;

  return (
    <>
      {activeSection === "timetable" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>🗓️</span> Weekly Class Timetable Builder
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Six-day schedule (Monday to Saturday, Periods 1 to 7) with room allocations.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                <button
                  onClick={() => setTimetableSubTab("grid")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    timetableSubTab === "grid"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  🗓️ Schedule Matrix Grid
                </button>
                {!isTeacherOnly && (
                  <button
                    onClick={() => setTimetableSubTab("edit")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      timetableSubTab === "edit"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    ✏️ Period Slot Configurator
                  </button>
                )}
              </div>
            </div>

            {isTeacherOnly && (
              <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-blue-950 font-medium flex items-center gap-2.5 shadow-2xs">
                <span className="text-base shrink-0">🗓️</span>
                <span>
                  <strong>View-Only Timetable Schedule:</strong> Faculty members have read-only access to weekly timetable allocations. Modifying or configuring period slots is restricted to school administrators.
                </span>
              </div>
            )}

            {/* Sub-tab 1: Grid */}
            {timetableSubTab === "grid" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-600 font-medium font-bold">Select Class Grade:</span>
                  <select
                    value={timetableClassGrade}
                    onChange={(e) => {
                      setTimetableClassGrade(e.target.value);
                      fetchTimetable(e.target.value);
                      fetchSubjects(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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

                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto overscroll-x-contain touch-auto">
                    <table className="w-full text-left text-xs min-w-[800px]">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                        <tr>
                          <th className="p-3 w-28 font-bold text-slate-900">Day</th>
                          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                            <th key={p} className="p-3 text-center border-l border-slate-200 font-bold text-slate-700">
                              Period {p}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
                          <tr key={day} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900 bg-slate-50/80 border-r border-slate-200">{day}</td>
                            {[1, 2, 3, 4, 5, 6, 7].map((pNum) => {
                              const entry = timetableEntries.find(
                                (e) => e.dayOfWeek === day && e.periodNumber === pNum
                              );
                              return (
                                <td
                                  key={pNum}
                                  onClick={() => {
                                    if (isTeacherOnly) return;
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
                                  className={`p-2.5 border-l border-slate-200 transition ${isTeacherOnly ? "cursor-default" : "cursor-pointer hover:bg-blue-50/60"}`}
                                >
                                  {entry ? (
                                    <div className="space-y-0.5 text-center">
                                      <p className="font-bold text-slate-950 text-xs truncate">{entry.subjectName}</p>
                                      <p className="text-[11px] text-blue-700 font-semibold truncate">{entry.teacherName}</p>
                                      <span className="text-[10px] text-slate-500 font-mono block">
                                        {entry.roomNumber || entry.startTime}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className={`text-center text-[10px] py-2 font-medium ${isTeacherOnly ? "text-slate-300" : "text-slate-400 hover:text-blue-600"}`}>
                                      {isTeacherOnly ? "—" : "+ Add Slot"}
                                    </div>
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
            {timetableSubTab === "edit" && !isTeacherOnly && (
              <form onSubmit={handleSaveTimetableSlot} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Configure Period Slot for {timetableClassGrade}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Day of Week</label>
                    <select
                      value={editSlotModal?.dayOfWeek || "MONDAY"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), dayOfWeek: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    <option value="">— Select Teacher from Staff —</option>
                    {staffList
                      .filter((s) => ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(s.role))
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.staffProfile?.fullName || t.email}
                        </option>
                      ))}
                  </select>
                  {editSlotModal?.teacherName && (
                    <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
                      Faculty Name: <strong className="text-blue-700 font-bold">{editSlotModal.teacherName}</strong>
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">End Time</label>
                    <input
                      type="text"
                      value={editSlotModal?.endTime || "09:15 AM"}
                      onChange={(e) => setEditSlotModal({ ...(editSlotModal || {}), endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                >
                  Save Period Slot
                </button>
              </form>
            )}
          </div>
      )}


    </>
  );
}
