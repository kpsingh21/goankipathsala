# Goan Ki Pathshala (गाँव की पाठशाला)

A production-grade, multi-tenant School Management & EdTech SaaS platform designed for rural, semi-urban, and budget schools.

---

## 🏗️ Architecture & Specs

* 📘 [System Architecture & Tech Stack](./ARCHITECTURE.md)
* 🗄️ [Multi-Tenant Database Schema](./docs/SCHEMA.md)
* 🐳 [Docker Local Services](./docker-compose.yml) (PostgreSQL 16, Redis 7, Meilisearch)

---

## 📁 Project Structure

```
goankipathsala/
├── backend/            # Node.js + TypeScript + Express + Prisma (Multi-Tenant API)
│   ├── prisma/         # Prisma Multi-Tenant Schema
│   └── src/            # Controllers, Services, Middleware
├── frontend/           # React + TypeScript + Tailwind CSS Frontend Portal
├── docs/               # Technical documentation & Database specifications
├── docker-compose.yml  # Local services (PostgreSQL, Redis, Meilisearch)
└── .nvmrc              # Node.js LTS v22.23.2
```

---

## 🚀 Getting Started

### 1. Requirements
* Node.js `v22.23.2` (`nvm use`)
* Docker & Docker Compose (for local DB/cache services)

### 2. Start Local Infrastructure
```bash
docker compose up -d
```

### 3. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev


cd backend
npx prisma db push

```
<!-- using the npm script defined in your -->
cd backend
npm run db:push


cd backend
npm run key:generate
gkp_master_9af635dfdd4fded05d3d83be59deb172e5c6d68fff5ae4fb