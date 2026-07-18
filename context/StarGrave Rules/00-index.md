# Stargrave — Context Index

Dieses Verzeichnis enthält die Regel-Inhalte des Tabletop-Skirmish-Spiels **Stargrave**
(Osprey Games, Regeldesign: Joseph A. McCullough), extrahiert aus den offiziellen
PDF-Downloads und als Markdown aufbereitet, damit sie als Kontext für die Entwicklung
einer Begleit-App (z.B. Crew-Builder, Kampagnen-Tracker, Power-Nachschlagewerk) genutzt
werden können.

## Quelldateien (Original-PDFs)

| PDF | Inhalt | Umfang |
|---|---|---|
| `stargrave_crew_creation.pdf` | Kapitel 1 "Assembling a Crew" (Vorschau-Kapitel, Auszug) | Buchseiten 11–28 |
| `stargrave-quick-reference.pdf` | Kern-Regeln als Schnellreferenz (Aktivierung, Bewegung, Kampf, Schießen, Loot, Kreaturen-KI, Post-Game) | Buchseiten 172–176 |
| `stargrave-powercards (1).pdf` | Vollständiger Katalog aller "Powers" (Fähigkeiten) alphabetisch, im Karten-Format | 7 Seiten, 52 Powers |
| `stargrave-errata.pdf` | FAQ, Errata & Designer Notes (Stand: Dezember 2021) | 2 Seiten |
| `stargrave-crew-sheet-form-fillable.pdf` | Ausfüllbares Crew-Sheet-Formular (Layout/Datenfelder) | 2 Seiten |
| `StarGraveRulesbook.pdf` | **Vollständiges Regelbuch** (alle Kapitel, 177 Seiten) — Quelle für 06–10 unten | Buchseiten 1–176 |

Die ersten fünf PDFs waren kostenlose Einzel-Downloads (Vorschau-Kapitel, Schnellreferenz,
Power-Karten, Errata, Formular). `StarGraveRulesbook.pdf` ist das komplette Regelbuch und
liefert alles, was in den Einzel-Downloads fehlte (volle Regeltexte, Ausrüstungsliste,
Kampagnen-/Loot-Tabellen, Szenarien, Bestiary).

## Aufbereitete Markdown-Dateien

| Datei | Inhalt | Nützlich für |
|---|---|---|
| [01-crew-creation.md](01-crew-creation.md) | Captain/First-Mate-Erstellung, 8 Hintergründe (Backgrounds), Stat-System, Soldaten-Rekrutierung, Ausrüstung, Roboter | Charakter-/Crew-Erstellungslogik der App |
| [02-powers-catalog.md](02-powers-catalog.md) | Alle Powers mit Activation, Strain, Typ (Self Only / Line of Sight / Touch / Out of Game A/B) und vollem Text | Power-Datenbank, Auswahl-UI, Regel-Validierung |
| [03-rules-quick-reference.md](03-rules-quick-reference.md) | Spielablauf, Aktivierung, Bewegung, Nahkampf, Schießen, Waffentabelle, Loot, Kreaturen-KI, Post-Game-Sequenz (kondensiert) | Spiel-Engine / Regel-Automatisierung |
| [04-errata-faq-designer-notes.md](04-errata-faq-designer-notes.md) | Offizielle Klarstellungen & Korrekturen zu den Grundregeln | Edge-Cases, Validierungslogik |
| [05-crew-sheet-data-model.md](05-crew-sheet-data-model.md) | Aus dem Formular abgeleitetes Datenmodell (Felder, Tabellen) inkl. Vorschlag für ein JSON-Schema | Datenbank-/State-Design der App |
| [06-general-equipment.md](06-general-equipment.md) | Vollständige Ausrüstungsliste: Equipment, Waffen (inkl. Rapid-Fire-/Flamethrower-Detailregeln), Rüstung | Gear-Auswahl bei Crew-Erstellung, Waffen-Datenbank |
| [07-core-rules-full.md](07-core-rules-full.md) | **Volltext** aller Kernregeln (Setup, Turn, Activation, Movement, Combat, Shooting, Damage, Powers-Mechanik inkl. Armour Interference, Loot, Creature-KI, Spielende) mit Rechenbeispielen | Präzise Regel-Engine, Kanten-/Sonderfälle |
| [08-campaigns.md](08-campaigns.md) | Injury/Death-Tabellen, Permanent Injuries, XP & Level-System, volle Loot-Tabellen (Data-/Physical-Loot, Advanced Weapons, Advanced Technology I+II, Alien Artefacts je mit Item-Texten), Spending Loot, Ship-Upgrades | **Kampagnen-Tracker-Feature** (Kernstück) |
| [09-scenarios.md](09-scenarios.md) | 10 vorgefertigte Szenarien mit Setup/Sonderregeln/Loot-XP-Boni + Zufallstabelle | Szenario-Auswahl/-Generator, Session-Log |
| [10-bestiary.md](10-bestiary.md) | 22 Kreatur-Statblöcke, Random-Encounter-/Unwanted-Attention-Tabellen, volle Attribut-Liste | Kreaturen-Datenbank (für späteren Spiel-Begleiter-Modus) |

## Kurzüberblick über das Spiel

Stargrave ist ein rundenbasiertes Sci-Fi-Skirmish-Tabletop für 2 Spieler (mit Kampagnen-Modus).
Jeder Spieler führt eine kleine **Crew** (max. 10 Mitglieder: 1 Captain, 1 First Mate, bis zu
8 Soldiers, davon max. 4 Specialists), die auf Missionen Loot-Token sammelt und dabei gegen
die Crew des Gegners und/oder KI-gesteuerte Kreaturen kämpft. Captain und First Mate haben
individuelle Stats und wählbare "Powers" (magisch/technologisch/psionisch), Soldiers haben
feste Statblöcke aus Tabellen. Zwischen Spielen (Kampagnen-Modus) werden Erfahrung, Level,
Verletzungen und Loot verwaltet.

Zentrale Spielwerte pro Figur: **Move, Fight, Shoot, Armour, Will, Health** (siehe
[01-crew-creation.md](01-crew-creation.md#stat-line)).
