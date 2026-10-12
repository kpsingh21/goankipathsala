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

export interface InquiriesSectionProps {
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
  className?: any;
  schoolInquiries?: any[];
  inquiriesLoading?: any;
  inquiryStatusFilter?: any;
  setInquiryStatusFilter?: React.Dispatch<React.SetStateAction<any>>;
  inquiryTypeFilter?: any;
  setInquiryTypeFilter?: React.Dispatch<React.SetStateAction<any>>;
  inquirySearch?: any;
  setInquirySearch?: React.Dispatch<React.SetStateAction<any>>;
  fetchSchoolInquiries?: any;
  handleUpdateSchoolInquiryStatus?: any;
  handleDeleteSchoolInquiry?: any;
  [key: string]: any;
}

export default function InquiriesSection(props: InquiriesSectionProps) {
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
    className,
    schoolInquiries = [],
    inquiriesLoading,
    inquiryStatusFilter,
    setInquiryStatusFilter = () => {},
    inquiryTypeFilter,
    setInquiryTypeFilter = () => {},
    inquirySearch,
    setInquirySearch = () => {},
    fetchSchoolInquiries = () => {},
    handleUpdateSchoolInquiryStatus = () => {},
    handleDeleteSchoolInquiry = () => {},
  } = props;

  return (
    <>
      {activeSection === "inquiries" && isAdmin && (() => {
          const totalInq = schoolInquiries.length;
          const newCount = schoolInquiries.filter((i: any) => i.status === "NEW").length;
          const contactedCount = schoolInquiries.filter((i: any) => i.status === "CONTACTED").length;
          const admittedCount = schoolInquiries.filter((i: any) => i.status === "ADMITTED").length;

          const filteredInquiries = schoolInquiries.filter((inq: any) => {
            const matchStatus = inquiryStatusFilter === "ALL" || inq.status === inquiryStatusFilter;
            const matchType = inquiryTypeFilter === "ALL" || inq.inquiryType === inquiryTypeFilter;
            const q = inquirySearch.toLowerCase().trim();
            const matchSearch =
              !q ||
              (inq.parentName && inq.parentName.toLowerCase().includes(q)) ||
              (inq.studentName && inq.studentName.toLowerCase().includes(q)) ||
              (inq.phone && inq.phone.includes(q)) ||
              (inq.message && inq.message.toLowerCase().includes(q));
            return matchStatus && matchType && matchSearch;
          });

          const handleExportInquiries = () => {
            if (filteredInquiries.length === 0) return;
            const rows = filteredInquiries.map((inq: any) => ({
              "ID": inq.id,
              "Parent Name": inq.parentName,
              "Student Name": inq.studentName || "—",
              "Phone Number": inq.phone,
              "Email": inq.email || "—",
              "Grade Seeking": inq.gradeSeeking || "—",
              "Inquiry Category": inq.inquiryType,
              "Message": inq.message,
              "Status": inq.status,
              "Received Date": inq.createdAt ? new Date(inq.createdAt).toLocaleString("en-IN") : "—",
            }));
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Admissions_Inquiries");
            XLSX.writeFile(wb, `${slug}_admissions_inquiries_${new Date().toISOString().split("T")[0]}.xlsx`);
          };

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                    <span>📨</span> Admissions & Public Inquiries Desk
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Manage prospective student inquiries, parent admission requests, and fee queries submitted via your public portal.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchSchoolInquiries}
                    disabled={inquiriesLoading}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>🔄</span> Refresh
                  </button>
                  <button
                    onClick={handleExportInquiries}
                    disabled={filteredInquiries.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>📥</span> Export Excel
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Inquiries</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{totalInq}</span>
                    <span className="text-xs text-slate-500 font-medium">submissions</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-xs">
                  <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">New Leads</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-amber-900">{newCount}</span>
                    <span className="text-xs text-amber-700 font-medium">needs call</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 shadow-xs">
                  <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Followed Up</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-blue-900">{contactedCount}</span>
                    <span className="text-xs text-blue-700 font-medium">contacted</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Enrolled</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-900">{admittedCount}</span>
                    <span className="text-xs text-emerald-700 font-medium">admitted</span>
                  </div>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Search by parent name, student name, phone number, or query..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={inquiryStatusFilter}
                      onChange={(e) => setInquiryStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                    >
                      <option value="ALL">All Statuses ({schoolInquiries.length})</option>
                      <option value="NEW">● NEW Leads ({newCount})</option>
                      <option value="CONTACTED">● CONTACTED ({contactedCount})</option>
                      <option value="ADMITTED">● ADMITTED ({admittedCount})</option>
                      <option value="CLOSED">● CLOSED</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={inquiryTypeFilter}
                      onChange={(e) => setInquiryTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="New Student Admission & Enrolment">🌾 New Admissions</option>
                      <option value="School Fee Structure & Quarterly Installments">💳 Fee Structures</option>
                      <option value="Village Bus Route & Pickup Point Inquiry">🚌 Bus Routes</option>
                      <option value="Curriculum, CBSE Books & Smart Classrooms">📚 Curriculum & Books</option>
                      <option value="General Campus Question / Other">❓ General Inquiries</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Inquiries List */}
              {inquiriesLoading ? (
                <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                  <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading inquiries...
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <div className="text-3xl">📭</div>
                  <h4 className="font-bold text-slate-900 text-sm">No Inquiries Found</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {schoolInquiries.length === 0
                      ? "When parents or students submit the contact and admission form on your school website, their records will appear here in real time."
                      : "No inquiries matched your search or status filter."}
                  </p>
                  <Link
                    href={`/school/${slug}#contact`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition mt-2"
                  >
                    <span>🌐</span> View School Contact Form →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq: any) => {
                    const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9+]/g, "") : "";
                    const dateStr = inq.createdAt
                      ? new Date(inq.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—";

                    return (
                      <div
                        key={inq.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs transition space-y-4"
                      >
                        {/* Header: Parent, Student, Status, Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                              {(inq.parentName || "P").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                                  {inq.parentName}
                                </h3>
                                {inq.studentName && (
                                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                    Student: <strong className="text-slate-900">{inq.studentName}</strong>
                                  </span>
                                )}
                                {inq.gradeSeeking && (
                                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                    Grade: {inq.gradeSeeking}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                                <span>{inq.inquiryType || "Admission Inquiry"}</span>
                                <span>•</span>
                                <span className="font-mono">{dateStr}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                                inq.status === "NEW"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : inq.status === "CONTACTED"
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : inq.status === "ADMITTED"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : "bg-slate-100 text-slate-600 border-slate-300"
                              }`}
                            >
                              ● {inq.status}
                            </span>
                          </div>
                        </div>

                        {/* Message Box */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Inquiry Message:
                          </span>
                          {inq.message}
                        </div>

                        {/* Action Buttons Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {cleanPhone && (
                              <>
                                <a
                                  href={`tel:${cleanPhone}`}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
                                >
                                  <span>📞</span> Call {inq.phone}
                                </a>
                                <a
                                  href={`https://wa.me/${cleanPhone.replace("+", "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5"
                                >
                                  <span>💬</span> WhatsApp
                                </a>
                              </>
                            )}
                            {inq.email && (
                              <a
                                href={`mailto:${inq.email}`}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                              >
                                <span>✉️</span> {inq.email}
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase">
                              Status:
                            </label>
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateSchoolInquiryStatus(inq.id, e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 cursor-pointer focus:bg-white focus:border-blue-500 outline-none"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="ADMITTED">ADMITTED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleDeleteSchoolInquiry(inq.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition text-xs font-bold"
                              title="Delete inquiry"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
      })()}


    </>
  );
}
