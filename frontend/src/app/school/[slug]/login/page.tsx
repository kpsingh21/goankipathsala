"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SchoolLoginPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user info in localStorage
      localStorage.setItem("gkp_token", data.token);
      localStorage.setItem("gkp_user", JSON.stringify(data.user));

      // Redirect to school staff workspace
      router.push(`/school/${slug}/dashboard`);
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Topbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href={`/school/${slug}`} className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
            ग
          </div>
          <span className="font-bold text-sm tracking-tight">Goan Ki Pathshala</span>
        </Link>
        <Link
          href={`/school/${slug}`}
          className="text-xs text-slate-400 hover:text-emerald-400 transition"
        >
          ← Back to Campus Portal
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            {slug}.goankipathsala.in
          </span>
          <h2 className="text-2xl font-bold text-white mt-3">School Staff Login</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access school ERP, attendance, grading, and curriculum tools.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs">
            ⚠️ {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
        >
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email or Phone Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. principal@school.edu"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Need account help?</span>
            <Link
              href={`/school/${slug}/forgot-password`}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
          >
            {loading ? "Verifying..." : "Sign In to School Workspace →"}
          </button>
        </form>
      </main>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
        Goan Ki Pathshala • Multi-Tenant School Infrastructure
      </footer>
    </div>
  );
}
