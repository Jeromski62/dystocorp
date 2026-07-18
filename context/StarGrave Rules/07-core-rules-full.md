# Core Rules — Full Text (Chapter Two: "The Rules")

> Quelle: `StarGraveRulesbook.pdf` (Buchseiten 36–67, Kapitel 2) + Power-Mechanik-Intro
> (Buchseiten 102–105, Kapitel 4 "Power Descriptions"). Dies ist die **vollständige**
> Regel-Fassung — Ergänzung zur stark verdichteten `03-rules-quick-reference.md`. Enthält
> alle Rechenbeispiele, Kanten-/Sonderfälle und Begründungstexte, die für eine korrekte
> Regel-Engine relevant sind (z.B. exakte Zahlenbeispiele zu Combat/Shooting/Swimming/
> Falling, Multiple-Combat-Beispiele, Power-Move-Detailregeln, Armour Interference).

## Setting Up the Table

- Terrain zuerst aufbauen (entweder per Szenario aus `09-scenarios.md`, oder frei
  vereinbart für ein "Standard-Spiel"). Faustregel: dicht genug, dass eine Figur am Boden
  i.d.R. nicht mehr als ~30–60cm (1-2 Fuß) weit sehen kann; nie freie Sichtlinie von einer
  Tischkante zur gegenüberliegenden.
- **Table Edges**: höchster Würfelwurf wählt zuerst seine Startkante (bei 2 Spielern:
  Gegner nimmt automatisch die gegenüberliegende; bei mehr Spielern reihum nach
  Wurfergebnis). Bei sehr kleinen Tischen (2'×2') Startecken statt -kanten verwenden (auch
  3'×3' bei 4 Spielern).
- Aufstellung: Startspieler platziert seine ganze Crew innerhalb 2" der Startkante, aber
  mind. 6" von jeder anderen Kante entfernt (bzw. innerhalb 5" der Startecke bei
  Ecken-Setup).
- **Loot-Platzierung**: zuerst 1 Token exakt in Tischmitte, Typ per d20 (1–10 = Data-Loot,
  11–20 = Physical-Loot); Ideal: dieser Punkt ist ohne vorherige Bewegung nicht einsehbar.
  Danach platziert jeder Spieler (beginnend mit dem Spieler, der zuletzt seine Figuren
  aufstellte) je 1 Data-Loot- und 1 Physical-Loot-Token — jeweils mehr als die Hälfte der
  Tischtiefe von der eigenen Startkante entfernt und mind. 6" von jedem anderen Token
  entfernt (auch vertikaler Abstand zählt).

## The Turn

- **Initiative**: alle Spieler würfeln 1d20 zu Beginn jeder Runde. Höchster Wurf =
  Primary Player, danach absteigend Secondary Player usw. Gleichstand wird
  neu ausgewürfelt.
- Jede Runde hat 4 Phasen, in fester Reihenfolge: **Captain Phase → First Mate Phase →
  Soldier Phase → Creature Phase**. Nach der 4. Phase endet die Runde; ist das Spiel noch
  nicht vorbei, wird erneut um Initiative gewürfelt und eine neue Runde beginnt.

### Captain Phase
Primary Player aktiviert zuerst seinen Captain **plus bis zu 3 Soldiers**, die zu
**Beginn der Phase** innerhalb 3" **und** LOS des Captains standen (Reihenfolge frei
wählbar, Captain muss nicht zuerst aktivieren). Danach Secondary Player usw. Ohne
Captain auf dem Tisch: keine Aktivierung in dieser Phase möglich.

### First Mate Phase
Analog mit First Mate + bis zu 3 Soldiers (die noch nicht in der Captain Phase aktiviert
wurden — jede Figur maximal 1× pro Runde, außer ein Sondereffekt erlaubt explizit mehr).

### Soldier Phase
Alle noch nicht aktivierten Soldiers werden nacheinander (Reihenfolge frei wählbar)
aktiviert.

### Creature Phase
Alle **uncontrolled** Creatures aktivieren gemäß ihrer KI (siehe *Creature Actions*
unten). Creatures, die (auch nur temporär) Teil einer Crew sind, zählen als Soldier und
aktivieren entsprechend in einer der ersten drei Phasen.

## Activation

- Jede aktivierte Figur hat normalerweise **2 Aktionen**. Eine davon muss i.d.R. eine
  Move-Aktion sein (Ausnahmen sind explizit vermerkt). Die zweite Aktion: 2. Move
  (halbe Distanz), Fight, Shoot, Power aktivieren, oder ein sonstiger Sonderaktion.
- Reihenfolge der beiden Aktionen ist frei wählbar. Eine Figur muss nicht alle
  (oder überhaupt) Aktionen nutzen — Aktivieren und nichts tun ist erlaubt.
- Gibt es nur **1 Aktion** (z.B. durch Wounded/Stun), darf das eine beliebige erlaubte
  Aktion sein, nicht zwingend Move.
- Manche Aktionen **ersetzen** die Move-Aktion (wird jeweils explizit vermerkt); manche
  sind **Free Actions** (kosten gar keine Aktion).
- **Wichtig für die 3"/LOS-Prüfung**: maßgeblich ist der Zustand zu **Beginn der Phase**
  — ein Spieler darf nicht erst den Captain bewegen und dann einen Soldier aktivieren,
  der dadurch (erst nachträglich) in 3"-Reichweite gerät.
- Normalerweise muss eine Figur **alle** ihre Aktionen abschließen, bevor die nächste
  Figur aktiviert wird — außer bei **Group Activation**.

### Group Activation

Sonderfall, nur in Captain- oder First-Mate-Phase deklarierbar (siehe auch Errata in
`04-errata-faq-designer-notes.md`: nie verpflichtend).

- Alle Figuren, die in dieser Phase aktivieren, **müssen** Teil der Group Activation sein
  (kein Mischen mit Einzelaktivierung in derselben Phase).
- Jede beteiligte Figur muss **Move als erste Aktion** ausführen (keine andere Aktion
  vorher).
- Erst **nachdem alle Figuren bewegt wurden**, führt jede (in beliebiger, vom
  aktivierenden Spieler gewählter Reihenfolge) ihre zweite Aktion aus.
- Typischer Nutzen: mehrere Figuren gemeinsam in Nahkampf gegen ein Ziel bringen, LOS
  neu arrangieren, oder Figuren aneinander vorbeimanövrieren.

### Stat Rolls

Allgemeines Muster für alle nicht anderweitig geregelten Proben: **"Make a [Stat] Roll
(TN X)"** → 1d20 + Stat-Wert ≥ TN = Erfolg. Bei Move/Armour/Health (keine +/- Werte)
wird der aktuelle Wert direkt verwendet (bei Health: **aktuelle**, nicht Start-Health).
Bei Split Stats zählt der aktuelle (zweite) Wert.

**Automatischer Erfolg/Fehlschlag**: eine **ungemodifizierte** (native) 20 ist immer
Erfolg, auch wenn der Gesamtwert unter dem TN läge. Eine native 1 ist immer Fehlschlag.

**Maximaler Bonus (+10-Cap)**: der Gesamtbonus einer Figur auf **jeden** Würfelwurf
(Stat Roll, Combat Roll, Shooting Roll, Activation Roll etc.) ist auf **+10** gedeckelt,
egal wie viele Stat-Werte/Modifikatoren/Powers sich addieren.

## Movement

- Bei ≥2 Aktionen muss eine davon Move sein (Ausnahmen explizit vermerkt). Erste
  Move-Aktion: bis zu vollem Move-Stat in Zoll. Zweite (oder dritte, selten) Move-Aktion
  in derselben Aktivierung: bis zur **Hälfte** des Move-Stats.
- Bewegung muss nicht geradlinig sein; maßgeblich ist die tatsächlich zurückgelegte
  Strecke inkl. vertikaler Distanz.
- Basis-Messregel: von der Vorderkante der Base aus messen — die Vorderkante legt die
  maximale Distanz zurück, der Rest der Figur wird dahinter platziert (kein "Extra-
  Movement" durch Basisgröße erschleichen).
- **Figure Facing**: Figuren sehen immer in alle Richtungen und können sich jederzeit
  frei ausrichten — kostet keine Aktion, auch außerhalb der eigenen Aktivierung möglich.

### Obstructions

- Jedes Terrain darf grundsätzlich erklettert werden (außer ein Szenario sagt explizit
  etwas anderes). Kosten: **2" pro 1" (oder angebrochenem Zoll) Höhe**. Extra dafür
  gebaute Kletterhilfen (Treppen, Leitern) kosten keinen Aufschlag — volle Bewegung.
- Hängt eine Figur nach dem Klettern "in der Luft" (Miniatur lässt sich nicht sinnvoll
  platzieren): Figur unten an der Wand belassen + Markierung (z.B. Würfel) mit der
  Anzahl Zoll, die sie "hochhängt".
- **Rough Ground** (Trümmer, Krater, Schnee, Schlamm, flaches Wasser — Typ irrelevant):
  jeder (Teil-)Zoll zählt doppelt fürs Bewegungsbudget. Vor dem Spiel klären, was als
  Rough Ground gilt.
- **Movement Into Combat**: Kontakt mit einem gegnerischen Figur (Gegner oder
  uncontrolled Creature) = "In Combat". Kein Auto-Kampf — erfordert eine Fight-Aktion
  einer der beteiligten Figuren. Solange "In Combat": nur Fight oder Power-Aktivierung
  möglich, kein Move/Shoot/Gear-Nutzung — kann dazu führen, dass eine Figur in dieser
  Runde nur 1 Aktion hat.
- **Forcing Combat**: bewegt sich eine Figur auf 1" an eine bewegungsfähige gegnerische
  Figur heran, darf diese **Force Combat** erklären → wird sofort in Basekontakt gezogen,
  beide gelten als "In Combat". Kann an jedem Punkt der Bewegung ausgelöst werden.
  Uncontrolled Creatures nutzen dies **immer**, wenn möglich (außer ihre Beschreibung
  sagt etwas anderes). Figuren, die selbst schon in Combat sind oder sich nicht bewegen
  können, können nicht Force Combat auslösen.
- **Movement off the Table**: freiwilliges Verlassen (z.B. um Loot zu sichern) = Figur
  raus aus dem Spiel, kehrt nicht zurück. Figuren können **nie unfreiwillig** vom Tisch
  gedrängt werden (Push-back, Powers etc.) — in diesem Fall an der Kante stehen bleiben,
  außer eine Regel erlaubt es ausdrücklich.
- **Run For It!**: bei Aktivierung, vor jeder Aktion deklarierbar — sofort bis zu 3" in
  eine Richtung, ignoriert alle Bewegungsmodifikatoren; danach endet die Aktivierung
  sofort. Nicht innerhalb 1" eines gegnerischen Figurs erlaubt. Nicht nutzbar, wenn die
  Figur in Combat aktiviert, in tiefem Wasser ist, oder ohnehin 0 Aktionen hätte.

### Jumping

Sprung bis zu beliebiger Distanz, sofern vorher die gleiche Distanz geradlinig
zurückgelegt wurde und die Gesamtbewegung das Aktivierungslimit nicht überschreitet.
Sprungdistanz zählt gegen das Bewegungsbudget. Ohne vorherige Bewegung: max. 1"
Sprung. Bewegungs-Aktionen dürfen für die Sprungberechnung kombiniert werden (z.B.
Move 6 über 2 Aktionen: 4.5" laufen + 4.5" springen).

### Falling

- <3" Fallhöhe: kein Effekt.
- ≥3": Schaden = Fallhöhe in Zoll **× 1.5, abgerundet** (Bsp.: 5" Fall → 7 Schaden).
- Freiwilliges Fallen zählt als Move-Aktion und gegen das Bewegungsbudget; übersteigt die
  Fallstrecke den Move-Stat, verbraucht der Fall alle Aktionen (Figur wird platziert,
  Aktivierung endet sofort). Schaden wird auch bei freiwilligem Fallen normal angewendet.
- Steht eine Figur <1" von einer Kante entfernt und wird ≥1" in Richtung dieser Kante
  zurückgestoßen, fällt sie automatisch.

### Swimming

- Wasser: **Shallow** (zählt als Rough Ground, sonst kein Malus; Default-Annahme sofern
  nicht anders angegeben) vs. **Deep** (muss geschwommen werden).
- Jede Aktivierung in tiefem Wasser: **Swimming Roll** = Will Roll (TN5) + Modifikatoren
  (Tabelle unten).
  - Erfolg → normale Aktivierung.
  - Fehlschlag → **0 Aktionen** diese Runde **und** Schaden = Betrag, um den die Probe
    misslang. Roboter, Figuren mit Filter Mask, oder Figuren ohne Atmungsbedarf nehmen
    bei Fehlschlag **keinen Schaden**, verlieren aber trotzdem die Aktionen.

| Umstand | Modifikator |
|---|---|
| Trägt Physical-Loot | −2 |
| Light Armour | −2 |
| Heavy oder Combat Armour | −3 |
| Robot | −3 |

- Deep Water zählt als Rough Ground für Bewegung. Kampf im tiefen Wasser: **−2 Fight**
  für beide Beteiligten.
- Figuren mit Aquatic, Amphibious, Flying oder Levitate: keine Swimming Rolls nötig,
  keine Bewegungsmali in Wasser (flach/tief), kein Fight-Malus im Wasser. Creatures ohne
  eine dieser Fähigkeiten betreten nie freiwillig tiefes Wasser und ignorieren Figuren
  darin bei der Zielbestimmung.
- **Keine Shooting-Angriffe** aus tiefem Wasser heraus möglich — Powers (auch solche,
  die einen Shooting-Angriff erzeugen) funktionieren aber normal.

## Combat (Melee)

Beide Figuren würfeln 1d20 + Fight-Stat + Modifikatoren (max. +10 gesamt). Höherer
Wert gewinnt (**Gleichstand → beide gelten als Gewinner und fügen Schaden zu**).

Schadensberechnung: Fight-Gesamtwert des Gewinners − Armour-Stat des Verlierers (nach
Anwendung von Damage-Modifikatoren wie Knife −1, und Damage-Multiplikatoren
mancher Kreaturen ×2/×3/halbiert) = Schaden, falls >0 (sonst 0).

**Ablauf-Zusammenfassung** (kanonische Reihenfolge):
1. Beide Figuren würfeln 1d20.
2. Beide addieren Fight-Stat + alle sonstigen Fight-Boni (Powers, unterstützende Figuren).
3. Gewinner per Vergleich bestimmen.
4. Damage-Modifikatoren (z.B. −1 Knife) auf den finalen Fight-Wert des Gewinners anwenden.
5. Armour des Verlierers subtrahieren.
6. Damage-Multiplikatoren anwenden (seltene Kreaturen: ×2/×3 oder halbiert).
7. Ergebnis >0 → so viele Punkte vom Health des Verlierers abziehen; ≤0 → kein Schaden.
8. Gewinner entscheidet: **Remain in Combat** oder **Push Back** (sich selbst oder den
   Gegner) um 1" direkt von der jeweils anderen Figur weg.

**Maximum Armour**: der Armour-Stat einer Figur ist hart auf **14** gedeckelt, egal
welche Kombination aus Gear/Boni/Modifikatoren.

**Push Back Details**: Bewegung 1" direkt weg vom Gegner, ignoriert Rough-Ground-Mali,
aber nicht durch Wände/Barrieren möglich. Kann eine Figur über eine Kante drücken
(→ Falling-Regeln). Danach gelten beide **nicht mehr** als "In Combat". Hat die
kampfinitiierende Figur noch eine zweite Aktion übrig, kann sie diese nun nutzen
(meist nur noch Move, da die non-move-Aktion bereits verbraucht ist). Bei Gleichstand
bleibt die Figur zwingend in Combat (kein Push Back möglich). Gewinnt eine Figur gegen
einen Gegner, ist aber noch mit einem weiteren Gegner in Combat, darf sie **nicht**
zurückweichen — nur "Remain" oder den (besiegten) Gegner zurückdrängen.
Push Back ist (abgesehen von Powers) i.d.R. der einzige Weg, Combat zu verlassen.

### Multiple Combats

Eine Figur in Combat mit mehreren Gegnern muss bei einer Fight-Aktion **ein** Ziel
nominieren.

| Umstand | Modifikator | Regel |
|---|---|---|
| Supporting Figure | +2 (kumulativ) | Jede freundliche Figur, die ebenfalls mit dem Zielfigur in Combat ist und **nicht** zusätzlich mit einer anderen Figur in Combat steht, gibt +2 (bis zu 3 Unterstützer = +6, harte Obergrenze **+6**). Pro Gefecht kann **nur eine Seite** netto profitieren: gleich viele/gleichwertige Unterstützer beider Seiten heben sich gegenseitig auf (z.B. beide +2 → beide 0; eine Seite +4 vs. andere +2 → Differenz: erste kämpft an +2, zweite an +0). |

**Kernregeln bei Gefechts-Clustern** (aus den Buchbeispielen destilliert):
- Nur die zwei tatsächlich kämpfenden Figuren (Angreifer + nominiertes Ziel) können
  gewinnen/verlieren und Schaden nehmen.
- Unterstützung durch weitere Figuren kostet **keine** zusätzliche Aktion.
- Modifikatoren durch Unterstützer heben sich rechnerisch gegenseitig auf — es kann nie
  passieren, dass **beide** Seiten gleichzeitig einen Support-Bonus behalten.
- Uncontrolled Creatures zählen für die Support-Berechnung als "friendly" zu jeder Seite,
  die sie ebenfalls bekämpfen will (siehe Buchbeispiel 5: eine dritte Partei, die mit
  Figur B1 kämpft, unterstützt sowohl A1 als auch A2 gegen B1, obwohl sie technisch
  "neutral" ist).
- Maximaler Fight-Roll-Bonus bleibt immer bei **+10** gedeckelt.

## Shooting

Voraussetzung: Ziel muss **In Range** und **In Line of Sight** sein (Kopf oder Torso
sichtbar = LOS gegeben). Figuren in Combat dürfen nicht schießen.

**Ablauf:**
1. Shooter würfelt 1d20 + Shoot-Stat (+ Modifikatoren).
2. Ziel würfelt 1d20 + Fight-Stat (+ Verteidigungsmodifikatoren).
3. Höherer Wert gewinnt; bei Gleichstand oder Ziel gewinnt → Fehlschuss.
4. Bei Treffer: Shooting-Gesamtwert − Armour-Stat des Ziels = Schaden (falls positiv).
5. **≥4 Schaden aus einem einzelnen Shooting-Angriff → Ziel ist Stunned** (gilt auch für
   Flamethrower- und Grenade-Angriffe).

Powers, die einen Shooting-Angriff erzeugen, nutzen **nicht** den Shoot-Stat der Figur,
sondern den in der Power-Beschreibung genannten Bonus (z.B. Dark Energy: +5 statt
Shoot-Stat). Eine Figur darf eine solche Power auch **während sie selbst in Combat ist**
aktivieren.

### Modifiers to Shooting

Alle Modifikatoren werden auf den **Fight-Wurf des Ziels** angerechnet (Ausnahme:
Hasty Shot/Cleared Jam gelten für den **Shooting-Wurf** des Schützen).

| Umstand | Modifikator | Notiz |
|---|---|---|
| Intervening Terrain | +1 (kumulativ) | Pro Geländestück zwischen Schütze und Ziel. Terrain in Basekontakt mit dem Ziel zählt stattdessen als Cover. Terrain in Basekontakt mit dem *Schützen* zählt nicht als Intervening (kann aber weiterhin LOS blockieren). |
| Hasty Shot | +1 | Schütze hat sich in dieser Aktivierung bereits bewegt. |
| Cleared Jam | +1 | Schütze hat in dieser Aktivierung bereits einen Jam behoben. |
| Light Cover | +2 | Solid Cover, das einen Teil des Körpers deckt, ODER Soft Cover, das ≥ die Hälfte des Körpers deckt. |
| Stunned | +2 | Ziel ist aktuell Stunned. |
| Heavy Cover | +4 | Solid Cover, das ≥ die Hälfte des Körpers deckt. |
| Large Target | −2 | Ziel ist besonders groß/breit (i.d.R. Kreaturen mit 'Large'-Attribut). |

Gegnerische Figuren gelten selbst als Intervening Terrain/Cover — es kann nicht durch
oder über eine Figur hinweg auf eine andere geschossen werden.

**Cover-Faustregel** (Design-Hinweis aus dem Buch): Cover-Fragen sind oft strittig — im
Zweifel für den Verteidiger entscheiden.

### Shooting Into Combat

Eine Figur "In Combat" kann nicht direkt als Ziel gewählt werden — nur der Combat als
Ganzes. Vorgehen: zufällig auswürfeln, welche der am Combat beteiligten Figuren
tatsächlich getroffen wird (danach zwingende Durchführung, auch gegen eigene Figuren).
Jeder Combat, in dem mind. 1 Figur sichtbar ist, darf als Ziel gewählt werden — auch
wenn die letztlich getroffene Figur selbst nicht in LOS des Schützen steht. Bei
Flächenangriffen (Grenades, Flamethrower): **kein** Zufallsziel — stattdessen separater
Angriff gegen **jede** Figur im Wirkungsbereich, sofern mind. 1 im Combat betroffen ist.

### Shooting with a Flamethrower

Statt Reichweite/LOS zu prüfen: Template anlegen (spitzes Ende an die Base des
Schützen, restliche Ausrichtung frei wählbar). Separater Shooting-Angriff gegen jede
vom Template berührte Figur. Nur **Solid Cover** zählt gegen Flamethrower-Angriffe;
Figuren komplett hinter solidem Terrain verborgen werden nicht getroffen.

### Throwing and Firing Grenades

1. Zielpunkt festlegen (muss nicht in LOS liegen, aber innerhalb Maximalreichweite und
   über einen Bogen erreichbar — z.B. über eine Mauer, aber nicht durch ein Dach; durch
   eine Öffnung/ein Fenster nur, wenn diese Öffnung selbst in LOS liegt).
2. **Shoot Roll (TN12)** inkl. Modifikatoren (Tabelle unten).
3. Erfolg → Treffer am Zielpunkt: Smoke-Grenade platziert Rauch zentriert auf dem Punkt;
   Fragmentation-Grenade löst separate **+3 Shooting-Angriffe** gegen jede Figur
   innerhalb **1.5"** des Zielpunkts aus (Cover wird vom Zielpunkt aus berechnet, nicht
   von einer Figur-Base).
4. Fehlschlag → Zielpunkt verschiebt sich zufällig um so viele Zoll, wie die Probe
   misslang (max. 6"); bei einem Fehlschlag von mehr als 6 wird der Zielpunkt komplett
   entfernt (kompletter Fehlwurf, kein Effekt).

| Situation | Modifikator zum Shoot Roll |
|---|---|
| Zielpunkt liegt in LOS | +2 |
| Hasty Shot (bereits Move-Aktion in dieser Aktivierung) | −1 |
| Abfeuern mit Grenade Launcher | −1 |

## Extreme Results

- **Critical Hits**: eine native 20 beim Combat- oder Shooting-Wurf = automatischer
  Sieg/Treffer **+5 Bonus-Schaden**. Würfeln beide Nahkampf-Parteien eine native 20,
  treffen beide (mit jeweiligem Bonus-Schaden). Würfelt das **Ziel** eines Shooting-
  Angriffs eine native 20, verfehlt der Schuss **immer** — selbst wenn der Schütze
  ebenfalls eine native 20 hatte.
- **Weapon Jams**: native 1 bei einem Shooting-Wurf = Munition leer/Waffe blockiert.
  Figur muss eine Aktion aufwenden, um die Waffe zu warten, bevor erneut geschossen
  werden kann (diese Aktion darf die Pflicht-Move-Aktion ersetzen). Gilt nur für den
  **ersten** Shoot Roll eines Flamethrower-Angriffs bzw. den initialen Shoot Roll bei
  Grenade-Launcher-Nutzung; gilt **nicht** für Grenades allgemein.

## Damage

Schaden wird immer sofort vom aktuellen Health abgezogen. ≤0 Health → Figur ist
"getötet" (vom Tisch entfernt); im Kampagnenmodus ggf. nicht wirklich tot, siehe
`08-campaigns.md`.

### Stun

- **≥4 Schaden aus einem einzelnen Shooting-Angriff** (inkl. Flamethrower/Grenade) →
  Stunned (markieren, z.B. Token oder Figur umlegen).
- Stunned-Figuren erhalten **+2 Fight** gegen Shooting-Angriffe (maximale
  Deckungsnutzung).
- Beim nächsten Aktivieren dieser Figur: Markierung entfernen, Figur ist nicht mehr
  Stunned, erhält aber **max. 1 Aktion** in dieser Aktivierung.
- Wird eine Stunned-Figur von einer anderen Figur in Combat gezogen: Markierung/Stun
  sofort aufgehoben, aber die Figur erleidet **−2 Fight** auf ihren Combat Roll, falls die
  aktive Figur in derselben Aktivierung eine Fight-Aktion durchführt.
- **Nur Shooting-Angriffe** verursachen Stun — niemals Nahkampf (siehe auch Errata:
  "I ain't got time to bleed…").

### Wounded

- Health ≤ **4** (unabhängig vom Start-Health) → Wounded: nur noch **1 Basis-Aktion**
  pro Aktivierung (beliebige erlaubte Aktion, nicht zwingend Move), zusätzlich **−2 auf
  alle Würfelwürfe**.
- Wird die Figur wieder über 4 Health geheilt, endet Wounded.
  Eine Figur, die mit ≤4 Start-Health ins Spiel geht, gilt **nicht** initial als Wounded,
  sondern erst nach dem ersten Health-Verlust.
- **Roboter unterliegen nie der Wounded-Regel.**

### Toxins

- ≥1 Schaden aus einer toxischen Quelle (Gift, Biss, Gas, oder Angriff mit
  Toxic-Attribut) → vergiftet: nur noch **1 Basis-Aktion** pro Aktivierung (beliebige
  Aktion).
- Heilung: nur vollständige Heilung zurück auf Start-Health, oder eine Power/Item, die
  Gift explizit heilt. Gift hält bis Szenario-Ende an; zu Beginn des nächsten Szenarios
  gilt die Figur als erholt.
- Mehrfachvergiftung hat keinen zusätzlichen Effekt (max. 1x "vergiftet" gleichzeitig).
  Ist eine Figur durch eine andere Regel bereits auf 1 Aktion reduziert, hat Gift keinen
  zusätzlichen Effekt. Wounded + Poisoned zusammen: weiterhin nur 1 Aktion (kein
  Stacking auf 0).

## Powers — Mechanik im Detail

Captains/First Mates dürfen pro Aktivierung **höchstens 1 Power** aktivieren (eine
Aktion). Powers dürfen auch **in Combat** aktiviert werden. Keine Nutzungsbegrenzung
pro Spiel, außer explizit vermerkt.

### Aktivierung: Erfolg/Fehlschlag

1d20 ≥ Activation Number der Power = Erfolg. Bei Fehlschlag darf trotzdem ein Power
Move ausgeführt werden.

### Exertion

Nach dem Activation-Wurf, aber vor Ergebnisfeststellung: der Aktivator darf Health
1:1 gegen den Wurf eintauschen ("Exert") — z.B. bei Verfehlen um 3 Punkte: 3 Health
zahlen → Power aktiviert trotzdem.

### Strain

Bei erfolgreicher Aktivierung: sofortiger Schaden = Strain-Wert der Power (0 = kein
Effekt). Eine Power darf **nicht** aktiviert werden, wenn ihr Strain-Wert ≥ dem
verbleibenden Health der Figur ist. Exertion und Strain können sich addieren, aber eine
Power darf nie aktiviert werden, wenn die Summe aus Exertion + Strain die Figur auf 0
oder weniger Health bringen würde.

### Power Move

Bei Aktivierung einer Power (die Aktion selbst) erhält die Figur zusätzlich einen
**kostenlosen 3"-Move**, ausführbar vor **oder** nach dem Aktivierungsversuch — hat
keinen Einfluss auf Erfolg/Fehlschlag der Power. Nicht ausführbar, während die Figur in
Combat ist (es sei denn, die Power befreit sie zuerst daraus). Aktivierungsversuch +
Power Move zusammen zählen als die **eine** Nicht-Move-Aktion der Aktivierung — die
zweite Aktion der Figur kann trotzdem noch ein voller regulärer Move sein. Der Power
Move unterliegt allen normalen Bewegungsmodifikatoren (Rough Ground, Klettern etc.)
und kann durch **keine** andere Aktion ersetzt werden (auch nicht durch Aktionen, die
sonst eine Move-Aktion ersetzen dürfen, z.B. Jam-Behebung).

### Cancelling Powers

Powers mit andauerndem Effekt ohne explizit genannte Dauer wirken bis **Spielende**.
Der Aktivator kann sie nicht selbst abschalten, außer die Power erlaubt das
ausdrücklich. Verlässt der Aktivator den Tisch oder stirbt, endet die Power **nicht**
automatisch (Ausnahme: Zielfigur selbst wird entfernt → Effekt wird irrelevant).

### Targeting Figures in Combat with Powers

- Powers, die einen **Shooting-Angriff erzeugen** und eine Figur in Combat als Ziel
  haben: zufällige Zielbestimmung unter den Combat-Teilnehmern — **außer** der
  Aktivator selbst ist Teil desselben Combats, dann darf gezielt werden (kein Zufall).
- Powers **ohne** Shooting-Angriff dürfen Figuren in Combat immer gezielt treffen.

### Power-Kategorien (vollständige Definitionen)

| Kategorie | Regel |
|---|---|
| **Line of Sight** | Ziel muss in LOS des Aktivators liegen (Aktivator selbst zählt auch als gültiges Ziel). Sofern nicht anders angegeben: **maximale Reichweite 24"**. |
| **Self Only** | Wirkt ausschließlich auf die aktivierende Figur selbst. |
| **Touch** | Aktivator muss innerhalb **1"** und LOS des Ziels sein. Darf auf sich selbst angewendet werden. |
| **Out of Game (A)** | Nur **nach** einem Spiel nutzbar (Post-Game Sequence). Ein Versuch pro Gelegenheit. Kein Exertion möglich. |
| **Out of Game (B)** | Nur **vor** Spielbeginn nutzbar. Ein Versuch pro Gelegenheit. Kein Exertion möglich. |

Manche Powers haben mehrere zulässige Kategorien — der Spieler wählt situativ, welche
angewendet wird.

### Armour Interference

Powers mit dem Tag **"(Armour Interference)"** in ihrer Beschreibung (siehe
`02-powers-catalog.md`): die aktivierende Figur erleidet einen **Malus auf den
Activation Roll in Höhe ihres Armour-Bonus aus getragener Rüstung** (Light Armour →
−1, Heavy Armour → −2, Combat Armour → −4). Der Malus gilt **nur** für tatsächlich
getragene Rüstung, nicht für sonstige Armour-Boni durch Powers oder Advanced
Technology.

## Collecting Loot Tokens

- 2 Typen: **Data-Loot** (Infos, Schematics, digitale Währung) und **Physical-Loot**
  (Geld, Ware, Artefakte) — visuell unterscheidbar markieren.
- Ein Loot-Token darf **nicht bewegt werden**, solange es nicht entsperrt (unlocked) ist.
- **Unlock**: Figur in Basekontakt spendiert eine Aktion, **Will Roll (TN14)**.
  Fehlschlag = nichts passiert. Erfolg = Token entsperrt.
  - Physical-Loot: die entsperrende Figur darf es **als Free Action** (Teil derselben
    Aktion) direkt aufheben; jede andere Figur braucht dafür eine eigene Aktion.
  - Data-Loot: **immer** eine eigene Aktion zum Aufheben nötig (auch für die
    entsperrende Figur selbst — siehe Errata).
- Aufheben nie möglich, wenn eine gegnerische Figur innerhalb 1" ist.
- Eine Figur trägt max. **1** Loot-Token gleichzeitig.
  - Data-Loot: kein Malus.
  - Physical-Loot: Move halbiert, **−1 Fight, −1 Shoot** (encumbered).
- **Fallenlassen**: 1 Aktion (darf die Pflicht-Move-Aktion ersetzen); Figur und Token
  werden leicht getrennt platziert (nicht mehr in Kontakt); danach kann jede
  **freundliche** Figur es mit einer Aktion aufheben (Gegner können es wegen der
  räumlichen Nähe zur ablegenden Figur nicht sofort aufheben). Stirbt eine
  loot-tragende Figur, bleibt der Token an der Stelle liegen.
- Verlässt eine loot-tragende Figur den Tisch über eine beliebige Kante: Loot gilt als
  **gesichert** für diese Crew; Figur + Loot sind aus dem Spiel.
- Loot-Tokens sind **kein Gear** — belegen keinen Gear-Slot, unabhängig von
  verfügbaren Slots. Blockieren nie LOS, geben kein Cover, behindern keine Bewegung
  (solange nicht getragen).

## Creature Actions — vollständige KI

Kreaturen ohne Crew-Zugehörigkeit ("Uncontrolled Creatures") greifen sich nie
gegenseitig an und gelten nie als gegenseitig "in Combat" (auch bei Base-Kontakt).
Sie erzwingen **immer** Combat mit jeder Crew-Figur, die auf 1" herankommt.

Bearbeitung: Kreaturen werden **absteigend nach Health** einzeln durchgegangen. Pro
Aktion wird der Entscheidungsbaum neu durchlaufen (Situationen können sich zwischen
den beiden Aktionen ändern, z.B. neues, näheres Ziel wird während der ersten
Bewegungsaktion sichtbar).

```
1. Ist die Kreatur bereits In Combat?
   JA → Fight-Aktion. Gewinn → bleibt in Combat. Bei mehreren Gegnern:
        greift den mit dem niedrigsten aktuellen Health an.
   NEIN → weiter zu Schritt 2.

2. Ist ein Crew-Mitglied in LOS?
   JA → Hat die Kreatur eine Fernwaffe UND ein Crew-Mitglied ist in Reichweite:
        schießt auf das nächstgelegene gültige Ziel; keine zweite Aktion.
        Hat die Kreatur KEINE Fernwaffe (bzw. kein Ziel in Reichweite, siehe
        Errata): bewegt sich so weit wie möglich auf die nächste sichtbare
        Figur zu (klettert bei Bedarf). Erreicht sie die Figur mit der ersten
        Aktion, folgt eine Fight-Aktion als zweite Aktion.
   NEIN → weiter zu Schritt 3.

3. Zielpunkt oder Zufallsbewegung
   Hat das Szenario einen Target Point: 1 Bewegung darauf zu.
   Kein Target Point: Zufallsrichtung bestimmen, volle Move-Distanz in diese
   Richtung. Trifft die Kreatur auf ein Hindernis (auch Tischkante — Kreaturen
   verlassen den Tisch NIE durch Zufallsbewegung): Bewegung stoppt dort.
   Bleibt danach eine Aktion übrig: Schritt 2 erneut prüfen — kein Ziel
   gefunden → Aktivierung endet ohne zweite Aktion; sonst normal mit Schritt 2
   fortfahren.
```

(Randnotiz: die kondensierte `03-rules-quick-reference.md` verwendet "Random
Movement" synonym zu Schritt 3 und benennt den optionalen "Target Point"-Fall nicht
separat — beide Versionen sind konsistent, die Vollversion hier ergänzt nur den
Szenario-Spezialfall mit festem Zielpunkt.)

## Ending the Game

Ein Spiel endet, sobald **eine** dieser Bedingungen eintritt:
- Das **letzte** Loot-Token wurde vom Tisch bewegt (alle verbleibenden Figuren gelten
  als sicher heimgekehrt).
- Nur noch **ein** Spieler hat Figuren auf dem Tisch (Rest tot/abgezogen). Dieser Spieler
  sichert automatisch alle von seiner Crew getragenen Loot-Tokens; für jeden
  **unbeanspruchten** Token auf dem Tisch: d20-Wurf, bei **15+** wird er zusätzlich
  gesichert, sonst geht er verloren.
- (Extrem selten) Kein Spieler hat mehr Figuren auf dem Tisch → Spiel endet, alle
  verbleibenden Loot-Tokens gehen verloren.
- Manche Szenarien haben eigene, explizite Abbruchbedingungen (siehe `09-scenarios.md`).

**Sieger-Bestimmung**: In Nicht-Kampagnen-Spielen gewinnt, wer am meisten Loot
gesichert hat. Im Kampagnenmodus gibt es i.d.R. **keine** feste Sieg-/Niederlage-
Bedingung — jeder Spieler bewertet selbst, ob sein Captain "gewonnen" hat.

## Cross-References

- Kondensierte Fassung dieser Regeln: `03-rules-quick-reference.md`.
- Waffen-/Rüstungsdetails referenziert oben: `06-general-equipment.md`.
- Volle Power-Texte inkl. "(Armour Interference)"-Kennzeichnung pro Power:
  `02-powers-catalog.md`.
- Was nach dem Spiel passiert (Injury/Death, XP, Loot-Bestimmung, Ship-Ausbau):
  `08-campaigns.md`.
- Kreatur-Statblöcke und -Attribute (Large, Toxic, Aquatic, Amphibious, Flying,
  Levitate etc.): `10-bestiary.md`.
