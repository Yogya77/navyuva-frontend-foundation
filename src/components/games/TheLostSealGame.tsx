import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOST_SEAL_STEPS } from "@/data/games";
import { cn } from "@/lib/utils";

interface TheLostSealGameProps {
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

export function TheLostSealGame({ onComplete, onExit }: TheLostSealGameProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const step = LOST_SEAL_STEPS[currentStepIndex] ?? LOST_SEAL_STEPS[0]!;
  const maxScore = LOST_SEAL_STEPS.length * 100;

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const chosen = step.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setScore((prev) => prev + 100);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < LOST_SEAL_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Completed
      const chosen = step.options.find((o) => o.id === selectedOptionId);
      const finalScore = score + (chosen?.isCorrect && !isAnswerSubmitted ? 100 : 0);
      onComplete(finalScore, maxScore);
    }
  };

  if (!hasStarted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-4 w-4" />
          Artifact Mystery Expedition
        </div>

        <h2 className="mt-3 font-serif text-3xl font-bold text-foreground">
          The Lost Seal: Mohenjo-daro
        </h2>
        <p className="mt-1 text-sm text-gold">Indus Valley Civilization • 2600–1900 BCE</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            You have joined the archaeological field team at Mohenjo-daro. During the excavation of
            the DK-G lower city quarter, a remarkable square tablet has been discovered beneath the
            collapsed brick flooring of a merchant warehouse.
          </p>
          <p>
            Your mission is to examine the artifact&apos;s physical properties, iconography, and
            reverse fastenings through 3 investigative stages. Choose the most rigorous historical
            deduction at each stage to unlock the mystery and preserve the seal for the museum.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2 font-serif text-sm font-bold text-foreground">
            <Info className="h-4 w-4 text-primary" />
            Archaeologist Reward:
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Successfully concluding this mystery unlocks the{" "}
            <strong className="text-foreground">Steatite Stamp Seal</strong> in the NAVYUVA Virtual
            Museum and awards 1 Historical Clue.
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
            Begin Investigation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const selectedOption = step.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      {/* Header with progress and score */}
      <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span>
              Investigation Stage {step.stepNumber} of {LOST_SEAL_STEPS.length}
            </span>
          </div>
          <h2 className="mt-1 font-serif text-xl font-bold text-foreground sm:text-2xl">
            {step.stageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Current Score
            </span>
            <span className="font-serif text-lg font-bold text-gold">
              {score} <span className="text-xs font-normal text-muted-foreground">pts</span>
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Visual & Context Evidence Box */}
      <div className="mt-6 rounded-xl border border-border/50 bg-background/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-3xl"
            aria-hidden="true"
          >
            {step.visualEvidence.icon}
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Field Observation
            </span>
            <h3 className="mt-0.5 font-serif text-base font-bold text-foreground">
              {step.visualEvidence.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {step.visualEvidence.description}
            </p>
            <p className="mt-2 text-xs italic text-muted-foreground/80">
              {step.archaeologicalContext}
            </p>
          </div>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mt-6">
        <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary shrink-0" />
          {step.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="mt-5 space-y-3">
        {step.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          let optionStyle =
            "border-border/50 bg-background/40 hover:border-primary/40 hover:bg-background/80";

          if (isAnswerSubmitted) {
            if (option.isCorrect) {
              optionStyle = "border-emerald-500/80 bg-emerald-950/30 text-emerald-100";
            } else if (isSelected && !option.isCorrect) {
              optionStyle = "border-rose-500/80 bg-rose-950/30 text-rose-100";
            } else {
              optionStyle = "border-border/30 bg-background/20 opacity-50";
            }
          } else if (isSelected) {
            optionStyle = "border-primary bg-primary/15 text-foreground";
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option.id)}
              disabled={isAnswerSubmitted}
              className={cn(
                "flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all duration-200",
                optionStyle,
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold uppercase",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground",
                  isAnswerSubmitted &&
                    option.isCorrect &&
                    "border-emerald-400 bg-emerald-500 text-black",
                  isAnswerSubmitted &&
                    isSelected &&
                    !option.isCorrect &&
                    "border-rose-400 bg-rose-500 text-white",
                )}
              >
                {option.id}
              </span>
              <span className="flex-1 text-sm leading-relaxed text-foreground">{option.text}</span>
              {isAnswerSubmitted && option.isCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              )}
              {isAnswerSubmitted && isSelected && !option.isCorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Feedback Box */}
      {isAnswerSubmitted && selectedOption && (
        <div
          className={cn(
            "mt-6 rounded-xl border p-4 text-sm leading-relaxed",
            selectedOption.isCorrect
              ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
              : "border-rose-500/40 bg-rose-950/20 text-rose-200",
          )}
        >
          <div className="flex items-center gap-2 font-serif text-sm font-bold">
            {selectedOption.isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Deduction Confirmed (+100 pts)
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-400" />
                Archaeological Analysis Correction
              </>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed opacity-90">{selectedOption.explanation}</p>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
        <span className="text-xs text-muted-foreground">
          Step {currentStepIndex + 1} of {LOST_SEAL_STEPS.length}
        </span>

        {!isAnswerSubmitted ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={!selectedOptionId}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            Submit Deduction
          </Button>
        ) : (
          <Button
            onClick={handleNextStep}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {currentStepIndex < LOST_SEAL_STEPS.length - 1 ? (
              <>
                Next Stage <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            ) : (
              "Conclude Investigation"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
