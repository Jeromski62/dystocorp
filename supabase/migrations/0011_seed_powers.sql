-- Seed: full Power catalog (52 entries, from 02-powers-catalog.md).
insert into powers (key, name, activation_number, strain, types, armour_interference, full_text) values

('adrenaline_surge', 'Adrenaline Surge', 12, 2, array['self_only'], false, $$This figure immediately gains an additional action during this activation, and an additional action in their next activation as well.$$),

('antigravity_projection', 'Antigravity Projection', 10, 0, array['line_of_sight'], false, $$The target figure gains the Levitate attribute for the rest of the game.$$),

('armour_plates', 'Armour Plates', 10, 2, array['self_only', 'out_of_game_b'], false, $$The figure gains +2 Armour. May not be used if already wearing combat armour. If used Out of Game (B), the activating figure starts the game at -2 Damage (i.e. 2 Health lower) to represent the Strain.$$),

('armoury', 'Armoury', 10, 0, array['out_of_game_b'], false, $$The crew can field one suit of combat armour without paying its normal upkeep cost. Alternatively, one standard (non-Advanced-Technology) pistol, carbine, or shotgun gains a +1 Damage modifier for the next game only.$$),

('bait_and_switch', 'Bait and Switch', 12, 2, array['line_of_sight'], false, $$Usable only against a soldier carrying a loot token. Target makes a Will Roll (TN14). If failed, the figure drops the loot token and the activator may move it up to 4" in any direction.$$),

('break_lock', 'Break Lock', 12, 1, array['line_of_sight'], false, $$Immediately unlocks one physical-loot counter. (Only unlocks -- does not grant a free pickup.)$$),

('bribe', 'Bribe', 14, 0, array['out_of_game_b'], false, $$If successful, place a bribe token beside the table (opponent is informed). At any point in the game, when the opponent declares a Shooting attack by a soldier (not captain/first mate), before dice are rolled, the token may be played to auto-miss that attack. Max one bribe token used per crew per game. Cancels the whole attack even against a grenade with multiple targets.$$),

('camouflage', 'Camouflage', 10, 2, array['self_only'], false, $$No figure may draw LOS to this figure if more than 12" away. +2 Fight vs. Shooting attacks from pistol, carbine, shotgun, or rapid-fire. Cancelled if the figure becomes stunned.$$),

('cancel_power', 'Cancel Power', 12, 1, array['line_of_sight'], false, $$Immediately cancels all effects of one ongoing Line of Sight power. No effect on powers with other designations (Self Only, Touch, Out of Game).$$),

('command', 'Command', 10, 0, array['line_of_sight'], false, $$Select one crew member in LOS; they activate in the current player's phase this turn. Cannot target a figure that already activated this turn.$$),

('concealed_firearm', 'Concealed Firearm', 10, 1, array['self_only'], false, $$Usable only while the figure is in combat. Make a +5 Shooting attack against any other figure in the combat (no randomizing target even with multiple figures). If it damages the target, target is pushed back 1" and stunned, even on <4 Damage.$$),

('control_animal', 'Control Animal', 10, 1, array['line_of_sight'], false, $$Usable only against uncontrolled animals. Target makes a Will Roll (TN16) or becomes a temporary member of the activator's crew. One controlled animal per figure at a time; cancellable as a free action.$$),

('control_robot', 'Control Robot', 10, 1, array['line_of_sight'], false, $$Select one robot in LOS. It makes a Will Roll (TN15): success = nothing happens; failure = it joins the activator's crew as a temporary member. After each of its own activations it rerolls (TN15); success cancels the effect and it reverts. One controlled robot per figure at a time; cancellable as a free action.$$),

('coordinated_fire', 'Coordinated Fire', 10, 0, array['line_of_sight'], false, $$Target crew member receives +1 Shoot for the rest of the game (max total +5 Shoot). A figure benefits from only one Coordinated Fire at a time.$$),

('create_robot', 'Create Robot', 14, 0, array['out_of_game_a'], false, $$Immediately add one robot soldier to the crew for free (any type except Armoured Trooper), subject to normal soldier/specialist crew limits.$$),

('dark_energy', 'Dark Energy', 10, 1, array['line_of_sight'], true, $$+5 Shooting attack against any target within 12". Ignores the target's armour (subtract armour modifier entirely). +7 instead vs. robots. If the target is in combat, target does not randomize -- always hits the intended figure.$$),

('data_jump', 'Data Jump', 10, 1, array['line_of_sight'], false, $$Only targets a same-crew figure carrying a data-loot token. Immediately move that data-loot token to another crew member, provided both are in LOS of the activator and within 8" of each other.$$),

('data_knock', 'Data Knock', 12, 1, array['line_of_sight'], false, $$Immediately unlocks one data-loot counter.$$),

('data_skip', 'Data Skip', 12, 2, array['line_of_sight'], false, $$Targets an unlocked data-loot token, or a figure carrying one, within 12". If not carried, move the token 4" in any direction. If carried, target figure makes a Will Roll (TN16); on failure, move the token up to 4". Token remains unlocked either way.$$),

('destroy_weapon', 'Destroy Weapon', 12, 2, array['line_of_sight'], true, $$Usable against any figure within 12". Choose one non-indestructible weapon carried by the target to be destroyed; replaced for free after the game.$$),

('drone', 'Drone', 10, 1, array['touch'], false, $$Place a drone next to the activator (see Bestiary). It counts as a temporary crew member, activates/moves normally. For the rest of the game, the activator may draw LOS from the drone (including for Touch powers) instead of themself. One active drone per figure.$$),

('electromagnetic_pulse', 'Electromagnetic Pulse', 10, 1, array['line_of_sight'], false, $$Vs. a robot: it makes a Will Roll (TN18); on failure it gets no actions on its next activation. Vs. a non-robot: all firearms it carries immediately jam (as if rolling a 1 on a Shooting attack), and that weapon suffers a permanent -1 Damage modifier for the rest of the game (the jam can recur, but the Damage penalty only applies once).$$),

('energy_shield', 'Energy Shield', 10, 0, array['self_only'], false, $$Forms a shield absorbing the next 3 points of Damage from a Shooting attack that would injure the activator; then the power is cancelled.$$),

('fling', 'Fling', 8, 1, array['self_only', 'touch'], false, $$Two uses: (1) while within 1" of a crewmember, immediately move that crewmember 6" in any direction (including up); the moved figure is immediately stunned. (2) While in combat against a specific enemy figure: target makes a Fight Roll (TN16); on failure, move the target up to 6" horizontally -- no Damage (unless from another cause, e.g. falling), but stunned. Not usable on figures with the Large attribute.$$),

('fortune', 'Fortune', 12, 0, array['self_only'], false, $$Place a fortune token by the figure or on the crew sheet. At any time, discard it to reroll a Combat Roll, Shooting Roll, or Stat Roll made by that figure -- the reroll result must be taken. Max one fortune token per figure at a time.$$),

('haggle', 'Haggle', 10, 0, array['out_of_game_a'], false, $$Usable whenever the crew sells anything: crew receives 20% more than usual selling price. Only usable on the sale of one item per game.$$),

('heal', 'Heal', 10, 0, array['line_of_sight'], true, $$Restores up to 5 lost Health to a target within 6". Cannot exceed starting Health. No effect on robots.$$),

('holographic_wall', 'Holographic Wall', 10, 1, array['line_of_sight'], false, $$Creates a 6" long, 3" high wall blocking LOS through it; figures may move through it as if not there. At the end of each turn after placement, roll a die: on 1-4 the wall fails and is removed. Must be straight.$$),

('life_leach', 'Life Leach', 10, 0, array['line_of_sight'], true, $$Target makes a Will Roll (TN15); on failure, loses 3 Health and the activator regains 3 Health (cannot exceed starting Health). Not usable against robots. Can target a figure in the activator's own crew -- if so, that figure is immediately removed from the crew sheet and becomes uncontrolled for the rest of the game.$$),

('lift', 'Lift', 10, 0, array['line_of_sight'], true, $$Immediately move one same-crew figure in LOS 6" in any direction (including vertically). If left hanging, the figure drops to the ground, taking no Damage. The moved figure cannot take further actions this turn (but may have already acted earlier this turn). Cannot move a figure off the table. If a figure uses this on itself, its own action ends as soon as the Lift completes -- a Power Move may only occur before the Lift.$$),

('mystic_trance', 'Mystic Trance', 8, 0, array['out_of_game_b'], false, $$If successful, the figure may attempt to use one of its other powers before the first Initiative Roll, as if it were an Out of Game (B) power. Cannot be used with a power that targets a table point or an enemy figure.$$),

('power_spike', 'Power Spike', 8, 1, array['self_only'], false, $$The figure's next Shooting attack with a carbine, pistol, or shotgun does +3 Damage, cumulative with other weapon damage modifiers.$$),

('psionic_fire', 'Psionic Fire', 10, 1, array['self_only'], true, $$Place two flamethrower templates as if the figure had just made a flamethrower attack; they may touch but not overlap. Every figure touching a template suffers a +3 flamethrower attack (only once even if touching both).$$),

('pull', 'Pull', 12, 1, array['line_of_sight'], true, $$Target makes a Will Roll (TN16); on failure, move the target up to 6" horizontally. Cannot move over terrain >0.5" high. If this removes the figure from elevated terrain, it falls and takes Damage normally.$$),

('psychic_shield', 'Psychic Shield', 10, 2, array['line_of_sight'], true, $$Target is surrounded by psychic energy: the next Shooting-attack Damage it takes is halved (round down), then the power is cancelled. If the target is ever in combat, the power is immediately cancelled. If the target also has an active Energy Shield, deduct that 3 Damage first, then halve the remainder.$$),

('puppet_master', 'Puppet Master', 12, 2, array['touch'], true, $$Choose one non-robot crew member reduced to 0 Health this game. It returns to the table adjacent to the activator with 1 Health, counted as wounded; otherwise treated as a normal soldier. Any given soldier may be returned only once per game via this power.$$),

('quick_step', 'Quick-Step', 10, 1, array['self_only'], false, $$No Power Move allowed when attempting this power. Immediately move 4" in any direction, including out of combat, without forcing combat during the move. Cannot end within 1" of an enemy or exit the table. Ignores terrain movement penalties. If the activation fails, a normal Power Move may still be made.$$),

('regenerate', 'Regenerate', 8, 0, array['self_only'], false, $$The activator regains up to 3 lost Health.$$),

('remote_firing', 'Remote Firing', 10, 0, array['line_of_sight'], false, $$Select one same-crew robot in LOS. It makes an immediate +3 Shooting attack against any legal target within 12". Does not count as, nor cost, that robot an action/activation. Uses the robot as the origin point but ignores its actual Shoot stat and weapon type.$$),

('remote_guidance', 'Remote Guidance', 10, 0, array['out_of_game_b', 'touch'], false, $$Usable on any robot soldier: it may always activate in the same phase as the activator, even if not within 3". Still subject to the max-3-soldiers-per-phase limit. One robot at a time per activator.$$),

('repair_robot', 'Repair Robot', 10, 0, array['line_of_sight'], false, $$Restores up to 5 lost Health to a target robot within 6"; cannot exceed starting Health.$$),

('restructure_body', 'Restructure Body', 10, 0, array['self_only', 'out_of_game_b'], false, $$The activator gains one of: Amphibious, Burrowing, Expert Climber, Immune to Critical Hits, Immune to Toxins, or Never Wounded. Only one trait active at a time; switching requires another use of the power.$$),

('re_wire_robot', 'Re-wire Robot', 14, 0, array['out_of_game_b'], false, $$Select one crew robot; give it one of: +1 Move, +1 Fight, +1 Armour -- but it suffers -1 Will. Permanent modification. No robot may be re-wired more than once.$$),

('suggestion', 'Suggestion', 12, 1, array['line_of_sight'], true, $$Target makes a Will Roll (TN16); on failure, it drops any loot it carries, and the activator may move it up to 3" in any direction, provided this doesn't move it into combat or cause immediate Damage (e.g. falling >3").$$),

('target_designation', 'Target Designation', 8, 0, array['line_of_sight'], false, $$For the rest of the battle, this figure receives -2 Fight whenever rolling against a Shooting attack (i.e. makes it easier to hit).$$),

('target_lock', 'Target Lock', 10, 1, array['touch'], false, $$The activator may make an immediate grenade or grenade-launcher attack as a free action against any point in range, without needing LOS; it automatically hits its intended point. If used during a group activation, another crew member within 1" who was part of that group activation may make the attack instead. Requires the activator to be armed with grenades or a grenade launcher to be the attack's source.$$),

('temporary_upgrade', 'Temporary Upgrade', 12, 0, array['self_only'], false, $$Choose one: +1 Move, +1 Fight, +1 Shoot, +3 Will, +1 Armour. Caps: Move 7, Fight +6, Shoot +6, Will +8, Armour 14. Only one upgrade active at a time; using the power again switches to a different upgrade.$$),

('toxic_claws', 'Toxic Claws', 10, 1, array['self_only'], false, $$Figure grows indestructible claws: count as a hand weapon, +2 Damage, toxic. (Stacks with Void Blade if Toxic Claws is activated first, giving the hand weapon for Void Blade to enhance.)$$),

('toxic_secretion', 'Toxic Secretion', 12, 0, array['out_of_game_b'], false, $$Select up to two crew members (including self). All their attacks, including Shooting attacks, count as toxic for the next game. Does not apply to template attacks (grenades, flamethrowers, or any power attack using a template).$$),

('transport', 'Transport', 10, 1, array['line_of_sight'], false, $$Targets one same-crew figure within LOS and 12" of the activator; moves it up to 6" in any direction while maintaining LOS. If it was carrying a loot token, the token is dropped, not moved with the figure.$$),

('void_blade', 'Void Blade', 10, 0, array['self_only'], false, $$Requires the figure to be carrying a hand weapon. That weapon becomes indestructible and gains +2 Damage. Figure also gets +3 Fight vs. Shooting attacks from pistol, carbine, rapid-fire, or shotgun (does not stack with cover -- use whichever bonus is higher). Cancelled immediately if the figure becomes stunned. While active, the figure cannot use any weapon taking more than 1 gear slot. (Stacks with Toxic Claws if Toxic Claws was activated first.)$$),

('wall_of_force', 'Wall of Force', 12, 1, array['self_only'], false, $$Creates an impenetrable, transparent wall up to 6" long and 3" high anywhere in the activator's LOS. Cannot be climbed (though anchor points can be). Grenade/grenade-launcher attacks may arc over it. A figure may make a Shooting action targeting the wall itself: on a d20 roll of 19-20, the wall is immediately destroyed. Must be straight.$$);
