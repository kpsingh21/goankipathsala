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

export interface NoticesSectionProps {
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
  noticeSubTab?: any;
  setNoticeSubTab?: React.Dispatch<React.SetStateAction<any>>;
  editNoticeModal?: any;
  setEditNoticeModal?: React.Dispatch<React.SetStateAction<any>>;
  noticesList?: any[];
  newNoticeTitle?: any;
  setNewNoticeTitle?: React.Dispatch<React.SetStateAction<any>>;
  newNoticeContent?: any;
  setNewNoticeContent?: React.Dispatch<React.SetStateAction<any>>;
  newNoticeCategory?: any;
  setNewNoticeCategory?: React.Dispatch<React.SetStateAction<any>>;
  newNoticePriority?: any;
  setNewNoticePriority?: React.Dispatch<React.SetStateAction<any>>;
  newNoticeIsPinned?: any;
  setNewNoticeIsPinned?: React.Dispatch<React.SetStateAction<any>>;
  category?: any;
  className?: any;
  handleCreateNotice?: any;
  handleDeleteNotice?: any;
  handleUpdateNotice?: any;
  [key: string]: any;
}

export default function NoticesSection(props: NoticesSectionProps) {
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
    noticeSubTab,
    setNoticeSubTab = () => {},
    editNoticeModal,
    setEditNoticeModal = () => {},
    noticesList = [],
    newNoticeTitle,
    setNewNoticeTitle = () => {},
    newNoticeContent,
    setNewNoticeContent = () => {},
    newNoticeCategory,
    setNewNoticeCategory = () => {},
    newNoticePriority,
    setNewNoticePriority = () => {},
    newNoticeIsPinned,
    setNewNoticeIsPinned = () => {},
    category,
    className,
    handleCreateNotice = () => {},
    handleDeleteNotice = () => {},
    handleUpdateNotice = () => {},
  } = props;

  return (
    <>
      {activeSection === "notices" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>📢</span> Digital Notice Board & Circulars
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Broadcast notices for examinations, sports events, holidays, and urgent circulars.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                <button
                  onClick={() => setNoticeSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    noticeSubTab === "list"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  📢 Active Circulars ({noticesList.length})
                </button>
                {!isTeacherOnly && (
                  <button
                    onClick={() => setNoticeSubTab("create")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      noticeSubTab === "create"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    ➕ Broadcast New Notice
                  </button>
                )}
              </div>
            </div>

            {isTeacherOnly && (
              <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-blue-950 font-medium flex items-center gap-2.5 shadow-2xs">
                <span className="text-base shrink-0">📢</span>
                <span>
                  <strong>School Notice Board:</strong> You have viewing access to active notices, circulars, and official announcements. Broadcasting or modifying notices is restricted to school administrators.
                </span>
              </div>
            )}

            {/* Sub-tab 1: List */}
            {noticeSubTab === "list" && (
              <div className="space-y-3">
                {noticesList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-200">
                    No active notices broadcasted yet.
                  </div>
                ) : (
                  noticesList.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start justify-between gap-4"
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
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {n.category}
                          </span>
                          <span className="text-[11px] text-slate-600 font-semibold font-mono">
                            Audience: {n.targetAudience} • {new Date(n.publishedAt || n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-950">{n.title}</h4>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">{n.content}</p>
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditNoticeModal(n)}
                            title="Edit Notice"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(n.id)}
                            title="Delete Notice"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
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
            {noticeSubTab === "create" && !isTeacherOnly && (
              <form onSubmit={handleCreateNotice} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                  >
                    Broadcast Notice
                  </button>
                </div>
              </form>
            )}
          </div>
      )}

      {editNoticeModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditNoticeModal(null)}
        >
          <div
            className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-950 flex items-center gap-2">
                <span>📢</span> Edit Notice Circular
              </h3>
              <button
                onClick={() => setEditNoticeModal(null)}
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateNotice} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  required
                  value={editNoticeModal.title || ""}
                  onChange={(e) => setEditNoticeModal({ ...editNoticeModal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-700 font-bold block mb-1">Category</label>
                  <select
                    value={editNoticeModal.category || "GENERAL"}
                    onChange={(e) => setEditNoticeModal({ ...editNoticeModal, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAMINATION">Exam</option>
                    <option value="EVENT">Event</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 font-bold block mb-1">Priority</label>
                  <select
                    value={editNoticeModal.priority || "NORMAL"}
                    onChange={(e) => setEditNoticeModal({ ...editNoticeModal, priority: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 font-bold block mb-1">Audience</label>
                  <select
                    value={editNoticeModal.targetAudience || "ALL"}
                    onChange={(e) => setEditNoticeModal({ ...editNoticeModal, targetAudience: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    <option value="ALL">All (Public)</option>
                    <option value="STUDENTS">Students & Parents</option>
                    <option value="FACULTY">Faculty & Staff</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Circular Content & Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={editNoticeModal.content || ""}
                  onChange={(e) => setEditNoticeModal({ ...editNoticeModal, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editNoticePin"
                  checked={Boolean(editNoticeModal.isPinned)}
                  onChange={(e) => setEditNoticeModal({ ...editNoticeModal, isPinned: e.target.checked })}
                  className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="editNoticePin" className="text-xs text-slate-800 font-semibold">
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
    </>
  );
}
