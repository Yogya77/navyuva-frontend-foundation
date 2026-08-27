import { Lock } from "lucide-react";
import type { Civilization } from "@/data/museum";
import { cn } from "@/lib/utils";

interface CivilizationSidebarProps {
  civilizations: Civilization[];
  activeId: string;
  onSelect: (civilization: Civilization) => void;
}

export function CivilizationSidebar({
  civilizations,
  activeId,
  onSelect,
}: CivilizationSidebarProps) {
  return (
    <nav
      aria-label="Civilizations"
      className="rounded-xl border border-border/50 bg-card p-4 sm:p-5"
    >
      <h2 className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
        Civilizations
      </h2>
      <ul className="mt-4 space-y-2">
        {civilizations.map((civ) => {
          const isActive = civ.id === activeId;
          return (
            <li key={civ.id}>
              <button
                type="button"
                onClick={() => onSelect(civ)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-all duration-300",
                  isActive
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/40 bg-background/40 hover:border-primary/30",
                  civ.locked && "opacity-55 hover:opacity-80",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-sm font-semibold text-foreground">
                    {civ.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{civ.period}</span>
                </span>
                <span
                  className={cn(
                    "mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em]",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {civ.locked ? <Lock className="h-3.5 w-3.5" aria-label="Locked" /> : "Active"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
