-- 0035 left shooter_crew_id/target_crew_id without on delete cascade, unlike
-- every other crew_id reference in the schema (mission_participants,
-- captains, soldiers, etc). Result: deleting a crew that appears anywhere in
-- a mission's combat log fails with a foreign key violation. The log is a
-- per-mission audit trail, not a record that should outlive the crew it
-- references, so it cascades like the rest.
alter table mission_combat_log
  drop constraint mission_combat_log_shooter_crew_id_fkey,
  add constraint mission_combat_log_shooter_crew_id_fkey
    foreign key (shooter_crew_id) references crews (id) on delete cascade;

alter table mission_combat_log
  drop constraint mission_combat_log_target_crew_id_fkey,
  add constraint mission_combat_log_target_crew_id_fkey
    foreign key (target_crew_id) references crews (id) on delete cascade;
