-- Portfolio Builder — database schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query) once
-- you've created your Supabase project. Safe to re-run: every statement is
-- idempotent, so if you already ran an older version of this file, just run
-- the whole thing again to pick up new columns/tables.

-- 1. Profiles table: one row per user, holds every section of their portfolio.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null check (username ~ '^[a-z0-9-]{3,30}$'),

  -- Hero section
  full_name text not null default '',
  pronouns text default '',
  role_title text default '',
  tagline text default '',
  bio text default '',
  skills text[] not null default '{}',
  typewriter_phrases text[] not null default '{}',
  photo_url text,
  resume_url text,

  -- Mid section
  about text default '',
  experience jsonb not null default '[]',   -- [{title, company, start_date, end_date, description}]
  projects jsonb not null default '[]',     -- [{title, description, tags, image_url, link, github_url}]
  education jsonb not null default '[]',    -- [{school, degree, start_date, end_date}]
  certificates jsonb not null default '[]', -- [{name, issuer, date, link, image_url}]
  skill_groups jsonb not null default '[]', -- [{category, items: [string]}]

  -- Footer / contact section
  contact_email text default '',
  social_links jsonb not null default '{}', -- {linkedin, github, twitter, website}

  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migration: add columns introduced after the initial release, in case this
-- table already existed from an earlier version of this schema.
alter table public.profiles add column if not exists typewriter_phrases text[] not null default '{}';
alter table public.profiles add column if not exists resume_url text;
alter table public.profiles add column if not exists skill_groups jsonb not null default '[]';

-- Keep updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 2. Row Level Security — profiles
alter table public.profiles enable row level security;

drop policy if exists "Published profiles are publicly viewable" on public.profiles;
create policy "Published profiles are publicly viewable"
  on public.profiles for select
  using (published = true or auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can delete their own profile" on public.profiles;
create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- 3. Contact messages — visitors on a public page can send a message to
-- that profile's owner; only the owner can read/manage their own inbox.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "Anyone can send a message" on public.messages;
create policy "Anyone can send a message"
  on public.messages for insert
  with check (true);

drop policy if exists "Owners can view their messages" on public.messages;
create policy "Owners can view their messages"
  on public.messages for select
  using (auth.uid() = profile_id);

drop policy if exists "Owners can update their messages" on public.messages;
create policy "Owners can update their messages"
  on public.messages for update
  using (auth.uid() = profile_id);

drop policy if exists "Owners can delete their messages" on public.messages;
create policy "Owners can delete their messages"
  on public.messages for delete
  using (auth.uid() = profile_id);

-- 4. Storage bucket for profile photos
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Storage bucket for resumes (PDFs)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

drop policy if exists "Resumes are publicly accessible" on storage.objects;
create policy "Resumes are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'resumes');

drop policy if exists "Users can upload their own resume" on storage.objects;
create policy "Users can upload their own resume"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their own resume" on storage.objects;
create policy "Users can update their own resume"
  on storage.objects for update
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their own resume" on storage.objects;
create policy "Users can delete their own resume"
  on storage.objects for delete
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 6. Storage bucket for certificate cover images
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

drop policy if exists "Certificate images are publicly accessible" on storage.objects;
create policy "Certificate images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'certificates');

drop policy if exists "Users can upload their own certificate images" on storage.objects;
create policy "Users can upload their own certificate images"
  on storage.objects for insert
  with check (
    bucket_id = 'certificates'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their own certificate images" on storage.objects;
create policy "Users can update their own certificate images"
  on storage.objects for update
  using (
    bucket_id = 'certificates'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their own certificate images" on storage.objects;
create policy "Users can delete their own certificate images"
  on storage.objects for delete
  using (
    bucket_id = 'certificates'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
