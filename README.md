# Portfolio Builder

Sign up, fill in your details (photo, hero section, about, experience,
projects, education, certificates, contact) and get a published portfolio
page at `/your-username` — one shared template, personalized per user.

## Stack

- **Next.js** (App Router) + **Tailwind CSS**
- **Supabase** — auth, Postgres database, file storage (avatars)

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql)
   — it creates the `profiles` table, row-level security policies, and the
   `avatars` storage bucket.
3. Copy `.env.local.example` to `.env.local` and fill in your project's URL
   and anon key (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

4. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## How it works

- `/` — marketing landing page
- `/signup`, `/login` — Supabase email/password auth
- `/dashboard` — protected editor; fills in every section of the template
  and saves to the `profiles` table (+ uploads photo to Supabase Storage)
- `/[username]` — public, published portfolio page rendering the shared
  template with that user's saved data
