# AssetFlow AI

**Enterprise Asset Intelligence Platform** — v0.1.0

AI-native platform for managing physical assets, maintenance, compliance, inventory, audits, and enterprise workflows from a unified cloud system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| UI | shadcn/ui primitives + [Base UI](https://base-ui.com) |
| Forms | react-hook-form + Zod v4 validation |
| State | Zustand (client), TanStack Query (server) |
| Auth | Supabase Auth + SSR cookies + RBAC |
| Database | PostgreSQL via Supabase |
| AI SDK | Vercel AI SDK v7 + OpenRouter |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React |
| Theme | next-themes |
| Testing | Vitest + jsdom |
| Package | pnpm |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Login / Signup / Forgot Password
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/            # Authenticated app pages
│   │   ├── dashboard/          # Overview with KPI cards + charts
│   │   ├── assets/             # Asset inventory list + create
│   │   ├── maintenance/        # Maintenance requests list + create
│   │   ├── bookings/           # Resource bookings list + create
│   │   └── organization/       # Departments + categories management
│   ├── api/ai/chat/route.ts    # AI chat streaming endpoint
│   ├── error.tsx               # Global error boundary
│   ├── not-found.tsx           # 404 page
│   ├── page.tsx                # Landing page
│   └── layout.tsx              # Root layout (Geist font, ThemeProvider)
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, input, label)
│   ├── theme-toggle.tsx        # Dark/light mode toggle
│   ├── layout/                 # Shared layout components
│   ├── shared/                 # Shared UI components
│   └── icons/                  # Custom icon components
│
├── features/                   # Feature-based modules
│   ├── auth/                   # Authentication
│   │   ├── actions/            # Server actions (login, signup, logout)
│   │   ├── components/         # LoginForm, SignupForm, ForgotPasswordForm
│   │   └── validators/         # Zod schemas for auth forms
│   │
│   ├── assets/                 # Asset management
│   │   ├── actions/            # Server actions (create, list, allocate)
│   │   ├── components/         # AssetForm
│   │   ├── validators/         # Zod schemas (asset, allocation)
│   │   └── tests/              # Schema validation tests
│   │
│   ├── bookings/               # Resource bookings
│   │   ├── actions/            # Create + list with overlap detection
│   │   ├── components/         # BookingForm
│   │   └── validators/         # Booking schemas
│   │
│   ├── maintenance/            # Maintenance requests
│   │   ├── actions/            # Create + list with asset status sync
│   │   ├── components/         # MaintenanceForm
│   │   └── validators/         # Maintenance schemas
│   │
│   ├── organization/           # Departments & categories
│   │   ├── actions/            # CRUD for departments + categories
│   │   ├── components/         # DepartmentForm, CategoryForm
│   │   └── validators/         # Org schemas
│   │
│   ├── ai/                     # AI Assistant
│   │   ├── components/         # Floating chat panel (AIAssistant)
│   │   ├── config/             # OpenRouter provider config
│   │   ├── prompts/            # System prompt
│   │   └── services/           # AI tools (searchAssets, getAssetStatus)
│   │
│   ├── activity/               # Activity log index
│   ├── allocations/            # Allocation index
│   ├── audits/                 # Audit index
│   ├── notifications/          # Notification index
│   └── reports/                # Reports index
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client (cookie-based)
│   │   └── middleware.ts       # Auth middleware (session refresh + route guard)
│   └── utils.ts                # Utility helpers (cn)
│
├── providers/
│   ├── auth-provider.tsx       # Auth context provider
│   ├── query-provider.tsx      # TanStack Query provider
│   └── theme-provider.tsx      # next-themes wrapper (dark/light/system)
│
├── db/
│   ├── schema.sql              # Full PostgreSQL schema (13 tables)
│   ├── rls-policies.sql        # Row-level security policies (role-based)
│   └── seed.sql                # Seed data (departments, profiles, assets)
│
├── types/
│   ├── database.ts             # Supabase Database type
│   ├── api.ts                  # API response types
│   └── index.ts                # Global types
│
├── config/                     # App configuration
├── hooks/                      # Shared React hooks
├── services/                   # Shared services
├── store/                      # Zustand stores
└── tests/setup.ts              # Vitest global setup
```

---

## Database Schema

13 tables with full RLS enforcement:

| Table | Purpose |
|-------|---------|
| `departments` | Org hierarchy (self-referencing) |
| `profiles` | User profiles (linked to auth.users) |
| `categories` | Asset categories with JSONB metadata schema |
| `assets` | Core asset registry (soft-delete) |
| `allocations` | Assignment tracking with condition logging |
| `transfers` | Inter-department asset transfers |
| `bookings` | Shared resource booking with overlap checks |
| `maintenance_requests` | Repair lifecycle (7 statuses) |
| `audit_cycles` | Audit campaign management |
| `audit_items` | Per-asset audit verification |
| `notifications` | User notification inbox |
| `activity_logs` | Immutable audit trail |
| `ai_conversations` | AI chat history with token tracking |

9 PostgreSQL enums: `user_role`, `asset_status`, `asset_condition`, `maintenance_priority`, `maintenance_status`, `transfer_status`, `booking_status`, `audit_status`, `audit_item_status`.

---

## Auth & Authorization

- **Supabase Auth** with email/password
- **Supabase SSR** — server-side sessions via cookie-based middleware
- **Route protection** — middleware redirects unauthenticated users to `/login` and authenticated users away from auth pages
- **RBAC** — 4 roles enforced via RLS: `admin`, `asset_manager`, `department_head`, `employee`
- **Granular policies** — department-scoped visibility, manager override, self-service access

---

## AI Assistant

Multi-provider AI chat with database tool access:

- **Provider**: OpenRouter (defaults to Claude 3.5 Sonnet)
- **Streaming**: Server-Sent Events via `streamText()`
- **Tools**: `searchAssets` (by name/tag/serial), `getAssetStatus` (by tag)
- **System prompt**: Context-aware asset management assistant
- **Session-gated**: Requires authenticated session
- **UI**: Floating chat panel with scrollable conversation + typing indicator

---

## Dashboard & Analytics

- **KPI cards**: Total assets, active allocations, pending maintenance, system activity
- **Charts**: Asset growth (bar), status distribution (donut pie), maintenance trends (line)
- **Recharts** with dark/light theme-aware tooltips

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Supabase project
- OpenRouter API key (for AI features)

### Environment

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `NEXT_PUBLIC_APP_URL` | App base URL |

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Setup

Run in Supabase SQL Editor in order:

1. `src/db/schema.sql` — tables, enums, indexes, triggers
2. `src/db/rls-policies.sql` — row-level security
3. `src/db/seed.sql` — sample data

### Test

```bash
pnpm vitest
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm vitest` | Run tests |

---

## Deployment

Configured for Vercel with security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

```bash
vercel --prod
```

---

## Architecture Decisions

See [docs/architecture/ADR-001-tech-stack.md](./docs/architecture/ADR-001-tech-stack.md) for full rationale on stack choices.

---

## Roadmap

See [docs/roadmap.md](./docs/roadmap.md) for planned features: Drizzle ORM, Redis caching, BullMQ queues, QR code generation, advanced audit workflows, predictive maintenance ML, multi-tenant isolation.

---

## License

Enterprise — AssetFlow AI © 2026
