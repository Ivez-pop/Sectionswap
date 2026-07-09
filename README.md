# KIIT Hub Community — Section Swap

A Next.js 16 app for KIIT students to browse interest communities and swap CSE
sections. Access is restricted to **@kiit.ac.in** Google accounts via Supabase
Auth. Sections, community links, and swap preferences are persisted in Supabase
Postgres with row-level security.

## Stack

- Next.js 16 (App Router, Server Components, Server Actions, Proxy)
- React 19, Tailwind CSS 4
- Supabase (Postgres + Auth) via `@supabase/ssr`

## Prerequisites

- Node.js 20+
- A Supabase project
- A Google OAuth client (configured in the Supabase dashboard)

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env.local` and fill in your project's values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API Keys (publishable). `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accepted as a fallback. |
| `NEXT_PUBLIC_SITE_URL` | Your deployed origin (optional in local dev) |

### 3. Database

Apply the migration in `supabase/migrations/` — it creates all tables, RLS
policies, the KIIT-domain signup trigger, the 2-"have" limit trigger, and seed
data (CSE 1–49 + the default community links).

```bash
# with the Supabase CLI (linked project)
supabase db push

# or paste supabase/migrations/20260709000000_init.sql into the SQL editor
```

### 4. Google OAuth (Supabase dashboard — manual, one time)

1. Create a Google OAuth client in the [Google Cloud Console](https://console.cloud.google.com/auth/clients).
2. Supabase → Authentication → Providers → **Google**: enable it and paste the
   Client ID and Client Secret.
3. Add the Supabase callback URL shown on that page to the Google client's
   **Authorized redirect URIs**.
4. Supabase → Authentication → URL Configuration: set the Site URL and add
   `http://localhost:3000/auth/callback` (and your production
   `/auth/callback`) to the redirect allow-list.

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000 and sign in with a KIIT Google account.

## Access control

- **Login domain** is enforced in two places: the OAuth callback
  (`src/app/auth/callback/route.ts`) signs out any non-`@kiit.ac.in` account,
  and the `handle_new_user` database trigger hard-blocks provisioning of a
  non-KIIT profile. Change the domain in `src/lib/auth/kiit.ts` **and**
  `app.allowed_email_domain()` in the migration if it ever needs to move.
- **Admin** access is the `profiles.is_admin` flag. Promote a user after their
  first login:

  ```sql
  update public.profiles set is_admin = true where email = 'someone@kiit.ac.in';
  ```

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
