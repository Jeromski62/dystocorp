-- Ship upgrades purchased by a crew (catalog: 0006_ship_upgrade_and_injury_catalogs.sql).
create table crew_ship_upgrades (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references crews (id) on delete cascade,
  ship_upgrade_type_id uuid not null references ship_upgrade_types (id),
  target_note text, -- which crew member it applies to, for per-figure upgrades
  purchased_at timestamptz not null default now()
);

alter table crew_ship_upgrades enable row level security;
create index crew_ship_upgrades_crew_id_idx on crew_ship_upgrades (crew_id);

-- Ship's Hold: free-form inventory not currently equipped on any figure.
-- Can reference a catalog item (for stock loot/gear) or be a pure custom entry.
create table ship_hold_items (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references crews (id) on delete cascade,
  equipment_item_id uuid references equipment_items (id),
  custom_name text,
  quantity int not null default 1 check (quantity > 0),
  notes text,
  created_at timestamptz not null default now(),
  check (equipment_item_id is not null or custom_name is not null)
);

alter table ship_hold_items enable row level security;
create index ship_hold_items_crew_id_idx on ship_hold_items (crew_id);

-- One narrative log entry per game night, campaign-wide (mirrors the
-- "Campaign Intel" mission-report style already used in DystoCorp lore).
create table session_log_entries (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  session_date date not null,
  title text not null,
  notes text,
  created_by uuid not null references players (id),
  created_at timestamptz not null default now()
);

alter table session_log_entries enable row level security;
create index session_log_entries_campaign_id_idx on session_log_entries (campaign_id);

-- Per-crew Post-Game Sequence result for a given session (XP/credits/loot/injuries).
create table crew_session_results (
  id uuid primary key default gen_random_uuid(),
  session_log_entry_id uuid not null references session_log_entries (id) on delete cascade,
  crew_id uuid not null references crews (id) on delete cascade,
  xp_delta int not null default 0,
  credits_delta int not null default 0,
  loot_notes text,
  injury_notes text,
  members_lost text,
  unique (session_log_entry_id, crew_id)
);

alter table crew_session_results enable row level security;
create index crew_session_results_crew_id_idx on crew_session_results (crew_id);
