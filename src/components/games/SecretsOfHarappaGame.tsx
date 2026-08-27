import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, HelpCircle, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HARAPPA_QUIZ_QUESTIONS } from "@/data/games";
import { cn } from "@/lib/utils";

interface SecretsOfHarappaGameProps {
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

export function SecretsOfHarappaGame({ onComplete, onExit }: SecretsOfHarappaGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const question = HARAPPA_QUIZ_QUESTIONS[currentIndex] ?? HARAPPA_QUIZ_QUESTIONS[0]!;
  const totalQuestions = HARAPPA_QUIZ_QUESTIONS.length;
  const maxScore = totalQuestions * 100;
  const currentScore = correctAnswersCount * 100;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedOptionIndex === question.correctIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      const isLastCorrect = selectedOptionIndex === question.correctIndex;
      const finalCount = isAnswerSubmitted
        ? correctAnswersCount
        : isLastCorrect
          ? correctAnswersCount + 1
          : correctAnswersCount;
      onComplete(finalCount * 100, maxScore);
    }
  };

  if (!hasStarted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <Scroll className="h-4 w-4" />
          Archaeological Quiz Challenge
        </div>

        <h2 className="mt-3 font-serif text-3xl font-bold text-foreground">Secrets of Harappa</h2>
        <p className="mt-1 text-sm text-gold">Indus Valley Civilization • 2600–1900 BCE</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Welcome to the Harappan Knowledge Trial. You will be presented with 5 archaeological
            questions testing your understanding of Bronze Age civic planning, hydraulic
            engineering, standardized metrology, and international dockyard networks.
          </p>
          <p>
            Scoring well will earn you the prestigious{" "}
            <strong className="text-foreground">Harappan Knowledge Scroll</strong> clue for your
            permanent museum archives.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-border/40 bg-background/50 p-4 text-center">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Questions
            </span>
            <span className="font-serif text-lg font-bold text-foreground">5 Inquiries</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Max Score
            </span>
            <span className="font-serif text-lg font-bold text-gold">500 pts</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Reward
            </span>
            <span className="font-serif text-lg font-bold text-primary">1 Archive Clue</span>
          </div>
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
            Start Quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Topic: {question.topic}
          </span>
          <h2 className="mt-1 font-serif text-xl font-bold text-foreground">
            Inquiry {currentIndex + 1} of {totalQuestions}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Score
            </span>
            <span className="font-serif text-lg font-bold text-gold">
              {currentScore}{" "}
              <span className="text-xs font-normal text-muted-foreground">/ {maxScore}</span>
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-border/40">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mt-6">
        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground flex items-start gap-2.5">
          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span>{question.question}</span>
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="mt-6 space-y-3">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = idx === question.correctIndex;

          let cardStyle =
            "border-border/50 bg-background/40 hover:border-primary/40 hover:bg-background/80";

          if (isAnswerSubmitted) {
            if (isCorrect) {
              cardStyle = "border-emerald-500/80 bg-emerald-950/30 text-emerald-100";
            } else if (isSelected && !isCorrect) {
              cardStyle = "border-rose-500/80 bg-rose-950/30 text-rose-100";
            } else {
              cardStyle = "border-border/30 bg-background/20 opacity-50";
            }
          } else if (isSelected) {
            cardStyle = "border-primary bg-primary/15 text-foreground";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswerSubmitted}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-xl border p-4 text-left transition-all duration-200",
                cardStyle,
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold uppercase",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground",
                  isAnswerSubmitted && isCorrect && "border-emerald-400 bg-emerald-500 text-black",
                  isAnswerSubmitted &&
                    isSelected &&
                    !isCorrect &&
                    "border-rose-400 bg-rose-500 text-white",
                )}
              >
                {optionLetters[idx]}
              </span>
              <span className="flex-1 text-sm leading-relaxed text-foreground">{optionText}</span>
              {isAnswerSubmitted && isCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              )}
              {isAnswerSubmitted && isSelected && !isCorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswerSubmitted && (
        <div
          className={cn(
            "mt-6 rounded-xl border p-4 text-sm leading-relaxed",
            selectedOptionIndex === question.correctIndex
              ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
              : "border-rose-500/40 bg-rose-950/20 text-rose-200",
          )}
        >
          <div className="flex items-center gap-2 font-serif text-sm font-bold">
            {selectedOptionIndex === question.correctIndex ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Correct Answer (+100 pts)
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-400" />
                Historical Insight
              </>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed opacity-90">{question.explanation}</p>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
        <span className="text-xs text-muted-foreground">
          Question {currentIndex + 1} of {totalQuestions}
        </span>

        {!isAnswerSubmitted ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={selectedOptionIndex === null}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            Confirm Answer
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            size="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {currentIndex < totalQuestions - 1 ? (
              <>
                Next Question <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            ) : (
              "View Results"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
