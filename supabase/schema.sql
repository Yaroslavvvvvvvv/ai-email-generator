-- AI Email Generator — database schema.
--
-- Design rule: the browser never writes. Reads are guarded by row level
-- security so a user only ever sees their own rows; every write goes through a
-- Nitro route using the secret key, which is what makes the daily counter
-- something the user cannot talk their way around.

-- ---------------------------------------------------------------- profiles --

create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  is_premium  boolean     not null default false,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

-- No insert/update/delete policies on purpose: is_premium is a server decision.

-- A profile row must exist the moment the account does, otherwise the first
-- dashboard load races the first write.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------- generations --

create table if not exists public.generations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users on delete cascade,
  topic       text        not null,
  tone        text        not null,
  length      text        not null,
  locale      text        not null,
  subject     text        not null,
  body        text        not null,
  provider    text        not null default 'mock',
  created_at  timestamptz not null default now()
);

alter table public.generations enable row level security;

drop policy if exists "generations: read own" on public.generations;
create policy "generations: read own"
  on public.generations for select
  using (auth.uid() = user_id);

drop policy if exists "generations: delete own" on public.generations;
create policy "generations: delete own"
  on public.generations for delete
  using (auth.uid() = user_id);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

-- -------------------------------------------------------------- usage_days --

-- Kept apart from `generations` deliberately: deleting an email from history
-- must not hand back a generation the user already spent.
create table if not exists public.usage_days (
  user_id  uuid    not null references auth.users on delete cascade,
  day      date    not null,
  count    integer not null default 0,
  primary key (user_id, day)
);

alter table public.usage_days enable row level security;

drop policy if exists "usage_days: read own" on public.usage_days;
create policy "usage_days: read own"
  on public.usage_days for select
  using (auth.uid() = user_id);

-- Checking the limit and spending it have to be one statement, or two requests
-- sent at the same moment both pass the check.
create or replace function public.consume_generation(p_user uuid, p_limit integer)
returns table (allowed boolean, used integer, day_limit integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_premium boolean;
  v_count   integer;
  v_day     date := (now() at time zone 'utc')::date;
begin
  select is_premium into v_premium from profiles where id = p_user;

  if coalesce(v_premium, false) then
    insert into usage_days (user_id, day, count)
    values (p_user, v_day, 1)
    on conflict (user_id, day) do update set count = usage_days.count + 1
    returning usage_days.count into v_count;

    return query select true, v_count, null::integer;
  end if;

  insert into usage_days (user_id, day, count)
  values (p_user, v_day, 1)
  on conflict (user_id, day) do update
    set count = usage_days.count + 1
    where usage_days.count < p_limit
  returning usage_days.count into v_count;

  if v_count is null then
    select count into v_count from usage_days where user_id = p_user and day = v_day;
    return query select false, coalesce(v_count, p_limit), p_limit;
  end if;

  return query select true, v_count, p_limit;
end;
$$;

revoke all on function public.consume_generation(uuid, integer) from anon, authenticated;
