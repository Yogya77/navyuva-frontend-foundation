import type { Artifact } from "@/data/museum";

interface ArtifactDetailsProps {
  artifact: Artifact;
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

export function ArtifactDetails({ artifact }: ArtifactDetailsProps) {
  return (
    <section className="rounded-xl border border-border/50 bg-card p-5 sm:p-7">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <h3 className="truncate font-serif text-xl font-bold text-foreground sm:text-2xl">
          {artifact.name}
        </h3>
        <span className="shrink-0 text-3xl" aria-hidden="true">
          {artifact.emoji}
        </span>
      </div>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Type" value={artifact.type} />
        <Field label="Period" value={artifact.period} />
        <Field label="Material" value={artifact.material} />
        <Field label="Site" value={artifact.site} />
      </dl>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{artifact.description}</p>

      <div className="mt-7 border-t border-border/50 pt-6">
        <h4 className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          What Does This Artifact Tell Us?
        </h4>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {artifact.insights?.map((insight) => (
            <li
              key={insight.label}
              className="rounded-lg border border-border/40 bg-background/50 p-4"
            >
              <span className="block font-serif text-sm font-semibold text-foreground">
                {insight.label}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                {insight.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
