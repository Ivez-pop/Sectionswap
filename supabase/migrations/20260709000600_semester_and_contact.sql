-- Section Swap redesign: group sections by semester, let students share a
-- reveal-gated contact handle instead of their raw email.

-- ===========================================================================
-- sections.semester — which academic semester (3, 5, ...) a section belongs
-- to. Existing rows default to 3rd semester (today's only cohort); admins can
-- rename/re-tag or add new semesters as new batches arrive.
-- ===========================================================================
alter table public.sections
  add column if not exists semester smallint not null default 3;

alter table public.sections
  drop constraint if exists sections_name_key;

alter table public.sections
  add constraint sections_semester_name_key unique (semester, name);

-- ===========================================================================
-- profiles — optional contact handle revealed to matched students in the
-- section detail drawer, in place of raw email.
-- ===========================================================================
alter table public.profiles
  add column if not exists whatsapp_number text;

alter table public.profiles
  add column if not exists discord_handle text;
