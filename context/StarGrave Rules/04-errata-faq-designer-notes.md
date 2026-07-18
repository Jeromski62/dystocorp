# FAQ, Errata & Designer Notes

> Quelle: `stargrave-errata.pdf` (Osprey Games, Stand: Dezember 2021).
> Diese Datei enthält offizielle Klarstellungen zu Grundregeln, die im
> Hauptregelbuch mehrdeutig oder unvollständig formuliert waren. Für eine App
> sind das primär **Edge-Case-Validierungsregeln** — z.B. beim Implementieren der
> Kampf-/Power-Logik unbedingt berücksichtigen.

## General

- **Pre-measuring**: allowed at any time.

## Assembling a Crew

### Captains

- **Captain Levels** (book p.22 & p.75): Captains start at **Level 15**, but this does
  *not* mean they need to "level up" 15 times — all 15 levels' worth of improvements are
  already included in the initial captain-creation process (`01-crew-creation.md`).

### Gear

- **Equipment** (p.29): Decks, Filter Masks, Medic Kits, and Picks each take up **1 gear
  slot** each.
- **Unarmed** (p.30): a figure is Unarmed only if it has no melee weapon (knife or hand
  weapon — ranged weapons don't count). A figure with a melee weapon always uses it in
  melee. The Unarmed penalty (−2 Fight when defending vs. shooting, per weapons table) only
  applies while the figure is *actively in melee combat* — not simply "unarmed and being
  shot at while not in combat."
- **Knives** (p.30): the *first* knife carried by a Captain or First Mate is free (no gear
  slot). Additional knives cost a slot. If a soldier's profile doesn't list a knife, it
  doesn't have one and cannot take one.
- **Grenades** (p.31): if a Captain or First Mate takes grenades, they get *both* types
  (smoke + fragmentation) for a single gear slot.
- **Combat Armour** (p.33): built-in items (e.g. an Armoured Trooper's built-in pistol) can
  be upgraded/replaced following normal gear rules — but doing so uses up the figure's one
  gear slot.

## The Rules

### Activation

- **Group Activation** (p.40): a *special, optional* type of activation where a
  captain/first mate and any soldiers activating with them coordinate movement for an
  advantage. **Not compulsory** when activating multiple figures in a phase:
  - *Standard Activation*: finish all of one figure's actions before moving to the next figure.
  - *Group Activation*: all figures move first (their first action), then each performs
    its second action in turn.

### Movement

- **Obstructions** (p.44): friendly figures may not be moved through. Figures may climb
  *horizontally* as well as up/down, using the same climbing rules.

### Shooting

- **Line of Sight** (p.55): figures count as intervening terrain unless the shooter is in
  base contact with them (in which case they count as cover instead).
- **Modifiers to Shooting** (p.56):
  - Clarified (p.59): a **stunned** figure gets **+2 Fight** vs. shooting attacks (it's
    "devoting all its effort to maximizing its use of cover").
  - If the target is in contact with soft cover covering **less than half** its body, apply
    the **Intervening Terrain** modifier (+1) instead of a cover modifier.
- **Shooting Into Combat** (p.57): targets the combat itself (not individual figures), so it
  *can* hit a model with Camouflage, the 'Chameleon' attribute, or other figures that
  wouldn't normally be a legal target.
- **Shooting With a Flamethrower** (p.57): flamethrowers may be fired into or through smoke.
- **Throwing and Firing Grenades** (p.58): grenades may be thrown/fired into or through smoke.

### Damage

- **Stun** (p.59):
  - Figures are only stunned by **shooting** attacks — never by melee combat ("I ain't got
    time to bleed…" rule).
  - A stunned figure's one action does **not** have to be a Move — any normally-permitted
    action is fine.
  - A figure that is both **Stunned AND Wounded** (p.60) still gets exactly **one action**
    (Wounded reduces the base to 1 action; Stunned caps it at max 1 action — they don't
    stack to zero).

### Collecting Loot Tokens

- **Data-loot Tokens** (p.64): unlocking one counts as the figure's one non-movement
  action, so it can't be picked up in the same activation it was unlocked in — unless the
  figure somehow has 3 actions available.

### Creature Actions

- **Step 2** (p.65): if a creature has a missile weapon but the crew member in LOS is
  **not within range**, treat the creature as if it had no missile weapon (skip to the
  "move toward closest visible figure" branch) rather than taking no action.

## Campaigns

### Injury and Death

- **Badly Wounded** (p.68): figures that start a game at half Health due to being badly
  wounded *can* be healed during that game (e.g. via the Heal power) back up, but never
  above their **normal starting Health**.

### Powers

- **Line of Sight Powers** (p.103): a figure always has LOS to a figure it's currently in
  combat with — so LOS powers like Concealed Firearm or Dark Energy work even if the pair
  is standing in smoke.
- **Out of Game Powers** (p.104): a figure may attempt *all* of its Out of Game powers
  between games, but each only **once** per opportunity.
- **Break Lock** (p.106): only unlocks the loot — does **not** grant a free pickup.
- **Bribe** (p.106): used in response to a grenade attack cancels the **whole** attack,
  regardless of how many models were in the blast.
- **Drone** (p.109):
  - Drones may pick up loot tokens.
  - **Self Only** powers only affect the figure that activated them and don't need LOS —
    they can **never** be activated "through" a drone.
- **Holographic Wall** (p.111): must be straight.
- **Lift** (p.111): if used on the activator itself, its action ends the instant the Lift
  completes — a Power Move may only happen *before* the Lift in that case.
- **Remote Firing** (p.113): uses the robot only as the *origin point* of the shooting
  attack — the attack otherwise ignores the robot's actual Shoot stat and weapon type.
- **Re-wire Robot** (p.115): enhancements granted are **not permanent** when applied to an
  *improved drone* (p.86) specifically (as opposed to a regular robot soldier).
- **Target Lock** (p.115): the activator must be armed with grenades or a grenade launcher
  to be the source of the attack.
- **Toxic Claws** (p.116) & **Void Blade** (p.116): these stack, provided Toxic Claws is
  activated *first* (so there's a hand weapon in place for Void Blade to enhance).
- **Toxic Secretion** (p.116): does **not** apply to template attacks (grenades,
  flamethrowers, or any power attack using a template).
- **Wall of Force** (p.116): must be straight.

### Bestiary

- **Mindgripper** (p.146): Armour 18 is correct as printed (represents size/speed more than
  physical armour). Should **not** have the 'Animal' attribute — it's a sentient alien.
- **Sentrabot** (p.150): very basic AI — follows the standard Creature Actions process
  (p.64/`03-rules-quick-reference.md`) and does not fire unless it has the 'Surprise Shot'
  attribute (p.159).
- **Warp Hound** (p.162): should **not** have the 'Animal' attribute — it's a sentient alien.

## Errata (direct text corrections)

- **Robot Antenna** (p.90): "Robot Firing power" should read **"Remote Firing power"**.
- **Drones** (p.144): should have the **'Robot'** attribute (p.158).
- **Warbots** (p.152): should be armed with an **indestructible carbine**.

## Designer Notes (optional house-rule guidance, not hard rules)

- **Loot Placement** (p.38): standard loot placement clusters tokens near table centre for
  maximum conflict. For a gentler variant, the designer suggests allowing each player to
  place one loot token on their own side of the table, at least 12" from their starting
  table edge, increasing the odds each crew leaves with at least one token.
- **Toxic Secretion** (p.116): the designer notes a toxic grenade/flamethrower-style attack
  was considered but not implemented/tested, and is suspected to be too powerful as a
  houserule extension.
