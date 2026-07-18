# Developer Onboarding & Architecture Guide

## Overview
This guide helps developers set up the local workspace and understand the codebase structure.

## Codebase Architecture

```
d:\portfolio
├── supabase/               # Migrations & database initialization SQL
├── src/
│   ├── app/                # Next.js App Router pages and actions
│   │   ├── actions/        # Server Actions (authenticated database operations)
│   │   └── admin/          # Admin CMS views and dashboard pages
│   ├── components/         # Reusable React components
│   ├── lib/                # Database clients, auth logic, and validation helpers
│   ├── services/           # Service layer for database CRUD
│   └── types/              # TypeScript definitions
```

## Local Development Setup

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ADMIN_JWT_SECRET=your-jwt-secret
```

### 3. Running Locally
Start the Next.js development server:
```bash
npm run dev
```
The application will run locally at `http://localhost:3000`.
