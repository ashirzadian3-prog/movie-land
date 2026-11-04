-- Movie Land: admin panel setup for Supabase (Postgres)
-- Run AFTER docs/schema.sql: Supabase dashboard -> SQL Editor -> New query.
-- Safe to run more than once.

-- ---------------------------------------------------------------
-- 1. Articles: publish status + updated_at
-- ---------------------------------------------------------------
alter table public.articles add column if not exists status text not null default 'published';
alter table public.articles add column if not exists updated_at timestamptz;

alter table public.articles drop constraint if exists articles_status_check;
alter table public.articles
  add constraint articles_status_check check (status in ('published', 'draft', 'pending'));

-- ---------------------------------------------------------------
-- 2. Profiles (one row per auth user, holds the role)
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Create a profile automatically for every new sign-up (always role = 'user').
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for accounts that already exist.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- Helper used by the policies below. SECURITY DEFINER avoids RLS recursion on profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- No update/insert/delete policies on purpose: roles can only be changed from
-- the Supabase dashboard (Table Editor) or the SQL editor.

-- ---------------------------------------------------------------
-- 3. Articles policies (replaces the open policies from schema.sql)
-- ---------------------------------------------------------------
drop policy if exists "Public read access" on public.articles;
drop policy if exists "Public insert access" on public.articles;
drop policy if exists "Read published articles" on public.articles;
drop policy if exists "Submit pending articles" on public.articles;
drop policy if exists "Admins manage articles" on public.articles;

-- Visitors only see published articles; admins see everything.
create policy "Read published articles"
  on public.articles for select
  using (status = 'published' or public.is_admin());

-- The public contact form may only create articles waiting for review.
create policy "Submit pending articles"
  on public.articles for insert
  with check (status = 'pending');

create policy "Admins manage articles"
  on public.articles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------
-- 4. Comments
-- ---------------------------------------------------------------
create table if not exists public.comments (
  id         bigint generated always as identity primary key,
  article_id text references public.articles (id) on delete cascade,
  user_id    uuid references auth.users (id) on delete set null,
  content    text not null,
  status     text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

drop policy if exists "Read approved comments" on public.comments;
create policy "Read approved comments"
  on public.comments for select
  using (status = 'approved' or public.is_admin());

drop policy if exists "Signed-in users add comments" on public.comments;
create policy "Signed-in users add comments"
  on public.comments for insert
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Admins manage comments" on public.comments;
create policy "Admins manage comments"
  on public.comments for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------
-- 5. Featured movies and series (TMDB)
-- ---------------------------------------------------------------
create table if not exists public.featured_media (
  id           bigint generated always as identity primary key,
  tmdb_id      integer not null,
  media_type   text not null check (media_type in ('movie', 'tv')),
  title        text not null,
  poster_path  text,
  overview     text,
  vote_average numeric(3, 1) not null default 0,
  release_date text,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  unique (tmdb_id, media_type)
);

alter table public.featured_media enable row level security;

drop policy if exists "Public read featured media" on public.featured_media;
create policy "Public read featured media"
  on public.featured_media for select
  using (true);

drop policy if exists "Admins manage featured media" on public.featured_media;
create policy "Admins manage featured media"
  on public.featured_media for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------
-- 6. Make yourself an admin (run once, after creating your user in
--    Authentication -> Users). Replace the e-mail with yours:
-- ---------------------------------------------------------------
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
