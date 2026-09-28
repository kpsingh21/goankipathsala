"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [step, setStep] = useState<"REQUEST" | "CONFIRM">("REQUEST");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // Step 1: Request OTP / Reset Code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setDebugOtp(null);

    try {
      const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({ emailOrPhone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.debugOtp) {
        setDebugOtp(data.debugOtp);
      }

      setMsg({ type: "success", text: data.message });
      setStep("CONFIRM");
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to request reset code." });
    } finally {
      setLoading(false);
    }
  };

  const [resetSuccess, setResetSuccess] = useState(false);

  // Step 2: Confirm OTP & set new password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Slug": slug,
        },
        body: JSON.stringify({
          emailOrPhone,
          resetCode,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: "success", text: data.message });
      setResetSuccess(true);
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to reset password." });
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
          href={`/school/${slug}/login`}
          className="text-xs text-slate-400 hover:text-emerald-400 transition"
        >
          ← Back to Login
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            {slug}.goankipathsala.in
          </span>
          <h2 className="text-2xl font-bold text-white mt-3">Reset Account Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            Available for Admins, Teachers, Staff, and Students of this school.
          </p>
        </div>

        {msg && (
          <div
            className={`mb-5 p-3 rounded-lg text-xs flex items-start gap-2 ${
              msg.type === "success"
                ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                : "bg-red-950/80 border border-red-800 text-red-300"
            }`}
          >
            <span>{msg.type === "success" ? "✓" : "⚠️"}</span>
            <span>{msg.text}</span>
          </div>
        )}

        {debugOtp && (
          <div className="mb-5 p-3 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 text-xs">
            <span className="font-bold block">🔑 Dev / Demo Verification Code:</span>
            Your one-time 6-digit reset code is: <code className="font-mono font-bold text-white">{debugOtp}</code>
          </div>
        )}

        {resetSuccess ? (
          <div className="p-8 rounded-xl bg-slate-900 border border-emerald-800 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto border border-emerald-500/30">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">Password Updated!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your password has been changed successfully. You can now sign in using your new credentials.
            </p>
            <div className="pt-2">
              <Link
                href={`/school/${slug}/login`}
                className="inline-block w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
              >
                Go to Login Page →
              </Link>
            </div>
          </div>
        ) : step === "REQUEST" ? (
          <form
            onSubmit={handleRequestOtp}
            className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Enter Your Registered Email or Phone
              </label>
              <input
                type="text"
                required
                placeholder="e.g. principal@school.edu or 9111393176"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                We will generate a 6-digit one-time reset code valid for 15 minutes.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? "Generating Code..." : "Send Reset Code →"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleConfirmReset}
            className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                6-Digit Reset Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? "Updating Password..." : "Update Password & Go to Login →"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep("REQUEST")}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Change Email / Phone
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
        Goan Ki Pathshala • Multi-Tenant School Infrastructure
      </footer>
    </div>
  );
}
