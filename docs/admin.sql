-- Movie Land: admin panel setup for Supabase.
-- Run AFTER docs/schema.sql, in the Supabase dashboard: SQL Editor -> New query.

-- 1) Table of admin users (references Supabase Auth users).
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admins enable row level security;

-- A signed-in user may only see their own row (used by the panel to check access).
drop policy if exists "Admins can read own row" on public.admins;
create policy "Admins can read own row"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- 2) Helper used by the article policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 3) Only admins can edit or delete articles.
drop policy if exists "Admins can update articles" on public.articles;
create policy "Admins can update articles"
  on public.articles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete articles" on public.articles;
create policy "Admins can delete articles"
  on public.articles for delete
  to authenticated
  using (public.is_admin());

-- 4) Make yourself an admin:
--    a) Supabase dashboard -> Authentication -> Users -> Add user (email + password).
--    b) Then run this with your email:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'you@example.com';
