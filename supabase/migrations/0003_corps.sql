-- Mega Corp catalog. Purely cosmetic (name/lore/color) per DystoCorp house rules --
-- never joined against Stargrave rule tables, never affects stats/powers/gear.
-- Extensible: new sectors (energy, telecom, transport, entertainment, finance) are
-- just new rows, no schema change needed.
create table corps (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  sector text not null,
  lore_markdown text not null,
  color_theme jsonb not null default '{}'::jsonb,
  emblem_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table corps enable row level security;
