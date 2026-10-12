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

export interface SubjectsSectionProps {
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
  classesList?: any[];
  editSubjectModal?: any;
  setEditSubjectModal?: React.Dispatch<React.SetStateAction<any>>;
  mapSubjectModalOpen?: any;
  setMapSubjectModalOpen?: React.Dispatch<React.SetStateAction<any>>;
  mapSubjectClassGrade?: any;
  setMapSubjectClassGrade?: React.Dispatch<React.SetStateAction<any>>;
  mapSubjectName?: any;
  setMapSubjectName?: React.Dispatch<React.SetStateAction<any>>;
  mapSubjectBoard?: any;
  setMapSubjectBoard?: React.Dispatch<React.SetStateAction<any>>;
  mapSubjectTeacherId?: any;
  setMapSubjectTeacherId?: React.Dispatch<React.SetStateAction<any>>;
  mapSubjectLoading?: any;
  staffList?: any[];
  className?: any;
  subjectsList?: any[];
  subjectClassGrade?: any;
  setSubjectClassGrade?: React.Dispatch<React.SetStateAction<any>>;
  setProfileModalStaff?: React.Dispatch<React.SetStateAction<any>>;
  fetchSubjects?: any;
  handleMapSubject?: any;
  handleAssignSubjectTeacher?: any;
  handleUpdateSubject?: any;
  handleDeleteSubject?: any;
  [key: string]: any;
}

export default function SubjectsSection(props: SubjectsSectionProps) {
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
    classesList = [],
    editSubjectModal,
    setEditSubjectModal = () => {},
    mapSubjectModalOpen,
    setMapSubjectModalOpen = () => {},
    mapSubjectClassGrade,
    setMapSubjectClassGrade = () => {},
    mapSubjectName,
    setMapSubjectName = () => {},
    mapSubjectBoard,
    setMapSubjectBoard = () => {},
    mapSubjectTeacherId,
    setMapSubjectTeacherId = () => {},
    mapSubjectLoading,
    staffList = [],
    className,
    subjectsList = [],
    subjectClassGrade,
    setSubjectClassGrade = () => {},
    setProfileModalStaff = () => {},
    fetchSubjects = () => {},
    handleMapSubject = () => {},
    handleAssignSubjectTeacher = () => {},
    handleUpdateSubject = () => {},
    handleDeleteSubject = () => {},
  } = props;

  return (
    <>
      {activeSection === "subjects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>📚</span> Class Curriculum Subjects & Faculty
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  View curriculum subjects mapped from Classes (SIS) and assign specialized faculty.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold font-mono">
                  📚 {subjectsList.length} Subjects Listed
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const defaultClass = (subjectClassGrade !== "ALL" && subjectClassGrade) ? subjectClassGrade : (classesList.length > 0 ? classesList[0].name : "Class 6");
                      setMapSubjectClassGrade(defaultClass);
                      setMapSubjectName("");
                      setMapSubjectTeacherId("");
                      setMapSubjectModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>➕</span> Map Subject to Class
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-700 font-bold">Select Class Grade:</span>
                  <select
                    value={subjectClassGrade}
                    onChange={(e) => {
                      setSubjectClassGrade(e.target.value);
                      fetchSubjects(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-medium outline-none shadow-2xs"
                  >
                    <option value="ALL">All Classes & Grades ({classesList.length} Classes)</option>
                    {classesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.subjectsCount || (c.subjects || []).length} subjects)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        const defaultClass = (subjectClassGrade !== "ALL" && subjectClassGrade) ? subjectClassGrade : (classesList.length > 0 ? classesList[0].name : "Class 6");
                        setMapSubjectClassGrade(defaultClass);
                        setMapSubjectName("");
                        setMapSubjectTeacherId("");
                        setMapSubjectModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>➕</span> Map New Subject
                    </button>
                  )}
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <span>💡 Or manage in</span>
                    <button
                      type="button"
                      onClick={() => setActiveSection("classes")}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      Classes (SIS) →
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto overscroll-x-contain touch-auto">
                  <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Class / Grade</th>
                      <th className="p-3.5">Assigned Subject Teacher</th>
                      {isAdmin && (
                        <>
                          <th className="p-3.5 w-64">Assign Faculty</th>
                          <th className="p-3.5 text-right w-28">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjectsList.length === 0 ? (
                      <tr>
                        <td colSpan={isAdmin ? 5 : 3} className="p-8 text-center text-slate-500">
                          <p className="font-semibold text-sm mb-2 text-slate-700">No curriculum subjects found for this selection.</p>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                const defaultClass = (subjectClassGrade !== "ALL" && subjectClassGrade) ? subjectClassGrade : (classesList.length > 0 ? classesList[0].name : "Class 6");
                                setMapSubjectClassGrade(defaultClass);
                                setMapSubjectName("");
                                setMapSubjectTeacherId("");
                                setMapSubjectModalOpen(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                            >
                              <span>➕</span> Map Subject to {subjectClassGrade !== "ALL" ? subjectClassGrade : "a Class"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      subjectsList.map((sub) => {
                        const teacher = sub.teacher;
                        const prof = teacher?.staffProfile;
                        const className = sub.classGrade?.name || subjectClassGrade || "—";
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 font-bold text-slate-950 text-sm">{sub.name}</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {className}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {teacher ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const staffObj = staffList.find((s) => s.id === (teacher.id || sub.teacherId)) || teacher;
                                    setProfileModalStaff(staffObj);
                                  }}
                                  className="inline-flex items-center gap-2 hover:opacity-85 transition text-left cursor-pointer group"
                                  title="Click to view Teacher Profile"
                                >
                                  <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:bg-indigo-100">
                                    {(prof?.fullName || teacher.email || "T").charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-bold text-slate-950 group-hover:text-blue-700 underline-offset-2 hover:underline text-xs">
                                    {prof?.fullName || teacher.email}
                                  </span>
                                </button>
                              ) : (
                                <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold italic">Unassigned</span>
                              )}
                            </td>
                            {isAdmin && (
                              <>
                                <td className="p-3.5 w-64">
                                  <select
                                    value={sub.teacherId || ""}
                                    onChange={(e) => handleAssignSubjectTeacher(sub.id, e.target.value)}
                                    className="w-full max-w-[220px] px-3 py-1.5 rounded-xl bg-slate-50 text-xs text-slate-900 border border-slate-300 font-medium outline-none focus:bg-white focus:border-blue-500 transition shadow-2xs"
                                  >
                                    <option value="">— Unassign —</option>
                                    {staffList
                                      .filter((s) => ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(s.role))
                                      .map((t) => (
                                        <option key={t.id} value={t.id}>
                                          {t.staffProfile?.fullName || t.email}
                                        </option>
                                      ))}
                                  </select>
                                </td>
                                <td className="p-3.5 text-right w-28 whitespace-nowrap">
                                  <div className="inline-flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setEditSubjectModal(sub)}
                                      title="Edit Subject"
                                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                      title="Delete Subject"
                                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
      )}

      {mapSubjectModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setMapSubjectModalOpen(false)}
        >
          <div
            className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                  <span>📚</span> Map Subject to Class Grade
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Assign curriculum subject and optional teacher to class syllabus
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMapSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMapSubject} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Target Class / Grade *
                </label>
                <select
                  required
                  value={mapSubjectClassGrade}
                  onChange={(e) => setMapSubjectClassGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="">— Select Target Class —</option>
                  {classesList.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      🏛️ {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={mapSubjectName}
                  onChange={(e) => setMapSubjectName(e.target.value)}
                  placeholder="e.g. Mathematics, Science, English Literature"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                />
                {/* Quick Subject Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit", "Computer", "EVS", "Art"].map((quickSub) => (
                    <button
                      key={quickSub}
                      type="button"
                      onClick={() => setMapSubjectName(quickSub)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                        mapSubjectName === quickSub
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      + {quickSub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Curriculum / Board
                  </label>
                  <select
                    value={mapSubjectBoard}
                    onChange={(e) => setMapSubjectBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                  >
                    <option value="CBSE">CBSE (Central Board)</option>
                    <option value="ICSE">ICSE / CISCE</option>
                    <option value="STATE_BOARD">State Secondary Board</option>
                    <option value="VOCATIONAL">Vocational & Computer Studies</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Assigned Faculty (Optional)
                  </label>
                  <select
                    value={mapSubjectTeacherId}
                    onChange={(e) => setMapSubjectTeacherId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                  >
                    <option value="">— Assign Later —</option>
                    {staffList
                      .filter((s: any) => ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(s.role))
                      .map((t: any) => (
                        <option key={t.id} value={t.id}>
                          👨‍🏫 {t.staffProfile?.fullName || t.fullName || t.email}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMapSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mapSubjectLoading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {mapSubjectLoading ? "Mapping..." : "✓ Map Subject to Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editSubjectModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditSubjectModal(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-950 flex items-center gap-2">
                <span>📚</span> Edit Academic Subject
              </h3>
              <button
                onClick={() => setEditSubjectModal(null)}
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateSubject} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Subject Title
                </label>
                <input
                  type="text"
                  required
                  value={editSubjectModal.name || ""}
                  onChange={(e) => setEditSubjectModal({ ...editSubjectModal, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Curriculum / Board
                </label>
                <select
                  value={editSubjectModal.board || "CBSE"}
                  onChange={(e) => setEditSubjectModal({ ...editSubjectModal, board: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                >
                  <option value="CBSE">CBSE (Central Board)</option>
                  <option value="ICSE">ICSE / CISCE</option>
                  <option value="STATE_BOARD">State Secondary Education Board</option>
                  <option value="VOCATIONAL">Vocational & Computer Studies</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Assigned Faculty / Subject Teacher
                </label>
                <select
                  value={editSubjectModal.teacherId || ""}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const st = staffList.find((s) => s.id === selId);
                    setEditSubjectModal({
                      ...editSubjectModal,
                      teacherId: selId,
                      teacherName: st ? (st.staffProfile?.fullName || st.fullName || st.email) : "",
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                >
                  <option value="">— Unassigned Teacher —</option>
                  {staffList
                    .filter((t: any) =>
                      ["TEACHER", "CLASS_TEACHER", "SUBJECT_TEACHER", "PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(t.role)
                    )
                    .map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.staffProfile?.fullName || t.fullName || t.email}
                      </option>
                    ))}
                </select>
                {(() => {
                  const selTeacher = staffList.find((s) => s.id === editSubjectModal.teacherId);
                  const nameToShow = selTeacher ? (selTeacher.staffProfile?.fullName || selTeacher.fullName || selTeacher.email) : editSubjectModal.teacherName;
                  if (!nameToShow) return null;
                  return (
                    <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
                      Faculty Name: <strong className="text-blue-700 font-bold">{nameToShow}</strong>
                    </p>
                  );
                })()}
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
    </>
  );
}
