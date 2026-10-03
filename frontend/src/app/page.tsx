import Link from "next/link";
import { API_BASE } from "@/lib/config";
import PlatformContactSection from "./components/PlatformContactSection";

interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  createdAt: string;
  settings?: any;
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
  announcementBanner?: {
    enabled: boolean;
    text: string;
  };
  contact?: {
    email: string;
    phone: string;
    address: string;
  };
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

const DEFAULT_CONFIG: PlatformConfig = {
  logoUrl: "",
  brandName: "Goan Ki Pathshala",
  brandTagline: "गाँव की पाठशाला • Bringing Digital Infrastructure for every school",
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

async function getRegisteredSchools(): Promise<TenantSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/api/tenants`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tenants || [];
  } catch (err) {
    return [];
  }
}

async function getPlatformConfig(): Promise<PlatformConfig> {
  try {
    const res = await fetch(`${API_BASE}/api/platform/config`, {
      cache: "no-store",
    });
    if (!res.ok) return DEFAULT_CONFIG;
    const data = await res.json();
    return data.config || DEFAULT_CONFIG;
  } catch (err) {
    return DEFAULT_CONFIG;
  }
}

export default async function Home() {
  const [schools, platformConfig] = await Promise.all([
    getRegisteredSchools(),
    getPlatformConfig(),
  ]);

  const config = { ...DEFAULT_CONFIG, ...platformConfig };
  const features = config.features && config.features.length > 0 ? config.features : DEFAULT_CONFIG.features!;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Top Announcement Alert Bar (Green & Golden Yellow theme) */}
      {config.announcementBanner?.enabled && config.announcementBanner.text && (
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-700 text-amber-200 text-xs font-bold text-center py-2 px-4 border-b border-amber-400/20 shadow-xs flex items-center justify-center gap-2">
          <span>{config.announcementBanner.text}</span>
        </div>
      )}

      {/* 2. Platform Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {config.logoUrl ? (
            <div className="h-11 max-w-[160px] flex items-center justify-center overflow-hidden">
              <img
                src={config.logoUrl}
                alt={config.brandName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 flex items-center justify-center font-black text-xl text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40">
              ग
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-none">
                {config.brandName}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{config.brandTagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs font-semibold">
          <a href="#features" className="text-slate-300 hover:text-amber-300 transition">
            Platform Modules
          </a>
          <a href="#contact" className="text-slate-300 hover:text-amber-300 transition">
            Contact & Support
          </a>
          <a
            href="#schools"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-bold transition flex items-center gap-1.5"
          >
            <span>🏫</span> Network Schools ({schools.length})
          </a>
        </div>
      </header>

      {/* 3. Hero Section (Green & Yellow Brand Aesthetics) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-12">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden mb-16 ring-1 ring-emerald-500/10">
          {/* Dual Glow Orbs: Green + Golden Yellow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-amber-300 border border-amber-400/30 mb-5 shadow-xs">
              <span>{config.heroBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Empowering Every School with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-amber-400">
                World-Class Digital Infrastructure
              </span>.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {config.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#schools"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 uppercase tracking-wider flex items-center gap-2"
              >
                <span>{config.exploreButtonText} ({schools.length})</span>
                <span>↓</span>
              </a>
              <a
                href="#features"
                className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition flex items-center gap-1.5"
              >
                <span>✨</span> View Modules
              </a>
            </div>
          </div>
        </div>

        {/* 4. Core Capabilities Banner */}
        <section id="features" className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              Full-Spectrum Campus ERP
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Built for Rural & Semi-Urban Schools
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Engineered for seamless operations from Kindergarten (Pre-KG, Nursery, LKG, UKG) to Class 12.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 hover:bg-slate-900/90 transition group shadow-xs"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{feat.icon}</div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Registered Schools Directory */}
        <section id="schools" className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>🏫</span> Active Partner Schools
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official branding and administrative portals for our partner institutions.
              </p>
            </div>
            <span className="text-xs font-mono px-3.5 py-1 rounded-full bg-emerald-950 text-amber-300 border border-emerald-700/60 font-bold">
              {schools.length} Schools Enrolled
            </span>
          </div>

          {schools.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
              <p className="text-sm text-slate-400">No schools currently registered on this platform.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => {
                const publicWebUrl = `/school/${school.slug}`;
                const schoolLogo = school.settings?.landingConfig?.logoUrl;

                return (
                  <div
                    key={school.id}
                    className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 p-6 flex flex-col justify-between transition-all shadow-lg hover:shadow-emerald-950/20"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        {schoolLogo ? (
                          <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
                            <img src={schoolLogo} alt="" className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center font-extrabold text-lg text-slate-950 shadow-xs">
                            {school.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <h4 className="font-extrabold text-base text-white mt-3 group-hover:text-amber-300 transition">
                        {school.name}
                      </h4>

                      <div className="mt-5 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
                        <div className="p-2 rounded-lg bg-slate-950/60">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Students</p>
                          <p className="text-sm font-black text-white">{school._count.studentProfiles}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/60">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Staff</p>
                          <p className="text-sm font-black text-white">{school._count.users}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/60">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Classes</p>
                          <p className="text-sm font-black text-white">{school._count.classGrades}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80">
                      <Link
                        href={publicWebUrl}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-xs font-bold text-amber-300 border border-slate-700/60 hover:border-amber-400 flex items-center justify-center gap-2 transition shadow-xs"
                      >
                        <span>🌐</span> Visit Website →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 6. Contact & Support Section with Interactive Form */}
        <PlatformContactSection
          contact={config.contact}
          brandName={config.brandName}
        />
      </main>

      {/* 7. Footer (Green & Yellow Brand Accents + Contact Quick Links) */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>
              {config.brandName} ({config.brandTagline.split("•")[0]?.trim() || "गाँव की पाठशाला"}) © 2026 • Bringing Digital Infrastructure for every school.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/platform-admin" className="text-amber-400 hover:text-amber-300 hover:underline transition font-mono text-[11px]">
              Platform Super Admin →
            </Link>
          </div>
        </div>

        {/* Quick Contact Footer Bar */}
        {config.contact && (
          <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
            {config.contact.phone && (
              <a
                href={`tel:${config.contact.phone.replace(/[^0-9+]/g, "")}`}
                className="hover:text-amber-300 transition flex items-center gap-1.5"
              >
                <span>📞</span>
                <span>{config.contact.phone}</span>
              </a>
            )}
            {config.contact.email && (
              <a
                href={`mailto:${config.contact.email}`}
                className="hover:text-emerald-400 transition flex items-center gap-1.5"
              >
                <span>✉️</span>
                <span>{config.contact.email}</span>
              </a>
            )}
            {config.contact.address && (
              <span className="flex items-center gap-1.5 text-slate-500">
                <span>📍</span>
                <span>{config.contact.address}</span>
              </span>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}
