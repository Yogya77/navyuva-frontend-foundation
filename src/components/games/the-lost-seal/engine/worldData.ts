import type { Rect, InteractiveEntity, TorchLight } from "./types";

export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1400;

// Solid collision barriers (walls, pillars, solid objects)
export const COLLISION_WALLS: Rect[] = [
  // Outer World Boundaries (Top & Bottom borders)
  { x: 0, y: 0, w: WORLD_WIDTH, h: 320 },
  { x: 0, y: 1080, w: WORLD_WIDTH, h: 320 },
  { x: 0, y: 0, w: 80, h: WORLD_HEIGHT },
  { x: 2320, y: 0, w: 80, h: WORLD_HEIGHT },

  // Area 1 -> Area 2 Partition Wall (with entrance doorway at Y: 640-760)
  { x: 440, y: 320, w: 40, h: 320 },
  { x: 440, y: 760, w: 40, h: 320 },

  // Area 2 (Excavation Courtyard) Interior Trenches & Wall Remnants
  { x: 620, y: 460, w: 160, h: 30 },
  { x: 780, y: 460, w: 30, h: 140 },
  { x: 600, y: 880, w: 220, h: 30 },

  // Area 2 -> Area 3 Partition Wall (with arched portal at Y: 640-760)
  { x: 940, y: 320, w: 40, h: 320 },
  { x: 940, y: 760, w: 40, h: 320 },

  // Area 3 (Symbol Hall) Colonnade Pillars
  { x: 1100, y: 520, w: 40, h: 40 },
  { x: 1100, y: 840, w: 40, h: 40 },
  { x: 1260, y: 520, w: 40, h: 40 },
  { x: 1260, y: 840, w: 40, h: 40 },

  // Area 3 -> Area 4 Partition Wall (Symbol Gate Gateway at Y: 640-760)
  { x: 1440, y: 320, w: 40, h: 320 },
  { x: 1440, y: 760, w: 40, h: 320 },

  // Area 4 (Merchant Storage) Shelves & Partition Counters
  { x: 1600, y: 460, w: 180, h: 40 },
  { x: 1600, y: 900, w: 180, h: 40 },

  // Area 4 -> Area 5 Partition Wall (Secret Sanctum Doorway at Y: 640-760)
  { x: 1940, y: 320, w: 40, h: 320 },
  { x: 1940, y: 760, w: 40, h: 320 },

  // Area 5 (Sealed Sanctum) Altar Barrier
  { x: 2160, y: 620, w: 80, h: 20 },
  { x: 2160, y: 760, w: 80, h: 20 },
];

// Interactive In-World Entities (Objects player can physically walk up to and press E)
export const INITIAL_INTERACTIVE_ENTITIES: InteractiveEntity[] = [
  // Area 1: Entrance
  {
    id: "survey_marker",
    type: "marker",
    name: "Archaeological Grid Marker DK-G",
    x: 280,
    y: 600,
    width: 48,
    height: 48,
    icon: "📍",
    promptLabel: "Examine Survey Datum",
    zone: "Ancient Entrance Gate",
    isInspected: false,
  },

  // Area 2: Excavation Courtyard
  {
    id: "mound",
    type: "mound",
    name: "Stratified Silt Mound",
    x: 580,
    y: 540,
    width: 64,
    height: 64,
    icon: "🏔️",
    promptLabel: "Examine Stratigraphy Trench",
    zone: "Excavation Courtyard",
    isInspected: false,
  },
  {
    id: "pottery_sherd",
    type: "pottery",
    name: "Red Ware Pottery Sherds",
    x: 720,
    y: 680,
    width: 52,
    height: 52,
    icon: "🏺",
    promptLabel: "Inspect Painted Ceramics",
    zone: "Excavation Courtyard",
    isInspected: false,
  },
  {
    id: "carved_tablet",
    type: "tablet",
    name: "Carved Soapstone Testing Slab",
    x: 820,
    y: 520,
    width: 52,
    height: 52,
    icon: "📜",
    promptLabel: "Study Inscribed Slab Fragment",
    zone: "Excavation Courtyard",
    isInspected: false,
  },
  {
    id: "tool_crate",
    type: "crate",
    name: "Field Expedition Crate",
    x: 680,
    y: 960,
    width: 56,
    height: 56,
    icon: "📦",
    promptLabel: "Open Equipment Box",
    zone: "Excavation Courtyard",
    isInspected: false,
  },

  // Area 3: Symbol Hall
  {
    id: "symbol_gate",
    type: "symbol_gate",
    name: "Carved Indus Symbol Gate",
    x: 1440,
    y: 700,
    width: 64,
    height: 96,
    icon: "🔣",
    promptLabel: "Examine Inscribed Mechanism",
    zone: "Symbol Hall",
    isInspected: false,
  },

  // Area 4: Merchant Storage
  {
    id: "storage_jars",
    type: "storage_jars",
    name: "Amphorae Storage Jars",
    x: 1680,
    y: 560,
    width: 60,
    height: 60,
    icon: "🏺",
    promptLabel: "Search Storage Vessels",
    zone: "Merchant Storage",
    isInspected: false,
  },
  {
    id: "textile_bales",
    type: "textile_bales",
    name: "Carbonized Export Textile Bales",
    x: 1820,
    y: 560,
    width: 60,
    height: 60,
    icon: "🧵",
    promptLabel: "Inspect Clay Sealings (Bullae)",
    zone: "Merchant Storage",
    isInspected: false,
  },
  {
    id: "wall_shrine",
    type: "wall_shrine",
    name: "Zebu Guild Shrine",
    x: 1680,
    y: 840,
    width: 56,
    height: 56,
    icon: "🐂",
    promptLabel: "Inspect Guild Altar Niche",
    zone: "Merchant Storage",
    isInspected: false,
  },
  {
    id: "floor_cache",
    type: "floor_cache",
    name: "Mortared Floor Flagstone Cache",
    x: 1840,
    y: 840,
    width: 64,
    height: 64,
    icon: "🔷",
    promptLabel: "Investigate Sub-Floor Flagstone",
    zone: "Merchant Storage",
    isInspected: false,
  },

  // Area 5: Sealed Chamber (Final Target)
  {
    id: "steatite_seal",
    type: "steatite_seal",
    name: "The Lost Steatite Seal",
    x: 2200,
    y: 700,
    width: 64,
    height: 64,
    icon: "🔷",
    promptLabel: "Recover Steatite Seal",
    zone: "Sealed Chamber",
    isInspected: false,
  },
];

// Ambient flickering torchlights placed in corridors and vaults
export const WORLD_TORCHES: TorchLight[] = [
  { x: 440, y: 600, radius: 160, color: "#d97706", flicker: 1 },
  { x: 440, y: 800, radius: 160, color: "#d97706", flicker: 1 },
  { x: 940, y: 600, radius: 180, color: "#f59e0b", flicker: 1 },
  { x: 940, y: 800, radius: 180, color: "#f59e0b", flicker: 1 },
  { x: 1100, y: 480, radius: 190, color: "#f59e0b", flicker: 1 },
  { x: 1260, y: 480, radius: 190, color: "#f59e0b", flicker: 1 },
  { x: 1440, y: 600, radius: 210, color: "#fbbf24", flicker: 1 },
  { x: 1440, y: 800, radius: 210, color: "#fbbf24", flicker: 1 },
  { x: 1680, y: 420, radius: 170, color: "#d97706", flicker: 1 },
  { x: 1840, y: 420, radius: 170, color: "#d97706", flicker: 1 },
  { x: 1940, y: 600, radius: 200, color: "#f59e0b", flicker: 1 },
  { x: 1940, y: 800, radius: 200, color: "#f59e0b", flicker: 1 },
  { x: 2100, y: 540, radius: 220, color: "#f59e0b", flicker: 1 },
  { x: 2100, y: 860, radius: 220, color: "#f59e0b", flicker: 1 },
  { x: 2200, y: 700, radius: 260, color: "#fbbf24", flicker: 1 }, // Seal Spotlight
];
