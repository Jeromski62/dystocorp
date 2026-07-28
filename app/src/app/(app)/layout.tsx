import { Sidebar } from "@/components/sidebar";
import { StarmapCanvas } from "@/components/starmap-canvas";

// Shared background for every authenticated page -- mounted once here
// (layouts persist across sibling-page navigation in the App Router) rather
// than per-page, so the WebGL context isn't recreated on every route
// change. No corp-system labels (that's the login/dashboard hero look, not
// a page-chrome backdrop) and dimmed further via overlayOpacity since it
// now sits behind actual page content, not as a standalone hero.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <StarmapCanvas showLabels={false} overlayOpacity={0.5} />
      </div>
      <div className="relative z-[1] flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
