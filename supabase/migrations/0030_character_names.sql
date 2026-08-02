-- Cyberpunk-flavored first/last name catalog, used to pre-fill a random
-- character name whenever a Captain, First Mate, or Soldier is created.
-- Two separate tables (not one "full name" list) so first/last combine
-- freely -- far more variety from a small seed list.
create table character_first_names (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table character_last_names (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

alter table character_first_names enable row level security;
alter table character_last_names enable row level security;

-- Reference/catalog tables: readable by any signed-in user, writable only
-- via migrations/seeds (service role bypasses RLS), same pattern as
-- corps/powers/job_board_missions.
create policy character_first_names_select_all on character_first_names for select to authenticated using (true);
create policy character_last_names_select_all on character_last_names for select to authenticated using (true);
