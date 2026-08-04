-- Manual HP nudge from the round HUD roster. Aim Assist (0035) already writes
-- current_health automatically when a shot resolves; this covers everything
-- else that isn't modeled as a shooting action (melee, GM correction, etc.).
-- Delta-based rather than an absolute value so concurrent adjustments from
-- either player don't clobber each other, clamped to [0, health]. Same
-- security-definer + mission-participant gating as set_combatant_status
-- (0035_mission_combat_log.sql) -- either player can adjust either side's
-- dossier during an ongoing mission.
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

  if p_kind = 'captain' then
    update captains set current_health = greatest(0, least(health, current_health + p_delta)) where id = p_id and crew_id = p_crew_id;
  elsif p_kind = 'first_mate' then
    update first_mates set current_health = greatest(0, least(health, current_health + p_delta)) where id = p_id and crew_id = p_crew_id;
  elsif p_kind = 'soldier' then
    update soldiers set current_health = greatest(0, least(health, current_health + p_delta)) where id = p_id and crew_id = p_crew_id;
  end if;
end;
$$;

grant execute on function adjust_combatant_health to authenticated;
