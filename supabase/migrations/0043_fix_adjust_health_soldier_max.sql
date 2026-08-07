-- Bug since 0036: the soldier branch clamped against a bare `health` column,
-- but soldiers only store current_health -- their max Health lives on
-- soldier_types.health (joined via soldier_type_id), unlike captains/
-- first_mates which do have their own `health` column. Every -/+ click on a
-- soldier's HP tracker in the round HUD failed with
-- "column \"health\" does not exist".
create or replace function adjust_combatant_health(
  p_mission_id uuid,
  p_crew_id uuid,
  p_kind text,
  p_id uuid,
  p_delta int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from missions m
    where m.id = p_mission_id
      and m.status = 'ongoing'
      and is_campaign_member(m.campaign_id)
  ) then
    raise exception 'not a member of this ongoing mission';
  end if;

  if not exists (
    select 1 from mission_participants where mission_id = p_mission_id and crew_id = p_crew_id
  ) then
    raise exception 'crew is not a participant of this mission';
  end if;

  if not owns_crew(p_crew_id) then
    raise exception 'can only adjust health for your own crew';
  end if;

  if p_kind = 'captain' then
    update captains set current_health = greatest(0, least(health, current_health + p_delta)) where id = p_id and crew_id = p_crew_id;
  elsif p_kind = 'first_mate' then
    update first_mates set current_health = greatest(0, least(health, current_health + p_delta)) where id = p_id and crew_id = p_crew_id;
  elsif p_kind = 'soldier' then
    update soldiers s
      set current_health = greatest(0, least(st.health, s.current_health + p_delta))
      from soldier_types st
      where s.id = p_id and s.crew_id = p_crew_id and st.id = s.soldier_type_id;
  end if;
end;
$$;
