# JETT Booking

React and Express booking experience for JETT bus services.

## Run & Operate

- `pnpm --filter @workspace/jett-booking run dev` — run the Vite frontend
- `pnpm --filter @workspace/api-server run dev` — build and run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Runtime data env: `SUPABASE_URL` and either `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY`
- `DATABASE_URL` is available through Replit's built-in PostgreSQL database, though the imported booking routes currently use Supabase

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite 6, Tailwind CSS 4
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/jett-booking` — frontend application
- `artifacts/api-server` — API and production static-file server
- `lib/api-spec` — OpenAPI contract
- `lib/api-client-react` and `lib/api-zod` — generated API clients and schemas
- `lib/db` — shared Drizzle database package

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
