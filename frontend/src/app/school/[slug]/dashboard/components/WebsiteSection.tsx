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

export interface WebsiteSectionProps {
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
  websiteSubTab?: any;
  setWebsiteSubTab?: React.Dispatch<React.SetStateAction<any>>;
  newPhotoUrl?: any;
  setNewPhotoUrl?: React.Dispatch<React.SetStateAction<any>>;
  newPhotoCaption?: any;
  setNewPhotoCaption?: React.Dispatch<React.SetStateAction<any>>;
  newVideoTitle?: any;
  setNewVideoTitle?: React.Dispatch<React.SetStateAction<any>>;
  newVideoUrl?: any;
  setNewVideoUrl?: React.Dispatch<React.SetStateAction<any>>;
  newFacilityName?: any;
  setNewFacilityName?: React.Dispatch<React.SetStateAction<any>>;
  newFacilityIcon?: any;
  setNewFacilityIcon?: React.Dispatch<React.SetStateAction<any>>;
  newFacilityDesc?: any;
  setNewFacilityDesc?: React.Dispatch<React.SetStateAction<any>>;
  className?: any;
  invoices?: any[];
  uploadDesktopFile?: (e: any, cb: (url: string) => void) => void;
  handleSaveLanding?: any;
  handleSaveLogo?: any;
  handleAddPhoto?: any;
  handleDeletePhoto?: any;
  handleAddVideo?: any;
  handleDeleteVideo?: any;
  handleAddFacility?: any;
  handleDeleteFacility?: any;
  [key: string]: any;
}

export default function WebsiteSection(props: WebsiteSectionProps) {
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
    websiteSubTab,
    setWebsiteSubTab = () => {},
    newPhotoUrl,
    setNewPhotoUrl = () => {},
    newPhotoCaption,
    setNewPhotoCaption = () => {},
    newVideoTitle,
    setNewVideoTitle = () => {},
    newVideoUrl,
    setNewVideoUrl = () => {},
    newFacilityName,
    setNewFacilityName = () => {},
    newFacilityIcon,
    setNewFacilityIcon = () => {},
    newFacilityDesc,
    setNewFacilityDesc = () => {},
    className,
    invoices = [],
    uploadDesktopFile = () => {},
    handleSaveLanding = () => {},
    handleSaveLogo = () => {},
    handleAddPhoto = () => {},
    handleDeletePhoto = () => {},
    handleAddVideo = () => {},
    handleDeleteVideo = () => {},
    handleAddFacility = () => {},
    handleDeleteFacility = () => {},
  } = props;

  return (
    <>
      {activeSection === "website" && isAdmin && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>🌐</span> School Website, Facilities & Media
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Manage the public landing page, campus infrastructure, photo albums, and video highlights.
                </p>
              </div>

              {/* Two-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
                <button
                  onClick={() => setWebsiteSubTab("facilities")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    websiteSubTab === "facilities"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  🏛️ World-Class Facilities ({(landingConfig.facilities || []).length})
                </button>
                <button
                  onClick={() => setWebsiteSubTab("media")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    websiteSubTab === "media"
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                >
                  📸 Campus Info & Media Gallery
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Facilities */}
            {websiteSubTab === "facilities" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Icon / Emoji</label>
                    <select
                      value={newFacilityIcon}
                      onChange={(e) => setNewFacilityIcon(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-white outline-none"
                    >
                      <option value="🔬">🔬 Science Laboratory</option>
                      <option value="💻">💻 Smart AI Computer Lab</option>
                      <option value="📚">📚 Central Digital Library</option>
                      <option value="🏀">🏀 Sports & Athletics Arena</option>
                      <option value="🚌">🚌 Safe GPS Bus Fleet</option>
                      <option value="☀️">☀️ Green Solar Powered</option>
                      <option value="🎨">🎨 Fine Arts & Culture</option>
                      <option value="🩺">🩺 First-Aid Clinic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Facility Title</label>
                    <input
                      type="text"
                      value={newFacilityName}
                      onChange={(e) => setNewFacilityName(e.target.value)}
                      placeholder="e.g. Modern Physics Lab"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Detailed Description</label>
                    <input
                      type="text"
                      value={newFacilityDesc}
                      onChange={(e) => setNewFacilityDesc(e.target.value)}
                      placeholder="Equipped with hands-on experiment stations..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                    >
                      + Add Facility
                    </button>
                  </div>
                </div>

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(landingConfig.facilities || []).map((fac: any) => (
                    <div
                      key={fac.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-2xl mb-2">{fac.icon}</div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFacility(fac.id)}
                          className="text-red-400 text-xs opacity-0 group-hover:opacity-100 transition p-1"
                        >
                          ✕
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">{fac.name}</h4>
                      <p className="text-xs text-slate-600 font-medium mt-1">{fac.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveLanding}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                  >
                    Save All Facilities to Public Portal
                  </button>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Campus Info & Media */}
            {websiteSubTab === "media" && (
              <div className="space-y-6">
                {/* School Logo & Branding Upload Card */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
                        <span>🏷️</span> Official School Logo & Crest
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Upload your school emblem for the public portal, report cards, ID badges, and invoices.
                      </p>
                    </div>
                    {landingConfig.logoUrl && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Logo Uploaded
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-white border border-slate-200">
                    <div className="h-20 w-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {landingConfig.logoUrl ? (
                        <img src={landingConfig.logoUrl} alt="School Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-3xl">🏛️</span>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700">Logo Image URL</label>
                        <label className="text-[11px] text-blue-700 hover:text-blue-900 cursor-pointer font-bold flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition">
                          <span>📁 Upload from Desktop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => handleSaveLogo(url))}
                          />
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={landingConfig.logoUrl || ""}
                          onChange={(e) => setLandingConfig({ ...landingConfig, logoUrl: e.target.value })}
                          placeholder="https://... or upload PNG/JPG emblem"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveLogo()}
                          disabled={loading}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs shrink-0 flex items-center gap-1.5"
                        >
                          <span>💾</span> Save Logo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveLanding} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Campus Narrative & Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 font-medium mb-1">Tagline</label>
                      <input
                        type="text"
                        value={landingConfig.tagline || ""}
                        onChange={(e) => setLandingConfig({ ...landingConfig, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 font-medium mb-1">Principal Name</label>
                      <input
                        type="text"
                        value={landingConfig.principalName || ""}
                        onChange={(e) => setLandingConfig({ ...landingConfig, principalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 font-medium mb-1">About Narrative</label>
                    <textarea
                      rows={2}
                      value={landingConfig.aboutText || ""}
                      onChange={(e) => setLandingConfig({ ...landingConfig, aboutText: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
                      📍 Campus Office, Helpdesk & Admission Form Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-600 font-medium mb-1">Helpdesk Title</label>
                        <input
                          type="text"
                          value={landingConfig.contactHelpdeskTitle || ""}
                          placeholder="Campus Office & Helpdesk"
                          onChange={(e) => setLandingConfig({ ...landingConfig, contactHelpdeskTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 font-medium mb-1">Campus Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={landingConfig.contactPhone || ""}
                          placeholder="+91 91113 93176"
                          onChange={(e) => setLandingConfig({ ...landingConfig, contactPhone: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs text-slate-600 font-medium mb-1">Welcome & Visiting Hours Message</label>
                      <input
                        type="text"
                        value={landingConfig.contactWelcomeText || ""}
                        placeholder="We welcome parents and guardians to visit our campus during official visiting hours."
                        onChange={(e) => setLandingConfig({ ...landingConfig, contactWelcomeText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-xs text-slate-600 font-medium mb-1">Official Admissions Email</label>
                        <input
                          type="email"
                          value={landingConfig.contactEmail || ""}
                          placeholder={`info@${slug}.goankipathsala.in`}
                          onChange={(e) => setLandingConfig({ ...landingConfig, contactEmail: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 font-medium mb-1">Campus Physical Address</label>
                        <input
                          type="text"
                          value={landingConfig.contactAddress || ""}
                          placeholder="School Campus, Main Village Road"
                          onChange={(e) => setLandingConfig({ ...landingConfig, contactAddress: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-xs text-slate-600 font-medium mb-1">Admission Desk Hours</label>
                        <input
                          type="text"
                          value={landingConfig.admissionHours || ""}
                          placeholder="Mon – Sat, 8:00 AM – 3:30 PM"
                          onChange={(e) => setLandingConfig({ ...landingConfig, admissionHours: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 font-medium mb-1">Fee Counter Hours</label>
                        <input
                          type="text"
                          value={landingConfig.feeCounterHours || ""}
                          placeholder="Mon – Sat, 8:30 AM – 2:00 PM"
                          onChange={(e) => setLandingConfig({ ...landingConfig, feeCounterHours: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs text-slate-600 font-medium mb-1">Admission Documents Checklist Note</label>
                      <input
                        type="text"
                        value={landingConfig.admissionDocumentsText || ""}
                        placeholder="1. Child's Birth Certificate • 2. Two Passport Photos • 3. Previous School TC & Report Card • 4. Aadhaar Card copy"
                        onChange={(e) => setLandingConfig({ ...landingConfig, admissionDocumentsText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
                  >
                    Save Information
                  </button>
                </form>

                {/* Photo Gallery & Video Gallery sections */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Photos of the Fun & Learning
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-slate-400">Photo URL</label>
                        <label className="text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold flex items-center gap-1">
                          <span>📁 Upload Desktop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setNewPhotoUrl(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="https://... or uploaded file"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Caption</label>
                      <input
                        type="text"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="Science Fair 2026"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      + Add Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(landingConfig.galleryImages || []).map((img: any) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                        <img src={img.url} alt="" className="w-full aspect-[4/3] object-cover" />
                        <div className="p-2 text-[10px] truncate">{img.caption}</div>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(img.id)}
                          className="absolute top-2 right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Video Showcase Embeds & Desktop Videos
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        placeholder="Cultural Fest 2026"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-slate-400">Video File / URL</label>
                        <label className="text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold flex items-center gap-1">
                          <span>📁 Upload Video</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => uploadDesktopFile(e, (url) => setNewVideoUrl(url))}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/... or uploaded file"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      className="py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      + Add Video
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(landingConfig.videoGallery || []).map((vid: any) => (
                      <div key={vid.id} className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 p-2">
                        <div className="aspect-video w-full">
                          <iframe src={vid.videoUrl} title="" className="w-full h-full border-0"></iframe>
                        </div>
                        <div className="flex items-center justify-between pt-2 text-xs">
                          <span className="font-bold truncate">{vid.title}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="text-red-400 hover:text-red-300 text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
      )}


    </>
  );
}
