import Link from "next/link";
import { CorpEmblem } from "@/components/corp-emblem";

// Ported skeleton-for-skeleton from the Figma "Dysto-Corp-Rough-Concept"
// CampaignCard (node 2045:371): moody background photo, campaign name as
// the hero element, participating corps' icons ("Verhandlungspartner") in
// the footer. Unlike CrewCard, the background isn't per-corp -- it's one
// fixed campaign-flavored image for every card.
export function CampaignCard({
  href,
  name,
  corps,
  archived,
}: {
  href: string;
  name: string;
  corps: { key: string; slug: string; name: string }[];
  archived?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex h-[200px] w-full flex-col justify-between overflow-hidden border border-white/12 p-4 transition-colors hover:border-white/30 ${
        archived ? "opacity-60 hover:opacity-100" : ""
      }`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        {/* eslint-disable-next-line @next/next/no-img-element -- fills an
            absolutely-positioned decorative layer; next/image's fixed
            intrinsic sizing doesn't fit this object-cover/opacity overlay */}
        <img
          src="/campaigncards/background.png"
          alt=""
          className="absolute size-full max-w-none scale-100 object-cover opacity-70 transition-transform group-hover:scale-110"
        />
      </div>

      <div className="relative flex flex-col leading-none">
        <p className="font-display text-[16px] font-medium tracking-[1.6px] text-white/70 uppercase">Kampagne</p>
        <p className="mt-1 line-clamp-2 font-display text-[40px] leading-[0.95] font-semibold tracking-[3.6px] text-white uppercase">
          {name}
        </p>
      </div>

      <div className="relative flex items-center gap-2">
        <span className="flex-1 truncate font-mono text-[14px] tracking-[1.4px] text-white/70 uppercase">Verhandlungspartner</span>
        {corps.map((corp) => (
          <div key={corp.key} data-corp={corp.slug}>
            <CorpEmblem name={corp.name} slug={corp.slug} size={32} />
          </div>
        ))}
      </div>
    </Link>
  );
}
