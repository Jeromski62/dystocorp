-- Full power catalog (52 entries, seeded from 02-powers-catalog.md).
-- `types` is an array because some powers have compound targeting
-- (e.g. "Self Only or Touch", "Self Only or Out of Game (B)").
create table powers (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  activation_number int not null check (activation_number > 0),
  strain int not null check (strain >= 0),
  types text[] not null check (
    types <@ array['self_only', 'line_of_sight', 'touch', 'out_of_game_a', 'out_of_game_b']::text[]
    and cardinality(types) > 0
  ),
  full_text text not null,
  armour_interference boolean not null default false,
  created_at timestamptz not null default now()
);

alter table powers enable row level security;

-- 8 backgrounds. Stat modifiers are split into a fixed part (always applied) and
-- a choice part (player picks `choice_count` stats from `choice_options`, each
-- granting +1, per crew-creation rules) so the crew builder can validate the
-- choice generically instead of hardcoding 8 special cases.
create table backgrounds (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  flavor_text text not null,
  fixed_stat_mods jsonb not null default '{}'::jsonb,
  choice_stat_count int not null check (choice_stat_count > 0),
  choice_stat_options text[] not null check (
    choice_stat_options <@ array['move', 'fight', 'shoot', 'health']::text[]
  ),
  created_at timestamptz not null default now()
);

alter table backgrounds enable row level security;

create table background_core_powers (
  background_id uuid not null references backgrounds (id) on delete cascade,
  power_id uuid not null references powers (id) on delete restrict,
  primary key (background_id, power_id)
);

alter table background_core_powers enable row level security;
