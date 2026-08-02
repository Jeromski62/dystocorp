-- Job Board: a shared catalog of selectable mission "jobs" -- pre-written
-- Stargrave rulebook scenarios (chapter 5) plus, later, player-authored ones.
-- Distinct from `missions` (a specific campaign's play-log entry: tied to a
-- campaign_id, has a planned/ongoing/report status and a session date) --
-- this table is campaign-independent, read by everyone, and describes a
-- reusable scenario write-up rather than a logged play session.
create table job_board_missions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  source text not null default 'rulebook' check (source in ('rulebook', 'custom')),
  created_by uuid references players (id) on delete set null,
  d20_range text,
  setup_text text not null,
  special_rules_text text not null,
  loot_text text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table job_board_missions enable row level security;

-- Reference/catalog table, same read-all policy as corps/powers/etc. in
-- 0009_rls.sql. No insert/update policy yet -- the "own missions" creator UI
-- is a later feature; rulebook rows are written via seed migrations only.
create policy job_board_missions_select_all on job_board_missions for select to authenticated using (true);
