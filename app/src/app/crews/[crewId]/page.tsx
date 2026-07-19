import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs } from "@/components/tabs";
import { OfficerBuilder } from "./officer-builder";
import { SoldierRecruiter } from "./soldier-recruiter";
import { ShipPanel } from "./ship-panel";
import { SOLDIER_RULES } from "@/lib/stargrave/constants";
import { CorpEmblem } from "@/components/corp-emblem";
import { EditCrewNameForm } from "./edit-crew-name-form";

export default async function CrewPage({
  params,
}: {
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const supabase = await createClient();

  const { data: crew } = await supabase
    .from("crews")
    .select("id, name, campaign_id, credits, experience, ship_name, corps(name)")
    .eq("id", crewId)
    .maybeSingle();

  if (!crew) notFound();

  const [
    { data: backgrounds },
    { data: corePowerLinks },
    { data: powers },
    { data: equipment },
    { data: soldierTypes },
    { data: captain },
    { data: captainPowers },
    { data: captainGear },
    { data: firstMate },
    { data: firstMatePowers },
    { data: firstMateGear },
    { data: soldiers },
    { data: shipUpgradeTypes },
    { data: crewShipUpgrades },
    { data: holdItems },
  ] = await Promise.all([
    supabase.from("backgrounds").select("id, name, flavor_text, fixed_stat_mods, choice_stat_count, choice_stat_options"),
    supabase.from("background_core_powers").select("background_id, power_id"),
    supabase.from("powers").select("id, name, activation_number, strain, full_text").order("name"),
    supabase.from("equipment_items").select("id, key, name, category, gear_slots, cost_cr, effect_text").order("category, name"),
    supabase.from("soldier_types").select("id, name, table_type, move, fight, shoot, armour, will, health, cost_cr"),
    supabase.from("captains").select("id, name, background_id, chosen_stat_options").eq("crew_id", crewId).maybeSingle(),
    supabase.from("captain_powers").select("power_id, is_core, reduced, captains!inner(crew_id)").eq("captains.crew_id", crewId),
    supabase.from("captain_gear").select("equipment_item_id, captains!inner(crew_id)").eq("captains.crew_id", crewId),
    supabase.from("first_mates").select("id, name, background_id, chosen_stat_options").eq("crew_id", crewId).maybeSingle(),
    supabase
      .from("first_mate_powers")
      .select("power_id, is_core, reduced, first_mates!inner(crew_id)")
      .eq("first_mates.crew_id", crewId),
    supabase.from("first_mate_gear").select("equipment_item_id, first_mates!inner(crew_id)").eq("first_mates.crew_id", crewId),
    supabase
      .from("soldiers")
      .select("id, name, is_robot, current_health, soldier_types(id, name, table_type, move, fight, shoot, armour, will, health, cost_cr)")
      .eq("crew_id", crewId)
      .order("sort_order"),
    supabase.from("ship_upgrade_types").select("id, key, name, cost_cr, effect_text, max_purchases"),
    supabase
      .from("crew_ship_upgrades")
      .select("id, ship_upgrade_type_id, target_note, ship_upgrade_types(id, key, name, cost_cr, effect_text, max_purchases)")
      .eq("crew_id", crewId),
    supabase
      .from("ship_hold_items")
      .select("id, equipment_item_id, custom_name, quantity, notes, equipment_items(id, name)")
      .eq("crew_id", crewId),
  ]);

  const typedBackgrounds = (backgrounds ?? []).map((b) => ({
    ...b,
    fixed_stat_mods: (b.fixed_stat_mods ?? {}) as Record<string, number>,
  }));
  const typedSoldierTypes = (soldierTypes ?? []).map((t) => ({
    ...t,
    table_type: t.table_type as "standard" | "specialist",
  }));

  const corePowersByBackground: Record<string, string[]> = {};
  for (const link of corePowerLinks ?? []) {
    (corePowersByBackground[link.background_id] ??= []).push(link.power_id);
  }

  const maxSpecialists = (crewShipUpgrades ?? []).some((u) => u.ship_upgrade_types?.key === "extra_quarters")
    ? SOLDIER_RULES.maxSpecialistsDefault + 1
    : SOLDIER_RULES.maxSpecialistsDefault;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center gap-4">
        <CorpEmblem name={crew.corps?.name ?? "?"} />
        <div>
          <p className="font-mono text-xs tracking-widest text-corp-accent">{crew.corps?.name}</p>
          <EditCrewNameForm crewId={crewId} name={crew.name} />
        </div>
      </div>
      <p className="mt-3 font-mono text-sm text-text-secondary">
        {crew.credits}cr · {crew.experience} XP
      </p>

      <div className="mt-8">
        <Tabs
          tabs={[
            {
              label: "Captain",
              content: (
                <OfficerBuilder
                  key="captain"
                  crewId={crewId}
                  role="captain"
                  backgrounds={typedBackgrounds}
                  corePowersByBackground={corePowersByBackground}
                  powers={powers ?? []}
                  equipment={equipment ?? []}
                  existing={
                    captain
                      ? {
                          name: captain.name,
                          backgroundId: captain.background_id,
                          chosenStatOptions: captain.chosen_stat_options,
                          powers: (captainPowers ?? []).map((p) => ({ powerId: p.power_id, reduced: p.reduced })),
                          gearItemIds: (captainGear ?? []).map((g) => g.equipment_item_id),
                        }
                      : null
                  }
                />
              ),
            },
            {
              label: "First Mate",
              content: (
                <OfficerBuilder
                  key="first_mate"
                  crewId={crewId}
                  role="first_mate"
                  backgrounds={typedBackgrounds}
                  corePowersByBackground={corePowersByBackground}
                  powers={powers ?? []}
                  equipment={equipment ?? []}
                  existing={
                    firstMate
                      ? {
                          name: firstMate.name,
                          backgroundId: firstMate.background_id,
                          chosenStatOptions: firstMate.chosen_stat_options,
                          powers: (firstMatePowers ?? []).map((p) => ({ powerId: p.power_id, reduced: p.reduced })),
                          gearItemIds: (firstMateGear ?? []).map((g) => g.equipment_item_id),
                        }
                      : null
                  }
                />
              ),
            },
            {
              label: "Soldiers",
              content: (
                <SoldierRecruiter
                  crewId={crewId}
                  soldierTypes={typedSoldierTypes}
                  soldiers={(soldiers ?? []).filter((s) => s.soldier_types !== null) as Parameters<
                    typeof SoldierRecruiter
                  >[0]["soldiers"]}
                  credits={crew.credits}
                  maxSpecialists={maxSpecialists}
                />
              ),
            },
            {
              label: "Ship",
              content: (
                <ShipPanel
                  crewId={crewId}
                  shipName={crew.ship_name}
                  credits={crew.credits}
                  shipUpgradeTypes={shipUpgradeTypes ?? []}
                  crewShipUpgrades={(crewShipUpgrades ?? []).filter((u) => u.ship_upgrade_types !== null) as Parameters<
                    typeof ShipPanel
                  >[0]["crewShipUpgrades"]}
                  equipment={(equipment ?? []).map((e) => ({ id: e.id, name: e.name }))}
                  holdItems={holdItems ?? []}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
