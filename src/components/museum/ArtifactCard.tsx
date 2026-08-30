import { Lock, Sparkles, MapPin, Eye } from "lucide-react";
import type { Artifact } from "@/data/museum";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArtifactCardProps {
  artifact: Artifact;
  selected: boolean;
  onSelect: (artifact: Artifact) => void;
  onOpenModal?: (artifact: Artifact) => void;
}

export function ArtifactCard({ artifact, selected, onSelect, onOpenModal }: ArtifactCardProps) {
  const locked = artifact.locked;

  const handleClick = () => {
    onSelect(artifact);
  };

  const handleExamine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!locked && onOpenModal) {
      onOpenModal(artifact);
    } else {
      onSelect(artifact);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-pressed={selected}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all duration-500",
        selected
          ? "border-primary/80 bg-stone-900/90 shadow-xl shadow-primary/15 ring-1 ring-primary/40"
          : "border-border/50 bg-stone-950/70 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-stone-900/60 hover:shadow-lg hover:shadow-black/50",
        locked && "cursor-not-allowed opacity-65",
      )}
    >
      {/* Top Image Showcase Frame */}
      <div className="relative flex h-52 w-full items-center justify-center overflow-hidden border-b border-border/40 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-3.5">
        {locked ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-stone-900/80 text-muted-foreground shadow-inner">
              <Lock className="h-6 w-6 text-primary/60" />
            </div>
            <span className="mt-3 font-serif text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Locked Exhibit
            </span>
          </div>
        ) : (
          <>
            <img
              src={artifact.image}
              alt={artifact.name}
              className="max-h-full max-w-full rounded-md object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            {/* Category Tag */}
            <span className="absolute left-3 top-3 rounded border border-primary/30 bg-black/75 px-2.5 py-0.5 font-serif text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              {artifact.category}
            </span>

            {/* Quick Inspect Hover Overlay Button */}
            <button
              type="button"
              onClick={handleExamine}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-black/70 text-primary opacity-0 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-black group-hover:opacity-100"
              title="Examine Artifact"
              aria-label={`Examine ${artifact.name}`}
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 text-primary/70" />
          <span className="truncate">{artifact.site}</span>
          <span className="text-border">•</span>
          <span className="truncate">{artifact.period.split("(")[0]}</span>
        </div>

        <h3 className="mt-2 font-serif text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
          {artifact.name}
        </h3>

        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {locked ? "Locked — progress through chapters in The Lost Seal to uncover this exhibit." : artifact.short}
        </p>

        {/* Card Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
          {locked ? (
            <span className="inline-flex items-center gap-1.5 font-serif text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Lock className="h-3 w-3" /> Unlocks in Game
            </span>
          ) : (
            <>
              <span className="font-mono text-[11px] text-primary/80">
                {artifact.material.split(" ")[0]}
              </span>
              <Button
                size="sm"
                variant={selected ? "default" : "outline"}
                className={cn(
                  "h-7 text-xs font-serif transition-all",
                  selected
                    ? "bg-primary text-black hover:bg-primary/90"
                    : "border-primary/40 text-primary hover:bg-primary/15",
                )}
                onClick={handleExamine}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Explore
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

