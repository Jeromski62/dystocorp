import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CrewCard } from "@/components/crew-card";
import { CorpEmblem } from "@/components/corp-emblem";
import { StatusBadge } from "@/components/status-badge";
import { Tabs } from "@/components/tabs";
import { RainCanvas } from "@/components/rain-canvas";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Internal dev-only page: every shared component (app/src/components/) with
// realistic sample data, grouped by component, one long scrollable page —
// so a button/card/badge tweak can be checked without navigating the real
// app flow. Not linked anywhere in the nav on purpose. Not a Storybook
// replacement (no controls/addons), just a fast visual index.
const CORP_COLUMNS = ["yugure", "bionexx", undefined] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="mb-4 border-b border-border pb-2 font-display text-xl font-semibold tracking-wide text-text-default uppercase">
        {title}
      </h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function CorpColumns({ children }: { children: (slug: (typeof CORP_COLUMNS)[number]) => ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CORP_COLUMNS.map((slug) => (
        <div key={slug ?? "neutral"} data-corp={slug} className="border border-corp-border bg-corp-bg p-4">
          <p className="mb-2 font-mono text-xs text-text-secondary uppercase">{slug ?? "neutral"}</p>
          {children(slug)}
        </div>
      ))}
    </div>
  );
}

export default function ComponentPlaygroundPage() {
  return (
    <div className="hud-grid min-h-screen bg-bg-body p-8">
      <h1 className="mb-2 font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">
        Component Playground
      </h1>
      <p className="mb-10 font-mono text-xs text-text-secondary">
        Interner Dev-Screen, nicht verlinkt. Zeigt die geteilten Komponenten aus src/components/ mit Beispiel-Daten.
      </p>

      <Section title="Button">
        <CorpColumns>
          {() => (
            <div className="flex flex-col items-start gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Primary (disabled)
              </Button>
            </div>
          )}
        </CorpColumns>
        <div>
          <p className="mb-2 font-mono text-xs text-text-secondary uppercase">corp-unabhängig</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="cta">CTA</Button>
            <Button variant="cta" disabled>
              CTA (disabled)
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-xs text-text-secondary uppercase">Größen (variant=cta)</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="cta" size="xs">
              XS
            </Button>
            <Button variant="cta" size="sm">
              SM
            </Button>
            <Button variant="cta" size="default">
              Default (44px)
            </Button>
            <Button variant="cta" size="lg">
              LG
            </Button>
          </div>
        </div>
      </Section>

      <Section title="CrewCard">
        <CorpColumns>
          {(slug) => (
            <CrewCard
              href="#"
              corpSlug={slug}
              corpName={slug === "yugure" ? "Yūgure Syndikat" : slug === "bionexx" ? "Bionexx Collective" : undefined}
              name="Schattenklaue"
              status={{ label: "AKTIV", className: "text-status-active" }}
            >
              <p>Kampagne: Verlorene Sektoren</p>
              <div className="mt-1.5 flex gap-4">
                <span>
                  LV <b className="text-text-default">3</b>
                </span>
                <span>5 EINH.</span>
                <span className={slug ? "text-corp-accent" : "text-text-default"}>1.250 CR</span>
              </div>
            </CrewCard>
          )}
        </CorpColumns>
        <div>
          <p className="mb-2 font-mono text-xs text-text-secondary uppercase">status-Varianten (yugure)</p>
          <div data-corp="yugure" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "AKTIV", className: "text-status-active" },
              { label: "VERLETZT", className: "text-status-injured" },
              { label: "AUSSER GEFECHT", className: "text-status-out" },
            ].map((status) => (
              <CrewCard key={status.label} href="#" corpSlug="yugure" corpName="Yūgure Syndikat" name="Schattenklaue" status={status}>
                <p>Kampagne: Verlorene Sektoren</p>
              </CrewCard>
            ))}
          </div>
        </div>
      </Section>

      <Section title="CorpEmblem">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <CorpEmblem name="Yūgure Syndikat" slug="yugure" size={48} />
            <p className="font-mono text-xs text-text-secondary">yugure</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CorpEmblem name="Bionexx Collective" slug="bionexx" size={48} />
            <p className="font-mono text-xs text-text-secondary">bionexx</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CorpEmblem name="Unbekannt" size={48} />
            <p className="font-mono text-xs text-text-secondary">fallback (kein slug)</p>
          </div>
        </div>
      </Section>

      <Section title="StatusBadge">
        <CorpColumns>
          {() => (
            <div className="flex flex-wrap gap-2">
              <StatusBadge currentHealth={8} health={8} />
              <StatusBadge currentHealth={4} health={8} />
              <StatusBadge currentHealth={0} health={8} />
            </div>
          )}
        </CorpColumns>
      </Section>

      <Section title="Tabs">
        <Tabs
          tabs={[
            { label: "Übersicht", content: <p className="text-sm text-text-secondary">Inhalt Tab 1.</p> },
            { label: "Ausrüstung", content: <p className="text-sm text-text-secondary">Inhalt Tab 2.</p> },
            { label: "Verlauf", content: <p className="text-sm text-text-secondary">Inhalt Tab 3.</p> },
          ]}
        />
      </Section>

      <Section title="RainCanvas">
        <div className="relative h-48 overflow-hidden border border-border">
          <RainCanvas />
        </div>
      </Section>

      <Section title="ui/Input">
        <Input placeholder="Placeholder…" className="max-w-sm" />
      </Section>

      <Section title="ui/Dialog">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Dialog öffnen</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Beispiel-Dialog</DialogTitle>
              <DialogDescription>Kurzer Beschreibungstext für den Dialog-Inhalt.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Abbrechen</Button>} />
              <Button>Bestätigen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </div>
  );
}
