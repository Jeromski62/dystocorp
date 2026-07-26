-- Corp choice was always meant to be cosmetic-only (see 0007_crews.sql), but
-- the column was still `not null`, forcing every crew to pick a megacorp.
-- Allow null for the "subcontractor" / freelance option (no corp sponsor) --
-- app code already treats crew.corps as nullable everywhere (CrewCard's
-- "Special Purpose Vehicle" fallback, CorpEmblem's neutral tile, etc.).
alter table crews alter column corp_id drop not null;
