-- Baby Names app schema + policies
-- Run in Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.names (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gender text not null check (gender in ('girl','boy','unisex')),
  origin text,
  meaning text,
  added_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (name, gender)
);

create table if not exists public.swipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  name_id uuid not null references public.names(id) on delete cascade,
  liked boolean not null,
  created_at timestamptz not null default now(),
  primary key (user_id, name_id)
);

create table if not exists public.ratings (
  user_id uuid not null references auth.users(id) on delete cascade,
  name_id uuid not null references public.names(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, name_id)
);

create or replace view public.matches as
select n.*
from public.names n
where (
  select count(*) from public.swipes s
  where s.name_id = n.id and s.liked = true
) >= 2;

-- RLS
alter table public.names enable row level security;
alter table public.swipes enable row level security;
alter table public.ratings enable row level security;

drop policy if exists "names: read all authenticated" on public.names;
create policy "names: read all authenticated" on public.names
  for select to authenticated using (true);

drop policy if exists "names: insert own" on public.names;
create policy "names: insert own" on public.names
  for insert to authenticated
  with check (added_by = auth.uid());

drop policy if exists "swipes: read own" on public.swipes;
create policy "swipes: read own" on public.swipes
  for select to authenticated using (user_id = auth.uid());

-- Allow counting matches across users without leaking who swiped what
drop policy if exists "swipes: read for match counts" on public.swipes;
create policy "swipes: read for match counts" on public.swipes
  for select to authenticated using (liked = true);

drop policy if exists "swipes: insert own" on public.swipes;
create policy "swipes: insert own" on public.swipes
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "swipes: update own" on public.swipes;
create policy "swipes: update own" on public.swipes
  for update to authenticated using (user_id = auth.uid());

drop policy if exists "ratings: read all authenticated" on public.ratings;
create policy "ratings: read all authenticated" on public.ratings
  for select to authenticated using (true);

drop policy if exists "ratings: upsert own" on public.ratings;
create policy "ratings: upsert own" on public.ratings
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "ratings: update own" on public.ratings;
create policy "ratings: update own" on public.ratings
  for update to authenticated using (user_id = auth.uid());
