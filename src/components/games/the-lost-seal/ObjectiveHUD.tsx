import { useState } from "react";
import {
  Compass,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Unlock,
  Scroll,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExpeditionObjective } from "./types";
import type { LevelId, StoryActId } from "./three/types";
import { cn } from "@/lib/utils";

interface ObjectiveHUDProps {
  currentLevelId: LevelId;
  currentActId: StoryActId;
  objectives: ExpeditionObjective[];
  currentDirective: string;
  onOpenClues?: () => void;
  className?: string;
}

interface LevelObjectiveConfig {
  levelNumber: number;
  levelTitle: string;
  zoneSubtitle: string;
  doorUnlockCondition: string;
  objectiveIds: string[];
}

const LEVEL_CONFIGS: Record<LevelId, LevelObjectiveConfig> = {
  "level-1-lost-city": {
    levelNumber: 1,
    levelTitle: "THE LOST CITY",
    zoneSubtitle: "Excavation Trench DK-G & Citadel",
    doorUnlockCondition: "Inspect Magistrate Bulla Tag to authorize North Gate clearance",
    objectiveIds: [
      "obj-1-journal",
      "obj-2-strata",
      "obj-3-bath-sluice",
      "obj-4-merchant-ledger",
      "obj-5-north-gate",
    ],
  },
  "level-2-merchant-quarter": {
    levelNumber: 2,
    levelTitle: "THE MERCHANT QUARTER",
    zoneSubtitle: "Bazaar, Warehouses & Guild Archives",
    doorUnlockCondition: "Decipher 4-glyph sequence on Carved Indus Symbol Gate",
    objectiveIds: [
      "obj-6-weights",
      "obj-7-warehouse",
      "obj-8-symbol-gate",
    ],
  },
  "level-3-sealed-sanctum": {
    levelNumber: 3,
    levelTitle: "THE SEALED SANCTUM",
    zoneSubtitle: "Subterranean Sacred Vault & Altar",
    doorUnlockCondition: "Study both friezes & align Keystone to drop Altar Barrier",
    objectiveIds: [
      "obj-9-sanctuary-friezes",
      "obj-10-keystone",
      "obj-11-forensic",
    ],
  },
};

export function ObjectiveHUD({
  currentLevelId,
  currentActId,
  objectives,
  currentDirective,
  onOpenClues,
  className,
}: ObjectiveHUDProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const config = LEVEL_CONFIGS[currentLevelId] ?? LEVEL_CONFIGS["level-1-lost-city"];
  const currentLevelObjectives = objectives.filter((o) =>
    config.objectiveIds.includes(o.id),
  );

  const completedCount = currentLevelObjectives.filter((o) => o.completed).length;
  const totalCount = currentLevelObjectives.length;
  const isLevelComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <aside
      aria-label="Mission Objectives and Progress"
      className={cn(
        "pointer-events-auto rounded-2xl border border-amber-500/35 bg-stone-950/90 text-foreground shadow-2xl shadow-black/85 backdrop-blur-md transition-all duration-300 w-72 sm:w-80",
        className,
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-3.5 py-2.5 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-amber-400 text-xs">◆</span>
          <div className="min-w-0">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-amber-300">
              OBJECTIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant="outline"
            className={cn(
              "font-mono text-[9px] font-semibold tracking-wider px-2 py-0.5",
              isLevelComplete
                ? "border-emerald-500/50 bg-emerald-950/50 text-emerald-300"
                : "border-amber-500/40 bg-amber-500/10 text-amber-300",
            )}
          >
            {completedCount} / {totalCount} DONE
          </Badge>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-stone-400 hover:text-amber-300 transition-colors"
            title={isExpanded ? "Collapse Objectives" : "Expand Objectives"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Mission Goal Statement */}
      <div className="px-3.5 py-2 border-b border-border/20 bg-stone-900/40">
        <h4 className="font-serif text-xs font-bold text-amber-200 flex items-center gap-1.5">
          <span>◆</span>
          <span>Find the Lost Seal</span>
        </h4>
        <p className="text-[10px] text-stone-300 leading-snug mt-0.5 font-sans">
          Explore the ancient city, investigate archaeological clues, and recover the missing seal.
        </p>
      </div>

      {/* Expanded Objective Task List */}
      {isExpanded && (
        <div className="p-3.5 space-y-3 text-xs animate-in fade-in duration-200">
          {/* Level Header Sub-label */}
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-b border-border/30 pb-1.5">
            <span className="font-bold tracking-wider text-amber-400/90 uppercase">
              LEVEL {config.levelNumber} — {config.levelTitle}
            </span>
            <span className="text-[9px] text-stone-400">
              {completedCount} / {totalCount} OBJECTIVES
            </span>
          </div>

          {/* Current Directive Callout */}
          <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-2 text-xs">
            <div className="flex items-center gap-1 font-serif font-bold uppercase tracking-wider text-amber-300 text-[9px]">
              <Sparkles className="h-3 w-3 shrink-0" />
              <span>Current Directive</span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium leading-tight text-foreground font-sans">
              {currentDirective}
            </p>
          </div>

          {/* Individual Checklist Items */}
          <div className="space-y-1.5">
            {currentLevelObjectives.map((obj) => {
              const isDone = obj.completed;
              return (
                <div
                  key={obj.id}
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg p-1.5 transition-all duration-300",
                    isDone
                      ? "bg-emerald-950/25 border border-emerald-500/20 text-stone-300"
                      : "bg-stone-900/40 border border-stone-800 text-foreground",
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 animate-in zoom-in" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-amber-400/70" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-[11px] font-serif leading-tight font-medium",
                        isDone && "line-through text-stone-400",
                      )}
                    >
                      {obj.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gate Passage Status */}
          <div
            className={cn(
              "flex items-start gap-2 rounded-xl p-2 text-[10px] border transition-colors",
              isLevelComplete
                ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                : "border-border/50 bg-stone-900/50 text-stone-400",
            )}
          >
            {isLevelComplete ? (
              <Unlock className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <Lock className="h-3.5 w-3.5 shrink-0 text-amber-400/80 mt-0.5" />
            )}
            <div className="min-w-0">
              <span className="font-bold font-mono uppercase tracking-wider block text-[9px]">
                {isLevelComplete ? "GATE UNLOCKED" : "GATE PASSAGE CRITERIA"}
              </span>
              <p className="leading-tight text-[10px] mt-0.5 text-foreground/90">
                {isLevelComplete
                  ? "The evidence has revealed the way forward. Proceed to the next area!"
                  : config.doorUnlockCondition}
              </p>
            </div>
          </div>

          {/* Archaeological Dossier Shortcut Button */}
          {onOpenClues && (
            <button
              type="button"
              onClick={onOpenClues}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-stone-900/80 px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all cursor-pointer shadow-sm"
            >
              <Scroll className="h-3.5 w-3.5" />
              <span>Review Artifact Dossier</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
