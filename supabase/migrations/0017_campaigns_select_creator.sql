-- The creator of a campaign must be able to read it back immediately after
-- INSERT (needed for `.insert().select()`), before the follow-up
-- campaign_members row exists. Without this, Postgres reports the INSERT
-- itself as an RLS violation, because the RETURNING clause is governed by
-- the SELECT policy and campaigns_select_members requires membership that
-- doesn't exist yet at that point.
create policy campaigns_select_creator on campaigns for select to authenticated
  using (created_by = auth.uid());
