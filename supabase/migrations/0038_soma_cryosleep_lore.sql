-- Adds the Kryoschlaf-disruption paragraph to SOMA's placeholder lore from
-- 0037_seed_soma_corp.sql. Full replace (not append) so this stays idempotent
-- if ever re-run.
update corps
set lore_markdown = $corp$SOMA Entertainment kontrolliert nahezu jeden Kanal, über den die Bevölkerung der besiedelten Systeme sich ablenkt, betäubt oder berieseln lässt -- von Neural-Feed-Serien über vollimmersive Simulationen bis zu den Arena-Übertragungen, in denen andere Mega Corps ihre Konflikte öffentlichkeitswirksam austragen.

Was als Streaming-Plattform begann, ist heute ein Sensorium-Imperium: SOMA lizenziert nicht nur Inhalte, sondern die Aufmerksamkeit selbst.

Den entscheidenden Schlag gegen die Konkurrenz landete SOMA mit der disruptiven Übernahme des Kryoschlaf-Sektors für Langstrecken-Raumreisen: Wer eine Kolonie am anderen Ende des Systems ansteuert, verbringt die Reise in SOMA-patentierten Kryokapseln und erlebt dabei von SOMA produzierte Traumfeeds direkt ins schlafende Bewusstsein. Diese Kontrolle über Milliarden Stunden ungeteilter, wehrloser Aufmerksamkeit hat SOMAs Marktführerschaft im Unterhaltungssektor endgültig zementiert.

[corrupted data] -- weitere Hintergrundinformationen zu SOMA Entertainment folgen.$corp$
where key = 'soma';
