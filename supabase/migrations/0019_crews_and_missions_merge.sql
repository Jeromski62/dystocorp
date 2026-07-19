-- Part 1: crews can exist without a campaign (practice/theorycrafting crews).
alter table crews alter column campaign_id drop not null;

-- can_read_crew previously only checked campaign membership, which is always
-- false for a null campaign_id -- that would lock an owner out of their own
-- campaign-less crew's captain/first_mate/soldiers/ship data. Ownership now
-- always grants read access; campaign membership is the fallback for crews
-- that do belong to a campaign.
create or replace function can_read_crew(p_crew_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from crews
    where id = p_crew_id
      and (player_id = auth.uid() or (campaign_id is not null and is_campaign_member(campaign_id)))
  );
$$;

drop policy crews_select_campaign_members on crews;
create policy crews_select_own_or_campaign_members on crews for select to authenticated
  using (player_id = auth.uid() or (campaign_id is not null and is_campaign_member(campaign_id)));

drop policy crews_insert_own on crews;
create policy crews_insert_own on crews for insert to authenticated
  with check (player_id = auth.uid() and (campaign_id is null or is_campaign_member(campaign_id)));

-- Part 2: fold session_log_entries/crew_session_results into missions. A
-- mission now carries its own play date, and per-crew results (XP/credits/
-- loot/injuries) are recorded straight against the mission instead of a
-- separate "session" concept.
alter table missions add column session_date date;

-- Carry forward existing session log entries as completed missions, reusing
-- the same id so the crew_session_results FK repoint below needs no remap --
-- a played session had no separate "plan", so its notes become the report.
insert into missions (id, campaign_id, title, description, status, report_text, created_by, created_at, session_date)
select id, campaign_id, title, null, 'report', notes, created_by, created_at, session_date
from session_log_entries;

alter table crew_session_results rename column session_log_entry_id to mission_id;
alter table crew_session_results drop constraint crew_session_results_session_log_entry_id_fkey;
alter table crew_session_results
  add constraint crew_session_results_mission_id_fkey
  foreign key (mission_id) references missions (id) on delete cascade;
alter table crew_session_results drop constraint crew_session_results_session_log_entry_id_crew_id_key;
alter table crew_session_results add constraint crew_session_results_mission_id_crew_id_key unique (mission_id, crew_id);

drop table session_log_entries;
