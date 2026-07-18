# Campaigns — Full Text (Chapter Three)

> Quelle: `StarGraveRulesbook.pdf` (Buchseiten 67–101, Kapitel 3: "Campaigns"). Das
> mit Abstand wichtigste Kapitel für die **Kampagnen-Tracker**-Funktion der App: Injury/
> Death, Experience & Level, vollständige Loot-Tabellen (Data-/Physical-Loot, Advanced
> Weapons, Advanced Technology I+II, Alien Artefacts — inkl. aller Item-Einzeltexte),
> Spending Loot (Rekrutierung, Kauf/Verkauf), Ship-Upgrades.

## Post-Game Sequence (Wiederholung)

Nach jedem Kampagnen-Spiel, in dieser Reihenfolge:

1. **Injury oder Death prüfen**
2. **Out of Game (A)**-Powers nutzen
3. **Experience & Level** berechnen
4. **Loot auswürfeln**
5. **Loot ausgeben**

Figuren, die während des Spiels **nicht** auf 0 Health oder weniger reduziert wurden,
starten das nächste Spiel automatisch bei vollem Start-Health.

## Injury and Death

Im Kampagnenmodus bedeutet 0 Health **nicht automatisch Tod** — die Figur ist "out of
the game" (bewusstlos, zu schwer verwundet zum Weiterkämpfen, oder geflüchtet).

### Soldiers — Survival Table

d20-Wurf:

| Wurf | Ergebnis | Effekt |
|---|---|---|
| 1–4 | **Dead** | Soldier wird vom Crew Sheet gestrichen; alle mitgeführte Gear geht verloren. |
| 5–8 | **Badly Wounded** | Startet das nächste Spiel mit **halbem** Start-Health (abgerundet). |
| 9–20 | **Full Recovery** | Startet das nächste Spiel bei vollem Health. |

### Captains and First Mates — Survival Table

d20-Wurf; **beim Captain darf der Spieler nach dem Wurf +1 addieren.**

| Wurf | Ergebnis | Effekt |
|---|---|---|
| 1–2 | **Dead** | Siehe *New Captain* / *New First Mate* unten. |
| 3–4 | **Permanent Injury** | Wurf auf die Permanent Injury Table (unten); danach volles Health im nächsten Spiel. |
| 5–6 | **Badly Wounded** | Wahlweise: (a) nächstes Spiel mit halbem Start-Health (abgerundet), **oder** (b) Captain zahlt **100cr** für medizinische Behandlung (**50cr**, falls ein Medic in der Crew ist) → volles Health im nächsten Spiel. Reicht das Geld nicht, darf der Captain in Schulden gehen — er darf dann aber **keine** Credits ausgeben, bis die Schuld beglichen ist. |
| 7–8 | **Close Call** | Keine ernste Verletzung, aber **alle** mitgeführte Gear geht verloren (Standard-Ausrüstung aus der General Equipment List wird kostenlos ersetzt). |
| 9–20 | **Full Recovery** | Volles Health im nächsten Spiel. |

### Permanent Injury Table

d20-Wurf. Verletzung wird dauerhaft in den Notizen der Figur vermerkt; Stat-Mali werden
als **Split Stat** notiert (z.B. Fight +3 mit Crushed Arm → `+3/+2`; der **erste** Wert
bleibt für Level-Zwecke maßgeblich, der **zweite** für tatsächliche Würfe).

| Wurf | Injury |
|---|---|
| 1–2 | Lost Toes |
| 3–6 | Smashed Leg |
| 6–10 | Crushed Arm |
| 11–12 | Lost Fingers |
| 13–14 | Never Quite As Strong |
| 15–16 | Psychological Scars |
| 17–18 | Lingering Injury |
| 19 | Smashed Jaw |
| 20 | Lost Eye |

| Injury | Effekt | Stacking |
|---|---|---|
| **Lost Toes** | Permanent −2 auf Move-Stat-**Würfe** (nicht auf den Stat selbst) | 2× möglich (kumulativ −4); weitere Treffer neu würfeln |
| **Smashed Leg** | −1 Move | 2× möglich (kumulativ −2); danach neu würfeln |
| **Crushed Arm** | −1 Fight | 2× möglich (kumulativ −2); danach neu würfeln |
| **Lost Fingers** | −1 Shoot (bei jeder Fernwaffe) | 2× möglich (kumulativ −2); danach neu würfeln |
| **Never Quite As Strong** | Startet jedes Spiel mit −1 Health | 2× möglich (kumulativ −2); danach neu würfeln |
| **Psychological Scars** | −1 Will | 2× möglich (kumulativ −2); danach neu würfeln |
| **Lingering Injury** | Vor jedem Spiel 30cr für Behandlung zahlen, sonst −3 Health zu Spielbeginn (10cr Rabatt bei Medic in der Crew) | 2× möglich: Kosten steigen auf 40cr, Malus auf −4 Health; danach neu würfeln |
| **Smashed Jaw** | Aktiviert max. **2** Soldiers statt 3 in der eigenen Phase (Captain/First Mate) | 2× möglich: sinkt auf max. 1 Soldier; danach neu würfeln |
| **Lost Eye** | −1 Fight Roll, wenn die Figur Ziel eines Shooting-Angriffs ist | 2× = effektiv blind → wird wie ein "Dead"-Ergebnis behandelt |

## Experience and Level

### Experience

Nicht an eine bestimmte Figur gebunden, sondern Crew-weit; wird für Level-Käufe
verwendet. **Max. 300 XP pro gespieltem Spiel.**

| XP | Ereignis |
|---|---|
| +30 | Pro gespieltem Spiel mit dieser Crew |
| +30 | Mind. 1 eigene Figur wurde im Spiel auf 0 Health reduziert |
| +20 | Pro von der Crew entsperrtem (unlocked) Loot-Token |
| +10 | Pro erfolgreich aktivierter Power durch Captain/First Mate (max. +100) — gilt **nicht**, wenn die Power selbst einen Loot-Token entsperrt (die +20 dafür gelten aber trotzdem separat) |
| +10 | Pro gegnerischer Crew-Figur, die von der eigenen Crew auf 0 Health reduziert wurde (max. +40) |
| +5 | Pro uncontrolled Creature, die von der Crew auf 0 Health reduziert wurde (max. +20) — gilt nicht für Kreaturen mit eigener, im Szenario festgelegter XP-Belohnung |

Viele Szenarien vergeben zusätzliche Bonus-XP für spezifische Ziele (siehe
`09-scenarios.md`).

### Level

- Captain startet bei **Level 15**, First Mate bei **Level 0**. Soldiers haben **kein**
  Level (verbessern sich nur über Gear).
- Nach jedem Spiel: **100 XP = 1 Level** für Captain **oder** First Mate, frei aufteilbar
  (z.B. 300 XP → 3 Level, beliebig verteilt zwischen beiden).
- **Hard Limits**: Captain darf **nie mehr als 20 Level höher** sein als der First Mate;
  First Mate muss **immer mind. 5 Level niedriger** sein als der Captain.
- Jeder Level-Aufstieg bringt eine Verbesserung gemäß Level-Endziffer:

| Neues Level (Endziffer) | Verbesserung |
|---|---|
| …1 | Activation Number senken |
| …2 | Stat verbessern |
| …3 | Activation Number senken |
| …4 | Activation Number senken |
| …5 | Neue Power |
| …6 | Activation Number senken |
| …7 | Stat verbessern |
| …8 | Activation Number senken |
| …9 | Activation Number senken |
| …0 | Neue Power **oder** Stat verbessern (Wahl) |

**Stat verbessern**: +1 auf einen der folgenden Stats, bis zum Maximum:
Move **(7)**, Fight **(+6)**, Shoot **(+6)**, Will **(+8)**, Health **(25)**.

**Activation Number senken**: −1 auf eine beliebige besessene Power, minimal bis **4**
(nie darunter, unabhängig ob Core Power oder nicht). Dieselbe Power darf nach einem
Spiel nur **einmal** gesenkt werden (bei 2 Level-Aufstiegen dürfen aber 2 verschiedene
Powers gesenkt werden).

**Neue Power**: beliebige Power aus dem vollen Katalog (`02-powers-catalog.md`).
Activation Number = printed value (falls Core Power des Hintergrunds) bzw. printed+2
(falls nicht) — **unabhängig davon, ob die Figur Captain oder First Mate ist** (First
Mates erleiden beim Erlernen neuer Powers **keinen** Zusatzmalus, anders als bei der
initialen Crew-Erstellung).

## Counting Loot

Pro gesichertem Loot-Token: 1 Wurf auf die passende Tabelle (Data-Loot bzw.
Physical-Loot).

### Data-loot Table

| d20 | Belohnung |
|---|---|
| 1 | 75cr |
| 2 | d20×10cr |
| 3 | 150cr |
| 4 | d20×15cr |
| 5 | 250cr |
| 6 | d20×20cr |
| 7 | Information (75cr) |
| 8 | Information (100cr) |
| 9 | Information (125cr) |
| 10 | Information (150cr) |
| 11 | Information (200cr) |
| 12–14 | Advanced Weapon |
| 15–16 | Advanced Technology (Table I) |
| 17–18 | Advanced Technology (Table II) |
| 19–20 | Secret (200cr) |

### Physical-loot Table

| d20 | Belohnung |
|---|---|
| 1 | Trade Goods (75cr) |
| 2 | Trade Goods (150cr) |
| 3 | Trade Goods (200cr) |
| 4 | Trade Goods (250cr) |
| 5 | Trade Goods (300cr) |
| 6 | Trade Goods (400cr) |
| 7–11 | Advanced Weapon |
| 12–14 | Advanced Technology (Table I) |
| 15–17 | Advanced Technology (Table II) |
| 18–20 | Alien Artefact |

### Loot-Typen erklärt

- **Credits (cr)**: Standardwährung, wird direkt zum Credits-Total der Crew addiert.
- **Information**: kann für **20 XP** eingetauscht werden (zählt **nicht** gegen das
  300-XP-Limit pro Spiel!), oder für den gelisteten Credit-Betrag verkauft werden.
- **Secret**: wird auf der Crew Sheet "gelagert", bis genutzt. Vor einem Spiel einsetzbar:
  wird das Loot-Token in der **Tischmitte** in diesem Spiel gesichert, darf es gegen
  einen beliebigen Advanced Weapon, Advanced Technology, oder Alien Artefact
  eingetauscht werden (ohne Würfeln) — danach vom Crew Sheet entfernen. Wird der
  zentrale Token nicht gesichert, verfällt die Chance. Alternativ verkaufbar für 200cr.
- **Trade Goods**: gegen den gelisteten Credit-Betrag verkaufbar.
- **Advanced Weapon**: siehe unten.
- **Advanced Technology**: siehe unten (Table I / Table II).
- **Alien Artefact**: siehe unten.

### Advanced Weapon

1 Wurf auf die Advanced Weapon Table. Kann an jede Figur gegeben werden, die den
Basiswaffentyp normal führen darf; bei Soldiers muss die Advanced-Version **denselben
Waffentyp** ersetzen (belegt weiterhin nur den einen Gear-Slot des Soldiers). Alle
Advanced Weapons sind **indestructible**. "Extended Range" erhöht die Reichweite auf
den genannten Wert. Damage-Modifikatoren addieren sich zum Basiswert der Waffenklasse
(z.B. Shotgun +1 Damage-Variante → gesamt +2 Damage). Manche Varianten belegen
weniger Gear-Slots (nützlich va. für Captain/First Mate — bei Soldiers weiterhin nur der
eine Slot). Stat-Boni werden als Split Stat notiert. **Fight-Boni von Advanced Weapons
gelten nur im Nahkampf** (Combat Rolls), nicht als Verteidigung gegen Shooting, außer
explizit anders angegeben.

| d20 | Waffe | Kosten | Verkauf |
|---|---|---|---|
| 1 | Pistol, Extended Range 14" | 200cr | 80cr |
| 2 | Pistol, +1 Damage | 250cr | 100cr |
| 3 | Pistol, +1 Shoot | 400cr | 200cr |
| 4 | Pistol, Extended Range 14" & +1 Damage | 400cr | 200cr |
| 5 | Carbine, belegt nur 1 Gear Slot | 300cr | 120cr |
| 6 | Carbine, +1 Damage | 400cr | 160cr |
| 7 | Carbine, +1 Shoot | 500cr | 250cr |
| 8 | Carbine, belegt nur 1 Gear Slot, +1 Damage | 500cr | 250cr |
| 9 | Shotgun, Extended Range 16" | 250cr | 120cr |
| 10 | Shotgun, +1 Damage | 300cr | 150cr |
| 11 | Shotgun, belegt nur 1 Gear Slot | 300cr | 120cr |
| 12 | Shotgun, +1 Shoot | 500cr | 250cr |
| 13 | Hand Weapon, +1 Damage | 300cr | 120cr |
| 14 | Hand Weapon, +1 Fight | 400cr | 200cr |
| 15 | Rapid Fire, belegt nur 2 Gear Slots | 400cr | 160cr |
| 16 | Rapid Fire, +1 Damage | 600cr | 300cr |
| 17 | Grenade Launcher, +1 Shoot (nur auf den Zielpunkt-Wurf, nicht gegen Figuren) | 400cr | 160cr |
| 18 | Grenades – Fragmentation, +1 Damage (gilt für alle Grenade-Angriffe dieser Figur) | 400cr | 160cr |
| 19 | Flame Thrower, +1 Damage | 500cr | 200cr |
| 20 | Carbine, +1 Shoot, +1 Damage, belegt nur 1 Gear Slot | 1000cr | 400cr |

### Advanced Technology

1 Wurf auf die passende Tabelle (I oder II). Kann getragen, im Schiff gelagert, oder
verkauft werden. Sofern nicht anders angegeben: **1 Gear Slot**. "(x)" hinter einem Item
= Anzahl Nutzungen, bevor es verbraucht ist.

#### Advanced Technology Table I

| d20 | Item | Kosten | Verkauf |
|---|---|---|---|
| 1 | Advanced Technology Deck | 160cr | 100cr |
| 2 | Advanced Technology Picks | 160cr | 100cr |
| 3 | Integrated Filter Mask | 160cr | 100cr |
| 4 | Nano-surgery Kit | 300cr | 120cr |
| 5 | Combat Armour, Advanced Weapon Systems | 800cr | 300cr |
| 6 | Light Armour with Energy Shielding | 300cr | 120cr |
| 7 | Heavy Armour with Energy Shielding | 400cr | 160cr |
| 8 | Energy Shield | 400cr | 160cr |
| 9 | Combat Drugs (2) | 100cr | 50cr |
| 10 | Pain-masker | 150cr | 75cr |
| 11 | Gravity Suppressor | 500cr | 200cr |
| 12 | Jump Pack | 500cr | 200cr |
| 13 | Improved Drone | 500cr | 250cr |
| 14 | Holographic Projector | 400cr | 100cr |
| 15 | Surge Battery | 400cr | 100cr |
| 16 | Robot Repair Kit | 300cr | 100cr |
| 17 | Fragmentation Armour | 500cr | 250cr |
| 18 | Grapplewire | 300cr | 150cr |
| 19 | Anti-toxin (2) | 200cr | 100cr |
| 20 | Psychic Shield | 400cr | 150cr |

#### Advanced Technology Table II

| d20 | Item | Kosten | Verkauf |
|---|---|---|---|
| 1 | Plasmablaster | 300cr | 150cr |
| 2 | Anti-gravity Patch (3) | 200cr | 100cr |
| 3 | Weapon Cage | 200cr | 150cr |
| 4 | Extended Magazine | 300cr | 200cr |
| 5 | Robot Antenna | 400cr | 150cr |
| 6 | Jet boots | 300cr | 120cr |
| 7 | Gill suit | 300cr | 120cr |
| 8 | Liftgloves | 300cr | 120cr |
| 9 | Hardsuit | 400cr | 200cr |
| 10 | Pulse Disperser | 500cr | 200cr |
| 11 | Neutron Polarity Reverser | 1000cr | 250cr |
| 12 | Hotshift Pack | 400cr | 200cr |
| 13 | Grapplegun | 500cr | 250cr |
| 14 | Robot Scrambler | 300cr | 150cr |
| 15 | Neural Chip | 350cr | 150cr |
| 16 | Swiftsuit | 500cr | 250cr |
| 17 | Ablative Armour Plates | 200cr | 150cr |
| 18 | Data Virus | 300cr | 100cr |
| 19 | Power Selector | 300cr | 125cr |
| 20 | Pistol Belt | 300cr | 125cr |

#### Advanced Technology — Item-Effekte

| Item | Effekt |
|---|---|
| **Ablative Armour Plates** | Absorbiert die ersten 2 Schadenspunkte aus jeder externen Quelle, dann zerstört. |
| **Advanced Technology Deck** | Nur für Figuren, die normal ein Deck tragen dürfen. +8 (statt +6) auf Will Roll zum Entsperren von Data-Loot. |
| **Advanced Technology Picks** | Nur für Figuren, die normal Picks tragen dürfen. +8 (statt +6) auf Will Roll zum Entsperren von Physical-Loot. |
| **Anti-gravity Patch (3)** | Free Action, angewendet auf getragenes/1"-entferntes Physical-Loot: kein Move-/Fight-/Shoot-Malus mehr für diesen Token. 3 Anwendungen. |
| **Anti-toxin (2)** | Free Action (auf sich selbst) oder 1 Aktion (auf Figur innerhalb 1", außerhalb Combat): heilt alle Toxine/Gifte. 2 Dosen. |
| **Combat Armour, Advanced Weapon Systems** | Integrierte Pistole wird durch integrierte Shotgun ersetzt (kein Zusatzslot). Unterhalt steigt von 50cr auf **75cr**. |
| **Combat Drugs (2)** | Vor dem Spiel, für jede Nicht-Robot-Figur: +1 Fight, −1 Will (Fight-Cap +6). 2 Dosen. |
| **Data Virus** | Einmalig: markiertes Data-Loot-Token (muss nicht in LOS sein) braucht neu **Will Roll (TN26)** zum Entsperren. Danach verbraucht. |
| **Energy Shield (Advanced Tech)** | +1 Armour, +1 Fight gegen Shooting (Fight-Bonus stackt nicht mit anderer Energy-Shielding-Armour; der +1 Armour schon). |
| **Extended Magazine** | Erster gewürfelter "1" bei einem Shooting-Angriff pro Spiel: kein Jam-Effekt. |
| **Fragmentation Armour** | Bei Erhalt: Light **oder** Heavy Armour festlegen (danach fix). Zusätzlich +1 Armour ausschließlich gegen Fragmentation-Grenade-Angriffe. |
| **Gill suit** | Träger gilt als Amphibious. |
| **Grapplegun** | 1 Aktion neben einer Wand: Shoot Roll (TN10) → Erfolg: sofort 8" gerade nach oben klettern (Free Action, zählt nicht als Move — Force Combat durch Dritte bleibt möglich). |
| **Grapplewire** | 1×/Spiel: Force Combat bereits ab 3" statt 1" auslösen. |
| **Gravity Suppressor** | Nie Fallschaden, egal welche Höhe. |
| **Hardsuit** | Nur Stunned bei **≥6** Schaden aus einem Shooting-Angriff (statt 4). |
| **Heavy Armour with Energy Shielding** | Wie normale Heavy Armour, zusätzlich +1 Fight gegen Shooting. |
| **Holographic Projector** | +1 Activation Roll für die Holographic-Wall-Power. |
| **Hotshift Pack** | 1×/Spiel: 2 Schüsse auf 2 Ziele mit 1 Aktion (Pistol/Carbine/Shotgun); danach Waffe für den Rest des Spiels unbrauchbar. Wird bei einem der beiden Schüsse eine 1 gewürfelt: Hotshift Pack wird zerstört. |
| **Improved Drone** | Im Schiff lagerbar (muss nicht getragen werden). 1×/Spiel: aktivierte Drone-Power erzeugt eine Drone mit +1 Move/+1 Fight. Wird die Drone auf 0 Health reduziert: d20, auf 1–4 zerstört (vom Sheet streichen), sonst nur beschädigt (in Folgespielen wiederverwendbar). |
| **Integrated Filter Mask** | Nur Captain/First Mate. Wie Filter Mask, aber **0 Gear Slots**. |
| **Jet boots** | 1×/Spiel: entweder +3 Move für eine Aktivierung, oder +10 auf einen Move-Stat-Wurf (Entscheidung nach dem Wurf möglich). |
| **Jump Pack** | 1×/Spiel: 1 Move in beliebige Richtung (auch vertikal) ohne jegliche Bewegungsmali (Rough Ground, Klettern, Physical-Loot). |
| **Liftgloves** | 1×/Spiel: +8 auf einen Fight-Stat-Wurf mit Target Number (nicht auf Combat Rolls); Entscheidung nach dem Wurf möglich. |
| **Light Armour with Energy Shielding** | Wie normale Light Armour, zusätzlich +1 Fight gegen Shooting. |
| **Nano-surgery Kit** | Wie Medic Kit, zusätzlich regeneriert das Ziel 1 Health-Punkt (max. 1×/Runde je Figur). |
| **Neural Chip** | +1 Will. |
| **Neutron Polarity Reverser** | Nur Captain/First Mate. 1×/Spiel: darf Cancel Power versuchen, auch ohne diese Power zu besitzen (Basis-Activation-Number + Will-Stat, kein Exertion möglich). Native 1 beim Wurf → Item wird zerstört. |
| **Pain-masker** | 1 Aktion, an Figur innerhalb 1" verabreicht: heilt sofort bis zu 4 Health. Figur mit Medic Kit/Nano-surgery Kit kann 1 Dosis ohne zusätzlichen Gear Slot mittragen. |
| **Pistol Belt** | Ermöglicht 2 Pistolen in 1 Gear Slot. Zusätzlich: kein Jam beim ersten gewürfelten "1" mit einer Pistole pro Spiel. |
| **Plasmablaster** | 1×/Spiel: kann einen vollen Flamethrower-Angriff ausführen. |
| **Power Selector** | Bei Pistol/Carbine/Shotgun: vor dem Wurf wählbar, −1 Shoot gegen +2 Damage. Native 1 dabei gewürfelt → Item wird zerstört. |
| **Psychic Shield (Advanced Tech)** | Träger ist immun gegen die Suggestion-Power. |
| **Pulse Disperser** | 1×/Spiel: Electromagnetic-Pulse-Power mit Strain 0 statt 1 aktivierbar. |
| **Robot Antenna** | 1×/Spiel: +1 Activation Roll für Remote Guidance **oder** Remote Firing (Entscheidung nach dem Wurf). *(Errata: "Robot Firing" im Originaltext meint Remote Firing, siehe `04-errata-faq-designer-notes.md`.)* |
| **Robot Repair Kit** | 1 Aktion: heilt bis zu 2 Health eines Roboters innerhalb 1" (außerhalb Combat). Nutzt der Träger stattdessen die Repair-Robot-Power, heilt diese 6 statt 5 Health. Max. 1× Nutzen pro Figur und Runde. |
| **Robot Scrambler** | Gewinnt der Träger einen Nahkampf gegen einen Roboter, darf er statt Schaden dieses Item einsetzen: Roboter muss Will Roll (TN20) bestehen oder schaltet ab (wie 0 Health entfernt, aber **keine** Survival-Roll nötig — kehrt automatisch nächstes Spiel mit vollem Health zurück). |
| **Surge Battery** | 1×/Spiel: Power-Spike-Power mit Strain 0 statt 1 aktivierbar. |
| **Swiftsuit** | +1 Move (Cap: Move 7). |
| **Weapon Cage** | Macht eine beliebige Waffe indestructible. Kein zusätzlicher Gear Slot, auch nicht bei Soldiers. |

### Alien Artefact

1 Wurf auf die Alien Artefact Table. Nur von **Captain oder First Mate** tragbar (oder
im Schiff gelagert/verkauft) — **nicht** an Soldiers vergebbar. 1 Gear Slot, sofern nicht
anders vermerkt. Max. 1 Exemplar pro Artefakt-Typ pro Figur.

| d20 | Item | Kosten | Verkauf |
|---|---|---|---|
| 1 | Micro Transporter | 1000cr | 300cr |
| 2 | Pickcaster | 600cr | 200cr |
| 3 | Mindshackles | 600cr | 200cr |
| 4 | Dark Energy Crystal | 800cr | 250cr |
| 5 | Data Worm | 1000cr | 400cr |
| 6 | Enhanced Energy Shield | 800cr | 250cr |
| 7 | Robolock | 600cr | 200cr |
| 8 | Sensory Tendrils | 500cr | 200cr |
| 9 | Binding Talisman | 600cr | 300cr |
| 10 | Psychic Resonator | 800cr | 300cr |
| 11 | Flicker Light | 600cr | 300cr |
| 12 | Mindspike | 800cr | 300cr |
| 13 | Phase Manipulator | 600cr | 250cr |
| 14 | Focalizing Crystal | 750cr | 200cr |
| 15 | Garkon Tick | 600cr | 200cr |
| 16 | Reality Distorter | 650cr | 250cr |
| 17 | Razor Derringer | 800cr | 350cr |
| 18 | Hearthrike | 1000cr | 300cr |
| 19 | Blessed Horthath | 600cr | 350cr |
| 20 | Cursed Idress | 800cr | 200cr |

#### Alien Artefact — Item-Effekte

Alle "1×/Spiel"-Boni sind i.d.R. **nach** dem jeweiligen Activation Roll wählbar
(Entscheidung darf also vom Würfelergebnis abhängig gemacht werden), sofern nicht
anders angegeben.

| Item | Effekt (jeweils an eine bestimmte Power gekoppelt) |
|---|---|
| **Binding Talisman** | Heal: wahlweise +2 Activation Roll ODER heilt bis 7 statt 5 Health. |
| **Blessed Horthath** | Fortune: +2 Activation Roll. |
| **Cursed Idress** | Puppet Master: wahlweise +2 Activation Roll ODER Strain 1 statt 2. |
| **Dark Energy Crystal** | Dark Energy: Strain 0 statt 1. |
| **Data Worm** | Data Jump / Data Knock / Data Skip: 1×/Spiel ohne Strain-Kosten. |
| **Enhanced Energy Shield** | Erste Nutzung/Spiel der Energy-Shield-Power: absorbiert 4 statt 3 Schaden (weitere Nutzungen normal). |
| **Flicker Light** | Quick-Step: wahlweise +2 Activation Roll ODER Strain 0 statt 1. |
| **Focalizing Crystal** | Void Blade: 1×/Spiel automatischer Erfolg ohne Activation Roll (keine XP für diese Aktivierung). |
| **Garkon Tick** | Adrenaline Surge ODER Armour Plates: wahlweise +2 Activation Roll ODER Strain 1 statt 2. |
| **Hearthrike** | Träger erleidet nie Armour-Interference-Malus, solange er Light Armour trägt. |
| **Micro Transporter** | Bait and Switch: Ziel-Will-Roll steigt auf TN16 statt TN14 (erschwert Resistenz des Ziels). |
| **Mindshackles** | Control Animal: 1×/Spiel Ziel-Will-Roll auf TN22 statt TN16. |
| **Mindspike** | Suggestion: 1×/Spiel Ziel-Will-Roll auf TN18 statt TN16. |
| **Phase Manipulator** | Transport: wahlweise +2 Activation Roll ODER Strain 0 statt 1. |
| **Pickcaster** | Break Lock: 1×/Spiel +2 Activation Roll. |
| **Psychic Resonator** | Psychic Shield: wahlweise +2 Activation Roll ODER Strain 1 statt 2. |
| **Razor Derringer** | Concealed Firearm: wahlweise +2 Activation Roll ODER Angriff wird zu +6 Shooting statt +5. |
| **Reality Distorter** | Cancel Power: 1×/Spiel als Free Action aktivierbar. |
| **Robolock** | Control Robot: erster Will-Roll-Versuch des Ziels auf TN22 statt TN15 (Folgeversuche des Roboters zur Befreiung bleiben TN15). |
| **Sensory Tendrils** | Target Lock: wahlweise +2 Activation Roll ODER Strain 0 statt 1. |

## Spending Loot

### New Soldiers

Rekrutierung zum Tabellenpreis (`01-crew-creation.md` Standard-/Specialist-Tabellen),
bis zur maximalen Crewgröße (8, davon max. 4 Specialists — vorbehaltlich Ship-Upgrade
"Extra Quarters", siehe unten). Entlassen ist jederzeit möglich (einfach vom Crew Sheet
streichen); nicht-standardmäßige Gear darf zurückgenommen werden, sonst keine
Kompensation. Auch der First Mate darf entlassen werden (i.d.R. nur bei mehreren
gravierenden Permanent Injuries sinnvoll).

### New Captain

Verliert eine Crew ihren Captain (Dead-Ergebnis): entweder komplett neu anfangen, oder
den First Mate befördern — **nur möglich ab First-Mate-Level 10**. Bei Beförderung:
First Mate erhält einmalig **+5 Level** (Verbesserungen gemäß Improvement-Type-Tabelle
oben auswählen). Kein Kostenaufwand. Ein neuer First Mate muss anschließend rekrutiert
werden (s.u.).

### New First Mate

Wird ein First Mate benötigt (Tod, Beförderung zum Captain, oder Entlassung): neu
erstellen wie in `01-crew-creation.md` beschrieben, aber **sofort mit
(Captain-Level − 20) Leveln, min. 0** ausgestattet — für jedes dieser Level eine
Verbesserung gemäß Improvement-Type-Tabelle wählen. Kein Kostenaufwand.

### Selling Items

Trade Goods, Secrets, Information → gelisteter Wert. Advanced Weapons/Technology/
Alien Artefacts → jeweiliger "Sell"-Spaltenwert.

### Buying Items

Nach jedem Spiel: **1 Wurf** auf **jede** der vier Tabellen (Advanced Weapon, Advanced
Technology I, Advanced Technology II, Alien Artefact) — diese 4 Ergebnisse sind die
einzigen an diesem Zeitpunkt käuflichen Items. Kauf zum gelisteten "Cost"-Wert.

### Improving the Ship

Ein Upgrade darf pro Schiff **nie mehrfach** gekauft werden, außer explizit vermerkt.
Keine Obergrenze für die Gesamtzahl an Upgrades.

| Upgrade | Kosten | Effekt |
|---|---|---|
| **Advanced Medical Suite** | 500cr | Nur mit Medic in der Crew nutzbar. Nach jedem Spiel: Survival Roll für 1 Soldier (Standard oder Specialist) wiederholen — der zweite Wurf zählt zwingend. |
| **Armament Workshop** | 500cr | Nutzt eine Figur die Armoury-Power erfolgreich: Crew kann **2** Combat-Armour-Anzüge ohne Unterhaltskosten einsetzen, ODER 2 Pistolen/Carbines/Shotguns erhalten +1 Damage fürs nächste Spiel, ODER je 1 von beidem. |
| **Communications Array** | 300cr | +2 Activation Roll für die Bribe-Power (für 1 Crew-Mitglied). |
| **External Cargo Pods** | 300cr | +20% zusätzlich beim Verkauf von Trade Goods. |
| **Extra Quarters** | 1000cr | Erlaubt **5** statt 4 Specialists (Crew-Gesamtgröße bleibt bei max. 8 Soldiers). |
| **Meditation Chamber** | 400cr | +2 Activation Roll für Mystic Trance (für 1 Crew-Mitglied). **Darf 2× gekauft werden** (für 2 verschiedene Figuren). |
| **Robotics Workshop** | 650cr | +1 Activation Roll für Create Robot, Remote Guidance, oder Re-wire Robot (Out of Game) für 1 Crew-Mitglied. Nur 1× zwischen zwei Spielen anwendbar. |
| **Weapon Locker** | 600cr | Vor jedem Spiel: 1 Soldier erhält für dieses eine Spiel eine Pistol/Carbine/Shotgun mit +1 Damage (nicht indestructible, belegt den regulären Gear Slot). |

## Optional Rule — Balancing Scenarios

Nur relevant für **2-Spieler-Partien**. Summe aus Captain-Level + First-Mate-Level pro
Crew berechnen, Differenz zwischen beiden Crews bilden:

- Differenz ≤8: Szenario wie geschrieben spielen.
- Differenz ≥9: die **schwächere** Crew erhält Reroll-Token gemäß Tabelle:

| Level-Differenz | Rerolls |
|---|---|
| 9–12 | 1 |
| 12–16 | 2 |
| 17+ | 3 |

Ein Reroll-Token darf verwendet werden für: einen Fight Roll in Verteidigung gegen
einen Shooting-Angriff, einen Power-Activation-Roll, oder einen Stat Roll mit Target
Number. Kein Reroll für denselben Wurf mehrfach; sonst keine Nutzungsbegrenzung pro
Runde.

## Cross-References

- Grundgerüst (Turn-/Loot-/Damage-Regeln, auf die dieses Kapitel aufbaut):
  `07-core-rules-full.md`.
- Alle Power-Namen, auf die Alien Artefacts/Advanced Tech referenzieren, im Volltext:
  `02-powers-catalog.md`.
- Captain-/First-Mate-/Soldier-Erstellung (Basiswerte, auf die Level-Ups aufbauen):
  `01-crew-creation.md`.
