import { confirmMagicLink } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const { token_hash, type, next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-accent">DystoCorp Access Terminal</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-default">Login bestätigen</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Aus Sicherheitsgründen wird der Link erst durch einen Klick aktiviert (E-Mail-Scanner
          anderer Anbieter dürfen ihn nicht automatisch verbrauchen).
        </p>
      </div>

      {token_hash && type ? (
        <form action={confirmMagicLink} className="flex flex-col gap-3">
          <input type="hidden" name="token_hash" value={token_hash} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="next" value={next ?? "/"} />
          <Button type="submit" variant="cta">
            Login bestätigen
          </Button>
        </form>
      ) : (
        <p className="text-sm text-danger">Link unvollständig — bitte neuen Login-Link anfordern.</p>
      )}
    </div>
  );
}
