import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JOB_SOURCE_LABEL } from "@/lib/job-board";

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("job_board_missions")
    .select(
      "id, title, source, d20_range, setup_text, victory_condition_text, round_limit_text, special_rules_text, loot_text"
    )
    .eq("id", jobId)
    .maybeSingle();

  if (!job) notFound();

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/jobs" className="text-xs text-text-secondary hover:text-accent">
          ← Job Board
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl tracking-[2.5px] text-text-default">{job.title}</h1>
          <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-text-secondary">
            {JOB_SOURCE_LABEL[job.source] ?? job.source}
          </span>
        </div>
        {job.d20_range ? <p className="mt-1 font-mono text-xs text-text-subtle">d20 {job.d20_range}</p> : null}

        <div className="mt-8 flex flex-col gap-6">
          <section>
            <h2 className="font-display text-sm tracking-[2px] text-text-secondary uppercase">Setup</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-text-default">{job.setup_text}</p>
          </section>
          <section>
            <h2 className="font-display text-sm tracking-[2px] text-text-secondary uppercase">Siegbedingungen</h2>
            {job.victory_condition_text ? (
              <p className="mt-2 whitespace-pre-line text-sm text-text-default">{job.victory_condition_text}</p>
            ) : (
              <p className="mt-2 text-sm text-text-subtle">Keine besonderen Siegbedingungen für diesen Job.</p>
            )}
          </section>
          <section>
            <h2 className="font-display text-sm tracking-[2px] text-text-secondary uppercase">Maximale Rundenanzahl</h2>
            {job.round_limit_text ? (
              <p className="mt-2 whitespace-pre-line text-sm text-text-default">{job.round_limit_text}</p>
            ) : (
              <p className="mt-2 text-sm text-text-subtle">Kein Rundenlimit für diesen Job.</p>
            )}
          </section>
          <section>
            <h2 className="font-display text-sm tracking-[2px] text-text-secondary uppercase">Sonderregeln</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-text-default">{job.special_rules_text}</p>
          </section>
          <section>
            <h2 className="font-display text-sm tracking-[2px] text-text-secondary uppercase">Loot / XP</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-text-default">{job.loot_text}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
