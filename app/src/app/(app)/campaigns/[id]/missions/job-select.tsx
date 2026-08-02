import { JOB_SOURCE_LABEL } from "@/lib/job-board";

export type Job = { id: string; title: string; source: string };

// Plan Mission / Mission bearbeiten -- optionally base a campaign mission on
// a Job Board entry (rulebook scenario or a future custom job).
export function JobSelect({
  jobs,
  value,
  onChange,
}: {
  jobs: Job[];
  value: string;
  onChange: (id: string) => void;
}) {
  const bySource = new Map<string, Job[]>();
  for (const job of jobs) {
    const list = bySource.get(job.source) ?? [];
    list.push(job);
    bySource.set(job.source, list);
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default focus:border-corp-accent focus:outline-none"
    >
      <option value="">Kein Job aus dem Job Board</option>
      {Array.from(bySource.entries()).map(([source, sourceJobs]) => (
        <optgroup key={source} label={JOB_SOURCE_LABEL[source] ?? source}>
          {sourceJobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
