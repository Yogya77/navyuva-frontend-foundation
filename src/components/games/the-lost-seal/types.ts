export interface ArchaeologicalClue {
  id: string;
  title: string;
  category: "Stratigraphy" | "Epigraphy" | "Iconography" | "Trade";
  icon: string;
  shortSnippet: string;
  fullNote: string;
  discoveredInStage: number;
}

export interface JournalArtifact {
  id: string;
  name: string;
  category: "Ceramic" | "Steatite" | "Metal" | "Tool" | "Glyptic";
  icon: string;
  period: string;
  provenance: string;
  description: string;
  historicalSignificance: string;
  discoveredInStage: number;
}

export interface JournalDocument {
  id: string;
  title: string;
  docType: "Field Log" | "Trade Ledger" | "Epigraphic Inscription" | "Bulla Tag";
  icon: string;
  excerpt: string;
  transcription: string;
  historicalContext: string;
  discoveredInStage: number;
}

export interface ExpeditionObjective {
  id: string;
  actId: "act-1-discovery" | "act-2-lost-city" | "act-3-merchant-quarter" | "act-4-sealed-sanctum";
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface ExpeditionStats {
  cluesCount: number;
  totalClues: number;
  artifactsCount: number;
  totalArtifacts: number;
  documentsCount: number;
  totalDocuments: number;
  puzzlesSolved: number;
  totalPuzzles: number;
}

export interface ExcavationObject {
  id: string;
  name: string;
  category: string;
  icon: string;
  position: {
    top: string;
    left: string;
    zIndex: number;
    depthScale: number;
  };
  visualHint: string;
  description: string;
  archaeologicalAnalysis: string;
  clue?: ArchaeologicalClue | undefined;
  isInspected: boolean;
}

export interface SymbolPuzzleTile {
  id: string;
  glyph: string;
  label: string;
  epigraphicMeaning: string;
  isCorrectInSequence?: boolean | undefined;
}

export interface SealedChamberLocation {
  id: string;
  name: string;
  icon: string;
  subtext: string;
  description: string;
  archaeologicalFinding: string;
  isCorrectCompartment: boolean;
  whyWrongOrRight: string;
  position: {
    top: string;
    left: string;
  };
}

export interface SealInspectionArea {
  id: string;
  title: string;
  focusRegion: string;
  observation: string;
  historicalMeaning: string;
  verified: boolean;
}

