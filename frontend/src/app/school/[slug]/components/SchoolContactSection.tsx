"use client";

import React, { useState } from "react";

interface SchoolContactSectionProps {
  slug: string;
  schoolName: string;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactHelpdeskTitle?: string;
  contactWelcomeText?: string;
  admissionHours?: string;
  feeCounterHours?: string;
  admissionDocumentsText?: string;
}

export default function SchoolContactSection({
  slug,
  schoolName,
  contactAddress,
  contactPhone,
  contactEmail,
  contactHelpdeskTitle,
  contactWelcomeText,
  admissionHours,
  feeCounterHours,
  admissionDocumentsText,
}: SchoolContactSectionProps) {
  const address = contactAddress || "School Campus, Main Village Road";
  const phone = contactPhone || "+91 91113 93176";
  const email = contactEmail || `info@${slug}.goankipathsala.in`;
  const helpdeskTitle = contactHelpdeskTitle || "Campus Office & Helpdesk";
  const welcomeText = contactWelcomeText || "We welcome parents and guardians to visit our campus during official visiting hours.";
  const admHours = admissionHours || "Mon – Sat, 8:00 AM – 3:30 PM";
  const feeHours = feeCounterHours || "Mon – Sat, 8:30 AM – 2:00 PM";
  const docText = admissionDocumentsText || "1. Child's Birth Certificate • 2. Two Passport Photos • 3. Previous School TC & Report Card • 4. Aadhaar Card copy";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    phone: "",
    email: "",
    gradeSeeking: "Class 1",
    inquiryType: "New Student Admission & Enrolment",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inquiryId, setInquiryId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName.trim()) {
      setErrorMessage("Please enter Parent / Guardian name.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please provide a valid contact mobile or WhatsApp number.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please write a short message or question.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/school/${slug}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSuccess(true);
      if (data.inquiry?.id) {
        setInquiryId(data.inquiry.id);
      }
      setFormData({
        parentName: "",
        studentName: "",
        phone: "",
        email: "",
        gradeSeeking: "Class 1",
        inquiryType: "New Student Admission & Enrolment",
        message: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit your inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 py-16 px-6 sm:px-12 max-w-6xl mx-auto w-full">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 mb-2">
          <span>🏫 Admissions & Campus Inquiries</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Admissions, Fees & Information Desk
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Planning admission for Academic Session 2026-27 or have questions regarding syllabus,
          fees, or bus routes? Submit the inquiry form below or reach our campus office directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: School Contact & Visit Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <span>📍</span> {helpdeskTitle}
            </div>
            <h4 className="text-base font-extrabold text-white mb-2">{schoolName}</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {welcomeText}
            </p>

            <div className="space-y-4">
              {/* Phone Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-base shrink-0">
                    📞
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Helpline & WhatsApp
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-sm font-bold text-white hover:text-emerald-400 transition block mt-0.5"
                    >
                      {phone}
                    </a>
                    <div className="mt-2 flex items-center gap-2">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] font-bold transition flex items-center gap-1"
                      >
                        <span>📞</span> Call Desk
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[10px] font-bold transition flex items-center gap-1"
                      >
                        <span>💬</span> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 flex items-center justify-center text-base shrink-0">
                    ✉️
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Official Admissions Email
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-xs font-bold text-white hover:text-emerald-400 transition block mt-0.5 break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800 flex items-center justify-center text-base shrink-0">
                    📌
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Campus Location
                    </span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Admission Counter:</span>
                <span className="text-white font-bold">{admHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fee Counter:</span>
                <span className="text-white font-bold">{feeHours}</span>
              </div>
            </div>
          </div>

          {/* Admission Checklist Callout */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <span>📋</span> Documents for Enrolment:
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {docText}
            </p>
          </div>
        </div>

        {/* Right Column: Admission & Fee Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <span>📝</span> Admission & Fee Inquiry Form
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submit this inquiry and our school admission team will contact you.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Session 2026-27
              </span>
            </div>

            {success ? (
              <div className="p-8 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-center animate-fadeIn">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  ✓
                </div>
                <h5 className="text-xl font-black text-white">Inquiry Submitted!</h5>
                <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you! Your inquiry has been delivered directly to the administration of{" "}
                  <strong className="text-emerald-400">{schoolName}</strong>. Our admission desk
                  will call you or message on WhatsApp shortly.
                </p>
                {inquiryId && (
                  <p className="text-[11px] font-mono text-emerald-400 mt-3">
                    Reference ID:{" "}
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {inquiryId}
                    </span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-700 text-xs font-bold transition"
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
                  {/* Parent Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Parent / Guardian Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Chouhan"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>

                  {/* Student Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Student&apos;s Name
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Chouhan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile / WhatsApp */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. parent@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs placeholder-slate-500 outline-hidden transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Class seeking admission */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Grade / Class Seeking
                    </label>
                    <select
                      name="gradeSeeking"
                      value={formData.gradeSeeking}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs outline-hidden transition"
                    >
                      <option value="Pre-Nursery / Playgroup">Pre-Nursery / Playgroup</option>
                      <option value="Nursery">Nursery</option>
                      <option value="LKG (Junior KG)">LKG (Junior KG)</option>
                      <option value="UKG (Senior KG)">UKG (Senior KG)</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11 (Science)">Class 11 (Science)</option>
                      <option value="Class 11 (Commerce)">Class 11 (Commerce)</option>
                      <option value="Class 11 (Arts)">Class 11 (Arts)</option>
                      <option value="Class 12 (Science)">Class 12 (Science)</option>
                      <option value="Class 12 (Commerce)">Class 12 (Commerce)</option>
                      <option value="Class 12 (Arts)">Class 12 (Arts)</option>
                    </select>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs outline-hidden transition"
                    >
                      <option value="New Student Admission & Enrolment">
                        🌾 New Student Admission & Enrolment
                      </option>
                      <option value="School Fee Structure & Quarterly Installments">
                        💳 School Fee Structure & Installments
                      </option>
                      <option value="Village Bus Route & Pickup Point Inquiry">
                        🚌 Village Bus Route & Pickup Points
                      </option>
                      <option value="Curriculum, CBSE Books & Smart Classrooms">
                        📚 Curriculum, CBSE Books & Smart Classes
                      </option>
                      <option value="Hostel & Sports Facilities">
                        ⚽ Hostel & Sports Facilities
                      </option>
                      <option value="General Campus Question / Other">
                        ❓ General Campus Question / Other
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Questions / Requirements <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about previous school, village location, transport requirement, or any question regarding fees and admission..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs placeholder-slate-500 outline-hidden transition resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                      <span>Submitting Admission Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>📨</span>
                      <span>Submit Inquiry to School Admission Desk</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-500 text-center">
                  🔒 Information submitted is delivered directly to the school administrative office.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
