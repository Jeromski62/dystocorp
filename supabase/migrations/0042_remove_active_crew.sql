-- Player feedback: the "who's currently active" toggle in the round HUD was
-- just a shared visual marker with zero game-mechanic effect (0033's own
-- comment already called it "manual toggle only, no enforced activation
-- order") -- too confusing without any actual consequence, so it's removed
-- rather than kept as a no-op UI element.
alter table mission_round_state drop column active_crew_id;
