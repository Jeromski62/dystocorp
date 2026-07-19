// Placeholder emblem until the real corp logo assets are wired in: a
// corp-accent tile with the corp's initial, sized per the styleguide (44-56px).
export function CorpEmblem({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-sm bg-corp-accent font-display text-corp-on-accent"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}
