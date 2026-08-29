import { useState } from "react";
import { Sparkles, X, CheckCircle2, Scale, BookOpen, RotateCcw, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MerchantAccountingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPuzzleSolved: (scoreEarned: number) => void;
}

export function MerchantAccountingModal({
  isOpen,
  onClose,
  onPuzzleSolved,
}: MerchantAccountingModalProps) {
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [selectedCargo, setSelectedCargo] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedSealMark, setSelectedSealMark] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedHouse(null);
    setSelectedCargo(null);
    setSelectedWeight(null);
    setSelectedSealMark(null);
    setIsSubmitted(false);
    setIsSuccess(false);
  };

  const handleVerifyLedger = () => {
    if (!selectedHouse || !selectedCargo || !selectedWeight || !selectedSealMark) return;
    setAttempts((prev) => prev + 1);
    setIsSubmitted(true);

    // Correct solution based on discovered clues: House 7, Lapis & Copper, 16-Unit Chert, Zebu Bull
    const isCorrect =
      selectedHouse === "house-7" &&
      selectedCargo === "lapis-copper" &&
      selectedWeight === "weight-16" &&
      selectedSealMark === "seal-zebu";

    if (isCorrect) {
      setIsSuccess(true);
      const score = Math.max(50, 150 - attempts * 25);
      onPuzzleSolved(score);
    } else {
      setIsSuccess(false);
    }
  };

  const allSelected = selectedHouse && selectedCargo && selectedWeight && selectedSealMark;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative max-h-[90vh] overflow-y-auto w-full max-w-3xl rounded-3xl border border-primary/50 bg-card p-6 sm:p-8 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-3xl shadow-inner">
              <Scale className="h-6 w-6 text-primary" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/15 text-[10px] uppercase font-bold text-primary"
                >
                  Scribe Station Ledger Decryption
                </Badge>
                <span className="text-xs text-muted-foreground font-serif">
                  Indus Metrology & Guild Records
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                Merchant House Accounting Synthesis
              </h2>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Narrative Context */}
        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-3.5 text-xs leading-relaxed text-foreground/90 space-y-1">
          <div className="flex items-center gap-1.5 font-serif font-bold text-primary text-xs">
            <Info className="h-4 w-4" />
            <span>Field Dossier Synthesis:</span>
          </div>
          <p className="text-muted-foreground">
            Connect the discovered epigraphic tally marks, cargo bullae, and binary chert ratios to identify which merchant guild requisitioned the sovereign Steatite Stamp Seal before the citadel was evacuated.
          </p>
        </div>

        {/* 4 Multi-Choice Matrices */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Merchant House */}
          <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-3.5">
            <span className="text-xs font-serif font-bold text-foreground">
              1. Designated Merchant Guild:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "house-3", label: "House 3 (Grain Guild)", desc: "Wheat & Barley" },
                { id: "house-7", label: "House 7 (High Magistrate)", desc: "Precious Metals & Gems" },
                { id: "house-12", label: "House 12 (Maritime)", desc: "Shell & Carnelian" },
                { id: "house-18", label: "House 18 (Textiles)", desc: "Dyed Cotton Bales" },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setSelectedHouse(h.id);
                    setIsSubmitted(false);
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    selectedHouse === h.id
                      ? "border-primary bg-primary/15 font-bold text-foreground shadow-sm"
                      : "border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <div className="font-semibold text-[11px]">{h.label}</div>
                  <div className="text-[10px] text-muted-foreground">{h.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Trade Cargo */}
          <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-3.5">
            <span className="text-xs font-serif font-bold text-foreground">
              2. Secured High-Value Cargo:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "grain-jars", label: "Barley & Sesame Oil", desc: "Domestic Rations" },
                { id: "lapis-copper", label: "Lapis Lazuli & Copper", desc: "Guild Royal Tribute" },
                { id: "terracotta", label: "Painted Ceramics", desc: "Standard Red Ware" },
                { id: "timber", label: "Teak & Cedar Planks", desc: "Shipbuilding Cargo" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCargo(c.id);
                    setIsSubmitted(false);
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    selectedCargo === c.id
                      ? "border-primary bg-primary/15 font-bold text-foreground shadow-sm"
                      : "border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <div className="font-semibold text-[11px]">{c.label}</div>
                  <div className="text-[10px] text-muted-foreground">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Standard Chert Weight Ratio */}
          <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-3.5">
            <span className="text-xs font-serif font-bold text-foreground">
              3. Standard Binary Chert Unit:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "weight-1", label: "1-Unit Micro Cube", desc: "0.87 grams (Gold Dust)" },
                { id: "weight-4", label: "4-Unit Standard", desc: "3.48 grams (Silver Wire)" },
                { id: "weight-16", label: "16-Unit Guild Standard", desc: "13.92 grams (Magistrate Tax)" },
                { id: "weight-64", label: "64-Unit Heavy Cube", desc: "55.68 grams (Grain Bulk)" },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setSelectedWeight(w.id);
                    setIsSubmitted(false);
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    selectedWeight === w.id
                      ? "border-primary bg-primary/15 font-bold text-foreground shadow-sm"
                      : "border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <div className="font-semibold text-[11px]">{w.label}</div>
                  <div className="text-[10px] text-muted-foreground">{w.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Bulla Authority Mark */}
          <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-3.5">
            <span className="text-xs font-serif font-bold text-foreground">
              4. Authorizing Seal Impression:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "seal-zebu", label: "Zebu Bull Sovereign", desc: "Grand Magistrate Authority" },
                { id: "seal-unicorn", label: "Unicorn Standard", desc: "General Merchant Tag" },
                { id: "seal-elephant", label: "Elephant Motif", desc: "Eastern Overland Trade" },
                { id: "seal-tiger", label: "Tiger & Tree Niche", desc: "Forest Outpost Guild" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSealMark(s.id);
                    setIsSubmitted(false);
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    selectedSealMark === s.id
                      ? "border-primary bg-primary/15 font-bold text-foreground shadow-sm"
                      : "border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <div className="font-semibold text-[11px]">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Display */}
        {isSubmitted && (
          <div
            className={cn(
              "mt-5 rounded-2xl border p-4 text-xs transition-all",
              isSuccess
                ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-200"
                : "border-rose-500/50 bg-rose-950/20 text-rose-200",
            )}
          >
            {isSuccess ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Guild Record Decrypted! Merchant House 7 Identified.</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  The ledger confirms that the sovereign Steatite Stamp Seal was used by <strong className="text-white">Merchant House 7</strong> to seal royal lapis tributes. The records indicate the seal was moved through the North Gate directly into Warehouse 7 before being concealed!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-rose-300">
                  <BookOpen className="h-4 w-4 text-rose-400" />
                  <span>Ledger Inconsistencies Detected</span>
                </div>
                <p className="text-[11px] text-rose-100/90">
                  The cargo weights and seal authorization do not correlate. Review the chert balance weights and testing slab clues in the excavation trench.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!allSelected || isSuccess}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset Selection
          </Button>

          {!isSuccess ? (
            <Button
              size="sm"
              onClick={handleVerifyLedger}
              disabled={!allSelected}
              className="bg-primary text-black font-bold hover:bg-primary/90 disabled:opacity-40"
            >
              Verify Guild Ledger <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onClose}
              className="bg-emerald-500 text-black font-bold hover:bg-emerald-400"
            >
              Record in Field Dossier <Sparkles className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
