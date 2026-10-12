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

export interface TransportSectionProps {
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
  transportSubTab?: any;
  setTransportSubTab?: React.Dispatch<React.SetStateAction<any>>;
  editRouteModal?: any;
  setEditRouteModal?: React.Dispatch<React.SetStateAction<any>>;
  assignStudentRouteModal?: any;
  setAssignStudentRouteModal?: React.Dispatch<React.SetStateAction<any>>;
  routeStudentSelect?: any;
  setRouteStudentSelect?: React.Dispatch<React.SetStateAction<any>>;
  routeStopSelect?: any;
  setRouteStopSelect?: React.Dispatch<React.SetStateAction<any>>;
  confirmModal?: any;
  setConfirmModal?: React.Dispatch<React.SetStateAction<any>>;
  staffList?: any[];
  studentList?: any[];
  admissionNo?: any;
  firstName?: any;
  lastName?: any;
  villageCity?: any;
  addressText?: any;
  className?: any;
  sectionName?: any;
  busRoutesList?: any[];
  newRouteNumber?: any;
  setNewRouteNumber?: React.Dispatch<React.SetStateAction<any>>;
  newRouteName?: any;
  setNewRouteName?: React.Dispatch<React.SetStateAction<any>>;
  newVehicleNumber?: any;
  setNewVehicleNumber?: React.Dispatch<React.SetStateAction<any>>;
  newDriverName?: any;
  setNewDriverName?: React.Dispatch<React.SetStateAction<any>>;
  newDriverPhone?: any;
  setNewDriverPhone?: React.Dispatch<React.SetStateAction<any>>;
  newDriverUserId?: any;
  setNewDriverUserId?: React.Dispatch<React.SetStateAction<any>>;
  newConductorName?: any;
  setNewConductorName?: React.Dispatch<React.SetStateAction<any>>;
  newConductorPhone?: any;
  setNewConductorPhone?: React.Dispatch<React.SetStateAction<any>>;
  newConductorUserId?: any;
  setNewConductorUserId?: React.Dispatch<React.SetStateAction<any>>;
  newPickupTime?: any;
  setNewPickupTime?: React.Dispatch<React.SetStateAction<any>>;
  newDropTime?: any;
  setNewDropTime?: React.Dispatch<React.SetStateAction<any>>;
  newMonthlyFee?: any;
  setNewMonthlyFee?: React.Dispatch<React.SetStateAction<any>>;
  newStopsInput?: any;
  setNewStopsInput?: React.Dispatch<React.SetStateAction<any>>;
  handleCreateBusRoute?: any;
  handleAssignStudentToRoute?: any;
  handleRemoveStudentFromRoute?: any;
  handleDeleteBusRoute?: any;
  handleUpdateRoute?: any;
  [key: string]: any;
}

export default function TransportSection(props: TransportSectionProps) {
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
    transportSubTab,
    setTransportSubTab = () => {},
    editRouteModal,
    setEditRouteModal = () => {},
    assignStudentRouteModal,
    setAssignStudentRouteModal = () => {},
    routeStudentSelect,
    setRouteStudentSelect = () => {},
    routeStopSelect,
    setRouteStopSelect = () => {},
    confirmModal,
    setConfirmModal = () => {},
    staffList = [],
    studentList = [],
    admissionNo,
    firstName,
    lastName,
    villageCity,
    addressText,
    className,
    sectionName,
    busRoutesList = [],
    newRouteNumber,
    setNewRouteNumber = () => {},
    newRouteName,
    setNewRouteName = () => {},
    newVehicleNumber,
    setNewVehicleNumber = () => {},
    newDriverName,
    setNewDriverName = () => {},
    newDriverPhone,
    setNewDriverPhone = () => {},
    newDriverUserId,
    setNewDriverUserId = () => {},
    newConductorName,
    setNewConductorName = () => {},
    newConductorPhone,
    setNewConductorPhone = () => {},
    newConductorUserId,
    setNewConductorUserId = () => {},
    newPickupTime,
    setNewPickupTime = () => {},
    newDropTime,
    setNewDropTime = () => {},
    newMonthlyFee,
    setNewMonthlyFee = () => {},
    newStopsInput,
    setNewStopsInput = () => {},
    handleCreateBusRoute = () => {},
    handleAssignStudentToRoute = () => {},
    handleRemoveStudentFromRoute = () => {},
    handleDeleteBusRoute = () => {},
    handleUpdateRoute = () => {},
  } = props;

  return (
    <>
      {activeSection === "transport" && (() => {
          const teacherVisibleRoutes = isTeacherOnly
            ? busRoutesList.filter((route) => {
                // Check student assignments
                const assigned = routeAssignments[route.id] || [];
                const hasAssigned = assigned.some((ast) => studentList.some((s) => s.id === ast.studentId));
                if (hasAssigned) return true;

                // Check stop names & route name vs student village/address
                const stops = Array.isArray(route.stops) ? route.stops : [];
                const stopNames = stops.map((st: any) => (st.name || "").toLowerCase());
                const rName = (route.routeName || "").toLowerCase();
                const rNum = (route.routeNumber || "").toLowerCase();

                return studentList.some((st) => {
                  const village = (st.villageCity || "").trim().toLowerCase();
                  const addrText = (st.addressText || "").trim().toLowerCase();
                  if (village && village.length > 2) {
                    if (rName.includes(village) || village.includes(rName)) return true;
                    if (stopNames.some((sn: string) => sn.includes(village) || village.includes(sn))) return true;
                  }
                  if (addrText && addrText.length > 2) {
                    if (stopNames.some((sn: string) => sn.includes(addrText) || addrText.includes(sn))) return true;
                  }
                  return false;
                });
              })
            : busRoutesList;

          const driverAssignedRoute = busRoutesList.find(
            (route) =>
              route.isAssignedRoute ||
              (currentUser?.id && route.driverUserId === currentUser.id) ||
              (currentUser?.phone &&
                route.driverPhone &&
                route.driverPhone.replace(/\D/g, "").length > 5 &&
                route.driverPhone.replace(/\D/g, "").includes(currentUser.phone.replace(/\D/g, "")))
          );

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                    <span>🚌</span> School Transport & Bus Routes
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Manage school bus routes, drivers, timings, stops, and assign enrolled students.
                  </p>
                </div>

                {/* Two-tab switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                  <button
                    onClick={() => setTransportSubTab("list")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      transportSubTab === "list"
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    🚌 View Bus Routes ({teacherVisibleRoutes.length})
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setTransportSubTab("create")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        transportSubTab === "create"
                          ? "bg-blue-600 text-white font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 font-semibold"
                      }`}
                    >
                      ➕ Configure New Route
                    </button>
                  )}
                </div>
              </div>

              {isDriverOnly && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium flex items-center gap-2.5 shadow-2xs">
                  <span className="text-base shrink-0">🚌</span>
                  <span>
                    <strong>Driver Console:</strong> Showing all bus routes for your school. Your assigned route is pinned at the top with schedule, stops, and student passenger details.
                  </span>
                </div>
              )}

              {isTeacherOnly && (
                <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-blue-950 font-medium flex items-center gap-2.5 shadow-2xs">
                  <span className="text-base shrink-0">🚌</span>
                  <span>
                    <strong>Assigned Class Transport:</strong> Displaying bus routes utilized by students enrolled in your class{teacherClassNames.length > 0 ? ` (${teacherClassNames.join(", ")})` : ""}. Configuring bus routes or adding stops is restricted to school administrators.
                  </span>
                </div>
              )}

              {/* Sub-tab 1: Routes list */}
              {transportSubTab === "list" && (
                <div className="space-y-6">
                  {/* Driver's Assigned Route Pinned Prominently Above */}
                  {driverAssignedRoute && (
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-2 border-emerald-500 shadow-md space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3.5 py-1 rounded-full font-black font-mono text-xs bg-emerald-600 text-white shadow-xs">
                            ⭐ YOUR ASSIGNED ROUTE: {driverAssignedRoute.routeNumber}
                          </span>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Active Duty
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-slate-700 font-medium">
                            Vehicle: <strong className="text-slate-950 font-bold">{driverAssignedRoute.vehicleNumber}</strong>
                          </span>
                          <span className="font-mono text-xs text-emerald-700 font-bold">
                            ₹{driverAssignedRoute.monthlyFee}/month
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-black text-xl text-slate-950">{driverAssignedRoute.routeName}</h3>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          Driver: <strong className="text-slate-950 font-bold">{driverAssignedRoute.driverName}</strong>{" "}
                          <span className="font-mono text-blue-700 font-bold">({driverAssignedRoute.driverPhone})</span>
                          {driverAssignedRoute.conductorName && (
                            <> • Conductor: <strong className="text-slate-950 font-bold">{driverAssignedRoute.conductorName}</strong> {driverAssignedRoute.conductorPhone ? `(${driverAssignedRoute.conductorPhone})` : ""}</>
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs font-medium text-slate-700 shadow-2xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Pickup</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">{driverAssignedRoute.morningPickupTime}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Drop</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">{driverAssignedRoute.eveningDropTime}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Capacity</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">{driverAssignedRoute.capacity} Seats</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Passengers</span>
                          <span className="font-mono font-bold text-emerald-700 text-sm">{(routeAssignments[driverAssignedRoute.id] || []).length} Students</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] text-slate-700 uppercase font-black tracking-wider block">
                          Route Stops ({((driverAssignedRoute.stops as any[]) || []).length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {((driverAssignedRoute.stops as any[]) || []).map((st: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-xl bg-emerald-100/70 border border-emerald-200 text-xs text-emerald-950 font-semibold flex items-center gap-1.5"
                            >
                              <span>📍</span>
                              <span>{st.name}</span>
                              {st.time && <span className="font-mono text-emerald-800 text-[11px]">({st.time})</span>}
                            </span>
                          ))}
                        </div>
                      </div>

                      {(routeAssignments[driverAssignedRoute.id] || []).length > 0 && (
                        <div className="pt-3 border-t border-emerald-200/80">
                          <span className="text-[11px] text-slate-700 font-bold block mb-2">
                            Assigned Student Passengers ({(routeAssignments[driverAssignedRoute.id] || []).length}):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                            {(routeAssignments[driverAssignedRoute.id] || []).map((ast: any) => {
                              const stObj = studentList.find((s) => s.id === ast.studentId);
                              return (
                                <div key={ast.studentId} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                                  <div>
                                    <div className="font-bold text-slate-900">{ast.studentName}</div>
                                    <div className="text-[10px] text-slate-500">{ast.className} • Stop: {ast.stopName}</div>
                                  </div>
                                  {stObj?.emergencyPhone && (
                                    <a href={`tel:${stObj.emergencyPhone}`} className="text-emerald-700 font-mono text-[10px] font-bold hover:underline">
                                      📞 Call
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <span>🚍</span> All School Bus Routes ({teacherVisibleRoutes.length})
                    </h3>
                    {isDriverOnly && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        Viewing all network routes with your assigned route pinned above
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {teacherVisibleRoutes.length === 0 ? (
                      <div className="col-span-full p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                        No bus routes are currently associated with students of your assigned class.
                      </div>
                    ) : (
                      teacherVisibleRoutes.map((route) => {
                    const stops = Array.isArray(route.stops) ? route.stops : [];
                    const assigned = routeAssignments[route.id] || [];
                    const isAssignedToCurrentDriver =
                      route.isAssignedRoute ||
                      (currentUser?.id && route.driverUserId === currentUser.id) ||
                      (currentUser?.phone &&
                        route.driverPhone &&
                        route.driverPhone.replace(/\D/g, "").length > 5 &&
                        route.driverPhone.replace(/\D/g, "").includes(currentUser.phone.replace(/\D/g, "")));
                    return (
                    <div
                      key={route.id}
                      className={`p-6 rounded-3xl bg-white border ${
                        isAssignedToCurrentDriver
                          ? "border-emerald-500 ring-2 ring-emerald-400/40 shadow-md"
                          : "border-slate-200 shadow-sm"
                      } hover:shadow-md transition flex flex-col justify-between space-y-4`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full font-black font-mono text-xs bg-blue-100 text-blue-900 border border-blue-200">
                              {route.routeNumber}
                            </span>
                            {isAssignedToCurrentDriver && (
                              <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-emerald-600 text-white shadow-xs">
                                ⭐ Your Assigned Route
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-600 font-medium">
                            Vehicle: <strong className="text-slate-950 font-bold">{route.vehicleNumber}</strong>
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-lg text-slate-950">{route.routeName}</h4>
                          <p className="text-xs text-slate-700 font-medium mt-1">
                            Driver: <strong className="text-slate-950 font-bold">{route.driverName}</strong>{" "}
                            <span className="font-mono text-blue-700 font-bold">({route.driverPhone})</span>
                            {route.conductorName && (
                              <> • Conductor: <strong className="text-slate-950 font-bold">{route.conductorName}</strong> {route.conductorPhone ? `(${route.conductorPhone})` : ""}</>
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Pickup</span>
                            <span className="font-mono font-bold text-slate-900">{route.morningPickupTime}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Drop</span>
                            <span className="font-mono font-bold text-slate-900">{route.eveningDropTime}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Monthly Fee</span>
                            <span className="font-mono font-bold text-emerald-700">₹{route.monthlyFee}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1.5">
                            Route Stops ({stops.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {stops.map((st: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium"
                              >
                                📍 {st.name} {st.time ? `(${st.time})` : ""}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Assigned Students Section */}
                        <div className="pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] text-slate-600 font-bold flex items-center gap-1.5">
                              <span>👥</span> Assigned Students ({assigned.length})
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignStudentRouteModal(route);
                                  setRouteStudentSelect(studentList[0]?.id || "");
                                  setRouteStopSelect(stops[0]?.name || "Main Campus Stop");
                                }}
                                className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold inline-flex items-center gap-1 transition shadow-2xs"
                              >
                                <span>➕</span> Assign Student
                              </button>
                            )}
                          </div>
                          {assigned.length > 0 ? (
                            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                              {assigned.map((ast, aidx) => (
                                <div key={aidx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                  <div>
                                    <span className="font-bold text-slate-950">{ast.studentName}</span>{" "}
                                    <span className="text-[10px] font-mono text-blue-700">({ast.admissionNo})</span>
                                    <span className="text-[10px] text-slate-500 block">Boarding: 📍 {ast.stopName}</span>
                                  </div>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveStudentFromRoute(route.id, ast.studentId)}
                                      title="Remove from Route"
                                      className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1 rounded-lg hover:bg-rose-50"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">No students assigned to this route yet.</p>
                          )}
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                          <button
                            onClick={() => setEditRouteModal(route)}
                            title="Edit Bus Route"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteBusRoute(route.id)}
                            title="Delete Bus Route"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }))}
                  </div>
                </div>
              )}

            {/* Sub-tab 2: Create Route Form */}
            {transportSubTab === "create" && !isTeacherOnly && isAdmin && (
              <form onSubmit={handleCreateBusRoute} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Configure New Bus Route & Assign Driver / Conductor
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Route Number *</label>
                    <input
                      type="text"
                      required
                      value={newRouteNumber}
                      onChange={(e) => setNewRouteNumber(e.target.value)}
                      placeholder="e.g. R-03"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium font-mono outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Route Name *</label>
                    <input
                      type="text"
                      required
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                      placeholder="e.g. Semliya - Hatod - Badgonda Express"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Reg Number</label>
                    <input
                      type="text"
                      value={newVehicleNumber}
                      onChange={(e) => setNewVehicleNumber(e.target.value)}
                      placeholder="MP-09-EF-9012"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Driver & Conductor Select from Staff */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  {/* Driver Section */}
                  <div className="space-y-2">
                    <label className="block text-[11px] text-orange-400 font-bold">
                      🚌 Select Driver from Staff
                    </label>
                    <select
                      value={newDriverUserId}
                      onChange={(e) => {
                        const selId = e.target.value;
                        setNewDriverUserId(selId);
                        const staffMember = staffList.find((s) => s.id === selId);
                        if (staffMember) {
                          setNewDriverName(staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "");
                          setNewDriverPhone(staffMember.phone || "");
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    >
                      <option value="">— Select Registered Driver / Staff —</option>
                      {staffList.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Driver Name *</label>
                        <input
                          type="text"
                          required
                          value={newDriverName}
                          onChange={(e) => setNewDriverName(e.target.value)}
                          placeholder="Driver Name"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Driver Phone *</label>
                        <input
                          type="tel"
                          required
                          value={newDriverPhone}
                          onChange={(e) => setNewDriverPhone(e.target.value)}
                          placeholder="+91..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Conductor Section */}
                  <div className="space-y-2">
                    <label className="block text-[11px] text-amber-400 font-bold">
                      🎫 Select Conductor from Staff
                    </label>
                    <select
                      value={newConductorUserId}
                      onChange={(e) => {
                        const selId = e.target.value;
                        setNewConductorUserId(selId);
                        const staffMember = staffList.find((s) => s.id === selId);
                        if (staffMember) {
                          setNewConductorName(staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "");
                          setNewConductorPhone(staffMember.phone || "");
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    >
                      <option value="">— Select Registered Conductor / Staff —</option>
                      {staffList.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Conductor Name</label>
                        <input
                          type="text"
                          value={newConductorName}
                          onChange={(e) => setNewConductorName(e.target.value)}
                          placeholder="Conductor Name"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Conductor Phone</label>
                        <input
                          type="tel"
                          value={newConductorPhone}
                          onChange={(e) => setNewConductorPhone(e.target.value)}
                          placeholder="+91..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pickup Time</label>
                    <input
                      type="text"
                      value={newPickupTime}
                      onChange={(e) => setNewPickupTime(e.target.value)}
                      placeholder="07:20 AM"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Drop Time</label>
                    <input
                      type="text"
                      value={newDropTime}
                      onChange={(e) => setNewDropTime(e.target.value)}
                      placeholder="02:35 PM"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Monthly Bus Fee (₹)</label>
                    <input
                      type="number"
                      value={newMonthlyFee}
                      onChange={(e) => setNewMonthlyFee(e.target.value)}
                      placeholder="500"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Stops & Times (comma-separated)</label>
                    <input
                      type="text"
                      value={newStopsInput}
                      onChange={(e) => setNewStopsInput(e.target.value)}
                      placeholder="Stop 1 (07:25 AM), Stop 2 (07:45 AM)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                >
                  Register Bus Route
                </button>
              </form>
            )}
          </div>
        );
      })()}

      {editRouteModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditRouteModal(null)}
        >
          <div
            className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-950 flex items-center gap-2">
                <span>🚌</span> Edit Bus Route Details
              </h3>
              <button
                onClick={() => setEditRouteModal(null)}
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateRoute} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Route Number</label>
                  <input
                    type="text"
                    required
                    value={editRouteModal.routeNumber || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, routeNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Vehicle Plate No</label>
                  <input
                    type="text"
                    required
                    value={editRouteModal.vehicleNumber || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Route Corridor / Name</label>
                <input
                  type="text"
                  required
                  value={editRouteModal.routeName || ""}
                  onChange={(e) => setEditRouteModal({ ...editRouteModal, routeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                />
              </div>
              {/* Driver & Conductor selection */}
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                {/* Driver */}
                <div className="space-y-2">
                  <label className="block text-[11px] text-orange-400 font-bold">
                    🚌 Driver Selection from Staff
                  </label>
                  <select
                    value={editRouteModal.driverUserId || ""}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const staffMember = staffList.find((s: any) => s.id === selId);
                      setEditRouteModal({
                        ...editRouteModal,
                        driverUserId: selId || null,
                        driverName: staffMember ? (staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "") : editRouteModal.driverName,
                        driverPhone: staffMember ? (staffMember.phone || "") : editRouteModal.driverPhone,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    <option value="">— Select Registered Driver / Staff (or Enter Below) —</option>
                    {staffList.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Driver Name *</label>
                      <input
                        type="text"
                        required
                        value={editRouteModal.driverName || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, driverName: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Driver Phone *</label>
                      <input
                        type="text"
                        required
                        value={editRouteModal.driverPhone || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, driverPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Conductor */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <label className="block text-[11px] text-amber-400 font-bold">
                    🎫 Conductor Selection from Staff
                  </label>
                  <select
                    value={editRouteModal.conductorUserId || ""}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const staffMember = staffList.find((s: any) => s.id === selId);
                      setEditRouteModal({
                        ...editRouteModal,
                        conductorUserId: selId || null,
                        conductorName: staffMember ? (staffMember.staffProfile?.fullName || staffMember.email?.split("@")[0] || "") : editRouteModal.conductorName,
                        conductorPhone: staffMember ? (staffMember.phone || "") : editRouteModal.conductorPhone,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  >
                    <option value="">— Select Registered Conductor / Staff (or Enter Below) —</option>
                    {staffList.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.staffProfile?.fullName || s.email} ({s.role} {s.phone ? `• ${s.phone}` : ""})
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Conductor Name</label>
                      <input
                        type="text"
                        value={editRouteModal.conductorName || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, conductorName: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-700 font-bold block mb-0.5">Conductor Phone</label>
                      <input
                        type="tel"
                        value={editRouteModal.conductorPhone || ""}
                        onChange={(e) => setEditRouteModal({ ...editRouteModal, conductorPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-700 font-bold block mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={editRouteModal.morningPickupTime || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, morningPickupTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 font-bold block mb-1">Drop Time</label>
                  <input
                    type="text"
                    value={editRouteModal.eveningDropTime || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, eveningDropTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-700 font-bold block mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={editRouteModal.monthlyFee || ""}
                    onChange={(e) => setEditRouteModal({ ...editRouteModal, monthlyFee: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditRouteModal(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Updating..." : "Save Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assignStudentRouteModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setAssignStudentRouteModal(null)}
        >
          <div
            className="max-w-md w-full bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <span>🚌</span> Assign Student to Route {assignStudentRouteModal.routeNumber}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {assignStudentRouteModal.routeName} • Vehicle: {assignStudentRouteModal.vehicleNumber}
                </p>
              </div>
              <button
                onClick={() => setAssignStudentRouteModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignStudentToRoute} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  required
                  value={routeStudentSelect}
                  onChange={(e) => setRouteStudentSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="">— Select Enrolled Student —</option>
                  {studentList.map((st: any) => {
                    const enrollment = st.enrollments?.[0];
                    const cName = enrollment?.section?.classGrade?.name || enrollment?.classGradeName || "";
                    const sName = enrollment?.section?.name || enrollment?.sectionName || "";
                    return (
                      <option key={st.id} value={st.id}>
                        {st.firstName} {st.lastName} ({st.admissionNumber}) {cName ? `• ${cName}-${sName}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Boarding / Drop Stop *</label>
                <select
                  required
                  value={routeStopSelect}
                  onChange={(e) => setRouteStopSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="">— Select Route Stop —</option>
                  {Array.isArray(assignStudentRouteModal.stops) && assignStudentRouteModal.stops.length > 0 ? (
                    assignStudentRouteModal.stops.map((st: any, idx: number) => (
                      <option key={idx} value={st.name}>
                        📍 {st.name} {st.time ? `(${st.time})` : ""}
                      </option>
                    ))
                  ) : (
                    <option value="Main Campus Stop">Main Campus Stop (07:30 AM)</option>
                  )}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAssignStudentRouteModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <span>➕</span> Assign to Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Beautiful Modern Confirmation / Alert Popup */}
      {/* ========================================================================= */}
      {confirmModal && confirmModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                  confirmModal.isDanger
                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                    : "bg-blue-50 text-blue-600 border border-blue-100"
                }`}
              >
                {confirmModal.isDanger ? "🗑️" : "ℹ️"}
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 className="font-black text-slate-950 text-base leading-tight">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const onConfirm = confirmModal.onConfirm;
                  setConfirmModal(null);
                  if (onConfirm) {
                    await onConfirm();
                  }
                }}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition ${
                  confirmModal.isDanger
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                }`}
              >
                {confirmModal.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
