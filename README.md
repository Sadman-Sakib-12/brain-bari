# Brain Bari – AI & Software Solutions Agency Platform

> Premier AI & Software Solutions Agency in Bangladesh specializing in conversational AI chatbots, custom AI assistants, scalable SaaS products, and modern high-conversion web applications.

## 🚀 Overview

Brain Bari is an enterprise-grade full-stack platform built with a modular monorepo architecture:

- **`frontend/`**: Next.js 15 App Router website with Tailwind CSS, Framer Motion, 3D showcases, services catalog, and dynamic CMS sync.
- **`backend/`**: Node.js, Express, TypeScript, and Prisma ORM connected to NeonDB (Serverless PostgreSQL) with authentication and REST API endpoints.
- **`admin/`**: Comprehensive Next.js administrative portal for managing services, chatbots, orders, portfolios, blogs, and real-time site settings.

## 🛠️ Tech Stack

### Frontend & Admin
- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS, CSS Modules
- **Animation**: Framer Motion, React Bits
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend & Database
- **Runtime**: Node.js, Express
- **Language**: TypeScript
- **ORM**: Prisma 6
- **Database**: NeonDB (Serverless PostgreSQL with Connection Pooling)
- **Authentication**: JWT, bcryptjs
- **Payment**: Stripe API

## 📁 Repository Structure

```
brain-bari/
├── frontend/             # Client-facing web application
├── backend/              # Express + Prisma REST API server
├── admin/                # Admin CMS and management dashboard
├── REQUIREMENTS.md       # Product specifications and feature roadmap
└── README.md             # Project documentation
```

## ⚙️ Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

## 📄 License
All rights reserved © 2026 Brain Bari.
