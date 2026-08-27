export interface ArchaeologicalClue {
  id: string;
  title: string;
  category: "Stratigraphy" | "Epigraphy" | "Iconography" | "Trade";
  icon: string;
  shortSnippet: string;
  fullNote: string;
  discoveredInStage: number;
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
