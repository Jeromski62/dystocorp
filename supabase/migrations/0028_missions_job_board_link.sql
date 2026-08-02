-- Plan Mission lets you base a campaign mission on a Job Board entry
-- (rulebook scenario or a future custom job) -- optional, so existing/
-- freeform missions with no rulebook basis stay valid.
alter table missions add column job_board_mission_id uuid references job_board_missions (id) on delete set null;
