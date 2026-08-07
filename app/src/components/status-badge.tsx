// Icon paths ported from assets/icn/{health,injured,out}.svg (Figma
// "Dysto-Corp-Rough-Concept" StatusBadge, node 2046:441) -- fill is
// `currentColor` instead of the mockup's flat placeholder red so each icon
// picks up --corp-accent via the `text-corp-accent` wrapper below.
function HealthIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M10.7891 2.01814L12.1324 11.6229H20V12.982H11.5152L10.8153 12.3932L10.0244 6.73844L7.96278 18.9805L6.57307 19L4.30331 7.63481L3.52068 12.4087L2.82353 12.982H0V11.6229H2.22059L3.53814 3.58833L4.92831 3.56621L7.2068 14.977L9.39292 2L10.7891 2.01814Z"
      />
    </svg>
  );
}

function InjuredIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M3.73711 14.6099L6.26537 16.0696L9.77289 9.99441L9.21735 8.03725L7.24463 8.53472L3.73711 14.6099Z"
      />
      <path
        fill="currentColor"
        d="M4.56475 16.8469C4.71264 17.3988 5.07373 17.8694 5.56859 18.1551C6.06344 18.4408 6.65153 18.5183 7.20347 18.3704C7.75541 18.2225 8.226 17.8614 8.5117 17.3665C8.79741 16.8717 8.87483 16.2836 8.72694 15.7317C8.57905 15.1797 8.21795 14.7091 7.7231 14.4234C7.22824 14.1377 6.64016 14.0603 6.08821 14.2082C5.53627 14.3561 5.06569 14.7172 4.77998 15.212C4.49428 15.7069 4.41685 16.295 4.56475 16.8469Z"
      />
      <path
        fill="currentColor"
        d="M1.27556 14.9479C1.34879 15.2212 1.47513 15.4774 1.64737 15.7018C1.81961 15.9263 2.03437 16.1146 2.2794 16.2561C2.52443 16.3976 2.79492 16.4894 3.07544 16.5263C3.35595 16.5633 3.64099 16.5446 3.91429 16.4713C4.18758 16.3981 4.44377 16.2718 4.66824 16.0995C4.89271 15.9273 5.08105 15.7125 5.22252 15.4675C5.36398 15.2225 5.4558 14.952 5.49273 14.6715C5.52967 14.391 5.51098 14.1059 5.43775 13.8326C5.36452 13.5593 5.23818 13.3031 5.06595 13.0787C4.89371 12.8542 4.67894 12.6659 4.43391 12.5244C4.18888 12.3829 3.91839 12.2911 3.63788 12.2542C3.35736 12.2172 3.07232 12.2359 2.79903 12.3092C2.52574 12.3824 2.26954 12.5087 2.04508 12.681C1.82061 12.8532 1.63227 13.068 1.4908 13.313C1.34933 13.558 1.25751 13.8285 1.22058 14.109C1.18365 14.3895 1.20233 14.6746 1.27556 14.9479Z"
      />
      <path
        fill="currentColor"
        d="M16.7737 7.44011L16.1009 4.59931L9.27471 6.21595L10.9901 7.30976L9.94749 9.05676L16.7737 7.44011Z"
      />
      <path
        fill="currentColor"
        d="M14.1661 3.04041C14.0175 3.2812 13.9178 3.54889 13.8727 3.8282C13.8276 4.10751 13.8379 4.39298 13.9031 4.6683C13.9683 4.94362 14.0871 5.2034 14.2527 5.4328C14.4183 5.66221 14.6275 5.85676 14.8683 6.00533C15.1091 6.15391 15.3768 6.2536 15.6561 6.29872C15.9354 6.34384 16.2209 6.3335 16.4962 6.2683C16.7715 6.2031 17.0313 6.0843 17.2607 5.9187C17.4901 5.7531 17.6846 5.54394 17.8332 5.30315C17.9818 5.06237 18.0815 4.79468 18.1266 4.51536C18.1717 4.23605 18.1614 3.95059 18.0962 3.67527C18.031 3.39995 17.9122 3.14017 17.7466 2.91076C17.581 2.68135 17.3718 2.48681 17.131 2.33823C16.8902 2.18966 16.6225 2.08996 16.3432 2.04485C16.0639 1.99973 15.7785 2.01006 15.5031 2.07527C15.2278 2.14047 14.968 2.25926 14.7386 2.42486C14.5092 2.59046 14.3147 2.79963 14.1661 3.04041Z"
      />
      <path
        fill="currentColor"
        d="M15.0413 6.73623C14.8928 6.97701 14.7931 7.2447 14.748 7.52401C14.7028 7.80333 14.7132 8.08879 14.7784 8.36411C14.8436 8.63943 14.9624 8.89921 15.128 9.12862C15.2936 9.35803 15.5027 9.55257 15.7435 9.70115C15.9843 9.84972 16.252 9.94941 16.5313 9.99453C16.8106 10.0397 17.0961 10.0293 17.3714 9.96411C17.6467 9.89891 17.9065 9.78012 18.1359 9.61452C18.3653 9.44892 18.5599 9.23975 18.7084 8.99897C18.857 8.75818 18.9567 8.49049 19.0018 8.21118C19.047 7.93187 19.0366 7.6464 18.9714 7.37108C18.9062 7.09576 18.7874 6.83598 18.6218 6.60657C18.4562 6.37716 18.2471 6.18262 18.0063 6.03405C17.7655 5.88547 17.4978 5.78578 17.2185 5.74066C16.9392 5.69554 16.6537 5.70588 16.3784 5.77108C16.1031 5.83628 15.8433 5.95508 15.6139 6.12068C15.3845 6.28628 15.1899 6.49544 15.0413 6.73623Z"
      />
      <path fill="currentColor" d="M8.54593 6.34791L8.44126 4.20797L7.61837 4.5237L8.54593 6.34791Z" />
      <path fill="currentColor" d="M7.77355 7.30746L5.63479 7.43393L5.86004 6.58181L7.77355 7.30746Z" />
    </svg>
  );
}

function OutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path fill="currentColor" d="M17.1421 15.7279L4.41421 3H3V4.41421L15.7279 17.1421H17.1421V15.7279Z" />
      <path fill="currentColor" d="M15.7279 3L3 15.7279L3 17.1421H4.41421L17.1421 4.41421L17.1421 3H15.7279Z" />
    </svg>
  );
}

// Stunned/Jammed have no Figma node yet (Aim Assist combat flags predate the
// icon set) -- simple placeholder glyphs, not ported from a mockup.
function StunnedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="10" y1="2" x2="10" y2="18" />
        <line x1="2" y1="10" x2="18" y2="10" />
        <line x1="4.2" y1="4.2" x2="15.8" y2="15.8" />
        <line x1="15.8" y1="4.2" x2="4.2" y2="15.8" />
      </g>
    </svg>
  );
}

function JammedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7.4" stroke="currentColor" strokeWidth="1.6" />
      <line x1="4.8" y1="15.2" x2="15.2" y2="4.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

type StatusKey = "fit" | "injured" | "out" | "stunned" | "weaponJammed";

// Icon + wash color is status-semantic (green/yellow/red via the
// --status-active/--status-injured/--status-out tokens), label text stays
// white -- only the icon/background follow the status per corp-independent
// design intent. Stunned/weaponJammed share the "injured" yellow since both
// are transient combat-round penalties, not a health state.
const STATUS_CONFIG: Record<StatusKey, { label: string; Icon: (props: { className?: string }) => React.JSX.Element; wash: string }> = {
  fit: { label: "Fit", Icon: HealthIcon, wash: "bg-status-active/24 text-status-active" },
  injured: { label: "Verletzt", Icon: InjuredIcon, wash: "bg-status-injured/24 text-status-injured" },
  out: { label: "Freigestellt", Icon: OutIcon, wash: "bg-status-out/24 text-status-out" },
  stunned: { label: "Überfordert", Icon: StunnedIcon, wash: "bg-status-injured/24 text-status-injured" },
  weaponJammed: { label: "Waffe Klemmt", Icon: JammedIcon, wash: "bg-status-injured/24 text-status-injured" },
};

function Badge({ statusKey }: { statusKey: StatusKey }) {
  const { label, Icon, wash } = STATUS_CONFIG[statusKey];
  return (
    <span className={`inline-flex items-center gap-1.5 py-1.5 pr-2.5 pl-1.5 ${wash}`}>
      <Icon className="size-4 shrink-0" />
      <span className="font-semibold text-[14px] tracking-[1.4px] text-white">{label}</span>
    </span>
  );
}

// Per Figma redesign (node 2046:441): icon + label chip, status-color wash
// background (24% alpha, preserved from the mockup's rgba(...,0.24)) --
// replaces the old border+English-label version. Stunned/weaponJammed are
// independent combat flags (Aim Assist) and render as additional badges
// alongside the health status, not instead of it.
export function StatusBadge({
  currentHealth,
  health,
  isStunned = false,
  weaponJammed = false,
}: {
  currentHealth: number;
  health: number;
  isStunned?: boolean;
  weaponJammed?: boolean;
}) {
  // "Injured" tracks the rulebook's Badly Wounded threshold (p.68: a figure
  // that would start its next game at half Health), not merely any HP lost
  // -- so a figure that's taken one point of damage still reads as Fit.
  // Half is rounded up (17 Health -> injured at 9 or below) since the rules
  // don't spell out a rounding direction and this project has no other
  // "half stat" precedent to match.
  const badlyWoundedThreshold = Math.ceil(health / 2);
  const healthStatus: StatusKey = currentHealth <= 0 ? "out" : currentHealth <= badlyWoundedThreshold ? "injured" : "fit";
  const active: StatusKey[] = [healthStatus];
  if (isStunned) active.push("stunned");
  if (weaponJammed) active.push("weaponJammed");

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {active.map((key) => (
        <Badge key={key} statusKey={key} />
      ))}
    </span>
  );
}
