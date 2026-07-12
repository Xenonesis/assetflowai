# AssetFlow AI

**Enterprise Asset Intelligence Platform** — v0.1.0

AI-native platform for managing physical assets, maintenance, compliance, inventory, audits, and enterprise workflows from a unified cloud system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16.2.10](https://nextjs.org) (App Router) |
| Language | TypeScript (strict) — `strict: true`, no `any` |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + CSS custom properties (dark/light tokens) |
| UI Primitives | [shadcn/ui](https://ui.shadcn.com) (base-nova style via `components.json`) + [Base UI React](https://base-ui.com) v1.6 |
| Forms | react-hook-form v7.81 + Zod v4.4 (schema validation) |
| Client State | Zustand v5 |
| Server State | TanStack React Query v5 |
| Auth | Supabase Auth + `@supabase/ssr` (cookie-based SSR sessions) |
| Database | PostgreSQL via Supabase |
| AI SDK | Vercel AI SDK v7 (`streamText`) + `@ai-sdk/react` (useChat hook) |
| AI Provider | OpenRouter (`@openrouter/ai-sdk-provider`) |
| Charts | Recharts v3 |
| Animation | Framer Motion v12 |
| Icons | Lucide React v1 |
| Theme | next-themes v0.4 (light / dark / system) |
| Notifications | Sonner v2 (toast) |
| CSS Animation | tw-animate-css v1 |
| Class Utility | clsx + tailwind-merge (wrapped in `cn()`) |
| Testing | Vitest v4 + jsdom + `@vitejs/plugin-react` |
| Linting | ESLint v9 + `eslint-config-next` v16 |
| Package Manager | pnpm (v9 workspace, `pnpm-workspace.yaml`) |
| Config | `tsconfig.json` with `@/` path alias, `components.json` for shadcn, `postcss.config.mjs` for Tailwind |

---

## Project Structure

```
assetflowai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Public auth routes (login/signup/forgot-password)
│   │   │   ├── login/page.tsx        #   → LoginForm component
│   │   │   ├── signup/page.tsx       #   → SignupForm component
│   │   │   ├── forgot-password/page.tsx # → ForgotPasswordForm component
│   │   │   └── layout.tsx            #   Split-screen layout (branding left, form right)
│   │   │
│   │   ├── (dashboard)/              # Authenticated app routes
│   │   │   ├── dashboard/page.tsx    #   Overview: 4 KPI cards + bar/pie charts (Recharts)
│   │   │   ├── assets/page.tsx       #   Asset inventory table (search, filter, status badges)
│   │   │   ├── assets/new/page.tsx   #   → AssetForm (Zod validated)
│   │   │   ├── bookings/page.tsx     #   Booking list + active count
│   │   │   ├── bookings/new/page.tsx #   → BookingForm (with overlap detection)
│   │   │   ├── maintenance/page.tsx  #   Maintenance tickets table (priority/status badges)
│   │   │   ├── maintenance/new/page.tsx # → MaintenanceForm (priority select + textarea)
│   │   │   ├── organization/page.tsx #   Depart/Category/Employee management cards + list
│   │   │   ├── organization/departments/new/page.tsx  # → DepartmentForm
│   │   │   ├── organization/categories/new/page.tsx   # → CategoryForm
│   │   │   └── layout.tsx            #   Sidebar nav + top navbar + AIAssistant
│   │   │
│   │   ├── api/ai/chat/route.ts      # POST: AI chat streaming (OpenRouter → SSE)
│   │   ├── error.tsx                 # Global error boundary (try again / go home)
│   │   ├── not-found.tsx             # 404 page
│   │   ├── page.tsx                  # Landing page (hero, features bento, logo wall, CTA)
│   │   ├── layout.tsx                # Root layout (Geist Sans/Mono fonts, ThemeProvider)
│   │   ├── globals.css               # CSS variables + Tailwind v4 import + dark/light tokens
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── button.tsx            #   9 variants (default/outline/secondary/ghost/destructive/link)
│   │   │   │                        #   9 sizes (xs/sm/default/lg/icon/icon-xs/icon-sm/icon-lg)
│   │   │   ├── input.tsx             #   Styled text input with focus ring
│   │   │   └── label.tsx             #   Form label component
│   │   ├── theme-toggle.tsx          # Light/Dark/System cycle toggle (Sun/Moon/Monitor icons)
│   │   ├── layout/                   # Shared layout components (sidebar items, etc.)
│   │   ├── shared/                   # Shared reusable components
│   │   └── icons/                    # Custom icon components
│   │
│   ├── features/                     # Feature-based modules (11 total)
│   │   ├── auth/                     # 🔐 Authentication
│   │   │   ├── actions/              # Server: login(), signup(), logout()
│   │   │   ├── components/           # LoginForm, SignupForm, ForgotPasswordForm
│   │   │   └── validators/           # Zod: loginSchema, signupSchema, resetPasswordSchema
│   │   │
│   │   ├── assets/                   # 📦 Asset Management
│   │   │   ├── actions/              # Server: createAsset(), getAssets(), allocateAsset()
│   │   │   ├── components/           # AssetForm (tag, name, serial, dept, category, cost...)
│   │   │   ├── validators/           # Zod: assetSchema (10 fields), allocationSchema
│   │   │   └── tests/                # Vitest: assetSchema validation tests (3 cases)
│   │   │
│   │   ├── bookings/                 # 📅 Resource Bookings
│   │   │   ├── actions/              # Server: createBooking() w/ overlap detection, getBookings()
│   │   │   ├── components/           # BookingForm (asset_id, start/end time, purpose)
│   │   │   └── validators/           # Zod: bookingSchema (.refine for time ordering)
│   │   │
│   │   ├── maintenance/              # 🔧 Maintenance Requests
│   │   │   ├── actions/              # Server: createMaintenanceRequest() (updates asset status),
│   │   │   │                        #         getMaintenanceRequests()
│   │   │   ├── components/           # MaintenanceForm (asset_id, priority select, description textarea)
│   │   │   └── validators/           # Zod: maintenanceRequestSchema (4 priorities, min 10 chars)
│   │   │
│   │   ├── organization/             # 🏢 Org Management
│   │   │   ├── actions/              # Server: CRUD for departments + categories
│   │   │   ├── components/           # DepartmentForm, CategoryForm
│   │   │   └── validators/           # Zod: departmentSchema, categorySchema
│   │   │
│   │   ├── ai/                       # 🤖 AI Assistant
│   │   │   ├── components/           # Floating chat panel (AIAssistant) with useChat hook
│   │   │   ├── config/               # OpenRouter provider config (default: Claude 3.5 Sonnet)
│   │   │   ├── prompts/              # SYSTEM_PROMPT — asset management specialist persona
│   │   │   └── services/             # AI tools: searchAssets(), getAssetStatus()
│   │   │
│   │   ├── activity/                 # 📋 Activity log (barrel export)
│   │   ├── allocations/              # 📤 Asset allocations (barrel export)
│   │   ├── audits/                   # ✅ Audit management (barrel export)
│   │   ├── notifications/            # 🔔 User notifications (barrel export)
│   │   └── reports/                  # 📊 Reports (barrel export)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client (createBrowserClient)
│   │   │   ├── server.ts             # Server client (createServerClient with cookie handling)
│   │   │   └── middleware.ts         # Auth middleware: session refresh + route guard
│   │   └── utils.ts                  # cn() — clsx + tailwind-merge helper
│   │
│   ├── providers/
│   │   ├── auth-provider.tsx         # Auth context provider (placeholder)
│   │   ├── query-provider.tsx        # TanStack Query provider (placeholder)
│   │   └── theme-provider.tsx        # next-themes wrapper (suppresses React 19 script warning)
│   │
│   ├── db/
│   │   ├── schema.sql                # Full PostgreSQL schema — 13 tables, 9 enums, indexes, triggers
│   │   ├── rls-policies.sql          # Row-level security — 4 roles, 30+ policies
│   │   ├── seed.sql                  # Sample data: 3 departments, 4 profiles, 4 categories, 4 assets
│   │   └── migrations/               # Future migration files
│   │
│   ├── types/
│   │   ├── database.ts               # Supabase Database type (generic interface)
│   │   ├── api.ts                    # API response types (placeholder)
│   │   └── index.ts                  # Global types export (placeholder)
│   │
│   ├── config/                       # App configuration files
│   ├── hooks/                        # Shared React hooks
│   ├── services/                     # Shared service layer
│   ├── store/                        # Zustand state stores
│   └── tests/setup.ts                # Vitest global setup (@testing-library/jest-dom)
│
├── proxy.ts                          # Next.js middleware entry → delegates to updateSession()
├── scaffold.js                       # Project scaffolding script (creates dirs + barrel files)
├── components.json                   # shadcn/ui configuration (base-nova style)
├── pnpm-workspace.yaml               # pnpm workspace config (sharp + unrs-resolver)
├── tsconfig.json                     # TypeScript config (strict, ES2017 target, @/ alias)
├── eslint.config.mjs                 # ESLint flat config (next core-web-vitals + typescript)
├── postcss.config.mjs                # PostCSS config (@tailwindcss/postcss plugin)
├── next.config.ts                    # Next.js config (minimal, extensible)
├── vercel.json                       # Vercel deployment (pnpm build/install, security headers)
├── vitest.config.ts                  # Vitest config (jsdom, @/ alias, coverage)
│
├── public/
│   ├── manifest.json                 # PWA manifest (app name, theme colors, icons)
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│   └── favicon.ico
│
├── docs/
│   ├── architecture/
│   │   ├── ADR-001-tech-stack.md     # Architecture Decision Record — stack rationale
│   │   └── dependency-graph.md       # System dependency diagram
│   ├── design-system/
│   │   └── MASTER.md                 # Design system master reference
│   ├── prd-index.md                  # PRD document index
│   └── roadmap.md                    # Feature roadmap
│
├── prd/                              # Product Requirements Documents (30+ sections)
│
├── AGENTS.md                         # Agent instructions (coding standards, architecture rules)
├── CLAUDE.md                         # Agent memory file
├── README.md                         # This file
├── .env.example                      # Environment variable template
└── .env.local                        # Local environment (gitignored)
```

---

## Landing Page (`/`)

A marketing landing page with 6 distinct sections:

| Section | Highlights |
|---------|-----------|
| **Header** | Sticky nav (75% bg blur), Auth-aware CTA buttons, ThemeToggle |
| **Hero** | Mesh grid background, animated tagline badge, gradient text, dual CTAs, interactive dashboard mockup (browser chrome + sidebar + KPI cards + bar chart + list) |
| **Logo Wall** | Trust bar with 4 brand blocks (APEX, SYNAPSE, CYPHER, CHRONO) |
| **Features Bento Grid** | Asymmetric 2+1+1+2 layout — Smart Inventory (w/ QR mockup), Predictive Maintenance (w/ calendar widget), AI-Powered Insights (w/ chat bubbles), Enterprise Compliance (w/ audit checklist) |
| **CTA Banner** | Radial glow background, headline, link to signup/dashboard |
| **Footer** | Logo, copyright, privacy/terms/contact links |

---

## Dashboard (`/dashboard`)

Authenticated overview page with real-time analytics:

- **4 KPI cards**: Total Assets (1,248 ↑12%), Active Allocations (842 ↑5%), Pending Maintenance (24 ↓2), System Activity (142 today)
- **Bar chart**: Asset growth over 6 months (Recharts + dark/light theme tooltips)
- **Donut chart**: Asset status distribution (Available/Allocated/Maintenance)
- **Sidebar navigation**: 3 sections (Overview, Core, Workflows, Administration) + sign out

### All Dashboard Pages

| Route | Type | Description |
|-------|------|-------------|
| `/dashboard` | Client | Overview with KPI cards + charts |
| `/assets` | Server | Asset inventory table w/ search, filter, status badges, actions |
| `/assets/new` | Client | Asset registration form (10 fields) |
| `/bookings` | Server | Booking list + active count card |
| `/bookings/new` | Client | Resource booking form with time overlap detection |
| `/maintenance` | Server | Maintenance tickets table (priority/status badges) |
| `/maintenance/new` | Client | Maintenance request form w/ priority select + textarea |
| `/organization` | Server | Department/category/employee management cards + dept list |
| `/organization/departments/new` | Client | Department creation form |
| `/organization/categories/new` | Client | Category creation form |

---

## Database Schema

13 tables with full RLS enforcement via Supabase:

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `departments` | `id`, `name`, `code`, `head_id`, `parent_id` | Org hierarchy (self-referencing FK) |
| `profiles` | `id` (→ `auth.users`), `email`, `full_name`, `role`, `department_id` | User profiles with RBAC role |
| `categories` | `id`, `name`, `metadata_schema` (JSONB) | Asset classification with custom schemas |
| `assets` | `asset_tag` (UNIQUE), `serial_number`, `status`, `current_holder_id`, `deleted_at` (soft delete) | Core asset registry |
| `allocations` | `asset_id`, `allocated_to`, `condition_on_allocation`, `expected_return` | Assignment tracking |
| `transfers` | `asset_id`, `from_user_id`, `to_user_id`, `status` (4 states) | Inter-department transfers |
| `bookings` | `asset_id`, `start_time`, `end_time`, `status` | Shared resource scheduling |
| `maintenance_requests` | `asset_id`, `priority`, `status` (7 states), `assigned_to` | Repair lifecycle |
| `audit_cycles` | `name`, `start_date`, `end_date`, `status` (4 states) | Audit campaigns |
| `audit_items` | `cycle_id`, `asset_id`, `status` (5 states), `condition` | Per-asset audit verification |
| `notifications` | `user_id`, `title`, `message`, `read`, `link` | User notification inbox |
| `activity_logs` | `user_id`, `action`, `entity_type`, `entity_id`, `metadata` (JSONB) | Immutable audit trail |
| `ai_conversations` | `user_id`, `messages` (JSONB), `model`, `tokens_used` | AI chat history |

### Database Features

- **9 PostgreSQL enums**: `user_role`, `asset_status`, `asset_condition`, `maintenance_priority`, `maintenance_status`, `transfer_status`, `booking_status`, `audit_status`, `audit_item_status`
- **Auto-updating `updated_at`**: Trigger function + 11 table triggers
- **8 performance indexes**: Covering departments, categories, holders, status, allocations, activity logs, notifications
- **UUID primary keys** via `uuid-ossp` extension
- **Soft delete** on assets table

---

## Authentication & Authorization

### Auth Flow

- **Supabase Auth** (email/password) via `@supabase/ssr`
- **Server-side sessions**: Cookie-based via `createServerClient()`
- **Browser sessions**: `createBrowserClient()` for client components
- **Session refresh**: Middleware (`proxy.ts` → `updateSession()`) refreshes on every request

### Route Protection

| User State | Auth Routes (`/login`, `/signup`, etc.) | Dashboard Routes (`/dashboard`, `/assets`, etc.) |
|------------|----------------------------------------|-------------------------------------------------|
| Authenticated | Redirect → `/dashboard` | ✅ Allow |
| Unauthenticated | ✅ Allow | Redirect → `/login` |

### RBAC Roles (enforced via RLS)

| Role | Description |
|------|-------------|
| `admin` | Full system access — manage profiles, departments, all assets |
| `asset_manager` | Manage all assets, allocations, maintenance, bookings |
| `department_head` | Department-scoped management + transfer approval |
| `employee` | Self-service: own assets, own bookings, own requests |

### RLS Highlights

- 30+ policies across all 13 tables
- Users see profiles in their department (admin sees all)
- Assets scoped by department, with manager/admin override
- Users manage own bookings/notifications/AI conversations
- Activity logs are admin-only (immutable audit trail)
- Helper functions: `get_user_role()`, `get_user_department()`

---

## AI Assistant

| Aspect | Detail |
|--------|--------|
| **Provider** | OpenRouter (default: `anthropic/claude-3.5-sonnet`) |
| **Integration** | Vercel AI SDK v7 — `streamText()` for SSE streaming |
| **Client Hook** | `useChat()` from `@ai-sdk/react` |
| **Tools** | `searchAssets(query)` — ilike search on name/tag/serial |
| | `getAssetStatus(asset_tag)` — exact tag lookup with holder info |
| **System Prompt** | Asset management specialist — concise, tool-using, session-aware |
| **Session Gate** | API route validates `auth.getUser()` before streaming |
| **UI** | Floating chat panel (bottom-right), Sparkles FAB, auto-scroll, typing indicator, close button |
| **Schema** | AI conversations logged to `ai_conversations` table (messages JSONB, token tracking) |

---

## UI Components

### Button (`src/components/ui/button.tsx`)

Built on [Base UI Button](https://base-ui.com/react/button) with `class-variance-authority`:

| Variant | Use |
|---------|-----|
| `default` | Primary actions (bg-primary) |
| `outline` | Secondary actions (border + bg-background) |
| `secondary` | Muted actions |
| `ghost` | Minimal hover-only |
| `destructive` | Dangerous actions (red tint) |
| `link` | Text link style |

Sizes: `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

### ThemeToggle (`src/components/theme-toggle.tsx`)

- Cycles: Light → Dark → System → Light
- Icons: Sun / Moon / Monitor (Lucide)
- Hydration-safe (mount guard)
- Tooltip shows current mode

### Form Components

All forms follow the same pattern:
1. Client component with `"use client"`
2. `zodResolver` from `@hookform/resolvers`
3. `react-hook-form` `useForm` typed to Zod schema
4. Error state management (`useState<string | null>`)
5. Server action call → redirect or show error
6. Accessible `<Label>`, `<Input>`, error messages
7. Cancel + Submit buttons with loading states

#### Form Validators Detail

| Schema | Fields | Refinements |
|--------|--------|-------------|
| `assetSchema` | `asset_tag` (min 2), `name` (min 2), `serial_number?`, `category_id` (uuid), `department_id` (uuid), `status` (enum, default available), `condition` (enum, default good), `purchase_date?`, `purchase_cost?` (coerce number), `warranty_expiry?`, `location?`, `notes?` | — |
| `allocationSchema` | `asset_id` (uuid), `allocated_to` (uuid), `expected_return?`, `condition_on_allocation` (enum) | — |
| `bookingSchema` | `asset_id` (uuid), `start_time`, `end_time`, `purpose?` | `end_time > start_time` |
| `maintenanceRequestSchema` | `asset_id` (uuid), `priority` (enum, default medium), `description` (min 10) | — |
| `departmentSchema` | `name` (min 2), `code` (min 2), `description?`, `head_id?` (uuid/nullable), `parent_id?` (uuid/nullable) | — |
| `categorySchema` | `name` (min 2), `description?`, `icon?` | — |
| `loginSchema` | `email` (valid email), `password` (min 8) | — |
| `signupSchema` | `fullName` (min 2), `email`, `password` (min 8) | — |
| `resetPasswordSchema` | `email` (valid email) | — |

---

## API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/ai/chat` | POST | Required | Streams AI chat response via SSE. Validates session, calls `streamText()` with model + system prompt + tools, returns `toTextStreamResponse()` |

---

## Server Actions

All data mutations use Next.js Server Actions (`"use server"`):

| Action | Module | Side Effects |
|--------|--------|-------------|
| `login()` | `features/auth/actions` | Supabase `signInWithPassword`, revalidate, redirect |
| `signup()` | `features/auth/actions` | Supabase `signUp` with user metadata, revalidate, redirect |
| `logout()` | `features/auth/actions` | Supabase `signOut`, revalidate, redirect |
| `createAsset()` | `features/assets/actions` | Insert asset + activity log entry, revalidate |
| `getAssets()` | `features/assets/actions` | Select with joins (department, category, holder), soft-delete filter |
| `allocateAsset()` | `features/assets/actions` | Create allocation + update asset status/holder + activity log |
| `createBooking()` | `features/bookings/actions` | Overlap check → insert booking, revalidate |
| `getBookings()` | `features/bookings/actions` | Select with joins (asset, user) |
| `createMaintenanceRequest()` | `features/maintenance/actions` | Insert request + update asset to "maintenance" + activity log |
| `getMaintenanceRequests()` | `features/maintenance/actions` | Select with joins (asset, requester, assignee) |
| `createCategory()` | `features/organization/actions` | Insert category, revalidate |
| `getCategories()` | `features/organization/actions` | Select all ordered by name |
| `createDepartment()` | `features/organization/actions` | Insert department, revalidate |
| `getDepartments()` | `features/organization/actions` | Select with head profile join |

---

## Proxy & Middleware

`src/proxy.ts` is the Next.js middleware entry point (Next.js 16 uses `src/proxy.ts`):

- Delegates to `src/lib/supabase/middleware.ts` → `updateSession()`
- Matcher excludes: `_next/static`, `_next/image`, `favicon.ico`, static assets (svg/png/jpg/gif/webp)
- Performs session refresh + route guard on every matching request

---

## Configuration Files

### `components.json` (shadcn/ui)
- Style: `base-nova`, RSC enabled, TypeScript
- CSS variables, Lucide icons, `@/` path aliases

### `tsconfig.json`
- `strict: true`, `ES2017` target, `jsx: preserve-jsx`
- `@/*` → `./src/*` path alias
- Next.js type plugin

### `vercel.json`
- Build: `pnpm run build`, Install: `pnpm install`
- Framework: `nextjs`
- Security headers: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`

### `pnpm-workspace.yaml`
- Allows `sharp` and `unrs-resolver` builds

### `scaffold.js`
- Node.js script that creates the full directory tree + barrel files + SQL stubs
- Used for initial project bootstrapping

---

## Testing

| File | Type | What it tests |
|------|------|--------------|
| `src/features/assets/tests/asset-schema.test.ts` | Unit (Vitest) | 3 cases: valid asset, missing asset_tag, invalid UUID |
| `src/tests/setup.ts` | Global setup | Imports `@testing-library/jest-dom` matchers |

Run: `pnpm vitest`

Config: jsdom environment, `@/` alias, HTML coverage reporter.

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Supabase project (free tier works)
- OpenRouter API key (for AI features)

### Install

```bash
git clone https://github.com/Xenonesis/assetflowai.git
cd assetflowai
cp .env.example .env.local   # Fill in your credentials
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Setup

Run in Supabase SQL Editor in this exact order:

1. `src/db/schema.sql` — 13 tables, 9 enums, indexes, `updated_at` triggers
2. `src/db/rls-policies.sql` — 30+ row-level security policies
3. `src/db/seed.sql` — sample data (admin/manager/head/employee users + assets)

### Run Tests

```bash
pnpm vitest
```

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

```bash
vercel --prod
```

Environment variables must be configured in Vercel dashboard.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm vitest` | Run Vitest test suite |

---

## Architecture Decisions

See [docs/architecture/ADR-001-tech-stack.md](docs/architecture/ADR-001-tech-stack.md) for full rationale on:
- Why Next.js App Router over Pages Router
- Why Supabase over custom backend
- Why OpenRouter as AI gateway
- Why feature-first architecture
- Why Zod over custom validation

---

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for planned features:

| Feature | Priority |
|---------|----------|
| Drizzle ORM migration | 🟡 Medium |
| Redis caching layer | 🟡 Medium |
| BullMQ async job queue | 🟡 Medium |
| QR code generation + scanning | 🟢 High |
| Advanced audit workflows | 🟢 High |
| Predictive maintenance ML | 🔵 Low |
| Multi-tenant isolation | 🔵 Low |
| Real-time dashboards | 🟡 Medium |

---

## Design System

See [docs/design-system/MASTER.md](docs/design-system/MASTER.md) for:
- Color tokens (light + dark)
- Typography (Geist Sans/Mono)
- Spacing scale
- Component API references
- Accessibility guidelines

---

## License

Enterprise — AssetFlow AI © 2026
