import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SymbolPuzzleTile, ArchaeologicalClue } from "./types";
import { cn } from "@/lib/utils";

interface Stage2SymbolChamberProps {
  clues: ArchaeologicalClue[];
  onClueFound: (clue: ArchaeologicalClue) => void;
  onStageComplete: (scoreEarned: number) => void;
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

// Target 4-glyph sequence: Manger -> Zebu Bull -> Fish -> Bow
const CORRECT_SEQUENCE = ["g-manger", "g-bull", "g-fish", "g-bow"];

export function Stage2SymbolChamber({
  clues,
  onClueFound,
  onStageComplete,
}: Stage2SymbolChamberProps) {
  const [selectedGlyphIds, setSelectedGlyphIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSelectGlyph = (id: string) => {
    if (isSubmitted && isCorrect) return;
    if (selectedGlyphIds.includes(id)) {
      setSelectedGlyphIds((prev) => prev.filter((item) => item !== id));
      setIsSubmitted(false);
    } else if (selectedGlyphIds.length < 4) {
      setSelectedGlyphIds((prev) => [...prev, id]);
      setIsSubmitted(false);
    }
  };

  const handleReset = () => {
    setSelectedGlyphIds([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleVerify = () => {
    if (selectedGlyphIds.length !== 4) return;
    setAttempts((prev) => prev + 1);
    setIsSubmitted(true);

    const matches =
      selectedGlyphIds.length === CORRECT_SEQUENCE.length &&
      selectedGlyphIds.every((id, idx) => id === CORRECT_SEQUENCE[idx]);

    if (matches) {
      setIsCorrect(true);
      const newClue: ArchaeologicalClue = {
        id: "clue-chamber-lock",
        title: "Deciphered Seal Composition Formula",
        category: "Epigraphy",
        icon: "🔣",
        shortSnippet:
          "Standard Harappan seals arrange: Manger -> Animal Totem -> Primary Glyph -> Terminal Sign.",
        fullNote:
          "Solving the carved symbol frieze reveals the standard Indus seal formula: ritual offering stand, zebu bull crest, primary fish ideogram, and terminal bow sign. This exact formula unlocks the hidden compartment in the lower vault.",
        discoveredInStage: 2,
      };
      onClueFound(newClue);
    } else {
      setIsCorrect(false);
    }
  };

  const handleProceed = () => {
    const points = Math.max(50, 150 - (attempts - 1) * 25 - (showHint ? 25 : 0));
    onStageComplete(points);
  };

  return (
    <section aria-label="The Symbol Chamber" className="space-y-6">
      {/* 2.5D Atmospheric Chamber Wall */}
      <div className="relative min-h-[440px] w-full overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-[#1c130d] via-[#120d09] to-[#0a0705] p-6 shadow-2xl">
        {/* Ambient torch glow lighting & relief carved texture */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

        {/* Header inside chamber */}
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-[0.2em]"
          >
            Subterranean Inscription Frieze
          </Badge>
          <h2 className="mt-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">
            The Carved Symbol Chamber
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Reconstruct the 4-sign Indus administrative formula across the carved frieze based on
            the stratigraphy clues you collected.
          </p>
        </div>

        {/* Selected Sequence Assembly Tray (The Frieze) */}
        <div className="relative z-10 mt-6 mx-auto max-w-xl rounded-2xl border border-primary/40 bg-black/60 p-4 sm:p-5 backdrop-blur-md shadow-inner">
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
            <span className="font-semibold uppercase tracking-wider text-primary">
              Carved Frieze Slots ({selectedGlyphIds.length}/4)
            </span>
            <span className="text-[11px] italic text-muted-foreground/80">
              Arranged Right-to-Left Syntax
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-4">
            {[0, 1, 2, 3].map((slotIndex) => {
              const glyphId = selectedGlyphIds[slotIndex];
              const glyph = AVAILABLE_GLYPHS.find((g) => g.id === glyphId);

              return (
                <div
                  key={slotIndex}
                  className={cn(
                    "flex flex-col items-center justify-center h-24 sm:h-28 rounded-xl border transition-all",
                    glyph
                      ? isSubmitted
                        ? isCorrect
                          ? "border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-lg shadow-emerald-900/30"
                          : "border-rose-500/80 bg-rose-950/30 text-rose-100"
                        : "border-primary/60 bg-card shadow-md"
                      : "border-dashed border-border/60 bg-background/30 text-muted-foreground",
                  )}
                >
                  {glyph ? (
                    <>
                      <span className="text-3xl sm:text-4xl drop-shadow-md">{glyph.glyph}</span>
                      <span className="mt-1 block max-w-full truncate text-[10px] font-semibold text-foreground">
                        {glyph.label}
                      </span>
                    </>
                  ) : (
                    <span className="font-serif text-xs text-muted-foreground/60">
                      Slot {slotIndex + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Glyphs Pool */}
        <div className="relative z-10 mt-6 mx-auto max-w-2xl">
          <span className="block text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-primary pb-3">
            Select glyphs to insert into the ancient stone frieze:
          </span>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {AVAILABLE_GLYPHS.map((tile) => {
              const isSelected = selectedGlyphIds.includes(tile.id);

              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleSelectGlyph(tile.id)}
                  disabled={isSubmitted && isCorrect}
                  className={cn(
                    "group flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 hover:-translate-y-0.5",
                    isSelected
                      ? "border-primary bg-primary/20 ring-1 ring-primary shadow-lg shadow-primary/20 scale-95"
                      : "border-border/60 bg-card/80 hover:border-primary/50 hover:bg-card",
                  )}
                >
                  <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110">
                    {tile.glyph}
                  </span>
                  <span className="mt-1 block max-w-full truncate text-[10px] font-semibold text-foreground/90">
                    {tile.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Hint */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={selectedGlyphIds.length === 0 || (isSubmitted && isCorrect)}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset Frieze
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowHint((prev) => !prev)}
            className="text-gold hover:text-gold/90"
          >
            <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
            {showHint ? "Hide Hint" : "Epigrapher's Clue Hint (-25 pts)"}
          </Button>

          {!isSubmitted || !isCorrect ? (
            <Button
              size="sm"
              onClick={handleVerify}
              disabled={selectedGlyphIds.length !== 4}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Verify Symbol Sequence
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleProceed}
              className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
            >
              Sequence Unlocked • Enter Sealed Chamber
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="relative z-10 mt-4 mx-auto max-w-xl rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 text-left">
            <strong>Archaeological Hint:</strong> Check your Stage 1 tablet clue! Indus seals begin
            with the sacred feeding stand, followed by the zebu animal totem, the primary celestial
            fish sign, and the terminal bow sign.
          </div>
        )}

        {/* Feedback Message */}
        {isSubmitted && (
          <div
            className={cn(
              "relative z-10 mt-4 mx-auto max-w-xl rounded-xl border p-4 text-xs leading-relaxed text-left transition-all",
              isCorrect
                ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-100"
                : "border-rose-500/50 bg-rose-950/30 text-rose-100",
            )}
          >
            <div className="flex items-center gap-2 font-serif text-sm font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Formula Verified (+150 pts)
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-400" />
                  Incorrect Sequence (Attempt {attempts})
                </>
              )}
            </div>
            <p className="mt-1.5 opacity-90">
              {isCorrect
                ? "The mechanical lock clicks open! The sandstone slab slides aside, revealing the sealed vault of the merchant warehouse."
                : "The symbols do not match the standard Harappan administrative syntax. Review the feeding stand and animal totem positions and try again."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
