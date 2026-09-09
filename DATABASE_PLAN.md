# Database Plan — Hamed Hussein

> **Status: push authorized (2026-09-08); SQL prepared but NOT yet applied to the
> live database.** The code and one combined migration are now committed and
> pushed. Applying the schema still requires (1) the real `SUPABASE_SERVICE_ROLE_KEY`
> (currently a placeholder — it was rotated out of the repo) and (2) network egress
> to `*.supabase.co`, which the sandbox blocks. This doc documents the intended
> schema changes to support (1) the hiring/portfolio audience and (2) the
> students-learn-and-get-free-certificates audience, plus fixes for the
> inconsistencies found in `ANALYSIS.md`.
>
> **One-file setup:** `supabase/apply-2026-09-08.sql` is the full, idempotent
> migration (base schema + learning/certificate tables). Paste it in Supabase
> Dashboard → SQL Editor → Run.

---

## 0. Decisions locked in (from your answers)

| Decision | Choice |
|---|---|
| Branding | Site/logo/titles = **"Hamed Hussein"** everywhere; **"hamedprodev"** appears only in the About bio (lowercase handle). |
| Homepage | **Split hero** with two CTAs: "Hire Me" and "Learn Free / Get Certified". |
| Certificates | **Plan + build** the full flow: enrollment → progress → verifiable certificate. |
| Design | Pending — the `index.html` + `style.css` you referenced are **not in the repo** (see end of this doc). |
| Backend | Keep **Supabase (Postgres)**. Remove Mongo/Firebase leftovers. |

---

## 1. Current schema → target schema

### 1.1 Content tables (already exist — keep)
`projects`, `courses`, `lessons`, `blog_posts`, `skills`, `achievements`,
`organizations`, `testimonials`, `jobs`, `site_stats`, `profiles`, `contacts`,
`newsletter_subscribers`, `settings`, `analytics`.

### 1.2 New tables (needed for the learning/certificate side)

**`enrollments`** — a user's enrollment in a course.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid NOT NULL → profiles.id | CASCADE |
| course_id | uuid NOT NULL → courses.id | CASCADE |
| status | text `'active' \| 'completed' \| 'dropped'` | default `'active'` |
| progress | int 0–100 | default 0 |
| enrolled_at | timestamptz | default now() |
| completed_at | timestamptz | null until done |
| **UNIQUE(user_id, course_id)** | | one enrollment per user per course |

**`lesson_progress`** — per-lesson completion + quiz score.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid NOT NULL → profiles.id | CASCADE |
| course_id | uuid NOT NULL → courses.id | CASCADE (denormalized for fast course % calc) |
| lesson_id | uuid NOT NULL → lessons.id | CASCADE |
| completed | boolean | default false |
| quiz_score | int 0–100 | null if not quiz |
| last_accessed_at | timestamptz | |
| completed_at | timestamptz | |
| **UNIQUE(user_id, lesson_id)** | | |

**`certificates`** — issued, publicly verifiable certificates.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| certificate_number | text UNIQUE NOT NULL | e.g. `HH-2026-A1B2C3D4` |
| user_id | uuid NOT NULL → profiles.id | |
| course_id | uuid NOT NULL → courses.id | |
| enrollment_id | uuid → enrollments.id | |
| recipient_name | text | snapshot (survives rename) |
| course_title | text | snapshot |
| score | numeric(5,2) | avg quiz score, nullable |
| issue_date | date | default current_date |
| is_verified | boolean | default true |
| created_at | timestamptz | |

**`saved_jobs`** — bookmark jobs (spec: "Save jobs").
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid NOT NULL → profiles.id | |
| job_id | uuid NOT NULL → jobs.id | CASCADE |
| created_at | timestamptz | |
| **UNIQUE(user_id, job_id)** | | |

### 1.3 Schema fixes (consolidate `fix-*.sql` into one migration)

1. **`blog_posts.tags` type conflict** — `schema.sql` says `TEXT[]`, `fix-missing-columns.sql`
   says `JSONB`. **Standardize on JSONB** (matches the admin form's JSON array).
2. **RLS is currently decorative** — everything uses the service-role client, and the
   admin policies check `app_metadata.role` while the trigger sets `profiles.role`.
   Fix by adding a `public.is_admin()` SECURITY DEFINER function and rewriting admin
   policies to use it, **and** by setting `app_metadata.role` in `set_admin_role()`.
   (This keeps RLS *correct* if you later switch to user-scoped clients.)
3. **Add missing public policies** so RLS actually governs the public surface:
   - `settings` → anonymous SELECT (site name, tagline, hero, socials).
   - `contacts`, `newsletter_subscribers`, `analytics` → anonymous INSERT.
4. **`set_admin_role()` / `handle_new_user()`** — replace the
   `EXCEPTION WHEN OTHERS THEN NULL` swallow-all with real error handling and add
   `app_metadata.role` update.
5. Add `updated_at` + trigger to tables that lack it where the CMS edits them
   (`skills`, `achievements`, `testimonials`, `site_stats`).

---

## 2. Data flow for the two audiences

### Hiring audience (portfolio)
Public visitors → `projects`, `skills`, `achievements`, `organizations`,
`testimonials`, `site_stats` (read), `contacts` (write), `/hire`.
→ **No schema change needed** beyond the fixes in §1.3.

### Learning audience (free courses + certificates)
```
register → profiles (handle_new_user)
enroll   → enrollments(user_id, course_id, status='active')
study    → lesson_progress rows per lesson (completed + quiz_score)
finish   → enrollment.progress = 100, status='completed', completed_at = now()
issue    → certificates(certificate_number, recipient_name, course_title, score)
verify   → public GET /verify/[certificate_number] (checks certificates.is_verified)
```
Issuance is done **at the API layer** (`POST /api/enrollments/complete` or on progress
== 100) — simpler and testable than a DB trigger; the certificate row is the source of
truth for the public verification page.

---

## 3. Proposed new API endpoints (build phase)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/enrollments` | POST | Enroll current user (idempotent) |
| `/api/enrollments/me` | GET | List my enrollments (replaces `enrolledCourses` on `/api/users/me`) |
| `/api/enrollments/[id]/progress` | POST | Mark lesson done / record quiz score |
| `/api/enrollments/[id]/complete` | POST | Finalize + issue certificate |
| `/api/certificates/me` | GET | My certificates |
| `/api/certificates/[number]` | GET | Public certificate lookup/verification |
| `/api/saved-jobs` | GET/POST/DELETE | Save/unsave jobs |
| `/api/users/me` | PUT | **Add** — fix self-serve profile editing (currently 405) |

---

## 4. Migration strategy

The repo currently has flat SQL files (`supabase/*.sql`), not the Supabase Migrations
CLI. Proposal:

```
supabase/
  migrations/
    0001_base_schema.sql        (copy of schema.sql, consolidated)
    0002_schema_fixes.sql       (tags type, is_admin(), public policies)
    0003_learning.sql           (enrollments, lesson_progress, certificates, saved_jobs)
    0004_branding_seed.sql      (site_name = 'Hamed Hussein'; bio includes 'hamedprodev')
```

The proposed SQL lives in **`supabase/plan/2026-09-08_learning_and_fixes.sql`**
(review it before applying in Supabase Dashboard → SQL Editor). It is idempotent
(`IF NOT EXISTS` / `DROP POLICY IF EXISTS`).

---

## 5. Rollout order (recommended)

1. **Rotate secrets first** (Supabase service-role key, MongoDB Atlas password) and
   remove the leaks (`ANALYSIS.md` §2).
2. Apply schema fixes + new tables (idempotent SQL).
3. Fix broken routes: `/api/users/me` PUT, newsletter unsubscribe, `my-courses` links,
   middleware protection.
4. Rebrand to "Hamed Hussein" (keep "hamedprodev" in bio).
5. Build learning flow (enroll → progress → certificate → verify) + split-hero homepage.
6. Apply the new design once `index.html` + `style.css` are provided.

---

## 6. Blocked item — the design files

Your answer said: *"Read the index.html and style.css that I provided…"*. I searched
the whole workspace — **those files are not here**:

- The only `index.html` is `public/index.html`, which is a 3-line redirect stub to
  `hamedprodev.vercel.app` (no styling).
- There is **no `style.css`** anywhere in the repo or workspace.

➡️ **Please attach/upload `index.html` and `style.css`** (or paste their contents in
chat), and I'll use them as the visual reference for the whole site. I cannot view the
screenshots in `public/images/*.png`, so the actual HTML/CSS is the right source.
