interface ProgressPanelProps {
  artifactsUnlocked: number;
  artifactsTotal: number;
  cluesCollected: number;
  cluesTotal: number;
}

function Bar({ value, total }: { value: number; total: number }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/80">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function ProgressPanel({
  artifactsUnlocked,
  artifactsTotal,
  cluesCollected,
  cluesTotal,
}: ProgressPanelProps) {
  const overall = Math.round(
    ((artifactsUnlocked + cluesCollected) / (artifactsTotal + cluesTotal)) * 100,
  );

  const items = [
    {
      label: "Artifacts",
      value: `${artifactsUnlocked} / ${artifactsTotal}`,
      bar: [artifactsUnlocked, artifactsTotal] as const,
    },
    {
      label: "Clues",
      value: `${cluesCollected} / ${cluesTotal}`,
      bar: [cluesCollected, cluesTotal] as const,
    },
    { label: "Overall Progress", value: `${overall}%`, bar: [overall, 100] as const },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border/50 bg-card p-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            {item.label}
          </span>
          <p className="mt-2 font-serif text-2xl font-bold text-foreground">{item.value}</p>
          <Bar value={item.bar[0]} total={item.bar[1]} />
        </div>
      ))}
    </section>
  );
}
