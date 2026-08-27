import { useState } from "react";
import { Sparkles, ArrowRight, Eye, CheckCircle2, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExcavationObject, ArchaeologicalClue } from "./types";
import { cn } from "@/lib/utils";

interface Stage1ExcavationProps {
  onClueFound: (clue: ArchaeologicalClue) => void;
  onStageComplete: () => void;
}

const INITIAL_EXCAVATION_OBJECTS: ExcavationObject[] = [
  {
    id: "mound",
    name: "Stratified Excavation Mound",
    category: "Stratigraphy",
    icon: "🏔️",
    position: { top: "30%", left: "18%", zIndex: 10, depthScale: 0.9 },
    visualHint: "Dense silt stratum showing collapsed brick pavers.",
    description: "A cross-section mound of Trench DK-G exposing Mature Harappan brick collapse.",
    archaeologicalAnalysis:
      "Beneath the upper silt stratum lies a layer of burnt timber and compacted mud mortar, indicating the sudden abandonment of this merchant dwelling around 1900 BCE.",
    clue: {
      id: "clue-strata",
      title: "Stratigraphic Context: DK-G Sector",
      category: "Stratigraphy",
      icon: "🏔️",
      shortSnippet: "Artifacts lie in the undisturbed Mature Harappan silt layer.",
      fullNote:
        "Trench DK-G stratigraphy confirms undisturbed Mature Harappan habitation layers (2600–1900 BCE), showing the artifact was stored safely beneath floor flagstones before the building collapsed.",
      discoveredInStage: 1,
    },
    isInspected: false,
  },
  {
    id: "pottery",
    name: "Red Ware Pottery Sherd",
    category: "Ceramics",
    icon: "🏺",
    position: { top: "62%", left: "32%", zIndex: 20, depthScale: 1.05 },
    visualHint: "Wheel-thrown terracotta sherd with black intersecting circle motif.",
    description: "A well-fired terracotta fragment from a large Harappan storage vessel.",
    archaeologicalAnalysis:
      "The slip is rich red ferric oxide painted with manganese black pigment. Intersecting circle designs were a signature decorative hallmark of Indus ceramic guilds.",
    clue: {
      id: "clue-pottery",
      title: "Ceramic Seal Impressions",
      category: "Trade",
      icon: "🏺",
      shortSnippet: "Pottery storage jars were sealed with stamped wet clay tags.",
      fullNote:
        "Storage jars at Mohenjo-daro were plugged with clay and stamped with square seals to certify the volume and ownership of grain and luxury oils.",
      discoveredInStage: 1,
    },
    isInspected: false,
  },
  {
    id: "tablet",
    name: "Carved Steatite Tablet Fragment",
    category: "Epigraphy",
    icon: "📜",
    position: { top: "45%", left: "68%", zIndex: 15, depthScale: 0.95 },
    visualHint: "White-glazed soapstone fragment bearing faint pictographic glyphs.",
    description: "A preliminary testing slab used by Harappan seal carvers.",
    archaeologicalAnalysis:
      "Microscopic analysis reveals right-to-left stroke sequences. The carver practiced the sacred 'Fish' (Mīn) sign and an inverted sacred manger motif before carving the master seal.",
    clue: {
      id: "clue-script",
      title: "Script Directionality & Sacred Signs",
      category: "Epigraphy",
      icon: "📜",
      shortSnippet:
        "Indus inscriptions follow a Right-to-Left sequence starting with sacred motifs.",
      fullNote:
        "Sign cramming on the left edge confirms Indus scribes carved stamp seals in mirror-reverse so impressions read clearly from right to left, beginning with animal totems and ending with terminal jar signs.",
      discoveredInStage: 1,
    },
    isInspected: false,
  },
  {
    id: "crate",
    name: "Archaeological Tool Crate",
    category: "Equipment",
    icon: "📦",
    position: { top: "72%", left: "80%", zIndex: 25, depthScale: 1.1 },
    visualHint:
      "Field equipment box containing micro-trowels, camel-hair brushes, and caliper gauges.",
    description: "Standard field tools used for delicate stratigraphic excavation.",
    archaeologicalAnalysis:
      "Micro-excavation tools ensure brittle steatite and delicate clay bullae are freed from surrounding saline soil without scratching their polished surfaces.",
    isInspected: false,
  },
  {
    id: "marker",
    name: "Sector Grid Marker (DK-G/4)",
    category: "Survey",
    icon: "📍",
    position: { top: "25%", left: "50%", zIndex: 12, depthScale: 0.85 },
    visualHint: "Survey stake marking the lower-town merchant guild sector.",
    description: "An archaeological grid marker establishing 5x5 meter excavation quadrants.",
    archaeologicalAnalysis:
      "Quadrant DK-G/4 aligns directly with the grand street of Mohenjo-daro leading toward the Great Bath and the civic granary citadel.",
    isInspected: false,
  },
];

export function Stage1Excavation({ onClueFound, onStageComplete }: Stage1ExcavationProps) {
  const [objects, setObjects] = useState<ExcavationObject[]>(INITIAL_EXCAVATION_OBJECTS);
  const [activeObject, setActiveObject] = useState<ExcavationObject | null>(null);
  const [justFoundClue, setJustFoundClue] = useState<ArchaeologicalClue | null>(null);

  const inspectedCount = objects.filter((o) => o.isInspected).length;
  const cluesFoundFromStage = objects.filter((o) => o.isInspected && o.clue).length;
  const totalCluesInStage = objects.filter((o) => o.clue).length;
  const canProceed = cluesFoundFromStage >= totalCluesInStage;

  const handleInspect = (obj: ExcavationObject) => {
    setActiveObject(obj);

    if (!obj.isInspected) {
      setObjects((prev) =>
        prev.map((item) => (item.id === obj.id ? { ...item, isInspected: true } : item)),
      );

      if (obj.clue) {
        onClueFound(obj.clue);
        setJustFoundClue(obj.clue);
      }
    }
  };

  return (
    <section aria-label="Archaeological Excavation Site" className="space-y-6">
      {/* 2.5D Excavation Viewport */}
      <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-[#1a1410] via-[#120e0b] to-[#0a0807] shadow-2xl">
        {/* Layer 1: Background Silhouette (Citadel ruins & sky) */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-amber-950/20 via-amber-900/10 to-transparent" />
          <svg
            className="absolute bottom-28 w-full h-40 opacity-30 text-amber-800/40"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,250 L100,230 L150,180 L220,180 L260,240 L350,220 L400,160 L480,160 L520,230 L650,210 L700,170 L780,170 L820,240 L900,220 L1000,250 L1000,300 L0,300 Z" />
          </svg>
        </div>

        {/* Layer 2: Midground Brick Wall Ruins & Support Timbers */}
        <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(#b87333_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          <div className="absolute top-8 left-10 w-48 h-32 rounded-lg border-2 border-amber-800/30 bg-amber-950/30 rotate-[-4deg] [clip-path:polygon(0_15%,100%_0%,95%_100%,5%_90%)]" />
          <div className="absolute top-12 right-12 w-64 h-36 rounded-lg border-2 border-amber-800/30 bg-amber-950/30 rotate-[3deg] [clip-path:polygon(5%_0%,100%_15%,90%_95%,0%_100%)]" />
        </div>

        {/* Layer 3: Foreground Trench Ground Texture & Ambient Dust Particles */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-[#18110a] to-transparent pointer-events-none" />

        {/* Top HUD prompt badge on viewport */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full border border-primary/40 bg-black/70 px-4 py-1.5 backdrop-blur-md">
          <Search className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-foreground">
            Click on highlighted archaeological finds to examine stratigraphy & gather clues (
            {cluesFoundFromStage}/{totalCluesInStage})
          </span>
        </div>

        {/* Interactive Excavation Objects in 2.5D Space */}
        {objects.map((obj) => {
          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => handleInspect(obj)}
              style={{
                top: obj.position.top,
                left: obj.position.left,
                zIndex: obj.position.zIndex,
                transform: `scale(${obj.position.depthScale})`,
              }}
              className={cn(
                "group absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              )}
            >
              {/* Pulsing selection aura */}
              <span
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 shadow-xl",
                  obj.isInspected
                    ? "border-emerald-500/60 bg-emerald-950/40 text-3xl shadow-emerald-900/20"
                    : "border-primary/60 bg-card/90 text-3xl shadow-primary/30 group-hover:scale-110 group-hover:border-primary group-hover:shadow-primary/60 group-hover:-translate-y-1",
                )}
              >
                <span className="drop-shadow-md">{obj.icon}</span>
                {obj.isInspected ? (
                  <CheckCircle2 className="absolute -top-1.5 -right-1.5 h-5 w-5 text-emerald-400 bg-black rounded-full" />
                ) : (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                  </span>
                )}
              </span>

              {/* Object label tooltip on hover */}
              <span className="mt-2 block max-w-[140px] truncate rounded-md border border-border/60 bg-black/85 px-2.5 py-1 text-center font-serif text-[11px] font-semibold text-foreground backdrop-blur-md shadow-md transition-all group-hover:border-primary/70">
                {obj.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inspection Modal / Detail Drawer */}
      {activeObject && (
        <div
          role="dialog"
          aria-modal="true"
          className="rounded-2xl border border-primary/40 bg-card p-5 sm:p-6 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-3xl">
                {activeObject.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 text-[10px] text-primary">
                    {activeObject.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">DK-G Trench Finding</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {activeObject.name}
                </h3>
              </div>
            </div>

            <Button size="sm" variant="ghost" onClick={() => setActiveObject(null)}>
              Close Inspection
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Physical Observation:
              </span>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {activeObject.description}
              </p>
              <p className="mt-2 text-xs italic text-muted-foreground/80">
                {activeObject.visualHint}
              </p>
            </div>

            <div className="rounded-xl border border-border/40 bg-background/50 p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Archaeological Analysis:
              </span>
              <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                {activeObject.archaeologicalAnalysis}
              </p>
            </div>
          </div>

          {/* Clue Reward Notification */}
          {activeObject.clue && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 text-emerald-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-serif text-xs font-bold">
                    Archaeological Clue Unlocked: {activeObject.clue.title}
                  </span>
                  <p className="text-[11px] text-emerald-300/80">
                    {activeObject.clue.shortSnippet}
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-500 text-black text-[10px] font-bold">+100 pts</Badge>
            </div>
          )}
        </div>
      )}

      {/* Progression Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/60 p-4">
        <div>
          <span className="text-xs text-muted-foreground">
            Objects Inspected:{" "}
            <strong className="text-foreground">
              {inspectedCount} / {objects.length}
            </strong>{" "}
            • Clues Gathered:{" "}
            <strong className="text-primary">
              {cluesFoundFromStage} / {totalCluesInStage}
            </strong>
          </span>
          <p className="text-xs text-muted-foreground/80">
            {canProceed
              ? "All critical stratigraphic clues have been deciphered. You may now proceed into the subterranean symbol chamber."
              : "Keep investigating the trench objects to uncover all necessary clues."}
          </p>
        </div>

        <Button
          onClick={onStageComplete}
          disabled={!canProceed}
          size="lg"
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          Descend to Stage 2: Symbol Chamber
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
