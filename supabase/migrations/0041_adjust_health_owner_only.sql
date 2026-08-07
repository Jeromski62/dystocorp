-- 0036 deliberately let either mission participant nudge either side's HP
-- (comment: "either player can adjust either side's dossier"). Player asked
-- to tighten this: each player may only adjust their own crew's units now --
-- add an owns_crew() check (0009_rls.sql) on top of the existing
-- mission-participant gate. set_combatant_status (Stunned/Jammed clear,
-- 0035_mission_combat_log.sql) is untouched -- only health write access was
-- asked to be restricted.
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
    update soldiers set current_health = greatest(0, least(health, current_health + p_delta)) where id = p_id and crew_id = p_crew_id;
  end if;
end;
$$;
