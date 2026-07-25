alter table missions
  add column subtitle text;

-- Backfill: two existing missions have titles over the new 30-char limit.
-- Move the full original text to the new subtitle field (nothing lost) and
-- shorten the title at the last word boundary within the first 30 chars
-- (falls back to a hard cut if a single word exceeds 30 chars).
update missions
set
  subtitle = title,
  title = case
    when position(' ' in reverse(left(title, 30))) = 0 then left(title, 30)
    else left(title, 30 - position(' ' in reverse(left(title, 30))))
  end
where char_length(title) > 30;

alter table missions
  add constraint missions_title_length check (char_length(title) <= 30);
