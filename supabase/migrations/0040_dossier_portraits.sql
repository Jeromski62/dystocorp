-- Lets players replace the static dossier placeholder
-- (app/public/dossiers/dossier_placeholder.png) with their own portrait per
-- Captain/First Mate/Soldier. portrait_path stores the storage object path,
-- not a full URL, so the bucket/domain can change without a data migration.
alter table captains add column portrait_path text;
alter table first_mates add column portrait_path text;
alter table soldiers add column portrait_path text;

-- Public bucket: portraits aren't sensitive, and public URLs work directly
-- with next/image without a signed-URL round trip. Object path convention is
-- "{crew_id}/{captain|first_mate|soldier}-{dossier_id}.{ext}", which is what
-- lets the policies below pull crew_id out of the path via
-- storage.foldername() and reuse owns_crew()/can_read_crew() from
-- 0009_rls.sql -- the same ownership model as every other crew-scoped table.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dossier-portraits', 'dossier-portraits', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']);

create policy dossier_portraits_select on storage.objects for select to authenticated
  using (bucket_id = 'dossier-portraits' and can_read_crew((storage.foldername(name))[1]::uuid));

create policy dossier_portraits_write on storage.objects for insert to authenticated
  with check (bucket_id = 'dossier-portraits' and owns_crew((storage.foldername(name))[1]::uuid));

create policy dossier_portraits_update on storage.objects for update to authenticated
  using (bucket_id = 'dossier-portraits' and owns_crew((storage.foldername(name))[1]::uuid))
  with check (bucket_id = 'dossier-portraits' and owns_crew((storage.foldername(name))[1]::uuid));

create policy dossier_portraits_delete on storage.objects for delete to authenticated
  using (bucket_id = 'dossier-portraits' and owns_crew((storage.foldername(name))[1]::uuid));
