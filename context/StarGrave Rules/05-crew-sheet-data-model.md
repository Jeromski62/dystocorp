# Crew Sheet — Data Model

> Quelle: `stargrave-crew-sheet-form-fillable.pdf` (offizielles ausfüllbares
> Formular, 2 Seiten). Dieses Dokument übersetzt das Papier-Formular in ein
> Datenmodell, das direkt als Grundlage für den App-State / die Datenbank dienen
> kann. Feldbedeutungen und Wertebereiche sind aus `01-crew-creation.md`,
> `02-powers-catalog.md` und `03-rules-quick-reference.md` abgeleitet.

## Page 1 — Crew header + Captain + First Mate

### Crew header

| Field | Type | Notes |
|---|---|---|
| Crew Name | string | flavor |
| Experience | number | campaign-tracked crew XP (see book p.74, not detailed in this context set) |
| Ship Name | string | flavor |
| Credits | number | current crew currency (cr); starts at 400 minus soldier recruitment costs |
| Ship Upgrades | free text / list | campaign purchases affecting the ship |
| Ship's Hold | free text / list | crew inventory not currently equipped on a figure |

### Captain / First Mate block (repeated structure, appears once each)

| Field | Type | Notes |
|---|---|---|
| Name | string | (labelled "Captain:" / "First Mate:" on the form) |
| Level | number | Captain starts 15; First Mate starts 0 |
| Move | number | stat |
| Fight | modifier (e.g. +3) | stat |
| Shoot | modifier | stat |
| Armour | number | stat |
| Will | modifier | stat |
| Health | number | starting/max Health |
| Current Health | number | tracks damage taken |
| Powers | list of up to 5 (Captain) / 4 (First Mate) | each entry: `{ name, activation_number, strain }` — laid out on the form as 2 side-by-side columns of Name/Activation/Strain |
| Gear/Notes | free text | equipped gear (up to 6 slots for Captain, 5 for First Mate) + freeform notes |

## Page 2 — Soldiers (repeated block × 8)

| Field | Type | Notes |
|---|---|---|
| Crew (name) | string | soldier's given name, if any |
| Type | string | must match a row from the Standard or Specialist Soldier Table, e.g. "Trooper", "Sniper"; also where the "Robot" tag is recorded |
| Move | number | fixed by Type unless modified by tech/power |
| Fight | modifier | fixed by Type |
| Shoot | modifier | fixed by Type |
| Armour | number | fixed by Type |
| Will | modifier | fixed by Type |
| Health | number | fixed by Type (starting/max) |
| Current Health | number | tracks damage taken |
| Gear/Notes | free text | starting gear from Type + 1 extra campaign-loot slot + free notes |

The form has exactly 4 soldier blocks per page and is 1 page for that — the actual PDF
shows 4 blocks on page 2; a full crew of 8 soldiers spans 2 such pages/sheets in the
original layout.

## Suggested JSON schema

A normalized shape suitable for app state / persistence (derived from the sheet, not
copied verbatim from any PDF):

```json
{
  "crew": {
    "name": "string",
    "experience": 0,
    "credits": 400,
    "ship": {
      "name": "string",
      "upgrades": ["string"],
      "hold": ["string"]
    },
    "captain": {
      "name": "string",
      "background": "Biomorph | Cyborg | Mystic | RoboticsExpert | Rogue | Psionicist | Tekker | Veteran",
      "level": 15,
      "stats": { "move": 0, "fight": 0, "shoot": 0, "armour": 0, "will": 0, "health": 0 },
      "currentHealth": 0,
      "powers": [
        { "name": "string", "activationNumber": 0, "strain": 0, "isCore": true }
      ],
      "gear": ["string"]
    },
    "firstMate": {
      "name": "string",
      "background": "Biomorph | Cyborg | Mystic | RoboticsExpert | Rogue | Psionicist | Tekker | Veteran",
      "level": 0,
      "stats": { "move": 0, "fight": 0, "shoot": 0, "armour": 0, "will": 0, "health": 0 },
      "currentHealth": 0,
      "powers": [
        { "name": "string", "activationNumber": 0, "strain": 0, "isCore": true }
      ],
      "gear": ["string"]
    },
    "soldiers": [
      {
        "name": "string",
        "type": "Recruit | Runner | Hacker | Chiseler | GuardDog | Sentry | Trooper | Medic | Codebreaker | Casecracker | Commando | Pathfinder | Sniper | Grenadier | Burner | Gunner | ArmouredTrooper",
        "isSpecialist": false,
        "isRobot": false,
        "stats": { "move": 0, "fight": 0, "shoot": 0, "armour": 0, "will": 0, "health": 0 },
        "currentHealth": 0,
        "startingGear": ["string"],
        "bonusGearSlotItem": "string | null"
      }
    ]
  }
}
```

### Cross-references for populating/validating this schema

- Valid `background` values, their stat modifiers, and their Core Power lists:
  `01-crew-creation.md` → *Choosing a Background* table.
- Valid `type` values for soldiers, their fixed stats, cost, and starting gear:
  `01-crew-creation.md` → *Standard Soldier Table* / *Specialist Soldier Table*.
- Valid `powers[].name` values, their canonical `activationNumber` (before core/non-core
  adjustment) and `strain`: `02-powers-catalog.md` → *Quick lookup table*.
- Business rules to enforce when building/editing a crew:
  - `soldiers.length <= 8`, of which `isSpecialist === true` count `<= 4`.
  - `captain.powers.length === 5`; 3–4 must be core powers for `captain.background`.
  - `firstMate.powers.length === 4`; 2–3 must be core powers for `firstMate.background`.
  - Activation number adjustment on power selection:
    - Captain, core power → printed value; non-core → printed value + 2. Then allow
      lowering exactly 2 of the 5 chosen powers' activation numbers by 1 each.
    - First Mate, core power → printed value + 2; non-core → printed value + 4. No
      reduction step.
  - `credits` spent recruiting soldiers must come out of the starting 400cr budget.
  - Gear slot caps: Captain 6, First Mate 5, Soldier 1 (bonus slot only, campaign loot only).
