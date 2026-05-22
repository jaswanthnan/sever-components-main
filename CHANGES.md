# Build Fixes

## postcss.config.js
- Replaced `tailwindcss: {}` with `"@tailwindcss/postcss": {}` — Tailwind v4 moved its PostCSS plugin to a separate package
- Removed `autoprefixer` — built into Tailwind v4, no longer needed separately
- Assigned config to a named variable before export to fix ESLint `import/no-anonymous-default-export` warning

## package.json
- Added `"type": "module"` to eliminate `MODULE_TYPELESS_PACKAGE_JSON` performance warning
- Installed `dotenv`, `@types/dotenv` — required by `backend/seed.ts`
- Installed `express`, `cors`, `@types/express`, `@types/cors` — required by `backend/server.ts`

## Route Handlers — params is now a Promise (Next.js 15+)
In Next.js 15+, dynamic route `params` must be typed as `Promise<{ id: string }>` and awaited.

- `src/app/api/candidates/[id]/route.ts` — fixed `DELETE` handler
- `src/app/api/candidates/[id]/summary/route.ts` — fixed `GET` handler
- `src/app/api/jobs/[id]/route.ts` — fixed `GET`, `PATCH`, `DELETE` handlers

Before:
```ts
{ params }: { params: { id: string } }
// params.id
```
After:
```ts
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

## Navigation Hooks — null safety
`useSearchParams()`, `usePathname()` can return `null` in Next.js. Added optional chaining (`?.`) where needed.

- `src/app/(admin)/search/page.tsx` — `searchParams?.get('q')`
- `src/components/candidates/CandidateFilters.tsx` — `searchParams?.get('status')`, `searchParams?.toString()`
- `src/components/layout/Header.tsx` — `pathname?.startsWith(...)`
- `src/components/layout/Sidebar.tsx` — `pathname?.startsWith(...) ?? false`

## src/hooks/index.ts
- `useIntersectionObserver` — changed param type from `RefObject<HTMLElement>` to `RefObject<HTMLElement | null>` to match `useRef<HTMLDivElement>(null)` which TypeScript now types as `RefObject<HTMLDivElement | null>`

## src/routes/AppRoutes.tsx
- Removed `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` from `<BrowserRouter>` — these flags were removed in React Router v7 (on by default)

## src/context/AppContext.tsx
- Guarded all `localStorage` access with `typeof window !== 'undefined'` to prevent SSR crash (`localStorage is not defined`)
- Affected: `getInitialState()`, `LOGIN` case, `LOGOUT` case, `TOGGLE_THEME` case

## src/pages → src/views (directory rename)
- Renamed `src/pages/` to `src/views/` — Next.js treats `src/pages/` as the Pages Router and was prerendering React Router SPA pages as Next.js routes, causing `useNavigate()` crashes
- Updated all imports in `src/routes/AppRoutes.tsx`

## next.config.ts
- Added `allowedDevOrigins: ['192.168.29.239']` to allow cross-origin HMR from local network IP (required when accessing dev server from another device)