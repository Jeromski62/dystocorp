-- Explicit team participation per mission (Play Mode PRD Phase 1, steps 3-5).
-- Previously a mission implicitly involved "all crews in the campaign" --
-- Play Mode needs an explicit roster to know whose dossiers appear in the
-- round HUD and the Aim Assist shooter/target pickers.
create table mission_participants (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references missions (id) on delete cascade,
  crew_id uuid not null references crews (id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (mission_id, crew_id)
);

alter table mission_participants enable row level security;
create index mission_participants_mission_id_idx on mission_participants (mission_id);

-- Equal-footing model (see missions_* policies in 0018_missions.sql): any
-- campaign member can add/remove a participating crew, not just whoever
-- created the mission.
create policy mission_participants_select on mission_participants for select to authenticated
  using (exists (select 1 from missions m where m.id = mission_id and is_campaign_member(m.campaign_id)));
create policy mission_participants_insert on mission_participants for insert to authenticated
  with check (exists (select 1 from missions m where m.id = mission_id and is_campaign_member(m.campaign_id)));
create policy mission_participants_delete on mission_participants for delete to authenticated
  using (exists (select 1 from missions m where m.id = mission_id and is_campaign_member(m.campaign_id)));
