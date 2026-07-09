-- Harden the SECURITY DEFINER surface flagged by `supabase db advisors`:
--   * lock search_path on app.allowed_email_domain (0011)
--   * move is_admin() into the non-exposed `app` schema so it is NOT reachable
--     as a PostgREST RPC (0028/0029); repoint the admin policies + guard trigger
--   * revoke EXECUTE on the trigger-only functions — triggers run as their
--     definer, so revoking does not affect them, but it removes the RPC surface

-- 1. Domain helper: immutable + locked search_path, internal use only.
create or replace function app.allowed_email_domain()
returns text language sql immutable set search_path = ''
as $$ select 'kiit.ac.in'::text $$;

revoke all on function app.allowed_email_domain() from public, anon, authenticated;

-- 2. is_admin() -> app schema (app is not exposed via the Data API, so this is
--    no longer callable as /rest/v1/rpc/is_admin). Policies use it in the
--    authenticated role's context, so authenticated keeps EXECUTE.
create or replace function app.is_admin()
returns boolean language sql security definer set search_path = '' stable
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = (select auth.uid())),
    false
  );
$$;

revoke all on function app.is_admin() from public, anon;
grant execute on function app.is_admin() to authenticated;

-- Repoint the admin policies from public.is_admin() to app.is_admin().
drop policy "sections_insert_admin" on public.sections;
create policy "sections_insert_admin" on public.sections
  for insert to authenticated with check (app.is_admin());

drop policy "sections_update_admin" on public.sections;
create policy "sections_update_admin" on public.sections
  for update to authenticated using (app.is_admin()) with check (app.is_admin());

drop policy "sections_delete_admin" on public.sections;
create policy "sections_delete_admin" on public.sections
  for delete to authenticated using (app.is_admin());

drop policy "community_links_insert_admin" on public.community_links;
create policy "community_links_insert_admin" on public.community_links
  for insert to authenticated with check (app.is_admin());

drop policy "community_links_update_admin" on public.community_links;
create policy "community_links_update_admin" on public.community_links
  for update to authenticated using (app.is_admin()) with check (app.is_admin());

drop policy "community_links_delete_admin" on public.community_links;
create policy "community_links_delete_admin" on public.community_links
  for delete to authenticated using (app.is_admin());

-- Repoint the admin-flag guard trigger to app.is_admin().
create or replace function public.guard_profile_admin_flag()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.is_admin is distinct from old.is_admin and not app.is_admin() then
    raise exception 'Only an admin may change is_admin';
  end if;
  return new;
end;
$$;

-- Retire the now-unused, Data-API-exposed public.is_admin().
drop function if exists public.is_admin();

-- 3. Trigger-only functions: never meant to be called directly as RPC.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.guard_profile_admin_flag() from public, anon, authenticated;
revoke all on function public.enforce_have_limit() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
