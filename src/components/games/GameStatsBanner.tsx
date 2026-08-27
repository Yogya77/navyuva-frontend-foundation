import { useState } from "react";
import { Trophy, Award, Scroll, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameProgressState } from "@/hooks/use-game-progress";

interface GameStatsBannerProps {
  progress: GameProgressState;
  onReset: () => void;
  totalAvailableGames: number;
}

export function GameStatsBanner({
  progress,
  onReset,
  totalAvailableGames = 4,
}: GameStatsBannerProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const completedCount = progress.completedGameIds.length;
  const artifactsCount = progress.unlockedArtifactIds.length;
  const cluesCount = progress.cluesCollected;
  const totalScore = progress.totalScore;

  return (
    <section
      aria-label="Player historical progress"
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/90 to-background p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Player Heritage Dossier
          </span>
          <h2 className="font-serif text-lg font-bold text-foreground sm:text-xl">
            Expedition Progress & Rewards
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Reset all stats?</span>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setShowConfirmReset(false);
                }}
                className="inline-flex h-8 items-center justify-center rounded-md bg-rose-600 px-3 text-xs font-medium text-white transition-colors hover:bg-rose-700"
              >
                Confirm
              </button>
              <Button size="sm" variant="outline" onClick={() => setShowConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowConfirmReset(true)}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Reset progress to initial state"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Progress
            </Button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Games Completed */}
        <div className="rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Challenges Won</span>
            <CheckCircle2 className="h-4 w-4 text-primary/70" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-foreground">
            {completedCount}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              / {totalAvailableGames}
            </span>
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/40">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${totalAvailableGames > 0 ? (completedCount / totalAvailableGames) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Artifacts Unlocked */}
        <div className="rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Museum Relics</span>
            <Award className="h-4 w-4 text-gold/80" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-foreground">
            {artifactsCount} <span className="text-xs font-normal text-muted-foreground">/ 6</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Synced to /museum</p>
        </div>

        {/* Clues Collected */}
        <div className="rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Clues Gathered</span>
            <Scroll className="h-4 w-4 text-primary/70" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-foreground">
            {cluesCount} <span className="text-xs font-normal text-muted-foreground">/ 15</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Knowledge archives</p>
        </div>

        {/* Total Score */}
        <div className="rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Score</span>
            <Trophy className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-gold">
            {totalScore} <span className="text-xs font-normal text-muted-foreground">pts</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Historical mastery</p>
        </div>
      </div>
    </section>
  );
}
