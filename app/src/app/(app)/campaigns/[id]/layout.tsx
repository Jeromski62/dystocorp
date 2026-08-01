// Teams always render in the neutral theme -- a crew's corp no longer scopes
// --corp-accent/--corp-surface here either, mirrors crews/[crewId]/layout.tsx.
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-corp-bg min-h-screen">{children}</div>;
}
