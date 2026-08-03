-- Play Mode's During-Game state (PRD Phase 2, steps 7-11). Deliberately a
-- separate one-row-per-mission table rather than columns on `missions`:
-- round/turn/consent state changes every few minutes during play, while
-- `missions` itself only changes a handful of times per mission (status,
-- report). Keeping them apart gives Realtime a small, single-purpose
-- subscription target and avoids firing "round changed" events to anything
-- that only cares about mission status/report edits.
--
-- `phase` mirrors the PRD's phases within a single ongoing mission:
--   setup   -> Phase 2 step 7 (table/setup screen)
--   round   -> Phase 2 steps 8-11 (the round loop, Aim Assist lives here)
--   debrief -> Phase 3+4 combined (both run "per player individually" per
--              the PRD, so one shared DB phase is enough to distinguish them
--              from the still-in-progress round loop)
--
-- End-round is mutual-consent (PRD step 10): one player requests it,
-- `round_number` only advances once a *different* player confirms. A single
-- nullable requester column is enough since only one open request makes
-- sense at a time.
create table mission_round_state (
  mission_id uuid primary key references missions (id) on delete cascade,
  phase text not null default 'setup' check (phase in ('setup', 'round', 'debrief')),
  round_number int not null default 1 check (round_number >= 1),
  active_crew_id uuid references crews (id), -- manual toggle only, no enforced activation order (Round Sequence detail PRD is separate)
  end_round_requested_by uuid references players (id),
  end_round_requested_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table mission_round_state enable row level security;

create trigger mission_round_state_set_updated_at
  before update on mission_round_state
  for each row execute procedure set_updated_at();

create policy mission_round_state_select on mission_round_state for select to authenticated
  using (exists (select 1 from missions m where m.id = mission_id and is_campaign_member(m.campaign_id)));
create policy mission_round_state_insert on mission_round_state for insert to authenticated
  with check (exists (select 1 from missions m where m.id = mission_id and is_campaign_member(m.campaign_id)));
create policy mission_round_state_update on mission_round_state for update to authenticated
  using (exists (select 1 from missions m where m.id = mission_id and is_campaign_member(m.campaign_id)));

-- Required for hosted Supabase to actually stream postgres_changes events for
-- this table -- RLS alone does not add it to the realtime publication.
alter publication supabase_realtime add table mission_round_state;
