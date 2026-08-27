import { useState } from "react";
import { Sparkles, X, CheckCircle2, ShieldCheck, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SealInspectionArea } from "../types";
import { cn } from "@/lib/utils";

interface SealForensicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecovered: (scoreEarned: number) => void;
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

export function SealForensicModal({ isOpen, onClose, onRecovered }: SealForensicModalProps) {
  const [areas, setAreas] = useState<SealInspectionArea[]>(SEAL_INSPECTION_AREAS);
  const [activeAreaId, setActiveAreaId] = useState<string>("animal-motif");
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const activeArea = areas.find((a) => a.id === activeAreaId) ?? areas[0]!;
  const verifiedCount = areas.filter((a) => a.verified).length;
  const allVerified = verifiedCount === areas.length;

  const handleVerifyCurrent = () => {
    setAreas((prev) =>
      prev.map((item) => (item.id === activeArea.id ? { ...item, verified: true } : item)),
    );
  };

  const handleComplete = () => {
    onRecovered(200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-3xl border border-primary/50 bg-card p-6 sm:p-8 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-3xl">
              🔷
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/15 text-[10px] uppercase text-primary"
                >
                  Area 5 • Inner Sanctum Altar
                </Badge>
                <span className="text-xs text-muted-foreground">Mohenjo-daro Masterpiece</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                Forensic Examination: The Steatite Seal
              </h2>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close forensic modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 360 Artifact Display */}
        <div className="mt-6 flex flex-col items-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFlipped((prev) => !prev)}
            className="mb-4 text-xs text-foreground hover:bg-primary/10"
          >
            <RotateCw className="mr-1.5 h-3.5 w-3.5 text-primary" />
            {isFlipped ? "View Obverse (Front Relief)" : "View Reverse (Suspension Lug)"}
          </Button>

          {/* Steatite Seal Rendering Box */}
          <div
            className={cn(
              "h-52 w-52 sm:h-60 sm:w-60 rounded-3xl border-4 transition-all duration-700 shadow-2xl flex flex-col items-center justify-between p-4 select-none",
              isFlipped
                ? "border-amber-700/60 bg-gradient-to-br from-[#2a221b] to-[#17110c] shadow-amber-950/40 text-amber-200"
                : "border-primary/80 bg-gradient-to-br from-[#e8dec8] via-[#d5c7ab] to-[#b8a688] text-black shadow-primary/30",
            )}
          >
            {!isFlipped ? (
              <>
                <div className="w-full flex items-center justify-center gap-2 py-1 border-b border-black/20 text-lg font-bold tracking-widest opacity-85">
                  <span>🔣</span>
                  <span>🐟</span>
                  <span>🏹</span>
                  <span>🏺</span>
                </div>
                <div className="my-auto flex flex-col items-center">
                  <span className="text-5xl sm:text-6xl drop-shadow-md">🐂</span>
                  <span className="text-[10px] font-serif font-bold uppercase tracking-wider text-black/75 mt-1">
                    DK-G Master Seal
                  </span>
                </div>
                <div className="w-full flex items-center justify-between px-1 text-sm opacity-75">
                  <span>🏺</span>
                  <span className="text-[9px] font-mono font-bold text-black/60">2600 BCE</span>
                </div>
              </>
            ) : (
              <div className="my-auto flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-500/40 bg-black/60 text-2xl text-amber-300">
                  🧵
                </div>
                <span className="mt-2 block font-serif text-xs font-bold uppercase tracking-wider">
                  Perforated Boss Lug
                </span>
                <span className="mt-0.5 text-[9px] text-amber-300/80 max-w-[140px]">
                  1.5 mm cord drill hole
                </span>
              </div>
            )}
          </div>

          {/* 4 Feature Selectors */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {areas.map((area) => {
              const isSelected = activeAreaId === area.id;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => {
                    setActiveAreaId(area.id);
                    setIsFlipped(area.id === "reverse-boss");
                  }}
                  className={cn(
                    "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/20 ring-1 ring-primary"
                      : "border-border/60 bg-card hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-primary">
                      {area.focusRegion}
                    </span>
                    {area.verified && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  </div>
                  <h4 className="mt-0.5 font-serif text-[11px] font-bold text-foreground line-clamp-1">
                    {area.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Feature Analysis */}
        <div className="mt-4 rounded-xl border border-primary/30 bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2.5">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-primary">
                Region: {activeArea.focusRegion}
              </span>
              <h3 className="font-serif text-sm font-bold text-foreground">{activeArea.title}</h3>
            </div>

            <Button
              size="sm"
              onClick={handleVerifyCurrent}
              disabled={activeArea.verified}
              className={cn(
                "text-xs",
                activeArea.verified
                  ? "border border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {activeArea.verified ? "Verified ✓" : "Verify Forensic Hallmark"}
            </Button>
          </div>

          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 text-[11px]">
            <div>
              <span className="font-semibold text-muted-foreground uppercase text-[9px]">
                Observation:
              </span>
              <p className="mt-0.5 text-foreground leading-relaxed">{activeArea.observation}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-background/50 p-2">
              <span className="font-semibold text-primary uppercase text-[9px]">
                Historical Significance:
              </span>
              <p className="mt-0.5 text-muted-foreground leading-relaxed">
                {activeArea.historicalMeaning}
              </p>
            </div>
          </div>
        </div>

        {/* Final Recovery Action */}
        <div className="mt-6 text-center border-t border-border/40 pt-4">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={!allVerified}
            className="w-full sm:w-auto bg-gradient-to-r from-primary via-gold to-primary text-black font-serif font-bold tracking-wide shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-40"
          >
            <ShieldCheck className="mr-2 h-5 w-5" />
            {allVerified
              ? "Recover & Preserve Steatite Seal (+200 pts)"
              : `Verify all 4 hallmarks to authenticate artifact (${verifiedCount}/4)`}
          </Button>
        </div>
      </div>
    </div>
  );
}
