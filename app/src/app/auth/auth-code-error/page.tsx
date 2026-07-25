import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 px-6 py-24">
      <h1 className="text-xl font-semibold text-text-default">Anmeldelink ungültig</h1>
      <p className="text-text-secondary">
        Dieser Link ist abgelaufen oder wurde bereits verwendet. Fordere einen neuen
        Anmeldelink an.
      </p>
      <Link href="/login">
        <Button variant="cta">Zurück zum Login</Button>
      </Link>
    </div>
  );
}
