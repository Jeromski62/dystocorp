-- Seed: Advanced Weapon table (20 entries, 08-campaigns.md). All are indestructible.
insert into equipment_items (key, name, category, base_weapon_type, gear_slots, damage_modifier, max_range, cost_cr, sell_cr, effect_text, restrictions) values

('adv_pistol_ext_range', 'Pistol, Extended Range 14"', 'advanced_weapon', 'pistol', 1, null, '14"', 200, 80, $$Extended range 14" instead of the base Pistol's 10".$$, 'Indestructible.'),
('adv_pistol_dmg', 'Pistol, +1 Damage', 'advanced_weapon', 'pistol', 1, '+1', '10"', 250, 100, $$+1 Damage.$$, 'Indestructible.'),
('adv_pistol_shoot', 'Pistol, +1 Shoot', 'advanced_weapon', 'pistol', 1, null, '10"', 400, 200, $$+1 Shoot while wielded (Split Stat).$$, 'Indestructible.'),
('adv_pistol_ext_range_dmg', 'Pistol, Extended Range 14" & +1 Damage', 'advanced_weapon', 'pistol', 1, '+1', '14"', 400, 200, $$Extended range 14" and +1 Damage.$$, 'Indestructible.'),
('adv_carbine_1slot', 'Carbine, 1 Gear Slot', 'advanced_weapon', 'carbine', 1, null, '24"', 300, 120, $$As a normal Carbine, but takes only 1 gear slot instead of 2.$$, 'Indestructible.'),
('adv_carbine_dmg', 'Carbine, +1 Damage', 'advanced_weapon', 'carbine', 2, '+1', '24"', 400, 160, $$+1 Damage.$$, 'Indestructible.'),
('adv_carbine_shoot', 'Carbine, +1 Shoot', 'advanced_weapon', 'carbine', 2, null, '24"', 500, 250, $$+1 Shoot while wielded (Split Stat).$$, 'Indestructible.'),
('adv_carbine_1slot_dmg', 'Carbine, 1 Gear Slot, +1 Damage', 'advanced_weapon', 'carbine', 1, '+1', '24"', 500, 250, $$Takes only 1 gear slot and grants +1 Damage.$$, 'Indestructible.'),
('adv_shotgun_ext_range', 'Shotgun, Extended Range 16"', 'advanced_weapon', 'shotgun', 2, '+1', '16"', 250, 120, $$Extended range 16" instead of the base Shotgun's 12".$$, 'Indestructible.'),
('adv_shotgun_dmg', 'Shotgun, +1 Damage', 'advanced_weapon', 'shotgun', 2, '+1', '12"', 300, 150, $$+1 Damage on top of the base Shotgun's +1 (total +2 Damage).$$, 'Indestructible.'),
('adv_shotgun_1slot', 'Shotgun, 1 Gear Slot', 'advanced_weapon', 'shotgun', 1, '+1', '12"', 300, 120, $$As a normal Shotgun, but takes only 1 gear slot instead of 2.$$, 'Indestructible.'),
('adv_shotgun_shoot', 'Shotgun, +1 Shoot', 'advanced_weapon', 'shotgun', 2, '+1', '12"', 500, 250, $$+1 Shoot while wielded (Split Stat).$$, 'Indestructible.'),
('adv_hand_weapon_dmg', 'Hand Weapon, +1 Damage', 'advanced_weapon', 'hand_weapon', 1, '+1', null, 300, 120, $$+1 Damage.$$, 'Indestructible.'),
('adv_hand_weapon_fight', 'Hand Weapon, +1 Fight', 'advanced_weapon', 'hand_weapon', 1, null, null, 400, 200, $$+1 Fight while wielded (Split Stat). Applies only in melee (Combat Rolls), not as defence against Shooting, unless stated otherwise.$$, 'Indestructible.'),
('adv_rapid_fire_2slot', 'Rapid Fire, 2 Gear Slots', 'advanced_weapon', 'rapid_fire', 2, '+2', '24"', 400, 160, $$As a normal Rapid-fire weapon, but takes only 2 gear slots instead of 3.$$, 'Indestructible.'),
('adv_rapid_fire_dmg', 'Rapid Fire, +1 Damage', 'advanced_weapon', 'rapid_fire', 3, '+3', '24"', 600, 300, $$+1 Damage on top of the base Rapid-fire's +2 (total +3 Damage).$$, 'Indestructible.'),
('adv_grenade_launcher_shoot', 'Grenade Launcher, +1 Shoot', 'advanced_weapon', 'grenade_launcher', 3, 'Grenade', '16"', 400, 160, $$+1 on the target-point roll only, not against figures directly.$$, 'Indestructible.'),
('adv_grenades_frag_dmg', 'Grenades -- Fragmentation, +1 Damage', 'advanced_weapon', 'grenades', 1, '+1', '6" (thrown)', 400, 160, $$+1 Damage, applies to all grenade attacks made by this figure.$$, 'Indestructible.'),
('adv_flamethrower_dmg', 'Flame Thrower, +1 Damage', 'advanced_weapon', 'flamethrower', 2, '+3', 'Template', 500, 200, $$+1 Damage on top of the base Flame Thrower's +2 (total +3 Damage).$$, 'Indestructible.'),
('adv_carbine_shoot_dmg_1slot', 'Carbine, +1 Shoot, +1 Damage, 1 Gear Slot', 'advanced_weapon', 'carbine', 1, '+1', '24"', 1000, 400, $$+1 Shoot (Split Stat), +1 Damage, and takes only 1 gear slot.$$, 'Indestructible.');

-- Seed: Advanced Technology Table I (20 entries).
insert into equipment_items (key, name, category, gear_slots, cost_cr, sell_cr, uses, effect_text, restrictions, linked_power_id) values

('at1_deck', 'Advanced Technology Deck', 'advanced_tech_1', 1, 160, 100, null, $$+8 (instead of +6) on Will Roll to unlock Data-loot.$$, 'Only for figures who may normally carry a Deck.', null),
('at1_picks', 'Advanced Technology Picks', 'advanced_tech_1', 1, 160, 100, null, $$+8 (instead of +6) on Will Roll to unlock Physical-loot.$$, 'Only for figures who may normally carry Picks.', null),
('at1_integrated_filter_mask', 'Integrated Filter Mask', 'advanced_tech_1', 0, 160, 100, null, $$As Filter Mask, but 0 Gear Slots.$$, 'Only Captain or First Mate.', null),
('at1_nano_surgery_kit', 'Nano-surgery Kit', 'advanced_tech_1', 1, 300, 120, null, $$As Medic Kit, additionally regenerates 1 Health point on the target (max once per round per figure).$$, null, null),
('at1_combat_armour_aws', 'Combat Armour, Advanced Weapon Systems', 'advanced_tech_1', 2, 800, 300, null, $$Integrated Pistol is replaced by an integrated Shotgun (no extra slot). Upkeep rises from 50cr to 75cr per game.$$, null, null),
('at1_light_armour_energy_shielding', 'Light Armour with Energy Shielding', 'advanced_tech_1', 1, 300, 120, null, $$As normal Light Armour, additionally +1 Fight vs. Shooting.$$, null, null),
('at1_heavy_armour_energy_shielding', 'Heavy Armour with Energy Shielding', 'advanced_tech_1', 1, 400, 160, null, $$As normal Heavy Armour, additionally +1 Fight vs. Shooting.$$, null, null),
('at1_energy_shield', 'Energy Shield', 'advanced_tech_1', 1, 400, 160, null, $$+1 Armour, +1 Fight vs. Shooting (the Fight bonus does not stack with other Energy-Shielding armour; the +1 Armour does).$$, null, null),
('at1_combat_drugs', 'Combat Drugs (2)', 'advanced_tech_1', 1, 100, 50, 2, $$Before the game, for each non-robot figure: +1 Fight, -1 Will (Fight cap +6). 2 doses.$$, null, null),
('at1_pain_masker', 'Pain-masker', 'advanced_tech_1', 1, 150, 75, null, $$1 action, administered to a figure within 1": instantly heals up to 4 Health. A figure carrying a Medic Kit/Nano-surgery Kit may carry 1 dose without an extra gear slot.$$, null, null),
('at1_gravity_suppressor', 'Gravity Suppressor', 'advanced_tech_1', 1, 500, 200, null, $$Never takes fall damage, regardless of height.$$, null, null),
('at1_jump_pack', 'Jump Pack', 'advanced_tech_1', 1, 500, 200, null, $$1x/game: 1 Move in any direction (including vertically) with no movement penalties (Rough Ground, climbing, carrying Physical-loot).$$, null, null),
('at1_improved_drone', 'Improved Drone', 'advanced_tech_1', 1, 500, 250, null, $$Can be stored in the ship (doesn't need to be carried). 1x/game: an activated Drone power creates a drone with +1 Move/+1 Fight instead of the base version. If reduced to 0 Health: d20, on 1-4 it is destroyed (struck from the sheet), otherwise only damaged (reusable in later games).$$, null, (select id from powers where key = 'drone')),
('at1_holographic_projector', 'Holographic Projector', 'advanced_tech_1', 1, 400, 100, null, $$+1 Activation Roll for the Holographic Wall power.$$, null, (select id from powers where key = 'holographic_wall')),
('at1_surge_battery', 'Surge Battery', 'advanced_tech_1', 1, 400, 100, null, $$1x/game: Power Spike activatable at Strain 0 instead of 1.$$, null, (select id from powers where key = 'power_spike')),
('at1_robot_repair_kit', 'Robot Repair Kit', 'advanced_tech_1', 1, 300, 100, null, $$1 action: heals up to 2 Health on a robot within 1" (outside combat). If the carrier instead uses the Repair Robot power, it heals 6 instead of 5 Health. Max once per figure per round.$$, null, (select id from powers where key = 'repair_robot')),
('at1_fragmentation_armour', 'Fragmentation Armour', 'advanced_tech_1', 1, 500, 250, null, $$On receipt, choose Light or Heavy Armour (fixed thereafter). Additionally +1 Armour exclusively vs. Fragmentation-Grenade attacks.$$, null, null),
('at1_grapplewire', 'Grapplewire', 'advanced_tech_1', 1, 300, 150, null, $$1x/game: trigger Force Combat from 3" instead of 1".$$, null, null),
('at1_anti_toxin', 'Anti-toxin (2)', 'advanced_tech_1', 1, 200, 100, 2, $$Free Action (on self) or 1 action (on a figure within 1", outside combat): cures all toxins/poisons. 2 doses.$$, null, null),
('at1_psychic_shield_item', 'Psychic Shield', 'advanced_tech_1', 1, 400, 150, null, $$Carrier is immune to the Suggestion power.$$, null, (select id from powers where key = 'suggestion'));

-- Seed: Advanced Technology Table II (20 entries).
insert into equipment_items (key, name, category, gear_slots, cost_cr, sell_cr, uses, effect_text, restrictions, linked_power_id) values

('at2_plasmablaster', 'Plasmablaster', 'advanced_tech_2', 1, 300, 150, null, $$1x/game: can make a full Flamethrower attack.$$, null, null),
('at2_anti_gravity_patch', 'Anti-gravity Patch (3)', 'advanced_tech_2', 1, 200, 100, 3, $$Free Action, applied to carried/1"-distant Physical-loot: removes the Move/Fight/Shoot penalty for that token. 3 uses.$$, null, null),
('at2_weapon_cage', 'Weapon Cage', 'advanced_tech_2', 0, 200, 150, null, $$Makes any weapon indestructible. No extra gear slot, even for Soldiers.$$, null, null),
('at2_extended_magazine', 'Extended Magazine', 'advanced_tech_2', 1, 300, 200, null, $$The first natural "1" rolled on a Shooting attack per game causes no Jam.$$, null, null),
('at2_robot_antenna', 'Robot Antenna', 'advanced_tech_2', 1, 400, 150, null, $$1x/game: +1 Activation Roll for Remote Guidance or Remote Firing (choose after the roll).$$, null, null),
('at2_jet_boots', 'Jet boots', 'advanced_tech_2', 1, 300, 120, null, $$1x/game: either +3 Move for one activation, or +10 on a Move Stat Roll (decision may be made after the roll).$$, null, null),
('at2_gill_suit', 'Gill suit', 'advanced_tech_2', 1, 300, 120, null, $$Carrier counts as Amphibious.$$, null, null),
('at2_liftgloves', 'Liftgloves', 'advanced_tech_2', 1, 300, 120, null, $$1x/game: +8 on a Fight Stat Roll against a Target Number (not on Combat Rolls); decision may be made after the roll.$$, null, null),
('at2_hardsuit', 'Hardsuit', 'advanced_tech_2', 1, 400, 200, null, $$Only becomes Stunned at 6+ Damage from a Shooting attack (instead of 4).$$, null, null),
('at2_pulse_disperser', 'Pulse Disperser', 'advanced_tech_2', 1, 500, 200, null, $$1x/game: Electromagnetic Pulse activatable at Strain 0 instead of 1.$$, null, (select id from powers where key = 'electromagnetic_pulse')),
('at2_neutron_polarity_reverser', 'Neutron Polarity Reverser', 'advanced_tech_2', 1, 1000, 250, null, $$1x/game: may attempt Cancel Power even without possessing that power (base Activation Number + Will stat, no Exertion possible). Rolling a natural 1 destroys the item.$$, 'Only Captain or First Mate.', (select id from powers where key = 'cancel_power')),
('at2_hotshift_pack', 'Hotshift Pack', 'advanced_tech_2', 1, 400, 200, null, $$1x/game: 2 shots at 2 targets with 1 action (Pistol/Carbine/Shotgun); the weapon then becomes unusable for the rest of the game. If either shot rolls a natural 1, the Hotshift Pack is destroyed.$$, null, null),
('at2_grapplegun', 'Grapplegun', 'advanced_tech_2', 1, 500, 250, null, $$1 action next to a wall: Shoot Roll (TN10) -> success: immediately climb 8" straight up (Free Action, doesn't count as a Move -- Force Combat by a third party remains possible).$$, null, null),
('at2_robot_scrambler', 'Robot Scrambler', 'advanced_tech_2', 1, 300, 150, null, $$If the carrier wins a melee combat against a robot, this item may be used instead of dealing damage: the robot must pass a Will Roll (TN20) or shuts down (removed as if reduced to 0 Health, but no Survival Roll needed -- automatically returns next game at full Health).$$, null, null),
('at2_neural_chip', 'Neural Chip', 'advanced_tech_2', 1, 350, 150, null, $$+1 Will.$$, null, null),
('at2_swiftsuit', 'Swiftsuit', 'advanced_tech_2', 1, 500, 250, null, $$+1 Move (cap: Move 7).$$, null, null),
('at2_ablative_armour_plates', 'Ablative Armour Plates', 'advanced_tech_2', 1, 200, 150, null, $$Absorbs the first 2 Damage points from any external source, then is destroyed.$$, null, null),
('at2_data_virus', 'Data Virus', 'advanced_tech_2', 1, 300, 100, null, $$One-time use: a marked Data-loot token (needn't be in LOS) requires a new Will Roll (TN26) to unlock. Consumed after use.$$, null, null),
('at2_power_selector', 'Power Selector', 'advanced_tech_2', 1, 300, 125, null, $$On Pistol/Carbine/Shotgun: choosable before the roll, -1 Shoot in exchange for +2 Damage. Rolling a natural 1 while active destroys the item.$$, null, null),
('at2_pistol_belt', 'Pistol Belt', 'advanced_tech_2', 1, 300, 125, null, $$Allows carrying 2 pistols in 1 gear slot. Additionally: no Jam on the first natural "1" rolled with a pistol per game.$$, null, null);

-- Seed: Alien Artefact table (20 entries). Never usable by Soldiers.
insert into equipment_items (key, name, category, gear_slots, cost_cr, sell_cr, effect_text, restrictions, linked_power_id) values

('artefact_micro_transporter', 'Micro Transporter', 'alien_artefact', 1, 1000, 300, $$Bait and Switch: the target's Will Roll rises to TN16 instead of TN14.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'bait_and_switch')),
('artefact_pickcaster', 'Pickcaster', 'alien_artefact', 1, 600, 200, $$Break Lock: 1x/game +2 Activation Roll.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'break_lock')),
('artefact_mindshackles', 'Mindshackles', 'alien_artefact', 1, 600, 200, $$Control Animal: 1x/game the target's Will Roll rises to TN22 instead of TN16.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'control_animal')),
('artefact_dark_energy_crystal', 'Dark Energy Crystal', 'alien_artefact', 1, 800, 250, $$Dark Energy: Strain 0 instead of 1.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'dark_energy')),
('artefact_data_worm', 'Data Worm', 'alien_artefact', 1, 1000, 400, $$Data Jump / Data Knock / Data Skip: 1x/game with no Strain cost.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', null),
('artefact_enhanced_energy_shield', 'Enhanced Energy Shield', 'alien_artefact', 1, 800, 250, $$First use per game of the Energy Shield power absorbs 4 instead of 3 Damage (further uses that game are normal).$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'energy_shield')),
('artefact_robolock', 'Robolock', 'alien_artefact', 1, 600, 200, $$Control Robot: the target's first Will Roll attempt rises to TN22 instead of TN15 (later escape attempts by the robot remain TN15).$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'control_robot')),
('artefact_sensory_tendrils', 'Sensory Tendrils', 'alien_artefact', 1, 500, 200, $$Target Lock: choose either +2 Activation Roll or Strain 0 instead of 1.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'target_lock')),
('artefact_binding_talisman', 'Binding Talisman', 'alien_artefact', 1, 600, 300, $$Heal: choose either +2 Activation Roll or heal up to 7 instead of 5 Health.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'heal')),
('artefact_psychic_resonator', 'Psychic Resonator', 'alien_artefact', 1, 800, 300, $$Psychic Shield: choose either +2 Activation Roll or Strain 1 instead of 2.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'psychic_shield')),
('artefact_flicker_light', 'Flicker Light', 'alien_artefact', 1, 600, 300, $$Quick-Step: choose either +2 Activation Roll or Strain 0 instead of 1.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'quick_step')),
('artefact_mindspike', 'Mindspike', 'alien_artefact', 1, 800, 300, $$Suggestion: 1x/game the target's Will Roll rises to TN18 instead of TN16.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'suggestion')),
('artefact_phase_manipulator', 'Phase Manipulator', 'alien_artefact', 1, 600, 250, $$Transport: choose either +2 Activation Roll or Strain 0 instead of 1.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'transport')),
('artefact_focalizing_crystal', 'Focalizing Crystal', 'alien_artefact', 1, 750, 200, $$Void Blade: 1x/game automatic success with no Activation Roll (no XP for that activation).$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'void_blade')),
('artefact_garkon_tick', 'Garkon Tick', 'alien_artefact', 1, 600, 200, $$Adrenaline Surge or Armour Plates: choose either +2 Activation Roll or Strain 1 instead of 2.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'adrenaline_surge')),
('artefact_reality_distorter', 'Reality Distorter', 'alien_artefact', 1, 650, 250, $$Cancel Power: 1x/game activatable as a Free Action.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'cancel_power')),
('artefact_razor_derringer', 'Razor Derringer', 'alien_artefact', 1, 800, 350, $$Concealed Firearm: choose either +2 Activation Roll or the attack becomes +6 Shooting instead of +5.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'concealed_firearm')),
('artefact_hearthrike', 'Hearthrike', 'alien_artefact', 1, 1000, 300, $$Carrier never suffers the Armour Interference penalty while wearing Light Armour.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', null),
('artefact_blessed_horthath', 'Blessed Horthath', 'alien_artefact', 1, 600, 350, $$Fortune: +2 Activation Roll.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'fortune')),
('artefact_cursed_idress', 'Cursed Idress', 'alien_artefact', 1, 800, 200, $$Puppet Master: choose either +2 Activation Roll or Strain 1 instead of 2.$$, 'Only Captain or First Mate; max 1 of this artefact per figure.', (select id from powers where key = 'puppet_master'));
