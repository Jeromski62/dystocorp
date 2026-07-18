-- Seed: 8 Backgrounds (01-crew-creation.md). `fixed_stat_mods` always applies;
-- `choice_stat_count` of `choice_stat_options` are then picked by the player
-- (e.g. Veteran picking Fight again simply stacks to +2 total -- no special case needed).
insert into backgrounds (key, name, flavor_text, fixed_stat_mods, choice_stat_count, choice_stat_options) values

('biomorph', 'Biomorph', $$Genetically/surgically modified survivor, often on the run from creators or the law. Loose or stretchy clothing, custom armour.$$,
  '{"health": 1}'::jsonb, 2, array['move', 'fight', 'shoot']),

('cyborg', 'Cyborg', $$Man-machine fusion, ex-military specialist now mercenary/bounty hunter/investigator. Appearance ranges from fully human-looking to fully robotic.$$,
  '{"health": 1}'::jsonb, 2, array['move', 'fight', 'shoot']),

('mystic', 'Mystic', $$Doomsday-cultist or monastic-order adept with reality-bending "magic". Loose robes, rarely wears armour (interferes with powers).$$,
  '{"will": 2, "health": 1}'::jsonb, 1, array['move', 'fight', 'shoot']),

('robotics_expert', 'Robotics Expert', $$Master roboticist with empathic understanding of machines, crew often robot-heavy. Utilitarian look, carries tools/spare parts.$$,
  '{"will": 1}'::jsonb, 2, array['move', 'fight', 'shoot', 'health']),

('rogue', 'Rogue', $$Smuggler/gambler/fixer type, no supernatural powers, relies on wit and luck. Normal clothes, concealed weapon.$$,
  '{"will": 1, "health": 1}'::jsonb, 2, array['move', 'fight', 'shoot']),

('psionicist', 'Psionicist', $$Rare psychic, actively hunted/recruited by pirate fleets. Shaved head (hair itches when using powers), unique tattoos, no armour.$$,
  '{"will": 2, "health": 1}'::jsonb, 1, array['move', 'fight', 'shoot']),

('tekker', 'Tekker', $$Repairs/reverse-engineers pre-collapse high technology. Carries lots of tech gear and tool kits.$$,
  '{"will": 2}'::jsonb, 2, array['move', 'fight', 'shoot', 'health']),

('veteran', 'Veteran', $$War survivor, combat specialist, best gear/armour available. Various motivations from lost causes to mercenary work.$$,
  '{"fight": 1, "health": 1}'::jsonb, 1, array['move', 'fight', 'shoot']);

-- Core Power lists per background.
insert into background_core_powers (background_id, power_id)
select b.id, p.id
from backgrounds b
join powers p on
  (b.key = 'biomorph' and p.name in ('Adrenaline Surge', 'Armour Plates', 'Camouflage', 'Fling', 'Regenerate', 'Restructure Body', 'Toxic Claws', 'Toxic Secretion'))
  or (b.key = 'cyborg' and p.name in ('Camouflage', 'Control Robot', 'Data Knock', 'Energy Shield', 'Power Spike', 'Quick-Step', 'Target Lock', 'Temporary Upgrade'))
  or (b.key = 'mystic' and p.name in ('Control Animal', 'Dark Energy', 'Heal', 'Life Leach', 'Mystic Trance', 'Puppet Master', 'Suggestion', 'Void Blade'))
  or (b.key = 'robotics_expert' and p.name in ('Control Robot', 'Create Robot', 'Drone', 'Electromagnetic Pulse', 'Remote Firing', 'Remote Guidance', 'Repair Robot', 'Re-wire Robot'))
  or (b.key = 'rogue' and p.name in ('Bait and Switch', 'Bribe', 'Cancel Power', 'Concealed Firearm', 'Data Jump', 'Fortune', 'Haggle', 'Quick-Step'))
  or (b.key = 'psionicist' and p.name in ('Break Lock', 'Destroy Weapon', 'Lift', 'Psionic Fire', 'Psychic Shield', 'Pull', 'Suggestion', 'Wall of Force'))
  or (b.key = 'tekker' and p.name in ('Antigravity Projection', 'Data Jump', 'Data Knock', 'Data Skip', 'Drone', 'Electromagnetic Pulse', 'Holographic Wall', 'Transport'))
  or (b.key = 'veteran' and p.name in ('Armoury', 'Command', 'Coordinated Fire', 'Energy Shield', 'Fortune', 'Power Spike', 'Remote Firing', 'Target Designation'));
