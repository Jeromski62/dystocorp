-- Seed: third Mega Corp, SOMA Entertainment. No source lore doc exists yet
-- under context/DystoCorp/Mega Corps/ (unlike yugure/bionex_connect in
-- 0010_seed_corps.sql) -- lore_markdown below is a placeholder, same spirit
-- as the "Kommt noch" placeholders already used on the dossiers/subcontractor
-- intel pages, meant to be replaced once real lore exists.
insert into corps (key, name, sector, lore_markdown, sort_order) values
('soma', 'SOMA Entertainment', 'Medien, Unterhaltung & Immersive Simulation (Sektor-Monopolist)', $corp$SOMA Entertainment kontrolliert nahezu jeden Kanal, über den die Bevölkerung der besiedelten Systeme sich ablenkt, betäubt oder berieseln lässt -- von Neural-Feed-Serien über vollimmersive Simulationen bis zu den Arena-Übertragungen, in denen andere Mega Corps ihre Konflikte öffentlichkeitswirksam austragen.

Was als Streaming-Plattform begann, ist heute ein Sensorium-Imperium: SOMA lizenziert nicht nur Inhalte, sondern die Aufmerksamkeit selbst.

[corrupted data] -- weitere Hintergrundinformationen zu SOMA Entertainment folgen.$corp$, 3);
