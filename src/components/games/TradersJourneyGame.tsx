import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  ShieldAlert,
  Sparkles,
  Coins,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TRADERS_JOURNEY_STAGES, type TradeDecisionOption } from "@/data/games";
import { cn } from "@/lib/utils";

interface TradersJourneyGameProps {
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

export function TradersJourneyGame({ onComplete, onExit }: TradersJourneyGameProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isDecisionResolved, setIsDecisionResolved] = useState(false);
  const [score, setScore] = useState(0);
  const [gold, setGold] = useState(100);
  const [reputation, setReputation] = useState(100);
  const [hasStarted, setHasStarted] = useState(false);

  const stage = TRADERS_JOURNEY_STAGES[currentStageIndex] ?? TRADERS_JOURNEY_STAGES[0]!;
  const totalStages = TRADERS_JOURNEY_STAGES.length;
  const maxScore = 500;

  const handleSelectOption = (optId: string) => {
    if (isDecisionResolved) return;
    setSelectedOptionId(optId);
  };

  const handleResolveDecision = () => {
    if (!selectedOptionId || isDecisionResolved) return;
    setIsDecisionResolved(true);

    const chosen = stage.options.find((o) => o.id === selectedOptionId);
    if (chosen) {
      setScore((prev) => prev + chosen.pointsDelta);
      setGold((prev) => prev + chosen.resourceOutcome.gold);
      setReputation((prev) => Math.max(0, prev + chosen.resourceOutcome.reputation));
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex < totalStages - 1) {
      setCurrentStageIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsDecisionResolved(false);
    } else {
      const finalScore = Math.min(maxScore, score);
      onComplete(finalScore, maxScore);
    }
  };

  if (!hasStarted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <Compass className="h-4 w-4" />
          Trade & Decision Expedition
        </div>

        <h2 className="mt-3 font-serif text-3xl font-bold text-foreground">
          Trader&apos;s Journey: Lothal to Ur
        </h2>
        <p className="mt-1 text-sm text-gold">Indus Valley Maritime Guild • 2600–1900 BCE</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Command a Harappan merchant fleet setting sail from the tidal dockyard of Lothal across
            the Arabian Sea to Dilmun and Mesopotamia (the land of Ur).
          </p>
          <p>
            At each major crossroads, you must make strategic decisions regarding cargo selection,
            coastal navigation during monsoon squalls, weight verification before Dilmun
            magistrates, and final contract negotiations with royal scribes.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2 font-serif text-sm font-bold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Museum Relic Reward:
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Successfully navigating this trade voyage unlocks the{" "}
            <strong className="text-foreground">Carnelian Bead</strong> in the NAVYUVA Virtual
            Museum.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
          <Button
            variant="ghost"
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>

          <Button
            onClick={() => setHasStarted(true)}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Set Sail from Lothal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const selectedOption: TradeDecisionOption | undefined = stage.options.find(
    (o) => o.id === selectedOptionId,
  );

  const riskBadgeStyles = {
    Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Moderate: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    High: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      {/* Top Banner with Resources */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Waypoint {stage.stage} of {totalStages} • {stage.location}
          </span>
          <h2 className="mt-1 font-serif text-xl font-bold text-foreground sm:text-2xl">
            {stage.scenarioTitle}
          </h2>
        </div>

        {/* Resources */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-background/60 px-3 py-1.5 text-xs font-semibold text-gold">
            <Coins className="h-4 w-4" />
            <span>{gold} Silver</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-background/60 px-3 py-1.5 text-xs font-semibold text-primary">
            <Users className="h-4 w-4" />
            <span>{reputation} Rep</span>
          </div>
          <Button variant="outline" size="sm" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Narrative & Context */}
      <div className="mt-6 rounded-xl border border-border/50 bg-background/60 p-5">
        <p className="text-sm leading-relaxed text-foreground">{stage.narrative}</p>
        <div className="mt-3 border-t border-border/30 pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Historical Context:
          </span>
          <p className="mt-0.5 text-xs italic text-muted-foreground">{stage.historicalContext}</p>
        </div>
      </div>

      {/* Decision Options */}
      <div className="mt-6">
        <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Select Your Course of Action:
        </h3>

        <div className="mt-3 space-y-3">
          {stage.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                disabled={isDecisionResolved}
                className={cn(
                  "flex w-full flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/5"
                    : "border-border/50 bg-background/40 hover:border-primary/30 hover:bg-background/80",
                  isDecisionResolved && !isSelected && "opacity-40",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif text-base font-bold text-foreground">{option.title}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold uppercase",
                      riskBadgeStyles[option.risk],
                    )}
                  >
                    {option.risk} Risk
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {option.description}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                  <ShieldAlert className="h-3 w-3 text-primary/70" />
                  <span>{option.costDescription}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution Outcome Box */}
      {isDecisionResolved && selectedOption && (
        <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 text-emerald-200">
          <div className="flex items-center gap-2 font-serif text-sm font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Decision Outcome (+{selectedOption.pointsDelta} pts)
          </div>
          <p className="mt-2 text-xs leading-relaxed text-emerald-100/90">
            {selectedOption.outcomeText}
          </p>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
        <span className="text-xs text-muted-foreground">
          Stage {currentStageIndex + 1} of {totalStages}
        </span>

        {!isDecisionResolved ? (
          <Button
            onClick={handleResolveDecision}
            disabled={!selectedOptionId}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            Execute Trade Order
          </Button>
        ) : (
          <Button
            onClick={handleNextStage}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {currentStageIndex < totalStages - 1 ? (
              <>
                Next Waypoint <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            ) : (
              "Complete Voyage & Tally Wealth"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
