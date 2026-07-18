# Bestiary (Chapter Six)

> Quelle: `StarGraveRulesbook.pdf` (Buchseiten 139–161, Kapitel 6). Kreatur-Statblöcke
> und -Attribute für uncontrolled Creatures (siehe KI-Logik in `07-core-rules-full.md` →
> *Creature Actions*). Relevant für den späteren "vollen Spiel-Begleiter"-Modus
> (Kreaturen-Datenbank), aber auch schon jetzt nützlich als Referenzdaten für
> Szenario-Inhalte (`09-scenarios.md`) und optionale Zufallsbegegnungs-Regeln.

## Random Encounters (optionale Regel)

Immer wenn eine Crew ein Loot-Token entsperrt: d20 würfeln, bei **10+** erscheint eine
Kreatur — Wurf auf die Random Encounter Table. Zahl in Klammern = Anzahl erscheinender
Kreaturen. Platzierung: zufälliger Punkt an der Tischkante (siehe *Random Creature
Entry* unten). Kreatur folgt den normalen Uncontrolled-Creature-Regeln, mit der
Tischmitte als Target Point. Eher für Wildnis-Szenarien gedacht (nicht für urbane
Settings — dort stattdessen *Unwanted Attention* nutzen). Eigene Random-Encounter-
Tabellen basierend auf der eigenen Miniaturen-Sammlung sind ausdrücklich als Alternative
vorgeschlagen.

| d20 | Kreatur | d20 | Kreatur |
|---|---|---|---|
| 1 | Ryakan | 11 | Dedfurd |
| 2 | Ferrox | 12 | Gaunch |
| 3 | Bileworm | 13 | Porigota |
| 4 | Ruffian | 14 | Mindgripper |
| 5 | Shengrylla | 15 | Horat |
| 6 | Primitive | 16 | Tanglers (2) |
| 7 | Primitives (3) | 17 | Sentrabot |
| 8 | Magmite | 18 | Warp Hound |
| 9 | Bounty Hunter | 19 | Warbot |
| 10 | Tangler | 20 | Sewer-dragon |

## Unwanted Attention (optionale Regel)

Simuliert steigende Aufmerksamkeit (Gesetzeshüter/Piratentruppen) in urbanen Szenarien.
Rundenende: Primary Player würfelt d20 **+ aktuelle Rundenzahl**, Ergebnis mit Tabelle
abgleichen. Mehrere genannte Figuren ohne "/" werden zusammen an einem zufälligen
Kantenpunkt platziert; mit "/" getrennte Gruppen an je unterschiedlichen zufälligen
Punkten.

| Wurf (d20+Runde) | Figuren |
|---|---|
| 2–14 | Keine |
| 15 | 1 Ruffian |
| 16 | 1 Ruffian |
| 17 | 2 Ruffians |
| 18 | 1 Pirate Trooper |
| 19 | 1 Pirate Trooper |
| 20 | 1 Bounty Hunter |
| 21 | 2 Pirate Troopers |
| 22 | 2 Pirate Troopers / 1 Ruffian |
| 23 | 2 Pirate Troopers / 2 Ruffian |
| 24 | 1 Pirate Shock Trooper |
| 25 | 1 Pirate Shock Trooper / 1 Pirate Trooper |
| 26 | 1 Pirate Shock Trooper / 2 Pirate Troopers |
| 27 | 1 Pirate Shock Trooper / 2 Pirate Troopers |
| 28+ | Pirate Shock Trooper / Pirate Shock Trooper |

**Random Creature Entry**: d20 würfeln und als "Pfeil" lesen (jede der 20
Dreieck-Flächen zeigt eine Richtung) — die angezeigte Richtung an der Tischkante
bestimmt den Eintrittspunkt; der numerische Wert selbst ist irrelevant.

## Creature List

Alle Stat-Werte in der Reihenfolge Move / Fight / Shoot / Armour / Will / Health. Alle
Attribute sind unten unter *Creature Attributes List* definiert.

| Kreatur | M | F | S | A | W | H | Notes/Attribute |
|---|---|---|---|---|---|---|---|
| **Bileworm** | 4 | +2 | +2 | 10 | +3 | 12 | Animal, Burrowing, Immune to Critical Hits, Ranged Attack (Reichweite 8"), Toxic |
| **Bounty Hunter** | 6 | +3 | +3 | 11 | +2 | 14 | Carbine, Heavy Armour, Hand Weapon, Counting Coup |
| **Dedfurd** | 4 | +2 | +4 | 12 | +2 | 16 | Animal, Amphibious, Bounty (20cr), Ranged Attack (Reichweite 8"), Toxic, Large |
| **Drone** | 6 | +0 | +0 | 10 | +2 | 8 | Flying, Pistol |
| **Ferrox** | 8 | +2 | +0 | 8 | +4 | 12 | Animal, Pack Hunters |
| **Gaunch** | 6 | +2 | +0 | 8 | +2 | 10 | Chameleon |
| **Horat** | 6 | +4 | +0 | 14 | +1 | 14 | Animal, Hatred of Gunfire, Horns, Large, Strong |
| **Magmite** | 5 | +3 | +0 | 13 | +4 | 10 | Animal, Lava Splash, Strong |
| **Mindgripper** | 6 | +2 | +0 | 18 | +3 | 1 | Ensnare, Possess *(kein 'Animal'-Attribut — sentiente Alien-Spezies, siehe Errata)* |
| **Pirate Shock Trooper** | 6 | +4 | +4 | 13 | +3 | 14 | Carbine, Combat Armour |
| **Pirate Trooper** | 5 | +2 | +2 | 11 | +0 | 12 | Carbine, Heavy Armour, Knife |
| **Primitive** | 6 | +1 | +0 | 9 | +0 | 10 | Pack Hunter, Primitive Weapons |
| **Porigota** | 5 | +4 | +0 | 12 | +0 | 14 | Animal, Bounty (30cr), Large, Never Wounded, Strong |
| **Repairbot** | 5 | +0 | +0 | 8 | +0 | 8 | Robot, Unaggressive, Knife |
| **Ruffian** | 6 | +2 | +1 | 9 | +0 | 10 | Pistol |
| **Ryakan** | 8 | +2 | +0 | 10 | +2 | 10 | Animal, Flying |
| **Sentrabot** | 5 | +0 | +2 | 12 | +2 | 12 | Robot, Immune to Robot Control, Surprise Shot *(feuert nur mit Surprise-Shot-Attribut, siehe Errata)* |
| **Sewer-dragon** | 5 | +4 | +0 | 12 | +4 | 16 | Animal, Amphibious, Immune to Toxin, Never Stunned, Strong |
| **Shengrylla** | 6 | +2 | +0 | 10 | +3 | 12 | Animal, Expert Climber, Sharp Teeth |
| **Tangler** | 6 | +1 | +0 | 12 | +1 | 12 | Animal, Expert Climber, Ensnare |
| **Warbot** | 6 | +4 | +4 | 15 | +6 | 20 | Robot, Large, Immune to Control Robot, Multiple Shooting Attacks (3) *(sollte laut Errata mit indestructible Carbine bewaffnet sein)* |
| **Warp Hound** | 8 | +4 | +0 | 13 | +15 | 15 | Hatred of Gunfire, Immune to Critical Hits, Immune to Toxin, Never Stunned, Never Wounded, Powerful *(kein 'Animal'-Attribut — sentiente Alien-Spezies, siehe Errata)* |

### Kurzbeschreibungen (Flavor)

- **Bileworm**: bis 6m lange, knochenlose Würmer, verstecken sich in Raumschiff-
  Strukturen, spucken klebrige, säurehaltige, toxische Galle.
- **Bounty Hunter**: professionelle Kopfgeldjäger, angeheuert von Piratenflotten gegen
  unabhängige Crews.
- **Dedfurd**: amphibische, aufgeblasene Riesenfrösche mit toxischem Spuck-Schleim,
  wegen Anti-Gift-Gewebe gejagt.
- **Drone**: kleine fliegende Aufklärungsroboter, meist bei Tekkern/Robotics Experts.
- **Ferrox**: wolfsartige Raubtiere mit Fuchs-Instinkten, jagen in Rudeln.
- **Gaunch**: menschengroße Aasfresser mit Tarnhaut, meiden Licht.
- **Horat**: riesige wollige Nashörner, ehemalige Lasttiere, jetzt verwildert und
  aggressiv, hassen Schusswaffenlärm.
- **Magmite**: gepanzerte Krustentiere aus Vulkanumgebungen, spritzen Lava.
- **Mindgripper**: rochenartige Parasiten, springen auf den Kopf des Opfers und
  übernehmen dessen Kontrolle.
- **Pirate Shock Trooper / Pirate Trooper**: reguläre bzw. Elite-Truppen der
  Piratenflotten.
- **Primitive**: technologisch zurückgebliebene, isolierte Bevölkerungsgruppen.
- **Porigota**: insektoide, gezielt für Jagdsport ausgesetzte Kreaturen.
- **Repairbot**: harmlose Wartungsroboter mit rudimentärer Selbstverteidigung.
- **Ruffian**: Gang-Mitglieder, Kleinkriminelle, billige Bodyguards.
- **Ryakan**: fledermausartige Flugjäger, legen Eier auch in Raumschiffen ab.
- **Sentrabot**: simple Wach-Kampfroboter aus dem Last War, patrouillieren immer noch.
- **Sewer-dragon**: große, aggressive Echsen in Kanalisationen/Industriegebieten.
- **Shengrylla** ("Crazy Monkey"): dreiäugige Primaten, ernähren sich von elektrischer
  Energie, klettern hervorragend.
- **Tangler**: oktopusartige, hervorragend kletternde Kreaturen mit starkem Klammergriff.
- **Warbot**: schwerbewaffnete Kampfroboter aus dem Last War, extrem selten, extrem
  gefährlich.
- **Warp Hound** ("Spacer's Nightmare"): rätselhafte, durch den Raum "springende"
  Kreaturen, verschwinden bei ernsthafter Verwundung spurlos.

## Creature Attributes List

| Attribut | Regel |
|---|---|
| **Animal** | Natürliche Kreatur mit unter-menschlicher Intelligenz. Kann nicht mit Loot-Tokens interagieren, hat keine Gear-Slots. |
| **Amphibious** | Besteht Swimming Rolls automatisch, behandelt Wasser wie normales Gelände (kein Rough Ground), kein Fight-Malus im Wasser. |
| **Aquatic** | Lebt nur im Wasser, geht nie freiwillig an Land. An Land: Boden zählt als Rough Ground, bei jeder Aktivierung Will Roll (TN16) nötig, sonst 5 Schaden. Im Wasser: wie Amphibious (keine Swimming Rolls, kein Rough Ground, kein Fight-Malus). |
| **Bounty** | Zusätzliche, in der Kreaturbeschreibung genannte Belohnung beim Töten — wird automatisch der tötenden Crew gutgeschrieben. |
| **Burrowing** | Kann sich durch Terrain bewegen, als wäre es nicht da (muss aber genug Bewegung haben, um komplett durchzukommen — darf nicht im Terrain enden). Nie Bewegungsmalus durch Rough Ground. |
| **Chameleon** | Angeborene Tarnung. Keine LOS über 12" hinweg möglich. +3 Fight gegen Shooting-Angriffe von Pistol/Carbine/Shotgun/Rapid-Fire. |
| **Counting Coup** | Reduziert die Kreatur eine Crew-Figur (Shooting oder Combat) auf 0 Health, hat sie ihr Ziel erreicht — Figur wird vom Tisch entfernt (kein weiterer Effekt für die Kreatur). |
| **Ensnare** | Eine Figur in Combat mit dieser Kreatur darf nur zurückweichen/Push Back, wenn sie ihr tatsächlich Schaden zufügt — bloßes Gewinnen des Kampfes reicht nicht. |
| **Expert Climber** | Kein Bewegungsmalus beim Klettern. |
| **Flying** | Ignoriert alle Terrain-/Bewegungsmali, nie Fallschaden. Überfliegt Wasser ohne Swimming Roll (nur beim aktiven Eintauchen nötig). |
| **Hatred of Gunfire** | Ist eine Crew-Figur in LOS, die in dieser Runde bereits geschossen hat, ignoriert die Kreatur bei der Zielwahl für Move-Aktionen nähere Figuren, die nicht geschossen haben. |
| **Horns** | Bewegt sich die Kreatur in Combat und macht im selben Zug eine Fight-Aktion: +2 Fight nur für diesen einen Angriff. |
| **Immune to Critical Hits** | Nimmt nie Bonus-Schaden durch Critical Hits (Gegner gewinnt bei nat. 20 zwar automatisch, aber ohne Extra-Schaden). |
| **Immune to (Power)** | Immun gegen eine namentlich genannte Power — diese hat keinerlei Effekt/Schaden gegen die Kreatur. |
| **Immune to Toxin** | Gilt nie als vergiftet. |
| **Large** | −2 auf den Combat-Score gegen Shooting-Angriffe (leichter zu treffen). |
| **Lava Splash** | Würfelt ein Gegner in Combat mit dieser Kreatur eine **5 oder weniger** (vor Modifikatoren) auf seinen Fight-Wurf: sofort 2 Schaden durch Lavaspritzer. |
| **Levitate** | Kein Bewegungsmalus durch Rough Ground oder Klettern. |
| **Multiple Shooting Attacks (X)** | Darf pro Shooting-Aktion (X) Angriffe abfeuern: 1. Angriff normal gegen nächstes Ziel, 2. gegen zweitnächstes Ziel in LOS usw. Alle Angriffe außer dem ersten: **−2 Malus**. Weniger Ziele als X vorhanden → nur 1 Schuss pro tatsächlichem Ziel. |
| **Never Stunned** | Wird nie Stunned, unabhängig vom erlittenen Shooting-Schaden. |
| **Never Wounded** | Erleidet nie Wounded-Mali. |
| **Pack Hunter(s)** | Erscheinen mehrere gleichzeitig: werden in Basekontakt zueinander platziert. Bei Aktivierung: alle in Kontakt stehenden Pack-Hunter aktivieren/bewegen sich gemeinsam; 1 zufällig bestimmtes "Rudel-Leittier" bestimmt die Aktionen des gesamten Rudels. |
| **Possess** | Gewinnt die Kreatur Combat gegen eine Crew-Figur **mit** Schaden: übernimmt die Kontrolle — Figur gilt fortan als uncontrolled, bewegt sich mit der Kreatur mit. Die besessene Kreatur selbst kann nicht per Shooting angegriffen werden (nur die Wirtsfigur), nur im Nahkampf. Kreatur+Opfer unterstützen sich gegenseitig **nicht** als Supporting Figures. Nimmt die Kreatur Schaden, verliert sie den Griff (Push Back möglich); bei Verlust des Griffs oder Tod der Kreatur wird die Figur wieder normales Crew-Mitglied. |
| **Powerful** | Verursacht ×2 Schaden. |
| **Primitive Weapons** | −1 Damage (nicht für moderne Rüstungen ausgelegt). |
| **Ranged Attack** | Natürliche Fernkampf-Fähigkeit (Reichweite jeweils in der Kreaturbeschreibung genannt). |
| **Robot** | Nie Wounded; unterliegt zusätzlich allen sonstigen Roboter-Sonderregeln (siehe `01-crew-creation.md`). |
| **Sharp Teeth** | +1 Damage. |
| **Surprise Shot** | Schießt nicht in der eigenen Aktivierung. Stattdessen: sofortiger Shooting-Angriff, sobald eine andere Figur eine Move-Aktion innerhalb 12" und LOS ausführt — unterbricht die aktive Figur an dem Punkt, an dem LOS zuerst entsteht. Überlebt die Zielfigur, setzt sie ihre Bewegung/Aktionen normal fort. Pro Runde beliebig viele verschiedene Ziele möglich, aber **jede** Figur nur 1× pro Runde als Surprise-Shot-Ziel. |
| **Strong** | +2 Damage. |
| **Toxic** | Jeder Angriff dieser Kreatur ist toxisch; Kreatur selbst ist immun gegen Toxine. |
| **Unaggressive** | Solange bei Start-Health: einzige Aktion pro Runde ist 1 zufälliger Move; erzwingt nie Combat, bewegt sich nie absichtlich hinein (zufälliger Move in eine Figur hinein → 1" zurückversetzt, Aktivierung endet). Wird angegriffen, kämpft sie normal zurück. Sinkt sie unter Start-Health, gelten ab dann die normalen Uncontrolled-Creature-Regeln. Wird sofort aufgehoben, wenn die Kreatur extern kontrolliert wird. |

## Cross-References

- Aktivierungs-/Verhaltenslogik für alle uncontrolled Creatures: `07-core-rules-full.md`
  → *Creature Actions*.
- Konkrete Szenario-Einsätze dieser Kreaturen (Ferrox, Ryakan, Sewer-dragon, Magmite,
  Warbot, Repairbot, Shengrylla, Ruffian): `09-scenarios.md`.
- Bekannte Korrekturen (Mindgripper/Warp Hound kein 'Animal'-Attribut, Sentrabot-
  Schussverhalten, Warbot-Bewaffnung, Drones sollten 'Robot'-Attribut haben):
  `04-errata-faq-designer-notes.md`.
