import { RainCanvas } from "@/components/rain-canvas";
import { LensFlare } from "./lens-flare";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="hud-grid relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <RainCanvas className="z-[6]" />
      <LensFlare />
      <div className="relative z-[1] mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col px-6">
        <div className="flex items-center justify-between pt-6 font-mono text-[11px] tracking-[0.06em] text-text-default">
          <span className="font-semibold">SYS_OP_1.09</span>
          <span>[ONLINE]</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-9">
          <div className="text-center">
            <p className="font-display text-[38px] leading-none font-semibold tracking-[0.12em] text-text-default">
              DYSTO.CORP
            </p>
            <p className="mt-3.5 font-mono text-[11px] tracking-[0.1em] text-text-secondary">
              CREW_DATABASE_GATEWAY_v7.2
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="pb-6 text-center font-mono text-[9.5px] tracking-[0.12em] text-text-subtle">
          D_CORP_SICHERHEITSPROTOKOLLE_AKTIV
        </p>
      </div>
    </div>
  );
}
