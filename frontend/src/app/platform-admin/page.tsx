"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/config";

interface AdminUserSummary {
  id: string;
  email: string | null;
  phone: string | null;
  role: string;
}

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  customDomain?: string | null;
  plan: string;
  status: string;
  createdAt: string;
  settings?: any;
  users?: AdminUserSummary[];
  _count: {
    users: number;
    studentProfiles: number;
    classGrades: number;
  };
}

interface PlatformConfig {
  logoUrl?: string;
  brandName: string;
  brandTagline: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  exploreButtonText: string;
  announcementBanner: {
    enabled: boolean;
    text: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    helpdeskTitle?: string;
    welcomeText?: string;
    supportHours?: string;
    responseTime?: string;
  };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

interface InquiryItem {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  schoolName?: string | null;
  inquiryType: string;
  message: string;
  createdAt: string;
  status: string;
}

const DEFAULT_CONFIG: PlatformConfig = {
  logoUrl: "",
  brandName: "Goan Ki Pathshala",
  brandTagline: "गाँव की पाठशाला • Bringing Digital Infrastructure for every school.",
  heroBadge: "🌾 Transforming Rural & Semi-Urban Education",
  heroTitle: "Empowering Every School with World-Class Digital Infrastructure.",
  heroDescription:
    "Goan Ki Pathshala (गाँव की पाठशाला) is an enterprise-grade multi-tenant school operating system. Inspired by leading EdTech models like LEAD School, each campus receives its own isolated subdomain, bilingual CBSE curriculum delivery, smart student dossiers, itemized fee billing, and real-time fleet transport tracking.",
  exploreButtonText: "Explore Partner Schools",
  announcementBanner: {
    enabled: true,
    text: "🚀 Admissions open across all partner schools for Academic Session 2026-27.",
  },
  contact: {
    email: "contact@goankipathsala.in",
    phone: "+91 98765 43210",
    address: "Rural EdTech Innovation Hub, Cyber City, India",
  },
  features: [
    {
      icon: "📜",
      title: "CBSE Cumulative Report Cards",
      description:
        "Unit tests, quarterly, half-yearly, and annual aggregate grading with automatic percentage computation.",
    },
    {
      icon: "📋",
      title: "Attendance Matrix Engine",
      description:
        "Morning roll call and monthly attendance registers with automated working-day percentage calculation.",
    },
    {
      icon: "💳",
      title: "Fee Structures & Ledger",
      description:
        "Itemized breakdown (Tuition, Lab, Sports, Library) with batch invoice issuance and payment receipts.",
    },
    {
      icon: "🚌",
      title: "Village Bus Route Network",
      description:
        "Route milestones, pickup/drop times, driver phone numbers, and transport fee management.",
    },
    {
      icon: "🧑‍🏫",
      title: "Role-Based Teacher Access",
      description:
        "Subject teachers manage assigned subjects; class teachers and admins hold 360° academic oversight.",
    },
    {
      icon: "📢",
      title: "Digital Circular Notice Board",
      description:
        "Targeted school notices with priority tagging, emergency broadcasts, and instant editing.",
    },
    {
      icon: "🌐",
      title: "Isolated Subdomain Websites",
      description:
        "Each school enjoys a dedicated public branding portal with custom facilities, photo gallery, and videos.",
    },
    {
      icon: "🔒",
      title: "Multi-Tenant Tenant Isolation",
      description:
        "PostgreSQL row-level isolation via tenant UUIDs guaranteeing zero data overlap across institutions.",
    },
  ],
};

export default function PlatformAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterKey, setMasterKey] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"MANAGE" | "REGISTER" | "WEBSITE" | "INQUIRIES" | "CONTACT">("MANAGE");

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Registration Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [plan, setPlan] = useState("STANDARD");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("Admin@123");
  const [submitting, setSubmitting] = useState(false);
  const [regMessage, setRegMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // School Admin Password Reset Modal State
  const [resetModalSchool, setResetModalSchool] = useState<TenantItem | null>(null);
  const [newSchoolPassword, setNewSchoolPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Website CMS State
  const [websiteConfig, setWebsiteConfig] = useState<PlatformConfig>(DEFAULT_CONFIG);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsMessage, setCmsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Logo upload state
  const [logoUploading, setLogoUploading] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Check auth session on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem("platform_master_key");
    if (savedKey) {
      setMasterKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = pinInput.trim();
    if (!cleanKey) {
      setPinError("Please enter your Platform Master Key.");
      return;
    }

    setIsVerifying(true);
    setPinError("");

    try {
      // 1. Try Next.js local verification route
      let res = await fetch("/api/platform/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: cleanKey }),
      });

      // 2. Fallback to direct backend API
      if (!res.ok && res.status === 404 && API_BASE) {
        res = await fetch(`${API_BASE}/api/platform/verify-key`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: cleanKey }),
        });
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || res.status === 200)) {
        setIsAuthenticated(true);
        setMasterKey(cleanKey);
        sessionStorage.setItem("platform_master_key", cleanKey);
        setPinError("");
      } else {
        setPinError(data.error || "Invalid Platform Master Authority Key.");
      }
    } catch (err: any) {
      try {
        const res = await fetch(`${API_BASE}/api/platform/verify-key`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: cleanKey }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          setIsAuthenticated(true);
          setMasterKey(cleanKey);
          sessionStorage.setItem("platform_master_key", cleanKey);
          setPinError("");
          return;
        }
      } catch (e) {}

      setPinError("Failed to reach platform authentication service. Please check connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMasterKey("");
    sessionStorage.removeItem("platform_master_key");
    setPinInput("");
  };

  // Fetch tenants
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/tenants`, {
        headers: {
          "x-platform-key": masterKey || sessionStorage.getItem("platform_master_key") || "",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTenants(data.tenants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch website CMS config
  const fetchWebsiteConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/platform/config`);
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setWebsiteConfig({ ...DEFAULT_CONFIG, ...data.config });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch submitted inquiries
  const fetchInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const effectiveKey = masterKey || sessionStorage.getItem("platform_master_key") || "";
      const res = await fetch("/api/platform/contact", {
        headers: { "x-platform-master-key": effectiveKey },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const effectiveKey = masterKey || sessionStorage.getItem("platform_master_key") || "";
      // Try backend update endpoint
      await fetch(`${API_BASE}/api/platform/contact/inquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-platform-key": effectiveKey,
        },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => {});

      // Optimistically update local state
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
    } catch (err) {
      console.error("Failed to update inquiry status", err);
    }
  };

  const [contactSaving, setContactSaving] = useState(false);
  const [contactMessage, setContactMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveContactConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSaving(true);
    setContactMessage(null);
    const key = masterKey || sessionStorage.getItem("platform_master_key") || "";

    try {
      const res = await fetch(`${API_BASE}/api/platform/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-platform-key": key,
          "x-platform-master-key": key,
        },
        body: JSON.stringify(websiteConfig),
      });
      const data = await res.json();
      if (res.ok) {
        setContactMessage({ type: "success", text: "Contact & Helpdesk details updated successfully!" });
      } else {
        setContactMessage({ type: "error", text: data.error || "Failed to update contact details." });
      }
    } catch (err: any) {
      setContactMessage({ type: "error", text: err.message || "Network error updating contact details." });
    } finally {
      setContactSaving(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants();
      fetchWebsiteConfig();
      fetchInquiries();
    }
  }, [isAuthenticated]);

  // Handle Logo Upload (Base64 -> /api/platform/upload)
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setCmsMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        // Try local upload route first
        let uploadRes = await fetch("/api/platform/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
          }),
        });

        // Fallback to backend upload
        if (!uploadRes.ok) {
          const key = masterKey || sessionStorage.getItem("platform_master_key") || "";
          uploadRes = await fetch(`${API_BASE}/api/platform/upload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-platform-key": key,
            },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
            }),
          });
        }

        const data = await uploadRes.json();
        if (uploadRes.ok && data.url) {
          setWebsiteConfig((prev) => ({ ...prev, logoUrl: data.url }));
          setCmsMessage({
            type: "success",
            text: "Platform logo uploaded successfully! Click 'Save Website Changes' to publish.",
          });
        } else {
          // If server upload failed, fallback to direct base64 data URL
          setWebsiteConfig((prev) => ({ ...prev, logoUrl: base64Data }));
          setCmsMessage({
            type: "success",
            text: "Logo loaded as image data! Click 'Save Website Changes' to publish.",
          });
        }
        setLogoUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setCmsMessage({
        type: "error",
        text: "Error uploading logo: " + (err.message || "Upload failed"),
      });
      setLogoUploading(false);
    }
  };

  // Auto generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  // Register New Tenant
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setRegMessage(null);

    const key = masterKey || sessionStorage.getItem("platform_master_key") || "";

    try {
      const res = await fetch(`${API_BASE}/api/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-platform-key": key,
        },
        body: JSON.stringify({
          name,
          slug,
          customDomain: customDomain || undefined,
          plan,
          adminEmail,
          adminPhone: adminPhone || undefined,
          adminPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRegMessage({
          type: "success",
          text: `School "${name}" registered successfully with slug "${slug}"! Initial admin: ${adminEmail}`,
        });
        setName("");
        setSlug("");
        setCustomDomain("");
        setAdminEmail("");
        setAdminPhone("");
        fetchTenants();
        setActiveTab("MANAGE");
      } else {
        setRegMessage({ type: "error", text: data.error || "Failed to register school." });
      }
    } catch (err: any) {
      setRegMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Tenant Status (Activate / Suspend)
  const toggleTenantStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const key = masterKey || sessionStorage.getItem("platform_master_key") || "";
    try {
      const res = await fetch(`${API_BASE}/api/tenants/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-platform-key": key,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTenants();
      }
    } catch (err) {
      console.error(err);
    }
  };



  // Deregister / Delete Tenant
  const handleDeleteTenant = async (id: string, schoolName: string, schoolSlug: string) => {
    const confirmed = window.confirm(
      `CAUTION: Are you sure you want to completely deregister and delete "${schoolName}" (${schoolSlug})?\n\nThis will permanently erase all associated students, faculty, attendance, fee invoices, and exam records for this school.`
    );
    if (!confirmed) return;

    const key = masterKey || sessionStorage.getItem("platform_master_key") || "";

    try {
      const res = await fetch(`${API_BASE}/api/tenants/${id}`, {
        method: "DELETE",
        headers: {
          "x-platform-key": key,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || `School "${schoolName}" deleted.`);
        fetchTenants();
      } else {
        alert(data.error || "Failed to delete school.");
      }
    } catch (err: any) {
      alert("Error deleting school: " + err.message);
    }
  };

  // Open Password Reset Modal for a School
  const handleOpenResetModal = (school: TenantItem) => {
    setResetModalSchool(school);
    setNewSchoolPassword("");
    setResetMessage(null);
  };

  // Generate Random Password Helper
  const handleGenerateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let rand = "";
    for (let i = 0; i < 8; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewSchoolPassword(`Gkp@${rand}`);
  };

  // Submit School Admin Password Reset
  const handleResetSchoolPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalSchool) return;

    if (!newSchoolPassword || newSchoolPassword.length < 6) {
      setResetMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setResetSubmitting(true);
    setResetMessage(null);

    const key = masterKey || sessionStorage.getItem("platform_master_key") || "";

    try {
      const res = await fetch(`${API_BASE}/api/tenants/${resetModalSchool.id}/reset-admin-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-platform-key": key,
        },
        body: JSON.stringify({
          newPassword: newSchoolPassword,
          adminUserId: resetModalSchool.users?.[0]?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetMessage({
          type: "success",
          text: data.message || `Password for ${resetModalSchool.name} administrator updated successfully!`,
        });
        fetchTenants();
      } else {
        setResetMessage({
          type: "error",
          text: data.error || "Failed to reset school administrator password.",
        });
      }
    } catch (err: any) {
      setResetMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setResetSubmitting(false);
    }
  };

  // Save Website CMS Changes
  const handleSaveWebsiteCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSaving(true);
    setCmsMessage(null);

    const key = masterKey || sessionStorage.getItem("platform_master_key") || "";

    try {
      const res = await fetch(`${API_BASE}/api/platform/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-platform-key": key,
        },
        body: JSON.stringify(websiteConfig),
      });

      const data = await res.json();

      if (res.ok) {
        setCmsMessage({
          type: "success",
          text: "Website configuration saved successfully! Public portal reflects new updates.",
        });
        if (data.config) {
          setWebsiteConfig(data.config);
        }
      } else {
        setCmsMessage({
          type: "error",
          text: data.error || "Failed to update website configuration.",
        });
      }
    } catch (err: any) {
      setCmsMessage({
        type: "error",
        text: err.message || "Network error while saving CMS config.",
      });
    } finally {
      setCmsSaving(false);
    }
  };

  // 1. PIN Authentication Gate (Green & Yellow Brand Aesthetics)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-emerald-500/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-3.5 mb-6 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 flex items-center justify-center text-2xl font-black text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40">
              🛡️
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Platform Super Admin</h1>
              <p className="text-xs text-amber-300/90 font-mono">Goan Ki Pathshala • Multi-Tenant Authority</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-5 leading-relaxed relative z-10">
            School provisioning, administrator credential resets, and portal CMS are restricted to verified platform administrators. Enter your Master Authority Key to continue.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                Master Authority Key
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter SuperAdmin key..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none font-mono"
                autoFocus
              />
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
                {pinError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
            >
              {isVerifying ? "Verifying Authority..." : "Unlock Authority Dashboard →"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center relative z-10">
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-300 transition">
              ← Return to Main Platform
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Aggregate Metrics
  const totalStudents = tenants.reduce((sum, t) => sum + t._count.studentProfiles, 0);
  const totalStaff = tenants.reduce((sum, t) => sum + t._count.users, 0);
  const totalClasses = tenants.reduce((sum, t) => sum + t._count.classGrades, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Platform Admin Header (Green & Yellow) */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 sm:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {websiteConfig.logoUrl ? (
            <div className="h-10 max-w-[140px] flex items-center justify-center overflow-hidden">
              <img src={websiteConfig.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 flex items-center justify-center font-bold text-lg text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40">
              🛡️
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-white">Platform Super Admin</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-emerald-700/60 font-bold">
                AUTHORITY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Goan Ki Pathshala • Tenant Management & CMS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-xs font-bold text-amber-300 border border-emerald-700/50 transition flex items-center gap-1.5"
          >
            <span>🌐</span> Public Portal ↗
          </Link>
          <a
            href="https://goankipathsala.onrender.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-amber-300 border border-slate-700 transition flex items-center gap-1.5"
            title="Interactive API Documentation"
          >
            <span>📖</span> API Docs ↗
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/80 text-xs font-semibold text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-8">
        {/* Metric Cards (Green & Amber Highlights) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm hover:border-emerald-500/40 transition">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Schools</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{tenants.length}</span>
              <span className="text-xs text-emerald-400 font-bold">Tenants</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm hover:border-amber-400/40 transition">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Students</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-300">{totalStudents}</span>
              <span className="text-xs text-amber-400 font-bold">Dossiers</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm hover:border-emerald-500/40 transition">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Faculty & Staff</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-300">{totalStaff}</span>
              <span className="text-xs text-emerald-400 font-bold">Active</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm hover:border-amber-400/40 transition">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Academic Classes</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{totalClasses}</span>
              <span className="text-xs text-amber-400 font-bold">Grades</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Green & Amber Brand Styling) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("MANAGE")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "MANAGE"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 border-b-2 border-amber-400"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>🏫</span> Registered Schools ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab("REGISTER")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "REGISTER"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 border-b-2 border-amber-400"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>➕</span> Provision New School
          </button>
          <button
            onClick={() => setActiveTab("WEBSITE")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "WEBSITE"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 border-b-2 border-amber-400"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>🌐</span> Portal Website CMS & Logo
          </button>
          <button
            onClick={() => {
              setActiveTab("INQUIRIES");
              fetchInquiries();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "INQUIRIES"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 border-b-2 border-amber-400"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>📨</span> Inquiries & Leads ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("CONTACT")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "CONTACT"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 border-b-2 border-amber-400"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>📞</span> Configure Contact Details
          </button>
        </div>

        {/* Tab 1: Manage Schools with Password Reset */}
        {activeTab === "MANAGE" && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading registered schools...</div>
            ) : tenants.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
                <p className="text-slate-400 text-sm">No schools onboarded yet.</p>
                <button
                  onClick={() => setActiveTab("REGISTER")}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Provision First School Now
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-4">School & Admin</th>
                        <th className="p-4">School Website</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Students</th>
                        <th className="p-4 text-center">Faculty</th>
                        <th className="p-4 text-center">Classes</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {tenants.map((t) => {
                        const adminUser = t.users?.[0];
                        return (
                          <tr key={t.id} className="hover:bg-slate-800/30 transition">
                            <td className="p-4">
                              <div className="font-extrabold text-white text-sm">{t.name}</div>
                              {adminUser?.email ? (
                                <div className="text-[11px] text-amber-300 font-mono mt-0.5 flex items-center gap-1">
                                  <span>👤</span>
                                  <span>{adminUser.email}</span>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-500 font-mono">ID: {t.id.slice(0, 8)}...</div>
                              )}
                            </td>
                            <td className="p-4">
                              <a
                                href={`/school/${t.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-xs font-bold text-amber-300 border border-emerald-700/60 transition shadow-2xs hover:border-amber-400"
                                title={`Visit ${t.name} Website`}
                              >
                                <span>🌐</span>
                                <span>Visit Website ↗</span>
                              </a>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => toggleTenantStatus(t.id, t.status)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                                  t.status === "ACTIVE"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                                    : "bg-red-950 text-red-400 border border-red-800 hover:bg-red-900"
                                }`}
                              >
                                {t.status === "ACTIVE" ? "✓ Active" : "✕ Suspended"}
                              </button>
                            </td>
                            <td className="p-4 text-center font-bold text-white">
                              {t._count.studentProfiles}
                            </td>
                            <td className="p-4 text-center font-bold text-white">
                              {t._count.users}
                            </td>
                            <td className="p-4 text-center font-bold text-white">
                              {t._count.classGrades}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* School Admin Password Reset Action */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenResetModal(t)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-bold transition border border-amber-400/30 flex items-center gap-1"
                                  title="Reset School Admin Password"
                                >
                                  <span>🔑</span>
                                  <span className="hidden sm:inline">Reset Password</span>
                                </button>
                                <Link
                                  href={`/school/${t.slug}/login`}
                                  target="_blank"
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                                >
                                  Login ↗
                                </Link>
                                <button
                                  onClick={() => handleDeleteTenant(t.id, t.name, t.slug)}
                                  className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 text-xs font-bold transition border border-red-800"
                                  title="Delete Tenant"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: School Administrator Password Reset */}
        {resetModalSchool && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setResetModalSchool(null)}
          >
            <div
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-slate-100 ring-1 ring-amber-400/30 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-lg text-amber-300">
                    🔑
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">Reset School Admin Password</h3>
                    <p className="text-xs text-amber-300/90 font-mono">{resetModalSchool.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResetModalSchool(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {resetMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold border ${
                    resetMessage.type === "success"
                      ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                      : "bg-red-950/60 border-red-800 text-red-300"
                  }`}
                >
                  {resetMessage.text}
                </div>
              )}

              <form onSubmit={handleResetSchoolPassword} className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Target Administrator Account
                  </span>
                  <div className="font-mono text-emerald-400 font-bold text-xs truncate">
                    {resetModalSchool.users?.[0]?.email || "Primary School Admin"}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-amber-300 uppercase">
                      New Password (Min 6 chars) *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateRandomPassword}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <span>🎲</span> Generate Secure
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newSchoolPassword}
                      onChange={(e) => setNewSchoolPassword(e.target.value)}
                      placeholder="Enter or generate new password..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none font-mono pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setResetModalSchool(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
                  >
                    {resetSubmitting ? "Updating Password..." : "Set New Password →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Provision New School */}
        {activeTab === "REGISTER" && (
          <div className="max-w-2xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <span>➕</span> Onboard New Partner School
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Create an isolated tenant namespace with custom branding, initial curriculum database, and administrator account.
            </p>

            {regMessage && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs font-bold border ${
                  regMessage.type === "success"
                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                    : "bg-red-950/60 border-red-800 text-red-300"
                }`}
              >
                {regMessage.text}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Saraswati Vidya Mandir"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Subdomain Slug *
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="saraswati-vidya-mandir"
                      className="w-full px-3.5 py-2.5 rounded-l-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                    />
                    <span className="px-3 py-2.5 rounded-r-xl bg-slate-800 border-y border-r border-slate-700 text-[11px] font-mono text-slate-400">
                      .goankipathsala.in
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Custom Domain (Optional)
                  </label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="e.g. saraswatischool.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                  Initial School Administrator Credentials
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="principal@school.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        Admin Phone (Optional)
                      </label>
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="+91 98260 00000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        Admin Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                {submitting ? "Provisioning School Infrastructure..." : "Create School Tenant & Issue License →"}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Portal Website CMS & Logo Upload (Green & Yellow) */}
        {activeTab === "WEBSITE" && (
          <div className="max-w-4xl bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>🌐</span> Portal Website Content & Brand Logo
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload your platform logo and configure public landing page headlines, announcement banners, contact details, and ERP module highlights.
                </p>
              </div>
              <a
                href="/"
                target="_blank"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-xs font-bold text-amber-300 border border-emerald-700/60 transition flex items-center gap-1.5 shrink-0"
              >
                <span>👁️</span> Preview Public Website ↗
              </a>
            </div>

            {cmsMessage && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold border ${
                  cmsMessage.type === "success"
                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                    : "bg-red-950/60 border-red-800 text-red-300"
                }`}
              >
                {cmsMessage.text}
              </div>
            )}

            <form onSubmit={handleSaveWebsiteCms} className="space-y-6">
              {/* Section 0: Platform Logo Upload */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <span>🖼️</span> Platform Brand Logo
                  </h3>
                  {websiteConfig.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setWebsiteConfig({ ...websiteConfig, logoUrl: "" })}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Remove Logo (Reset to Default Emblem)
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="h-20 w-36 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center p-2 overflow-hidden shadow-inner shrink-0">
                    {websiteConfig.logoUrl ? (
                      <img
                        src={websiteConfig.logoUrl}
                        alt="Platform Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 flex items-center justify-center font-black text-2xl text-slate-950 shadow-md">
                        ग
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      onChange={handleLogoFileChange}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        disabled={logoUploading}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
                      >
                        <span>📁</span>
                        <span>{logoUploading ? "Uploading..." : "Upload New Logo"}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">
                        Supports PNG, JPG, WebP, SVG (Max 10MB)
                      </span>
                    </div>

                    <div className="pt-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        Or Paste Logo Image URL Directly
                      </label>
                      <input
                        type="text"
                        value={websiteConfig.logoUrl || ""}
                        onChange={(e) => setWebsiteConfig({ ...websiteConfig, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Platform Brand & Hero */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  1. Brand Identity & Hero Section
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Platform Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteConfig.brandName}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, brandName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Regional Brand Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteConfig.brandTagline}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, brandTagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Hero Announcement Badge / Pill
                    </label>
                    <input
                      type="text"
                      value={websiteConfig.heroBadge}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, heroBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={websiteConfig.exploreButtonText}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, exploreButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={websiteConfig.heroTitle}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Hero Description Paragraph
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={websiteConfig.heroDescription}
                    onChange={(e) => setWebsiteConfig({ ...websiteConfig, heroDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 2: Top Alert & Announcement Bar */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    2. Top Alert & Announcement Bar
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={websiteConfig.announcementBanner?.enabled ?? true}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          announcementBanner: {
                            ...websiteConfig.announcementBanner,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="accent-amber-400 h-4 w-4 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-300">Show Top Banner</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Announcement Banner Message
                  </label>
                  <input
                    type="text"
                    value={websiteConfig.announcementBanner?.text || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        announcementBanner: {
                          ...websiteConfig.announcementBanner,
                          text: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 🚀 Admissions open across all partner schools for Academic Session 2026-27."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 3: Contact & Helpdesk */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  3. Contact & Helpdesk Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={websiteConfig.contact?.email || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, email: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Support Phone Number
                    </label>
                    <input
                      type="text"
                      value={websiteConfig.contact?.phone || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, phone: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Headquarters / Office Address
                  </label>
                  <input
                    type="text"
                    value={websiteConfig.contact?.address || ""}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        contact: { ...websiteConfig.contact, address: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Helpdesk / Support Section Title
                    </label>
                    <input
                      type="text"
                      placeholder="Direct Support Channels"
                      value={websiteConfig.contact?.helpdeskTitle || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, helpdeskTitle: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Welcome / Support Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="Connect directly with our onboarding specialists..."
                      value={websiteConfig.contact?.welcomeText || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, welcomeText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Support Desk Working Hours
                    </label>
                    <input
                      type="text"
                      placeholder="Mon – Sat, 8:00 AM – 7:00 PM IST"
                      value={websiteConfig.contact?.supportHours || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, supportHours: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Average Response Time Badge
                    </label>
                    <input
                      type="text"
                      placeholder="< 2 Hours"
                      value={websiteConfig.contact?.responseTime || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, responseTime: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Feature Module Highlights */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  4. Platform Capabilities & ERP Modules ({websiteConfig.features?.length || 0})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {websiteConfig.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-amber-400/40 transition"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feat.icon}
                          onChange={(e) => {
                            const updated = [...(websiteConfig.features || [])];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setWebsiteConfig({ ...websiteConfig, features: updated });
                          }}
                          className="w-12 text-center py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-base"
                          title="Module Emoji Icon"
                        />
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...(websiteConfig.features || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setWebsiteConfig({ ...websiteConfig, features: updated });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
                          title="Module Title"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={feat.description}
                        onChange={(e) => {
                          const updated = [...(websiteConfig.features || [])];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setWebsiteConfig({ ...websiteConfig, features: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:border-amber-400 focus:outline-none"
                        title="Module Description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={cmsSaving}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
                >
                  {cmsSaving ? "Saving Website Changes..." : "Save Website Changes →"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Contact Inquiries & Onboarding Leads */}
        {activeTab === "INQUIRIES" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>📨</span> Contact Inquiries & Onboarding Leads
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submissions received from the public website contact form.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 text-amber-300 border border-emerald-700/60 font-bold">
                  {inquiries.length} Inquiries
                </span>
                <button
                  onClick={fetchInquiries}
                  disabled={inquiriesLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 transition flex items-center gap-1.5"
                >
                  <span>🔄</span> Refresh
                </button>
              </div>
            </div>

            {inquiriesLoading ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                Loading inquiries from database...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-slate-300 font-bold text-sm">No Inquiries Submitted Yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  When visitors or school administrators submit inquiries through the contact form at{" "}
                  <Link href="/#contact" className="text-amber-400 underline">
                    /#contact
                  </Link>
                  , their messages and details will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {inquiries.map((inq) => {
                  const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9+]/g, "") : null;
                  const dateStr = new Date(inq.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });

                  return (
                    <div
                      key={inq.id}
                      className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 transition shadow-lg space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 text-slate-950 font-black flex items-center justify-center text-base">
                            {inq.fullName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-base text-white">{inq.fullName}</h3>
                            {inq.schoolName && (
                              <p className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                                <span>🏫</span> {inq.schoolName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-700 text-slate-300">
                            {inq.inquiryType}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                              inq.status === "NEW"
                                ? "bg-amber-400/10 text-amber-300 border-amber-400/40"
                                : inq.status === "CONTACTED"
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
                                : inq.status === "RESOLVED"
                                ? "bg-blue-500/10 text-blue-300 border-blue-500/40"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            ● {inq.status}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">{dateStr}</span>
                        </div>
                      </div>

                      {/* Message body */}
                      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/60 text-xs text-slate-200 leading-relaxed">
                        <p className="font-mono text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                          Inquiry Message:
                        </p>
                        {inq.message}
                      </div>

                      {/* Action & Contact Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-3">
                          {inq.phone && (
                            <>
                              <a
                                href={`tel:${cleanPhone}`}
                                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-bold transition flex items-center gap-1.5"
                              >
                                <span>📞</span> Call {inq.phone}
                              </a>
                              <a
                                href={`https://wa.me/${cleanPhone?.replace("+", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition flex items-center gap-1.5"
                              >
                                <span>💬</span> WhatsApp
                              </a>
                            </>
                          )}
                          {inq.email && (
                            <a
                              href={`mailto:${inq.email}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <span>✉️</span> {inq.email}
                            </a>
                          )}
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Status:
                          </label>
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Contact Details & Helpdesk Configuration */}
        {activeTab === "CONTACT" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>📞</span> Platform Contact Details & Helpdesk
                </h2>
                <p className="text-xs text-amber-300/90 font-mono">
                  Configure helpline phone, official email, support office hours, and welcome narrative
                </p>
              </div>

              {contactMessage && (
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                    contactMessage.type === "success"
                      ? "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                      : "bg-red-950/80 border-red-700 text-red-300"
                  }`}
                >
                  {contactMessage.text}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveContactConfig} className="space-y-6">
              {/* Card 1: Narrative & Welcome Message */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                  <span>🏛️</span> Helpdesk Narrative & Welcome Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Helpdesk Section Title
                    </label>
                    <input
                      type="text"
                      value={websiteConfig.contact.helpdeskTitle || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, helpdeskTitle: e.target.value },
                        })
                      }
                      placeholder="e.g. Platform Office & Support Desk"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Welcome Narrative Text
                    </label>
                    <textarea
                      rows={3}
                      value={websiteConfig.contact.welcomeText || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, welcomeText: e.target.value },
                        })
                      }
                      placeholder="We welcome school administrators, educators, and trustees to contact our support team..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Contact Communication Channels */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                  <span>✉️</span> Official Communication Channels
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Official Contact / Support Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={websiteConfig.contact.email}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, email: e.target.value },
                        })
                      }
                      placeholder="contact@goankipathsala.in"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Helpline / WhatsApp Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteConfig.contact.phone}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, phone: e.target.value },
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Headquarters / Office Physical Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteConfig.contact.address}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, address: e.target.value },
                        })
                      }
                      placeholder="Rural EdTech Innovation Hub, Cyber City, India"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Operating Hours & Response SLA */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                  <span>⏱️</span> Support Desk Operating Hours & Response SLA
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Support Desk Operating Hours
                    </label>
                    <input
                      type="text"
                      value={websiteConfig.contact.supportHours || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, supportHours: e.target.value },
                        })
                      }
                      placeholder="e.g. Mon – Sat: 08:30 AM – 06:00 PM IST"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Response Time SLA Badge
                    </label>
                    <input
                      type="text"
                      value={websiteConfig.contact.responseTime || ""}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          contact: { ...websiteConfig.contact, responseTime: e.target.value },
                        })
                      }
                      placeholder="e.g. Average Response: Under 2 Hours"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={contactSaving}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <span>💾</span>
                  <span>{contactSaving ? "Saving Details..." : "Save Contact Details"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
