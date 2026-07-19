import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WeaponBrowser } from "./weapon-browser";

export default async function WeaponsPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("equipment_items")
    .select("id, name, category, base_weapon_type, damage_modifier, max_range, cost_cr, effect_text, restrictions")
    .in("category", ["weapon", "advanced_weapon", "armour"])
    .order("category, name");

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/rules" className="text-xs text-text-secondary hover:text-accent">
        ← Regeln
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-text-default">Weapon Profiles &amp; Rules</h1>
      <p className="mt-1 text-sm text-text-secondary">Waffen, Advanced Weapons und Rüstung aus dem Ausrüstungskatalog.</p>

      <div className="mt-8">
        <WeaponBrowser items={items ?? []} />
      </div>
    </div>
  );
}
