-- Deleting a campaign cascades to its crews (campaign_id on delete cascade),
-- and from there to captains/first_mates/soldiers -- a hard, unrecoverable
-- action. Matches the equal-footing model (0002_campaigns.sql): any member
-- can delete, same as any member can archive/update, not creator-only.
create policy campaigns_delete_members on campaigns for delete to authenticated
  using (is_campaign_member(id));
