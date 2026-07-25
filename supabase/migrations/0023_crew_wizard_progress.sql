-- Tracks creation-wizard progress so a crew being newly built (Captain ->
-- First Mate -> Soldiers -> Ship) shows a step-gated wizard, while a
-- finished crew shows the read-only view by default with an explicit edit
-- button. wizard_step is the furthest step reached (1-4); setup_completed_at
-- is set once the final step is confirmed.
alter table crews
  add column wizard_step smallint not null default 1,
  add column setup_completed_at timestamptz;

alter table crews
  add constraint crews_wizard_step_range check (wizard_step between 1 and 4);

-- Backfill: crews that already have both a captain and a first mate were
-- clearly built before this feature existed -- treat them as already
-- complete instead of force-routing them back into the wizard.
update crews c
set wizard_step = 4,
    setup_completed_at = now()
where exists (select 1 from captains ca where ca.crew_id = c.id)
  and exists (select 1 from first_mates fm where fm.crew_id = c.id);
