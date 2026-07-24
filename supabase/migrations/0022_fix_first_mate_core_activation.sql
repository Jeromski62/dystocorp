-- Bugfix backfill: first_mate_powers.activation_number for core powers was
-- stored as the printed value with no offset (copying the captain's rule),
-- but the rulebook (p.22, "Creating a First Mate") states a first mate's
-- core powers get +2, non-core +4 -- "not only do first mates have fewer
-- starting powers, but they aren't quite as good at using the ones they do
-- have." Every existing core row was computed by the buggy app code, so a
-- flat +2 correction is safe. First mates never have reduced=true
-- (maxReductions: 0), so there's no reduction-step interaction to worry
-- about. Non-core rows were already correct (offset was already +4).
update first_mate_powers set activation_number = activation_number + 2 where is_core = true;
