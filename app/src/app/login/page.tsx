import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center gap-8 px-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-accent">DystoCorp Access Terminal</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-default">Anmelden</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Gib deine E-Mail-Adresse ein — du bekommst einen Login-Link zugeschickt.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
