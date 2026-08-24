-- Portfolio Builder — database schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query) once
-- you've created your Supabase project.

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
  photo_url text,

  -- Mid section
  about text default '',
  experience jsonb not null default '[]',   -- [{title, company, start_date, end_date, description}]
  projects jsonb not null default '[]',     -- [{title, description, link, image_url}]
  education jsonb not null default '[]',    -- [{school, degree, start_date, end_date}]
  certificates jsonb not null default '[]', -- [{name, issuer, date, link}]

  -- Footer / contact section
  contact_email text default '',
  social_links jsonb not null default '{}', -- {linkedin, github, twitter, website}

  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- 2. Row Level Security
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

-- 3. Storage bucket for profile photos
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
