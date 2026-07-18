-- Unified equipment/gear catalog: base General Equipment List (equipment, weapons,
-- armour) plus the campaign loot tables (Advanced Weapons, Advanced Technology I/II,
-- Alien Artefacts). One searchable/filterable catalog, same pattern as `powers`,
-- so the crew builder and ship's hold can both reference it by id.
create table equipment_items (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  category text not null check (
    category in ('equipment', 'weapon', 'armour', 'advanced_weapon', 'advanced_tech_1', 'advanced_tech_2', 'alien_artefact')
  ),
  base_weapon_type text, -- for advanced_weapon rows: which base weapon it modifies (e.g. 'pistol')
  gear_slots int not null default 1 check (gear_slots >= 0),
  damage_modifier text, -- kept as text: most are numeric ('+2', '-1') but some are qualitative ('Grenade')
  max_range text,
  cost_cr int, -- null for free starting/base gear
  sell_cr int,
  uses int, -- limited-use items, e.g. Combat Drugs (2), Anti-toxin (2)
  effect_text text not null,
  restrictions text, -- freeform, e.g. "Only Captain or First Mate", "Only robots"
  created_at timestamptz not null default now()
);

alter table equipment_items enable row level security;

-- 17 soldier types (8 Standard + 9 Specialist), fixed stat-blocks.
create table soldier_types (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  table_type text not null check (table_type in ('standard', 'specialist')),
  move int not null,
  fight int not null,
  shoot int not null,
  armour int not null,
  will int not null,
  health int not null,
  cost_cr int not null check (cost_cr >= 0),
  notes text,
  created_at timestamptz not null default now()
);

alter table soldier_types enable row level security;

-- Starting gear per soldier type (fixed, display-only in the crew builder).
create table soldier_type_gear (
  soldier_type_id uuid not null references soldier_types (id) on delete cascade,
  equipment_item_id uuid not null references equipment_items (id) on delete restrict,
  quantity int not null default 1 check (quantity > 0),
  primary key (soldier_type_id, equipment_item_id)
);

alter table soldier_type_gear enable row level security;
