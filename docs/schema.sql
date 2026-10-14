-- Movie Land: database schema for Supabase (Postgres)
-- Run this in the Supabase dashboard: SQL Editor -> New query.
-- The columns below match what the app reads and writes (see tiDolist/src).

create table if not exists public.articles (
  id          text primary key,            -- the app generates ids with Date.now()
  image       text,                        -- cover image URL
  title       text not null,
  date        text,                        -- publish date, stored as entered
  readingtime text,                        -- e.g. "5" or "5 دقیقه"
  author      text,
  textarea    text,                        -- article body
  category    text,                        -- تحلیل | بررسی | نقد | مقاله
  views       integer not null default 0
);

-- Row Level Security
alter table public.articles enable row level security;

-- Anyone can read articles.
drop policy if exists "Public read access" on public.articles;
create policy "Public read access"
  on public.articles for select
  using (true);

-- Anyone can submit an article (the contact page publishes without login).
-- Tighten this once authentication is added.
drop policy if exists "Public insert access" on public.articles;
create policy "Public insert access"
  on public.articles for insert
  with check (true);
