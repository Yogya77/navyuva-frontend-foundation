import { useState } from "react";
import { Scroll, Lightbulb, Compass, RotateCcw, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { soundEngine } from "./engine/soundEffects";

interface GameHUDProps {
  currentStage: number;
  stageName: string;
  objective: string;
  score: number;
  cluesCount: number;
  hintsRemaining: number;
  onOpenClues: () => void;
  onRequestHint: () => void;
  onExit: () => void;
  onRestart?: () => void;
}

export function GameHUD({
  currentStage,
  stageName,
  objective,
  score,
  cluesCount,
  hintsRemaining,
  onOpenClues,
  onRequestHint,
  onExit,
  onRestart,
}: GameHUDProps) {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleSound = () => {
    const next = soundEngine.toggleMute();
    setIsMuted(next);
  };

  return (
    <header className="rounded-2xl border border-primary/30 bg-gradient-to-r from-card via-card/95 to-background p-4 sm:p-5 shadow-lg shadow-black/40">
      <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-3.5 sm:flex-row sm:items-center">
        {/* Stage & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/15 text-[10px] uppercase font-bold text-primary"
              >
                Area {currentStage} of 5
              </Badge>
              <span className="text-xs text-muted-foreground">Mohenjo-daro DK-G Sector</span>
            </div>
            <h1 className="font-serif text-lg font-bold text-foreground sm:text-xl">{stageName}</h1>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleSound}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-rose-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-emerald-400" />
            )}
          </Button>

          {/* Clues Pill */}
          <button
            type="button"
            onClick={onOpenClues}
            className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/60 hover:bg-primary/10"
            title="View Discovered Archaeological Clues"
          >
            <Scroll className="h-3.5 w-3.5 text-primary" />
            <span>Clues ({cluesCount})</span>
          </button>

          {/* Score Display */}
          <div className="rounded-lg border border-border/40 bg-background/70 px-3 py-1.5 text-xs font-semibold text-gold">
            <span>Score: {score} pts</span>
          </div>

          {/* Hint Trigger */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onRequestHint}
            disabled={hintsRemaining <= 0}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Request an epigrapher's hint (-25 pts)"
          >
            <Lightbulb className="mr-1 h-3.5 w-3.5 text-amber-400" />
            <span>Hints ({hintsRemaining})</span>
          </Button>

          {/* Optional Restart */}
          {onRestart && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRestart}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Restart from Entrance"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Exit Button */}
          <Button size="sm" variant="outline" onClick={onExit} className="h-8 px-3 text-xs">
            <X className="mr-1 h-3.5 w-3.5" />
            Exit
          </Button>
        </div>
      </div>

      {/* Objective text bar */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider text-primary">
          Current Mission:
        </span>
        <span className="text-foreground">{objective}</span>
      </div>
    </header>
  );
}
