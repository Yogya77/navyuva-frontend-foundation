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
import { WaterFlowPuzzleModal } from "../modals/WaterFlowPuzzleModal";
import { MerchantAccountingModal } from "../modals/MerchantAccountingModal";
import { CluePanel } from "../CluePanel";
import { LostSealCompletion } from "../LostSealCompletion";
import { ObjectiveHUD } from "../ObjectiveHUD";
import type { LevelId, InteractiveEntity3D, StoryActId, StoryActInfo } from "./types";
import type {
  ArchaeologicalClue,
  JournalArtifact,
  JournalDocument,
  ExpeditionObjective,
} from "../types";

interface LostSeal3DAdventureProps {
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

export const STORY_ACTS: Record<StoryActId, StoryActInfo> = {
  "act-1-discovery": {
    id: "act-1-discovery",
    actNumber: "ACT I",
    title: "THE DISCOVERY",
    subtitle: "Archaeological Excavation Trench DK-G",
    historicalContext: "Initial stratigraphic survey reveals Mature Harappan habitation layers (2600–1900 BCE).",
  },
  "act-2-lost-city": {
    id: "act-2-lost-city",
    actNumber: "ACT II",
    title: "THE LOST CITY",
    subtitle: "Civic Citadel & Great Bath",
    historicalContext: "Investigate ancient civic drainage, brick masonry, and the northern gateway.",
  },
  "act-3-merchant-quarter": {
    id: "act-3-merchant-quarter",
    actNumber: "ACT III",
    title: "THE MERCHANT QUARTER",
    subtitle: "Bazaar, Warehouses & Guild Records",
    historicalContext: "Decipher standardized chert weights, storage bullae tags, and carved Indus symbol locks.",
  },
  "act-4-sealed-sanctum": {
    id: "act-4-sealed-sanctum",
    actNumber: "ACT IV",
    title: "THE SEALED SANCTUM",
    subtitle: "Subterranean Vault & Master Steatite Seal",
    historicalContext: "Align the sacred keystone mechanism to recover and authenticate the Master Steatite Stamp Seal.",
  },
};

export const INTRO_SHOT_TEXTS = [
  {
    title: "NAVYUVA HERITAGE EXPEDITION",
    subtitle: "ARCHAEOLOGICAL RESEARCH INITIATIVE",
    tagline: "Expedition DK-G • Mohenjo-daro",
  },
  {
    title: "MOHENJO-DARO",
    subtitle: "2600–1900 BCE • INDUS VALLEY CIVILIZATION",
    tagline: "A master planned metropolis hidden beneath the silt for four millennia.",
  },
  {
    title: "THE LOST CITY",
    subtitle: "CEREMONIAL BOULEVARD & SACRED BATH",
    tagline: "Ancient records suggest a supreme administrative seal was deliberately concealed.",
  },
  {
    title: "ANCIENT MYSTERIES",
    subtitle: "INSCRIPTIONS • GLYPHS • TRADE MECHANISMS",
    tagline: "Follow archaeological strata leading deep into the citadel ruins.",
  },
  {
    title: "SOME STORIES ARE BURIED FOR A REASON.",
    subtitle: "BEGIN EXPEDITION",
    tagline: "Recover the Master Steatite Stamp Seal.",
  },
];

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

const INITIAL_OBJECTIVES: ExpeditionObjective[] = [
  {
    id: "obj-1-journal",
    actId: "act-1-discovery",
    title: "Examine Field Journal at Camp",
    description: "Inspect the leather-bound field notes at the DK-G sorting station to review missing artifact records.",
    completed: false,
    order: 1,
  },
  {
    id: "obj-2-strata",
    actId: "act-1-discovery",
    title: "Survey Excavation Trench DK-G",
    description: "Verify undisturbed Mature Harappan stratigraphy in the western excavation trench.",
    completed: false,
    order: 2,
  },
  {
    id: "obj-3-bath-sluice",
    actId: "act-2-lost-city",
    title: "Operate Great Bath Sluice System",
    description: "Engage the ancient desilting, intake, and drainage valves in correct sequence to reveal submerged votive finds.",
    completed: false,
    order: 3,
  },
  {
    id: "obj-4-merchant-ledger",
    actId: "act-2-lost-city",
    title: "Decipher Scribe Station Ledger",
    description: "Match merchant house records with binary chert metrology to identify who requisitioned the Lost Seal.",
    completed: false,
    order: 4,
  },
  {
    id: "obj-5-north-gate",
    actId: "act-2-lost-city",
    title: "Inspect North Gate Clearance Bulla",
    description: "Inspect the North Gate clay bulla tag to authorize transit clearance and unlock the Merchant Quarter archway.",
    completed: false,
    order: 5,
  },
  {
    id: "obj-6-weights",
    actId: "act-3-merchant-quarter",
    title: "Examine Binary Chert Weights",
    description: "Verify standard guild metrology at the merchant bazaar balance table.",
    completed: false,
    order: 6,
  },
  {
    id: "obj-7-warehouse",
    actId: "act-3-merchant-quarter",
    title: "Search Warehouse 7 & Account Tablets",
    description: "Trace the trade bullae in the merchant corridors to locate the hidden entrance.",
    completed: false,
    order: 7,
  },
  {
    id: "obj-8-symbol-gate",
    actId: "act-3-merchant-quarter",
    title: "Decode Carved Indus Symbol Gate",
    description: "Align the 4-sign epigraphic sequence (Manger ➔ Bull ➔ Fish ➔ Bow) to unlock the Sealed Sanctum.",
    completed: false,
    order: 8,
  },
  {
    id: "obj-9-sanctuary-friezes",
    actId: "act-4-sealed-sanctum",
    title: "Study Sacred Sanctuary Friezes",
    description: "Examine the Zebu Bull sacred totem reliefs to obtain the keystone formula.",
    completed: false,
    order: 9,
  },
  {
    id: "obj-10-keystone",
    actId: "act-4-sealed-sanctum",
    title: "Align Sanctuary Keystone Mechanism",
    description: "Disengage the ancient bronze altar barrier guarding the inner sanctum.",
    completed: false,
    order: 10,
  },
  {
    id: "obj-11-forensic",
    actId: "act-4-sealed-sanctum",
    title: "Authenticate & Recover Master Steatite Seal",
    description: "Perform 4-part forensic verification (intaglio relief, script header, suspension boss, vitrified glaze).",
    completed: false,
    order: 11,
  },
];

export function LostSeal3DAdventure({ onComplete, onExit }: LostSeal3DAdventureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ThreeAdventureEngine | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>("level-1-lost-city");
  const [currentAct, setCurrentAct] = useState<StoryActId>("act-1-discovery");
  const [isIntroActive, setIsIntroActive] = useState(false);
  const [introShotIndex, setIntroShotIndex] = useState(0);
  const [showActBanner, setShowActBanner] = useState(false);

  const [currentObjective, setCurrentObjective] = useState<string>(
    LEVEL_DETAILS["level-1-lost-city"].objective,
  );

  const [score, setScore] = useState<number>(0);
  const [clues, setClues] = useState<ArchaeologicalClue[]>([]);
  const [objectives, setObjectives] = useState<ExpeditionObjective[]>(INITIAL_OBJECTIVES);
  const [artifacts, setArtifacts] = useState<JournalArtifact[]>([]);
  const [documents, setDocuments] = useState<JournalDocument[]>([]);

  const [discoveryToast, setDiscoveryToast] = useState<{ title: string; icon: string; subtitle?: string } | null>(null);
  const [isMuted, setIsMuted] = useState(adventureAudio.getMuted());
  const [nearbyEntity, setNearbyEntity] = useState<InteractiveEntity3D | null>(null);
  const [qualityTier, setQualityTier] = useState<QualityTier>("ultra");

  // Touch controls state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Modals state
  const [inspectingEntity, setInspectingEntity] = useState<InteractiveEntity3D | null>(null);
  const [isWaterPuzzleOpen, setIsWaterPuzzleOpen] = useState(false);
  const [isMerchantPuzzleOpen, setIsMerchantPuzzleOpen] = useState(false);
  const [isSymbolPuzzleOpen, setIsSymbolPuzzleOpen] = useState(false);
  const [isFloorCacheOpen, setIsFloorCacheOpen] = useState(false);
  const [isSealForensicOpen, setIsSealForensicOpen] = useState(false);
  const [isCluePanelOpen, setIsCluePanelOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sanctumEvidence, setSanctumEvidence] = useState({ glyphs: false, totem: false });
  const [isFinaleActive, setIsFinaleActive] = useState(false);
  const [finaleShotIndex, setFinaleShotIndex] = useState(0);
  const [isSealRevealed, setIsSealRevealed] = useState(false);

  const maxScore = 800;
  const isAnyModalOpen =
    Boolean(inspectingEntity) ||
    isWaterPuzzleOpen ||
    isMerchantPuzzleOpen ||
    isSymbolPuzzleOpen ||
    isFloorCacheOpen ||
    isSealForensicOpen ||
    isCluePanelOpen;
  const sanctumEvidenceComplete = sanctumEvidence.glyphs && sanctumEvidence.totem;
  const altarBarrierUnlocked = objectives.some(
    (objective) => objective.id === "obj-10-keystone" && objective.completed,
  );
  const northGateUnlocked = objectives.some(
    (objective) => objective.id === "obj-5-north-gate" && objective.completed,
  );

  // Detect Touch screen
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  const completeObjective = useCallback((objId: string) => {
    setObjectives((prev) => {
      const target = prev.find((o) => o.id === objId);
      if (target && !target.completed) {
        setDiscoveryToast({
          title: `OBJECTIVE COMPLETE: ✓ ${target.title}`,
          icon: "✓",
          subtitle: "Expedition Dossier updated",
        });
        setTimeout(() => setDiscoveryToast(null), 3600);
      }
      return prev.map((o) => (o.id === objId ? { ...o, completed: true } : o));
    });
  }, []);

  // Stable callback refs to isolate ThreeAdventureEngine from React state rerenders
  const callbacksRef = useRef({
    onNearbyEntityChange: (entity: InteractiveEntity3D | null) => {},
    onInteract: (entity: InteractiveEntity3D) => {},
    onLevelChanged: (levelId: LevelId) => {},
  });

  const handleClueFound = useCallback((newClue: ArchaeologicalClue) => {
    setClues((prev) => {
      if (prev.some((c) => c.id === newClue.id)) return prev;
      adventureAudio.playDiscovery();
      setDiscoveryToast({
        title: `EVIDENCE LOGGED: ${newClue.title}`,
        icon: newClue.icon,
        subtitle: "+50 pts added to dossier",
      });
      setTimeout(() => setDiscoveryToast(null), 3800);
      return [...prev, newClue];
    });
    setScore((prev) => prev + 50);
  }, []);

  const handleInteract = useCallback(
    (entity: InteractiveEntity3D) => {
      if (entity.type === "sanctum_portal") {
        if (!altarBarrierUnlocked) {
          setDiscoveryToast({ title: "The altar barrier still blocks the vortex.", icon: "🔒" });
          setTimeout(() => setDiscoveryToast(null), 3000);
          return;
        }
        if (isFinaleActive || isSealRevealed) return;

        setIsFinaleActive(true);
        setFinaleShotIndex(0);
        setCurrentObjective("The sanctum vortex is responding… follow the seal's reveal.");
        engineRef.current?.startFinaleCinematic(
          (shotIndex) => setFinaleShotIndex(shotIndex),
          () => {
            setIsFinaleActive(false);
            setIsSealRevealed(true);
            engineRef.current?.setEntityEnabled("steatite_seal", true);
            engineRef.current?.triggerActivationPulse(0, 2.8, -12);
            setCurrentObjective("The Master Steatite Seal has materialized on the altar. Examine it.");
            setDiscoveryToast({ title: "The Master Seal has been revealed", icon: "✨" });
            setTimeout(() => setDiscoveryToast(null), 4200);
          },
        );
      } else if (entity.type === "passage_gate") {
        // Enforce progression: require clearance inspection
        if (!northGateUnlocked) {
          setDiscoveryToast({
            title: "North Gate Sealed: Inspect Magistrate Bulla Tag to authorize transit clearance first.",
            icon: "🔒",
          });
          setTimeout(() => setDiscoveryToast(null), 3500);
          return;
        }

        // Transition Level 1 to Level 2
        engineRef.current?.loadLevel("level-2-merchant-quarter");
        setCurrentLevelId("level-2-merchant-quarter");
        setCurrentAct("act-3-merchant-quarter");
        setCurrentObjective(LEVEL_DETAILS["level-2-merchant-quarter"].objective);
        setShowActBanner(true);
        adventureAudio.playDiscovery();
        setTimeout(() => setShowActBanner(false), 4500);
      } else if (entity.type === "water_puzzle") {
        setIsWaterPuzzleOpen(true);
      } else if (entity.type === "merchant_puzzle") {
        setIsMerchantPuzzleOpen(true);
      } else if (entity.type === "symbol_puzzle_gate") {
        setIsSymbolPuzzleOpen(true);
      } else if (entity.type === "underground_cache") {
        // The Keystone cannot be solved before both sanctuary readings are logged.
        if (!sanctumEvidenceComplete) {
          setDiscoveryToast({ title: "Study both sanctuary friezes before aligning the Keystone.", icon: "📜" });
          setTimeout(() => setDiscoveryToast(null), 3200);
          return;
        }
        setIsFloorCacheOpen(true);
      } else if (entity.type === "steatite_seal") {
        setIsSealForensicOpen(true);
      } else {
        setInspectingEntity(entity);
        engineRef.current?.markEntityInspected(entity.id);

        if (entity.objectiveAfterInspect) {
          setCurrentObjective(entity.objectiveAfterInspect);
        }

        // Advance to Act II on discovering the first clue in Level 1
        if (currentAct === "act-1-discovery") {
          setCurrentAct("act-2-lost-city");
        }

        // Grant historical clues, artifacts, and documents with authentic images
        if (currentLevelId === "level-3-sealed-sanctum" && entity.id === "tablet") {
          completeObjective("obj-9-sanctuary-friezes");
          setSanctumEvidence((prev) => ({ ...prev, glyphs: true }));
          handleClueFound({
            id: "clue-sanctum-glyphs",
            title: "Sanctuary Glyph Formula",
            category: "Iconography",
            icon: "🔣",
            image: "/images/artifacts/indus-seal-seven-figures-pipal.jpg",
            imageCaption: "East Sanctuary Inscription Frieze with Ritual Pageantry",
            shortSnippet: "The inscribed sequence identifies the Zebu as the altar's authority mark.",
            fullNote: "The east sanctuary inscription confirms the keystone responds only after the paired Zebu authority relief is studied.",
            discoveredInStage: 3,
          });
        } else if (currentLevelId === "level-3-sealed-sanctum" && entity.id === "crate") {
          completeObjective("obj-9-sanctuary-friezes");
          setSanctumEvidence((prev) => ({ ...prev, totem: true }));
          handleClueFound({
            id: "clue-zebu-totem",
            title: "Zebu Authority Totem",
            category: "Iconography",
            icon: "🐂",
            image: "/images/artifacts/indus-seal-zebu-bull.jpg",
            imageCaption: "West Wall Zebu Bull Sacred Relief (Bos Indicus)",
            shortSnippet: "The paired relief completes the keystone activation formula.",
            fullNote: "The west wall's Zebu relief supplies the authority mark needed to release the altar's bronze lattice.",
            discoveredInStage: 3,
          });
        } else if (entity.id === "camp_logbook" || entity.type === "marker") {
          completeObjective("obj-1-journal");
          setDocuments((prev) => {
            if (prev.some((d) => d.id === "doc-field-journal")) return prev;
            return [
              ...prev,
              {
                id: "doc-field-journal",
                title: "DK-G Archaeological Field Journal",
                docType: "Field Log",
                icon: "📖",
                image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
                imageCaption: "Excavation Stratigraphic Field Log (Trench DK-G)",
                excerpt: "Trench DK-G Stratum IV: Steatite Seal #DK-770 absent from votive altar niche. Evidence of deliberate subterranean concealment prior to city abandonment.",
                transcription: "Field notes by lead excavator establishing Mature Harappan occupation layers (2600–1900 BCE).",
                historicalContext: "Archaeological excavations at Mohenjo-daro uncovered evidence that elite administrative seals were carefully curated and hidden during periods of environmental crisis.",
                discoveredInStage: 1,
              },
            ];
          });
          handleClueFound({
            id: "clue-missing-seal",
            title: "Missing Seal Incident (Trench DK-G)",
            category: "Stratigraphy",
            icon: "📖",
            image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
            imageCaption: "Field Logbook Entry: Stratigraphic Anomaly",
            shortSnippet: "Field notes confirm the master seal was deliberately hidden in an undisturbed subterranean cache.",
            fullNote: "Trench DK-G stratigraphy proves the merchant cache was sealed under intact floor flagstones prior to abandonment.",
            discoveredInStage: 1,
          });
        } else if (entity.id === "trench_strata" || entity.type === "mound") {
          completeObjective("obj-2-strata");
          handleClueFound({
            id: "clue-strata",
            title: "Stratigraphic Context: Mature Harappan",
            category: "Stratigraphy",
            icon: "🏔️",
            image: "/artifacts/pottery.jpg",
            imageCaption: "Undisturbed Mature Harappan Stratigraphic Section",
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
            image: "/artifacts/pottery.jpg",
            imageCaption: "Harappan Red Ware Storage Amphora Fragment",
            shortSnippet: "Pottery storage jars were secured with stamped clay tags.",
            fullNote:
              "Harappan storage jars were plugged and sealed with square steatite stamp impressions.",
            discoveredInStage: 1,
          });
        } else if (entity.id === "seal_impression" || entity.type === "seal_impression") {
          completeObjective("obj-5-north-gate");
          setDiscoveryToast({
            title: "GATE UNLOCKED: The evidence has revealed the way forward.",
            icon: "🔓",
            subtitle: "North Gate clearance authorized",
          });
          setTimeout(() => setDiscoveryToast(null), 4000);

          setDocuments((prev) => {
            if (prev.some((d) => d.id === "doc-magistrate-bulla")) return prev;
            return [
              ...prev,
              {
                id: "doc-magistrate-bulla",
                title: "Gate Clearance Magistrate Bulla",
                docType: "Bulla Tag",
                icon: "🏷️",
                image: "/images/artifacts/indus-seal-unicorn-bovine.jpg",
                imageCaption: "Chief Magistrate Bulla Tag with Sacred Standard Seal Impression",
                excerpt: "North Gate Clearance: Consignment verified by Chief Magistrate. Free transit into Merchant Warehouse Quarter permitted.",
                transcription: "Clay sealing tag with reverse rope fiber imprint.",
                historicalContext: "Bullae tags were wrapped around parcel cords and stamped while wet to guarantee authenticity across trade networks.",
                discoveredInStage: 1,
              },
            ];
          });
          handleClueFound({
            id: "clue-bulla-clearance",
            title: "North Gate Clearance Bulla",
            category: "Trade",
            icon: "🏷️",
            image: "/images/artifacts/indus-seal-unicorn-bovine.jpg",
            imageCaption: "Gate Clearance Bulla with Intaglio Impression",
            shortSnippet: "Clay bulla confirms transit clearance into the Merchant Quarter.",
            fullNote: "The clay tag verifies that merchant consignments carrying the chief magistrate's seal were granted clearance into the northern warehouse quarter.",
            discoveredInStage: 1,
          });
        } else if (entity.type === "tablet") {
          completeObjective("obj-7-warehouse");
          setDocuments((prev) => {
            if (prev.some((d) => d.id === "doc-merchant-tablet")) return prev;
            return [
              ...prev,
              {
                id: "doc-merchant-tablet",
                title: "Merchant Guild Inscribed Account Tablet",
                docType: "Epigraphic Inscription",
                icon: "📜",
                image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
                imageCaption: "Epigraphic Inscribed Tablet with Maritime Tally Marks",
                excerpt: "Maritime Guild Tally: Lapis lazuli beads, carnelian ornaments, copper ingots — Stamped under Zebu emblem authority.",
                transcription: "Indus pictographic signs with numerical tally marks.",
                historicalContext: "Indus merchants maintained detailed administrative tablets recording maritime trade between Mohenjo-daro, Lothal, and Dilmun.",
                discoveredInStage: 2,
              },
            ];
          });
          handleClueFound({
            id: "clue-script",
            title: "Indus Script Directionality",
            category: "Epigraphy",
            icon: "📜",
            image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
            imageCaption: "Indus Epigraphic Inscription Directionality",
            shortSnippet: "Indus script reads Right-to-Left starting with sacred emblems.",
            fullNote:
              "Seal inscriptions read right-to-left, beginning with animal totems and ending with terminal signs.",
            discoveredInStage: 2,
          });
        } else if (entity.type === "crate") {
          completeObjective("obj-6-weights");
          setArtifacts((prev) => {
            if (prev.some((a) => a.id === "art-chert-weights")) return prev;
            return [
              ...prev,
              {
                id: "art-chert-weights",
                name: "Standardized Binary Chert Cubes",
                category: "Tool",
                icon: "⚖️",
                image: "/artifacts/blade.jpg",
                imageCaption: "Polished Cubic Chert Weights (Rohri Flint)",
                period: "Mature Harappan (2600–1900 BCE)",
                provenance: "Merchant Bazaar Metrology Counter",
                description: "Four finely polished cubical chert weights exhibiting standardized binary progression (1:2:4:8).",
                historicalSignificance: "Indus civilization maintained precise metrological uniformity across 1,500 kilometers of trade routes.",
                discoveredInStage: 2,
              },
            ];
          });
          handleClueFound({
            id: "clue-weights",
            title: "Standardized Binary Chert Weights",
            category: "Trade",
            icon: "⚖️",
            image: "/artifacts/blade.jpg",
            imageCaption: "Standardized Binary Chert Balance Weights",
            shortSnippet:
              "Standard binary weights (1, 2, 4, 8, 16) were used across the Indus trade network.",
            fullNote:
              "Harappan merchants used standardized cubic chert weights to govern taxation and precious metal commerce.",
            discoveredInStage: 2,
          });
        }
      }
    },
    [handleClueFound, currentAct, currentLevelId, completeObjective, altarBarrierUnlocked, northGateUnlocked, isFinaleActive, isSealRevealed, sanctumEvidenceComplete],
  );

  // Keep mutable callback ref up to date on every render
  callbacksRef.current = {
    onNearbyEntityChange: (ent) => setNearbyEntity(ent),
    onInteract: (ent) => handleInteract(ent),
    onLevelChanged: (lvl) => {
      setCurrentLevelId(lvl);
      setCurrentObjective(LEVEL_DETAILS[lvl].objective);
    },
  };

  // Initialize 3D Engine & Trigger Cinematic Intro
  useEffect(() => {
    if (!hasStarted || !canvasRef.current) return;

    const engine = new ThreeAdventureEngine(
      canvasRef.current,
      {
        onNearbyEntityChange: (ent) => callbacksRef.current.onNearbyEntityChange(ent),
        onInteract: (ent) => callbacksRef.current.onInteract(ent),
        onLevelChanged: (lvl) => callbacksRef.current.onLevelChanged(lvl),
      },
      qualityTier,
    );

    engineRef.current = engine;

    // Start Cinematic Intro Camera Flow
    setIsIntroActive(true);
    setIntroShotIndex(0);
    engine.startCinematicIntro(
      (shotIdx) => {
        setIntroShotIndex(shotIdx);
      },
      () => {
        setIsIntroActive(false);
        setShowActBanner(true);
        adventureAudio.playStoryReveal();
        setTimeout(() => setShowActBanner(false), 4500);
      },
    );

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [hasStarted]);

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

  // Solving Great Bath Water Flow Puzzle
  const handleWaterPuzzleSolved = (scoreEarned: number) => {
    setIsWaterPuzzleOpen(false);
    setScore((prev) => prev + scoreEarned);
    completeObjective("obj-3-bath-sluice");
    setArtifacts((prev) => {
      if (prev.some((a) => a.id === "art-steatite-key")) return prev;
      return [
        ...prev,
        {
          id: "art-steatite-key",
          name: "Carved Steatite Key Fragment",
          category: "Steatite",
          icon: "🗝️",
          image: "/artifacts/bead.jpg",
          imageCaption: "Carved Soapstone Alignment Key Fragment",
          period: "Mature Harappan (2600–1900 BCE)",
          provenance: "Great Bath Hydraulic Sump Basin",
          description: "A finely incised soapstone key token carved with geometric alignment indices.",
          historicalSignificance: "Proves sacred water rituals preceded entry into the inner administrative sanctum.",
          discoveredInStage: 1,
        },
      ];
    });
    handleClueFound({
      id: "clue-bath-hydraulics",
      title: "Great Bath Hydraulic Engineering",
      category: "Stratigraphy",
      icon: "🌊",
      image: "/artifacts/pottery.jpg",
      imageCaption: "Sub-Floor Gypsum Drainage Conduit",
      shortSnippet: "Sub-floor gypsum conduits allowed rapid draining and refilling of sacred water.",
      fullNote:
        "Operating the desilting and drainage conduits revealed an undisturbed votive compartment containing a carved steatite key fragment.",
      discoveredInStage: 1,
    });
    setCurrentObjective(
      "Sluice gates engaged! Synthesize trade records at the Northern Scribe Station.",
    );
  };

  // Solving Scribe Station Merchant Ledger Accounting Puzzle
  const handleMerchantPuzzleSolved = (scoreEarned: number) => {
    setIsMerchantPuzzleOpen(false);
    setScore((prev) => prev + scoreEarned);
    completeObjective("obj-4-merchant-ledger");
    setDocuments((prev) => {
      if (prev.some((d) => d.id === "doc-house-7-ledger")) return prev;
      return [
        ...prev,
        {
          id: "doc-house-7-ledger",
          title: "Merchant House 7 Trade Ledger",
          docType: "Trade Ledger",
          icon: "📜",
          image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
          imageCaption: "Merchant House 7 Trade Ledger Tablet",
          excerpt:
            "House 7 — Consignment of Badakhshan Lapis Lazuli & 16-Unit Chert Standard — Stamped by Grand Magistrate Zebu Bull Seal.",
          transcription:
            "Tally records verify the sovereign seal was transferred into Warehouse 7 before evacuation.",
          historicalContext:
            "Standardized accounting enabled equitable commerce between Indus cities and Mesopotamian ports.",
          discoveredInStage: 1,
        },
      ];
    });
    handleClueFound({
      id: "clue-merchant-house-7",
      title: "Merchant House 7 Consignment Ledger",
      category: "Trade",
      icon: "⚖️",
      image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
      imageCaption: "Merchant Guild Ledger Archive",
      shortSnippet: "Consignment records connect the Lost Seal to Merchant House 7 in the market quarter.",
      fullNote:
        "Deciphering the scribe ledger proves the sovereign Steatite Stamp Seal was utilized by Merchant House 7 to verify royal lapis lazuli shipments.",
      discoveredInStage: 1,
    });
    setCurrentObjective(
      "Merchant House 7 identified! Examine the North Gate Clay Bulla to confirm passage clearance.",
    );
  };

  // Solving Level 2 Symbol Puzzle opens the 3D gate and transitions to Level 3!
  const handleSymbolPuzzleSolved = (scoreEarned: number) => {
    setIsSymbolPuzzleOpen(false);
    setScore((prev) => prev + scoreEarned);
    completeObjective("obj-8-symbol-gate");
    engineRef.current?.openGate("symbol_puzzle_gate");
    setDiscoveryToast({
      title: "GATE UNLOCKED: The Carved Symbol Gate slides open!",
      icon: "🔓",
      subtitle: "Passage to Sealed Sanctum revealed",
    });
    setTimeout(() => setDiscoveryToast(null), 4000);

    handleClueFound({
      id: "clue-symbol-frieze",
      title: "Deciphered Administrative Formula",
      category: "Epigraphy",
      icon: "🔣",
      image: "/images/artifacts/harappan-molded-tablet-plaque.jpg",
      imageCaption: "Carved Indus Symbol Epigraphic Sequence",
      shortSnippet: "Manger → Zebu Bull → Fish Sign → Terminal Bow.",
      fullNote: "The solved epigraphic formula unlocked the gateway into the Sealed Sanctum.",
      discoveredInStage: 2,
    });

    setTimeout(() => {
      engineRef.current?.loadLevel("level-3-sealed-sanctum");
      setCurrentLevelId("level-3-sealed-sanctum");
      setCurrentAct("act-4-sealed-sanctum");
      setCurrentObjective(LEVEL_DETAILS["level-3-sealed-sanctum"].objective);
      setShowActBanner(true);
      setTimeout(() => setShowActBanner(false), 4500);
    }, 1200);
  };

  // Unlocking Level 3 Keystone disengages the sacred barrier!
  const handleKeystoneUnlocked = () => {
    setIsFloorCacheOpen(false);
    completeObjective("obj-9-sanctuary-friezes");
    completeObjective("obj-10-keystone");
    engineRef.current?.disengageAltarBarrier();
    setDiscoveryToast({
      title: "GATE UNLOCKED: The Altar Barrier has disengaged!",
      icon: "🔓",
      subtitle: "Climb the altar to approach the vortex",
    });
    setTimeout(() => setDiscoveryToast(null), 4000);

    setCurrentObjective(
      "The Altar Barrier is disengaged! Climb the altar and enter the awakened Sanctum Vortex.",
    );
    handleClueFound({
      id: "clue-keystone",
      title: "Sacred Altar Keystone Aligned",
      category: "Iconography",
      icon: "🗝️",
      image: "/images/artifacts/indus-confronting-bulls-seal.jpg",
      imageCaption: "Aligned Altar Keystone Mechanism",
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
    completeObjective("obj-11-forensic");
    engineRef.current?.markEntityInspected("steatite_seal");
    setArtifacts((prev) => {
      if (prev.some((a) => a.id === "art-master-seal")) return prev;
      return [
        ...prev,
        {
          id: "art-master-seal",
          name: "The Master Steatite Stamp Seal (DK-770)",
          category: "Steatite",
          icon: "👑",
          image: "/images/artifacts/indus-seal-zebu-bull.jpg",
          imageCaption: "The Master Steatite Stamp Seal of Mohenjo-daro (DK-770)",
          period: "Mature Harappan (2600–1900 BCE)",
          provenance: "Mohenjo-daro Sealed Sanctum Altar",
          description: "Vitrified white steatite stamp seal featuring a majestic humped Zebu bull and 5-sign Indus inscription.",
          historicalSignificance: "The supreme civic artifact of Mohenjo-daro, 100% authenticated through forensic analysis.",
          discoveredInStage: 3,
        },
      ];
    });
    setIsSealForensicOpen(false);
    setIsFinished(true);
    adventureAudio.playVictory();
    onComplete(finalScore, maxScore);
  };

  const handleRestart = () => {
    setScore(0);
    setClues([]);
    setIsFinished(false);
    setObjectives(INITIAL_OBJECTIVES);
    setArtifacts([]);
    setDocuments([]);
    setSanctumEvidence({ glyphs: false, totem: false });
    setIsFinaleActive(false);
    setIsSealRevealed(false);
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
      <div
        className="relative min-h-[600px] w-full overflow-hidden rounded-2xl flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0a0614 0%, #0e1a2a 45%, #160a04 100%)" }}
      >
        {/* Decorative ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #00cccc 0%, transparent 70%)", filter: "blur(48px)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8"
            style={{ background: "radial-gradient(circle, #ff8833 0%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center max-w-2xl w-full">
          {/* Badge */}
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] mb-6"
            style={{ color: "#00cccc" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>NAVYUVA Heritage · 3D Adventure</span>
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Main Title */}
          <div className="mb-2">
            <h1
              className="font-serif font-black tracking-[0.15em] uppercase"
              style={{
                fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                lineHeight: 1.0,
                background: "linear-gradient(135deg, #ffeecc 0%, #ffaa44 40%, #ff7722 70%, #dd4400 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 32px rgba(255, 120, 30, 0.5))",
              }}
            >
              THE LOST
            </h1>
            <h1
              className="font-serif font-black tracking-[0.35em] uppercase"
              style={{
                fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                lineHeight: 1.0,
                background: "linear-gradient(135deg, #88ffff 0%, #00dddd 50%, #0099bb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 28px rgba(0, 200, 200, 0.6))",
              }}
            >
              SEAL
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="mt-3 text-sm font-medium tracking-[0.15em] uppercase opacity-60"
            style={{ color: "#c8a878" }}
          >
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
              <div
                key={key}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <kbd
                  className="rounded px-1.5 py-0.5 text-xs font-bold font-mono"
                  style={{ background: "rgba(0,200,200,0.15)", color: "#00dddd", border: "1px solid rgba(0,200,200,0.3)" }}
                >
                  {key}
                </kbd>
                <span style={{ color: "#a0957a" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Quality selector */}
          <div
            className="mt-6 w-full max-w-sm rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-3.5 w-3.5" style={{ color: "#00cccc" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8aabb0" }}>
                Graphics Quality
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["ultra", "high", "mobile-high", "mobile"] as QualityTier[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQualityTier(q)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold transition-all"
                  style={
                    qualityTier === q
                      ? { background: "rgba(0,200,200,0.2)", color: "#00dddd", border: "1px solid rgba(0,200,200,0.5)", boxShadow: "0 0 12px rgba(0,200,200,0.2)" }
                      : { background: "rgba(255,255,255,0.03)", color: "#7a8a90", border: "1px solid rgba(255,255,255,0.07)" }
                  }
                >
                  {q === "ultra" ? "⚡ Ultra (RTX)" : q === "high" ? "✨ High" : q === "mobile-high" ? "📱 Mobile Hi" : "🌿 Eco"}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex w-full flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "#7a8a90", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => setHasStarted(true)}
              className="w-full sm:flex-1 flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold font-serif uppercase tracking-widest transition-all"
              style={{
                background: "linear-gradient(135deg, #cc5500 0%, #ff7722 50%, #ffaa44 100%)",
                color: "#fff8ee",
                boxShadow: "0 0 40px rgba(255, 110, 30, 0.35), 0 4px 24px rgba(0,0,0,0.5)",
                letterSpacing: "0.18em",
              }}
            >
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
              <span>Dossier ({clues.length})</span>
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
          className="w-full h-[540px] sm:h-[660px] block cursor-grab active:cursor-grabbing focus:outline-none"
        />

        {/* Clear Mission Objectives HUD Overlay (Collapsible & Persistent in Upper-Right) */}
        {!isIntroActive && !isFinaleActive && (
          <div className="absolute top-4 right-4 z-20">
            <ObjectiveHUD
              currentLevelId={currentLevelId}
              currentActId={currentAct}
              objectives={objectives}
              currentDirective={currentObjective}
              onOpenClues={() => setIsCluePanelOpen(true)}
            />
          </div>
        )}

        {/* Cinematic Intro Overlay */}
        {isIntroActive && (
          <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 pointer-events-none bg-black/40 backdrop-blur-[1px] transition-all duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-xl bg-black/85 px-3.5 py-1.5 border border-primary/40 text-[11px] uppercase tracking-widest text-primary font-bold shadow-2xl backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>NAVYUVA HERITAGE • 3D EXPEDITION</span>
              </div>
              <button
                type="button"
                onClick={() => engineRef.current?.skipCinematicIntro()}
                className="pointer-events-auto flex items-center gap-2 rounded-xl bg-black/85 hover:bg-black px-4 py-2 border border-primary/40 text-xs font-semibold text-foreground hover:text-primary transition-all shadow-2xl backdrop-blur-md cursor-pointer"
              >
                <span>Skip Intro (Space / Esc)</span>
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </button>
            </div>

            <div className="mx-auto max-w-2xl text-center space-y-3 transition-all duration-500">
              <div className="inline-block rounded-full bg-primary/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-primary border border-primary/50 shadow-lg">
                {INTRO_SHOT_TEXTS[introShotIndex]?.tagline}
              </div>
              <h2
                className="font-serif text-3xl sm:text-5xl font-black tracking-wider uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #ffcc88 50%, #ff9933 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {INTRO_SHOT_TEXTS[introShotIndex]?.title}
              </h2>
              <p className="text-xs sm:text-base font-medium tracking-wide text-[#f0dfc8] max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {INTRO_SHOT_TEXTS[introShotIndex]?.subtitle}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                {INTRO_SHOT_TEXTS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      introShotIndex === idx
                        ? "w-10 bg-primary shadow-[0_0_12px_#00ffff]"
                        : "w-2 bg-white/25"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Cinematic Prologue • Mohenjo-daro
              </span>
            </div>
          </div>
        )}

        {/* Level 3 finale sequence */}
        {isFinaleActive && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-end justify-center bg-gradient-to-t from-black/75 via-transparent to-black/30 px-6 pb-12 text-center">
            <div className="max-w-xl animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.34em] text-cyan-200">
                Sanctum Resonance • Sequence {finaleShotIndex + 1}/3
              </div>
              <h2 className="font-serif text-3xl font-black uppercase tracking-wide text-[#fff0c9] drop-shadow-[0_0_20px_rgba(0,229,255,0.7)] sm:text-5xl">
                {finaleShotIndex === 0
                  ? "The Vortex Awakens"
                  : finaleShotIndex === 1
                    ? "A Seal Returns to Light"
                    : "The Lost Seal Revealed"}
              </h2>
              <p className="mt-3 text-xs tracking-wide text-[#d8f8ff] sm:text-sm">
                {finaleShotIndex === 0
                  ? "The aligned keystone releases the altar's ancient harmonic lock."
                  : finaleShotIndex === 1
                    ? "Four millennia of dust lift as the sanctum answers its forgotten authority."
                    : "The Master Steatite Stamp Seal materializes above the altar for authentication."}
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/55">Press Space, Enter, or Escape to skip</p>
            </div>
          </div>
        )}

        {/* Act Banner Notification */}
        {showActBanner && !isIntroActive && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-500 animate-bounce">
            <div className="flex items-center gap-3.5 rounded-2xl border-2 border-primary/70 bg-black/90 px-6 py-3 shadow-[0_0_30px_rgba(0,200,200,0.3)] backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/60 font-bold font-serif text-xs shadow-inner">
                {STORY_ACTS[currentAct]?.actNumber}
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  {STORY_ACTS[currentAct]?.title}
                </div>
                <div className="text-xs text-[#f5ebd9] font-serif">
                  {STORY_ACTS[currentAct]?.subtitle}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* In-World Proximity [E] Interaction Prompt & Museum Floating Card */}
        {nearbyEntity && !isAnyModalOpen && !isIntroActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-28 pointer-events-none z-20 animate-bounce">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-primary/80 bg-stone-950/95 px-5 py-3 text-xs font-bold text-foreground shadow-[0_0_35px_rgba(0,229,255,0.45)] backdrop-blur-md min-w-[220px]">
              <div className="flex items-center gap-2 border-b border-border/40 pb-1.5 w-full justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold">
                  ARCHAEOLOGICAL ARTIFACT
                </span>
                <span className="text-[9px] font-mono text-stone-400">
                  {nearbyEntity.zone}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full pt-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-black font-mono text-sm font-black shadow-md shrink-0">
                  E
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-serif text-sm font-bold text-foreground leading-tight">
                    {nearbyEntity.name}
                  </span>
                  <span className="text-[10px] text-amber-300 font-sans font-medium">
                    [E] {nearbyEntity.promptLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Objective & Discovery Toast */}
        {discoveryToast && !isIntroActive && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center gap-3 rounded-2xl border border-primary/70 bg-stone-950/95 px-5 py-2.5 text-xs text-foreground shadow-2xl shadow-black backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
                {discoveryToast.icon}
              </span>
              <div>
                <div className="text-gold font-serif font-bold text-[12px]">
                  {discoveryToast.title}
                </div>
                {discoveryToast.subtitle && (
                  <div className="text-[10px] text-stone-400 font-mono">
                    {discoveryToast.subtitle}
                  </div>
                )}
              </div>
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

      <WaterFlowPuzzleModal
        isOpen={isWaterPuzzleOpen}
        onClose={() => setIsWaterPuzzleOpen(false)}
        onPuzzleSolved={handleWaterPuzzleSolved}
      />

      <MerchantAccountingModal
        isOpen={isMerchantPuzzleOpen}
        onClose={() => setIsMerchantPuzzleOpen(false)}
        onPuzzleSolved={handleMerchantPuzzleSolved}
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

      <CluePanel
        isOpen={isCluePanelOpen}
        onClose={() => setIsCluePanelOpen(false)}
        currentActId={currentAct}
        objectives={objectives}
        clues={clues}
        artifacts={artifacts}
        documents={documents}
        score={score}
        maxScore={maxScore}
      />
    </div>
  );
}
