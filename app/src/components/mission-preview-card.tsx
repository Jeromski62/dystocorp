import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  planned: "Geplant",
  ongoing: "Läuft",
  report: "Abgeschlossen",
};

// Same skeleton as CampaignCard (background photo, eyebrow + hero title,
// footer info row) -- a read-only preview tile, not the full mission
// management card (see campaigns/[id]/missions/mission-card.tsx for that).
export function MissionPreviewCard({
  href,
  title,
  subtitle,
  campaignName,
  status,
}: {
  href: string;
  title: string;
  subtitle?: string | null;
  campaignName: string | null | undefined;
  status: string;
}) {
  return (
    <Link
      href={href}
      className="relative flex h-[200px] w-full flex-col justify-between overflow-hidden border border-white p-4 transition-colors hover:border-white/60"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        {/* eslint-disable-next-line @next/next/no-img-element -- fills an
            absolutely-positioned decorative layer; next/image's fixed
            intrinsic sizing doesn't fit this object-cover/opacity overlay */}
        <img src="/campaigncards/background.png" alt="" className="absolute size-full max-w-none object-cover opacity-70" />
      </div>

      <div className="relative flex flex-col leading-none">
        <p className="font-display text-[16px] font-medium tracking-[1.6px] text-white/70 uppercase">Mission</p>
        <p className="mt-1 line-clamp-2 font-display text-[40px] leading-[0.95] font-semibold tracking-[3.6px] text-white uppercase">
          {title}
        </p>
        {subtitle ? <p className="mt-1 truncate font-mono text-[14px] text-white/70">{subtitle}</p> : null}
      </div>

      <div className="relative flex items-center gap-2">
        <span className="flex-1 truncate font-mono text-[14px] tracking-[1.4px] text-white/70 uppercase">{campaignName ?? "—"}</span>
        <span className="shrink-0 bg-white/24 px-1.5 py-1 text-[14px] font-semibold tracking-[1.4px] text-white uppercase">
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>
    </Link>
  );
}
