interface GameHeaderProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function GameHeader({
  title = "Historical Games",
  subtitle = "Step into the shoes of ancient explorers, merchants, and epigraphers. Solve historical mysteries, master ancient trade routes, and earn artifacts for your virtual museum collection.",
  eyebrow = "Interactive Challenges & Quests",
}: GameHeaderProps) {
  return (
    <header className="text-center">
      <span className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
        {eyebrow}
      </span>
      <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {subtitle}
      </p>

      <div className="mt-8 flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50 sm:w-28" />
        <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
        <span className="h-px w-24 bg-primary/40 sm:w-40" />
        <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50 sm:w-28" />
      </div>
    </header>
  );
}
