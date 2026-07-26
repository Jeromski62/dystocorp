import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WeaponBrowser } from "./weapon-browser";
import { PageHeader } from "@/components/page-header";

export default async function WeaponsPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("equipment_items")
    .select("id, name, category, base_weapon_type, damage_modifier, max_range, cost_cr, effect_text, restrictions")
    .in("category", ["weapon", "advanced_weapon", "armour"])
    .order("category, name");

  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/rules" className="text-xs text-text-secondary hover:text-accent">
        ← Regeln
      </Link>
      <PageHeader
        className="mt-2"
        title="Weapon Profiles & Rules"
        description="Waffen, Advanced Weapons und Rüstung aus dem Ausrüstungskatalog."
      />

      <div className="mt-8">
        <WeaponBrowser items={items ?? []} />
      </div>
    </div>
    </div>
  );
}
