import { confirmMagicLink } from "@/lib/supabase/actions";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const { token_hash, type, next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-accent">DystoCorp Access Terminal</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Login bestätigen</h1>
        <p className="mt-2 text-sm text-muted">
          Aus Sicherheitsgründen wird der Link erst durch einen Klick aktiviert (E-Mail-Scanner
          anderer Anbieter dürfen ihn nicht automatisch verbrauchen).
        </p>
      </div>

      {token_hash && type ? (
        <form action={confirmMagicLink} className="flex flex-col gap-3">
          <input type="hidden" name="token_hash" value={token_hash} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="next" value={next ?? "/campaigns"} />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Login bestätigen
          </button>
        </form>
      ) : (
        <p className="text-sm text-danger">Link unvollständig — bitte neuen Login-Link anfordern.</p>
      )}
    </div>
  );
}
