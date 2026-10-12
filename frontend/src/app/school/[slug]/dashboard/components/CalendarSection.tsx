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

export interface CalendarSectionProps {
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
  category?: any;
  className?: any;
  calendarEvents?: any[];
  calendarViewMode?: any;
  setCalendarViewMode?: React.Dispatch<React.SetStateAction<any>>;
  calendarCurrentDate?: any;
  setCalendarCurrentDate?: React.Dispatch<React.SetStateAction<any>>;
  calendarFilter?: any;
  setCalendarFilter?: React.Dispatch<React.SetStateAction<any>>;
  addCalendarModal?: any;
  setAddCalendarModal?: React.Dispatch<React.SetStateAction<any>>;
  newCalTitle?: any;
  setNewCalTitle?: React.Dispatch<React.SetStateAction<any>>;
  newCalCategory?: any;
  setNewCalCategory?: React.Dispatch<React.SetStateAction<any>>;
  newCalStartDate?: any;
  setNewCalStartDate?: React.Dispatch<React.SetStateAction<any>>;
  newCalEndDate?: any;
  setNewCalEndDate?: React.Dispatch<React.SetStateAction<any>>;
  newCalDesc?: any;
  setNewCalDesc?: React.Dispatch<React.SetStateAction<any>>;
  newCalTargetAudience?: any;
  setNewCalTargetAudience?: React.Dispatch<React.SetStateAction<any>>;
  selectedCalendarDay?: { dateStr: string; events: any[] } | null;
  setSelectedCalendarDay?: React.Dispatch<React.SetStateAction<any>>;
  editCalendarModal?: any;
  setEditCalendarModal?: React.Dispatch<React.SetStateAction<any>>;
  editCalTitle?: any;
  setEditCalTitle?: React.Dispatch<React.SetStateAction<any>>;
  editCalCategory?: any;
  setEditCalCategory?: React.Dispatch<React.SetStateAction<any>>;
  editCalStartDate?: any;
  setEditCalStartDate?: React.Dispatch<React.SetStateAction<any>>;
  editCalEndDate?: any;
  setEditCalEndDate?: React.Dispatch<React.SetStateAction<any>>;
  editCalDesc?: any;
  setEditCalDesc?: React.Dispatch<React.SetStateAction<any>>;
  editCalTargetAudience?: any;
  setEditCalTargetAudience?: React.Dispatch<React.SetStateAction<any>>;
  examsList?: any[];
  handleCreateCalendarEvent?: any;
  handleDeleteCalendarEvent?: any;
  handleOpenEditCalendarEvent?: any;
  handleUpdateCalendarEvent?: any;
  [key: string]: any;
}

export default function CalendarSection(props: CalendarSectionProps) {
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
    category,
    className,
    calendarEvents = [],
    calendarViewMode,
    setCalendarViewMode = () => {},
    calendarCurrentDate,
    setCalendarCurrentDate = () => {},
    calendarFilter,
    setCalendarFilter = () => {},
    addCalendarModal,
    setAddCalendarModal = () => {},
    newCalTitle,
    setNewCalTitle = () => {},
    newCalCategory,
    setNewCalCategory = () => {},
    newCalStartDate,
    setNewCalStartDate = () => {},
    newCalEndDate,
    setNewCalEndDate = () => {},
    newCalDesc,
    setNewCalDesc = () => {},
    newCalTargetAudience,
    setNewCalTargetAudience = () => {},
    selectedCalendarDay = null,
    setSelectedCalendarDay = () => {},
    editCalendarModal,
    setEditCalendarModal = () => {},
    editCalTitle,
    setEditCalTitle = () => {},
    editCalCategory,
    setEditCalCategory = () => {},
    editCalStartDate,
    setEditCalStartDate = () => {},
    editCalEndDate,
    setEditCalEndDate = () => {},
    editCalDesc,
    setEditCalDesc = () => {},
    editCalTargetAudience,
    setEditCalTargetAudience = () => {},
    examsList = [],
    handleCreateCalendarEvent = () => {},
    handleDeleteCalendarEvent = () => {},
    handleOpenEditCalendarEvent = () => {},
    handleUpdateCalendarEvent = () => {},
  } = props;

  return (
    <>
      {activeSection === "calendar" && (() => {
          const year = calendarCurrentDate.getFullYear();
          const month = calendarCurrentDate.getMonth();
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          const currentMonthName = monthNames[month];

          // Compute days for 6-row calendar grid (42 cells)
          const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const daysInPrevMonth = new Date(year, month, 0).getDate();

          const calendarDays = [];

          // Previous month trailing days
          for (let i = firstDayIndex - 1; i >= 0; i--) {
            const d = daysInPrevMonth - i;
            const prevDate = new Date(year, month - 1, d);
            const dateStr = prevDate.toISOString().split("T")[0];
            calendarDays.push({
              day: d,
              dateStr,
              isCurrentMonth: false,
              isToday: false,
              events: calendarEvents.filter((ev) => {
                const s = ev.startDate || "";
                const e = ev.endDate || s;
                return dateStr >= s && dateStr <= e;
              }),
            });
          }

          // Current month days
          const todayStr = new Date().toISOString().split("T")[0];
          for (let d = 1; d <= daysInMonth; d++) {
            const mStr = String(month + 1).padStart(2, "0");
            const dStr = String(d).padStart(2, "0");
            const dateStr = `${year}-${mStr}-${dStr}`;
            calendarDays.push({
              day: d,
              dateStr,
              isCurrentMonth: true,
              isToday: dateStr === todayStr,
              events: calendarEvents.filter((ev) => {
                const s = ev.startDate || "";
                const e = ev.endDate || s;
                return dateStr >= s && dateStr <= e;
              }),
            });
          }

          // Next month leading days
          const remainingDays = 42 - calendarDays.length;
          for (let d = 1; d <= remainingDays && calendarDays.length < 42; d++) {
            const nextDate = new Date(year, month + 1, d);
            const dateStr = nextDate.toISOString().split("T")[0];
            calendarDays.push({
              day: d,
              dateStr,
              isCurrentMonth: false,
              isToday: false,
              events: calendarEvents.filter((ev) => {
                const s = ev.startDate || "";
                const e = ev.endDate || s;
                return dateStr >= s && dateStr <= e;
              }),
            });
          }

          // Categorized counts
          const pubHolidaysCount = calendarEvents.filter((e) => e.category === "PUBLIC_HOLIDAY").length;
          const examsCount = calendarEvents.filter((e) => e.category === "EXAM" || e.isExam).length;
          const vacationsCount = calendarEvents.filter((e) => e.category === "VACATION" || e.category === "SCHOOL_HOLIDAY").length;
          const eventsCount = calendarEvents.filter((e) => ["EVENT", "PTM", "SPORTS"].includes(e.category)).length;

          // Filter events by selected category
          const filteredEvents = calendarEvents.filter((ev) => {
            if (calendarFilter === "PUBLIC_HOLIDAY") return ev.category === "PUBLIC_HOLIDAY";
            if (calendarFilter === "EXAM") return ev.category === "EXAM" || ev.isExam;
            if (calendarFilter === "VACATION") return ev.category === "VACATION" || ev.category === "SCHOOL_HOLIDAY";
            if (calendarFilter === "EVENT") return ["EVENT", "PTM", "SPORTS"].includes(ev.category);
            return true;
          });

          // Upcoming items
          const upcomingItems = calendarEvents
            .filter((e) => (e.endDate || e.startDate) >= todayStr)
            .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""))
            .slice(0, 5);

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                    <span>📅</span> School Calendar & Holiday Planner
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Academic calendar tracking public holidays, school examinations, vacation breaks, and campus event timetables.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Mode Switcher */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCalendarViewMode("month")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        calendarViewMode === "month"
                          ? "bg-white text-blue-700 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🗓️ Month Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarViewMode("list")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        calendarViewMode === "list"
                          ? "bg-white text-blue-700 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      📋 Schedule List
                    </button>
                  </div>

                  {/* Add Event Button for Admin / Teachers */}
                  {!isDriverOnly && !isAccountantOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewCalStartDate(todayStr);
                        setNewCalEndDate("");
                        setAddCalendarModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                    >
                      <span>➕</span>
                      <span>Add Event / Holiday</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stat Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setCalendarFilter(calendarFilter === "PUBLIC_HOLIDAY" ? "ALL" : "PUBLIC_HOLIDAY")}
                  className={`p-4 rounded-2xl border text-left transition ${
                    calendarFilter === "PUBLIC_HOLIDAY"
                      ? "bg-rose-50 border-rose-300 ring-2 ring-rose-400"
                      : "bg-white border-slate-200 hover:border-rose-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-rose-600 mb-1">
                    <span className="text-sm">🇮🇳 🎉</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                      Gazetted
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{pubHolidaysCount}</div>
                  <div className="text-xs font-semibold text-slate-600">Public Holidays</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCalendarFilter(calendarFilter === "EXAM" ? "ALL" : "EXAM")}
                  className={`p-4 rounded-2xl border text-left transition ${
                    calendarFilter === "EXAM"
                      ? "bg-purple-50 border-purple-300 ring-2 ring-purple-400"
                      : "bg-white border-slate-200 hover:border-purple-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-purple-600 mb-1">
                    <span className="text-sm">📝 📊</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      Exams
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{examsCount}</div>
                  <div className="text-xs font-semibold text-slate-600">Exam Schedules</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCalendarFilter(calendarFilter === "VACATION" ? "ALL" : "VACATION")}
                  className={`p-4 rounded-2xl border text-left transition ${
                    calendarFilter === "VACATION"
                      ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400"
                      : "bg-white border-slate-200 hover:border-amber-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-amber-600 mb-1">
                    <span className="text-sm">🏖️ ☀️</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Breaks
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{vacationsCount}</div>
                  <div className="text-xs font-semibold text-slate-600">Vacations & Recess</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCalendarFilter(calendarFilter === "EVENT" ? "ALL" : "EVENT")}
                  className={`p-4 rounded-2xl border text-left transition ${
                    calendarFilter === "EVENT"
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400"
                      : "bg-white border-slate-200 hover:border-emerald-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-emerald-600 mb-1">
                    <span className="text-sm">🏆 👥</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Campus
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{eventsCount}</div>
                  <div className="text-xs font-semibold text-slate-600">Events & PTMs</div>
                </button>
              </div>

              {/* Month Navigation Toolbar */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarCurrentDate(new Date(year, month - 1, 1));
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs flex items-center gap-1"
                    title="Previous Month"
                  >
                    <span>◀</span>
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarCurrentDate(new Date())}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarCurrentDate(new Date(year, month + 1, 1));
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs flex items-center gap-1"
                    title="Next Month"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span>▶</span>
                  </button>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 ml-2">
                    {currentMonthName} {year}
                  </h3>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Filter:</span>
                  {[
                    { id: "ALL", label: "All" },
                    { id: "PUBLIC_HOLIDAY", label: "🔴 Holidays" },
                    { id: "EXAM", label: "🟣 Exams" },
                    { id: "VACATION", label: "🟡 Vacations" },
                    { id: "EVENT", label: "🟢 Events" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setCalendarFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        calendarFilter === f.id
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View 1: Month Grid */}
              {calendarViewMode === "month" && (
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center font-bold text-xs py-3 text-slate-700">
                    <span className="text-rose-600">Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span className="text-slate-600">Sat</span>
                  </div>

                  {/* 42-cell Grid */}
                  <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                    {calendarDays.map((cell, idx) => {
                      const isSunday = idx % 7 === 0;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (cell.events.length > 0) {
                              setSelectedCalendarDay({ dateStr: cell.dateStr, events: cell.events });
                            } else {
                              setNewCalStartDate(cell.dateStr);
                              setNewCalEndDate(cell.dateStr);
                              setAddCalendarModal(true);
                            }
                          }}
                          className={`min-h-[92px] sm:min-h-[110px] p-2 flex flex-col justify-between transition cursor-pointer group ${
                            cell.isCurrentMonth
                              ? cell.isToday
                                ? "bg-blue-50/40 ring-2 ring-inset ring-blue-500"
                                : "bg-white hover:bg-slate-50/80"
                              : "bg-slate-50/40 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center ${
                                cell.isToday
                                  ? "bg-blue-600 text-white shadow-2xs"
                                  : isSunday && cell.isCurrentMonth
                                  ? "text-rose-600 font-black"
                                  : cell.isCurrentMonth
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              }`}
                            >
                              {cell.day}
                            </span>

                            {cell.events.length > 0 && (
                              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                {cell.events.length}
                              </span>
                            )}
                          </div>

                          {/* Event Indicators / Pills inside Day Cell */}
                          <div className="space-y-1 mt-1 overflow-hidden">
                            {cell.events.slice(0, 2).map((ev: any) => {
                              const isHoliday = ev.category === "PUBLIC_HOLIDAY";
                              const isExam = ev.category === "EXAM" || ev.isExam;
                              const isVacation = ev.category === "VACATION" || ev.category === "SCHOOL_HOLIDAY";

                              let colorClass = "bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500";
                              if (isHoliday) colorClass = "bg-rose-50 text-rose-800 border-l-2 border-rose-500";
                              else if (isExam) colorClass = "bg-purple-50 text-purple-800 border-l-2 border-purple-500";
                              else if (isVacation) colorClass = "bg-amber-50 text-amber-800 border-l-2 border-amber-500";

                              return (
                                <div
                                  key={ev.id}
                                  title={`${ev.title} - ${ev.description || ""}`}
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate ${colorClass}`}
                                >
                                  {ev.title}
                                </div>
                              );
                            })}
                            {cell.events.length > 2 && (
                              <div className="text-[9px] font-bold text-slate-500 pl-1">
                                +{cell.events.length - 2} more...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 2: List / Agenda View */}
              {calendarViewMode === "list" && (
                <div className="space-y-3">
                  {filteredEvents.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                      <div className="text-3xl mb-2">🗓️</div>
                      <div className="text-sm font-bold text-slate-900">No events found for this filter.</div>
                      <div className="text-xs text-slate-500 mt-1">Try switching filter tabs or schedule a new event.</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredEvents.map((ev) => {
                        const isHoliday = ev.category === "PUBLIC_HOLIDAY";
                        const isExam = ev.category === "EXAM" || ev.isExam;
                        const isVacation = ev.category === "VACATION" || ev.category === "SCHOOL_HOLIDAY";

                        let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
                        let typeLabel = "Campus Event";
                        if (isHoliday) {
                          badgeColor = "bg-rose-100 text-rose-800 border-rose-200";
                          typeLabel = "Public Holiday";
                        } else if (isExam) {
                          badgeColor = "bg-purple-100 text-purple-800 border-purple-200";
                          typeLabel = "Examination";
                        } else if (isVacation) {
                          badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                          typeLabel = "Vacation Break";
                        }

                        return (
                          <div
                            key={ev.id}
                            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition flex flex-col justify-between gap-3"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                                  {typeLabel}
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                                  📅 {ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `➔ ${ev.endDate}` : ""}
                                </span>
                              </div>

                              <h4 className="font-black text-slate-950 text-sm">{ev.title}</h4>
                              {ev.description && (
                                <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                              <span>Target: {ev.targetAudience || ev.classGradeName || "All School"}</span>
                              <div className="flex items-center gap-2">
                                {!isExam && !isTeacherOnly && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditCalendarEvent(ev)}
                                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition flex items-center gap-1 text-[11px] border border-blue-200"
                                      title="Edit Event / Holiday"
                                    >
                                      <span>✏️</span> Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCalendarEvent(ev.id, ev.title)}
                                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold transition flex items-center gap-1 text-[11px] border border-rose-200"
                                      title="Remove from Calendar"
                                    >
                                      <span>🗑️</span> Remove
                                    </button>
                                  </>
                                )}
                                {isExam && (
                                  <button
                                    type="button"
                                    onClick={() => setActiveSection("exams")}
                                    className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px] flex items-center gap-1 border border-purple-200"
                                  >
                                    <span>📝</span> View in Exams
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* School Examination Timetable Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border border-indigo-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
                      <span>📝</span> School Examination Timetable & Schedules
                    </h3>
                    <p className="text-xs text-indigo-800/80 font-medium mt-0.5">
                      Synchronized exam dates for upcoming term tests, quarterly examinations, and board assessments.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection("exams")}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs transition shadow-2xs flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>📊 Go to Exams & Results</span>
                    <span>➔</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {examsList.length === 0 ? (
                    <div className="col-span-full p-4 rounded-xl bg-white/80 border border-indigo-100 text-center text-xs text-indigo-700">
                      No examinations scheduled yet. Create an exam in the Exams section to see its timetable here!
                    </div>
                  ) : (
                    examsList.map((ex: any) => (
                      <div
                        key={ex.id}
                        className="p-3.5 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs truncate max-w-[180px]">{ex.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                            {ex.classGrade?.name || "All Classes"}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-indigo-700 font-bold">
                          📅 {ex.startDate ? new Date(ex.startDate).toLocaleDateString() : "TBD"}{" "}
                          {ex.endDate ? `➔ ${new Date(ex.endDate).toLocaleDateString()}` : ""}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Academic Year: {ex.academicYear?.name || "2026-2027"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
      })()}

      {addCalendarModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setAddCalendarModal(false)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                <span>➕</span> Schedule Event / Holiday
              </h3>
              <button
                type="button"
                onClick={() => setAddCalendarModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCalendarEvent} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Event / Holiday Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Break, Annual Sports Meet, Term 1 Exam"
                  value={newCalTitle}
                  onChange={(e) => setNewCalTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Event Category *
                  </label>
                  <select
                    value={newCalCategory}
                    onChange={(e) => setNewCalCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="PUBLIC_HOLIDAY">🔴 Public Holiday</option>
                    <option value="EXAM">🟣 School Examination</option>
                    <option value="VACATION">🟡 Vacation / Break</option>
                    <option value="EVENT">🟢 Campus Event / Activity</option>
                    <option value="PTM">👥 Parent-Teacher Meet (PTM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newCalTargetAudience}
                    onChange={(e) => setNewCalTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="ALL">All School</option>
                    <option value="STUDENTS">Students & Parents</option>
                    <option value="STAFF">Faculty & Staff Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newCalStartDate}
                    onChange={(e) => setNewCalStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newCalEndDate}
                    min={newCalStartDate}
                    onChange={(e) => setNewCalEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Description / Timetable Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional details, exam session times, dress code, or holiday circular notes..."
                  value={newCalDesc}
                  onChange={(e) => setNewCalDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddCalendarModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  {loading ? "Scheduling..." : "Schedule Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editCalendarModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditCalendarModal(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                <span>✏️</span> Edit Event / Holiday
              </h3>
              <button
                type="button"
                onClick={() => setEditCalendarModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCalendarEvent} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Event / Holiday Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Break, Annual Sports Meet"
                  value={editCalTitle}
                  onChange={(e) => setEditCalTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Event Category *
                  </label>
                  <select
                    value={editCalCategory}
                    onChange={(e) => setEditCalCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="PUBLIC_HOLIDAY">🔴 Public Holiday</option>
                    <option value="VACATION">🟡 Vacation / Break</option>
                    <option value="EVENT">🟢 Campus Event / Activity</option>
                    <option value="PTM">👥 Parent-Teacher Meet (PTM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={editCalTargetAudience}
                    onChange={(e) => setEditCalTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="ALL">All School</option>
                    <option value="STUDENTS">Students & Parents</option>
                    <option value="STAFF">Faculty & Staff Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editCalStartDate}
                    onChange={(e) => setEditCalStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={editCalEndDate}
                    min={editCalStartDate}
                    onChange={(e) => setEditCalEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Description / Timetable Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional details, circular notes, or dress code..."
                  value={editCalDesc}
                  onChange={(e) => setEditCalDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditCalendarModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCalendarDay && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedCalendarDay(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                  <span>🗓️</span> Day Schedule
                </h3>
                <span className="font-mono text-xs font-bold text-blue-700">
                  {selectedCalendarDay.dateStr}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalendarDay(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedCalendarDay.events.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No scheduled holidays or exams for this date.
                </div>
              ) : (
                selectedCalendarDay.events.map((ev) => {
                  const isHoliday = ev.category === "PUBLIC_HOLIDAY";
                  const isExam = ev.category === "EXAM" || ev.isExam;
                  const isVacation = ev.category === "VACATION" || ev.category === "SCHOOL_HOLIDAY";

                  let badge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                  let label = "Event";
                  if (isHoliday) {
                    badge = "bg-rose-100 text-rose-800 border-rose-200";
                    label = "Public Holiday";
                  } else if (isExam) {
                    badge = "bg-purple-100 text-purple-800 border-purple-200";
                    label = "Exam Schedule";
                  } else if (isVacation) {
                    badge = "bg-amber-100 text-amber-800 border-amber-200";
                    label = "Vacation Break";
                  }

                  return (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge}`}>
                          {label}
                        </span>
                        {!isExam && !isTeacherOnly && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCalendarDay(null);
                                handleOpenEditCalendarEvent(ev);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold border border-blue-200 transition"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCalendarEvent(ev.id, ev.title)}
                              className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold border border-rose-200 transition"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                        {isExam && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCalendarDay(null);
                              setActiveSection("exams");
                            }}
                            className="text-purple-700 hover:text-purple-900 font-bold text-[11px] flex items-center gap-1"
                          >
                            <span>📝</span> View in Exams
                          </button>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                      {ev.description && (
                        <p className="text-xs text-slate-600">{ev.description}</p>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono">
                        Duration: {ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `to ${ev.endDate}` : ""}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setNewCalStartDate(selectedCalendarDay.dateStr);
                  setNewCalEndDate(selectedCalendarDay.dateStr);
                  setSelectedCalendarDay(null);
                  setAddCalendarModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition border border-blue-200"
              >
                + Add Event for this Date
              </button>
              <button
                type="button"
                onClick={() => setSelectedCalendarDay(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
