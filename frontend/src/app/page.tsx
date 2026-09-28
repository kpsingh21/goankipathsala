import Link from "next/link";

interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  createdAt: string;
  _count: {
    users: number;
    studentProfiles: number;
    classGrades: number;
  };
}

async function getRegisteredSchools(): Promise<TenantSummary[]> {
  try {
    const res = await fetch("http://localhost:4000/api/tenants", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tenants || [];
  } catch (err) {
    return [];
  }
}

export default async function Home() {
  const schools = await getRegisteredSchools();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Platform Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-xl text-slate-950 shadow-md shadow-emerald-500/20">
            ग
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-none">
                Goan Ki Pathshala
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SaaS Cloud
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">गाँव की पाठशाला • Multitenant School Operating System</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <a href="#features" className="hidden md:inline-block text-slate-300 hover:text-white transition">
            Platform Modules
          </a>
          <a href="#schools" className="hidden md:inline-block text-slate-300 hover:text-white transition">
            Network Schools
          </a>
          <a
            href="http://localhost:4000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-emerald-400 transition flex items-center gap-1 font-mono text-[11px]"
          >
            <span>📜</span> API Docs
          </a>
          {/* Authority Portal Link replacing free unverified registration */}
          <Link
            href="/platform-admin"
            className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-sm shadow-emerald-500/30 flex items-center gap-1.5"
          >
            <span>🛡️</span> Super Admin Authority
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-12">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden mb-16">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-5">
              <span>🌾</span> Transforming Rural & Semi-Urban Education
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Empowering Every School with World-Class Digital Infrastructure.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              <strong>Goan Ki Pathshala (गाँव की पाठशाला)</strong> is an enterprise-grade multi-tenant school operating system. Inspired by leading EdTech models like LEAD School, each campus receives its own isolated subdomain, bilingual CBSE curriculum delivery, smart student dossiers, itemized fee billing, and real-time fleet transport tracking.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#schools"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs transition shadow-md"
              >
                Explore Partner Schools ({schools.length}) ↓
              </a>
              <Link
                href="/platform-admin"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition flex items-center gap-2"
              >
                <span>🔑</span> Platform Management & Onboarding
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Core Capabilities Banner */}
        <section id="features" className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Full-Spectrum Campus ERP Modules</h3>
            <p className="text-xs text-slate-400 mt-2">
              Engineered for seamless operations from Kindergarten (Pre-KG, Nursery, LKG, UKG) to Class 12.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">📜</div>
              <h4 className="font-bold text-sm text-white">CBSE Cumulative Report Cards</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Unit tests, quarterly, half-yearly, and annual aggregate grading with automatic percentage computation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-bold text-sm text-white">Attendance Matrix Engine</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Morning roll call and monthly attendance registers with automated working-day percentage calculation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">💳</div>
              <h4 className="font-bold text-sm text-white">Fee Structures & Ledger</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Itemized breakdown (Tuition, Lab, Sports, Library) with batch invoice issuance and payment receipts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">🚌</div>
              <h4 className="font-bold text-sm text-white">Village Bus Route Network</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Route milestones, pickup/drop times, driver phone numbers, and transport fee management.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">🧑‍🏫</div>
              <h4 className="font-bold text-sm text-white">Role-Based Teacher Access</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Subject teachers manage assigned subjects; class teachers and admins hold 360° academic oversight.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">📢</div>
              <h4 className="font-bold text-sm text-white">Digital Circular Notice Board</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Targeted school notices with priority tagging, emergency broadcasts, and instant editing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">🌐</div>
              <h4 className="font-bold text-sm text-white">Isolated Subdomain Websites</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Each school enjoys a dedicated public branding portal with custom facilities, photo gallery, and videos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-bold text-sm text-white">Multi-Tenant Tenant Isolation</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                PostgreSQL row-level isolation via tenant UUIDs guaranteeing zero data overlap across institutions.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Registered Schools Directory */}
        <section id="schools" className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>🏫</span> Active Partner Schools
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Public school branding portals accessible via dedicated subdomain URLs.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-800 font-bold">
              {schools.length} Schools Enrolled
            </span>
          </div>

          {schools.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
              <p className="text-sm text-slate-400">No schools currently registered on this platform.</p>
              <Link
                href="/platform-admin"
                className="inline-block mt-4 px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
              >
                Access Super Admin to Onboard First School →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => {
                const publicWebUrl = `/school/${school.slug}`;
                const subdomainUrl = `http://${school.slug}.localhost:3000`;
                return (
                  <div
                    key={school.id}
                    className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all shadow-lg hover:shadow-emerald-950/20"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-extrabold text-lg text-emerald-400">
                          {school.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          {school.plan}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-white mt-3 group-hover:text-emerald-300 transition">
                        {school.name}
                      </h4>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        {school.slug}.goankipathsala.in
                      </p>

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

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <Link
                        href={publicWebUrl}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                      >
                        <span>🌐</span> View School Website →
                      </Link>
                      <a
                        href={subdomainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-slate-500 hover:text-slate-300"
                      >
                        Subdomain ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-4">
        <div>
          Goan Ki Pathshala (गाँव की पाठशाला) © 2026 • Multi-Tenant School ERP & Smart Classroom Cloud
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/platform-admin" className="text-emerald-500 hover:underline">
            Super Admin Onboarding
          </Link>
          <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:underline">
            API Documentation
          </a>
        </div>
      </footer>
    </div>
  );
}
