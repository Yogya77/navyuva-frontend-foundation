import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Key,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PATTERN_PUZZLES } from "@/data/games";
import { cn } from "@/lib/utils";

interface DecipherThePastGameProps {
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

export function DecipherThePastGame({ onComplete, onExit }: DecipherThePastGameProps) {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const puzzle = PATTERN_PUZZLES[currentPuzzleIndex] ?? PATTERN_PUZZLES[0]!;
  const totalPuzzles = PATTERN_PUZZLES.length;
  const maxScore = totalPuzzles * 200;

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setAttempts((prev) => prev + 1);

    const chosen = puzzle.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      // Deduct slightly if hint was used
      const pointsEarned = showHint ? 150 : 200;
      setScore((prev) => prev + pointsEarned);
    }
  };

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < totalPuzzles - 1) {
      setCurrentPuzzleIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      onComplete(score, maxScore);
    }
  };

  if (!hasStarted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <Key className="h-4 w-4" />
          Epigraphic Pattern Puzzle
        </div>

        <h2 className="mt-3 font-serif text-3xl font-bold text-foreground">
          Decipher the Past: Indus Epigraphy
        </h2>
        <p className="mt-1 text-sm text-gold">Indus Valley Civilization • 2600–1900 BCE</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Study the syntax and layout of ancient Indus seal motifs. Analyze glyph sequences,
            standard sign pairings, and directional iconography inspired by authentic Harappan
            archaeological finds.
          </p>
          <div className="rounded-xl border border-border/50 bg-background/60 p-4">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">
              Scientific Transparency Note
            </span>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              The ancient Indus script remains one of archaeology&apos;s greatest unsolved puzzles.
              This game is an educational pattern exercise modeled on sign-frequency studies by
              epigraphers, designed to demonstrate how researchers analyze ancient visual systems.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2 font-serif text-sm font-bold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Reward:
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete the symbol analysis to earn an{" "}
            <strong className="text-foreground">Epigraphic Clue Fragment</strong> for your Museum
            Collection.
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
            Begin Pattern Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const selectedOption = puzzle.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Pattern {currentPuzzleIndex + 1} of {totalPuzzles} • {puzzle.theme}
          </span>
          <h2 className="mt-1 font-serif text-xl font-bold text-foreground sm:text-2xl">
            {puzzle.title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Score
            </span>
            <span className="font-serif text-lg font-bold text-gold">
              {score}{" "}
              <span className="text-xs font-normal text-muted-foreground">/ {maxScore}</span>
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Scenario */}
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{puzzle.scenario}</p>

      {/* Symbol Sequence Display */}
      <div className="mt-6 rounded-xl border border-primary/30 bg-background/80 p-6 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Glyph Sequence on Seal Stamp Impression
        </span>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {puzzle.symbolSequence.map((item, idx) => {
            const isMissing = idx === puzzle.missingIndex;
            return (
              <div
                key={idx}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-3.5 transition-all",
                  isMissing
                    ? isAnswerSubmitted && selectedOption?.isCorrect
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                      : "border-dashed border-primary bg-primary/10 text-primary animate-pulse"
                    : "border-border/60 bg-card",
                  "h-24 w-24 sm:h-28 sm:w-28",
                )}
              >
                <span className="text-3xl sm:text-4xl" aria-hidden="true">
                  {isMissing && isAnswerSubmitted && selectedOption?.isCorrect
                    ? selectedOption.glyph
                    : item.glyph}
                </span>
                <span className="mt-1.5 block max-w-full truncate text-[10px] font-semibold text-muted-foreground">
                  {isMissing && isAnswerSubmitted && selectedOption?.isCorrect
                    ? selectedOption.label
                    : item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hint toggle */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Attempts: {attempts}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHint((prev) => !prev)}
          className="text-xs text-gold hover:text-gold/90"
        >
          <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
          {showHint ? "Hide Hint" : "Request Epigrapher's Hint (-50 pts)"}
        </Button>
      </div>

      {showHint && (
        <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
          <strong>Epigraphic Clue:</strong> Look closely at the function of the missing item in the
          standard sequence.
        </div>
      )}

      {/* Multiple Choice Selection */}
      <div className="mt-6">
        <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          Select the correct glyph to complete the sequence:
        </h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {puzzle.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let cardStyle =
              "border-border/50 bg-background/40 hover:border-primary/40 hover:bg-background/80";

            if (isAnswerSubmitted) {
              if (opt.isCorrect) {
                cardStyle = "border-emerald-500/80 bg-emerald-950/30 text-emerald-100";
              } else if (isSelected && !opt.isCorrect) {
                cardStyle = "border-rose-500/80 bg-rose-950/30 text-rose-100";
              } else {
                cardStyle = "border-border/30 bg-background/20 opacity-50";
              }
            } else if (isSelected) {
              cardStyle = "border-primary bg-primary/15 text-foreground";
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswerSubmitted}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all",
                  cardStyle,
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-2xl">
                  {opt.glyph}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-sm font-semibold text-foreground">
                    {opt.label}
                  </span>
                </span>
                {isAnswerSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                )}
                {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box */}
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
                Sequence Verified!
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-400" />
                Incorrect Sign Selection
              </>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed opacity-90">{selectedOption.explanation}</p>
          <p className="mt-2 border-t border-border/30 pt-2 text-[11px] italic opacity-80">
            {puzzle.educationalNote}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
        <span className="text-xs text-muted-foreground">
          Puzzle {currentPuzzleIndex + 1} of {totalPuzzles}
        </span>

        {!isAnswerSubmitted ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={!selectedOptionId}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            Verify Glyph
          </Button>
        ) : (
          <Button
            onClick={handleNextPuzzle}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {currentPuzzleIndex < totalPuzzles - 1 ? (
              <>
                Next Pattern <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            ) : (
              "Complete Decipherment"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
