import { Lock, Shield, Award, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GameDefinition } from "@/data/games";

interface LockedGameCardProps {
  game: GameDefinition;
}

const LOCKED_ICON_MAP: Record<string, typeof Shield> = {
  Shield,
  Award,
  Landmark,
};

export function LockedGameCard({ game }: LockedGameCardProps) {
  const IconComponent = LOCKED_ICON_MAP[game.iconName] || Lock;

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-border/40 bg-card/40 p-6 opacity-75 backdrop-blur-[2px] transition-all duration-300 hover:border-border/60 hover:opacity-90">
      <div>
        {/* Top meta */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground"
              aria-hidden="true"
            >
              <IconComponent className="h-5 w-5 opacity-60" />
            </span>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {game.civilization}
              </span>
              <span className="block text-xs text-muted-foreground/80">{game.era}</span>
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-border/50 bg-background/50 text-[10px] text-muted-foreground"
          >
            {game.type}
          </Badge>
        </div>

        {/* Title */}
        <div className="mt-5">
          <h3 className="font-serif text-xl font-bold text-muted-foreground/90">{game.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground/70">
            {game.shortDescription}
          </p>
        </div>

        {/* Future Reward Preview */}
        <div className="mt-4 rounded-xl border border-border/30 bg-background/30 p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg opacity-50" aria-hidden="true">
              {game.reward.emoji}
            </span>
            <span className="text-xs text-muted-foreground/80">
              Future exhibit:{" "}
              <span className="font-medium text-muted-foreground">{game.reward.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lock footer requirement */}
      <div className="mt-6 flex items-center gap-2.5 border-t border-border/30 pt-4 text-xs text-muted-foreground">
        <Lock className="h-4 w-4 shrink-0 text-primary/60" aria-hidden="true" />
        <span className="leading-snug">
          {game.lockRequirement || "Requires museum progress to unlock."}
        </span>
      </div>
    </div>
  );
}
