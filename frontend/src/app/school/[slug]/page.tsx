"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_BASE } from "@/lib/config";
import SchoolContactSection from "./components/SchoolContactSection";

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
}

interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
}

interface FacilityItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function SchoolPortalPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [school, setSchool] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [busRoutes, setBusRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchPortalData() {
      try {
        const [resSchool, resNotices, resRoutes] = await Promise.all([
          fetch(`${API_BASE}/api/tenants/current`, {
            headers: { "X-Tenant-Slug": slug },
          }),
          fetch(`${API_BASE}/api/notices`, {
            headers: { "X-Tenant-Slug": slug },
          }),
          fetch(`${API_BASE}/api/transport/routes`, {
            headers: { "X-Tenant-Slug": slug },
          }),
        ]);

        if (resSchool.ok) {
          const d = await resSchool.json();
          setSchool(d.tenant);
        }
        if (resNotices.ok) {
          const d = await resNotices.json();
          setNotices(d.notices || []);
        }
        if (resRoutes.ok) {
          const d = await resRoutes.json();
          setBusRoutes(d.routes || []);
        }
      } catch (e) {
        console.error("Failed to load school portal data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPortalData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-slate-400">Loading campus portal...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">🏫</div>
        <h1 className="text-2xl font-bold">School Portal Not Found</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-md">
          No registered school found for subdomain:{" "}
          <span className="font-mono text-emerald-400 font-semibold">{slug}</span>.
        </p>
        <Link
          href="http://localhost:3000/register"
          className="mt-6 px-5 py-2.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
        >
          Register This School →
        </Link>
      </div>
    );
  }

  const landing = school.landingConfig || {};
  const stats = school.stats || {};
  const gallery: GalleryItem[] = landing.galleryImages || [];
  const videos: VideoItem[] = landing.videoGallery || [];
  const facilities: FacilityItem[] = landing.facilities || [];

  const categories = ["ALL", ...Array.from(new Set(gallery.map((g) => g.category || "General")))];
  const filteredGallery =
    activeCategory === "ALL"
      ? gallery
      : gallery.filter((g) => (g.category || "General") === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans scroll-smooth">
      {/* 1. Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-emerald-950/30">
            {landing.logoUrl ? (
              <img
                src={landing.logoUrl}
                alt={school.name}
                className="w-full h-full object-contain p-0.5"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-extrabold text-2xl text-slate-950">
                {school.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight">
              {school.name}
            </h1>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>{school.slug}.goankipathsala.in</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#about" className="hover:text-emerald-400 transition">About School</a>
          <a href="#facilities" className="hover:text-emerald-400 transition">Facilities</a>
          <a href="#transport" className="hover:text-emerald-400 transition">Bus Routes</a>
          <a href="#notices" className="hover:text-emerald-400 transition">Notices</a>
          <a href="#gallery" className="hover:text-emerald-400 transition">Gallery</a>
          <a href="#contact" className="hover:text-emerald-400 transition">Contact</a>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <span className="text-base font-bold leading-none block w-4 text-center">✕</span>
            ) : (
              <span className="text-base font-bold leading-none block w-4 text-center">☰</span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur px-6 py-4 space-y-3 text-xs font-semibold text-slate-200 sticky top-[69px] z-30 shadow-2xl">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-emerald-400 transition"
          >
            🏫 About School
          </a>
          <a
            href="#facilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-emerald-400 transition"
          >
            🏛️ Facilities
          </a>
          <a
            href="#transport"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-emerald-400 transition"
          >
            🚌 Bus Routes
          </a>
          <a
            href="#notices"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-emerald-400 transition"
          >
            📢 Notices & Circulars
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-emerald-400 transition"
          >
            🖼️ Photo Gallery
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-emerald-400 transition"
          >
            📍 Contact & Location
          </a>
        </div>
      )}


      {/* 3. Hero Section with Banner */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 sm:py-20 px-6 sm:px-12">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-4">
            <span>✨</span> Production Multi-Tenant Campus Hub • {school.name}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            {landing.tagline || `Inspiring Excellence & Empowering Futures at ${school.name}`}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {landing.aboutText}
          </p>
        </div>

        {/* 4. Live Stats Counter Bar */}
        <div className="max-w-5xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.studentCount || 0}+
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Active Students
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.staffCount || 0}+
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Teachers & Staff
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.classCount || 1} Classes
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Academic Grades
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {busRoutes.length || 12}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Village Bus Routes
            </div>
          </div>
        </div>
      </section>

      {/* 5. Digital Notice Board & Circulars Section */}
      <section id="notices" className="scroll-mt-20 py-12 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-slate-900">
        <div id="notice-board" className="-mt-24 pt-24" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
              Circulars & Official Announcements
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>📌</span> Digital Notice Board
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Live Campus Updates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                n.priority === "URGENT"
                  ? "bg-red-950/20 border-red-900/60"
                  : n.priority === "HIGH"
                  ? "bg-amber-950/20 border-amber-900/60"
                  : "bg-slate-900/70 border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      n.priority === "URGENT"
                        ? "bg-red-500 text-slate-950"
                        : n.priority === "HIGH"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {n.category || "General"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{n.title}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                  {n.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Audience: <strong className="text-slate-200">{n.targetAudience}</strong></span>
                {n.isPinned && <span className="text-emerald-400 font-bold">📌 Pinned</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Leadership & About Section */}
      <section id="about" className="scroll-mt-20 py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              About The Institution
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Rooted in Values, Powered by Modern Digital Education
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              At {school.name}, we believe every child in every village and town deserves access to world-class learning infrastructure, inspiring teachers, and interactive technology. Our curriculum blends rigorous academic standards with practical science exhibitions, active sports competitions, and cultural celebrations.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 100% Board Pass Rate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Audio-Visual Smart Classrooms
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Safe Village-to-Village Transport
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <div className="text-emerald-500 text-3xl font-serif mb-2">“</div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {landing.principalMessage ||
                "Our mission is to nurture bright, capable, and confident leaders who will shape the future of our society."}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center font-bold text-sm text-emerald-300">
                👨‍🏫
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {landing.principalName || "Dr. Radheshyam Sharma"}
                </h4>
                <p className="text-[11px] text-emerald-400">Principal / Head of Campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Photo Gallery ("Images of the Fun & Learning") */}
      <section id="gallery" className="scroll-mt-20 py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              Campus Life & Activities
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Moments of Joy, Fun & Discovery
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Glimpses of daily school fun, science fairs, annual day celebrations, and sports meets.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/40 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur text-emerald-400 border border-emerald-900/60">
                  {item.category || "Activity"}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 transition">
                  {item.caption}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Click to expand</span>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition">↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Video Showcase Section */}
      <section className="py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-slate-900">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            Video Showcase
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Watch Campus Glimpses & Events
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Experience our classrooms, annual sports days, and science exhibitions through video.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col shadow-sm"
            >
              <div className="relative aspect-video w-full bg-slate-950">
                <iframe
                  src={vid.videoUrl}
                  title={vid.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{vid.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {vid.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Campus Facilities & Infrastructure (Fully Admin-Managed) */}
      <section id="facilities" className="scroll-mt-20 py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            Campus Infrastructure
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            World-Class Facilities for Holistic Development
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            High quality amenities provided by school administration to empower students with modern educational experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="text-3xl mb-3">{fac.icon}</div>
              <h4 className="font-bold text-sm text-white">{fac.name}</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {fac.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. School Bus Routes & Transport Network */}
      <section id="transport" className="scroll-mt-20 py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-slate-900">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
              Safe Village Connectivity
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <span>🚌</span> School Bus Network & Routes
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              GPS-enabled buses covering 25+ surrounding villages with experienced staff and drivers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {busRoutes.map((route) => (
            <div
              key={route.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                      {route.routeNumber}
                    </span>
                    <h4 className="font-bold text-base text-white mt-1.5">{route.routeName}</h4>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {route.vehicleNumber}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Driver & Contact</span>
                    <span className="font-semibold text-white block">{route.driverName}</span>
                    <span className="font-mono text-emerald-400 text-[11px]">{route.driverPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Timings & Fee</span>
                    <span className="text-slate-300 block">{route.morningPickupTime} pickup</span>
                    <span className="font-mono text-white text-[11px]">₹{Number(route.monthlyFee || 500)} / mo</span>
                  </div>
                </div>

                {/* Stops */}
                {Array.isArray(route.stops) && route.stops.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                      Village Stops & Waypoints:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {route.stops.map((st: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          📍 {st.name} {st.time ? `(${st.time})` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Admissions, Fees & Contact Section with Interactive Form */}
      <SchoolContactSection
        slug={school.slug}
        schoolName={school.name}
        contactAddress={landing.contactAddress}
        contactPhone={landing.contactPhone}
        contactEmail={landing.contactEmail}
        contactHelpdeskTitle={landing.contactHelpdeskTitle}
        contactWelcomeText={landing.contactWelcomeText}
        admissionHours={landing.admissionHours}
        feeCounterHours={landing.feeCounterHours}
        admissionDocumentsText={landing.admissionDocumentsText}
      />

      {/* Lightbox Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-black">
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 sm:p-5 flex items-center justify-between bg-slate-900">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {selectedImage.category}
                </span>
                <p className="text-sm font-semibold text-white mt-1">
                  {selectedImage.caption}
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          {school.name} © 2026 • Powered by Goan Ki Pathshala (गाँव की पाठशाला)
        </div>
        <div className="flex items-center gap-6">
          <Link
            href={`/school/${school.slug}/portal/login`}
            className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1.5 font-medium"
          >
            <span>🔒</span> Faculty & Admin Portal
          </Link>
          <a href="#" className="hover:text-slate-300 transition">
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
