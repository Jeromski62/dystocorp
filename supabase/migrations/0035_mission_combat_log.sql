-- Immutable per-shot audit trail written by Aim Assist. Feeds Phase 3's
-- "dead dossier -> shooting player's achievement pool / target player's
-- losses pool" requirement and gives a visible in-mission shot history.
-- Six nullable-but-constrained FK columns per side follow the existing
-- deliberate "separate tables per dossier type, not a polymorphic figure
-- table" convention from 0007_crews.sql.
create table mission_combat_log (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references missions (id) on delete cascade,
  round_number int not null,

  shooter_crew_id uuid not null references crews (id),
  shooter_kind text not null check (shooter_kind in ('captain', 'first_mate', 'soldier')),
  shooter_captain_id uuid references captains (id),
  shooter_first_mate_id uuid references first_mates (id),
  shooter_soldier_id uuid references soldiers (id),

  target_crew_id uuid references crews (id),
  target_kind text check (target_kind in ('captain', 'first_mate', 'soldier')),
  target_captain_id uuid references captains (id),
  target_first_mate_id uuid references first_mates (id),
  target_soldier_id uuid references soldiers (id),

  attack_type text not null check (attack_type in ('standard', 'flamethrower', 'grenade_fragmentation')),
  weapon_equipment_item_id uuid references equipment_items (id),

  roll_details jsonb not null default '{}'::jsonb, -- shooter/target rolls, every modifier applied, TN for grenades, etc.
  result text not null check (result in ('hit', 'miss')),
  damage int,
  target_became_stunned boolean not null default false,
  target_became_wounded boolean not null default false,
  target_died boolean not null default false,

  logged_by uuid not null references players (id),
  created_at timestamptz not null default now(),

  check (
    (shooter_kind = 'captain' and shooter_captain_id is not null and shooter_first_mate_id is null and shooter_soldier_id is null) or
    (shooter_kind = 'first_mate' and shooter_first_mate_id is not null and shooter_captain_id is null and shooter_soldier_id is null) or
    (shooter_kind = 'soldier' and shooter_soldier_id is not null and shooter_captain_id is null and shooter_first_mate_id is null)
  ),
  check (
    target_kind is null or
    (target_kind = 'captain' and target_captain_id is not null and target_first_mate_id is null and target_soldier_id is null) or
    (target_kind = 'first_mate' and target_first_mate_id is not null and target_captain_id is null and target_soldier_id is null) or
    (target_kind = 'soldier' and target_soldier_id is not null and target_captain_id is null and target_first_mate_id is null)
  )
);

alter table mission_combat_log enable row level security;
create index mission_combat_log_mission_id_idx on mission_combat_log (mission_id);

-- Read-only from the client's perspective: no insert/update/delete policy,
-- since every row is written exclusively through apply_shooting_resolution()
-- below (a security-definer function, so it bypasses RLS on write). This
-- keeps the log an actually-immutable audit trail rather than something the
-- client could tamper with directly.
create policy mission_combat_log_select on mission_combat_log for select to authenticated
  using (exists (select 1 from missions m where m.id = mission_id and is_campaign_member(m.campaign_id)));

-- Resolves one Aim Assist shooting action atomically: applies the target's
-- health/stun change and the shooter's weapon-jam flag, then logs the shot.
-- Runs as security definer so a player can write to the *opposing* player's
-- captain/first_mate/soldier row (health/stun only) without loosening the
-- general owns_crew()-gated write policies on those tables (0009_rls.sql),
-- which must stay owner-only everywhere else (crew builder/edit screens).
-- Validates both crews are actual participants of this ongoing mission
-- before writing anything.
create or replace function apply_shooting_resolution(
  p_mission_id uuid,
  p_round_number int,
  p_shooter_crew_id uuid,
  p_shooter_kind text,
  p_shooter_id uuid,
  p_target_crew_id uuid,
  p_target_kind text,
  p_target_id uuid,
  p_attack_type text,
  p_weapon_equipment_item_id uuid,
  p_roll_details jsonb,
  p_result text,
  p_damage int,
  p_target_becomes_stunned boolean,
  p_target_becomes_wounded boolean,
  p_target_died boolean,
  p_shooter_weapon_jammed boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_log_id uuid;
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
    select 1 from mission_participants where mission_id = p_mission_id and crew_id = p_shooter_crew_id
  ) then
    raise exception 'shooter crew is not a participant of this mission';
  end if;

  if p_target_crew_id is not null and not exists (
    select 1 from mission_participants where mission_id = p_mission_id and crew_id = p_target_crew_id
  ) then
    raise exception 'target crew is not a participant of this mission';
  end if;

  if p_shooter_weapon_jammed then
    if p_shooter_kind = 'captain' then
      update captains set weapon_jammed = true where id = p_shooter_id;
    elsif p_shooter_kind = 'first_mate' then
      update first_mates set weapon_jammed = true where id = p_shooter_id;
    elsif p_shooter_kind = 'soldier' then
      update soldiers set weapon_jammed = true where id = p_shooter_id;
    end if;
  end if;

  -- Stun only ever gets added here, never cleared (clearing happens via the
  -- manual roster toggle in the round HUD, not as part of resolving a shot).
  if p_target_id is not null and p_result = 'hit' then
    if p_target_kind = 'captain' then
      update captains
        set current_health = greatest(0, current_health - coalesce(p_damage, 0)),
            is_stunned = is_stunned or p_target_becomes_stunned
        where id = p_target_id;
    elsif p_target_kind = 'first_mate' then
      update first_mates
        set current_health = greatest(0, current_health - coalesce(p_damage, 0)),
            is_stunned = is_stunned or p_target_becomes_stunned
        where id = p_target_id;
    elsif p_target_kind = 'soldier' then
      update soldiers
        set current_health = greatest(0, current_health - coalesce(p_damage, 0)),
            is_stunned = is_stunned or p_target_becomes_stunned
        where id = p_target_id;
    end if;
  end if;

  insert into mission_combat_log (
    mission_id, round_number,
    shooter_crew_id, shooter_kind, shooter_captain_id, shooter_first_mate_id, shooter_soldier_id,
    target_crew_id, target_kind, target_captain_id, target_first_mate_id, target_soldier_id,
    attack_type, weapon_equipment_item_id, roll_details, result, damage,
    target_became_stunned, target_became_wounded, target_died, logged_by
  ) values (
    p_mission_id, p_round_number,
    p_shooter_crew_id, p_shooter_kind,
    case when p_shooter_kind = 'captain' then p_shooter_id end,
    case when p_shooter_kind = 'first_mate' then p_shooter_id end,
    case when p_shooter_kind = 'soldier' then p_shooter_id end,
    p_target_crew_id, p_target_kind,
    case when p_target_kind = 'captain' then p_target_id end,
    case when p_target_kind = 'first_mate' then p_target_id end,
    case when p_target_kind = 'soldier' then p_target_id end,
    p_attack_type, p_weapon_equipment_item_id, p_roll_details, p_result, p_damage,
    p_target_becomes_stunned, p_target_becomes_wounded, p_target_died, auth.uid()
  )
  returning id into v_log_id;

  return v_log_id;
end;
$$;

grant execute on function apply_shooting_resolution to authenticated;

-- Manual clear/set for is_stunned/weapon_jammed from the round HUD roster --
-- Round Sequence's own activation bookkeeping (when stun/jam naturally
-- clears) is out of scope, so players toggle these by hand. Same
-- security-definer approach as above, scoped the same way, so either player
-- can clear a status on either side's dossier during an ongoing mission.
create or replace function set_combatant_status(
  p_mission_id uuid,
  p_crew_id uuid,
  p_kind text,
  p_id uuid,
  p_is_stunned boolean,
  p_weapon_jammed boolean
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
    update captains set is_stunned = p_is_stunned, weapon_jammed = p_weapon_jammed where id = p_id and crew_id = p_crew_id;
  elsif p_kind = 'first_mate' then
    update first_mates set is_stunned = p_is_stunned, weapon_jammed = p_weapon_jammed where id = p_id and crew_id = p_crew_id;
  elsif p_kind = 'soldier' then
    update soldiers set is_stunned = p_is_stunned, weapon_jammed = p_weapon_jammed where id = p_id and crew_id = p_crew_id;
  end if;
end;
$$;

grant execute on function set_combatant_status to authenticated;
