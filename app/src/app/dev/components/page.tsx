import type { ReactNode } from "react";
import { ResolvedVar } from "./resolved-var";
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

function TokenGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[11px] tracking-[0.1em] text-text-subtle uppercase">{label}</p>
      <div className="grid grid-cols-1 gap-4 border border-border p-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </div>
  );
}

function TokenSwatch({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-9 w-9 shrink-0 border border-border" style={{ background: `var(${name})` }} />
      <div className="min-w-0">
        <p className="truncate font-mono text-[11px] text-corp-accent">{name}</p>
        <ResolvedVar name={name} />
      </div>
    </div>
  );
}

function TypeGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[11px] tracking-[0.1em] text-text-subtle uppercase">{label}</p>
      <div className="border border-border">{children}</div>
    </div>
  );
}

function TypeRow({
  label,
  note,
  sample,
  sampleClassName,
}: {
  label: string;
  note?: string;
  sample: string;
  sampleClassName: string;
}) {
  return (
    <div className="border-b border-border/60 px-4 py-3 last:border-b-0">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[11px] tracking-wide text-corp-accent uppercase">{label}</span>
        {note ? <span className="font-mono text-[11px] text-text-subtle">{note}</span> : null}
      </div>
      <p className={sampleClassName}>{sample}</p>
      <code className="mt-1.5 block font-mono text-[11px] break-all text-text-subtle">{sampleClassName}</code>
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

      <Section title="Typography">
        <TypeGroup label="Überschriften — H1">
          <TypeRow
            label="H1 · Seitentitel"
            note="Übersicht, Kampagnen, Profil, Meine Crews, ..."
            sample="Übersicht"
            sampleClassName="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase"
          />
          <TypeRow
            label="H1 · Entity-Name"
            note="editierbarer Crew-/Corp-Name"
            sample="Schattenklaue"
            sampleClassName="font-display text-2xl tracking-[2.5px] text-text-default"
          />
          <TypeRow
            label="H1 · Auth-Screens (Ausreißer)"
            note="kein font-display — /auth/confirm, /auth/auth-code-error"
            sample="Login bestätigen"
            sampleClassName="text-2xl font-semibold text-text-default"
          />
        </TypeGroup>

        <TypeGroup label="Überschriften — H2">
          <TypeRow
            label="H2 · Terminal-Sektionslabel"
            note="// Teilnehmende Crews, // Mitspieler, ..."
            sample="// Teilnehmende Crews"
            sampleClassName="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase"
          />
          <TypeRow
            label="H2 · Karten-/Listen-Titel"
            note="Corp-Karten, Rules-Übersicht"
            sample="Yūgure Syndikat"
            sampleClassName="font-display text-lg tracking-[2px] text-text-default"
          />
          <TypeRow
            label="H2 · Plain (Ausreißer)"
            note="kein font-display/mono — power-browser, weapon-browser"
            sample="Fireball"
            sampleClassName="font-semibold text-text-default"
          />
        </TypeGroup>

        <TypeGroup label="Überschriften — H3">
          <TypeRow
            label="H3 · Formular-Sektionslabel"
            note="officer-builder, ship-panel"
            sample="Background"
            sampleClassName="font-display text-sm tracking-[3px] text-text-secondary uppercase"
          />
        </TypeGroup>

        <p className="font-mono text-[11px] text-text-subtle">H4/H5 — aktuell nirgends im Code verwendet.</p>

        <TypeGroup label="Type Scale (Tailwind-Tokens, überschrieben in globals.css)">
          <TypeRow label="text-xs" note="15px" sample="Die Crew macht sich bereit." sampleClassName="text-xs text-text-default" />
          <TypeRow label="text-sm" note="16px" sample="Die Crew macht sich bereit." sampleClassName="text-sm text-text-default" />
          <TypeRow label="text-base" note="18px" sample="Die Crew macht sich bereit." sampleClassName="text-base text-text-default" />
          <TypeRow label="text-lg" note="20px" sample="Die Crew macht sich bereit." sampleClassName="text-lg text-text-default" />
          <TypeRow label="text-xl" note="22px" sample="Die Crew macht sich bereit." sampleClassName="text-xl text-text-default" />
          <TypeRow label="text-2xl" note="26px" sample="Die Crew macht sich bereit." sampleClassName="text-2xl text-text-default" />
          <TypeRow label="text-3xl" note="32px, ungenutzt" sample="Die Crew macht sich bereit." sampleClassName="text-3xl text-text-default" />
        </TypeGroup>

        <TypeGroup label="Schriftfamilien">
          <TypeRow
            label="font-display (Rajdhani)"
            note="erzwingt uppercase über .font-display"
            sample="Dysto.Corp"
            sampleClassName="font-display text-xl text-text-default"
          />
          <TypeRow
            label="font-mono (IBM Plex Mono)"
            note="Daten, Labels, Systemstrings"
            sample="SYS_OP_1.09 // ONLINE"
            sampleClassName="font-mono text-lg text-text-default"
          />
          <TypeRow
            label="body / Standard (Rajdhani)"
            note="Fließtext — font-sans/Inter bleibt separat für Tailwind-Default-Fälle"
            sample="Die unabhängigen Crews überleben nur, wenn sie zusammenhalten."
            sampleClassName="text-lg text-text-default"
          />
        </TypeGroup>

        <TypeGroup label="Weitere Textrollen">
          <TypeRow
            label="Body-Copy"
            note="Beschreibungstexte, Flavor-Text"
            sample="Reine Optik/Lore — hat keinen Einfluss auf Stats, Powers oder Gear."
            sampleClassName="text-sm text-text-secondary"
          />
          <TypeRow
            label="Meta-/Label-Text (mono)"
            note="Karten-Meta, Tabellen-Header"
            sample="Corp · Captain · Status"
            sampleClassName="font-mono text-[14px] tracking-[0.06em] text-text-secondary uppercase"
          />
          <TypeRow
            label="Daten-Wert (mono)"
            note="Credits, Stats, Zahlenwerte"
            sample="1.250 CR"
            sampleClassName="font-mono text-[15px] text-text-default"
          />
          <TypeRow
            label="Button-Label"
            note="aus Button.tsx (alle Varianten)"
            sample="Speichern"
            sampleClassName="font-display text-sm font-semibold tracking-wide text-text-default uppercase"
          />
        </TypeGroup>
      </Section>

      <Section title="Design Tokens (CSS-Variablen)">
        <TokenGroup label="Backgrounds">
          <TokenSwatch name="--bg-body" />
          <TokenSwatch name="--bg-surface" />
          <TokenSwatch name="--bg-raised" />
          <TokenSwatch name="--bg-input" />
        </TokenGroup>

        <TokenGroup label="Border">
          <TokenSwatch name="--border" />
        </TokenGroup>

        <TokenGroup label="Text">
          <TokenSwatch name="--text-default" />
          <TokenSwatch name="--text-mid" />
          <TokenSwatch name="--text-secondary" />
          <TokenSwatch name="--text-subtle" />
        </TokenGroup>

        <TokenGroup label="Status (corp-unabhängig)">
          <TokenSwatch name="--status-active" />
          <TokenSwatch name="--status-injured" />
          <TokenSwatch name="--status-out" />
          <TokenSwatch name="--danger" />
        </TokenGroup>

        <TokenGroup label="Neutrale Accent / CTA">
          <TokenSwatch name="--accent" />
          <TokenSwatch name="--accent-foreground" />
          <TokenSwatch name="--cta-bg" />
          <TokenSwatch name="--cta-bg-hover" />
          <TokenSwatch name="--cta-foreground" />
        </TokenGroup>

        <div>
          <p className="mb-1 font-mono text-[11px] tracking-[0.1em] text-text-subtle uppercase">
            Corp-Tokens (neutral / yugure / bionexx)
          </p>
          <CorpColumns>
            {() => (
              <div className="flex flex-col gap-3">
                <TokenSwatch name="--corp-accent" />
                <TokenSwatch name="--corp-bg" />
                <TokenSwatch name="--corp-surface" />
                <TokenSwatch name="--corp-border" />
                <TokenSwatch name="--corp-on-accent" />
              </div>
            )}
          </CorpColumns>
        </div>

        <p className="font-mono text-[11px] text-text-subtle">
          Ausgeblendet: die generischen shadcn-Init-Tokens (--background, --card, --popover, --primary, --secondary,
          --muted, --destructive, --input, --ring, --chart-*, --sidebar-*) — nicht Teil der aktiven DystoCorp-Palette,
          nur noch Altlast aus dem shadcn-Setup.
        </p>
      </Section>

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
