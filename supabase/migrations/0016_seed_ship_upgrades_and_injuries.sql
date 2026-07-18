-- Seed: Ship upgrade catalog (8 entries, 08-campaigns.md).
insert into ship_upgrade_types (key, name, cost_cr, effect_text, max_purchases) values

('advanced_medical_suite', 'Advanced Medical Suite', 500, $$Requires a Medic in the crew. After each game: repeat the Survival Roll for 1 Soldier (Standard or Specialist) -- the second roll must be taken.$$, 1),
('armament_workshop', 'Armament Workshop', 500, $$If a figure successfully uses the Armoury power: the crew may field 2 Combat Armour suits without upkeep, OR 2 Pistols/Carbines/Shotguns gain +1 Damage for the next game, OR one of each.$$, 1),
('communications_array', 'Communications Array', 300, $$+2 Activation Roll for the Bribe power (for 1 crew member).$$, 1),
('external_cargo_pods', 'External Cargo Pods', 300, $$+20% additional credits when selling Trade Goods.$$, 1),
('extra_quarters', 'Extra Quarters', 1000, $$Allows 5 Specialists instead of 4 (total crew size remains max 8 Soldiers).$$, 1),
('meditation_chamber', 'Meditation Chamber', 400, $$+2 Activation Roll for Mystic Trance (for 1 crew member).$$, 2),
('robotics_workshop', 'Robotics Workshop', 650, $$+1 Activation Roll for Create Robot, Remote Guidance, or Re-wire Robot (Out of Game) for 1 crew member. Usable only once between two games.$$, 1),
('weapon_locker', 'Weapon Locker', 600, $$Before each game: 1 Soldier receives a Pistol/Carbine/Shotgun with +1 Damage for that game only (not indestructible, uses the regular gear slot).$$, 1);

-- Seed: Permanent Injury catalog (9 entries, 08-campaigns.md). `penalty_per_stack`
-- is null where the effect isn't a flat per-stat penalty (e.g. cost-based or
-- activation-count effects) -- the full rule stays in effect_text either way.
insert into permanent_injury_types (key, name, effect_text, stat_key, penalty_per_stack, max_stacks) values

('lost_toes', 'Lost Toes', $$Permanent -2 on Move stat rolls (not on the stat itself).$$, 'move', -2, 2),
('smashed_leg', 'Smashed Leg', $$-1 Move.$$, 'move', -1, 2),
('crushed_arm', 'Crushed Arm', $$-1 Fight.$$, 'fight', -1, 2),
('lost_fingers', 'Lost Fingers', $$-1 Shoot (with any ranged weapon).$$, 'shoot', -1, 2),
('never_quite_as_strong', 'Never Quite As Strong', $$Starts every game with -1 Health.$$, 'health', -1, 2),
('psychological_scars', 'Psychological Scars', $$-1 Will.$$, 'will', -1, 2),
('lingering_injury', 'Lingering Injury', $$Pay 30cr before every game for treatment, or take -3 Health at the start of the game (10cr discount if a Medic is in the crew). Second stack: cost rises to 40cr, penalty to -4 Health.$$, null, null, 2),
('smashed_jaw', 'Smashed Jaw', $$Activates a max of 2 Soldiers instead of 3 in the figure's own phase (Captain/First Mate). Second stack: drops to max 1 Soldier.$$, null, null, 2),
('lost_eye', 'Lost Eye', $$-1 Fight Roll when the figure is the target of a Shooting attack. Second stack: effectively blind -- treated as a "Dead" result instead.$$, 'fight', -1, 2);
