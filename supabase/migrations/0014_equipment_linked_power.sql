-- Many Advanced Technology items and all Alien Artefacts enhance one specific
-- power (e.g. "Dark Energy Crystal" -> Dark Energy). Linking this structurally
-- (rather than leaving it only in effect_text) lets the Power lookup feature
-- show "items that enhance this power" without parsing free text.
alter table equipment_items add column linked_power_id uuid references powers (id);
