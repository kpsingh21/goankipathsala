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

export interface FeesSectionProps {
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
  feeSubTab?: any;
  setFeeSubTab?: React.Dispatch<React.SetStateAction<any>>;
  feeRevenueSummary?: any;
  classesList?: any[];
  firstName?: any;
  lastName?: any;
  category?: any;
  fatherName?: any;
  parentPhone?: any;
  className?: any;
  sectionName?: any;
  feeStructures?: any[];
  invoices?: any[];
  newFeeName?: any;
  setNewFeeName?: React.Dispatch<React.SetStateAction<any>>;
  newFeeFrequency?: any;
  setNewFeeFrequency?: React.Dispatch<React.SetStateAction<any>>;
  newFeeClasses?: any[];
  setNewFeeClasses?: React.Dispatch<React.SetStateAction<any[]>>;
  feeFilterClass?: any;
  setFeeFilterClass?: React.Dispatch<React.SetStateAction<any>>;
  feeFilterStructure?: any;
  setFeeFilterStructure?: React.Dispatch<React.SetStateAction<any>>;
  feeFilterStatus?: any;
  setFeeFilterStatus?: React.Dispatch<React.SetStateAction<any>>;
  selectedInvoiceIds?: any[];
  setSelectedInvoiceIds?: React.Dispatch<React.SetStateAction<any[]>>;
  bulkPrintInvoicesModal?: any[] | null;
  setBulkPrintInvoicesModal?: React.Dispatch<React.SetStateAction<any>>;
  feeComponents?: any[];
  setFeeComponents?: React.Dispatch<React.SetStateAction<any[]>>;
  viewInvoiceReceipt?: any;
  setViewInvoiceReceipt?: React.Dispatch<React.SetStateAction<any>>;
  classInvoiceGenModal?: any;
  setClassInvoiceGenModal?: React.Dispatch<React.SetStateAction<any>>;
  classInvoiceGenClass?: any;
  setClassInvoiceGenClass?: React.Dispatch<React.SetStateAction<any>>;
  classInvoiceGenStructureId?: any;
  setClassInvoiceGenStructureId?: React.Dispatch<React.SetStateAction<any>>;
  adjustInvoiceModal?: any;
  setAdjustInvoiceModal?: React.Dispatch<React.SetStateAction<any>>;
  adjustType?: any;
  setAdjustType?: React.Dispatch<React.SetStateAction<any>>;
  adjustAmount?: any;
  setAdjustAmount?: React.Dispatch<React.SetStateAction<any>>;
  adjustReason?: any;
  setAdjustReason?: React.Dispatch<React.SetStateAction<any>>;
  handleGenerateClassInvoices?: any;
  handleAdjustInvoice?: any;
  handleDeleteInvoice?: any;
  handleResetInvoices?: any;
  handleCreateFeeStructure?: any;
  handleDeleteFeeStructure?: any;
  handleBatchIssueClassInvoices?: any;
  handleRecordPayment?: any;
  [key: string]: any;
}

export default function FeesSection(props: FeesSectionProps) {
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
    feeSubTab,
    setFeeSubTab = () => {},
    feeRevenueSummary,
    classesList = [],
    firstName,
    lastName,
    category,
    fatherName,
    parentPhone,
    className,
    sectionName,
    feeStructures = [],
    invoices = [],
    newFeeName,
    setNewFeeName = () => {},
    newFeeFrequency,
    setNewFeeFrequency = () => {},
    newFeeClasses = [],
    setNewFeeClasses = () => {},
    feeFilterClass,
    setFeeFilterClass = () => {},
    feeFilterStructure,
    setFeeFilterStructure = () => {},
    feeFilterStatus,
    setFeeFilterStatus = () => {},
    selectedInvoiceIds = [],
    setSelectedInvoiceIds = () => {},
    bulkPrintInvoicesModal = null,
    setBulkPrintInvoicesModal = () => {},
    feeComponents = [],
    setFeeComponents = () => {},
    viewInvoiceReceipt,
    setViewInvoiceReceipt = () => {},
    classInvoiceGenModal,
    setClassInvoiceGenModal = () => {},
    classInvoiceGenClass,
    setClassInvoiceGenClass = () => {},
    classInvoiceGenStructureId,
    setClassInvoiceGenStructureId = () => {},
    adjustInvoiceModal,
    setAdjustInvoiceModal = () => {},
    adjustType,
    setAdjustType = () => {},
    adjustAmount,
    setAdjustAmount = () => {},
    adjustReason,
    setAdjustReason = () => {},
    handleGenerateClassInvoices = () => {},
    handleAdjustInvoice = () => {},
    handleDeleteInvoice = () => {},
    handleResetInvoices = () => {},
    handleCreateFeeStructure = () => {},
    handleDeleteFeeStructure = () => {},
    handleBatchIssueClassInvoices = () => {},
    handleRecordPayment = () => {},
  } = props;

  return (
    <>
      {activeSection === "fees" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>💳</span> School Fees & Receipt
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Manage fee structures, issue batch invoices, and generate student fee receipts.
                </p>
              </div>

              {/* Three-tab switcher */}
              {!isTeacherOnly && (
                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                  <button
                    onClick={() => setFeeSubTab("overview")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      feeSubTab === "overview"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    📊 Overall Revenue Overview
                  </button>
                  <button
                    onClick={() => setFeeSubTab("invoices")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      feeSubTab === "invoices"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    💳 Student Fee Receipts & Invoices ({invoices.length})
                  </button>
                  <button
                    onClick={() => setFeeSubTab("catalog")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      feeSubTab === "catalog"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    ⚙️ Fee Structures & Catalog ({feeStructures.length})
                  </button>
                </div>
              )}
            </div>

            {/* Sub-tab 0: Overall Revenue Overview Dashboard */}
            {feeSubTab === "overview" && (() => {
              const summary = feeRevenueSummary?.summary || {
                totalDemand: invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0),
                totalCollected: invoices.reduce((acc, inv) => acc + (Number(inv.paidAmount) || 0), 0),
                totalOutstanding: invoices.reduce((acc, inv) => acc + Math.max(0, (Number(inv.totalAmount) || 0) - (Number(inv.paidAmount) || 0)), 0),
                collectionRate: invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0) > 0
                  ? Math.round((invoices.reduce((acc, inv) => acc + (Number(inv.paidAmount) || 0), 0) / invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0)) * 1000) / 10
                  : 0,
                totalInvoices: invoices.length,
                paidCount: invoices.filter((i) => i.status === "PAID").length,
                partialCount: invoices.filter((i) => i.status === "PARTIALLY_PAID" || i.status === "PARTIAL").length,
                pendingCount: invoices.filter((i) => i.status === "PENDING").length,
                overdueCount: invoices.filter((i) => i.status === "OVERDUE").length,
              };

              const classBreakdown: Array<{
                className: string;
                totalDemand: number;
                totalCollected: number;
                totalOutstanding: number;
                studentCount?: number;
                invoiceCount: number;
              }> = feeRevenueSummary?.classBreakdown || (() => {
                const map: Record<string, any> = {};
                invoices.forEach((inv) => {
                  const cName = inv.enrollment?.section?.classGrade?.name || inv.student?.classGrade || inv.feeStructure?.classGrade || "Unassigned";
                  if (!map[cName]) {
                    map[cName] = { className: cName, totalDemand: 0, totalCollected: 0, totalOutstanding: 0, invoiceCount: 0, studentCount: 0 };
                  }
                  const t = Number(inv.totalAmount) || 0;
                  const p = Number(inv.paidAmount) || 0;
                  map[cName].totalDemand += t;
                  map[cName].totalCollected += p;
                  map[cName].totalOutstanding += Math.max(0, t - p);
                  map[cName].invoiceCount += 1;
                });
                return Object.values(map).sort((a: any, b: any) => b.totalDemand - a.totalDemand);
              })();

              const structureBreakdown: Array<{
                structureName: string;
                totalDemand: number;
                totalCollected: number;
                totalOutstanding: number;
                invoiceCount: number;
              }> = feeRevenueSummary?.structureBreakdown || (() => {
                const map: Record<string, any> = {};
                invoices.forEach((inv) => {
                  const sName = inv.feeStructure?.name || inv.title || "General Fee";
                  if (!map[sName]) {
                    map[sName] = { structureName: sName, totalDemand: 0, totalCollected: 0, totalOutstanding: 0, invoiceCount: 0 };
                  }
                  const t = Number(inv.totalAmount) || 0;
                  const p = Number(inv.paidAmount) || 0;
                  map[sName].totalDemand += t;
                  map[sName].totalCollected += p;
                  map[sName].totalOutstanding += Math.max(0, t - p);
                  map[sName].invoiceCount += 1;
                });
                return Object.values(map).sort((a: any, b: any) => b.totalDemand - a.totalDemand);
              })();

              const recoveryPct = Number(summary.totalDemand) > 0
                ? Math.min(100, Math.round((Number(summary.totalCollected) / Number(summary.totalDemand)) * 100))
                : 0;

              return (
                <div className="space-y-6">
                  {/* Top Header Banner */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      <h3 className="text-base font-black tracking-tight">School Revenue & Dues Overview</h3>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        Live Financials
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 font-medium mt-1">
                      High-level summary of total school fees assessed (demand), actual collections received, and remaining dues.
                    </p>
                  </div>

                  {/* 3 Primary Big Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. Total School Fees / Demand */}
                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <span>Total School Fees (Demand)</span>
                        <span className="text-lg">🏛️</span>
                      </div>
                      <div className="text-3xl font-black text-slate-950 font-mono tracking-tight">
                        ₹{Number(summary.totalDemand).toLocaleString("en-IN")}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{summary.totalInvoices} vouchers billed</span>
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-[10px]">
                          100% Assessed
                        </span>
                      </div>
                    </div>

                    {/* 2. Total Collected / What We Got */}
                    <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200 shadow-sm relative overflow-hidden group hover:shadow-md transition">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-8 -mt-8 pointer-events-none" />
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                        <span>Fees Collected (What We Got)</span>
                        <span className="text-lg">💰</span>
                      </div>
                      <div className="text-3xl font-black text-emerald-700 font-mono tracking-tight">
                        ₹{Number(summary.totalCollected).toLocaleString("en-IN")}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-emerald-700">
                        <span>Deposited & verified</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 text-[10px]">
                          ✓ {summary.collectionRate}% Recovered
                        </span>
                      </div>
                    </div>

                    {/* 3. Total Remaining / What Is Left */}
                    <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200 shadow-sm relative overflow-hidden group hover:shadow-md transition">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-8 -mt-8 pointer-events-none" />
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                        <span>Remaining Dues (What Is Left)</span>
                        <span className="text-lg">⏳</span>
                      </div>
                      <div className="text-3xl font-black text-amber-700 font-mono tracking-tight">
                        ₹{Number(summary.totalOutstanding).toLocaleString("en-IN")}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-amber-700">
                        <span>Outstanding to collect</span>
                        <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 text-[10px]">
                          {Number(summary.totalDemand) > 0 ? (100 - Number(summary.collectionRate)).toFixed(1) : 0}% Pending
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Recovery Progress Bar */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">Overall Collection Progress: </span>
                        <span className="text-slate-600 font-medium">
                          ₹{Number(summary.totalCollected).toLocaleString("en-IN")} collected out of ₹{Number(summary.totalDemand).toLocaleString("en-IN")} total billed
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-blue-700">
                        {summary.collectionRate}% Complete
                      </span>
                    </div>

                    {/* Stacked Progress Bar */}
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200 shadow-inner">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500 rounded-l-full"
                        style={{ width: `${recoveryPct}%` }}
                        title={`Collected: ₹${Number(summary.totalCollected).toLocaleString("en-IN")} (${recoveryPct}%)`}
                      />
                      <div
                        className="bg-amber-400 h-full transition-all duration-500"
                        style={{ width: `${100 - recoveryPct}%` }}
                        title={`Outstanding: ₹${Number(summary.totalOutstanding).toLocaleString("en-IN")} (${100 - recoveryPct}%)`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Collected: ₹{Number(summary.totalCollected).toLocaleString("en-IN")} ({recoveryPct}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span>Balance Left: ₹{Number(summary.totalOutstanding).toLocaleString("en-IN")} ({100 - recoveryPct}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Status Breakdown Interactive Grid */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span>🏷️</span> Fee Voucher Status Breakdown (Click to filter list)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFeeFilterStatus("PAID");
                          setFeeSubTab("invoices");
                        }}
                        className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-md transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Fully Paid</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono mt-1">
                          {summary.paidCount}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium group-hover:underline">
                          View Paid Vouchers →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFeeFilterStatus("PARTIAL");
                          setFeeSubTab("invoices");
                        }}
                        className="p-3.5 rounded-2xl bg-white border border-blue-200 text-left hover:border-blue-500 hover:shadow-md transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Partially Paid</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono mt-1">
                          {summary.partialCount}
                        </div>
                        <span className="text-[10px] text-blue-700 font-medium group-hover:underline">
                          View Partial Vouchers →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFeeFilterStatus("PENDING");
                          setFeeSubTab("invoices");
                        }}
                        className="p-3.5 rounded-2xl bg-white border border-amber-200 text-left hover:border-amber-500 hover:shadow-md transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Pending / Unpaid</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono mt-1">
                          {summary.pendingCount}
                        </div>
                        <span className="text-[10px] text-amber-700 font-medium group-hover:underline">
                          View Unpaid Vouchers →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFeeFilterStatus("OVERDUE");
                          setFeeSubTab("invoices");
                        }}
                        className="p-3.5 rounded-2xl bg-white border border-rose-200 text-left hover:border-rose-500 hover:shadow-md transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Overdue</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono mt-1">
                          {summary.overdueCount}
                        </div>
                        <span className="text-[10px] text-rose-700 font-medium group-hover:underline">
                          View Overdue Vouchers →
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Class-Wise Financial Breakdown Table */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-950 flex items-center gap-2">
                          <span>🏫</span> Class-Wise Revenue & Recovery Ledger
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Breakdown of fees billed, received, and remaining dues for each individual grade.
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">
                        {classBreakdown.length} Classes Tracked
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                            <th className="py-3 px-4">Class Grade</th>
                            <th className="py-3 px-4 text-center">Vouchers</th>
                            <th className="py-3 px-4 text-right">Total Demand</th>
                            <th className="py-3 px-4 text-right">Collected (Got)</th>
                            <th className="py-3 px-4 text-right">Remaining (Left)</th>
                            <th className="py-3 px-4 text-center">Recovery %</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {classBreakdown.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400">
                                No fee invoices generated yet. Generate invoices to view class breakdown.
                              </td>
                            </tr>
                          ) : (
                            classBreakdown.map((row) => {
                              const pct = row.totalDemand > 0
                                ? Math.min(100, Math.round((row.totalCollected / row.totalDemand) * 100))
                                : 0;
                              return (
                                <tr key={row.className} className="hover:bg-slate-50/70 transition">
                                  <td className="py-3 px-4 font-bold text-slate-900">
                                    {row.className}
                                  </td>
                                  <td className="py-3 px-4 text-center font-mono">
                                    {row.invoiceCount}
                                  </td>
                                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                                    ₹{row.totalDemand.toLocaleString("en-IN")}
                                  </td>
                                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                                    ₹{row.totalCollected.toLocaleString("en-IN")}
                                  </td>
                                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                                    ₹{row.totalOutstanding.toLocaleString("en-IN")}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center gap-2">
                                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                        <div
                                          className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-mono font-bold text-slate-600">
                                        {pct}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFeeFilterClass(row.className);
                                        setFeeFilterStatus("ALL");
                                        setFeeSubTab("invoices");
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition"
                                    >
                                      View Invoices →
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fee Category / Catalog Structure Breakdown Table */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-950 flex items-center gap-2">
                          <span>📑</span> Fee Structure & Component Breakdown
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Revenue performance by fee category (Tuition, Transport, Exams, Admissions, etc.).
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">
                        {structureBreakdown.length} Fee Components
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                            <th className="py-3 px-4">Fee Component / Structure</th>
                            <th className="py-3 px-4 text-center">Vouchers Issued</th>
                            <th className="py-3 px-4 text-right">Total Demand</th>
                            <th className="py-3 px-4 text-right">Collected (Got)</th>
                            <th className="py-3 px-4 text-right">Remaining (Left)</th>
                            <th className="py-3 px-4 text-center">Recovery %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {structureBreakdown.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">
                                No fee structures recorded.
                              </td>
                            </tr>
                          ) : (
                            structureBreakdown.map((row) => {
                              const pct = row.totalDemand > 0
                                ? Math.min(100, Math.round((row.totalCollected / row.totalDemand) * 100))
                                : 0;
                              return (
                                <tr key={row.structureName} className="hover:bg-slate-50/70 transition">
                                  <td className="py-3 px-4 font-bold text-slate-900">
                                    {row.structureName}
                                  </td>
                                  <td className="py-3 px-4 text-center font-mono">
                                    {row.invoiceCount}
                                  </td>
                                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                                    ₹{row.totalDemand.toLocaleString("en-IN")}
                                  </td>
                                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                                    ₹{row.totalCollected.toLocaleString("en-IN")}
                                  </td>
                                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                                    ₹{row.totalOutstanding.toLocaleString("en-IN")}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center gap-2">
                                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                        <div
                                          className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-mono font-bold text-slate-600">
                                        {pct}%
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sub-tab 1: Invoices */}
            {feeSubTab === "invoices" && (() => {
              const filteredInvoices = invoices.filter((inv) => {
                const studClass = inv.enrollment?.section?.classGrade?.name || inv.student?.classGrade || inv.feeStructure?.classGrade;
                if (feeFilterClass !== "ALL" && studClass && studClass !== feeFilterClass) {
                  return false;
                }
                const structName = inv.feeStructure?.name || inv.title;
                if (feeFilterStructure !== "ALL" && structName && !structName.toLowerCase().includes(feeFilterStructure.toLowerCase())) {
                  return false;
                }
                if (feeFilterStatus !== "ALL") {
                  if (feeFilterStatus === "PARTIAL" || feeFilterStatus === "PARTIALLY_PAID") {
                    if (inv.status !== "PARTIALLY_PAID" && inv.status !== "PARTIAL") return false;
                  } else if (inv.status !== feeFilterStatus) {
                    return false;
                  }
                }
                return true;
              });

              return (
              <div className="space-y-4">
                {/* At-a-glance KPI Ribbon for Invoices Tab */}
                {(() => {
                  const totalDemand = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);
                  const totalPaid = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.paidAmount) || 0), 0);
                  const totalLeft = Math.max(0, totalDemand - totalPaid);
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Invoiced (Filtered)</span>
                          <span className="text-xl font-black text-slate-900 font-mono">₹{totalDemand.toLocaleString("en-IN")}</span>
                        </div>
                        <span className="text-xl p-2 rounded-xl bg-slate-50 border border-slate-100">🏛️</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Total Received (What we got)</span>
                          <span className="text-xl font-black text-emerald-700 font-mono">₹{totalPaid.toLocaleString("en-IN")}</span>
                        </div>
                        <span className="text-xl p-2 rounded-xl bg-emerald-100/70 border border-emerald-200">💰</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Total Remaining (What is left)</span>
                          <span className="text-xl font-black text-amber-700 font-mono">₹{totalLeft.toLocaleString("en-IN")}</span>
                        </div>
                        <span className="text-xl p-2 rounded-xl bg-amber-100/70 border border-amber-200">⏳</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-700 font-medium">
                    Showing {filteredInvoices.length} of {invoices.length} student fee vouchers.
                    {selectedInvoiceIds.length > 0 && (
                      <span className="ml-2 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {selectedInvoiceIds.length} vouchers selected
                      </span>
                    )}
                  </div>
                  {(isAdmin || isAccountant) && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const targets = selectedInvoiceIds.length > 0
                            ? filteredInvoices.filter((inv) => selectedInvoiceIds.includes(inv.id))
                            : filteredInvoices;
                          setBulkPrintInvoicesModal(targets);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
                      >
                        <span>🖨️</span> Bulk Print Receipts {selectedInvoiceIds.length > 0 ? `(${selectedInvoiceIds.length})` : `(${filteredInvoices.length})`}
                      </button>
                      <button
                        onClick={() => setClassInvoiceGenModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                      >
                        <span>⚡</span> Batch Generate Class Invoices
                      </button>
                      <button
                        onClick={handleResetInvoices}
                        disabled={loading}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
                        title="Delete and reset invoices for selected class or all"
                      >
                        <span>🔄</span> Reset Invoices
                      </button>
                    </div>
                  )}
                </div>

                {/* Filters: Class Name & Fee Catalog Structure */}
                <div className="p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 shadow-sm text-slate-800">
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1 text-slate-600">
                      🏫 Filter by Class Grade
                    </label>
                    <select
                      value={feeFilterClass}
                      onChange={(e) => setFeeFilterClass(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-medium"
                    >
                      <option value="ALL">All Class Grades</option>
                      {classesList.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1 text-slate-600">
                      📑 Filter by Fee Catalog Structure
                    </label>
                    <select
                      value={feeFilterStructure}
                      onChange={(e) => setFeeFilterStructure(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-medium"
                    >
                      <option value="ALL">All Fee Catalog Structures ({feeStructures.length})</option>
                      {feeStructures.map((fs) => (
                        <option key={fs.id} value={fs.name}>
                          {fs.name} (₹{fs.amount})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-1 text-slate-600">
                      🔍 Filter by Status
                    </label>
                    <select
                      value={feeFilterStatus}
                      onChange={(e) => setFeeFilterStatus(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-medium"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PAID">PAID</option>
                      <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="OVERDUE">OVERDUE</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto overscroll-x-contain touch-auto">
                    <table className="w-full min-w-[850px] text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={filteredInvoices.length > 0 && selectedInvoiceIds.length === filteredInvoices.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedInvoiceIds(filteredInvoices.map((inv) => inv.id));
                                } else {
                                  setSelectedInvoiceIds([]);
                                }
                              }}
                              className="accent-blue-600 h-4 w-4 rounded cursor-pointer"
                            />
                          </th>
                          <th className="p-3.5">Invoice #</th>
                          <th className="p-3.5">Student</th>
                          <th className="p-3.5">Class</th>
                          <th className="p-3.5">Fee Structure</th>
                          <th className="p-3.5">Total Amount</th>
                          <th className="p-3.5">Paid</th>
                          <th className="p-3.5">Balance</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions & Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInvoices.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-8 text-center text-slate-500 font-medium">
                              No invoices match your selected class grade or fee catalog filters.
                            </td>
                          </tr>
                        ) : (
                        filteredInvoices.map((inv) => {
                          const stud = inv.enrollment?.student;
                          const isChecked = selectedInvoiceIds.includes(inv.id);
                          return (
                            <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-3.5 w-10 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedInvoiceIds([...selectedInvoiceIds, inv.id]);
                                    } else {
                                      setSelectedInvoiceIds(selectedInvoiceIds.filter((id) => id !== inv.id));
                                    }
                                  }}
                                  className="accent-blue-600 h-4 w-4 rounded cursor-pointer"
                                />
                              </td>
                              <td className="p-3.5 font-mono font-bold text-blue-700">{inv.invoiceNumber}</td>
                              <td className="p-3.5 font-bold text-slate-950 text-sm">
                                {stud ? `${stud.firstName} ${stud.lastName}` : "Student"}
                              </td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold">
                                  {inv.enrollment?.section?.classGrade?.name || stud?.enrollments?.[0]?.section?.classGrade?.name || inv.feeStructure?.classGrade || "Class"}
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-700 font-medium">
                                {inv.feeStructure?.name || inv.title || "Standard Fee"}
                              </td>
                              <td className="p-3.5 font-mono font-bold text-slate-950 text-sm">₹{inv.totalAmount}</td>
                              <td className="p-3.5 font-mono font-bold text-emerald-700">₹{inv.paidAmount}</td>
                              <td className="p-3.5 font-mono font-bold text-amber-800">
                                ₹{inv.totalAmount - inv.paidAmount}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                    inv.status === "PAID"
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                      : inv.status === "PARTIALLY_PAID" || inv.status === "PARTIAL"
                                      ? "bg-amber-100 text-amber-900 border-amber-300"
                                      : inv.status === "OVERDUE"
                                      ? "bg-rose-100 text-rose-800 border-rose-300"
                                      : "bg-blue-100 text-blue-900 border-blue-300"
                                  }`}
                                >
                                  {inv.status === "PARTIALLY_PAID" ? "PARTIAL" : inv.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setViewInvoiceReceipt(inv)}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition shadow-2xs inline-flex items-center gap-1"
                                  title="View Printable Receipt"
                                >
                                  <span>🧾</span> Receipt
                                </button>
                                {(isAdmin || isAccountant) && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAdjustInvoiceModal(inv);
                                        setAdjustType("ADD");
                                        setAdjustAmount("500");
                                        setAdjustReason("");
                                      }}
                                      className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition shadow-2xs inline-flex items-center gap-1"
                                      title="Add prior remaining quarter dues or deduct discounts"
                                    >
                                      <span>⚖️</span> Adjust (+ / -)
                                    </button>
                                    {inv.status !== "PAID" && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const rem = Math.max(0, inv.totalAmount - inv.paidAmount);
                                          const entered = prompt(`Enter payment amount to collect for ${inv.invoiceNumber} (Remaining: ₹${rem}):`, String(rem));
                                          if (entered !== null) {
                                            const val = parseFloat(entered);
                                            if (!isNaN(val) && val > 0) {
                                              handleRecordPayment(inv.id, val);
                                            }
                                          }
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs inline-flex items-center gap-1"
                                      >
                                        <span>💳</span> Collect ₹{inv.totalAmount - inv.paidAmount}
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition shadow-2xs inline-flex items-center justify-center"
                                      title="Delete Invoice"
                                    >
                                      🗑️
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        }))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              );
            })()}

            {/* Sub-tab 2: Structures Catalog */}
            {feeSubTab === "catalog" && (
              <div className="space-y-6">
                {isTeacherOnly && (
                  <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-blue-950 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">💳</span>
                      <span>
                        Faculty View • Showing fee structures applicable to your assigned class:{" "}
                        <strong className="text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 font-bold">
                          {teacherClassNames.length > 0 ? teacherClassNames.join(", ") : "Assigned Class Only"}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg font-bold shrink-0">
                      View-Only Access
                    </span>
                  </div>
                )}
                {(isAdmin || isAccountant) && (
                  <form onSubmit={handleCreateFeeStructure} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
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
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-black text-slate-900">
                            Applicable Classes (Select Multiple) *
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {newFeeClasses.length} selected
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const allNames = classesList.map((c) => c.name);
                                if (newFeeClasses.length === allNames.length && allNames.length > 0) {
                                  setNewFeeClasses([]);
                                } else {
                                  setNewFeeClasses(allNames.length > 0 ? allNames : ["Pre-KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]);
                                }
                              }}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline"
                            >
                              {newFeeClasses.length === classesList.length && classesList.length > 0 ? "Deselect All" : "Select All Classes"}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 max-h-36 overflow-y-auto shadow-2xs">
                          {(classesList.length > 0 ? classesList.map(c => c.name) : ["Pre-KG", "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]).map((cls) => {
                            const isChecked = newFeeClasses.includes(cls);
                            return (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => {
                                  if (isChecked) {
                                    setNewFeeClasses(newFeeClasses.filter(c => c !== cls));
                                  } else {
                                    setNewFeeClasses([...newFeeClasses, cls]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                  isChecked
                                    ? "bg-blue-600 text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                }`}
                              >
                                <span>{isChecked ? "✓" : "+"}</span>
                                <span>{cls}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Billing Frequency</label>
                        <select
                          value={newFeeFrequency}
                          onChange={(e) => setNewFeeFrequency(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                            />
                            <input
                              type="number"
                              value={comp.amount}
                              onChange={(e) => {
                                const copy = [...feeComponents];
                                copy[idx].amount = e.target.value;
                                setFeeComponents(copy);
                              }}
                              className="w-24 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium font-mono outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setFeeComponents(feeComponents.filter((_, i) => i !== idx))}
                              title="Delete this fee component"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center justify-center shrink-0"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                    >
                      {loading ? "Creating..." : "Save Fee Structure"}
                    </button>
                  </form>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto overscroll-x-contain touch-auto">
                    <table className="w-full min-w-[600px] text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Structure Name</th>
                        <th className="p-3.5">Class Grade</th>
                        <th className="p-3.5">Frequency</th>
                        <th className="p-3.5">Total Amount</th>
                        {(isAdmin || isAccountant) && <th className="p-3.5 text-right">Batch Invoicing</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {feeStructures.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin || isAccountant ? 5 : 4} className="p-8 text-center text-slate-500 font-medium">
                            No fee structures configured for your assigned class yet.
                          </td>
                        </tr>
                      ) : (
                        feeStructures.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50 transition">
                            <td className="p-3.5 font-bold text-slate-950 text-sm">{f.name}</td>
                            <td className="p-3.5">
                              {f.classGrade?.name === "All Classes" ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                                  <span>🌐</span> All Classes
                                </span>
                              ) : f.classGrade?.name?.includes(",") ? (
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {f.classGrade.name.split(",").map((c: string) => (
                                    <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                      {c.trim()}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
                                  {f.classGrade?.name || "Class 6"}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 font-mono text-blue-700 font-bold text-xs">{f.frequency || "QUARTERLY"}</td>
                            <td className="p-3.5 font-mono font-bold text-slate-950 text-sm">₹{f.totalAmount}</td>
                            {(isAdmin || isAccountant) && (
                              <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleBatchIssueClassInvoices(f.id)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs"
                                >
                                  ⚡ Issue Invoices to Class
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFeeStructure(f.id, f.name)}
                                  title="Delete Fee Component"
                                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition shadow-2xs inline-flex items-center justify-center"
                                >
                                  🗑️
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            )}
          </div>
      )}

      {viewInvoiceReceipt && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:fixed print:inset-0 print:z-[9999] print:bg-white print:p-0 print:overflow-visible print:block"
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
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest">
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

      {classInvoiceGenModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setClassInvoiceGenModal(false)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4 shadow-2xl my-8 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <span>⚡</span> Generate Class Invoices
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Batch issue fee vouchers for all enrolled students in a class grade.
                </p>
              </div>
              <button
                onClick={() => setClassInvoiceGenModal(false)}
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Academic Class Grade</label>
                <select
                  value={classInvoiceGenClass}
                  onChange={(e) => setClassInvoiceGenClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Applicable Fee Structure *</label>
                <select
                  value={classInvoiceGenStructureId}
                  onChange={(e) => setClassInvoiceGenStructureId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition"
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

      {adjustInvoiceModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setAdjustInvoiceModal(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <span>⚖️</span> Adjust Invoice Amount
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Add prior quarter remaining dues or deduct discounts / concessions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustInvoiceModal(null)}
                className="text-slate-600 hover:text-slate-900 font-bold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Current Invoice Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {adjustInvoiceModal.enrollment?.student ? `${adjustInvoiceModal.enrollment.student.firstName} ${adjustInvoiceModal.enrollment.student.lastName}` : "Student"}
                </span>
                <span className="font-mono font-bold text-blue-700">{adjustInvoiceModal.invoiceNumber}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Total Bill</span>
                  <span className="font-bold text-slate-950">₹{adjustInvoiceModal.totalAmount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Paid</span>
                  <span className="font-bold text-emerald-700">₹{adjustInvoiceModal.paidAmount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Balance Due</span>
                  <span className="font-bold text-amber-700">
                    ₹{Math.max(0, adjustInvoiceModal.totalAmount - adjustInvoiceModal.paidAmount)}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleAdjustInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Adjustment Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType("ADD")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      adjustType === "ADD"
                        ? "bg-amber-50 border-amber-500 text-amber-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-sm">➕</span>
                    <span>Add Dues (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("SUBTRACT")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      adjustType === "SUBTRACT"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-sm">➖</span>
                    <span>Discount (-)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("SET_REMAINING")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      adjustType === "SET_REMAINING"
                        ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-sm">🎯</span>
                    <span>Set Due</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  {adjustType === "ADD" && "Adds amount to total bill (e.g. prior quarter remaining balance or late fines)."}
                  {adjustType === "SUBTRACT" && "Deducts amount from total bill (e.g. concession, scholarship, waiver)."}
                  {adjustType === "SET_REMAINING" && "Directly sets the final remaining balance due for this invoice."}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Adjustment Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold font-mono outline-none focus:border-blue-600"
                />

                {/* Live Preview Projection */}
                {(() => {
                  const curTotal = Number(adjustInvoiceModal.totalAmount) || 0;
                  const curPaid = Number(adjustInvoiceModal.paidAmount) || 0;
                  const parsedAmt = parseFloat(adjustAmount) || 0;
                  let projectedTotal = curTotal;
                  let projectedDue = Math.max(0, curTotal - curPaid);
                  let projectionError = "";

                  if (isNaN(parsedAmt) || parsedAmt < 0) {
                    projectionError = "Amount must be a positive numeric value.";
                  } else if (adjustType === "ADD") {
                    projectedTotal = curTotal + parsedAmt;
                    projectedDue = Math.max(0, projectedTotal - curPaid);
                  } else if (adjustType === "SUBTRACT") {
                    const maxAllowed = Math.max(0, curTotal - curPaid);
                    if (parsedAmt > maxAllowed) {
                      projectionError = `Discount cannot exceed remaining due (₹${maxAllowed}). Total bill cannot be less than received amount (₹${curPaid}).`;
                      projectedTotal = Math.max(curPaid, curTotal - parsedAmt);
                    } else {
                      projectedTotal = curTotal - parsedAmt;
                    }
                    projectedDue = Math.max(0, projectedTotal - curPaid);
                  } else if (adjustType === "SET_REMAINING") {
                    projectedTotal = curPaid + parsedAmt;
                    projectedDue = parsedAmt;
                  }

                  return (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] space-y-1">
                      <div className="font-bold text-slate-700 flex items-center justify-between">
                        <span>📊 Live Calculation Preview:</span>
                        {projectionError ? (
                          <span className="text-rose-600 font-bold text-[10px]">⚠️ Invalid Input</span>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[10px]">✓ Valid Projection</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-sans">New Total Bill</span>
                          <span className="font-bold text-slate-900">₹{projectedTotal}</span>
                          <span className="text-[9px] text-slate-400 block font-sans">
                            {adjustType === "ADD" && `(+₹${parsedAmt})`}
                            {adjustType === "SUBTRACT" && `(-₹${parsedAmt})`}
                            {adjustType === "SET_REMAINING" && `(Paid ₹${curPaid} + Due ₹${parsedAmt})`}
                          </span>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-sans">New Remaining Due</span>
                          <span className="font-bold text-blue-700">₹{projectedDue}</span>
                          <span className="text-[9px] text-emerald-600 block font-sans">
                            {projectedDue === 0 ? "Fully Settled" : "Balance to collect"}
                          </span>
                        </div>
                      </div>
                      {projectionError && (
                        <p className="text-[10px] text-rose-600 font-bold mt-1 bg-rose-50 p-1.5 rounded border border-rose-200">
                          {projectionError}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Reason / Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Remaining balance from Q1, Sibling discount, etc."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdjustInvoiceModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  {loading ? "Applying..." : "Apply Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bulkPrintInvoicesModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-start p-4 overflow-y-auto print:fixed print:inset-0 print:z-[9999] print:bg-white print:p-0 print:overflow-visible print:block"
          onClick={() => setBulkPrintInvoicesModal(null)}
        >
          <div
            className="max-w-4xl w-full bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 print:p-0 print:border-none print:shadow-none print:m-0 print:max-w-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <div>
                <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                  <span>💳</span> Batch Fee Receipts ({bulkPrintInvoicesModal.length} Receipts)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Format: Official School Fee Invoices with seal, receipt number & cashier sign.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print Batch Receipts / PDF
                </button>
                <button
                  onClick={() => setBulkPrintInvoicesModal(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Receipts list */}
            <div className="space-y-8 print:space-y-6">
              {bulkPrintInvoicesModal.map((inv: any, idx: number) => {
                const student = inv.enrollment?.student || inv.student || {};
                const studentName = student.firstName ? `${student.firstName} ${student.lastName}` : (inv.studentName || "Student");
                const admNo = student.admissionNumber || inv.admissionNumber || "—";
                const classGrade = inv.enrollment?.section?.classGrade?.name || inv.className || "Class 6";
                const section = inv.enrollment?.section?.name || inv.sectionName || "A";

                return (
                  <div
                    key={inv.id || idx}
                    className="border border-slate-300 rounded-2xl p-6 space-y-4 bg-white text-slate-900 shadow-sm print:border-slate-400 print:rounded-none print:p-6 print:break-after-page"
                  >
                    {/* Receipt Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-700 font-black text-white flex items-center justify-center text-lg">
                          ग
                        </div>
                        <div>
                          <h4 className="font-black text-base text-slate-900 uppercase">
                            {currentUser?.schoolName || slug}
                          </h4>
                          <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">
                            CBSE Affiliated School • Official Fee Payment Receipt
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <p className="font-bold text-slate-900">Receipt #{inv.invoiceNumber || `INV-${inv.id?.slice(0, 8)}`}</p>
                        <p className="text-[10px] text-slate-500">Date: {new Date(inv.issuedDate || inv.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Student</span>
                        <strong className="text-slate-950 font-bold">{studentName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Admission No</span>
                        <span className="font-mono font-bold text-blue-700">{admNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Class & Section</span>
                        <strong className="text-slate-900">{classGrade} ({section})</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Invoice Status</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          inv.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "PARTIAL"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {inv.status || "UNPAID"}
                        </span>
                      </div>
                    </div>

                    {/* Fee Breakdown Table */}
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                        <tr>
                          <th className="p-2.5">Fee Particulars</th>
                          <th className="p-2.5 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2.5 text-slate-800 font-medium">Quarterly Tuition Fee & Classroom Instruction</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{Number(inv.totalAmount || inv.amount || 0).toLocaleString()}</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-50 border-t border-slate-300 font-bold text-slate-900">
                        <tr>
                          <td className="p-2.5 text-right uppercase tracking-wider text-xs">Total Amount Paid / Payable:</td>
                          <td className="p-2.5 text-right font-mono font-black text-sm text-emerald-700">₹{Number(inv.totalAmount || inv.amount || 0).toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Receipt Footer */}
                    <div className="pt-4 grid grid-cols-2 text-xs text-slate-600 border-t border-slate-200">
                      <div>
                        <p className="text-[10px] italic text-slate-500">
                          * This is a computer generated official receipt. Signature and school seal are valid for official purposes.
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="h-8"></div>
                        <span className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                          Authorized Accounts Officer
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
