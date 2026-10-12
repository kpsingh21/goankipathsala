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

export interface ClassesSectionProps {
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
  classSubTab?: any;
  setClassSubTab?: React.Dispatch<React.SetStateAction<any>>;
  classesList?: any[];
  newClassName?: any;
  setNewClassName?: React.Dispatch<React.SetStateAction<any>>;
  newClassOrder?: any;
  setNewClassOrder?: React.Dispatch<React.SetStateAction<any>>;
  newClassSubjects?: any[];
  setNewClassSubjects?: React.Dispatch<React.SetStateAction<any[]>>;
  newClassCustomSubject?: any;
  setNewClassCustomSubject?: React.Dispatch<React.SetStateAction<any>>;
  editClassCustomSubject?: any;
  setEditClassCustomSubject?: React.Dispatch<React.SetStateAction<any>>;
  editClassModal?: any;
  setEditClassModal?: React.Dispatch<React.SetStateAction<any>>;
  className?: any;
  setMsg?: React.Dispatch<React.SetStateAction<any>>;
  handleOpenPromotionModal?: any;
  fetchSubjects?: any;
  fetchClasses?: any;
  handleCreateClass?: any;
  handleUpdateClass?: any;
  handleDeleteClass?: any;
  handleRemoveSubjectFromClass?: any;
  [key: string]: any;
}

export default function ClassesSection(props: ClassesSectionProps) {
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
    classSubTab,
    setClassSubTab = () => {},
    classesList = [],
    newClassName,
    setNewClassName = () => {},
    newClassOrder,
    setNewClassOrder = () => {},
    newClassSubjects = [],
    setNewClassSubjects = () => {},
    newClassCustomSubject,
    setNewClassCustomSubject = () => {},
    editClassCustomSubject,
    setEditClassCustomSubject = () => {},
    editClassModal,
    setEditClassModal = () => {},
    className,
    setMsg = () => {},
    handleOpenPromotionModal = () => {},
    fetchSubjects = () => {},
    fetchClasses = () => {},
    handleCreateClass = () => {},
    handleUpdateClass = () => {},
    handleDeleteClass = () => {},
    handleRemoveSubjectFromClass = () => {},
  } = props;

  return (
    <>
      {activeSection === "classes" && isAdmin && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>🏛️</span> Academic Classes
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Manage class grades from Pre-KG, Nursery, LKG, UKG to Class 12, assign sections, and configure curriculum.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                <button
                  onClick={() => setClassSubTab("list")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    classSubTab === "list"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  🏛️ Classes & Sections ({classesList.length})
                </button>
                <button
                  onClick={() => setClassSubTab("create")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    classSubTab === "create"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  ➕ Add New Class Grade
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Classes list */}
            {classSubTab === "list" && (
              <div className="space-y-4">
                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto overscroll-x-contain touch-auto">
                    <table className="w-full min-w-[560px] text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Class / Grade Name</th>
                        <th className="p-3.5">Enrolled Students</th>
                        <th className="p-3.5">Curriculum Subjects</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classesList.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3.5 font-bold text-slate-950 text-sm">{c.name}</td>
                          <td className="p-3.5 font-bold font-mono text-slate-900 text-sm">{c.studentCount}</td>
                          <td className="p-3.5 text-slate-700 font-medium">
                            {c.subjectsCount > 0 ? (
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {(c.subjectList && c.subjectList.length > 0
                                  ? c.subjectList
                                  : (c.subjects || []).map((s: string) => ({ id: "", name: s }))
                                ).map((sub: any) => (
                                  <span
                                    key={sub.id || sub.name}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/70 transition group shadow-2xs"
                                  >
                                    <span>{sub.name}</span>
                                    {isAdmin && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveSubjectFromClass(c, sub.id, sub.name);
                                        }}
                                        title={`Delete / Remove "${sub.name}" from ${c.name}`}
                                        className="text-slate-400 group-hover:text-rose-600 hover:bg-rose-200/80 rounded px-1 font-bold text-[11px] leading-none transition"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No subjects mapped yet</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right w-36 whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenPromotionModal(c.name)}
                                title={`Promote Students in ${c.name} to Next Session`}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition shadow-2xs inline-flex items-center gap-1"
                              >
                                <span>⚡</span> Promote
                              </button>
                              <button
                                onClick={() => setEditClassModal(c)}
                                title="Edit Class Configuration"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteClass(c.id, c.name)}
                                title="Delete Class"
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition shadow-2xs inline-flex items-center justify-center"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Create Class Form */}
            {classSubTab === "create" && (
              <form onSubmit={handleCreateClass} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  + Add New Class / Academic Level
                </h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Grade Name *</label>
                  <input
                    type="text"
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g. Pre-KG, Nursery, Playgroup, Class 11 Science"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Pre-KG, Nursery, LKG, UKG, and Classes 1 to 12 can be configured.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Numerical Sequence Order</label>
                  <input
                    type="number"
                    value={newClassOrder}
                    onChange={(e) => setNewClassOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Negative or low numbers for pre-primary (-3 for Pre-KG, -2 for Nursery, etc.)</p>
                </div>

                {/* Subject Mapping for this Class */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                        <span>📚</span> Map Curriculum Subjects to Class *
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Select which subjects belong to this class curriculum.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {newClassSubjects.length} subjects
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const common = [
                            "English Core",
                            "Hindi Core",
                            "Mathematics",
                            "Science",
                            "Social Science",
                            "Computer / IT",
                            "Sanskrit",
                            "Environmental Studies (EVS)",
                            "Physical Education & Yoga",
                            "Art & Craft",
                          ];
                          if (newClassSubjects.length === common.length) {
                            setNewClassSubjects([]);
                          } else {
                            setNewClassSubjects(common);
                          }
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline"
                      >
                        {newClassSubjects.length > 0 ? "Toggle All" : "Select All Standard"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                    {[
                      "English Core",
                      "Hindi Core",
                      "Mathematics",
                      "Science",
                      "Social Science",
                      "Computer / IT",
                      "Sanskrit",
                      "Environmental Studies (EVS)",
                      "Physical Education & Yoga",
                      "Art & Craft",
                      "Moral Science & GK",
                      "Music & Performing Arts",
                    ].map((subj) => {
                      const isChecked = newClassSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setNewClassSubjects(newClassSubjects.filter((s) => s !== subj));
                            } else {
                              setNewClassSubjects([...newClassSubjects, subj]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                            isChecked
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                              : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                          }`}
                        >
                          <span>{isChecked ? "✓" : "+"}</span>
                          <span>{subj}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Subject */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <input
                      type="text"
                      value={newClassCustomSubject}
                      onChange={(e) => setNewClassCustomSubject(e.target.value)}
                      placeholder="Add custom subject name..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newClassCustomSubject.trim() && !newClassSubjects.includes(newClassCustomSubject.trim())) {
                          setNewClassSubjects([...newClassSubjects, newClassCustomSubject.trim()]);
                          setNewClassCustomSubject("");
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200"
                    >
                      + Add Subject
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                >
                  {loading ? "Creating..." : "+ Create Academic Class & Map Subjects"}
                </button>
              </form>
            )}
          </div>
      )}

      {editClassModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditClassModal(null)}
        >
          <div
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-950 flex items-center gap-2">
                <span>🏛️</span> Edit Academic Class / Grade
              </h3>
              <button
                onClick={() => setEditClassModal(null)}
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateClass} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Class / Grade Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pre-KG, Nursery, LKG, UKG, Class 1..."
                  value={editClassModal.name || ""}
                  onChange={(e) => setEditClassModal({ ...editClassModal, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Numerical Order (0 for Pre-KG, 1 for Class 1, etc.)
                </label>
                <input
                  type="number"
                  required
                  value={editClassModal.numericalOrder || 1}
                  onChange={(e) => setEditClassModal({ ...editClassModal, numericalOrder: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:border-emerald-500"
                />
              </div>

              {/* Subject Mapping for this Class */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>📚</span> Mapped Curriculum Subjects:
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 font-mono">
                    {(editClassModal.subjects || []).length} mapped
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                  {(!editClassModal.subjects || editClassModal.subjects.length === 0) ? (
                    <p className="text-slate-400 italic text-xs p-1">
                      No subjects mapped to this class yet. Use the field below to map new subjects.
                    </p>
                  ) : (
                    editClassModal.subjects.map((sub: string) => {
                      const matchObj = (editClassModal.subjectList || []).find((s: any) => s.name === sub);
                      const subId = matchObj?.id || "";
                      return (
                        <span
                          key={sub}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-2 group hover:bg-rose-50 hover:border-rose-300 transition shadow-2xs"
                        >
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubjectFromClass(editClassModal, subId, sub)}
                            title={`Delete / Unmap "${sub}" from ${editClassModal.name}`}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-200/80 p-0.5 rounded-md font-black text-xs leading-none transition"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>

                {/* Quick Add Subject */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={editClassCustomSubject}
                    onChange={(e) => setEditClassCustomSubject(e.target.value)}
                    placeholder="Add new subject to this class..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (editClassCustomSubject.trim()) {
                        try {
                          const res = await fetch(`${API_BASE}/api/subjects`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                              "X-Tenant-Slug": slug,
                            },
                            body: JSON.stringify({
                              name: editClassCustomSubject.trim(),
                              classGradeName: editClassModal.name,
                              board: "CBSE",
                            }),
                          });
                          const d = await res.json();
                          if (!res.ok) throw new Error(d.error || "Failed to create subject");
                          const createdSub = d.subject || { id: "", name: editClassCustomSubject.trim() };
                          setEditClassModal({
                            ...editClassModal,
                            subjects: [...(editClassModal.subjects || []), createdSub.name],
                            subjectList: [...(editClassModal.subjectList || []), { id: createdSub.id, name: createdSub.name }],
                            subjectsCount: (editClassModal.subjectsCount || 0) + 1,
                          });
                          setEditClassCustomSubject("");
                          fetchClasses();
                          fetchSubjects(editClassModal.name);
                          setMsg({ type: "success", text: `Subject "${createdSub.name}" mapped to ${editClassModal.name}!` });
                        } catch (e: any) {
                          setMsg({ type: "error", text: e.message || "Failed to add subject." });
                        }
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-2xs shrink-0"
                  >
                    + Map Subject
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditClassModal(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-emerald-950 transition"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
