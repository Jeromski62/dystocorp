-- Per-job Siegbedingungen (victory conditions) and round-limit callouts.
-- Checked against context/StarGrave Rules/09-scenarios.md + 07-core-rules-
-- full.md ("Ending the Game"): none of the 10 rulebook scenarios define a
-- scenario-specific victory condition or round cap -- the generic loot-/
-- elimination-based end condition in the core rules always applies instead.
-- Both columns stay null for those rows on purpose (rendered as an empty
-- state in the UI) and exist for jobs that do define one.
alter table job_board_missions add column victory_condition_text text;
alter table job_board_missions add column round_limit_text text;
