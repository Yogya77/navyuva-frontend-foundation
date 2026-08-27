import { useEffect, useRef, useState, useCallback, type TouchEvent } from "react";
import {
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  Scroll,
  ArrowRight,
  ArrowLeft,
  Settings2,
  Eye,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThreeAdventureEngine, type QualityTier } from "./ThreeAdventureEngine";
import { adventureAudio } from "./audio";
import { ObjectInspectionModal } from "../modals/ObjectInspectionModal";
import { SymbolPuzzleModal } from "../modals/SymbolPuzzleModal";
import { FloorCacheModal } from "../modals/FloorCacheModal";
import { SealForensicModal } from "../modals/SealForensicModal";
import { CluePanel } from "../CluePanel";
import { LostSealCompletion } from "../LostSealCompletion";
import type { LevelId, InteractiveEntity3D } from "./types";
import type { ArchaeologicalClue } from "../types";

interface LostSeal3DAdventureProps {
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

const LEVEL_DETAILS: Record<LevelId, { name: string; subtitle: string; objective: string }> = {
  "level-1-lost-city": {
    name: "Level 1: The Lost City",
    subtitle: "Excavation Citadel • Mohenjo-daro",
    objective:
      "Explore the ancient courtyard, inspect the Great Bath and find the northern gateway.",
  },
  "level-2-merchant-quarter": {
    name: "Level 2: The Merchant Quarter",
    subtitle: "Bazaar & Warehouse Ruins",
    objective: "Follow trade clues to the north wall and solve the carved Symbol Gate puzzle.",
  },
  "level-3-sealed-sanctum": {
    name: "Level 3: The Sealed Sanctum",
    subtitle: "Underground Sacred Vault",
    objective:
      "Explore sanctuary friezes and align the Keystone Mechanism to unlock the Altar Barrier!",
  },
};

export function LostSeal3DAdventure({ onComplete, onExit }: LostSeal3DAdventureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ThreeAdventureEngine | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>("level-1-lost-city");
  const [currentObjective, setCurrentObjective] = useState<string>(
    LEVEL_DETAILS["level-1-lost-city"].objective,
  );
  const [score, setScore] = useState<number>(0);
  const [clues, setClues] = useState<ArchaeologicalClue[]>([]);
  const [isMuted, setIsMuted] = useState(adventureAudio.getMuted());
  const [nearbyEntity, setNearbyEntity] = useState<InteractiveEntity3D | null>(null);
  const [qualityTier, setQualityTier] = useState<QualityTier>("ultra"); // Default Ultra for RTX 5050 class desktop

  // Touch controls state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Modals state
  const [inspectingEntity, setInspectingEntity] = useState<InteractiveEntity3D | null>(null);
  const [isSymbolPuzzleOpen, setIsSymbolPuzzleOpen] = useState(false);
  const [isFloorCacheOpen, setIsFloorCacheOpen] = useState(false);
  const [isSealForensicOpen, setIsSealForensicOpen] = useState(false);
  const [isCluePanelOpen, setIsCluePanelOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const maxScore = 650;
  const isAnyModalOpen =
    Boolean(inspectingEntity) ||
    isSymbolPuzzleOpen ||
    isFloorCacheOpen ||
    isSealForensicOpen ||
    isCluePanelOpen;

  // Detect Touch screen
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  const handleClueFound = useCallback((newClue: ArchaeologicalClue) => {
    setClues((prev) => {
      if (prev.some((c) => c.id === newClue.id)) return prev;
      adventureAudio.playDiscovery();
      return [...prev, newClue];
    });
    setScore((prev) => prev + 50);
  }, []);

  const handleInteract = useCallback(
    (entity: InteractiveEntity3D) => {
      if (entity.type === "passage_gate") {
        // Transition Level 1 to Level 2
        engineRef.current?.loadLevel("level-2-merchant-quarter");
        setCurrentLevelId("level-2-merchant-quarter");
        setCurrentObjective(LEVEL_DETAILS["level-2-merchant-quarter"].objective);
        adventureAudio.playDiscovery();
      } else if (entity.type === "symbol_puzzle_gate") {
        setIsSymbolPuzzleOpen(true);
      } else if (entity.type === "underground_cache") {
        // Altar Keystone alignment
        setIsFloorCacheOpen(true);
      } else if (entity.type === "steatite_seal") {
        setIsSealForensicOpen(true);
      } else {
        setInspectingEntity(entity);
        engineRef.current?.markEntityInspected(entity.id);

        if (entity.objectiveAfterInspect) {
          setCurrentObjective(entity.objectiveAfterInspect);
        }

        // Grant historical clues
        if (entity.type === "mound" || entity.id === "survey_marker") {
          handleClueFound({
            id: "clue-strata",
            title: "Stratigraphic Context: Mature Harappan",
            category: "Stratigraphy",
            icon: "🏔️",
            shortSnippet: "Artifacts lie in the undisturbed Mature Harappan silt layer.",
            fullNote:
              "Trench DK-G stratigraphy confirms undisturbed Mature Harappan habitation layers (2600–1900 BCE).",
            discoveredInStage: 1,
          });
        } else if (entity.type === "pottery") {
          handleClueFound({
            id: "clue-pottery",
            title: "Ceramic Seal Impressions",
            category: "Trade",
            icon: "🏺",
            shortSnippet: "Pottery storage jars were secured with stamped clay tags.",
            fullNote:
              "Harappan storage jars were plugged and sealed with square steatite stamp impressions.",
            discoveredInStage: 1,
          });
        } else if (entity.type === "tablet") {
          handleClueFound({
            id: "clue-script",
            title: "Indus Script Directionality",
            category: "Epigraphy",
            icon: "📜",
            shortSnippet: "Indus script reads Right-to-Left starting with sacred emblems.",
            fullNote:
              "Seal inscriptions read right-to-left, beginning with animal totems and ending with terminal signs.",
            discoveredInStage: 1,
          });
        } else if (entity.type === "crate") {
          handleClueFound({
            id: "clue-weights",
            title: "Standardized Binary Chert Weights",
            category: "Trade",
            icon: "⚖️",
            shortSnippet:
              "Standard binary weights (1, 2, 4, 8, 16) were used across the Indus trade network.",
            fullNote:
              "Harappan merchants used standardized cubic chert weights to govern taxation and precious metal commerce.",
            discoveredInStage: 2,
          });
        }
      }
    },
    [handleClueFound],
  );

  // Initialize 3D Engine
  useEffect(() => {
    if (!hasStarted || !canvasRef.current) return;

    const engine = new ThreeAdventureEngine(
      canvasRef.current,
      {
        onNearbyEntityChange: (ent) => setNearbyEntity(ent),
        onInteract: (ent) => handleInteract(ent),
        onLevelChanged: (lvl) => {
          setCurrentLevelId(lvl);
          setCurrentObjective(LEVEL_DETAILS[lvl].objective);
        },
      },
      qualityTier,
    );

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [hasStarted, handleInteract, qualityTier]);

  // Pause engine when modal is open
  useEffect(() => {
    engineRef.current?.setPaused(isAnyModalOpen);
  }, [isAnyModalOpen]);

  const handleToggleSound = () => {
    const next = adventureAudio.toggleMute();
    setIsMuted(next);
  };

  const handleQualityChange = (q: QualityTier) => {
    setQualityTier(q);
    engineRef.current?.setQuality(q);
  };

  // Solving Level 2 Symbol Puzzle opens the 3D gate and transitions to Level 3!
  const handleSymbolPuzzleSolved = (scoreEarned: number) => {
    setScore((prev) => prev + scoreEarned);
    engineRef.current?.openGate("symbol_puzzle_gate");
    handleClueFound({
      id: "clue-symbol-frieze",
      title: "Deciphered Administrative Formula",
      category: "Epigraphy",
      icon: "🔣",
      shortSnippet: "Manger → Zebu Bull → Fish Sign → Terminal Bow.",
      fullNote: "The solved epigraphic formula unlocked the gateway into the Sealed Sanctum.",
      discoveredInStage: 2,
    });

    setTimeout(() => {
      engineRef.current?.loadLevel("level-3-sealed-sanctum");
      setCurrentLevelId("level-3-sealed-sanctum");
      setCurrentObjective(LEVEL_DETAILS["level-3-sealed-sanctum"].objective);
    }, 1200);
  };

  // Unlocking Level 3 Keystone disengages the sacred barrier!
  const handleKeystoneUnlocked = () => {
    setIsFloorCacheOpen(false);
    engineRef.current?.disengageAltarBarrier();
    setCurrentObjective(
      "The Altar Barrier is disengaged! Approach the central altar to recover the Steatite Seal.",
    );
    handleClueFound({
      id: "clue-keystone",
      title: "Sacred Altar Keystone Aligned",
      category: "Iconography",
      icon: "🗝️",
      shortSnippet: "The inner sanctum barrier has retracted.",
      fullNote:
        "Aligning the keystone disengaged the sacred altar barrier, granting access to the Steatite Seal.",
      discoveredInStage: 3,
    });
  };

  // Completing Level 3 forensic recovery
  const handleSealRecovered = (scoreEarned: number) => {
    const finalScore = score + scoreEarned;
    setScore(finalScore);
    setIsSealForensicOpen(false);
    setIsFinished(true);
    adventureAudio.playVictory();
    onComplete(finalScore, maxScore);
  };

  const handleRestart = () => {
    setScore(0);
    setClues([]);
    setIsFinished(false);
    setHasStarted(true);
    engineRef.current?.loadLevel("level-1-lost-city");
  };

  // Touch handlers for looking around
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches[0]) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartPos.current || !e.touches[0]) return;
    const dx = e.touches[0].clientX - touchStartPos.current.x;
    const dy = e.touches[0].clientY - touchStartPos.current.y;
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    engineRef.current?.handleTouchLook(dx, dy);
  };

  const handleTouchEnd = () => {
    touchStartPos.current = null;
  };

  const activeLevelInfo = LEVEL_DETAILS[currentLevelId];

  // Intro Screen
  if (!hasStarted) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-primary/40 bg-gradient-to-b from-card via-card/95 to-background p-6 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
          <Sparkles className="h-4 w-4" />
          Third-Person 3D Historical Adventure
        </div>

        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          THE LOST SEAL
        </h1>
        <p className="mt-2 font-serif text-base text-gold sm:text-lg">
          An Archaeological Expedition into Mohenjo-daro (2600–1900 BCE)
        </p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Experience the ancient Indus Valley Civilization in a{" "}
            <strong>stylized third-person 3D adventure</strong>. Control your explorer with{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-xs font-mono">
              WASD
            </kbd>{" "}
            or{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-xs font-mono">
              Arrow Keys
            </kbd>
            , orbit the camera with your mouse, sprint with{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-xs font-mono">
              SHIFT
            </kbd>
            , jump with{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-xs font-mono">
              SPACE
            </kbd>
            , and press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-primary text-black font-bold text-xs font-mono">
              E
            </kbd>{" "}
            to inspect artifacts.
          </p>
          <p>
            Explore 3 interconnected levels: discover the citadel in <strong>The Lost City</strong>,
            solve ancient trade mechanisms in <strong>The Merchant Quarter</strong>, and descend
            into <strong>The Sealed Sanctum</strong> to authenticate the master{" "}
            <strong>Steatite Stamp Seal</strong> for the <strong>Virtual Museum</strong>.
          </p>
        </div>

        {/* Graphics Quality Tier Selector */}
        <div className="mt-6 rounded-2xl border border-border/50 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-foreground mb-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <span>Graphics Quality Setting</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["ultra", "high", "mobile-high", "mobile"] as QualityTier[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQualityTier(q)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  qualityTier === q
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card/70 text-muted-foreground border-border/60 hover:text-foreground"
                }`}
              >
                {q === "ultra"
                  ? "Ultra (RTX/Desktop)"
                  : q === "high"
                    ? "High Quality"
                    : q === "mobile-high"
                      ? "Mobile High"
                      : "Mobile Eco"}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40 pt-5">
          <Button
            variant="ghost"
            onClick={onExit}
            className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games Hub
          </Button>

          <Button
            onClick={() => setHasStarted(true)}
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-serif font-bold shadow-lg shadow-primary/20"
          >
            Enter 3D Adventure World
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Completion Victory Screen
  if (isFinished) {
    const accuracy = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 100;

    return (
      <LostSealCompletion
        score={score}
        maxScore={maxScore}
        accuracy={accuracy}
        cluesCount={clues.length}
        hintsUsed={0}
        onReplay={handleRestart}
        onBackToGames={onExit}
      />
    );
  }

  return (
    <div className="space-y-4 select-none">
      {/* Sleek Minimal Top HUD */}
      <header className="rounded-2xl border border-primary/30 bg-gradient-to-r from-card via-card/95 to-background p-4 sm:p-5 shadow-lg shadow-black/40">
        <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-3.5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/15 text-[10px] uppercase font-bold text-primary"
                >
                  {activeLevelInfo.name}
                </Badge>
                <span className="text-xs text-muted-foreground">{activeLevelInfo.subtitle}</span>
              </div>
              <h1 className="font-serif text-lg font-bold text-foreground sm:text-xl">
                The Lost Seal
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quality Preset Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextQ: QualityTier =
                  qualityTier === "ultra"
                    ? "high"
                    : qualityTier === "high"
                      ? "mobile-high"
                      : qualityTier === "mobile-high"
                        ? "mobile"
                        : "ultra";
                handleQualityChange(nextQ);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              title="Toggle Graphics Quality Tier"
            >
              <Settings2 className="h-3.5 w-3.5 text-primary" />
              <span className="capitalize">{qualityTier}</span>
            </button>

            {/* Audio Toggle */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleSound}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              )}
            </Button>

            {/* Clues Pill */}
            <button
              type="button"
              onClick={() => setIsCluePanelOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/60 hover:bg-primary/10"
            >
              <Scroll className="h-3.5 w-3.5 text-primary" />
              <span>Clues ({clues.length})</span>
            </button>

            {/* Score Display */}
            <div className="rounded-lg border border-border/40 bg-background/70 px-3 py-1.5 text-xs font-semibold text-gold">
              <span>Score: {score} pts</span>
            </div>

            {/* Exit */}
            <Button size="sm" variant="outline" onClick={onExit} className="h-8 px-3 text-xs">
              Exit
            </Button>
          </div>
        </div>

        {/* Current Objective */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-primary">Mission:</span>
          <span className="text-foreground">{currentObjective}</span>
        </div>
      </header>

      {/* 3D WebGL Canvas Viewport */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#140e0a] shadow-2xl touch-none focus:outline-none focus:ring-2 focus:ring-primary/60"
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-[520px] sm:h-[640px] block cursor-grab active:cursor-grabbing focus:outline-none"
        />

        {/* In-World Proximity [E] Interaction Prompt */}
        {nearbyEntity && !isAnyModalOpen && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-20 pointer-events-none z-20 animate-bounce">
            <div className="flex items-center gap-2 rounded-xl border border-primary bg-black/90 px-4 py-2 text-xs font-bold text-foreground shadow-2xl backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-black font-mono text-[11px]">
                E
              </span>
              <span className="text-gold font-serif">{nearbyEntity.promptLabel}</span>
            </div>
          </div>
        )}

        {/* On-Screen Mobile Touch Controls Overlay */}
        {isTouchDevice && (
          <div className="absolute inset-x-4 bottom-14 flex items-end justify-between pointer-events-none z-20">
            {/* Left D-pad Movement */}
            <div className="pointer-events-auto flex flex-col items-center gap-1.5 rounded-2xl bg-black/75 p-2 backdrop-blur-md border border-border/50 shadow-xl">
              <button
                type="button"
                onPointerDown={() => engineRef.current?.setTouchJoystick(0, 1)}
                onPointerUp={() => engineRef.current?.setTouchJoystick(0, 0)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground font-bold active:bg-primary active:text-black"
              >
                ▲
              </button>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onPointerDown={() => engineRef.current?.setTouchJoystick(-1, 0)}
                  onPointerUp={() => engineRef.current?.setTouchJoystick(0, 0)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground font-bold active:bg-primary active:text-black"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onPointerDown={() => engineRef.current?.setTouchJoystick(0, -1)}
                  onPointerUp={() => engineRef.current?.setTouchJoystick(0, 0)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground font-bold active:bg-primary active:text-black"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onPointerDown={() => engineRef.current?.setTouchJoystick(1, 0)}
                  onPointerUp={() => engineRef.current?.setTouchJoystick(0, 0)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground font-bold active:bg-primary active:text-black"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="pointer-events-auto flex flex-col items-end gap-2">
              {nearbyEntity && (
                <button
                  type="button"
                  onClick={() => engineRef.current?.triggerInteract()}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-black font-bold shadow-xl border-2 border-amber-300 animate-pulse active:scale-95"
                >
                  <Eye className="h-6 w-6" />
                </button>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onPointerDown={() => engineRef.current?.setTouchJoystick(0, 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-card/90 border border-border text-foreground font-bold active:bg-gold active:text-black shadow-lg"
                >
                  <Zap className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => engineRef.current?.triggerJump()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-card/90 border border-border text-foreground font-bold active:bg-primary active:text-black shadow-lg"
                >
                  ▲
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Controls Toolbar overlay */}
        <div className="absolute bottom-3 inset-x-3 pointer-events-none flex items-center justify-between z-10">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-black/80 px-3.5 py-1.5 backdrop-blur-md text-[11px] text-muted-foreground shadow-lg">
            <span className="font-mono text-primary font-bold">W/S</span>
            <span>Fwd/Back</span>
            <span className="mx-1 opacity-40">|</span>
            <span className="font-mono text-primary font-bold">A/D</span>
            <span>Left/Right</span>
            <span className="mx-1 opacity-40">|</span>
            <span className="font-mono text-primary font-bold">SHIFT</span>
            <span>Sprint</span>
            <span className="mx-1 opacity-40">|</span>
            <span className="font-mono text-primary font-bold">SPACE</span>
            <span>Jump</span>
            <span className="mx-1 opacity-40">|</span>
            <span className="font-mono text-primary font-bold">Mouse Drag</span>
            <span>Orbit</span>
            <span className="mx-1 opacity-40">|</span>
            <span className="font-mono text-gold font-bold">[E]</span>
            <span>Interact</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-primary/30 bg-black/80 px-3 py-1.5 backdrop-blur-md text-[11px] text-primary shadow-lg">
            <Compass className="h-3.5 w-3.5" />
            <span>Third-Person 3D Adventure</span>
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <ObjectInspectionModal
        entity={
          inspectingEntity
            ? {
                id: inspectingEntity.id,
                type:
                  inspectingEntity.type === "seal_impression"
                    ? "pottery"
                    : (inspectingEntity.type as any),
                name: inspectingEntity.name,
                x: inspectingEntity.position.x,
                y: inspectingEntity.position.z,
                width: 48,
                height: 48,
                icon:
                  inspectingEntity.type === "marker"
                    ? "📍"
                    : inspectingEntity.type === "pottery"
                      ? "🏺"
                      : inspectingEntity.type === "tablet"
                        ? "📜"
                        : inspectingEntity.type === "crate"
                          ? "📦"
                          : inspectingEntity.type === "storage_jars"
                            ? "🏺"
                            : "🔷",
                promptLabel: inspectingEntity.promptLabel,
                zone: activeLevelInfo.name,
                isInspected: inspectingEntity.isInspected,
              }
            : null
        }
        onClose={() => setInspectingEntity(null)}
        onClueFound={handleClueFound}
      />

      <SymbolPuzzleModal
        isOpen={isSymbolPuzzleOpen}
        onClose={() => setIsSymbolPuzzleOpen(false)}
        onPuzzleSolved={handleSymbolPuzzleSolved}
      />

      <FloorCacheModal
        isOpen={isFloorCacheOpen}
        onClose={() => setIsFloorCacheOpen(false)}
        onUnlocked={handleKeystoneUnlocked}
      />

      <SealForensicModal
        isOpen={isSealForensicOpen}
        onClose={() => setIsSealForensicOpen(false)}
        onRecovered={handleSealRecovered}
      />

      <CluePanel isOpen={isCluePanelOpen} onClose={() => setIsCluePanelOpen(false)} clues={clues} />
    </div>
  );
}
