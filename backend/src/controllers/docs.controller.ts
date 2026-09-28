import { Request, Response } from 'express';

export function docsHandler(req: Request, res: Response) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Goan Ki Pathshala - API Documentation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-900/90 px-8 py-5 sticky top-0 backdrop-blur z-20 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-xl text-slate-950 shadow-md">
        ग
      </div>
      <div>
        <h1 class="font-extrabold text-lg text-white tracking-tight">Goan Ki Pathshala (गाँव की पाठशाला) API</h1>
        <p class="text-xs text-slate-400">Complete Tenant-Isolated School SaaS Specification & Engine • v0.3.0</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <a href="/health" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400 border border-slate-700 transition">
        GET /health
      </a>
      <a href="http://localhost:3000/school/hariom-public-school/dashboard" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition">
        School Admin Portal ↗
      </a>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
    <!-- Quick Nav Links -->
    <aside class="hidden lg:block space-y-2 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto text-xs text-slate-400 pr-2">
      <p class="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-3">API Navigation</p>
      <a href="#auth" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">🔐 Authentication & Reset</a>
      <a href="#students" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">🎓 Student SIS (CRUD)</a>
      <a href="#staff" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">👥 Staff & Faculty (CRUD)</a>
      <a href="#attendance" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">📋 Daily & Monthly Attendance</a>
      <a href="#fees" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">💳 Fees, Catalog & Invoicing</a>
      <a href="#exams" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">📊 Exams & CBSE Report Card</a>
      <a href="#notices" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">📢 Digital Notice Board</a>
      <a href="#transport" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">🚌 Transport & Bus Routes</a>
      <a href="#subjects" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">📚 Subjects & Teachers</a>
      <a href="#classes" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">🏛️ Academic Classes (Pre-KG - 12)</a>
      <a href="#timetable" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">🗓️ Weekly Timetable</a>
      <a href="#website" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">🌐 Website, Facilities & Media</a>
      <a href="#tenants" class="block p-2 rounded hover:bg-slate-900 hover:text-white transition">👑 Platform Super Admin & Tenants</a>
    </aside>

    <!-- Main Content -->
    <main class="lg:col-span-3 space-y-12">
      <!-- Architecture Context -->
      <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <h2 class="text-sm font-bold uppercase tracking-wider text-emerald-400">Multi-Tenancy & Security Context</h2>
        <p class="text-xs text-slate-300 leading-relaxed">
          Every request is tenant-isolated. Supply the tenant context via subdomain (<code class="text-emerald-400">hariom-public-school.localhost:3000</code>) or header:
          <code class="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">X-Tenant-Slug: &lt;school-slug&gt;</code>.
          Authenticated requests must include <code class="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">Authorization: Bearer &lt;jwt-token&gt;</code>.
        </p>
      </div>

      <!-- 1. Authentication & Reset -->
      <section id="auth" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>🔐</span> 1. Authentication & Password Recovery
        </h3>

        <!-- POST /api/auth/login -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/auth/login</code>
            </div>
            <span class="text-xs text-slate-400">Universal Login (Admin, Teacher, Staff, Student)</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "emailOrPhone": "hari@gmail.com", "password": "••••••••" }
          </div>
        </div>

        <!-- POST /api/auth/admin-reset-password -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/auth/admin-reset-password</code>
            </div>
            <span class="text-xs text-amber-400 font-semibold">🔒 School Admin Only</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "targetUserId": "&lt;uuid&gt;", "newPassword": "NewPassword@123" }
          </div>
        </div>
      </section>

      <!-- 2. Student SIS (CRUD) -->
      <section id="students" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>🎓</span> 2. Student Information System (SIS) — Full CRUD
        </h3>

        <!-- GET /api/students -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/students</code>
            </div>
            <span class="text-xs text-slate-400">List all enrolled students with academic and parental dossiers</span>
          </div>
        </div>

        <!-- POST /api/students -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/students</code>
            </div>
            <span class="text-xs text-slate-400">Enroll new student with Aadhar, Photo, Parents, Village Address</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800 whitespace-pre">
{
  "admissionNumber": "ADM-2026-003",
  "firstName": "Rohan", "lastName": "Verma",
  "dob": "2013-05-15", "gender": "MALE", "bloodGroup": "B+",
  "aadharNumber": "452178901234", "category": "OBC",
  "fatherName": "Kailash Verma", "motherName": "Maya Verma",
  "parentPhone": "+91 98260 11223", "guardianOccupation": "Farmer",
  "villageCity": "Goradiya Village", "pincode": "451001",
  "addressText": "Ward No. 4, Near Panchayat Bhavan",
  "classGradeName": "Class 6", "sectionName": "A"
}</div>
        </div>

        <!-- PUT /api/students/:id -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
              <code class="text-sm text-slate-200 font-bold">/api/students/:id</code>
            </div>
            <span class="text-xs text-slate-400">Update student particulars or transfer section</span>
          </div>
        </div>

        <!-- DELETE /api/students/:id -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">DELETE</span>
              <code class="text-sm text-slate-200 font-bold">/api/students/:id</code>
            </div>
            <span class="text-xs text-red-400 font-semibold">🔒 School Admin Only • Cascade delete</span>
          </div>
        </div>
      </section>

      <!-- 3. Staff & Faculty (CRUD) -->
      <section id="staff" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>👥</span> 3. Staff & Faculty Management — Full CRUD
        </h3>

        <!-- GET /api/staff -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/staff</code>
            </div>
            <span class="text-xs text-slate-400">List staff directory with profiles, roles, and contacts</span>
          </div>
        </div>

        <!-- POST /api/staff -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/staff</code>
            </div>
            <span class="text-xs text-slate-400">Register new teacher / accountant / admin</span>
          </div>
        </div>

        <!-- PATCH /api/staff/role -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-purple-950 text-purple-400 border border-purple-800">PATCH</span>
              <code class="text-sm text-slate-200 font-bold">/api/staff/role</code>
            </div>
            <span class="text-xs text-slate-400">Escalate or change role authority (TEACHER, ACCOUNTANT, SCHOOL_ADMIN)</span>
          </div>
        </div>

        <!-- DELETE /api/staff/:id -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">DELETE</span>
              <code class="text-sm text-slate-200 font-bold">/api/staff/:id</code>
            </div>
            <span class="text-xs text-red-400 font-semibold">🔒 School Admin Only</span>
          </div>
        </div>
      </section>

      <!-- 4. Attendance (Daily & Monthly Engine) -->
      <section id="attendance" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>📋</span> 4. Attendance Engine (Daily Roll Call & Monthly Matrix)
        </h3>

        <!-- GET & POST /api/attendance -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/attendance?date=YYYY-MM-DD</code>
            </div>
            <span class="text-xs text-slate-400">Mark or inspect morning roll-call attendance</span>
          </div>
        </div>

        <!-- GET /api/attendance/monthly -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/attendance/monthly?month=YYYY-MM</code>
            </div>
            <span class="text-xs text-slate-400">Monthly working days, present/absent counts, and attendance %</span>
          </div>
        </div>

        <!-- POST /api/attendance/seed-month -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/attendance/seed-month</code>
            </div>
            <span class="text-xs text-emerald-400 font-semibold">⚡ Seed realistic month data (excl. Sundays)</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "month": "2026-09" }
          </div>
        </div>
      </section>

      <!-- 5. Fees & Invoicing -->
      <section id="fees" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>💳</span> 5. Fees, Itemized Breakdown & Invoicing
        </h3>

        <!-- GET & POST /api/fees/structures -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/fees/structures</code>
            </div>
            <span class="text-xs text-slate-400">Configure fee structures with dynamic components</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800 whitespace-pre">
{
  "name": "Term 1 Composite School Fee",
  "classGradeName": "Class 6",
  "dueDate": "2026-10-15",
  "frequency": "QUARTERLY",
  "lateFinePerDay": 5,
  "components": [
    { "name": "Tuition Fee", "amount": 1800 },
    { "name": "Computer & Science Lab", "amount": 300 },
    { "name": "Sports & Library", "amount": 150 }
  ]
}</div>
        </div>

        <!-- POST /api/fees/generate-class-invoices -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/fees/generate-class-invoices</code>
            </div>
            <span class="text-xs text-slate-400">Batch-generate invoices for all students in class grade</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "feeStructureId": "&lt;uuid&gt;" }
          </div>
        </div>

        <!-- POST /api/fees/pay -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/fees/pay</code>
            </div>
            <span class="text-xs text-slate-400">Collect fee installment & record payment transaction</span>
          </div>
        </div>
      </section>

      <!-- 6. Exams & CBSE Report Card -->
      <section id="exams" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>📊</span> 6. Examinations & Official CBSE-Pattern Report Cards
        </h3>

        <!-- POST /api/exams/marks -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/exams/marks</code>
            </div>
            <span class="text-xs text-slate-400">Record Theory (out of 80) + Practical / Internal Assessment (out of 20)</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800 whitespace-pre">
{
  "examinationId": "&lt;uuid&gt;",
  "enrollmentId": "&lt;uuid&gt;",
  "subjectName": "Science",
  "theoryMarks": 65,
  "practicalMarks": 24,
  "maxMarks": 100,
  "remarks": "Excellent lab experiment skill"
}</div>
        </div>

        <!-- POST /api/exams/batch-marks -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/exams/batch-marks</code>
            </div>
            <span class="text-xs text-emerald-400 font-semibold">✨ Batch 6-Subject Auto-Aggregate</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800 whitespace-pre">
{
  "examinationId": "&lt;uuid&gt;",
  "enrollmentId": "&lt;uuid&gt;",
  "marks": [
    { "subjectName": "English", "theoryMarks": 70, "practicalMarks": 18, "maxMarks": 100 },
    { "subjectName": "Hindi", "theoryMarks": 72, "practicalMarks": 19, "maxMarks": 100 },
    { "subjectName": "Mathematics", "theoryMarks": 68, "practicalMarks": 20, "maxMarks": 100 },
    { "subjectName": "Science", "theoryMarks": 65, "practicalMarks": 24, "maxMarks": 100 },
    { "subjectName": "Social Science", "theoryMarks": 74, "practicalMarks": 16, "maxMarks": 100 },
    { "subjectName": "Computer Science", "theoryMarks": 62, "practicalMarks": 28, "maxMarks": 100 }
  ]
}</div>
        </div>

        <!-- GET /api/exams/report-card -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/exams/report-card?enrollmentId=&lt;id&gt;</code>
            </div>
            <span class="text-xs text-slate-400">Generates comprehensive CBSE Report Card payload (attendance %, traits, remarks)</span>
          </div>
        </div>

        <!-- GET /api/exams/aggregate-report-card -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-indigo-950 text-indigo-400 border border-indigo-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/exams/aggregate-report-card?enrollmentId=&lt;id&gt;</code>
            </div>
            <span class="text-xs text-slate-400">Cumulative Annual Progress Report aggregating UT-1, Quarterly, Half-Yearly, and Annual exams</span>
          </div>
        </div>

        <!-- GET /api/exams/my-scope -->
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/exams/my-scope</code>
            </div>
            <span class="text-xs text-slate-400">Teacher's subject assignment & class teacher permission scope</span>
          </div>
        </div>
      </section>

      <!-- 7. Digital Notice Board -->
      <section id="notices" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>📢</span> 7. Digital Notice Board & Circulars
        </h3>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/notices</code>
            </div>
            <span class="text-xs text-slate-400">Broadcast circulars with priority (NORMAL, HIGH, URGENT) and audience</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800 whitespace-pre">
{
  "title": "Annual Inter-School Science Fair 2026",
  "content": "All students of Classes 6 to 12 are invited to present working robotics models on Oct 10th.",
  "category": "ACADEMIC",
  "priority": "HIGH",
  "targetAudience": "ALL",
  "isPinned": true
}</div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
              <code class="text-sm text-slate-200 font-bold">/api/notices/:id</code>
            </div>
            <span class="text-xs text-slate-400">Update circular title, content, priority, audience, or pin status</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">DELETE</span>
              <code class="text-sm text-slate-200 font-bold">/api/notices/:id</code>
            </div>
            <span class="text-xs text-slate-400">Remove circular</span>
          </div>
        </div>
      </section>

      <!-- 8. Transport & Bus Routes -->
      <section id="transport" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>🚌</span> 8. School Transport & Bus Routes Network
        </h3>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/transport/routes</code>
            </div>
            <span class="text-xs text-slate-400">Configure route number, vehicle, driver phone, stops, and fees</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800 whitespace-pre">
{
  "routeNumber": "R-01",
  "routeName": "Goradiya - Dhargul - Rampur Express",
  "vehicleNumber": "MP-09-AB-1234",
  "driverName": "Rameshwar Gurjar",
  "driverPhone": "+91 98260 11223",
  "morningPickupTime": "07:15 AM",
  "eveningDropTime": "02:30 PM",
  "monthlyFee": 500,
  "stops": [
    { "name": "Goradiya Chaupal", "time": "07:15 AM" },
    { "name": "Dhargul Bus Stand", "time": "07:30 AM" },
    { "name": "School Campus", "time": "08:05 AM" }
  ]
}</div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
              <code class="text-sm text-slate-200 font-bold">/api/transport/routes/:id</code>
            </div>
            <span class="text-xs text-slate-400">Update vehicle, driver, times, fee, and stops</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">DELETE</span>
              <code class="text-sm text-slate-200 font-bold">/api/transport/routes/:id</code>
            </div>
            <span class="text-xs text-slate-400">Delete bus route</span>
          </div>
        </div>
      </section>

      <!-- 9. Subjects & Teachers -->
      <section id="subjects" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>📚</span> 9. Subjects & Subject Teacher Assignment
        </h3>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/subjects?classGradeName=Class 6</code>
            </div>
            <span class="text-xs text-slate-400">List curriculum subjects with assigned faculty</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/subjects</code>
            </div>
            <span class="text-xs text-slate-400">Add new curriculum subject (CBSE, ICSE, State Board)</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "name": "Environmental Studies", "classGradeName": "Class 6", "board": "CBSE", "teacherId": "&lt;uuid&gt;" }
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/subjects/assign-teacher</code>
            </div>
            <span class="text-xs text-slate-400">Assign or reassign teacher to subject</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "subjectId": "&lt;uuid&gt;", "teacherId": "&lt;uuid&gt;" }
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
              <code class="text-sm text-slate-200 font-bold">/api/subjects/:id</code>
            </div>
            <span class="text-xs text-slate-400">Update subject title, board curriculum, or teacher</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">DELETE</span>
              <code class="text-sm text-slate-200 font-bold">/api/subjects/:id</code>
            </div>
            <span class="text-xs text-slate-400">Delete curriculum subject</span>
          </div>
        </div>
      </section>

      <!-- 10. Weekly Timetable -->
      <section id="timetable" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>🗓️</span> 10. Weekly Timetable Engine
        </h3>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/timetable?classGradeName=Class 6</code>
            </div>
            <span class="text-xs text-slate-400">Fetch 6-day (Mon-Sat) weekly schedule matrix</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/timetable/entry</code>
            </div>
            <span class="text-xs text-slate-400">Upsert period slot for a given day</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800 whitespace-pre">
{
  "classGradeName": "Class 6",
  "dayOfWeek": "MONDAY",
  "periodNumber": 1,
  "startTime": "08:30 AM",
  "endTime": "09:15 AM",
  "subjectName": "Mathematics",
  "teacherName": "Suresh Kumar Verma",
  "roomNumber": "Room 101"
}</div>
        </div>
      </section>

      <!-- 11. Website, Facilities & Media -->
      <section id="website" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>🌐</span> 11. Website, World-Class Facilities & Media Gallery
        </h3>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/tenants/current</code>
            </div>
            <span class="text-xs text-slate-400">Get school landing config, facilities, and media</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
              <code class="text-sm text-slate-200 font-bold">/api/tenants/landing</code>
            </div>
            <span class="text-xs text-slate-400">Update website tagline, about, facilities, photos, and video embeds</span>
          </div>
        </div>
      </section>

      <!-- 12. Academic Classes (Pre-KG to 12) -->
      <section id="classes" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>🏛️</span> 12. Academic Classes & Grades (Pre-KG to Class 12)
        </h3>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/classes</code>
            </div>
            <span class="text-xs text-slate-400">List all academic classes ordered by sequence (auto-seeds Pre-KG to Class 12)</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/classes</code>
            </div>
            <span class="text-xs text-slate-400">Add custom preparatory or high-school grade</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "name": "Balvatika-1", "numericalOrder": 0 }
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
              <code class="text-sm text-slate-200 font-bold">/api/classes/:id</code>
            </div>
            <span class="text-xs text-slate-400">Update class name or numerical sort sequence</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">DELETE</span>
              <code class="text-sm text-slate-200 font-bold">/api/classes/:id</code>
            </div>
            <span class="text-xs text-slate-400">Delete class grade</span>
          </div>
        </div>
      </section>

      <!-- 13. Platform Super Admin & Tenant Authority -->
      <section id="tenants" class="space-y-4">
        <h3 class="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>👑</span> 13. Platform Super Admin & Multi-Tenant Authority
        </h3>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">GET</span>
              <code class="text-sm text-slate-200 font-bold">/api/tenants</code>
            </div>
            <span class="text-xs text-slate-400">List all platform schools, subscription tiers, and active status</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
              <code class="text-sm text-slate-200 font-bold">/api/tenants</code>
            </div>
            <span class="text-xs text-slate-400">Super Admin provisions brand new school tenant + initial Admin credentials</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-purple-950 text-purple-400 border border-purple-800">PATCH</span>
              <code class="text-sm text-slate-200 font-bold">/api/tenants/:id/status</code>
            </div>
            <span class="text-xs text-slate-400">Toggle School Access: ACTIVE or SUSPENDED</span>
          </div>
          <div class="p-4 text-xs font-mono text-slate-300 bg-slate-950 border-t border-slate-800">
            { "status": "ACTIVE" | "SUSPENDED" }
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
              <code class="text-sm text-slate-200 font-bold">/api/tenants/:id</code>
            </div>
            <span class="text-xs text-slate-400">Update school subscription plan and metadata</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div class="p-4 bg-slate-900 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">DELETE</span>
              <code class="text-sm text-slate-200 font-bold">/api/tenants/:id</code>
            </div>
            <span class="text-xs text-slate-400">Deregister school and archive tenant</span>
          </div>
        </div>
      </section>
    </main>
  </div>

  <footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
    Goan Ki Pathshala (गाँव की पाठशाला) API Documentation Engine • 2026
  </footer>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
