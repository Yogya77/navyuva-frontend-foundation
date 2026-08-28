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

  // ── CINEMATIC MAIN MENU ────────────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="relative min-h-[600px] w-full overflow-hidden rounded-2xl flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0a0614 0%, #0e1a2a 45%, #160a04 100%)" }}>

        {/* Decorative ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #00cccc 0%, transparent 70%)", filter: "blur(48px)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8"
            style={{ background: "radial-gradient(circle, #ff8833 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-10 right-1/3 w-40 h-40 rounded-full opacity-6"
            style={{ background: "radial-gradient(circle, #7744ff 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        {/* Decorative floating particles (CSS only) */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(18)].map((_, i) => (
            <div key={i}
              className="absolute w-1 h-1 rounded-full opacity-30 animate-pulse"
              style={{
                background: i % 3 === 0 ? "#00cccc" : i % 3 === 1 ? "#ffaa44" : "#ffffff",
                left: `${8 + (i * 5.2) % 84}%`,
                top: `${10 + (i * 7.3) % 75}%`,
                animationDelay: `${(i * 0.37) % 3}s`,
                animationDuration: `${2.4 + (i * 0.3) % 2}s`,
              }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center max-w-2xl w-full">
          {/* Badge */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] mb-6"
            style={{ color: "#00cccc" }}>
            <Sparkles className="h-4 w-4" />
            <span>NAVYUVA Heritage · 3D Adventure</span>
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Main Title */}
          <div className="mb-2">
            <h1 className="font-serif font-black tracking-[0.15em] uppercase"
              style={{
                fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                lineHeight: 1.0,
                background: "linear-gradient(135deg, #ffeecc 0%, #ffaa44 40%, #ff7722 70%, #dd4400 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 32px rgba(255, 120, 30, 0.5))",
              }}>
              THE LOST
            </h1>
            <h1 className="font-serif font-black tracking-[0.35em] uppercase"
              style={{
                fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                lineHeight: 1.0,
                background: "linear-gradient(135deg, #88ffff 0%, #00dddd 50%, #0099bb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 28px rgba(0, 200, 200, 0.6))",
              }}>
              SEAL
            </h1>
          </div>

          {/* Subtitle */}
          <p className="mt-3 text-sm font-medium tracking-[0.15em] uppercase opacity-60"
            style={{ color: "#c8a878" }}>
            An Archaeological Expedition · Mohenjo-daro · 2600–1900 BCE
          </p>

          {/* Divider line */}
          <div className="mt-6 flex items-center gap-3 w-full max-w-xs">
            <div className="flex-1 h-px opacity-30" style={{ background: "linear-gradient(to right, transparent, #00cccc)" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#00cccc", boxShadow: "0 0 8px #00cccc" }} />
            <div className="flex-1 h-px opacity-30" style={{ background: "linear-gradient(to left, transparent, #00cccc)" }} />
          </div>

          {/* Story intro */}
          <p className="mt-6 text-sm leading-relaxed opacity-70 max-w-lg" style={{ color: "#d4c0a0" }}>
            A master steatite stamp seal — the administrative key of a vanished civilization —
            has been discovered deep within the ancient citadel of Mohenjo-daro.
            Explore three interconnected ruins, solve ancient mechanisms, and recover the
            <strong style={{ color: "#ffcc88" }}> Lost Seal</strong> for the Virtual Museum.
          </p>

          {/* Controls quick ref */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
            {[
              ["WASD", "Move"],
              ["SHIFT", "Sprint"],
              ["SPACE", "Jump"],
              ["E", "Inspect"],
              ["Mouse", "Camera"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
                <kbd className="rounded px-1.5 py-0.5 text-xs font-bold font-mono"
                  style={{ background: "rgba(0,200,200,0.15)", color: "#00dddd", border: "1px solid rgba(0,200,200,0.3)" }}>
                  {key}
                </kbd>
                <span style={{ color: "#a0957a" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Quality selector */}
          <div className="mt-6 w-full max-w-sm rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-3.5 w-3.5" style={{ color: "#00cccc" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8aabb0" }}>
                Graphics Quality
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["ultra", "high", "mobile-high", "mobile"] as QualityTier[]).map((q) => (
                <button key={q} type="button" onClick={() => setQualityTier(q)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold transition-all"
                  style={qualityTier === q
                    ? { background: "rgba(0,200,200,0.2)", color: "#00dddd", border: "1px solid rgba(0,200,200,0.5)", boxShadow: "0 0 12px rgba(0,200,200,0.2)" }
                    : { background: "rgba(255,255,255,0.03)", color: "#7a8a90", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {q === "ultra" ? "⚡ Ultra (RTX)" : q === "high" ? "✨ High" : q === "mobile-high" ? "📱 Mobile Hi" : "🌿 Eco"}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex w-full flex-col sm:flex-row items-center gap-3">
            <button type="button" onClick={onExit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "#7a8a90", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button type="button" onClick={() => setHasStarted(true)}
              className="w-full sm:flex-1 flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold font-serif uppercase tracking-widest transition-all"
              style={{
                background: "linear-gradient(135deg, #cc5500 0%, #ff7722 50%, #ffaa44 100%)",
                color: "#fff8ee",
                boxShadow: "0 0 40px rgba(255, 110, 30, 0.35), 0 4px 24px rgba(0,0,0,0.5)",
                letterSpacing: "0.18em",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 60px rgba(255, 120, 30, 0.55), 0 4px 24px rgba(0,0,0,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(255, 110, 30, 0.35), 0 4px 24px rgba(0,0,0,0.5)")}>
              <Zap className="h-5 w-5" />
              Begin Expedition
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
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
