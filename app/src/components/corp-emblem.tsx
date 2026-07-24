import Image from "next/image";

const CORP_LOGOS: Record<string, string> = {
  yugure: "/corps/yugure.png",
  bionexx: "/corps/bionexx.png",
};

// Real corp logo (cropped to just the icon mark, see assets/logos/ + memory)
// when we know the corp's design slug; falls back to an initial-letter tile
// for anything else (e.g. corps without dedicated art yet).
export function CorpEmblem({ name, slug, size = 48 }: { name: string; slug?: string; size?: number }) {
  const logoSrc = slug ? CORP_LOGOS[slug] : undefined;

  if (logoSrc) {
    return (
      <div className="flex flex-shrink-0 items-center justify-center" style={{ width: size, height: size }}>
        <Image src={logoSrc} alt={name} width={size} height={size} className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-sm bg-corp-accent font-display text-corp-on-accent"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}
