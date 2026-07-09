-- Clean admin bootstrap: remove email allowlist & postgres bypass.
--
-- After this migration:
--   1. handle_new_user() — no longer auto-promotes any email to admin.
--   2. guard_profile_admin_flag() — ONLY the zero-admin bootstrap path remains:
--      If zero admin profiles exist, any authenticated user can set is_admin = true.
--      Once at least one admin exists, this path locks permanently.
--   3. The session_user = 'postgres' bypass is removed.
--      Use the zero-admin bootstrap path instead (sign up first, then promote).
--   4. This migration supersedes 20260709000300_admin_allowlist.sql (deleted).

-- ===========================================================================
-- 1. handle_new_user — remove admin allowlist, clean up.
-- ===========================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  domain text := lower(split_part(coalesce(new.email, ''), '@', 2));
begin
  if domain <> app.allowed_email_domain() then
    raise exception 'Only @% email addresses may sign up (got %)',
      app.allowed_email_domain(), coalesce(new.email, '(none)')
      using errcode = 'check_violation';
  end if;

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- ===========================================================================
-- 2. guard_profile_admin_flag — keep only the zero-admin bootstrap.
-- ===========================================================================
create or replace function public.guard_profile_admin_flag()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.is_admin is distinct from old.is_admin and not app.is_admin() then
    if not exists (select 1 from public.profiles where is_admin = true) then
      return new;
    end if;
    raise exception 'Only an admin may change is_admin';
  end if;
  return new;
end;
$$;