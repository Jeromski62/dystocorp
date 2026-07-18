-- A campaign bundles multiple crews (one per player). No GM/admin role --
-- all members are equal, enforced later via RLS rather than an app-level role check.
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references players (id),
  created_at timestamptz not null default now()
);

alter table campaigns enable row level security;

create table campaign_members (
  campaign_id uuid not null references campaigns (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (campaign_id, player_id)
);

alter table campaign_members enable row level security;

create index campaign_members_player_id_idx on campaign_members (player_id);
