-- Ship upgrade catalog (8 entries from 08-campaigns.md).
create table ship_upgrade_types (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  cost_cr int not null,
  effect_text text not null,
  max_purchases int not null default 1 check (max_purchases > 0), -- Meditation Chamber = 2
  created_at timestamptz not null default now()
);

alter table ship_upgrade_types enable row level security;

-- Permanent Injury catalog (9 entries from 08-campaigns.md), used to record injuries
-- applied to a figure without re-typing rule text into free-form notes each time.
create table permanent_injury_types (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  effect_text text not null,
  stat_key text check (stat_key in ('move', 'fight', 'shoot', 'will', 'health')),
  penalty_per_stack int, -- e.g. -1 per stack; null for injuries without a flat stat penalty
  max_stacks int not null default 2,
  created_at timestamptz not null default now()
);

alter table permanent_injury_types enable row level security;
