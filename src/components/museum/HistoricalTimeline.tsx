import { Lock } from "lucide-react";
import type { Civilization } from "@/data/museum";
import { cn } from "@/lib/utils";

interface HistoricalTimelineProps {
  civilizations: Civilization[];
  activeId: string;
}

export function HistoricalTimeline({ civilizations, activeId }: HistoricalTimelineProps) {
  return (
    <section aria-label="Historical timeline" className="relative">
      <div
        className="absolute left-3 top-0 h-full w-px bg-border/60 md:left-0 md:top-6 md:h-px md:w-full"
        aria-hidden="true"
      />
      <ol className="relative grid gap-6 md:grid-cols-6 md:gap-4">
        {civilizations.map((civ) => {
          const isActive = civ.id === activeId;
          return (
            <li key={civ.id} className="flex items-start gap-4 md:flex-col md:items-center">
              <span
                className={cn(
                  "z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 bg-background transition-colors",
                  isActive ? "border-primary bg-primary/20" : "border-border/70",
                )}
              >
                {civ.locked ? (
                  <Lock className="h-3 w-3 text-muted-foreground" aria-label="Locked" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 md:mt-3 md:text-center">
                <span
                  className={cn(
                    "block font-serif text-sm font-semibold",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {civ.period}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs",
                    isActive ? "text-foreground" : "text-muted-foreground/80",
                  )}
                >
                  {civ.name}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
