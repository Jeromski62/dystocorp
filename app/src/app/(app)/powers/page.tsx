import { createClient } from "@/lib/supabase/server";
import { PowerBrowser } from "./power-browser";
import { PageHeader } from "@/components/page-header";

export default async function PowersPage() {
  const supabase = await createClient();

  const [{ data: powers }, { data: backgrounds }, { data: corePowerLinks }] = await Promise.all([
    supabase.from("powers").select("id, name, activation_number, strain, types, full_text, armour_interference").order("name"),
    supabase.from("backgrounds").select("id, name").order("name"),
    supabase.from("background_core_powers").select("background_id, power_id"),
  ]);

  const backgroundsByPower: Record<string, string[]> = {};
  for (const link of corePowerLinks ?? []) {
    (backgroundsByPower[link.power_id] ??= []).push(link.background_id);
  }

  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-4xl px-6 py-12">
      <PageHeader title="Power-Nachschlagewerk" description={`Alle ${powers?.length ?? 0} Powers aus dem Regelwerk.`} />

      <div className="mt-8">
        <PowerBrowser
          powers={powers ?? []}
          backgrounds={backgrounds ?? []}
          backgroundsByPower={backgroundsByPower}
        />
      </div>
    </div>
    </div>
  );
}
