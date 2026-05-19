<h1 align="center">n8n Advance Dashboard</h1>

<div align="center">An advanced n8n dashboard to manage workflows and AI agents, view reports, track activities, and monitor schedules. Built with Next.js, shadcn/ui, Tailwind CSS, and TypeScript.</div>

<br />

<div align="center">
  <img src="/public/n8n-advanced-dashboard-light.png" alt="AI Agents Dashboard Cover" style="max-width: 100%; border-radius: 8px;" />
</div>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-black" alt="shadcn/ui" />
</p>

## Overview

This project is an **advanced n8n dashboard** that provides a centralized interface to manage your automation ecosystem. It allows users to seamlessly manage n8n workflows and AI agents, as well as view comprehensive reports, track execution activities, and monitor schedules.

Built with **Next.js, Shadcn UI, TypeScript, Tailwind CSS**, and deeply integrated with **n8n and MongoDB**, it serves as a powerful control panel for admins and clients alike.

### Tech Stack

This project uses the following stack:

- Framework - [Next.js](https://nextjs.org)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Database - [MongoDB / Mongoose](https://mongoosejs.com/)
- Workflow Automation - [n8n](https://n8n.io/)
- Data Fetching - [TanStack React Query](https://tanstack.com/query)

## Features

- 📊 **Dashboard Overview** showing active workflows, AI agents, and recent metrics.
- ⚙️ **Workflow Management** integrating with n8n APIs (activate/deactivate, search, scheduling).
- 🤖 **AI Agents Management** for configuring and managing intelligent agents.
- 📋 **Activity Tracking** to monitor detailed workflow executions and view raw JSON logs.
- 📅 **Schedules Dashboard** for visualizing all n8n workflows and AI agent schedules.
- 📈 **Dynamic Reporting** supporting both AI Agents and Workflows as data sources.
- 👥 **Client Management** where admins can manage clients and assign workflows to them.
- 🧑‍💻 **Client Mode** where clients can manage workflows and AI agents assigned by an admin.
- 🧩 **Shadcn UI components** with Tailwind CSS styling.

## Pages

| Pages | Specifications |
| :--- | :--- |
| **Dashboard Overview** | Analytics overview for active workflows and AI agents, featuring status summary and quick links. |
| **Workflows** | Interactive data tables to manage workflow states, with features like activate/deactivate, search, and form URL integrations. |
| **AI Agents** | Management interface to configure, list, and modify AI Agents. |
| **Activities** | Detailed activity tracking system displaying raw execution data and JSON logs for workflows. |
| **Schedules** | Centralized view of all automated tasks, showing active statuses and cron expressions. |
| **Reports** | Consolidated reporting system displaying performance metrics and details for both AI Agents and Workflows. |
| **Clients** | Management interface for admins to oversee clients and assign workflows, as well as the client mode view. |
| **Settings** | Configuration and preferences. |

## Feature based organization

```plaintext
src/
├── app/                           # Next.js App Router directory
│   ├── dashboard/                 # Dashboard route group
│   │   ├── overview/              # Analytics
│   │   ├── agents/                # AI Agents management
│   │   ├── workflows/             # Workflow tables and forms
│   │   ├── activities/            # Execution logs and detail views
│   │   ├── schedules/             # Cron expressions and active schedules
│   │   ├── reports/               # System reports
│   │   ├── clients/               # Client management and client mode
│   │   └── settings/              # Settings
│   └── api/                       # API routes (Mongoose, n8n proxy)
│       └── n8n/                   # Proxy endpoints for n8n API
│
├── components/                    # Shared components
│   ├── ui/                        # UI primitives (buttons, inputs, etc.)
│   └── layout/                    # Layout components (header, sidebar, etc.)
│
├── lib/                           # Core utilities
└── types/                         # TypeScript types
```

## Getting Started

> [!NOTE]  
> This admin dashboard uses **Next.js (App Router)** and **Shadcn UI**. Follow these steps to run it locally:

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

- Create a `.env.local` file by copying the example environment file:
  `cp .env.example .env.local`
- Add the required environment variables to the `.env.local` file, specifically your MongoDB URI and `NEXT_PUBLIC_N8N_URL` / `X-N8N-API-KEY`.
- Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

You should now be able to access the application at http://localhost:3000.

## Deploy

This project can be easily deployed to Vercel or any Next.js-compatible hosting platform. 

For Docker deployments, refer to the standard Next.js standalone output mode approach.

### ⭐ Support

If you find this project helpful, please consider giving it a star ⭐!
