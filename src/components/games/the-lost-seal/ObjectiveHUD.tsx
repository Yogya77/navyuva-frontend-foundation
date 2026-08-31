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
        "pointer-events-auto rounded-2xl border border-primary/40 bg-stone-950/90 text-foreground shadow-2xl shadow-black/80 backdrop-blur-md transition-all duration-300",
        className,
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-3.5 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/50 bg-primary/20 text-primary shadow-inner">
            <Compass className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-[11px] font-bold uppercase tracking-wider text-primary">
                LEVEL {config.levelNumber} — {config.levelTitle}
              </span>
            </div>
            <p className="truncate font-mono text-[9px] text-stone-400">
              {config.zoneSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className={cn(
              "font-mono text-[10px] font-semibold tracking-wider",
              isLevelComplete
                ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                : "border-primary/40 bg-primary/10 text-primary",
            )}
          >
            {completedCount}/{totalCount} DONE
          </Badge>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-800 hover:text-foreground"
            title={isExpanded ? "Collapse Objectives HUD" : "Expand Objectives HUD"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 p-3.5 text-xs animate-in fade-in duration-200">
          {/* Current Directive Banner */}
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-serif font-bold uppercase tracking-wider text-primary text-[10px]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Current Directive</span>
            </div>
            <p className="mt-1 text-[11px] font-medium leading-snug text-foreground">
              {currentDirective}
            </p>
          </div>

          {/* Sequential Checklist */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-serif font-semibold uppercase tracking-wider text-stone-400 px-0.5">
              <span>Archaeological Progress</span>
              <span className="font-mono text-[9px] text-stone-500">
                {Math.round((completedCount / (totalCount || 1)) * 100)}%
              </span>
            </div>

            <div className="space-y-1">
              {currentLevelObjectives.map((obj, idx) => {
                const isCurrentPending =
                  !obj.completed &&
                  (idx === 0 || currentLevelObjectives[idx - 1]?.completed);

                return (
                  <div
                    key={obj.id}
                    className={cn(
                      "flex items-start gap-2 rounded-lg px-2 py-1.5 transition-all text-[11px]",
                      obj.completed
                        ? "bg-emerald-950/20 text-stone-300"
                        : isCurrentPending
                          ? "border border-primary/40 bg-stone-900/90 text-foreground shadow-sm"
                          : "text-stone-500 opacity-70",
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {obj.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : isCurrentPending ? (
                        <Circle className="h-3.5 w-3.5 text-primary animate-pulse" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-stone-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "leading-tight block",
                          obj.completed
                            ? "line-through text-stone-400"
                            : isCurrentPending
                              ? "font-semibold text-foreground"
                              : "text-stone-500",
                        )}
                      >
                        {obj.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Door / Gate Unlock Status */}
          <div className="rounded-xl border border-border/50 bg-stone-900/70 p-2 text-[10px] flex items-center gap-2">
            {isLevelComplete ? (
              <>
                <Unlock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-medium">
                  Gate Unlocked: Way forward is open!
                </span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-stone-300">
                  <strong className="text-amber-400">Unlock Condition:</strong>{" "}
                  {config.doorUnlockCondition}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
