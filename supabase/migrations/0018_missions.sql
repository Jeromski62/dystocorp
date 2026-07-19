-- Mission planning/tracking for a campaign. Distinct from session_log_entries
-- (which is a narrative log per game night): a mission moves through a
-- lifecycle as the group agrees on what's next, plays it, then writes it up --
-- planned (next game idea) -> ongoing (currently playing) -> report (free-text
-- write-up of what happened).
create table missions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'planned' check (status in ('planned', 'ongoing', 'report')),
  report_text text,
  created_by uuid not null references players (id),
  created_at timestamptz not null default now()
);

alter table missions enable row level security;
create index missions_campaign_id_idx on missions (campaign_id);

-- Equal-footing model (no GM role, see 0002_campaigns.sql): any campaign
-- member can plan a mission, advance its status, or write its report --
-- not just whoever created it.
create policy missions_select on missions for select to authenticated
  using (is_campaign_member(campaign_id));
create policy missions_insert on missions for insert to authenticated
  with check (is_campaign_member(campaign_id) and created_by = auth.uid());
create policy missions_update on missions for update to authenticated
  using (is_campaign_member(campaign_id));
