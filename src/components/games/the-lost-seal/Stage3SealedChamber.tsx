import { useState } from "react";
import { Sparkles, ArrowRight, Eye, CheckCircle2, XCircle, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SealedChamberLocation, ArchaeologicalClue } from "./types";
import { cn } from "@/lib/utils";

interface Stage3SealedChamberProps {
  clues: ArchaeologicalClue[];
  onClueFound: (clue: ArchaeologicalClue) => void;
  onStageComplete: (scoreEarned: number) => void;
}

const CHAMBER_LOCATIONS: SealedChamberLocation[] = [
  {
    id: "storage-jars",
    name: "Shattered Grain Storage Jars",
    icon: "🏺",
    subtext: "Domestic food storehouse corner",
    description:
      "A cluster of large terracotta amphorae half-buried in floor debris. Sieve analysis reveals charred hulled barley and dried date seeds.",
    archaeologicalFinding:
      "This corner served for household subsistence storage, not valuable administrative or trade instruments.",
    isCorrectCompartment: false,
    whyWrongOrRight:
      "These vessels held staple food supplies. Luxury administrative seals were never stored inside open grain jars.",
    position: { top: "60%", left: "22%" },
  },
  {
    id: "textile-bales",
    name: "Textile Bale Imprints & Clay Bullae",
    icon: "📦",
    subtext: "Commercial export packing station",
    description:
      "Carbonized textile fibers alongside discarded clay seal tags (bullae) with reverse cloth weave impressions.",
    archaeologicalFinding:
      "A packaging workbench where goods were prepared for export to Dilmun and Mesopotamia.",
    isCorrectCompartment: false,
    whyWrongOrRight:
      "This is where packages were stamped and sealed with clay, but the master stamp seal itself was secured in a lockbox.",
    position: { top: "35%", left: "75%" },
  },
  {
    id: "wall-niche",
    name: "Zebu Bull Cult Niche",
    icon: "🐂",
    subtext: "Guild shrine & sacred lamp niche",
    description:
      "A recessed wall niche carved with stylized zebu horn iconography, containing burnt terracotta oil lamp dishes.",
    archaeologicalFinding:
      "A ritual altar honoring the patron deity of the merchant guild before embarking on maritime voyages.",
    isCorrectCompartment: false,
    whyWrongOrRight:
      "This sacred shrine held terracotta offering lamps, but no physical steatite seal artifact.",
    position: { top: "25%", left: "45%" },
  },
  {
    id: "floor-safe",
    name: "Mortared Flagstone Compartment",
    icon: "🔷",
    subtext: "Concealed sub-floor architectural cavity",
    description:
      "A tightly mortared baked-brick cavity beneath two interlocking floor flagstones, protected from moisture and collapse.",
    archaeologicalFinding:
      "A secure merchant hiding cavity lined with gypsum mortar. Inside rests a sealed steatite box holding a pristine artifact!",
    isCorrectCompartment: true,
    whyWrongOrRight:
      "Correct deduction! High-value steatite stamp seals were safeguarded in concealed subterranean floor caches beneath the master bedroom.",
    position: { top: "72%", left: "50%" },
  },
];

export function Stage3SealedChamber({
  clues,
  onClueFound,
  onStageComplete,
}: Stage3SealedChamberProps) {
  const [selectedLocation, setSelectedLocation] = useState<SealedChamberLocation | null>(null);
  const [inspectedIds, setInspectedIds] = useState<string[]>([]);
  const [confirmedRecovery, setConfirmedRecovery] = useState(false);

  const handleInspect = (loc: SealedChamberLocation) => {
    setSelectedLocation(loc);
    if (!inspectedIds.includes(loc.id)) {
      setInspectedIds((prev) => [...prev, loc.id]);
    }
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;

    if (selectedLocation.isCorrectCompartment) {
      setConfirmedRecovery(true);
      const newClue: ArchaeologicalClue = {
        id: "clue-seal-recovered",
        title: "Discovered Intact Steatite Seal",
        category: "Iconography",
        icon: "🔷",
        shortSnippet:
          "Carved square seal of white vitrified steatite featuring a majestic Zebu bull.",
        fullNote:
          "The concealed floor cavity successfully yielded the master steatite seal of the Mohenjo-daro merchant guild. Its white glazed surface and deep intaglio carving are preserved in immaculate archaeological condition.",
        discoveredInStage: 3,
      };
      onClueFound(newClue);
    }
  };

  const handleProceed = () => {
    onStageComplete(150);
  };

  return (
    <section aria-label="The Sealed Chamber" className="space-y-6">
      {/* 2.5D Chamber Environment */}
      <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-[#18110c] via-[#100b08] to-[#070504] p-6 shadow-2xl">
        {/* Layer 1: Subterranean Brick Arches & Shadow Gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black via-amber-950/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        </div>

        {/* Layer 2: Wall Columns and Masonry */}
        <div className="absolute top-6 left-12 w-28 h-64 border-r-2 border-amber-900/30 bg-black/40 pointer-events-none" />
        <div className="absolute top-6 right-12 w-28 h-64 border-l-2 border-amber-900/30 bg-black/40 pointer-events-none" />

        {/* Top HUD instruction */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full border border-primary/40 bg-black/70 px-4 py-1.5 backdrop-blur-md">
          <Search className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-foreground">
            Investigate the 4 chamber locations to deduce where the merchant concealed the seal (
            {inspectedIds.length}/4 inspected)
          </span>
        </div>

        {/* 4 Interactive Locations in 2.5D Space */}
        {CHAMBER_LOCATIONS.map((loc) => {
          const isInspected = inspectedIds.includes(loc.id);
          const isCurrent = selectedLocation?.id === loc.id;

          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleInspect(loc)}
              style={{
                top: loc.position.top,
                left: loc.position.left,
              }}
              className="group absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary z-20"
            >
              <span
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 shadow-xl",
                  isCurrent
                    ? "border-primary bg-primary/25 text-3xl ring-2 ring-primary scale-110 shadow-primary/40"
                    : isInspected
                      ? "border-amber-600/50 bg-card/90 text-3xl shadow-md"
                      : "border-border/60 bg-card/80 text-3xl group-hover:scale-105 group-hover:border-primary/60",
                )}
              >
                <span className="drop-shadow-md">{loc.icon}</span>
                {isInspected && (
                  <CheckCircle2 className="absolute -top-1.5 -right-1.5 h-4 w-4 text-emerald-400 bg-black rounded-full" />
                )}
              </span>

              <span className="mt-2 block max-w-[150px] truncate rounded-md border border-border/60 bg-black/85 px-2 py-0.5 text-center font-serif text-[11px] font-semibold text-foreground backdrop-blur-md transition-all group-hover:border-primary/70">
                {loc.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Investigation Details Inspector */}
      {selectedLocation && (
        <div
          role="dialog"
          aria-modal="true"
          className="rounded-2xl border border-primary/40 bg-card p-5 sm:p-6 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-3xl">
                {selectedLocation.icon}
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {selectedLocation.subtext}
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {selectedLocation.name}
                </h3>
              </div>
            </div>

            <Button size="sm" variant="ghost" onClick={() => setSelectedLocation(null)}>
              Close Location
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Environmental Description:
              </span>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {selectedLocation.description}
              </p>
            </div>

            <div className="rounded-xl border border-border/40 bg-background/50 p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Archaeological Finding:
              </span>
              <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                {selectedLocation.archaeologicalFinding}
              </p>
            </div>
          </div>

          {/* Excavate / Deduce Action */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-4">
            <p className="text-xs text-muted-foreground">
              Deduce whether the Steatite Seal was secured in this specific vault location.
            </p>

            {!confirmedRecovery ? (
              <Button
                onClick={handleConfirmLocation}
                size="default"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Excavate This Location
              </Button>
            ) : selectedLocation.isCorrectCompartment ? (
              <Button
                onClick={handleProceed}
                size="default"
                className="w-full sm:w-auto bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
              >
                Seal Located! Proceed to Stage 4 <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : null}
          </div>

          {/* Feedback after clicking */}
          {selectedLocation && (
            <div
              className={cn(
                "mt-4 rounded-xl border p-3.5 text-xs leading-relaxed",
                selectedLocation.isCorrectCompartment
                  ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-100"
                  : "border-amber-500/50 bg-amber-950/20 text-amber-100",
              )}
            >
              <div className="flex items-center gap-2 font-serif text-sm font-bold">
                {selectedLocation.isCorrectCompartment ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Target Cache Discovered!
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4 text-amber-400" />
                    Archaeological Assessment
                  </>
                )}
              </div>
              <p className="mt-1 opacity-90">{selectedLocation.whyWrongOrRight}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
