-- Add display_order column to public.community_links
alter table public.community_links add column if not exists display_order integer not null default 0;

-- Populate display_order sequentially for existing links based on their current IDs
with ordered_links as (
  select id, row_number() over (order by id) as seq
  from public.community_links
)
update public.community_links c
set display_order = o.seq
from ordered_links o
where c.id = o.id;
