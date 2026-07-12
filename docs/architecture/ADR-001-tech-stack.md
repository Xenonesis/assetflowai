# ADR-001: Technical Stack

## Status
Accepted

## Context
AssetFlow AI requires a scalable, modern web application architecture capable of supporting enterprise features, real-time updates, AI integration, and a rich user experience. We need to decide on the core technologies for the frontend, backend, database, styling, and AI integration.

## Decision
We will use the following tech stack:

1. **Framework**: Next.js 16 (App Router)
   - Reason: Provides a robust framework for React with server components, API routes, and excellent performance.

2. **Language**: TypeScript (Strict Mode)
   - Reason: Ensures type safety, improves developer experience, and reduces runtime errors.

3. **Database & Auth**: Supabase (PostgreSQL)
   - Reason: Offers a scalable PostgreSQL database with built-in authentication, Row-Level Security (RLS), and real-time capabilities.

4. **Styling**: Tailwind CSS v4
   - Reason: Utility-first CSS framework for rapid UI development and consistent styling.

5. **UI Components**: shadcn/ui
   - Reason: Provides accessible, customizable, and high-quality UI primitives.

6. **State Management**: Zustand
   - Reason: Minimalistic, fast, and scalable state management for client-side state.

7. **Data Fetching**: TanStack Query v5
   - Reason: Powerful asynchronous state management for server state, caching, and synchronization.

8. **AI Integration**: Vercel AI SDK + OpenRouter
   - Reason: Vercel AI SDK provides a unified API for streaming responses and tool calling, while OpenRouter allows us to seamlessly switch between different LLM providers (OpenAI, Anthropic, Google).

9. **Forms & Validation**: React Hook Form + Zod v4
   - Reason: Performant, flexible, and extensible form handling with robust schema validation.

10. **Animation**: Framer Motion
    - Reason: Declarative and powerful animation library for React to support the UI/UX Pro Max micro-interactions.

## Consequences
- Development will be highly integrated within the React/Next.js ecosystem.
- We rely on Supabase for data access and security via RLS.
- UI consistency will be enforced through Tailwind and shadcn/ui.
