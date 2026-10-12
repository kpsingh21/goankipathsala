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

export interface ResultSectionProps {
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
  examSubTab?: any;
  setExamSubTab?: React.Dispatch<React.SetStateAction<any>>;
  classesList?: any[];
  teacherScope?: any;
  reportCardMode?: any;
  batchMarks?: any[];
  setBatchMarks?: React.Dispatch<React.SetStateAction<any[]>>;
  studentList?: any[];
  firstName?: any;
  lastName?: any;
  dob?: any;
  gender?: any;
  fatherName?: any;
  motherName?: any;
  className?: any;
  setTemplateCustomizerModal?: React.Dispatch<React.SetStateAction<any>>;
  reportCardClassFilter?: any;
  setReportCardClassFilter?: React.Dispatch<React.SetStateAction<any>>;
  reportCardSectionFilter?: any;
  setReportCardSectionFilter?: React.Dispatch<React.SetStateAction<any>>;
  reportCardSearch?: any;
  setReportCardSearch?: React.Dispatch<React.SetStateAction<any>>;
  examsList?: any[];
  newExamName?: any;
  setNewExamName?: React.Dispatch<React.SetStateAction<any>>;
  newExamStartDate?: any;
  setNewExamStartDate?: React.Dispatch<React.SetStateAction<any>>;
  selectedExamId?: any;
  setSelectedExamId?: React.Dispatch<React.SetStateAction<any>>;
  markStudentEnrollmentId?: any;
  setMarkStudentEnrollmentId?: React.Dispatch<React.SetStateAction<any>>;
  viewReportCard?: any;
  setViewReportCard?: React.Dispatch<React.SetStateAction<any>>;
  handleCreateExam?: any;
  handleFetchReportCard?: any;
  handleFetchAggregateReportCard?: any;
  handleRecordBatchMarks?: any;
  [key: string]: any;
}

export default function ResultSection(props: ResultSectionProps) {
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
    examSubTab,
    setExamSubTab = () => {},
    classesList = [],
    teacherScope,
    reportCardMode,
    batchMarks = [],
    setBatchMarks = () => {},
    studentList = [],
    firstName,
    lastName,
    dob,
    gender,
    fatherName,
    motherName,
    className,
    setTemplateCustomizerModal = () => {},
    reportCardClassFilter,
    setReportCardClassFilter = () => {},
    reportCardSectionFilter,
    setReportCardSectionFilter = () => {},
    reportCardSearch,
    setReportCardSearch = () => {},
    examsList = [],
    newExamName,
    setNewExamName = () => {},
    newExamStartDate,
    setNewExamStartDate = () => {},
    selectedExamId,
    setSelectedExamId = () => {},
    markStudentEnrollmentId,
    setMarkStudentEnrollmentId = () => {},
    viewReportCard,
    setViewReportCard = () => {},
    handleCreateExam = () => {},
    handleFetchReportCard = () => {},
    handleFetchAggregateReportCard = () => {},
    handleRecordBatchMarks = () => {},
  } = props;

  return (
    <>
      {activeSection === "exams" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>📊</span> Exams and Results
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Schedule term exams, record Theory & Practical marks, and print official report cards.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                <button
                  onClick={() => setExamSubTab("report_cards")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    examSubTab === "report_cards"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  📜 Student Report Cards Directory
                </button>
                <button
                  onClick={() => setExamSubTab("marks")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    examSubTab === "marks"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  📝 Record Subject Marks & Schedule Exam
                </button>
              </div>
            </div>

                        {/* Sub-tab 1: Report cards directory with filters */}
            {examSubTab === "report_cards" && (() => {
              const filteredReportCardStudents = studentList.filter((st) => {
                const cls = st.enrollments?.[0]?.section?.classGrade?.name || "Class 6";
                const sec = st.enrollments?.[0]?.section?.name || "A";
                const fullName = `${st.firstName} ${st.lastName}`.toLowerCase();
                const adm = (st.admissionNumber || "").toLowerCase();
                const q = reportCardSearch.toLowerCase();

                const matchCls = reportCardClassFilter === "ALL" || cls === reportCardClassFilter;
                const matchSec = reportCardSectionFilter === "ALL" || sec === reportCardSectionFilter;
                const matchSearch = !q || fullName.includes(q) || adm.includes(q);

                return matchCls && matchSec && matchSearch;
              });

              return (
                <div className="space-y-4">
                  {/* Filter and settings bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Search */}
                      <div className="relative">
                        <input
                          type="text"
                          value={reportCardSearch}
                          onChange={(e) => setReportCardSearch(e.target.value)}
                          placeholder="Search student or adm #..."
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 outline-none w-52 focus:bg-white focus:border-blue-600"
                        />
                        <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
                      </div>

                      {/* Class Grade Filter */}
                      <select
                        value={reportCardClassFilter}
                        onChange={(e) => setReportCardClassFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none"
                      >
                        <option value="ALL">All Academic Classes</option>
                        {classesList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      {/* Section Filter */}
                      <select
                        value={reportCardSectionFilter}
                        onChange={(e) => setReportCardSectionFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none"
                      >
                        <option value="ALL">All Sections</option>
                        {["A", "B", "C", "D"].map((s) => (
                          <option key={s} value={s}>
                            Section {s}
                          </option>
                        ))}
                      </select>

                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
                        {filteredReportCardStudents.length} of {studentList.length} Students
                      </span>
                    </div>

                    {/* Action buttons: Look & Feel Settings */}
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => setTemplateCustomizerModal("report_card")}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
                        >
                          <span>⚙️</span> Report Card Look & Feel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto overscroll-x-contain touch-auto">
                      <table className="w-full min-w-[550px] text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Student Scholar</th>
                          <th className="p-3.5">Admission No</th>
                          <th className="p-3.5">Class & Section</th>
                          <th className="p-3.5 text-right">Generate Report Card</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredReportCardStudents.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">
                              No students found matching your class / search filters.
                            </td>
                          </tr>
                        ) : (
                          filteredReportCardStudents.map((st) => (
                            <tr key={st.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-3.5 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 overflow-hidden flex items-center justify-center font-bold text-blue-700 text-xs shrink-0 shadow-2xs">
                                  {st.avatarUrl ? (
                                    <img src={st.avatarUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    `${st.firstName[0]}${st.lastName[0]}`
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-950 text-sm">
                                    {st.firstName} {st.lastName}
                                  </p>
                                  <p className="text-[11px] text-slate-500 font-medium">
                                    Roll #{st.enrollments?.[0]?.rollNumber || 1} • {st.gender}
                                  </p>
                                </div>
                              </td>
                              <td className="p-3.5 font-mono text-blue-700 font-bold">{st.admissionNumber}</td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold inline-block">
                                  {st.enrollments?.[0]?.section?.classGrade?.name || "Class 6"} - Sec {st.enrollments?.[0]?.section?.name || "A"}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                                <button
                                  onClick={() => handleFetchReportCard(st.enrollments?.[0]?.id)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition shadow-2xs inline-flex items-center gap-1.5"
                                >
                                  <span>🖨️</span> Term Card
                                </button>
                                <button
                                  onClick={() => handleFetchAggregateReportCard(st.enrollments?.[0]?.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition shadow-2xs inline-flex items-center gap-1.5"
                                >
                                  <span>📊</span> Cumulative Annual Card
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sub-tab 2: Record Marks & Schedule Exam */}
            {examSubTab === "marks" && (
              <div className="space-y-6">
                {/* Schedule Exam Term Form */}
                {isAdmin && (
                  <form onSubmit={handleCreateExam} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
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
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newExamStartDate}
                          onChange={(e) => setNewExamStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                        >
                          Create Term
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Batch 6-Subject Marks Entry Form with Live Percentage Calculator */}
                <form onSubmit={handleRecordBatchMarks} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                        <span>📝</span> Batch 6-Subject Academic Marks Entry
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Key in marks across all 6 core subjects with automatic real-time percentage and grade computation.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-600 font-semibold">Authority Scope:</span>
                      <span className="font-mono px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                        {teacherScope.canAccessAll ? "ALL SUBJECTS (ADMIN/HOD)" : teacherScope.isClassTeacher ? "CLASS TEACHER" : "SUBJECT TEACHER"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1">Select Examination Term *</label>
                      <select
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-bold outline-none shadow-2xs"
                      >
                        {examsList.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1">Select Enrolled Student *</label>
                      <select
                        value={markStudentEnrollmentId}
                        onChange={(e) => setMarkStudentEnrollmentId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto overscroll-x-contain touch-auto">
                      <table className="w-full min-w-[650px] text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
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
                      <tbody className="divide-y divide-slate-200">
                        {batchMarks.map((bm, idx) => {
                          const th = parseFloat(bm.theoryMarks) || 0;
                          const pr = parseFloat(bm.practicalMarks) || 0;
                          const subTotal = th + pr;
                          const max = parseFloat(bm.maxMarks) || 100;
                          const subPct = max > 0 ? (subTotal / max) * 100 : 0;
                          const subGrade = subPct >= 90 ? "A+" : subPct >= 80 ? "A" : subPct >= 70 ? "B+" : subPct >= 60 ? "B" : subPct >= 50 ? "C" : "D";

                          return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition">
                              <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                              <td className="p-3 font-bold text-slate-950 text-sm">{bm.subjectName}</td>
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
                                  className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold font-mono rounded-lg outline-none focus:bg-white focus:border-blue-600"
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
                                  className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold font-mono rounded-lg outline-none focus:bg-white focus:border-blue-600"
                                />
                              </td>
                              <td className="p-3 font-mono text-slate-700 font-bold">{bm.maxMarks}</td>
                              <td className="p-3 font-mono font-bold text-slate-950 text-sm">
                                {subTotal}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded font-black font-mono text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  {subGrade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
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
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">Grand Total Marks</span>
                            <span className="text-2xl font-black text-slate-950 font-mono">
                              {totalObt} <span className="text-xs text-slate-600 font-bold">/ {totalMax}</span>
                            </span>
                          </div>
                          <div className="border-l border-slate-200 pl-6">
                            <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">Overall Percentage</span>
                            <span className="text-2xl font-black text-blue-700 font-mono">{pct}%</span>
                          </div>
                          <div className="border-l border-slate-200 pl-6">
                            <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">CBSE Grade</span>
                            <span className="text-2xl font-black text-emerald-700 font-mono">{finalG}</span>
                          </div>
                          <div className="border-l border-slate-200 pl-6">
                            <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">Scholastic Status</span>
                            <span className={`text-xs font-black px-3 py-1 rounded-lg border ${
                              numPct >= 33
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}>
                              {status}
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading || !markStudentEnrollmentId}
                          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black disabled:opacity-50 text-xs uppercase tracking-wider transition shadow-sm"
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

      {viewReportCard && (() => {
        const theme = reportCardConfig.themeColor || "blue";
        const themeBorder = theme === "emerald" ? "border-emerald-700" : theme === "burgundy" ? "border-rose-900" : "border-blue-700";
        const themeHeaderBg = theme === "emerald" ? "bg-emerald-700 text-white" : theme === "burgundy" ? "bg-rose-900 text-white" : "bg-blue-700 text-white";
        const themePillBg = theme === "emerald" ? "bg-emerald-900 text-white" : theme === "burgundy" ? "bg-rose-950 text-white" : "bg-blue-900 text-white";
        const themeTableHead = theme === "emerald" ? "bg-emerald-800 text-white" : theme === "burgundy" ? "bg-rose-950 text-white" : "bg-blue-900 text-white";
        const themeAccentText = theme === "emerald" ? "text-emerald-700" : theme === "burgundy" ? "text-rose-900" : "text-blue-700";
        const themeGradeBadge = theme === "emerald" ? "bg-emerald-600 text-white" : theme === "burgundy" ? "bg-rose-800 text-white" : "bg-blue-600 text-white";

        return (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 flex justify-center items-start print:fixed print:inset-0 print:z-[9999] print:bg-white print:p-0 print:overflow-visible print:block"
          onClick={() => setViewReportCard(null)}
        >
          <div
            className={`max-w-4xl w-full bg-white text-slate-900 border-2 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-6 print:m-0 print:p-0 print:border-none print:shadow-none ${themeBorder}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${theme === "emerald" ? "bg-emerald-500" : theme === "burgundy" ? "bg-rose-600" : "bg-blue-600"}`}></span>
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

            {reportCardConfig.showSchoolHeader && (
              <div className={`text-center border-b-2 pb-4 ${theme === "emerald" ? "report-card-border-emerald" : theme === "burgundy" ? "report-card-border-burgundy" : "report-card-border-blue"}`}>
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className={`h-12 w-12 rounded-xl font-extrabold flex items-center justify-center text-2xl shadow ${themeHeaderBg}`}>
                    ग
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                      {viewReportCard.school?.name || currentUser?.schoolName || (slug ? slug.replace(/[-_]/g, " ").toUpperCase() : "GKP MODEL PUBLIC ACADEMY")}
                    </h2>
                    {reportCardConfig.showAffiliationNo && (
                      <p className="text-[11px] text-slate-600 font-semibold tracking-wider uppercase">
                        Affiliated to CBSE, New Delhi • Affiliation No: 2130892 • School Code: 71204
                      </p>
                    )}
                  </div>
                </div>
                <div className={`mt-2 inline-block px-4 py-1 rounded-full font-bold text-xs tracking-widest uppercase shadow-xs ${themePillBg}`}>
                  Official Student Academic Performance Report
                </div>
                <p className="text-xs text-slate-500 mt-1 font-bold">
                  Academic Session: {viewReportCard.student?.academicYear || "2026-2027"}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Student Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{viewReportCard.student?.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Admission No / Roll</span>
                <span className="font-mono font-bold text-emerald-700">
                  {viewReportCard.student?.admissionNumber} / Roll {viewReportCard.student?.rollNumber || 1}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Class & Section</span>
                <span className="font-bold text-slate-800">
                  {viewReportCard.student?.classGrade} - {viewReportCard.student?.section}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Date of Birth</span>
                <span className="font-mono text-slate-800">{viewReportCard.student?.dob || "—"}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Father's Name</span>
                <span className="font-semibold text-slate-800">{viewReportCard.student?.fatherName}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Mother's Name</span>
                <span className="font-semibold text-slate-800">{viewReportCard.student?.motherName}</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Aggregate Score</span>
                <span className="font-black text-emerald-700 text-sm">
                  {viewReportCard.summary?.grandTotalObtained || viewReportCard.summary?.totalMarksObtained} / {viewReportCard.summary?.grandTotalMax || viewReportCard.summary?.totalMaxMarks} (
                  {viewReportCard.summary?.cumulativePercentage || viewReportCard.summary?.overallPercentage})
                </span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Final Grade</span>
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
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Class Teacher Remarks:</span>
              <p className="font-medium text-slate-800 italic mt-0.5">
                "{viewReportCard.summary?.teacherRemarks || "Consistent scholar with keen aptitude for holistic learning."}"
              </p>
            </div>

            {reportCardConfig.showGradingScale && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-[10px] text-slate-600 font-medium">
                <span className="font-bold text-slate-900 block mb-0.5">CBSE 8-Point Secondary Grading Scale</span>
                A1 (91-100) • A2 (81-90) • B1 (71-80) • B2 (61-70) • C1 (51-60) • C2 (41-50) • D (33-40) • E (Needs Support)
              </div>
            )}

            <div className="pt-6 grid grid-cols-3 text-center text-xs text-slate-700 border-t border-slate-200">
              <div>
                <div className="h-10"></div>
                {reportCardConfig.showClassTeacherSignature && (
                  <div className="border-t border-slate-400 mx-6 pt-1 font-bold">Class Teacher Signature</div>
                )}
              </div>
              <div>
                <div className="h-10 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border border-dashed border-slate-400 flex items-center justify-center text-[9px] text-slate-400 uppercase font-mono">
                    SEAL
                  </div>
                </div>
                {reportCardConfig.showPrincipalSignature && (
                  <div className="border-t border-slate-400 mx-6 pt-1 font-bold">Exam Controller Stamp</div>
                )}
              </div>
              <div>
                <div className="h-10"></div>
                {reportCardConfig.showPrincipalSignature && (
                  <div className="border-t border-slate-400 mx-6 pt-1 font-bold">Principal / Headmaster</div>
                )}
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </>
  );
}
