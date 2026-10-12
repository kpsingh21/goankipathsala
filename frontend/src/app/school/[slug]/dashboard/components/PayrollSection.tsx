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

export interface PayrollSectionProps {
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
  payrollRuns?: any[];
  payrollStaffList?: any[];
  payrollLoading?: any;
  selectedPayrollMonth?: any;
  setSelectedPayrollMonth?: React.Dispatch<React.SetStateAction<any>>;
  payrollSubTab?: any;
  setPayrollSubTab?: React.Dispatch<React.SetStateAction<any>>;
  viewPayslipModal?: any;
  setViewPayslipModal?: React.Dispatch<React.SetStateAction<any>>;
  markPaidModal?: any;
  setMarkPaidModal?: React.Dispatch<React.SetStateAction<any>>;
  markPaymentMode?: any;
  setMarkPaymentMode?: React.Dispatch<React.SetStateAction<any>>;
  markTxnRef?: any;
  setMarkTxnRef?: React.Dispatch<React.SetStateAction<any>>;
  markPayRemarks?: any;
  setMarkPayRemarks?: React.Dispatch<React.SetStateAction<any>>;
  payrollSearch?: any;
  setPayrollSearch?: React.Dispatch<React.SetStateAction<any>>;
  payrollStatusFilter?: any;
  setPayrollStatusFilter?: React.Dispatch<React.SetStateAction<any>>;
  generatingPayroll?: any;
  fetchPayrollData?: any;
  handleGeneratePayroll?: any;
  handleOpenSalaryStructureModal?: any;
  handleOpenMarkPaidModal?: any;
  handleSaveMarkPaid?: any;
  [key: string]: any;
}

export default function PayrollSection(props: PayrollSectionProps) {
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
    payrollRuns = [],
    payrollStaffList = [],
    payrollLoading,
    selectedPayrollMonth,
    setSelectedPayrollMonth = () => {},
    payrollSubTab,
    setPayrollSubTab = () => {},
    viewPayslipModal,
    setViewPayslipModal = () => {},
    markPaidModal,
    setMarkPaidModal = () => {},
    markPaymentMode,
    setMarkPaymentMode = () => {},
    markTxnRef,
    setMarkTxnRef = () => {},
    markPayRemarks,
    setMarkPayRemarks = () => {},
    payrollSearch,
    setPayrollSearch = () => {},
    payrollStatusFilter,
    setPayrollStatusFilter = () => {},
    generatingPayroll,
    fetchPayrollData = () => {},
    handleGeneratePayroll = () => {},
    handleOpenSalaryStructureModal = () => {},
    handleOpenMarkPaidModal = () => {},
    handleSaveMarkPaid = () => {},
  } = props;

  return (
    <>
      {activeSection === "payroll" && (() => {
          // Find selected run
          const currentRun = payrollRuns.find((r) => r.month === selectedPayrollMonth) || payrollRuns[0] || null;
          const displayRun = currentRun;

          // Compute active metrics
          let metricGross = 0;
          let metricNet = 0;
          let metricDisbursed = 0;
          let metricPending = 0;
          let metricPaidCount = 0;

          if (displayRun && Array.isArray(displayRun.payslips)) {
            metricGross = displayRun.totalGross || 0;
            metricNet = displayRun.totalNet || 0;
            displayRun.payslips.forEach((ps: any) => {
              if (ps.paymentStatus === "PAID") {
                metricDisbursed += Number(ps.netSalary || 0);
                metricPaidCount++;
              } else {
                metricPending += Number(ps.netSalary || 0);
              }
            });
          } else if (payrollStaffList.length > 0) {
            payrollStaffList.forEach((s: any) => {
              const net = Number(s.salaryStructure?.netSalary || 0);
              const gross = Number(s.salaryStructure?.grossSalary || 0);
              metricGross += gross;
              metricNet += net;
              metricPending += net;
            });
          }

          const filteredPayslips = (displayRun?.payslips || []).filter((ps: any) => {
            const matchesSearch = payrollSearch
              ? ps.staffName?.toLowerCase().includes(payrollSearch.toLowerCase()) ||
                ps.role?.toLowerCase().includes(payrollSearch.toLowerCase()) ||
                ps.designation?.toLowerCase().includes(payrollSearch.toLowerCase())
              : true;
            const matchesStatus =
              payrollStatusFilter === "ALL" ? true : ps.paymentStatus === payrollStatusFilter;
            return matchesSearch && matchesStatus;
          });

          return (
            <div className="space-y-6">
              {/* Header with Month Selector & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <h2 className="font-black text-xl text-slate-950">Staff Payroll & Salaries</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      EPF & Allowances
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Calculate monthly staff compensation, generate itemized payslips, and record bank disbursement transfers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5">
                    <span className="text-xs text-slate-500 font-medium">Month:</span>
                    <input
                      type="month"
                      value={selectedPayrollMonth}
                      onChange={(e) => setSelectedPayrollMonth(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGeneratePayroll(selectedPayrollMonth)}
                    disabled={generatingPayroll}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>⚡</span>
                    {generatingPayroll ? "Calculating..." : "Calculate / Recalculate Payroll"}
                  </button>

                  <button
                    type="button"
                    onClick={fetchPayrollData}
                    disabled={payrollLoading}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                    title="Refresh payroll data"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Total Net Payroll
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ₹{metricNet.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Gross: ₹{metricGross.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Disbursed Amount
                  </span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    ₹{metricDisbursed.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    {displayRun ? `${metricPaidCount} of ${displayRun.staffCount || 0} Staff Paid` : "Settled Salaries"}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pending Liabilities
                  </span>
                  <div className="text-2xl font-black text-rose-600 mt-1">
                    ₹{metricPending.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-rose-500 font-medium mt-0.5">
                    Awaiting Bank Clearance
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Salaried Staff
                  </span>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {payrollStaffList.length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Active Faculty & Staff
                  </div>
                </div>
              </div>

              {/* Subtab Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setPayrollSubTab("runs")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    payrollSubTab === "runs"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>📋</span> Monthly Payroll Runs & Payslips
                </button>
                <button
                  type="button"
                  onClick={() => setPayrollSubTab("structures")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    payrollSubTab === "structures"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>⚙️</span> Staff Salary Structures ({payrollStaffList.length})
                </button>
              </div>

              {/* SUBTAB 1: MONTHLY RUNS & PAYSLIPS */}
              {payrollSubTab === "runs" && (
                <div className="space-y-4">
                  {/* Payroll Month Run Banner */}
                  {displayRun ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📅</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-slate-900">
                              Payroll Run: {displayRun.monthLabel}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                displayRun.status === "PAID"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : displayRun.status === "PARTIALLY_PAID"
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-blue-100 text-blue-800 border border-blue-300"
                              }`}
                            >
                              ● {displayRun.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Calculated for {displayRun.staffCount} staff members • Generated:{" "}
                            {new Date(displayRun.generatedAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Filter & Search Bar */}
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={payrollSearch}
                          onChange={(e) => setPayrollSearch(e.target.value)}
                          placeholder="Search staff..."
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500"
                        />
                        <select
                          value={payrollStatusFilter}
                          onChange={(e) => setPayrollStatusFilter(e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="ALL">All Statuses</option>
                          <option value="PAID">Paid Only</option>
                          <option value="UNPAID">Unpaid Only</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white border border-dashed border-slate-300 rounded-3xl space-y-3">
                      <span className="text-3xl">🧮</span>
                      <h4 className="font-extrabold text-base text-slate-900">
                        No payroll run calculated for {selectedPayrollMonth}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Click below to automatically compute EPF, allowances, deductions, and net payslips for all {payrollStaffList.length} school staff members.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleGeneratePayroll(selectedPayrollMonth)}
                        disabled={generatingPayroll}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                      >
                        ⚡ Generate {selectedPayrollMonth} Payroll Run
                      </button>
                    </div>
                  )}

                  {/* Payslips Table */}
                  {displayRun && (
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                            <tr>
                              <th className="p-3.5">Staff Member</th>
                              <th className="p-3.5">Base Salary</th>
                              <th className="p-3.5">Allowances</th>
                              <th className="p-3.5">Gross Pay</th>
                              <th className="p-3.5">Deductions</th>
                              <th className="p-3.5">Net Pay</th>
                              <th className="p-3.5">Payment Status</th>
                              <th className="p-3.5">Disbursement Info</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredPayslips.length === 0 ? (
                              <tr>
                                <td colSpan={9} className="p-8 text-center text-slate-400">
                                  No payslips match your search or filter criteria.
                                </td>
                              </tr>
                            ) : (
                              filteredPayslips.map((slip: any) => {
                                const totalAllowances =
                                  Number(slip.allowances?.hra || 0) +
                                  Number(slip.allowances?.da || 0) +
                                  Number(slip.allowances?.travel || 0) +
                                  Number(slip.allowances?.special || 0);

                                return (
                                  <tr key={slip.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-3.5">
                                      <div className="font-extrabold text-slate-900">{slip.staffName}</div>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                          {slip.role}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                          {slip.designation || "Staff"}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="p-3.5 font-mono font-medium text-slate-700">
                                      ₹{Number(slip.baseSalary || 0).toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-3.5 font-mono text-slate-600">
                                      <div>+₹{totalAllowances.toLocaleString("en-IN")}</div>
                                      <div className="text-[10px] text-slate-400 font-mono">
                                        HRA: ₹{slip.allowances?.hra} | DA: ₹{slip.allowances?.da}
                                      </div>
                                    </td>
                                    <td className="p-3.5 font-mono font-bold text-slate-900">
                                      ₹{Number(slip.grossSalary || 0).toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-3.5 font-mono text-rose-600">
                                      <div>-₹{Number(slip.totalDeductions || 0).toLocaleString("en-IN")}</div>
                                      <div className="text-[10px] text-slate-400 font-mono">
                                        PF: ₹{slip.deductions?.pf} | Tax: ₹{slip.deductions?.tax}
                                      </div>
                                    </td>
                                    <td className="p-3.5 font-mono font-black text-slate-950 text-sm">
                                      ₹{Number(slip.netSalary || 0).toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-3.5">
                                      <span
                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                          slip.paymentStatus === "PAID"
                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                            : "bg-amber-100 text-amber-800 border border-amber-300"
                                        }`}
                                      >
                                        ● {slip.paymentStatus}
                                      </span>
                                    </td>
                                    <td className="p-3.5 text-[11px] text-slate-600">
                                      <div className="font-semibold">{slip.paymentMode?.replace("_", " ")}</div>
                                      {slip.transactionRef ? (
                                        <div className="text-[10px] font-mono text-slate-400">
                                          Ref: {slip.transactionRef}
                                        </div>
                                      ) : slip.bankAccountNo ? (
                                        <div className="text-[10px] font-mono text-slate-400">
                                          A/C: ••••{slip.bankAccountNo.slice(-4)}
                                        </div>
                                      ) : (
                                        <div className="text-[10px] text-amber-600 italic">No Bank Info</div>
                                      )}
                                    </td>
                                    <td className="p-3.5 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenMarkPaidModal(slip)}
                                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                            slip.paymentStatus === "PAID"
                                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                                          }`}
                                          title="Record payment mode and transaction reference"
                                        >
                                          <span>💳</span> {slip.paymentStatus === "PAID" ? "Edit Pay" : "Pay"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setViewPayslipModal(slip)}
                                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                                          title="View and print official salary payslip"
                                        >
                                          <span>📄</span> Payslip
                                        </button>
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
                  )}
                </div>
              )}

              {/* SUBTAB 2: SALARY STRUCTURES */}
              {payrollSubTab === "structures" && (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Staff Salary Structures & Bank Accounts
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Configure base salary, HRA, Dearness Allowance, and EPF percentages per faculty member.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Total Staff: {payrollStaffList.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3.5">Staff Details</th>
                          <th className="p-3.5">Basic Salary</th>
                          <th className="p-3.5">HRA & DA</th>
                          <th className="p-3.5">Gross Salary</th>
                          <th className="p-3.5">PF & Tax</th>
                          <th className="p-3.5">Net Salary</th>
                          <th className="p-3.5">Bank Account & IFSC</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payrollStaffList.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400">
                              No staff members registered in this school yet.
                            </td>
                          </tr>
                        ) : (
                          payrollStaffList.map((st: any) => {
                            const struct = st.salaryStructure || {};
                            return (
                              <tr key={st.id} className="hover:bg-slate-50/80 transition">
                                <td className="p-3.5">
                                  <div className="font-extrabold text-slate-900">{st.fullName}</div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                      {st.role}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {st.designation || "Staff"}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3.5 font-mono font-semibold text-slate-800">
                                  ₹{Number(struct.baseSalary || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="p-3.5 font-mono text-slate-600">
                                  <div>HRA: ₹{Number(struct.hra || 0).toLocaleString("en-IN")}</div>
                                  <div className="text-[10px] text-slate-400">
                                    DA: ₹{Number(struct.da || 0).toLocaleString("en-IN")}
                                  </div>
                                </td>
                                <td className="p-3.5 font-mono font-bold text-slate-900">
                                  ₹{Number(struct.grossSalary || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="p-3.5 font-mono text-rose-600">
                                  <div>PF: ₹{Number(struct.pfDeduction || 0).toLocaleString("en-IN")}</div>
                                  <div className="text-[10px] text-slate-400">
                                    Tax: ₹{Number(struct.taxDeduction || 0).toLocaleString("en-IN")}
                                  </div>
                                </td>
                                <td className="p-3.5 font-mono font-black text-emerald-700 text-sm">
                                  ₹{Number(struct.netSalary || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="p-3.5 text-[11px] text-slate-600">
                                  {struct.bankAccountNo ? (
                                    <div>
                                      <div className="font-mono font-semibold text-slate-800">
                                        {struct.bankAccountNo}
                                      </div>
                                      <div className="font-mono text-[10px] text-slate-400">
                                        IFSC: {struct.bankIfsc || "N/A"}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-amber-600 italic">Not Configured</span>
                                  )}
                                </td>
                                <td className="p-3.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenSalaryStructureModal(st)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                                  >
                                    <span>✏️</span> Configure
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
              )}
            </div>
          );
      })()}

      {markPaidModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setMarkPaidModal(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                  <span>💳</span> Record Salary Payment
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {markPaidModal.staffName} • {markPaidModal.monthLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMarkPaidModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Net Amount to Disburse:</span>
              <span className="font-mono font-black text-lg text-blue-700">
                ₹{Number(markPaidModal.netSalary || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <form onSubmit={handleSaveMarkPaid} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Disbursement Mode *
                </label>
                <select
                  value={markPaymentMode}
                  onChange={(e) => setMarkPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / IMPS / RTGS)</option>
                  <option value="UPI">UPI / QR Payment</option>
                  <option value="CHEQUE">Bank Cheque</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  UTR / Transaction Ref / Cheque No.
                </label>
                <input
                  type="text"
                  value={markTxnRef}
                  onChange={(e) => setMarkTxnRef(e.target.value)}
                  placeholder="e.g. UTR19482948201 or CHQ-004918"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-medium text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  value={markPayRemarks}
                  onChange={(e) => setMarkPayRemarks(e.target.value)}
                  placeholder="e.g. Disbursed via SBI corporate banking"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMarkPaidModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Recording..." : "Confirm & Mark as PAID"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewPayslipModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewPayslipModal(null)}
        >
          <div
            className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 space-y-6 max-h-[95vh] overflow-y-auto print:max-w-none print:w-full print:p-0 print:border-none print:shadow-none"
            onClick={(e) => e.stopPropagation()}
            id="printable-payslip"
          >
            {/* Action Bar (Hidden when printing) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Official Monthly Payslip
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>🖨️</span> Print Payslip
                </button>
                <button
                  type="button"
                  onClick={() => setViewPayslipModal(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* School Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-wide">
                {landingConfig?.heroTitle ? landingConfig.heroTitle.slice(0, 40) : "CAMPUS ACADEMY"}
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {landingConfig?.contactAddress || "School Campus • Recognized by CBSE / State Education Board"}
              </p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 uppercase font-mono">
                Salary Payslip for {viewPayslipModal.monthLabel}
              </div>
            </div>

            {/* Employee Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Employee Name</span>
                <span className="font-extrabold text-slate-900">{viewPayslipModal.staffName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Designation / Role</span>
                <span className="font-bold text-slate-800">{viewPayslipModal.role}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Payslip Ref ID</span>
                <span className="font-mono text-[11px] text-slate-700">{viewPayslipModal.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Payment Status</span>
                <span className={`font-black text-xs ${viewPayslipModal.paymentStatus === "PAID" ? "text-emerald-700" : "text-amber-700"}`}>
                  ● {viewPayslipModal.paymentStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Bank Account</span>
                <span className="font-mono text-slate-800">{viewPayslipModal.bankAccountNo || "N/A"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">IFSC Code</span>
                <span className="font-mono text-slate-800">{viewPayslipModal.bankIfsc || "N/A"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">PAN Number</span>
                <span className="font-mono text-slate-800">{viewPayslipModal.panNumber || "N/A"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Mode / Ref</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {viewPayslipModal.transactionRef || viewPayslipModal.paymentMode || "N/A"}
                </span>
              </div>
            </div>

            {/* Earnings & Deductions Breakdown Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-emerald-50 px-3 py-2 border-b border-emerald-100 font-bold text-xs text-emerald-900 uppercase">
                  Earnings (Allowances)
                </div>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-2 text-slate-700">Basic Salary</td>
                      <td className="p-2 text-right font-mono font-bold">
                        ₹{Number(viewPayslipModal.baseSalary || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-700">House Rent Allowance (HRA)</td>
                      <td className="p-2 text-right font-mono">
                        ₹{Number(viewPayslipModal.allowances?.hra || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-700">Dearness Allowance (DA)</td>
                      <td className="p-2 text-right font-mono">
                        ₹{Number(viewPayslipModal.allowances?.da || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-700">Travel / Conveyance Allowance</td>
                      <td className="p-2 text-right font-mono">
                        ₹{Number(viewPayslipModal.allowances?.travel || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-700">Special Allowance</td>
                      <td className="p-2 text-right font-mono">
                        ₹{Number(viewPayslipModal.allowances?.special || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t border-slate-200 font-bold">
                      <td className="p-2 text-slate-900">Total Gross Earnings</td>
                      <td className="p-2 text-right font-mono text-slate-950">
                        ₹{Number(viewPayslipModal.grossSalary || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Deductions */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-rose-50 px-3 py-2 border-b border-rose-100 font-bold text-xs text-rose-900 uppercase">
                  Deductions (EPF & Taxes)
                </div>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-2 text-slate-700">Employee Provident Fund (EPF)</td>
                      <td className="p-2 text-right font-mono text-rose-700">
                        ₹{Number(viewPayslipModal.deductions?.pf || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-700">Income / Professional Tax</td>
                      <td className="p-2 text-right font-mono text-rose-700">
                        ₹{Number(viewPayslipModal.deductions?.tax || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-700">Unpaid Leave Deductions</td>
                      <td className="p-2 text-right font-mono text-slate-400">₹0</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t border-slate-200 font-bold">
                      <td className="p-2 text-rose-900">Total Deductions</td>
                      <td className="p-2 text-right font-mono text-rose-700">
                        ₹{Number(viewPayslipModal.totalDeductions || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Net Take-Home Salary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-200">
                  Net Salary Payable (Take-Home)
                </span>
                <p className="text-[11px] text-emerald-100 italic">
                  Credited to Employee Registered Bank Account
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono">
                  ₹{Number(viewPayslipModal.netSalary || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="border-t border-slate-400 w-36 mx-auto mb-1" />
                <span className="font-bold text-slate-800">Employee Signature</span>
              </div>
              <div>
                <div className="border-t border-slate-400 w-36 mx-auto mb-1" />
                <span className="font-bold text-slate-800">Principal / Bursar Seal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
