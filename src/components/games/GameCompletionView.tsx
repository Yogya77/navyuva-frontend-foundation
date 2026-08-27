import { Link } from "@tanstack/react-router";
import { Award, ArrowRight, RotateCcw, Landmark, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameReward } from "@/data/games";

interface GameCompletionViewProps {
  gameTitle: string;
  score: number;
  maxScore: number;
  accuracy: number;
  reward: GameReward;
  historicalInsight: string;
  onPlayAgain: () => void;
  onBackToGames: () => void;
}

export function GameCompletionView({
  gameTitle,
  score,
  maxScore,
  accuracy,
  reward,
  historicalInsight,
  onPlayAgain,
  onBackToGames,
}: GameCompletionViewProps) {
  const isArtifact = reward.type === "artifact";

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-primary/40 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 text-center shadow-2xl shadow-primary/10">
      {/* Badge & Icon */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Challenge Completed
      </div>

      <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {gameTitle}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Archaeological expedition successfully resolved.
      </p>

      {/* Score and accuracy statistics */}
      <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-border/50 bg-background/60 p-4 sm:p-6">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Expedition Score
          </span>
          <span className="mt-1 block font-serif text-3xl font-bold text-gold">
            {score} <span className="text-sm font-normal text-muted-foreground">/ {maxScore}</span>
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Accuracy Rating
          </span>
          <span className="mt-1 block font-serif text-3xl font-bold text-emerald-400">
            {accuracy}%
          </span>
        </div>
      </div>

      {/* Reward Card */}
      <div className="mt-6 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 p-5 text-left">
        <div className="flex items-start gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-background/80 text-3xl shadow-inner"
            aria-hidden="true"
          >
            {reward.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Award className="h-4 w-4" />
              {isArtifact ? "Museum Exhibit Unlocked" : "Archive Clue Unlocked"}
            </div>
            <h3 className="mt-1 font-serif text-lg font-bold text-foreground">{reward.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {reward.description}
            </p>
          </div>
        </div>
      </div>

      {/* Historical insight takeaway */}
      <div className="mt-6 rounded-xl border border-border/40 bg-background/40 p-5 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          Historical Takeaway
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{historicalInsight}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {isArtifact && (
          <Button
            asChild
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            <Link to="/museum">
              <Landmark className="mr-2 h-4 w-4" />
              Inspect in Virtual Museum
            </Link>
          </Button>
        )}

        <Button
          onClick={onBackToGames}
          size="lg"
          variant={isArtifact ? "outline" : "default"}
          className="w-full sm:w-auto"
        >
          Explore Other Games
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={onPlayAgain}
          size="lg"
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Replay Challenge
        </Button>
      </div>
    </div>
  );
}
