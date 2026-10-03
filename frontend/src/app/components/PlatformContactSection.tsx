"use client";

import React, { useState } from "react";

interface ContactProps {
  contact?: {
    email: string;
    phone: string;
    address: string;
    helpdeskTitle?: string;
    welcomeText?: string;
    supportHours?: string;
    responseTime?: string;
  };
  brandName?: string;
}

export default function PlatformContactSection({
  contact,
  brandName = "Goan Ki Pathshala",
}: ContactProps) {
  const email = contact?.email || "contact@goankipathsala.in";
  const phone = contact?.phone || "+91 98765 43210";
  const address = contact?.address || "Rural EdTech Innovation Hub, Cyber City, India";
  const helpdeskTitle = contact?.helpdeskTitle || "Direct Support Channels";
  const welcomeText = contact?.welcomeText || "Connect directly with our onboarding specialists & academic coordinators.";
  const supportHours = contact?.supportHours || "Mon – Sat, 8:00 AM – 7:00 PM IST";
  const responseTime = contact?.responseTime || "< 2 Hours";

  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    schoolName: "",
    inquiryType: "New School Onboarding / Tenant Setup",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedInquiryId, setSubmittedInquiryId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMessage("Please provide either an email address or mobile phone number.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter a short message describing your inquiry.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/platform/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSubmitSuccess(true);
      if (data.inquiry?.id) {
        setSubmittedInquiryId(data.inquiry.id);
      }
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        schoolName: "",
        inquiryType: "New School Onboarding / Tenant Setup",
        message: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while sending your inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="mb-20 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30 mb-2">
          <span>🌾 24/7 Educational Partnership & Support</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Get in Touch with Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-amber-400">
            Platform Team
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Whether you want to onboard your village school, schedule a live CBSE ERP demonstration,
          or request assistance, our dedicated team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden ring-1 ring-emerald-500/10">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
              <span>📞</span> {helpdeskTitle}
            </h4>
            <p className="text-xs text-slate-400 mb-6">
              {welcomeText}
            </p>

            <div className="space-y-4">
              {/* Phone Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 flex items-center justify-center text-lg shrink-0">
                    📱
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Phone & WhatsApp Helpline
                    </p>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-sm sm:text-base font-extrabold text-white hover:text-amber-300 transition block mt-0.5 truncate"
                    >
                      {phone}
                    </a>
                    <div className="mt-2 flex items-center gap-2">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition inline-flex items-center gap-1"
                      >
                        <span>📞</span> Call Now
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-md bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold transition inline-flex items-center gap-1"
                      >
                        <span>💬</span> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 flex items-center justify-center text-lg shrink-0">
                    ✉️
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Official Email Inquiries
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-extrabold text-white hover:text-amber-300 transition block mt-0.5 break-all"
                    >
                      {email}
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="mt-2 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold transition inline-flex items-center gap-1"
                    >
                      <span>✉️</span> Compose Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-400/40 transition">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                    📍
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Central EdTech Innovation Hub
                    </p>
                    <p className="text-xs font-semibold text-slate-200 mt-1 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Alert */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                Support Desk: <strong className="text-white">{supportHours}</strong>
              </span>
            </div>
          </div>

          {/* Quick FAQ / Value Props Pill */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span> Average Response Time:
            </span>
            <span className="font-bold text-emerald-400">{responseTime}</span>
          </div>
        </div>

        {/* Right Column: Interactive Contact & Onboarding Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative ring-1 ring-amber-400/10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <span>📝</span> Send Us a Message or Inquire
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in your details below and an education consultant will get in touch with you.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Direct Portal Form
              </span>
            </div>

            {submitSuccess ? (
              <div className="p-8 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center animate-fadeIn">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 text-slate-950 flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  ✓
                </div>
                <h5 className="text-xl font-black text-white">Message Received!</h5>
                <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to <strong className="text-amber-300">{brandName}</strong>.
                  Our team has recorded your details and will contact you via Phone or Email shortly.
                </p>
                {submittedInquiryId && (
                  <p className="text-[11px] font-mono text-emerald-400 mt-3">
                    Reference ID: <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{submittedInquiryId}</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 text-xs font-bold transition"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Full Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Kumar"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>

                  {/* School / Institution Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      School / Institution Name
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      placeholder="e.g. Saraswati Vidya Mandir"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. principal@school.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>
                </div>

                {/* Inquiry Purpose */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    What is the purpose of your inquiry?
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs outline-hidden transition"
                  >
                    <option value="New School Onboarding / Tenant Setup">
                      🌾 Onboard a New School (Tenant Onboarding)
                    </option>
                    <option value="Request Live ERP Software Demo">
                      🖥️ Request a Live ERP & Smart Classroom Demo
                    </option>
                    <option value="Fee & Transport Management Engine">
                      💳 Fee Ledger & Village Bus Transport Inquiries
                    </option>
                    <option value="Technical Support & System Queries">
                      🛠️ Technical Support & Administrator Assistance
                    </option>
                    <option value="Pricing & District Institutional Plans">
                      💰 Custom Pricing & District Wide Rollouts
                    </option>
                    <option value="General Questions">
                      ❓ General Question / Other
                    </option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message / Requirements <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your school, student strength, or any specific questions you have..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs placeholder-slate-500 outline-hidden transition resize-none"
                  ></textarea>
                </div>

                {/* Submit Button (Green & Golden Yellow Theme) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>📨</span>
                      <span>Submit Inquiry to Platform Team</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-500 text-center">
                  🔒 Your information is confidential and used solely for institutional onboarding.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
