-- In-game combat status for Aim Assist (Stunned / weapon jam rules,
-- 07-core-rules-full.md): mirrors the existing `current_health` column
-- already on these three tables. Deliberately minimal -- this is not the
-- full "Health & Status Tracker per Dossier" the Play Mode PRD defers to its
-- own future detail PRD, just the two flags Aim Assist itself reads and
-- writes while resolving a shooting action.
alter table captains
  add column is_stunned boolean not null default false,
  add column weapon_jammed boolean not null default false;

alter table first_mates
  add column is_stunned boolean not null default false,
  add column weapon_jammed boolean not null default false;

alter table soldiers
  add column is_stunned boolean not null default false,
  add column weapon_jammed boolean not null default false;
