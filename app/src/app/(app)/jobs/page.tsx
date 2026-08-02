import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { JOB_SOURCE_LABEL } from "@/lib/job-board";

export default async function JobsPage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("job_board_missions")
    .select("id, title, source, d20_range, setup_text")
    .order("source", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <PageHeader title="Job Board" description="Missionen aus dem Regelbuch und eigene Aufträge." />

        <div className="mt-8 flex flex-col gap-3">
          {(jobs ?? []).map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="rounded-md border border-border bg-bg-surface p-5 hover:border-accent"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg tracking-[2px] text-text-default">{job.title}</h2>
                <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-text-secondary">
                  {JOB_SOURCE_LABEL[job.source] ?? job.source}
                </span>
              </div>
              {job.d20_range ? <p className="mt-1 font-mono text-xs text-text-subtle">d20 {job.d20_range}</p> : null}
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{job.setup_text}</p>
            </Link>
          ))}
          {(jobs ?? []).length === 0 ? <p className="text-sm text-text-secondary">Noch keine Jobs verfügbar.</p> : null}
        </div>
      </div>
    </div>
  );
}
