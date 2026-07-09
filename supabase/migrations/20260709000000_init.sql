-- Section Swap — initial schema, RLS, KIIT-domain enforcement, and seed data.
--
-- Design notes:
--   * Every table lives in the `public` schema and has RLS enabled.
--   * All read/write policies target `TO authenticated` and combine the role
--     check with an ownership / role predicate (no BOLA/IDOR).
--   * The whole app is behind Google OAuth restricted to @kiit.ac.in, so any
--     authenticated user is a verified KIIT member; directory-style reads
--     (sections, community links, other students' preferences) are therefore
--     granted to `authenticated` as a whole, while writes are scoped.
--
-- Objects are created in dependency order: tables a function reads must exist
-- before the function, and a function a policy calls must exist before the
-- policy.

-- ===========================================================================
-- Allowed login domain — single source of truth, referenced by the signup
-- trigger. SECURITY DEFINER functions run with search_path='' so it is always
-- called fully-qualified as app.allowed_email_domain().
-- ===========================================================================
create schema if not exists app;

create or replace function app.allowed_email_domain()
returns text language sql immutable
as $$ select 'kiit.ac.in'::text $$;

grant usage on schema app to authenticated, anon;
grant execute on function app.allowed_email_domain() to authenticated, anon;

-- ===========================================================================
-- profiles  (1:1 with auth.users)
-- ===========================================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Any authenticated (KIIT) user may read profiles — needed to show who
-- has/needs a section in the People modal.
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- A user may update only their own profile. A self-service escalation of the
-- is_admin flag is blocked by guard_profiles_admin below.
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No client INSERT/DELETE policy: rows are created by the signup trigger and
-- removed via the auth.users cascade only.

-- ===========================================================================
-- is_admin()  — used by table policies below.
-- SECURITY DEFINER so it can read profiles.is_admin without recursing through
-- profiles' own RLS. Locked search_path; reads a single boolean.
-- ===========================================================================
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = '' stable
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = (select auth.uid())),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ===========================================================================
-- sections
-- ===========================================================================
create table public.sections (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  sort_order  integer,
  created_at  timestamptz not null default now()
);

alter table public.sections enable row level security;

create policy "sections_select_authenticated"
  on public.sections for select to authenticated using (true);

create policy "sections_insert_admin"
  on public.sections for insert to authenticated with check (public.is_admin());

create policy "sections_update_admin"
  on public.sections for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "sections_delete_admin"
  on public.sections for delete to authenticated using (public.is_admin());

-- ===========================================================================
-- community_links
-- ===========================================================================
create table public.community_links (
  id           bigint generated always as identity primary key,
  name         text not null,
  platform     text not null check (platform in ('WhatsApp', 'Discord')),
  url          text not null,
  visible      boolean not null default true,
  category     text not null check (category in ('General', 'Section Swap')),
  description  text,
  created_at   timestamptz not null default now()
);

alter table public.community_links enable row level security;

create policy "community_links_select_authenticated"
  on public.community_links for select to authenticated using (true);

create policy "community_links_insert_admin"
  on public.community_links for insert to authenticated with check (public.is_admin());

create policy "community_links_update_admin"
  on public.community_links for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "community_links_delete_admin"
  on public.community_links for delete to authenticated using (public.is_admin());

-- ===========================================================================
-- swap_preferences  (one row per user per section)
-- ===========================================================================
create table public.swap_preferences (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  section_id  bigint not null references public.sections (id) on delete cascade,
  preference  text not null check (preference in ('have', 'need')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, section_id)
);

create index swap_preferences_section_idx on public.swap_preferences (section_id);
create index swap_preferences_user_idx on public.swap_preferences (user_id);

alter table public.swap_preferences enable row level security;

-- Authenticated users can read all preferences (People modal aggregation).
create policy "swap_preferences_select_authenticated"
  on public.swap_preferences for select to authenticated using (true);

-- Users manage only their own preference rows.
create policy "swap_preferences_insert_own"
  on public.swap_preferences for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "swap_preferences_update_own"
  on public.swap_preferences for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "swap_preferences_delete_own"
  on public.swap_preferences for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ===========================================================================
-- KIIT-domain enforcement + profile provisioning on signup.
-- AFTER INSERT on auth.users, inside the signup transaction: a non-KIIT email
-- raises, rolling back user creation (hard DB-level gate). The app also
-- verifies the domain in the OAuth callback for a clean UX.
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent a non-admin from granting themselves admin via a profile update.
create or replace function public.guard_profile_admin_flag()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.is_admin is distinct from old.is_admin and not public.is_admin() then
    raise exception 'Only an admin may change is_admin';
  end if;
  return new;
end;
$$;

create trigger guard_profiles_admin
  before update on public.profiles
  for each row execute function public.guard_profile_admin_flag();

-- At most two 'have' preferences per user.
create or replace function public.enforce_have_limit()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  have_count integer;
begin
  if new.preference <> 'have' then
    return new;
  end if;

  select count(*) into have_count
  from public.swap_preferences
  where user_id = new.user_id
    and preference = 'have'
    and id is distinct from new.id;

  if have_count >= 2 then
    raise exception 'A user may mark at most 2 sections as "have"'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger enforce_have_limit_trg
  before insert or update on public.swap_preferences
  for each row execute function public.enforce_have_limit();

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger swap_preferences_touch
  before update on public.swap_preferences
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- Seed data
-- ===========================================================================
insert into public.sections (name, sort_order)
select format('CSE %s', g), g
from generate_series(1, 49) as g
on conflict (name) do nothing;

insert into public.community_links (name, platform, url, visible, category, description) values
  ('Section Swap Group', 'WhatsApp', 'https://chat.whatsapp.com/Gwq8MfQhkqCBlaj179pLQZ?s=cl&p=a&ilr=0', true, 'Section Swap', 'Stay updated with section swaps, announcements, important notices, and connect directly with fellow KIIT students.'),
  ('Coding Community', 'Discord', 'https://discord.gg/coding-kiit', true, 'General', 'Discuss coding questions, competitive programming, project ideas, hackathons, and collaborate on development projects.'),
  ('Animeholics', 'WhatsApp', 'https://chat.whatsapp.com/anime-kiit', true, 'General', 'Connect with fellow anime lovers, discuss latest manga chapters, anime releases, and share art.'),
  ('Cinephiles', 'WhatsApp', 'https://chat.whatsapp.com/cinephiles-kiit', true, 'General', 'A hub for movie buffs to discuss cinematography, latest blockbusters, classics, reviews, and watch parties.'),
  ('Gaming Community', 'Discord', 'https://discord.gg/gaming-kiit', true, 'General', 'Find players for PC, console, or mobile games, coordinate esports squads, and discuss gaming hardware.'),
  ('Startup Community', 'WhatsApp', 'https://chat.whatsapp.com/startup-kiit', true, 'General', 'Share pitch decks, brainstorm startup ideas, discuss funding pathways, incubation, and find co-founders.'),
  ('Photography Club', 'WhatsApp', 'https://chat.whatsapp.com/photography-kiit', true, 'General', 'Share shots, critique compositions, organize photo walks, and share tips about camera gear and editing tools.')
on conflict do nothing;
