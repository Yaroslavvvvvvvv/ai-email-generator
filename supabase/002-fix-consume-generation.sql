-- Fix: `return query` appends rows without leaving the function, so the
-- premium branch fell through into the free branch (spending a generation
-- twice) and a refused request returned both a refusal and an approval.
--
-- Run this on a database created before the fix. schema.sql already has it.

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
    -- `return query` appends rows, it does not leave the function. Without
    -- this the premium branch falls through and spends the generation twice.
    return;
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
    return;
  end if;

  return query select true, v_count, p_limit;
end;
$$;
