import Image from "next/image";
import { StarmapCanvas } from "@/components/starmap-canvas";
import { LensFlare } from "./lens-flare";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="hud-grid relative min-h-screen overflow-hidden">
      <StarmapCanvas className="z-0" />
      <LensFlare />
      <div className="relative z-[1] mx-auto flex min-h-screen max-w-sm flex-col px-6">
        <div className="flex items-center justify-between pt-6 font-mono text-[15px] tracking-[0.06em] text-text-default">
          <span className="font-semibold">SYS_OP_1.09</span>
          <span>[ONLINE]</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-start gap-9 pt-[14vh]">
          <div className="text-center">
            <Image src="/logo/dc-logo-vert.svg" alt="Dysto.Corp" width={887} height={598} className="h-auto w-full" />
            <p className="mt-3.5 font-mono text-[15px] tracking-[0.1em] text-text-secondary">
              TEAM_DATABASE_GATEWAY_v7.2
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="pb-6 text-center font-mono text-[14px] tracking-[0.12em] text-text-subtle">
          D_CORP_SICHERHEITSPROTOKOLLE_AKTIV
        </p>
      </div>
    </div>
  );
}
