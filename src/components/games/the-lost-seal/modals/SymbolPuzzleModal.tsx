import { useState } from "react";
import { Sparkles, X, CheckCircle2, XCircle, RotateCcw, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SymbolPuzzleTile } from "../types";
import { cn } from "@/lib/utils";

interface SymbolPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPuzzleSolved: (scoreEarned: number) => void;
}

const AVAILABLE_GLYPHS: SymbolPuzzleTile[] = [
  {
    id: "g-bull",
    glyph: "🐂",
    label: "Zebu Bull Totem",
    epigraphicMeaning: "Central animal emblem representing merchant authority.",
  },
  {
    id: "g-manger",
    glyph: "🏺",
    label: "Sacred Feeding Manger",
    epigraphicMeaning: "Cultic vessel positioned before the sacred animal.",
  },
  {
    id: "g-fish",
    glyph: "🐟",
    label: "Fish Sign (Mīn)",
    epigraphicMeaning: "High-frequency Indus glyph associated with celestial deities.",
  },
  {
    id: "g-bow",
    glyph: "🏹",
    label: "Terminal Bow Sign",
    epigraphicMeaning: "Common closing sign appearing on seal edge margins.",
  },
  {
    id: "g-wheel",
    glyph: "☸️",
    label: "Spoked Wheel Sign",
    epigraphicMeaning: "Solar / cyclical calendar glyph.",
  },
  {
    id: "g-tree",
    glyph: "🌳",
    label: "Pipal Tree Sign",
    epigraphicMeaning: "Sacred fig motif in Harappan iconography.",
  },
];

const CORRECT_SEQUENCE = ["g-manger", "g-bull", "g-fish", "g-bow"];

export function SymbolPuzzleModal({ isOpen, onClose, onPuzzleSolved }: SymbolPuzzleModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    if (isSubmitted && isCorrect) return;
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setIsSubmitted(false);
    } else if (selectedIds.length < 4) {
      setSelectedIds((prev) => [...prev, id]);
      setIsSubmitted(false);
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleVerify = () => {
    if (selectedIds.length !== 4) return;
    setAttempts((prev) => prev + 1);
    setIsSubmitted(true);

    const matches =
      selectedIds.length === CORRECT_SEQUENCE.length &&
      selectedIds.every((id, idx) => id === CORRECT_SEQUENCE[idx]);

    if (matches) {
      setIsCorrect(true);
      const points = Math.max(50, 150 - (attempts - 1) * 25 - (showHint ? 25 : 0));
      onPuzzleSolved(points);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-primary/50 bg-card p-6 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-3xl">
              🔣
            </span>
            <div>
              <Badge
                variant="outline"
                className="border-primary/30 text-[10px] uppercase text-primary"
              >
                Area 3 • Ancient Colonnade
              </Badge>
              <h2 className="font-serif text-xl font-bold text-foreground">
                Inscribed Indus Symbol Gate
              </h2>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close puzzle">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Puzzle Intro */}
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          The stone mechanism blocking the corridor to Merchant Storage is locked by an epigraphic
          formula. Insert the 4 signs in standard Harappan order (Right-to-Left: Manger → Zebu Bull
          → Fish Sign → Bow).
        </p>

        {/* Frieze Slots */}
        <div className="mt-4 rounded-xl border border-primary/30 bg-black/60 p-4 shadow-inner">
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((slotIdx) => {
              const glyphId = selectedIds[slotIdx];
              const glyph = AVAILABLE_GLYPHS.find((g) => g.id === glyphId);

              return (
                <div
                  key={slotIdx}
                  className={cn(
                    "flex flex-col items-center justify-center h-20 sm:h-24 rounded-xl border transition-all",
                    glyph
                      ? isSubmitted
                        ? isCorrect
                          ? "border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-md shadow-emerald-900/20"
                          : "border-rose-500/80 bg-rose-950/30 text-rose-100"
                        : "border-primary/60 bg-card shadow-sm"
                      : "border-dashed border-border/60 bg-background/30 text-muted-foreground/60 font-serif text-xs",
                  )}
                >
                  {glyph ? (
                    <>
                      <span className="text-2xl sm:text-3xl">{glyph.glyph}</span>
                      <span className="mt-1 block max-w-full truncate text-[9px] font-semibold text-foreground">
                        {glyph.label}
                      </span>
                    </>
                  ) : (
                    `Slot ${slotIdx + 1}`
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Glyphs */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {AVAILABLE_GLYPHS.map((g) => {
            const isSelected = selectedIds.includes(g.id);

            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelect(g.id)}
                disabled={isSubmitted && isCorrect}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all",
                  isSelected
                    ? "border-primary bg-primary/20 ring-1 ring-primary scale-95"
                    : "border-border/60 bg-card/80 hover:border-primary/40",
                )}
              >
                <span className="text-2xl">{g.glyph}</span>
                <span className="mt-1 block max-w-full truncate text-[9px] font-semibold text-foreground/90">
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {isSubmitted && (
          <div
            className={cn(
              "mt-4 rounded-xl border p-3 text-xs leading-relaxed",
              isCorrect
                ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-100"
                : "border-rose-500/50 bg-rose-950/30 text-rose-100",
            )}
          >
            <div className="flex items-center gap-1.5 font-serif text-xs font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Mechanism Unlocked! The Stone Gate Slides Open in the World!
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-400" />
                  Incorrect Sequence (Attempt {attempts})
                </>
              )}
            </div>
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-950/30 p-2.5 text-xs text-amber-200">
            <strong>Hint:</strong> Check your Stage 1 carved tablet! Arrange: Sacred Manger → Zebu
            Bull → Fish Sign → Terminal Bow.
          </div>
        )}

        {/* Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={selectedIds.length === 0 || (isSubmitted && isCorrect)}
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHint((prev) => !prev)}
              className="text-xs text-gold"
            >
              <Lightbulb className="mr-1 h-3.5 w-3.5" />
              Hint
            </Button>
          </div>

          {!isSubmitted || !isCorrect ? (
            <Button
              size="sm"
              onClick={handleVerify}
              disabled={selectedIds.length !== 4}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Verify & Unlock Gate
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onClose}
              className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
            >
              Pass Through Gate <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
