# Hamed Hussein — Developer Portfolio & Learning Platform

Personal developer ecosystem for **Hamed Hussein** — a Fullstack & AI/ML Engineer
based in Kigali, Rwanda. The site serves two audiences:

1. **Employers / clients** — a portfolio with projects, skills, achievements,
   testimonials, a hire page, and a downloadable CV.
2. **Students** — free courses with lessons, quizzes, progress tracking, and
   **verifiable completion certificates**.

> The online handle **`@hamedprodev`** appears in the bio/social links; the site
> itself is branded as "Hamed Hussein".

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (`uploads` bucket) |
| UI | Tailwind CSS + Radix UI (shadcn/ui pattern), glassmorphism theme |
| Animations | Framer Motion |
| Charts | Recharts |
| Markdown | react-markdown + remark-gfm + rehype-highlight |

## Getting Started

```bash
npm install --legacy-peer-deps
cp .env.example .env      # fill in your Supabase credentials
npm run dev               # http://localhost:3000
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (**keep secret**) |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `/api/seed` to create the admin user |
| `SEED_SECRET` | Optional shared secret to gate `/api/seed` |
| `GITHUB_ACCESS_TOKEN` | Optional, for GitHub stats |

## Database Setup

1. Open **Supabase Dashboard → SQL Editor**.
2. Run **`supabase/apply-2026-09-08.sql`** — the full, idempotent migration
   (base tables + RLS + enrollments/lesson_progress/certificates/saved_jobs +
   gamification + referrals + project detail fields). One paste, safe to re-run.
3. Run `supabase/storage-policies.sql` to set up the `uploads` bucket.
4. (Optional, if you prefer the step-by-step originals instead of the combined
   file: `supabase/schema.sql` then
   `supabase/plan/2026-09-08_learning_and_fixes.sql`.)
5. Set `SUPABASE_SERVICE_ROLE_KEY` in your environment (Vercel env var + local
   `.env`). The placeholder in the repo was intentionally rotated out.

## Seeding

```bash
# From the admin panel or:
curl -X POST http://localhost:3000/api/seed \
  -H 'x-seed-secret: YOUR_SEED_SECRET'
```

## Project Structure

```
src/
  app/                # App Router pages + API routes
    (public)/         # Public marketing/content pages
    (auth)/           # login, register
    (dashboard)/      # dashboard, profile, my-courses, certificates
    admin-control/    # Admin CMS (PIN + password gated)
    api/              # REST API (projects, courses, blog, enrollments, certificates, ...)
  components/         # UI + feature components
  lib/
    supabase/         # Supabase clients + db helpers
    utils/            # cn, format, seo, slug
    hooks/            # useAuth, useSearch, usePagination, ...
supabase/
  schema.sql          # Base schema
  plan/               # Migration proposals (learning & certificate flow)
scripts/seed.js       # Legacy MongoDB seeder (kept for reference; uses env only)
```

## Key Routes

- Public: `/`, `/projects`, `/courses`, `/blog`, `/skills`, `/achievements`,
  `/startups`, `/about`, `/contact`, `/hire`, `/cv`, `/community`, `/open-source`,
  `/tools`, `/newsletter`, `/docs`, `/privacy`, `/terms`, `/verify/[number]`
- Auth: `/login`, `/register`
- Dashboard: `/dashboard`, `/profile`, `/my-courses`, `/certificates`
- Admin: `/admin-control` (and sub-routes for each content type)

## Security Notes

- Route protection lives in `src/middleware.ts` (redirects unauthenticated users
  from `/dashboard`, `/my-courses`, `/certificates`, `/profile`, `/admin-control`,
  `/saved-jobs` to `/login`).
- All writes go through API routes that check `requireAdmin()` (service-role
  client on the server).
- Admin panel additionally uses a PIN + password gate (`AdminGate`).
- **If a Supabase service-role key was ever committed, rotate it immediately.**

## Scripts

```bash
npm run dev         # start dev server
npm run build       # production build
npm run start       # serve production build
npm run type-check  # TypeScript check
npm run lint        # ESLint
```
