-- Helper functions used by the policies below, so the actual policy
-- expressions stay short and consistent instead of repeating the same
-- subquery joins in every table's policy.
create or replace function is_campaign_member(p_campaign_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from campaign_members
    where campaign_id = p_campaign_id and player_id = auth.uid()
  );
$$;

create or replace function owns_crew(p_crew_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from crews
    where id = p_crew_id and player_id = auth.uid()
  );
$$;

create or replace function can_read_crew(p_crew_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from crews
    where id = p_crew_id and is_campaign_member(campaign_id)
  );
$$;

-- players: display names are not sensitive; any signed-in user may read them
-- (needed to show crew ownership/session authorship across a campaign).
create policy players_select_all on players for select to authenticated using (true);
create policy players_update_own on players for update to authenticated using (id = auth.uid());

-- campaigns
create policy campaigns_select_members on campaigns for select to authenticated
  using (is_campaign_member(id));
create policy campaigns_insert_any on campaigns for insert to authenticated
  with check (created_by = auth.uid());
create policy campaigns_update_members on campaigns for update to authenticated
  using (is_campaign_member(id));

-- campaign_members: a user can join themselves, or be added by an existing member;
-- anyone can see fellow members of campaigns they belong to; a member can leave.
create policy campaign_members_select on campaign_members for select to authenticated
  using (is_campaign_member(campaign_id));
create policy campaign_members_insert on campaign_members for insert to authenticated
  with check (player_id = auth.uid() or is_campaign_member(campaign_id));
create policy campaign_members_delete_self on campaign_members for delete to authenticated
  using (player_id = auth.uid());

-- Reference/catalog tables: readable by any signed-in user, writable only via
-- migrations/seeds (service role bypasses RLS, so no write policies needed).
create policy corps_select_all on corps for select to authenticated using (true);
create policy powers_select_all on powers for select to authenticated using (true);
create policy backgrounds_select_all on backgrounds for select to authenticated using (true);
create policy background_core_powers_select_all on background_core_powers for select to authenticated using (true);
create policy equipment_items_select_all on equipment_items for select to authenticated using (true);
create policy soldier_types_select_all on soldier_types for select to authenticated using (true);
create policy soldier_type_gear_select_all on soldier_type_gear for select to authenticated using (true);
create policy ship_upgrade_types_select_all on ship_upgrade_types for select to authenticated using (true);
create policy permanent_injury_types_select_all on permanent_injury_types for select to authenticated using (true);

-- crews: read-only for all campaign members, editable only by the owner.
create policy crews_select_campaign_members on crews for select to authenticated
  using (is_campaign_member(campaign_id));
create policy crews_insert_own on crews for insert to authenticated
  with check (player_id = auth.uid() and is_campaign_member(campaign_id));
create policy crews_update_own on crews for update to authenticated
  using (player_id = auth.uid());
create policy crews_delete_own on crews for delete to authenticated
  using (player_id = auth.uid());

-- captains / first_mates: same read/write split as crews, scoped via crew_id.
create policy captains_select on captains for select to authenticated
  using (can_read_crew(crew_id));
create policy captains_write on captains for all to authenticated
  using (owns_crew(crew_id)) with check (owns_crew(crew_id));

create policy first_mates_select on first_mates for select to authenticated
  using (can_read_crew(crew_id));
create policy first_mates_write on first_mates for all to authenticated
  using (owns_crew(crew_id)) with check (owns_crew(crew_id));

-- Powers/gear chosen for captain/first mate: scoped one hop further via
-- captains.crew_id / first_mates.crew_id.
create policy captain_powers_select on captain_powers for select to authenticated
  using (exists (select 1 from captains c where c.id = captain_id and can_read_crew(c.crew_id)));
create policy captain_powers_write on captain_powers for all to authenticated
  using (exists (select 1 from captains c where c.id = captain_id and owns_crew(c.crew_id)))
  with check (exists (select 1 from captains c where c.id = captain_id and owns_crew(c.crew_id)));

create policy first_mate_powers_select on first_mate_powers for select to authenticated
  using (exists (select 1 from first_mates f where f.id = first_mate_id and can_read_crew(f.crew_id)));
create policy first_mate_powers_write on first_mate_powers for all to authenticated
  using (exists (select 1 from first_mates f where f.id = first_mate_id and owns_crew(f.crew_id)))
  with check (exists (select 1 from first_mates f where f.id = first_mate_id and owns_crew(f.crew_id)));

create policy captain_gear_select on captain_gear for select to authenticated
  using (exists (select 1 from captains c where c.id = captain_id and can_read_crew(c.crew_id)));
create policy captain_gear_write on captain_gear for all to authenticated
  using (exists (select 1 from captains c where c.id = captain_id and owns_crew(c.crew_id)))
  with check (exists (select 1 from captains c where c.id = captain_id and owns_crew(c.crew_id)));

create policy first_mate_gear_select on first_mate_gear for select to authenticated
  using (exists (select 1 from first_mates f where f.id = first_mate_id and can_read_crew(f.crew_id)));
create policy first_mate_gear_write on first_mate_gear for all to authenticated
  using (exists (select 1 from first_mates f where f.id = first_mate_id and owns_crew(f.crew_id)))
  with check (exists (select 1 from first_mates f where f.id = first_mate_id and owns_crew(f.crew_id)));

-- soldiers
create policy soldiers_select on soldiers for select to authenticated
  using (can_read_crew(crew_id));
create policy soldiers_write on soldiers for all to authenticated
  using (owns_crew(crew_id)) with check (owns_crew(crew_id));

-- ship upgrades / hold
create policy crew_ship_upgrades_select on crew_ship_upgrades for select to authenticated
  using (can_read_crew(crew_id));
create policy crew_ship_upgrades_write on crew_ship_upgrades for all to authenticated
  using (owns_crew(crew_id)) with check (owns_crew(crew_id));

create policy ship_hold_items_select on ship_hold_items for select to authenticated
  using (can_read_crew(crew_id));
create policy ship_hold_items_write on ship_hold_items for all to authenticated
  using (owns_crew(crew_id)) with check (owns_crew(crew_id));

-- session_log_entries: any campaign member can log a session night; only the
-- author edits/deletes their own entry (avoids players overwriting each
-- other's narrative write-ups).
create policy session_log_entries_select on session_log_entries for select to authenticated
  using (is_campaign_member(campaign_id));
create policy session_log_entries_insert on session_log_entries for insert to authenticated
  with check (is_campaign_member(campaign_id) and created_by = auth.uid());
create policy session_log_entries_update_own on session_log_entries for update to authenticated
  using (created_by = auth.uid());
create policy session_log_entries_delete_own on session_log_entries for delete to authenticated
  using (created_by = auth.uid());

-- crew_session_results: a player records the post-game result for their own
-- crew only; everyone in the campaign can read all crews' results.
create policy crew_session_results_select on crew_session_results for select to authenticated
  using (can_read_crew(crew_id));
create policy crew_session_results_write on crew_session_results for all to authenticated
  using (owns_crew(crew_id)) with check (owns_crew(crew_id));
