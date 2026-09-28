"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE } from "@/lib/config";

export default function SchoolPortalGatewayPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("gkp_token");
    const userStr = localStorage.getItem("gkp_user");
    if (token && userStr) {
      try {
        setExistingUser(JSON.parse(userStr));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
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

      localStorage.setItem("gkp_token", data.token);
      localStorage.setItem("gkp_user", JSON.stringify(data.user));

      router.push(`/school/${slug}/dashboard`);
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <Link href={`/school/${slug}`} className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950">
            🔒
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white">School Management Portal</h1>
            <p className="text-[11px] font-mono text-emerald-400">{slug}.goankipathsala.in</p>
          </div>
        </Link>
        <Link
          href={`/school/${slug}`}
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          ← Public Campus Website
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Authorized Personnel Only
            </span>
            <h2 className="text-2xl font-black text-white mt-3">Staff & Admin Workspace</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your institutional email or mobile number.
            </p>
          </div>

          {existingUser && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-emerald-400 font-bold uppercase">Active Session Detected</p>
                <p className="text-xs text-white font-semibold">{existingUser.email || existingUser.phone}</p>
                <span className="text-[10px] font-mono text-slate-400">Role: {existingUser.role}</span>
              </div>
              <Link
                href={`/school/${slug}/dashboard`}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm"
              >
                Go to Dashboard →
              </Link>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address or Phone
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="teacher@school.com or +91..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href={`/school/${slug}/forgot-password`}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Authenticating Credentials..." : "Enter School Command Center →"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              Need assistance? Contact your school principal or platform administrator.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Goan Ki Pathshala (गाँव की पाठशाला) • High-Security School ERP
      </footer>
    </div>
  );
}
