import { Lock } from "lucide-react";
import type { Artifact } from "@/data/museum";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArtifactCardProps {
  artifact: Artifact;
  selected: boolean;
  onSelect: (artifact: Artifact) => void;
}

export function ArtifactCard({ artifact, selected, onSelect }: ArtifactCardProps) {
  const locked = artifact.locked;

  return (
    <button
      type="button"
      onClick={() => onSelect(artifact)}
      aria-pressed={selected}
      className={cn(
        "group flex h-full flex-col rounded-xl border bg-card p-4 text-left transition-all duration-300",
        selected
          ? "border-primary/60 shadow-lg shadow-primary/10"
          : "border-border/50 hover:-translate-y-1 hover:border-primary/30",
        locked && "opacity-60",
      )}
    >
      <span
        className={cn(
          "flex h-24 items-center justify-center rounded-lg border border-border/40 bg-background/60 text-4xl transition-colors",
          locked ? "grayscale" : "group-hover:border-primary/30",
        )}
        aria-hidden="true"
      >
        {locked ? <Lock className="h-7 w-7 text-muted-foreground" /> : artifact.emoji}
      </span>
      <span className="mt-4 block font-serif text-base font-semibold text-card-foreground">
        {artifact.name}
      </span>
      <span className="mt-2 block flex-1 text-sm leading-relaxed text-muted-foreground">
        {locked ? "Locked — progress through game levels to reveal this exhibit." : artifact.short}
      </span>
      <span className="mt-4 block">
        {locked ? (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Locked
          </span>
        ) : (
          <Button asChild={false} size="sm" variant="outline" tabIndex={-1}>
            View Details
          </Button>
        )}
      </span>
    </button>
  );
}
