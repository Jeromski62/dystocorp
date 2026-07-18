-- Seed: base General Equipment List (06-general-equipment.md) -- Equipment,
-- Weapons, Armour. "Grenades" is modelled as one catalog row (frag + smoke
-- together) because the rules always grant both for a single shared slot.
insert into equipment_items (key, name, category, gear_slots, damage_modifier, max_range, effect_text) values

('deck', 'Deck', 'equipment', 1, null, null, $$"Cyberdeck". +6 on rolls to unlock Data-loot.$$),
('filter_mask', 'Filter Mask', 'equipment', 1, null, null, $$Figure is immune to gas and low-oxygen environments.$$),
('medic_kit', 'Medic Kit', 'equipment', 1, null, null, $$Instead of a Move action: spend an action to treat a figure within 2" (not in combat) -- instantly cures all toxins, removes Stunned, removes Wounded status (no effect on robots; usable any number of times per game).$$),
('picks', 'Picks', 'equipment', 1, null, null, $$+6 on rolls to unlock Physical-loot.$$),

('unarmed', 'Unarmed', 'weapon', 0, '-2', null, $$Only if the figure carries no weapon at all: -2 Fight in addition to the -2 Damage modifier. Creatures without a listed weapon fight with Natural Weapons and are never considered Unarmed.$$),
('knife', 'Knife', 'weapon', 1, '-1', null, $$Weapon of last resort. The first knife carried by a Captain or First Mate takes no gear slot; additional knives cost a slot as normal. A soldier whose profile doesn't list a knife cannot take one.$$),
('hand_weapon', 'Hand Weapon', 'weapon', 1, null, null, $$Any melee weapon (powered blade, electro-staff, shockhammer, ...) -- size is mechanically irrelevant.$$),
('pistol', 'Pistol', 'weapon', 1, null, '10"', $$One-handed ranged weapon.$$),
('carbine', 'Carbine', 'weapon', 2, null, '24"', $$Standard long gun.$$),
('shotgun', 'Shotgun', 'weapon', 2, '+1', '12"', $$Any figure who would normally carry a Carbine (including all Soldiers) may swap it 1:1 for a Shotgun.$$),
('rapid_fire', 'Rapid-fire', 'weapon', 3, '+2', '24"', $$On a Shooting action: either (a) two separate Shooting attacks against two targets no more than 2" apart, or (b) one Shooting attack at +2 Damage. With 2 actions available, both may be spent (variant a-style) on two different targets ≤2" apart -- each then gets +2 Damage. Carrier suffers -1 Move unless wearing Heavy or Combat Armour.$$),
('grenades', 'Grenades', 'weapon', 1, null, '6" (thrown)', $$Covers both Fragmentation and Smoke grenades for a single shared gear slot; the figure may choose which type to use each time, unlimited supply for the game. Fragmentation: +3 Shooting attack against every figure within 1.5" of the target point. Smoke: 4"-diameter, 3"-high smoke cloud, fully blocks LOS.$$),
('grenade_launcher', 'Grenade Launcher', 'weapon', 3, 'Grenade', '16"', $$Increases grenade range to 16", but all rolls against the target point suffer -1. Carrier automatically counts as equipped with both grenade types.$$),
('flamethrower', 'Flame Thrower', 'weapon', 2, '+2', 'Template', $$Uses the flamethrower template. Carrier suffers -1 Move unless wearing Heavy/Combat Armour. Armour penetration: targets in Light Armour lose 1 Armour point, targets in Heavy Armour lose 2 Armour points against this attack (Combat Armour stays fully effective). Only Solid Cover counts against a flamethrower attack, never Soft Cover.$$),

('light_armour', 'Light Armour', 'armour', 1, '+1', null, $$+1 Armour.$$),
('heavy_armour', 'Heavy Armour', 'armour', 1, '+2', null, $$+2 Armour, -1 Move.$$),
('combat_armour', 'Combat Armour', 'armour', 2, '+4', null, $$+4 Armour. Before every game the figure takes part in (including the first), the Captain must pay 50cr upkeep per suit of Combat Armour. If unpaid: Captain/First Mate must swap the suit for other gear; Soldier sits out the coming game (may be temporarily replaced by a Recruit or Runner). Automatically includes an integrated Hand Weapon, Pistol, and Filter Mask (no extra slots needed for those).$$),
('shield', 'Shield', 'armour', 1, '0', null, $$No Armour bonus -- effectively useless against most modern weapons (no mechanical effect); exceptions exist only as Advanced-Technology/alien variants found during a campaign. Carrier may not wield any weapon taking more than 1 gear slot.$$);

-- Seed: 17 Soldier types (8 Standard + 9 Specialist), fixed stats (01-crew-creation.md).
insert into soldier_types (key, name, table_type, move, fight, shoot, armour, will, health, cost_cr, notes) values

('recruit', 'Recruit', 'standard', 6, 2, 2, 10, 0, 12, 0, null),
('runner', 'Runner', 'standard', 7, 2, 1, 9, 1, 12, 0, null),
('hacker', 'Hacker', 'standard', 6, 1, 1, 10, 1, 12, 20, null),
('chiseler', 'Chiseler', 'standard', 6, 1, 1, 10, 1, 12, 20, null),
('guard_dog', 'Guard Dog', 'standard', 8, 1, 0, 8, -2, 10, 10, 'Animal; cannot carry gear or loot.'),
('sentry', 'Sentry', 'standard', 5, 3, 2, 11, 0, 14, 50, null),
('trooper', 'Trooper', 'standard', 5, 2, 3, 11, 0, 14, 50, null),
('medic', 'Medic', 'standard', 7, 2, 2, 10, 3, 14, 100, null),

('codebreaker', 'Codebreaker', 'specialist', 6, 3, 2, 10, 2, 14, 75, null),
('casecracker', 'Casecracker', 'specialist', 6, 3, 2, 10, 2, 14, 75, null),
('commando', 'Commando', 'specialist', 5, 3, 3, 11, 1, 14, 75, null),
('pathfinder', 'Pathfinder', 'specialist', 7, 3, 3, 10, 2, 14, 100, null),
('sniper', 'Sniper', 'specialist', 6, 3, 4, 10, 3, 14, 100, null),
('grenadier', 'Grenadier', 'specialist', 5, 3, 3, 11, 2, 14, 100, null),
('burner', 'Burner', 'specialist', 5, 3, 2, 11, 1, 14, 100, null),
('gunner', 'Gunner', 'specialist', 5, 3, 3, 11, 1, 14, 100, null),
('armoured_trooper', 'Armoured Trooper', 'specialist', 6, 4, 4, 13, 3, 14, 150, null);

-- Starting gear per soldier type.
insert into soldier_type_gear (soldier_type_id, equipment_item_id, quantity)
select st.id, ei.id, g.qty
from (values
  ('recruit', 'pistol', 1), ('recruit', 'light_armour', 1), ('recruit', 'knife', 1),
  ('runner', 'pistol', 1), ('runner', 'knife', 1),
  ('hacker', 'pistol', 1), ('hacker', 'deck', 1), ('hacker', 'light_armour', 1), ('hacker', 'knife', 1),
  ('chiseler', 'pistol', 1), ('chiseler', 'picks', 1), ('chiseler', 'light_armour', 1), ('chiseler', 'knife', 1),
  ('guard_dog', null, 0), -- animal, cannot carry gear
  ('sentry', 'carbine', 1), ('sentry', 'heavy_armour', 1), ('sentry', 'hand_weapon', 1),
  ('trooper', 'carbine', 1), ('trooper', 'heavy_armour', 1), ('trooper', 'knife', 1),
  ('medic', 'pistol', 1), ('medic', 'light_armour', 1), ('medic', 'medic_kit', 1),
  ('codebreaker', 'carbine', 1), ('codebreaker', 'deck', 1), ('codebreaker', 'light_armour', 1), ('codebreaker', 'knife', 1),
  ('casecracker', 'carbine', 1), ('casecracker', 'picks', 1), ('casecracker', 'light_armour', 1), ('casecracker', 'knife', 1),
  ('commando', 'carbine', 1), ('commando', 'grenades', 1), ('commando', 'heavy_armour', 1), ('commando', 'hand_weapon', 1),
  ('pathfinder', 'carbine', 1), ('pathfinder', 'grenades', 1), ('pathfinder', 'light_armour', 1), ('pathfinder', 'hand_weapon', 1),
  ('sniper', 'carbine', 1), ('sniper', 'light_armour', 1), ('sniper', 'hand_weapon', 1),
  ('grenadier', 'grenade_launcher', 1), ('grenadier', 'pistol', 1), ('grenadier', 'heavy_armour', 1), ('grenadier', 'knife', 1),
  ('burner', 'flamethrower', 1), ('burner', 'pistol', 1), ('burner', 'heavy_armour', 1), ('burner', 'knife', 1),
  ('gunner', 'rapid_fire', 1), ('gunner', 'pistol', 1), ('gunner', 'heavy_armour', 1), ('gunner', 'knife', 1),
  ('armoured_trooper', 'carbine', 1), ('armoured_trooper', 'combat_armour', 1)
) as g(soldier_key, equip_key, qty)
join soldier_types st on st.key = g.soldier_key
join equipment_items ei on ei.key = g.equip_key
where g.equip_key is not null;
