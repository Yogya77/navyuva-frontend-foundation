import { Compass, Search, HelpCircle, Key, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GameDefinition } from "@/data/games";
import type { GameScoreRecord } from "@/hooks/use-game-progress";
import { cn } from "@/lib/utils";

export interface GameCardProps {
  game: GameDefinition;
  isCompleted: boolean;
  scoreRecord?: GameScoreRecord | undefined;
  onPlay: (gameId: string) => void;
}

const ICON_MAP: Record<string, typeof Search> = {
  Search,
  HelpCircle,
  Compass,
  Key,
};

export function GameCard({ game, isCompleted, scoreRecord, onPlay }: GameCardProps) {
  const IconComponent = ICON_MAP[game.iconName] || Compass;

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Medium: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    Hard: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border bg-card p-6 transition-all duration-300",
        isCompleted
          ? "border-primary/50 shadow-md shadow-primary/5 hover:border-primary/80"
          : "border-border/60 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
      )}
    >
      <div>
        {/* Top meta */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <IconComponent className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {game.civilization}
              </span>
              <span className="block text-xs text-muted-foreground">{game.era}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-semibold uppercase",
                difficultyColors[game.difficulty],
              )}
            >
              {game.difficulty}
            </Badge>
            <span className="text-[11px] text-muted-foreground">{game.duration}</span>
          </div>
        </div>

        {/* Title and game type */}
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-foreground transition-colors group-hover:text-primary">
              {game.title}
            </h3>
            {isCompleted && (
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-emerald-400"
                aria-label="Completed challenge"
              />
            )}
          </div>
          <span className="mt-1 inline-block text-xs font-medium text-gold/90">{game.type}</span>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {game.shortDescription}
          </p>
        </div>

        {/* Reward pill */}
        <div className="mt-5 rounded-xl border border-border/40 bg-background/60 p-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl" aria-hidden="true">
              {game.reward.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                {game.reward.type === "artifact" ? "Museum Relic Reward" : "Historical Clue"}
              </span>
              <span className="block truncate text-xs font-medium text-foreground">
                {game.reward.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
        <div>
          {isCompleted && scoreRecord ? (
            <div className="text-left">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                Best Score
              </span>
              <span className="font-serif text-sm font-bold text-foreground">
                {scoreRecord.score} / {scoreRecord.maxScore}{" "}
                <span className="text-xs font-normal text-emerald-400">
                  ({scoreRecord.accuracy}%)
                </span>
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Unsolved Mystery</span>
          )}
        </div>

        <Button
          onClick={() => onPlay(game.id)}
          size="sm"
          className={cn(
            "gap-1.5 transition-transform",
            isCompleted
              ? "border border-border/60 bg-secondary/80 text-foreground hover:bg-secondary"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {isCompleted ? "Replay Challenge" : "Begin Expedition"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  );
}
