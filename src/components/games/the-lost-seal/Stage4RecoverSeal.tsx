import { useState } from "react";
import { Sparkles, CheckCircle2, ShieldCheck, Award, ZoomIn, Eye, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SealInspectionArea } from "./types";
import { cn } from "@/lib/utils";

interface Stage4RecoverSealProps {
  onStageComplete: (scoreEarned: number) => void;
}

const SEAL_INSPECTION_AREAS: SealInspectionArea[] = [
  {
    id: "animal-motif",
    title: "Zebu Bull (Bos Indicus) Anatomical Carving",
    focusRegion: "Central Intaglio Relief",
    observation:
      "Deeply carved profile of a humped bull showing rhythmic skin folds along the dewlap and muscular shoulder contours.",
    historicalMeaning:
      "The zebu emblem symbolized sovereign mercantile authority and prestige across Indus trade channels from Sindh to Mesopotamia.",
    verified: false,
  },
  {
    id: "script-line",
    title: "Indus Epigraphic Inscription Line",
    focusRegion: "Top Inscription Header",
    observation:
      "Five distinct pictographic signs carved with sharp micro-chisels in mirror-reverse intaglio.",
    historicalMeaning:
      "Ensured when pressed into damp clay tags, the impressions read correctly from right to left, identifying the merchant lineage.",
    verified: false,
  },
  {
    id: "reverse-boss",
    title: "Perforated Suspension Boss (Reverse)",
    focusRegion: "Back Hemispherical Lug",
    observation:
      "A central raised knob drilled horizontally with a 1.5 mm hole showing microscopic cord friction polish.",
    historicalMeaning:
      "Proves the seal was worn around the neck or wrist of a guild magistrate for constant administrative readiness.",
    verified: false,
  },
  {
    id: "alkali-glaze",
    title: "Vitrified Alkali Luster & Material Hardness",
    focusRegion: "Surface Material Chemistry",
    observation:
      "Soft steatite stone treated with an alkali slurry and fired above 1000°C, transforming it into gleaming white enstatite.",
    historicalMeaning:
      "High-temperature firing rendered the soft soapstone extremely durable, scratch-resistant, and aesthetically luminous.",
    verified: false,
  },
];

export function Stage4RecoverSeal({ onStageComplete }: Stage4RecoverSealProps) {
  const [areas, setAreas] = useState<SealInspectionArea[]>(SEAL_INSPECTION_AREAS);
  const [activeAreaId, setActiveAreaId] = useState<string>("animal-motif");
  const [isFlipped, setIsFlipped] = useState(false);

  const activeArea = areas.find((a) => a.id === activeAreaId) ?? areas[0]!;
  const verifiedCount = areas.filter((a) => a.verified).length;
  const allVerified = verifiedCount === areas.length;

  const handleVerifyCurrent = () => {
    setAreas((prev) =>
      prev.map((item) => (item.id === activeArea.id ? { ...item, verified: true } : item)),
    );
  };

  const handleComplete = () => {
    onStageComplete(200);
  };

  return (
    <section aria-label="Recover the Lost Seal" className="space-y-6">
      {/* 2.5D Seal Forensic Workbench */}
      <div className="relative min-h-[500px] w-full overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-[#1a120b] via-[#110c07] to-[#080503] p-6 shadow-2xl">
        {/* Ambient Warm Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Workbench Header */}
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-[0.2em]"
          >
            Artifact Conservation Workbench
          </Badge>
          <h2 className="mt-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Forensic Examination of the Steatite Seal
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Verify the 4 micro-archaeological hallmarks to certify authenticity before adding the
            artifact to the Virtual Museum.
          </p>
        </div>

        {/* Interactive 2.5D Seal Presentation in Spotlight */}
        <div className="relative z-10 mt-8 flex flex-col items-center justify-center">
          {/* Flip Toggle */}
          <div className="mb-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="border-primary/40 text-xs text-foreground hover:bg-primary/10"
            >
              <RotateCw className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {isFlipped ? "View Obverse (Front Relief)" : "View Reverse (Suspension Lug)"}
            </Button>
          </div>

          {/* Realistic Steatite Seal Tile Display */}
          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                "relative h-56 w-56 sm:h-64 sm:w-64 rounded-3xl border-4 transition-all duration-700 shadow-2xl flex flex-col items-center justify-between p-5 select-none",
                isFlipped
                  ? "border-amber-700/60 bg-gradient-to-br from-[#2a221b] to-[#17110c] shadow-amber-950/40"
                  : "border-primary/80 bg-gradient-to-br from-[#e8dec8] via-[#d5c7ab] to-[#b8a688] text-black shadow-primary/30",
              )}
            >
              {!isFlipped ? (
                <>
                  {/* Top Script Line on Front */}
                  <div className="w-full flex items-center justify-center gap-2 py-1 border-b border-black/20 text-xl font-bold tracking-widest opacity-85">
                    <span>🔣</span>
                    <span>🐟</span>
                    <span>🏹</span>
                    <span>🏺</span>
                  </div>

                  {/* Central Zebu Bull Relief */}
                  <div className="my-auto flex flex-col items-center justify-center">
                    <span className="text-6xl sm:text-7xl drop-shadow-lg" aria-label="Zebu Bull">
                      🐂
                    </span>
                    <span className="text-xs font-serif font-bold uppercase tracking-wider text-black/75 mt-1">
                      DK-G Master Seal
                    </span>
                  </div>

                  {/* Bottom Sacred Manger */}
                  <div className="w-full flex items-center justify-between px-2 text-lg opacity-75">
                    <span>🏺</span>
                    <span className="text-[10px] font-mono font-bold text-black/60">2600 BCE</span>
                  </div>
                </>
              ) : (
                /* Reverse with Perforated Boss */
                <div className="my-auto flex flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-500/40 bg-black/60 text-amber-300 shadow-inner">
                    <span className="text-3xl">🧵</span>
                  </div>
                  <span className="mt-3 block font-serif text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Perforated Boss Lug
                  </span>
                  <span className="mt-1 text-[10px] text-amber-300/70 max-w-[160px]">
                    1.5 mm horizontal cord drill hole with wear polish
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Inspection Feature Selectors */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl">
            {areas.map((area) => {
              const isSelected = activeAreaId === area.id;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => {
                    setActiveAreaId(area.id);
                    if (area.id === "reverse-boss") {
                      setIsFlipped(true);
                    } else {
                      setIsFlipped(false);
                    }
                  }}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/20 ring-1 ring-primary"
                      : "border-border/60 bg-card/80 hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {area.focusRegion}
                    </span>
                    {area.verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                  <h4 className="mt-1 font-serif text-xs font-bold text-foreground line-clamp-1">
                    {area.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Feature Analysis Drawer */}
        <div className="relative z-10 mt-6 mx-auto max-w-2xl rounded-xl border border-primary/30 bg-card/95 p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Region: {activeArea.focusRegion}
              </span>
              <h3 className="font-serif text-base font-bold text-foreground">{activeArea.title}</h3>
            </div>

            <Button
              size="sm"
              onClick={handleVerifyCurrent}
              disabled={activeArea.verified}
              className={cn(
                "text-xs font-semibold",
                activeArea.verified
                  ? "border border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {activeArea.verified ? "Verified ✓" : "Verify Forensic Hallmark"}
            </Button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground uppercase text-[10px]">
                Microscope Observation:
              </span>
              <p className="mt-0.5 text-foreground leading-relaxed">{activeArea.observation}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-background/50 p-2.5">
              <span className="font-semibold text-primary uppercase text-[10px]">
                Archaeological Meaning:
              </span>
              <p className="mt-0.5 text-muted-foreground leading-relaxed">
                {activeArea.historicalMeaning}
              </p>
            </div>
          </div>
        </div>

        {/* Final Recovery Action */}
        <div className="relative z-10 mt-8 text-center border-t border-border/40 pt-5">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={!allVerified}
            className="w-full sm:w-auto bg-gradient-to-r from-primary via-gold to-primary text-black font-serif font-bold tracking-wide shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-40"
          >
            <ShieldCheck className="mr-2 h-5 w-5" />
            {allVerified
              ? "Recover & Preserve Steatite Seal (+200 pts)"
              : `Verify all 4 hallmarks to recover artifact (${verifiedCount}/4)`}
          </Button>
        </div>
      </div>
    </section>
  );
}
