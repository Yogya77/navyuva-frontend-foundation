/**
 * Mock museum data for the NAVYUVA prototype.
 * Frontend-only — no backend, no persistence.
 */

export interface Civilization {
  id: string;
  name: string;
  period: string;
  locked: boolean;
}

export interface ArtifactInsight {
  label: string;
  text: string;
}

export interface Artifact {
  id: string;
  name: string;
  emoji: string;
  short: string;
  locked: boolean;
  type?: string;
  period?: string;
  material?: string;
  site?: string;
  description?: string;
  insights?: ArtifactInsight[];
}

export const civilizations: Civilization[] = [
  { id: "indus", name: "Indus Valley (Harappan)", period: "2600–1900 BCE", locked: false },
  { id: "vedic", name: "Early Vedic Period", period: "1500–1000 BCE", locked: true },
  { id: "mahajanapadas", name: "Mahajanapadas", period: "600–300 BCE", locked: true },
  { id: "maurya", name: "Maurya Empire", period: "322–185 BCE", locked: true },
  { id: "gupta", name: "Gupta Empire", period: "320–550 CE", locked: true },
  { id: "medieval", name: "Medieval Period", period: "1200–1750 CE", locked: true },
];

export const artifacts: Artifact[] = [
  {
    id: "pottery",
    name: "Terracotta Pottery",
    emoji: "🏺",
    short: "Red ware bowl with painted geometric bands.",
    locked: false,
    type: "Red Ware Bowl",
    period: "Mature Harappan (2600–1900 BCE)",
    material: "Terracotta",
    site: "Harappa",
    description:
      "A red ware bowl with black painted geometric designs, representing pottery traditions of the Harappan period.",
    insights: [
      {
        label: "Craftsmanship",
        text: "Even walls and uniform firing point to wheel-thrown production in specialised kilns.",
      },
      {
        label: "Daily life",
        text: "Bowls of this size were used for serving grain and pulses in ordinary households.",
      },
      {
        label: "Artistic expression",
        text: "Repeated geometric bands show a shared decorative vocabulary across Harappan cities.",
      },
    ],
  },
  {
    id: "seal",
    name: "Steatite Seal",
    emoji: "🔷",
    short: "Carved seal bearing an animal motif and undeciphered script.",
    locked: false,
    type: "Square Stamp Seal",
    period: "Mature Harappan (2600–1900 BCE)",
    material: "Steatite",
    site: "Mohenjo-daro",
    description:
      "A finely carved square seal showing a humped bull beneath a line of Indus script, likely used to mark traded goods.",
    insights: [
      {
        label: "Craftsmanship",
        text: "Micro-carving in soft steatite, then heat-hardened — a demanding, specialised skill.",
      },
      {
        label: "Daily life",
        text: "Seal impressions on clay tags suggest organised trade and ownership marking.",
      },
      {
        label: "Artistic expression",
        text: "Animal motifs were rendered with careful anatomical observation.",
      },
    ],
  },
  {
    id: "bead",
    name: "Carnelian Bead",
    emoji: "🟠",
    short: "Long barrel bead of etched carnelian.",
    locked: false,
    type: "Etched Barrel Bead",
    period: "Mature Harappan (2600–1900 BCE)",
    material: "Carnelian",
    site: "Chanhudaro",
    description:
      "A long carnelian bead with white etched patterns, a prestige ornament traded as far as Mesopotamia.",
    insights: [
      {
        label: "Craftsmanship",
        text: "Drilling a bead this long required tapered stone drills and days of patient work.",
      },
      { label: "Daily life", text: "Worn as necklaces, marking status within urban society." },
      {
        label: "Artistic expression",
        text: "Alkali etching created deliberate light-on-dark contrast patterns.",
      },
    ],
  },
  {
    id: "blade",
    name: "Chert Blade",
    emoji: "🔪",
    short: "Long parallel-sided blade struck from a prepared core.",
    locked: false,
    type: "Prismatic Blade",
    period: "Mature Harappan (2600–1900 BCE)",
    material: "Rohri chert",
    site: "Mohenjo-daro",
    description:
      "A sharp parallel-sided blade detached from a prepared core, used for cutting, scraping and craft work.",
    insights: [
      {
        label: "Craftsmanship",
        text: "Consistent blade widths imply standardised knapping technique.",
      },
      { label: "Daily life", text: "Everyday cutting tool for food, leather and fibre processing." },
      {
        label: "Artistic expression",
        text: "Blades helped shape shell inlay and bone ornaments found nearby.",
      },
    ],
  },
  {
    id: "weight",
    name: "Stone Weight",
    emoji: "⚖️",
    short: "Cubical weight from a standardised measurement system.",
    locked: true,
  },
  {
    id: "copper",
    name: "Copper Object",
    emoji: "🪙",
    short: "Cast copper implement from a metalworking quarter.",
    locked: true,
  },
];

export const LOCKED_ARTIFACT_MESSAGE =
  "Locked — complete the required game levels to unlock this artifact.";

export const LOCKED_CIVILIZATION_MESSAGE =
  "Complete the required game levels to unlock this period.";

export const museumProgress = {
  artifactsUnlocked: 0,
  artifactsTotal: 20,
  cluesCollected: 0,
  cluesTotal: 15,
};
