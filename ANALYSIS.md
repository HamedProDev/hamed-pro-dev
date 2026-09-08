# Hamed Hussein — Codebase Analysis

> Produced by automated code review of the `hamed-pro-dev` repository (branch
> `arena/01a081b4-hamed-pro-dev`). No changes were applied to the code or the
> database. `npm run type-check` ✅ and `npm run build` ✅ both pass — the issues
> below are **functional, architectural, security and data bugs**, not compile errors.

---

## 1. What the project actually is (verified)

| Area | Status |
|---|---|
| Framework | Next.js 14.2.18 (App Router), TypeScript, `src/` directory |
| Styling | Tailwind CSS + shadcn/ui-style primitives, dark theme by default |
| Data | Supabase (Postgres) via `@supabase/ssr` + `@supabase/supabase-js` |
| Auth | Supabase Auth (email/password), client-side `signInWithPassword` |
| Files | 189 TS/TSX files, ~11,500 LOC |
| Build | ✅ passes (`next build`), TypeScript ✅ clean |

The app is a **portfolio + CMS + courses** platform matching the spec, but several
spec-described features are **stubs or not implemented** (see §4 and §5).

---

## 2. 🔴 Critical — secrets & security (fix these first)

1. **`SUPABASE_SERVICE_ROLE_KEY` is committed** in `.env.example` (tracked by git,
   see `git ls-files .env.example`). The service-role key bypasses all Row Level
   Security. **Rotate this key in Supabase immediately** and remove it from the repo.
   (The anon key being public is normal.)

2. **`scripts/seed.js` leaks a MongoDB Atlas connection string with a plaintext
   password** (`mongodb+srv://hamedprodev:@He00Ri%23Ga4Da@hamedprodev.aiwnhac.mongodb.net/...`)
   plus the admin password `@He00Ri#Ga4Da`. This file is a leftover from an earlier
   MongoDB version of the project. **Rotate that Atlas password / delete the file.**

3. **`/api/seed` POST has NO admin check** (`src/app/api/seed/route.ts` only exports
   `POST` with no `requireAdmin`). Anyone on the internet can hit it, and it:
   - creates an admin user (if absent) with a **hardcoded known password**,
   - **returns the admin credentials in the JSON response**.
   → Must be removed, gated behind `requireAdmin`, or deleted in production.

4. **Admin PIN + password are hardcoded client-side** in
   `src/components/admin/AdminGate.tsx` (`19890`, `@He00Ri#Ga4Da`). They ship to the
   browser JS bundle, so the "double-auth gate" is cosmetic. The *real* protection is
   `requireAdmin()` on API routes — that part is correct — but the PIN/password should
   move server-side or be removed to avoid a false sense of security.

5. **`/api/users` POST (create user) has no `requireAdmin`**
   (`src/app/api/users/route.ts`). Unauthenticated account creation via the
   service-role key = spam/abuse vector.

6. **No rate-limiting / honeypot / captcha** on `/api/contact`, `/api/newsletter`,
   `/api/analytics` — all publicly writable via the service-role client.

7. **RLS "admin" policies are inconsistent and effectively unused.** Every policy
   checks `auth.jwt()->'app_metadata'->>'role' = 'admin'`, but the `set_admin_role()`
   trigger only sets `profiles.role`. Meanwhile **all** reads/writes go through the
   service-role client (`lib/supabase/db.ts` → `createServiceClient`), which **bypasses
   RLS entirely**. So RLS is decorative: the security boundary is the API layer
   (`requireAdmin`), not the database. This should be reconciled (either rely on RLS
   and stop using service-role everywhere, or drop the misleading RLS policies).

8. **Route protection middleware is dead code.** There are two middleware files:
   - `src/middleware.ts` — the one Next.js actually compiles (confirmed in
     `.next/server/middleware-manifest.json` → `server/src/middleware.js`). It only
     refreshes the Supabase session. It does **not** protect `/admin-control`,
     `/dashboard`, `/my-courses`.
   - `middleware.ts` (root) — **ignored by Next.js** (shadowed by the `src/` version).
     Its `__session`-cookie + redirect logic never runs. The `__session` cookie is never
     even set (only cleared in `/api/auth/logout`).
   → `/dashboard` and `/my-courses` are only "protected" by client-side
   `if (!user) …` guards (data still renders server-side is fine, but the routes are
   reachable and the layout renders before redirect).

---

## 3. 🟠 Functional bugs

1. **Enrollment + certificates do not exist end-to-end.**
   - `GET /api/users/me` returns `{ uid, email, name, image, role }` — **no
     `enrolledCourses`**, yet `dashboard` and `my-courses` read `d.data.enrolledCourses`.
   - There is **no `enrollments` table** in `supabase/schema.sql`.
   - `dashboard` hardcodes `certs: 0`.
   - Course detail has no enroll action for free courses ("Start Learning" just opens
     lesson 1; no login, no tracking).
   - The quiz on the lesson page is **client-only** and results are never saved.
   - `CertificateCard` exists but is never used to issue a real certificate.
   → This is the biggest gap versus your stated goal ("students learn and get free
   certificates").

2. **Profile editing is broken.** The profile page PUTs to `/api/users/me`, but that
   route only implements `GET` → the save returns **405** and silently fails. The only
   profile-write route is `/api/users/[id]` which **requires admin**. Also
   `getCurrentUser()` drops the `bio` field, so the bio can't even be loaded.

3. **`/api/newsletter` DELETE is inverted.** The "unsubscribe" handler treats the
   `token` as an email, looks up by it, and then **sets `is_active: true`** (re-subscribes)
   instead of deactivating. Unsubscribe is non-functional.

4. **`my-courses` links to `/courses/${c.id}`** but the route is `/courses/[slug]`
   (`src/app/(public)/courses/[slug]/page.tsx` matches on `slug`). Clicking a course in
   "My Courses" 404s.

5. **`/api/auth/login` is a no-op stub** (`{ success: true, url: '/dashboard' }`). Login
   happens client-side; the stub is misleading. Same for `/api/auth/session` (POST no-op)
   and `/api/auth/providers` (hardcoded `['credentials']`).

6. **Stub/placeholder pages** linked from the site:
   - Footer links to `/docs`, `/privacy`, `/terms` — **none exist** (404).
   - `/community` and `/open-source` are placeholder pages with fake links
     (`discord.gg/hamedprodev`, `chat.whatsapp.com/hamedprodev`).
   - `admin-control/about` is a **fake editor** — its Save button only toggles a
     `saved` state and never calls an API.

7. **`jobs` is half-wired.** A `jobs` table exists in `schema.sql` and the middleware
   matcher mentions `/saved-jobs`, but there is **no jobs API route, no jobs page, no
   saved-jobs table/page**.

8. **Search is O(n) in-memory**, not the Meilisearch/Postgres FTS the schema sets up.
   `/api/search` loads every published row and filters in JS; the GIN indexes and
   `meilisearch.ts` helper are unused (Meilisearch isn't even in `package.json`).

---

## 4. 🟡 Schema / database inconsistencies

`supabase/schema.sql` defines 15 tables, but several differ from the spec and from the
admin forms:

| Table | Issue |
|---|---|
| `blog_posts.tags` | `schema.sql` says `TEXT[]`, but `fix-missing-columns.sql` tries `JSONB`. Admin form sends a JSON array → type mismatch risk. |
| `courses.tags / prerequisites / outcomes` | JSONB (OK), but `FIELD_MAP` in `helpers.ts` doesn't map course `tags`, and admin forms may send strings. |
| `organizations` | Has **both** `team_roles INT` (weird — a count?) and `team_size TEXT`. Spec describes one `team_size`. |
| `jobs` | Exists in schema + spec, no UI/API. |
| `analytics` | No public INSERT RLS policy (works only because service-role bypasses RLS). |
| `contacts`, `newsletter_subscribers` | No public INSERT RLS policy (same reason it works). |
| `settings` | No public SELECT RLS policy; `GET /api/settings` reads via service-role, so it works — but a "published" settings read policy is missing for a pure-RLS world. |
| `profiles` | Only SELECT policies (own + admin). No UPDATE policy for self-edit. |
| **Missing tables** | No `enrollments`, no `certificates`, no `lesson_progress`, no `saved_jobs`, no `user_roles` mapping table — needed for the learning/certificate side and "save jobs". |

Other schema notes:
- `set_admin_role()` sets `profiles.role = 'admin'` but never sets
  `app_metadata.role`, so the RLS `app_metadata.role='admin'` policies never match for
  admins who sign up normally. (Moot today because of service-role bypass, but it's a
  landmine if you ever switch to user-scoped clients.)
- `fix-trigger.sql` wraps both triggers in `EXCEPTION WHEN OTHERS THEN NULL`, which
  **silently swallows** profile-creation failures — masking errors rather than fixing
  them.
- `cleanup.sql` + the `fix-*.sql` files are one-shot migration scripts; they should be
  consolidated into versioned migrations so the live DB doesn't drift from the repo.

---

## 5. 🎯 Gap vs. your two-audience goal

**Audience 1 — "Hire a developer" (portfolio):** mostly present
(`/projects`, `/about`, `/achievements`, `/skills`, `/contact`, `/hire`, `/cv`,
testimonials, stats bar). Issues: `Download CV` links to `#` on About (no actual PDF
route → `/cv` exists but isn't linked there), and `/hire` uses a hardcoded WhatsApp
number fallback.

**Audience 2 — "Learn + free certificates":** **mostly missing.** Courses exist and
lessons/quiz UI exist, but there is no:
- enrollment / "my courses" persistence,
- lesson progress tracking,
- certificate issuance or verification,
- gating of premium content,
- student dashboard that reflects real progress.

The homepage has **no** learner entry point beyond the nav's "Courses" link — there is
no "Learn free / Get certified" CTA in the hero.

---

## 6. 🏷️ Branding (your main request)

The brand is currently `HamedProDev` / `HamedPro` in many hardcoded places, while
"Hamed Hussein" appears only as `hero_name`. To make the **site = "Hamed Hussein"** with
**"hamedprodev" only in the bio**, these need changing:

- `src/app/layout.tsx` — `metadata.title`, template, `siteName`, OG/Twitter titles.
- `src/lib/utils/seo.ts` — `SITE_NAME = 'HamedProDev'`, `creator: '@hamedProDev'`.
- `src/components/layout/Navbar.tsx` — logo text "Hamed**Pro**" (and `HP` badge).
- `src/components/layout/Footer.tsx` — logo + `settings.site_name || 'HamedProDev'` fallback.
- `src/app/(auth)/register/page.tsx` — "Join the HamedProDev community".
- `public/manifest.json` — `name`, `short_name`.
- `public/index.html` — `<title>HamedProDev</title>` + redirect target.
- `src/app/robots.ts` / `src/app/sitemap.ts` — fallback domains `hamedpro.rw` /
  `hamedprodev.vercel.app`.
- Config: `vercel.json`, `render.yaml`, `.env.example` — `NEXT_PUBLIC_SITE_NAME=HamedProDev`.
- Seed data: `src/app/api/seed/route.ts` settings `site_name: 'HamedProDev'`.
- `viewport themeColor` / `manifest theme_color` use `#6366f1` (indigo) — inconsistent
  with the brand blue `#3B82F6`.

---

## 7. 🧹 Code health / cleanup

- `next@14.2.18` is flagged by npm with a **known security advisory** (upgrade to a
  patched 14.2.x or 15.x). `eslint@8` is EOL. Many `@react-email/*@0.0.x` deprecated.
- Leftover multi-host scaffolding: `functions/` (Firebase Functions), `firestore.rules`,
  `storage.rules`, `firestore.indexes.json`, `.firebase/`, `render.yaml` Firebase env
  vars — all from an older Firebase/MongoDB stack; the app is Supabase now.
- `package.json` name is `"hamedpro"` and `functions/package.json` `"hamedpro-functions"`.
- `meilisearch.ts` references env vars (`MEILISEARCH_HOST`) that are absent from
  `.env.example` and unused by `/api/search`.

---

## 8. What I did NOT change

No code, SQL, or database was modified and **nothing was pushed**. This document + the
database plan are working-tree only.
