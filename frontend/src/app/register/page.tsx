"use client";

import React, { useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/config";

interface RegisterFormData {
  schoolName: string;
  slug: string;
  customDomain: string;
  plan: "FREE" | "STANDARD" | "PREMIUM";
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
}

export default function RegisterTenantPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    schoolName: "",
    slug: "",
    customDomain: "",
    plan: "STANDARD",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);

  // Auto-generate slug from school name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      schoolName: name,
      slug: generatedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/api/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.schoolName,
          slug: formData.slug,
          customDomain: formData.customDomain || null,
          plan: formData.plan,
          adminEmail: formData.adminEmail,
          adminPhone: formData.adminPhone,
          adminPassword: formData.adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register school tenant.");
      }

      setSuccess(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-lg text-slate-950">
            ग
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight">Goan Ki Pathshala</h1>
            <p className="text-xs text-slate-400">गाँव की पाठशाला • Multi-Tenant School SaaS</p>
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-emerald-400 transition"
        >
          ← Back to Overview
        </Link>
      </header>

      {/* Main Form Content */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            School Onboarding
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Register Your School
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Provision an isolated tenant environment for your school with a custom subdomain and primary administrator account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Registration Failed</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {success ? (
          <div className="p-8 rounded-xl bg-slate-900 border border-emerald-800/80 text-center">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-emerald-500/30">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-white">
              {success.tenant.name} is Ready!
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Your tenant has been successfully provisioned. You can now access your dedicated school portal via:
            </p>

            <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Tenant Slug:</span>
                <span className="text-emerald-400">{success.tenant.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Portal Subdomain:</span>
                <span className="text-slate-200">
                  http://{success.tenant.slug}.localhost:3000
                </span>
              </div>
              {success.admin && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Admin Login:</span>
                  <span className="text-slate-200">{success.admin.email}</span>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => {
                  setSuccess(null);
                  setFormData({
                    schoolName: "",
                    slug: "",
                    customDomain: "",
                    plan: "STANDARD",
                    adminEmail: "",
                    adminPhone: "",
                    adminPassword: "",
                  });
                }}
                className="px-4 py-2 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Register Another School
              </button>
              <Link
                href="/"
                className="px-4 py-2 text-xs font-semibold rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
          >
            {/* School Details Section */}
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                1. School Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saraswati Vidya Mandir"
                    value={formData.schoolName}
                    onChange={handleNameChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subdomain Slug *
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="svm-raipur"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })
                      }
                      className="w-full px-3.5 py-2.5 rounded-l-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <span className="px-3.5 py-2.5 rounded-r-lg bg-slate-800 border border-l-0 border-slate-700 text-slate-400 text-xs font-mono">
                      .goankipathsala.in
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Used to isolate this school&apos;s data, portals, and student portals.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Custom Domain (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="portal.svmraipur.edu"
                    value={formData.customDomain}
                    onChange={(e) =>
                      setFormData({ ...formData, customDomain: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData({ ...formData, plan: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FREE">Free Pilot (Up to 100 students)</option>
                    <option value="STANDARD">Standard School (Full ERP + Offline LMS)</option>
                    <option value="PREMIUM">Premium Network (Multiple campuses + AI Tutors)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* School Administrator Section */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                2. Principal / Administrator Account
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="principal@school.edu"
                      value={formData.adminEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, adminEmail: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.adminPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, adminPhone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Master Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.adminPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, adminPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Minimum 8 characters. Used to log in as School Admin.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-base">⏳</span>
                    Provisioning School Tenant...
                  </>
                ) : (
                  "Create School Environment →"
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        Goan Ki Pathshala (गाँव की पाठशाला) © 2026 • Multi-Tenant School Infrastructure
      </footer>
    </div>
  );
}
