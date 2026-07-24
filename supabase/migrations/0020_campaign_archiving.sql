-- Archiving a campaign is a soft flag, not a delete -- members keep read
-- access to old campaigns/crews/missions, it just drops out of the active
-- list. Any member can (un)archive, matching the equal-footing model (no RLS
-- change needed: campaigns_update_members already covers this column).
alter table campaigns add column archived_at timestamptz;
