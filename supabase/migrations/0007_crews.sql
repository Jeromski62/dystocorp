-- A crew belongs to exactly one campaign and one owning player (one crew per
-- player per campaign). Corp choice is cosmetic only (see 0003_corps.sql).
create table crews (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  corp_id uuid not null references corps (id),
  name text not null default 'Unnamed Crew',
  experience int not null default 0,
  credits int not null default 400, -- may go negative: captains can go into debt (08-campaigns.md)
  ship_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, player_id)
);

alter table crews enable row level security;
create index crews_campaign_id_idx on crews (campaign_id);

create trigger crews_set_updated_at
  before update on crews
  for each row execute procedure set_updated_at();

-- Captain and First Mate are modelled as separate 1:1 tables (not a shared
-- polymorphic "figure" table) because their power/gear slot counts and
-- activation-number formulas genuinely differ (see 01-crew-creation.md) and
-- keeping them separate keeps foreign keys simple and strict.
create table captains (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null unique references crews (id) on delete cascade,
  name text not null default 'Captain',
  background_id uuid not null references backgrounds (id),
  chosen_stat_options text[] not null default '{}'::text[],
  level int not null default 15,
  move int not null,
  fight int not null,
  shoot int not null,
  armour int not null,
  will int not null,
  health int not null,
  current_health int not null,
  permanent_injuries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table captains enable row level security;

create trigger captains_set_updated_at
  before update on captains
  for each row execute procedure set_updated_at();

create table first_mates (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null unique references crews (id) on delete cascade,
  name text not null default 'First Mate',
  background_id uuid not null references backgrounds (id),
  chosen_stat_options text[] not null default '{}'::text[],
  level int not null default 0,
  move int not null,
  fight int not null,
  shoot int not null,
  armour int not null,
  will int not null,
  health int not null,
  current_health int not null,
  permanent_injuries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table first_mates enable row level security;

create trigger first_mates_set_updated_at
  before update on first_mates
  for each row execute procedure set_updated_at();

-- Power selections. `activation_number` is the already-computed, stored value
-- (core -> printed; non-core -> printed+2/+4; captain may additionally reduce
-- exactly 2 of their 5 by 1). Storing it (rather than recomputing on read)
-- keeps the later per-power activation-number reduction from levelling
-- (post-MVP) simple: it just decrements this column and flips `reduced`.
create table captain_powers (
  id uuid primary key default gen_random_uuid(),
  captain_id uuid not null references captains (id) on delete cascade,
  power_id uuid not null references powers (id) on delete restrict,
  is_core boolean not null,
  activation_number int not null check (activation_number >= 1),
  reduced boolean not null default false,
  unique (captain_id, power_id)
);

alter table captain_powers enable row level security;
create index captain_powers_captain_id_idx on captain_powers (captain_id);

create table first_mate_powers (
  id uuid primary key default gen_random_uuid(),
  first_mate_id uuid not null references first_mates (id) on delete cascade,
  power_id uuid not null references powers (id) on delete restrict,
  is_core boolean not null,
  activation_number int not null check (activation_number >= 1),
  reduced boolean not null default false,
  unique (first_mate_id, power_id)
);

alter table first_mate_powers enable row level security;
create index first_mate_powers_first_mate_id_idx on first_mate_powers (first_mate_id);

-- Gear slots, freely chosen from the equipment catalog (0006/0005).
create table captain_gear (
  id uuid primary key default gen_random_uuid(),
  captain_id uuid not null references captains (id) on delete cascade,
  equipment_item_id uuid not null references equipment_items (id) on delete restrict,
  notes text,
  created_at timestamptz not null default now()
);

alter table captain_gear enable row level security;
create index captain_gear_captain_id_idx on captain_gear (captain_id);

create table first_mate_gear (
  id uuid primary key default gen_random_uuid(),
  first_mate_id uuid not null references first_mates (id) on delete cascade,
  equipment_item_id uuid not null references equipment_items (id) on delete restrict,
  notes text,
  created_at timestamptz not null default now()
);

alter table first_mate_gear enable row level security;
create index first_mate_gear_first_mate_id_idx on first_mate_gear (first_mate_id);

-- Soldiers: fixed stats come from soldier_types / soldier_type_gear (0005).
-- `bonus_gear_item_id` is the one extra campaign-loot slot every soldier gets.
create table soldiers (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references crews (id) on delete cascade,
  soldier_type_id uuid not null references soldier_types (id),
  name text,
  is_robot boolean not null default false,
  current_health int not null,
  bonus_gear_item_id uuid references equipment_items (id),
  permanent_injuries jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table soldiers enable row level security;
create index soldiers_crew_id_idx on soldiers (crew_id);

create trigger soldiers_set_updated_at
  before update on soldiers
  for each row execute procedure set_updated_at();
