"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  customDomain?: string | null;
  plan: string;
  status: string;
  createdAt: string;
  _count: {
    users: number;
    studentProfiles: number;
    classGrades: number;
  };
}

const PLATFORM_PIN = "SuperAdmin@2026";

export default function PlatformAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"MANAGE" | "REGISTER">("MANAGE");

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

  // Check auth session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("platform_admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PLATFORM_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("platform_admin_auth", "true");
      setPinError("");
    } else {
      setPinError("Invalid Platform Master Access Key.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("platform_admin_auth");
    setPinInput("");
  };

  // Fetch tenants
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/tenants");
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants();
    }
  }, [isAuthenticated]);

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

    try {
      const res = await fetch("http://localhost:4000/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    try {
      const res = await fetch(`http://localhost:4000/api/tenants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTenants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Tenant Plan
  const changeTenantPlan = async (id: string, newPlan: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/tenants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
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

    try {
      const res = await fetch(`http://localhost:4000/api/tenants/${id}`, {
        method: "DELETE",
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

  // 1. PIN Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
        <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl font-black text-slate-950">
              🛡️
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Platform Super Admin</h1>
              <p className="text-xs text-slate-400">Goan Ki Pathshala • Multi-Tenant Authority</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-5 leading-relaxed">
            School onboarding and tenant provisioning are restricted to platform administrators. Enter the master access key below to continue.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Master Authority Passphrase
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter SuperAdmin key..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
              <p className="text-[11px] text-slate-500 mt-1">Default master key: <code className="text-emerald-400 font-mono">SuperAdmin@2026</code></p>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
                {pinError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20"
            >
              Unlock Authority Dashboard →
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Platform Admin Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 sm:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-lg text-slate-950 shadow-md">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-white">Platform Super Admin</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROVISIONING AUTHORITY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Goan Ki Pathshala • Tenant Management & Licensing</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            ← Public Home
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-xs font-semibold text-red-400 border border-red-800 transition"
          >
            Lock Authority
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Schools</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{tenants.length}</span>
              <span className="text-xs text-emerald-400">Tenants</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Students</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{totalStudents}</span>
              <span className="text-xs text-blue-400">Dossiers</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Faculty & Staff</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{totalStaff}</span>
              <span className="text-xs text-amber-400">Active</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Academic Classes</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{totalClasses}</span>
              <span className="text-xs text-purple-400">Grades</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("MANAGE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "MANAGE"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>🏫</span> Registered School Directory ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab("REGISTER")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "REGISTER"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span>➕</span> Provision New School
          </button>
        </div>

        {/* Tab 1: Manage Schools */}
        {activeTab === "MANAGE" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Schools & License Management</h2>
              <button
                onClick={fetchTenants}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300"
              >
                ↻ Refresh Directory
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs font-mono">Loading school tenants...</div>
            ) : tenants.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <p className="text-sm text-slate-400 mb-3">No schools registered yet.</p>
                <button
                  onClick={() => setActiveTab("REGISTER")}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Provision First School Now →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-4">School Name & Domain</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Students</th>
                      <th className="p-4">Staff</th>
                      <th className="p-4">Created</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tenants.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{t.name}</div>
                          <div className="font-mono text-[11px] text-emerald-400">{t.slug}.goankipathsala.in</div>
                          {t.customDomain && (
                            <div className="font-mono text-[10px] text-slate-400">Custom: {t.customDomain}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <select
                            value={t.plan}
                            onChange={(e) => changeTenantPlan(t.id, e.target.value)}
                            className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200"
                          >
                            <option value="TRIAL">TRIAL</option>
                            <option value="STANDARD">STANDARD</option>
                            <option value="PREMIUM">PREMIUM</option>
                            <option value="ENTERPRISE">ENTERPRISE</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleTenantStatus(t.id, t.status)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition ${
                              t.status === "ACTIVE"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                                : "bg-red-950 text-red-400 border border-red-800 hover:bg-red-900"
                            }`}
                          >
                            {t.status === "ACTIVE" ? "● Active" : "✕ Suspended"}
                          </button>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">{t._count.studentProfiles}</td>
                        <td className="p-4 font-mono font-bold text-white">{t._count.users}</td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Link
                            href={`/school/${t.slug}`}
                            target="_blank"
                            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] transition inline-block"
                          >
                            View Website ↗
                          </Link>
                          <Link
                            href={`/school/${t.slug}/dashboard`}
                            target="_blank"
                            className="px-2.5 py-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 font-semibold text-[11px] transition inline-block"
                          >
                            Admin Portal ↗
                          </Link>
                          <button
                            onClick={() => handleDeleteTenant(t.id, t.name, t.slug)}
                            className="px-2.5 py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 font-semibold text-[11px] transition"
                          >
                            Deregister ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Provision New School */}
        {activeTab === "REGISTER" && (
          <div className="max-w-2xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white">Provision New School Tenant</h2>
              <p className="text-xs text-slate-400 mt-1">
                Creates an isolated subdomain, auto-seeds Kindergarten (Pre-KG, Nursery, LKG, UKG) and Grades 1-12, and issues school administrator credentials.
              </p>
            </div>

            {regMessage && (
              <div
                className={`p-4 rounded-xl text-xs mb-6 font-semibold ${
                  regMessage.type === "success"
                    ? "bg-emerald-950 border border-emerald-800 text-emerald-300"
                    : "bg-red-950 border border-red-800 text-red-300"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-l-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none font-mono"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Subscription License Plan
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="TRIAL">TRIAL (14 Days Demo)</option>
                    <option value="STANDARD">STANDARD (Up to 500 Students)</option>
                    <option value="PREMIUM">PREMIUM (Up to 1500 Students)</option>
                    <option value="ENTERPRISE">ENTERPRISE (Unlimited Campus)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
              >
                {submitting ? "Provisioning School Infrastructure..." : "Create School Tenant & Issue License →"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
