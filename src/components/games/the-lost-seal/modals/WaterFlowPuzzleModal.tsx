import { useState } from "react";
import { Sparkles, X, CheckCircle2, Waves, Droplets, RotateCcw, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WaterFlowPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPuzzleSolved: (scoreEarned: number) => void;
}

interface SluiceGate {
  id: string;
  name: string;
  stepName: string;
  role: string;
  icon: string;
  flowRate: string;
}

const SLUICE_GATES: SluiceGate[] = [
  {
    id: "filter",
    name: "Sediment Silt Filter",
    stepName: "Step 1: Desilting Chamber",
    role: "Filters heavy Indus alluvial silt before entering the brick conduit.",
    icon: "🧱",
    flowRate: "Pre-filtration",
  },
  {
    id: "inlet",
    name: "Main Aqueduct Sluice",
    stepName: "Step 2: Intake Valve",
    role: "Feeds fresh clarified water into the ceremonial stepwell basin.",
    icon: "🌊",
    flowRate: "Primary Inflow",
  },
  {
    id: "drain",
    name: "Corbelled Drain Gate",
    stepName: "Step 3: Sub-Floor Siphon",
    role: "Corbelled gypsum-mortared conduit draining excess water into city channels.",
    icon: "🔄",
    flowRate: "Regulated Outflow",
  },
];

const CORRECT_SEQUENCE = ["filter", "inlet", "drain"];

export function WaterFlowPuzzleModal({
  isOpen,
  onClose,
  onPuzzleSolved,
}: WaterFlowPuzzleModalProps) {
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleToggleGate = (gateId: string) => {
    if (isSuccess) return;
    if (selectedSequence.includes(gateId)) {
      setSelectedSequence((prev) => prev.filter((id) => id !== gateId));
      setIsSubmitted(false);
    } else if (selectedSequence.length < 3) {
      setSelectedSequence((prev) => [...prev, gateId]);
      setIsSubmitted(false);
    }
  };

  const handleReset = () => {
    setSelectedSequence([]);
    setIsSubmitted(false);
    setIsSuccess(false);
  };

  const handleEngageHydraulics = () => {
    if (selectedSequence.length !== 3) return;
    setAttempts((prev) => prev + 1);
    setIsSubmitted(true);

    const matches =
      selectedSequence.length === CORRECT_SEQUENCE.length &&
      selectedSequence.every((id, idx) => id === CORRECT_SEQUENCE[idx]);

    if (matches) {
      setIsSuccess(true);
      const score = Math.max(50, 150 - attempts * 25);
      onPuzzleSolved(score);
    } else {
      setIsSuccess(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-primary/50 bg-card p-6 sm:p-8 shadow-2xl shadow-black overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-3xl shadow-inner">
              <Waves className="h-6 w-6 text-primary" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/15 text-[10px] uppercase font-bold text-primary"
                >
                  Great Bath Hydraulic Sluice System
                </Badge>
                <span className="text-xs text-muted-foreground font-serif">
                  Harappan Civil Engineering
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                Ceremonial Water Flow Control
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
            <span>Hydraulic Inscription Clue:</span>
          </div>
          <p className="text-muted-foreground">
            "Before ceremonial purification, the master mason must first <strong className="text-foreground">filter river silt</strong>, then <strong className="text-foreground">open the aqueduct intake</strong>, and finally <strong className="text-foreground">regulate the sub-floor drain</strong> to reveal the submerged votive compartment."
          </p>
        </div>

        {/* Sluice Gate Selectors */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
            <span>Select Sluice Operating Sequence (1 ➔ 2 ➔ 3):</span>
            <span className="text-primary font-mono font-bold">
              {selectedSequence.length}/3 Engaged
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SLUICE_GATES.map((gate) => {
              const orderIndex = selectedSequence.indexOf(gate.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={gate.id}
                  type="button"
                  onClick={() => handleToggleGate(gate.id)}
                  className={cn(
                    "flex flex-col justify-between p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                    isSelected
                      ? "border-primary bg-primary/15 shadow-[0_0_16px_rgba(0,220,220,0.25)]"
                      : "border-border/60 bg-background/60 hover:border-primary/40 hover:bg-background",
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-black font-black text-xs shadow-md">
                      {orderIndex + 1}
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-2xl">{gate.icon}</span>
                    <h3 className="font-serif text-sm font-bold text-foreground">
                      {gate.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {gate.role}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/30 text-[10px] uppercase tracking-wider font-mono text-primary font-semibold">
                    {gate.flowRate}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Display */}
        {isSubmitted && (
          <div
            className={cn(
              "mt-4 rounded-2xl border p-3.5 text-xs transition-all",
              isSuccess
                ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-200"
                : "border-rose-500/50 bg-rose-950/20 text-rose-200",
            )}
          >
            {isSuccess ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Hydraulic Channels Aligned! Water Level Sinks.</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  The ancient gypsum conduits engage smoothly. In the receding water, a submerged <strong className="text-white">Carved Steatite Key Fragment</strong> has been revealed in the Great Bath reservoir floor!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-rose-300">
                  <Droplets className="h-4 w-4 text-rose-400" />
                  <span>Water Silt Siphon Blocked — Turbulent Flow</span>
                </div>
                <p className="text-[11px] text-rose-100/90">
                  The conduits failed to pressurize. Review the archaeological clue and engage the desilting filter before the main inlet.
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
            disabled={selectedSequence.length === 0 || isSuccess}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset Valves
          </Button>

          {!isSuccess ? (
            <Button
              size="sm"
              onClick={handleEngageHydraulics}
              disabled={selectedSequence.length !== 3}
              className="bg-primary text-black font-bold hover:bg-primary/90 disabled:opacity-40"
            >
              Engage Sluice Valves <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onClose}
              className="bg-emerald-500 text-black font-bold hover:bg-emerald-400"
            >
              Recover Key Fragment <Sparkles className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
