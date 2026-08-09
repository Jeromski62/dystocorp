-- Play Mode's HP/-/+ and stun/jam toggles only ever propagated via
-- revalidatePath -- a single click re-ran the *entire* mission data load
-- (mission, round state, participants, every crew's captain/first mate/
-- soldiers with nested gear joins) just to change one number, which is why
-- it felt slow. Switching those actions to local-apply + Realtime broadcast
-- (mirrors mission_round_state, see 0033_mission_round_state.sql) needs
-- these three tables on the realtime publication -- RLS alone does not add
-- a table to it.
alter publication supabase_realtime add table captains;
alter publication supabase_realtime add table first_mates;
alter publication supabase_realtime add table soldiers;
