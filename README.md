<div align="center">

# 🛡️ SentinelX AI

### AI-Powered Cyber Resilience Platform

**Next-generation Security Operations Center with autonomous threat detection, MITRE ATT&CK mapping, behavioural analytics, and AI-driven incident response.**

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitive-8B5CF6?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0080?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br />

<img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=300&fit=crop" alt="Cybersecurity Banner" width="100%" />

<br />

> 🔒 **SentinelX AI** unifies SOC operations, threat intelligence, UEBA, SOAR automation, and AI co-pilot capabilities into a single, cohesive platform — built for modern cyber resilience.

<br />

**[Live Demo](#-live-demo)** · **[Features](#-features)** · **[Architecture](#-architecture)** · **[Tech Stack](#-tech-stack)** · **[Getting Started](#-getting-started)** · **[Documentation](#-documentation)**

<br />

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
  - [Core Platform](#-core-platform)
  - [AI & Machine Learning](#-ai--machine-learning)
  - [Advanced Threat Analysis](#-advanced-threat-analysis)
  - [Response & Automation](#-response--automation)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Modules](#-modules)
- [Authentication & Roles](#-authentication--roles)
- [AI Copilot](#-ai-copilot)
- [Security](#-security)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**SentinelX AI** is a comprehensive, production-grade cyber resilience platform that transforms how security teams detect, analyse, and respond to threats. It combines traditional SOC tooling with cutting-edge AI to deliver:

| Capability | Description |
|---|---|
| 🔍 **Real-time Detection** | Continuous monitoring of assets, incidents, and behavioural anomalies |
| 🧠 **AI-Powered Analysis** | Gemini-driven copilot for natural-language security queries |
| 🗺️ **MITRE ATT&CK Mapping** | Full kill-chain coverage with technique-level detection |
| ⚡ **SOAR Automation** | Playbook-driven, approval-gated automated response |
| 📊 **Risk Scoring** | Multi-dimensional dynamic risk assessment across entities |
| 🎭 **APT Attribution** | Threat actor identification and campaign tracking |
| 🖥️ **Digital Twin** | Simulated environment for attack modelling and prediction |

> **Mission:** Reduce Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR) through intelligent automation and AI-assisted decision-making.

---

## 🚀 Live Demo

The platform runs as a full-stack web application with:

- **🔐 Authentication** — Email/password sign-up and login via Supabase Auth
- **👥 Role-Based Access** — Cyber Analyst (full access) vs. Observer (read-only)
- **📡 Live Dashboard** — Real-time incident metrics, asset risk, and threat feed
- **🤖 AI Copilot** — Chat-based security assistant with live database context
- **🧪 Demo & Testing** — Built-in data seeding and scenario simulation

> Visit the home page after signing in to access the full interactive dashboard.

---

## ✨ Features

### 🟦 Core Platform

| Module | Description |
|---|---|
| **Dashboard** | Unified security operations overview with KPIs, recent incidents, high-risk assets, and quick actions |
| **SOC Console** | Real-time incident queue with severity filtering, triage, and SOAR action tracking |
| **Executive View** | High-level metrics and trends for leadership reporting |
| **Asset Inventory** | Full IT/OT asset registry with criticality scoring, compromise status, and isolation tracking |
| **Incidents** | Complete incident lifecycle management with MITRE mapping and timeline reconstruction |
| **Timeline** | Chronological incident reconstruction with kill-chain stage visualisation |
| **Risk Dashboard** | Multi-factor risk scoring (vulnerability, threat, behaviour, exposure, configuration) |
| **Settings** | Platform configuration and preferences |
| **Profile** | User profile and role management |

### 🧠 AI & Machine Learning

| Module | Description |
|---|---|
| **AI Copilot** | Conversational AI assistant powered by Google Gemini with live database context — query incidents, assets, threats, and get actionable recommendations |
| **AI Analysis** | Automated incident analysis with confidence scoring, MITRE technique mapping, and recommended response actions |
| **UEBA** | User & Entity Behaviour Analytics — anomaly detection using isolation forest, autoencoder, LOF, DBSCAN, LSTM, and ensemble algorithms |
| **AI Agents** | Autonomous AI agents for continuous monitoring, investigation, and response orchestration |

### 🔴 Advanced Threat Analysis

| Module | Description |
|---|---|
| **Threat Intel** | Aggregated threat intelligence from MITRE, CISA, CERT-In, AlienVault, AbuseIPDB, GreyNoise, VirusTotal, and MISP feeds |
| **MITRE Matrix** | Interactive ATT&CK framework matrix with technique-level detection coverage |
| **Attack Graph** | Visual attack path analysis showing lateral movement and privilege escalation routes |
| **APT Attribution** | Advanced Persistent Threat actor identification and campaign correlation |
| **Vulnerability Priority** | AI-driven vulnerability prioritisation based on exploitability, exposure, and asset criticality |
| **Digital Twin** | Digital replica of the infrastructure for attack simulation and what-if analysis |
| **Correlation Engine** | Cross-source event correlation to identify complex, multi-stage attack patterns |
| **Attack Progression** | Predictive attack progression modelling showing likely next attacker moves |

### ⚡ Response & Automation

| Module | Description |
|---|---|
| **SOAR** | Security Orchestration, Automation & Response — playbook-driven automated response with approval workflows |
| **SOAR Actions** | Executed response actions (block IP, disable account, isolate endpoint, quarantine file, revoke credential, etc.) with full audit trail and rollback support |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  ┌───────────┐ │
│  │  Dashboard   │  │ SOC Console │  │ AI Copilot│  │  UEBA     │ │
│  └──────┬───────┘  └──────┬──────┘  └─────┬─────┘  └─────┬─────┘ │
│         └──────────────────┴───────────────┴─────────────┘       │
│                              │ Supabase JS SDK                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│  Supabase Auth   │  │  Supabase        │  │  Edge Functions      │
│  (Email/PWD)     │  │  Postgres        │  │  (Deno Runtime)      │
│  + RLS Policies  │  │  10+ Tables      │  │  ai-copilot          │
│                  │  │  Indexed         │  │  (Gemini-powered)    │
└─────────────────┘  └─────────────────┘  └─────────────────────┘
                                                    │
                                                    ▼
                                            ┌───────────────┐
                                            │  Google Gemini │
                                            │  AI API        │
                                            └───────────────┘
```

**Key architectural principles:**

- **Serverless-first** — Supabase handles auth, database, and edge functions
- **Row-Level Security** — Every table protected by RLS policies
- **Real-time** — Live data fetching with Supabase real-time subscriptions
- **Role-based** — Analyst vs. Observer access enforced at UI and data layers
- **Edge AI** — Copilot runs as a Deno edge function for low-latency inference

---

## 🗄️ Database Schema

The platform uses **10 core tables** with comprehensive indexing and RLS:

| Table | Purpose | Key Fields |
|---|---|---|
| `assets` | IT/OT asset inventory | type, environment, criticality, risk_score, is_compromised, is_isolated |
| `incidents` | Security incidents | severity, status, category, mitre_techniques, confidence, ttd_seconds, ttr_seconds |
| `threat_intel` | Threat intelligence IOCs | ioc_type, ioc_value, ioc_source, threat_actor, campaign |
| `mitre_techniques` | MITRE ATT&CK framework | tactic, platforms, detection_methods, mitigations |
| `ueba_events` | Behavioural anomalies | anomaly_type, deviation_score, algorithm, features |
| `soar_playbooks` | Automated response playbooks | trigger_conditions, steps, is_automated, requires_approval |
| `soar_actions` | Executed response actions | action_type, status, confidence, audit_trail, rollback_available |
| `attack_paths` | Computed attack paths | path_nodes, path_edges, total_risk, mitre_techniques |
| `risk_scores` | Dynamic risk assessments | overall_risk, vulnerability_risk, threat_risk, behaviour_risk |
| `dashboard_metrics` | Pre-aggregated metrics | metric_type, metric_value, time_bucket |

> See [`supabase/migrations/`](./supabase/migrations/) for full SQL schema with RLS policies.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 13.5 | React framework (App Router) |
| **React** | 18.2 | UI library |
| **TypeScript** | 5.2 | Type safety |
| **Tailwind CSS** | 3.3 | Utility-first styling |
| **shadcn/ui + Radix UI** | Latest | Accessible component library |
| **Framer Motion** | 12.x | Animations and transitions |
| **Recharts** | 2.12 | Data visualisation and charts |
| **Lucide React** | 0.446 | Icon system |
| **react-hook-form + Zod** | Latest | Form handling and validation |
| **Sonner** | 1.5 | Toast notifications |
| **date-fns** | 3.6 | Date utilities |

### Backend
| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database, authentication, and real-time subscriptions |
| **Supabase Edge Functions** | Deno-runtime serverless functions |
| **Google Gemini AI** | LLM powering the AI Copilot |
| **Row-Level Security** | Database-level access control |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Netlify** | Deployment and hosting |
| **Supabase Cloud** | Managed Postgres + Auth + Edge Functions |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ 
- **npm** or **pnpm**
- A Supabase project (URL + anon key)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sentinelx-ai.git
cd sentinelx-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials:
#   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL migrations in order against your Supabase project:

```bash
# Apply via Supabase MCP or Supabase Dashboard SQL Editor:
# 1. supabase/migrations/001_sentinelx_schema.sql      (core schema)
# 2. supabase/migrations/002_user_profiles_with_roles.sql (auth roles)
# 3. supabase/migrations/003_notifications_table.sql    (notifications)
```

### Running the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to the login page.

### Building for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
sentinelx-ai/
├── app/
│   ├── (app)/                    # Authenticated app routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── soc/                  # SOC console
│   │   ├── incidents/            # Incident management
│   │   ├── assets/                # Asset inventory
│   │   ├── threat-intel/          # Threat intelligence
│   │   ├── mitre/                 # MITRE ATT&CK matrix
│   │   ├── ueba/                 # Behavioural analytics
│   │   ├── soar/                  # SOAR playbooks
│   │   ├── copilot/               # AI Copilot chat
│   │   ├── ai-analysis/           # AI incident analysis
│   │   ├── risk/                  # Risk dashboard
│   │   ├── executive/             # Executive view
│   │   ├── attack-graph/          # Attack path visualisation
│   │   ├── apt-attribution/       # APT threat actor attribution
│   │   ├── vulnerability/         # Vulnerability prioritisation
│   │   ├── digital-twin/          # Infrastructure digital twin
│   │   ├── correlation/           # Event correlation engine
│   │   ├── progression/           # Attack progression modelling
│   │   ├── agents/                # AI autonomous agents
│   │   ├── timeline/              # Incident timeline
│   │   ├── demo/                  # Demo & testing tools
│   │   ├── settings/              # Platform settings
│   │   ├── profile/               # User profile
│   │   └── layout.tsx             # App layout with auth guard
│   ├── auth/
│   │   ├── login/                 # Login page
│   │   └── signup/                # Sign-up page
│   ├── api/
│   │   └── dashboard/             # Dashboard API route
│   ├── globals.css                # Global styles + Tailwind
│   └── layout.tsx                 # Root layout
├── components/
│   ├── layout/
│   │   ├── app-header.tsx         # Top header bar
│   │   ├── app-sidebar.tsx        # Navigation sidebar
│   │   └── main-layout.tsx        # Main layout wrapper
│   ├── providers.tsx              # App providers
│   └── ui/                        # shadcn/ui component library (40+ components)
├── hooks/
│   └── use-toast.ts               # Toast hook
├── lib/
│   ├── api.ts                     # API utilities
│   ├── auth-context.tsx           # Auth context provider
│   ├── supabase.ts                # Supabase client
│   ├── types.ts                   # TypeScript types
│   └── utils.ts                   # Utility functions
├── supabase/
│   ├── functions/
│   │   └── ai-copilot/            # Gemini-powered AI Copilot edge function
│   └── migrations/                # SQL migrations (schema + RLS)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── netlify.toml
```

---

## 🧩 Modules

<details>
<summary><b>📊 Dashboard</b> — Real-time security operations overview</summary>

The main dashboard provides:
- **KPI Cards**: Open incidents, critical alerts, MTTD, MTTR, protected assets
- **Recent Incidents Feed**: Latest incidents with severity badges and MITRE technique tags
- **High-Risk Assets**: Top assets by risk score with compromise status indicators
- **Quick Actions**: One-click navigation to SOC, UEBA, SOAR, and AI Copilot
- **System Status**: Live "All Systems Normal" indicator with AI module status

</details>

<details>
<summary><b>📻 SOC Console</b> — Real-time incident triage</summary>

The SOC console is the analyst's primary workspace:
- **Incident Queue**: Filterable by severity (critical/high/medium/low)
- **Triage Interface**: Select incidents to view details, MITRE mapping, and IOCs
- **SOAR Action Tracking**: View executed automated response actions
- **Status Management**: Update incident status (open → investigating → contained → resolved)
- **Real-time Updates**: Live data from Supabase with toast notifications

</details>

<details>
<summary><b>🗺️ MITRE Matrix</b> — ATT&CK framework coverage</summary>

Interactive MITRE ATT&CK matrix:
- **All 14 Tactics**: Reconnaissance through Impact
- **Technique-Level Detection**: Per-technique detection counts and status
- **Detail Dialog**: Click any technique for full description, detection methods, and mitigations
- **Coverage Gaps**: Visual indicators for undetected techniques
- **Kill-Chain Mapping**: Techniques mapped to attack stages

</details>

<details>
<summary><b>👥 UEBA</b> — Behavioural anomaly detection</summary>

User & Entity Behaviour Analytics:
- **Anomaly Types**: Login anomalies, data access anomalies, network anomalies, privilege escalation, lateral movement, data exfiltration, beaconing, DNS tunnelling, ransomware behaviour, insider threats
- **ML Algorithms**: Isolation Forest, Autoencoder, LOF, DBSCAN, LSTM, Statistical, Ensemble
- **Deviation Scoring**: Baseline vs. observed values with deviation scores
- **Entity Types**: Users, devices, networks, applications, services
- **Incident Correlation**: Links anomalies to related security incidents

</details>

<details>
<summary><b>⚡ SOAR</b> — Automated response orchestration</summary>

Security Orchestration, Automation & Response:
- **Playbook Library**: Pre-built playbooks for malware, ransomware, APT, insider threat, phishing, and more
- **Trigger Conditions**: JSON-defined conditions for automatic playbook activation
- **Approval Workflows**: Configurable approval thresholds (low/medium/high/critical)
- **Action Types**: Block IP, disable account, kill process, isolate endpoint, create ticket, snapshot VM, quarantine file, revoke credential, update firewall, collect forensics
- **Audit Trail**: Full execution history with rollback support
- **Success Metrics**: Execution count, success rate, average execution time

</details>

<details>
<summary><b>🤖 AI Copilot</b> — Conversational security assistant</summary>

The AI Copilot is powered by Google Gemini and runs as a Supabase Edge Function:
- **Natural Language Queries**: Ask questions in plain English about your security posture
- **Live Database Context**: The copilot has real-time access to incidents, assets, and threat intel
- **Streaming Responses**: Real-time response streaming for fast interaction
- **Source Citations**: Responses include references to MITRE techniques and relevant data
- **Confidence Scoring**: Each analysis includes a confidence score
- **Issue Detection**: Automatically identifies and highlights security issues
- **Thumbs Up/Down**: Feedback mechanism for response quality
- **Copy & Refresh**: Easy response management

</details>

---

## 🔐 Authentication & Roles

SentinelX AI uses Supabase Auth with email/password authentication and role-based access control:

| Role | Access Level | Description |
|---|---|---|
| **Cyber Analyst** | Full | Access to all modules including incidents, threat intel, assets, SOAR, UEBA, AI analysis, and advanced AI features |
| **Observer** | Read-Only | Limited to dashboard, SOC console (view), MITRE matrix, timeline, risk dashboard, AI copilot, settings, and profile |

**How it works:**
1. Users sign up with email/password via Supabase Auth
2. A `user_profiles` table stores role assignments (`analyst` or `observer`)
3. The `AuthContext` provider exposes `isAnalyst` based on the profile role
4. The app layout enforces route protection — analyst-only pages redirect observers
5. The sidebar dynamically filters navigation based on role

---

## 🤖 AI Copilot

The AI Copilot is the platform's conversational AI interface, powered by **Google Gemini** via a Supabase Edge Function.

<details>
<summary><b>How it works</b></summary>

1. **User sends a message** via the chat interface at `/copilot`
2. **The frontend** sends the message + live database context (incident count, asset count, threat count) to the `ai-copilot` edge function
3. **The edge function** (Deno runtime) forwards the conversation to Google Gemini with a security-focused system prompt
4. **Gemini** returns analysis, recommendations, and MITRE technique references
5. **The response** is streamed back to the user with confidence scores and source citations

</details>

<details>
<summary><b>System Prompt Capabilities</b></summary>

The AI Copilot system prompt enables:
- General knowledge queries (science, technology, programming, cybersecurity)
- Security operations analysis (incident analysis, asset risk, threat interpretation)
- MITRE ATT&CK technique explanations
- Vulnerability prioritization guidance
- Incident response recommendations
- Database query analysis and explanation

</details>

---

## 🔒 Security

- **Row-Level Security (RLS)** — Enabled on all 10+ database tables
- **Supabase Auth** — Email/password authentication with session management
- **Role-Based Access Control** — Analyst vs. Observer with route-level enforcement
- **Edge Function CORS** — Strict CORS headers on all edge function responses
- **Input Validation** — Zod schemas for form validation
- **Type Safety** — Full TypeScript coverage across the application

---

## 📄 Documentation

A comprehensive project documentation file is available for download:

📄 **[Download SentinelX AI — Project Documentation (.docx)](https://ai-cyber-resilience-jf32.bolt.host/docs)**

This document includes:
- Full project overview and objectives
- Detailed feature breakdowns
- Architecture diagrams and data flow
- Complete database schema documentation
- Module-by-module technical specifications
- Security model and RLS policy details
- AI Copilot implementation details
- Technology stack rationale
- Deployment guide

---

## 🗺️ Roadmap

- [x] Core SOC dashboard and incident management
- [x] MITRE ATT&CK matrix integration
- [x] UEBA with multiple ML algorithms
- [x] SOAR playbook automation
- [x] AI Copilot with Gemini integration
- [x] Role-based access control
- [x] Attack graph and path analysis
- [x] APT attribution and threat intel
- [x] Digital twin simulation
- [x] Correlation engine
- [x] Attack progression modelling
- [ ] Real-time WebSocket alerting
- [ ] Multi-tenant organisation support
- [ ] API rate limiting and quotas
- [ ] Mobile-responsive SOC console
- [ ] SSO / SAML integration
- [ ] Compliance reporting (SOC 2, ISO 27001, NIST)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing TypeScript and Tailwind conventions
- Ensure all new tables have RLS policies
- Test with both Analyst and Observer roles
- Run `npm run build` before submitting PRs
- Keep components modular and reusable


---

<div align="center">

<br />

**Built with security.**

<br />

| [Next.js](https://nextjs.org/) | [Supabase](https://supabase.com/) | [Tailwind CSS](https://tailwindcss.com/) | [Radix UI](https://www.radix-ui.com/) | [Google Gemini](https://ai.google.dev/) |
|---|---|---|---|---|

<br />

<sub>SentinelX AI — Cyber Resilience Platform</sub>

<br />

⭐ **If you found this project helpful, please give it a star!** ⭐

</div>
