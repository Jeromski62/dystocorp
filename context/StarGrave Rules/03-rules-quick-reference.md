# Rules Quick Reference

> Quelle: `stargrave-quick-reference.pdf` (Buchseiten 172–176). Dies ist die verdichtete
> Spielablauf-Referenz — ideal als Basis für eine Spiel-Engine / Kampf-Resolver in der App.
> Seitenverweise ("see page X") beziehen sich auf das Hauptregelbuch (nicht Teil dieses
> Kontext-Sets).

## Turn Order

Each game turn consists of these phases, in order. **Initiative** is rolled to determine
who goes first *within* each phase.

1. **Captain Phase** — each player activates their Captain plus up to 3 soldiers within 3"
   and LOS of the captain.
2. **First Mate Phase** — each player activates their First Mate plus up to 3 soldiers
   within 3" and LOS of the first mate.
3. **Soldier Phase** — each player activates all remaining soldiers that haven't yet
   activated this turn.
4. **Creature Phase** — all non-controlled creatures activate (see Creature Actions below).

## Activation

- All figures normally get **2 actions** per activation.
- Available actions:
  - Move (must be used as one of the 2 actions per activation)
  - 2nd Move (at half distance)
  - Fight
  - Shoot
  - Activate Power (including a Power Move)
  - Attempt to Unlock Loot
  - Special (scenario-specific)

### Group Activation

An optional way to activate a captain/first mate together with soldiers within 3"/LOS:
all figures in the group must perform their **Move** as their first action, then each
figure performs its second action in turn (vs. Standard Activation, where each figure
finishes both its actions before the next figure activates). See errata for the ruling
that Group Activation is never compulsory.

## Movement

| Situation | Rule |
|---|---|
| Climbing / Rough Ground | costs 2" of movement for every 1" (or partial 1") traversed |
| Jumping | up to 4" horizontally, but must have moved that same distance in a straight line beforehand |
| Combat | a figure In Combat may not move |
| Forcing Combat | a figure not In Combat may intercept an enemy figure that moves within 1" of it |
| Falling | <3": no effect. >3": damage = 1.5 × distance in inches, rounded down |
| Swimming | Will Roll (TN5, with modifiers, see book p.47); success = activates normally; failure = no actions this turn + damage equal to the amount the roll failed by |
| Run For It | first action: move 3" ignoring all movement penalties; activation then ends immediately |
| Obstructions (errata) | friendly figures cannot be moved through; figures may climb horizontally as well as up/down using the climbing rule |

## Combat (Melee)

1. Both figures make a **Combat Roll**: d20 + Fight stat + relevant modifiers.
2. Higher Combat Roll wins (ties = no damage / no effect that exchange).
3. Add the winner's weapon damage modifiers to their Combat Roll.
4. Subtract the loser's Armour stat.
5. Apply any damage multipliers.
6. If result > 0, loser loses that much Health. If ≤ 0, no damage.
7. Winner chooses: stay in combat, or push either figure back 1".

### Multiple Combats — Supporting Figure modifier

| Circumstance | Modifier | Notes |
|---|---|---|
| Supporting Figure | +2 (cumulative) | Every friendly figure also in combat with the target, and not itself in combat with another figure, grants +2 to its ally, up to a max of **+6**. Only one figure per combat can end up with a net modifier — if both sides have equally-eligible supporters, they cancel out; the side with more eligible supporters gets the difference. |

## Shooting

1. Shooter checks range and LOS, declares target.
2. Shooter makes a **Shooting Roll**: d20 + Shoot stat.
3. Target makes a **Combat Roll**: d20 + Fight stat + shooting-defence modifiers.
4. Higher roll wins; ties/target-wins = attack misses.
5. If shooter wins: add weapon damage modifiers to the Shooting Roll.
6. Subtract target's Armour.
7. Apply damage multipliers.
8. If result > 0, target loses that much Health; if ≤ 0, no damage.
9. **4+ Damage taken → target is Stunned.**
10. Natural roll of 20 = **critical hit**; natural roll of 1 = **jam**.

### Shooting Modifier Table

| Circumstance | Modifier | Notes |
|---|---|---|
| Intervening Terrain | +1 each (cumulative) | Per piece of terrain between shooter and target. A target in base contact with terrain counts it as Cover instead. Terrain in base contact with the *shooter* doesn't count as intervening (but may still block LOS). |
| Light Cover | +2 | Target in contact with solid cover obscuring part of its body, or soft cover obscuring ≥half its body |
| Heavy Cover | +4 | Target in contact with solid cover obscuring ≥half its body |
| Hasty Shot | +1 | Shooter already moved this activation |
| Large Target | −2 | Target is unusually tall/broad (typically creatures with the 'Large' trait) |
| Stunned | +2 | Target was stunned when it activated this turn (bonus to the *target's* defence roll) |
| Cleared Jam | +1 | Shooter already cleared a weapon jam this activation |

All values in this table are added to the relevant roll (shooter's Shooting Roll for
Hasty Shot/Cleared Jam; target's Combat Roll for the defensive circumstances).

### General Weapons Table

| Weapon | Damage Modifier | Max Range | Gear Slots | Notes |
|---|---|---|---|---|
| Flame Thrower | +2 | Template | 2 | −1 Move; targets Armour and Cover modifiers |
| Grenade – Fragmentation | – | 6" | 1 | 1.5" damage radius |
| Grenade – Smoke | – | 6" | 1 | 4" diameter smoke cloud |
| Grenade Launcher | Grenade | 16" | 3 | −1 Shoot |
| Hand Weapon | – | – | 1 | melee |
| Knife | −1 | – | 1 | melee |
| Pistol | – | 10" | 1 | |
| Rapid Fire | +2* | 24" | 3 | hits 2 targets; −1 Move unless wearing heavy armour or combat armour |
| Carbine | – | 24" | 2 | |
| Shotgun | +1 | 12" | 2 | |
| Unarmed | −2 | – | – | −2 Fight (melee only, applies in combat) |

\* Rapid Fire special targeting rule — see book p.31 (not included in this context set).

### Throwing and Firing Grenades

1. Select target point.
2. Make a Shooting Stat Roll (TN12), applying the Grenade Attack Modifiers below.
3. If failed: move the target point in a random direction by inches equal to the amount
   failed by; if that's >6", the attack is removed entirely (no effect).
4. Smoke grenade → place a smoke template centred on the (possibly scattered) target point.
5. Fragmentation grenade → +3 Shooting attack against every figure within 1.5" radius of
   the (possibly scattered) target point.

| Situation | Modifier to Shoot Roll |
|---|---|
| Target point is in Line of Sight | +2 |
| Hasty Shot (already made a Move Action this activation) | −1 |
| Firing with a Grenade Launcher | −1 |

## Activating a Power

Roll a d20; success if the roll ≥ the power's Activation Number.

| Rule | Effect |
|---|---|
| Exertion | increase the roll by +1 per 1 Health spent (spent before rolling) |
| Strain | on a successful activation, activator takes damage equal to the power's Strain |
| Power Move | activator may make a 3" move either immediately before or after attempting the activation |

See `02-powers-catalog.md` for the full power list and per-power effects.

## Loot Tokens

- Cannot be unlocked while an enemy figure is within 1" of the token.
- Unlocking: spend an action, pass a Will Roll (TN14).
- **Physical-loot**: the figure that unlocked it may pick it up as a *free* action. Any
  other figure must spend an action to pick it up.
- **Data-loot**: any figure must spend an action to pick up an already-unlocked data-loot
  token (per errata: unlocking counts as the figure's one non-movement action, so a figure
  normally can't unlock and pick up the same data-loot token in the same activation —
  unless it somehow has 3 actions available).
- A figure may carry only **one** loot token at a time.
- Carrying a **physical-loot** token: Move is halved, and the figure suffers −1 Shoot and
  −1 Fight.
- Carrying a **data-loot** token: no penalties.

## Creature Actions (AI for uncontrolled creatures)

Creatures never attack each other, and always force combat when possible.

```
1. Is the creature already In Combat?
   YES → Fight as its action. If it wins, it chooses to stay in combat.
         If in combat with multiple opponents, it attacks whichever has
         the lowest current Health.
   NO  → go to step 2.

2. Is a warband member in Line of Sight?
   YES → If armed with a missile (ranged) weapon AND a crew member is
         within range: shoot the closest eligible target; takes no
         second action that activation.
         If unarmed with a missile weapon (or no target in range —
         per errata, treat as unarmed in that case too): move as far
         as possible toward the closest visible figure, climbing as
         needed. If it reaches a crew member with its first action,
         it Fights them with its second action.
   NO  → go to step 3.

3. Random Movement
   Move its full Move stat in a random direction; if it hits a wall/
   obstacle, movement halts there. If an action remains afterward,
   re-check step 2 once — if still no target, activation ends with no
   second action; otherwise proceed with step 2 normally.
```

## Post-Game Sequence

After each scenario/game, in a campaign, resolve in this exact order:

1. Check for injury or death (badly wounded figures start their next game at half Health,
   see `01-crew-creation.md` context / book p.68).
2. Use **Out of Game (A)** powers.
3. Calculate experience and levels (book p.74).
4. Roll for loot (book p.77).
5. Spend loot.

**Out of Game (B)** powers are instead used *before* the game, before the first Initiative
Roll.
