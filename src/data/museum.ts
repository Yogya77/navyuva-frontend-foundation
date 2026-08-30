/**
 * Curated archaeological museum data for the NAVYUVA platform.
 * Authentic historical artifacts from the Indus Valley / Harappan Civilization.
 */

export interface Civilization {
  id: string;
  name: string;
  period: string;
  locked: boolean;
  region?: string;
  highlights?: string[];
  bannerDescription?: string;
}

export interface ArtifactInsight {
  label: string;
  text: string;
}

export interface Artifact {
  id: string;
  name: string;
  category: "Seals & Epigraphy" | "Terracotta & Sculpture" | "Ornaments & Metallurgy" | "Inscriptions & Plaques" | "Tools & Everyday Life";
  image: string;
  emoji: string;
  short: string;
  locked: boolean;
  type: string;
  period: string;
  material: string;
  site: string;
  significance: string;
  description: string;
  dimensions?: string;
  discoveryContext?: string;
  tags?: string[];
  insights: ArtifactInsight[];
  featured?: boolean;
}

export const civilizations: Civilization[] = [
  {
    id: "indus",
    name: "Indus Valley (Harappan)",
    period: "2600–1900 BCE",
    locked: false,
    region: "Indus River Basin & Ghaggar-Hakra Plain",
    highlights: ["Grid Urban Planning", "Steatite Stamp Seals", "Advanced Hydraulic Engineering", "Standardized Metrology"],
    bannerDescription: "One of the world's earliest urban civilizations, renowned for planned brick cities, standardized weights, sophisticated sanitary drain systems, and an enigmatic undeciphered script.",
  },
  { id: "vedic", name: "Early Vedic Period", period: "1500–1000 BCE", locked: false },
  { id: "mahajanapadas", name: "Mahajanapadas", period: "600–300 BCE", locked: false },
  { id: "maurya", name: "Maurya Empire", period: "322–185 BCE", locked: false },
  { id: "gupta", name: "Gupta Empire", period: "320–550 CE", locked: false },
  { id: "medieval", name: "Medieval Period", period: "1200–1750 CE", locked: false },
];

export const artifacts: Artifact[] = [
  {
    id: "seal",
    name: "The Great Zebu Bull Stamp Seal",
    category: "Seals & Epigraphy",
    image: "/images/artifacts/indus-seal-zebu-bull.jpg",
    emoji: "🐂",
    short: "Carved steatite masterwork depicting a majestic humped zebu bull with an undeciphered Indus script inscription.",
    locked: false,
    featured: true,
    type: "Square Intaglio Stamp Seal",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Vitrified White Steatite (Soapstone)",
    site: "Mohenjo-daro (Citadel Mound)",
    dimensions: "3.8 × 3.8 × 1.2 cm",
    discoveryContext: "Discovered in the upper administrative citadel quarter of Mohenjo-daro.",
    significance: "Regarded as one of the finest surviving examples of Harappan glyptic art. The high-relief carving demonstrates exceptional anatomical precision, portraying the animal's dewlap folds, crescent horns, and muscular hump beneath five distinct Indus script signs.",
    description:
      "This iconic square stamp seal was carved from soft talc/steatite stone, coated with an alkali glaze, and heat-fired to create a hard, lustrous white surface. The reverse features a perforated boss knob for wearing on a cord. In ancient trade, such seals were pressed into damp clay bullae to authenticate bales of cotton, timber, grain, and precious lapis lazuli shipped across the Arabian Sea to Oman and Mesopotamia.",
    tags: ["Steatite", "Zebu Bull", "Intaglio", "Trade", "Indus Script", "Mohenjo-daro"],
    insights: [
      {
        label: "Master Glyptic Skill",
        text: "The artisan used micro-chisels and drills to carve the inverted relief into soft stone before vitrification firing above 1000°C.",
      },
      {
        label: "Commercial & Civic Identity",
        text: "Clay impressions found attached to shipping jars prove seals acted as official trademarks of merchant guilds and civic authorities.",
      },
      {
        label: "Undeciphered Epigraphy",
        text: "The top row contains 5 distinct Indus script signs reading right-to-left. Because the script remains undeciphered, the exact name or title is unknown.",
      },
    ],
  },
  {
    id: "seal-unicorn",
    name: "Unicorn & Sacred Standard Stamp Seal",
    category: "Seals & Epigraphy",
    image: "/images/artifacts/indus-seal-unicorn-bovine.jpg",
    emoji: "🦄",
    short: "Finely engraved seal depicting the mythical single-horned bovine facing a ceremonial ritual standard.",
    locked: false,
    featured: true,
    type: "Square Stamp Seal with Boss",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Glazed Steatite",
    site: "Harappa (Mound AB)",
    dimensions: "3.2 × 3.2 × 0.9 cm",
    discoveryContext: "Excavated from residential and workshop deposits near the northern gateway of Harappa.",
    significance: "The single-horned creature (conventionally termed the 'unicorn') represents over 60% of all recovered Indus seal motifs, indicating it served as the dominant heraldic insignia of the urban administrative elite.",
    description:
      "This exquisitely preserved steatite seal depicts the classic Indus 'unicorn' with its long forward-swept horn, decorative harness collar, and striped chest saddle. In front of the beast stands a two-tiered ceremonial apparatus, often interpreted as an incense burner, offering stand, or sacred ritual standard. Above the creature is a crisp inscription of six Indus script characters.",
    tags: ["Unicorn", "Heraldry", "Ritual Standard", "Steatite", "Harappa"],
    insights: [
      {
        label: "Heraldic Dominance",
        text: "Found across every major Harappan settlement from Lothal in Gujarat to Shortugai in Afghanistan, pointing to a unified civic system.",
      },
      {
        label: "Ceremonial Standard",
        text: "The two-tiered vessel below the horn is depicted on processional tablets, suggesting it was carried in civic or religious ceremonies.",
      },
      {
        label: "Micro-Precision",
        text: "Despite measuring barely over 3 cm square, the muscle tension and decorative banding remain razor-sharp after four millennia.",
      },
    ],
  },
  {
    id: "seal-seven-figures",
    name: "Sacred Pipal Tree Deity & Seven Attendants Seal",
    category: "Seals & Epigraphy",
    image: "/images/artifacts/indus-seal-seven-figures-pipal.jpg",
    emoji: "🌿",
    short: "Complex narrative ritual seal portraying a horned tree deity, kneeling devotee with markhor, and seven processional celebrants.",
    locked: false,
    featured: true,
    type: "Narrative Ritual Seal",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Carved Steatite",
    site: "Mohenjo-daro (DK-G Area)",
    dimensions: "4.1 × 4.1 × 1.3 cm",
    discoveryContext: "Found within a monumental room block near the central thoroughfare of Mohenjo-daro.",
    significance: "One of the most elaborate narrative scenes in all of ancient Harappan archaeology. It provides rare visual evidence of sacred botanical veneration (the sacred Pipal / Ficus religiosa) and organized ritual pageantry in the 3rd millennium BCE.",
    description:
      "The upper register depicts a horned deity standing framed inside a bifurcated sacred Pipal tree branch. Before the tree, a kneeling figure presents an offering, with a giant markhor goat standing behind. Below, seven figures with plumed headpieces and long tunics walk in unified procession. A colossal human-headed composite bovine watches from the upper right, crowned with stylized Indus glyphs.",
    tags: ["Pipal Tree", "Ritual Pageantry", "Seven Figures", "Deity", "Sacred Narrative"],
    insights: [
      {
        label: "Botanical Veneration",
        text: "The heart-shaped leaves identify the sacred Pipal tree, an emblem of vitality and spiritual reverence enduring in South Asian tradition.",
      },
      {
        label: "Processional Hierarchy",
        text: "The seven plumed figures march in rhythmic synchrony, reflecting formalized civic choreography during seasonal or astrological festivals.",
      },
      {
        label: "Multi-Figure Composition",
        text: "Demonstrates that Harappan artisans could master multi-figure spatial storytelling within a compact four-centimeter seal matrix.",
      },
    ],
  },
  {
    id: "figurine-mother-goddess",
    name: "Terracotta 'Mother Goddess' Figurine",
    category: "Terracotta & Sculpture",
    image: "/images/artifacts/terracotta-mother-goddess.jpg",
    emoji: "🗿",
    short: "Iconic hand-modeled female figurine featuring an elaborate fan headdress, pellet eyes, and layered choker collars.",
    locked: false,
    featured: true,
    type: "Hand-Modeled Anthropomorphic Figurine",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Fired Fine Terracotta with Red Ochre Slip",
    site: "Harappa / Mohenjo-daro",
    dimensions: "18.5 × 8.2 × 4.6 cm",
    discoveryContext: "Recovered from domestic courtyard and house floor deposits.",
    significance: "A quintessential representation of Harappan domestic spiritual life. Often associated with fertility, household blessing, and female reverence in ancient urban homes.",
    description:
      "This expressive terracotta sculpture was hand-shaped from alluvial clay and baked in updraft kilns. The figure features a dramatic fan-shaped headdress flanked by pannier cup-like ornaments, applied pellet eyes with indented pupils, a pinched nose, and a tiered array of heavy collar necklaces draping across the chest. The miniature waist and flared hips are adorned with an ornamental waistband.",
    tags: ["Terracotta", "Mother Goddess", "Headdress", "Domestic Votive", "Fertility"],
    insights: [
      {
        label: "Applied Clay Appliqué",
        text: "Eyes, jewelry, ear ornaments, and headdress cups were individually shaped as small clay discs and carefully pressed onto the leather-hard body.",
      },
      {
        label: "Domestic Votive Cult",
        text: "Because these figurines were found inside residential rooms rather than monumental palaces, archaeologists infer they were domestic household deities.",
      },
      {
        label: "Textile & Adornment Traditions",
        text: "Provides crucial archaeological evidence for the elaborate hairstyles, woven textiles, and multi-strand necklaces worn in Harappan cities.",
      },
    ],
  },
  {
    id: "mask-horned",
    name: "Anthropomorphic Horned Terracotta Mask",
    category: "Terracotta & Sculpture",
    image: "/images/artifacts/terracotta-horned-mask.jpg",
    emoji: "🎭",
    short: "Miniature terracotta ritual mask with curved bovine horns, pierced ear attachment holes, and serene almond eyes.",
    locked: false,
    featured: true,
    type: "Ceremonial Maskette",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Terracotta with Traces of Pigment",
    site: "Mohenjo-daro",
    dimensions: "7.8 × 5.2 × 2.4 cm",
    discoveryContext: "Excavated from a specialized artisan workshop quarter.",
    significance: "A rare surviving mask from the Indus Valley Civilization. The pierced lateral holes indicate it was tied to wooden poles, attached to ceremonial statues, or worn in theatrical ritual performances.",
    description:
      "Cast with serene, half-closed almond eyes and prominent curved bovine horns (one horn partially broken in antiquity), this mask embodies the sacred human-bovine transformation recurring across Harappan art. The side edges feature drilled attachment holes for strapping, while the beard and chin are textured with delicate incisions.",
    tags: ["Mask", "Horned Deity", "Ritual Performance", "Terracotta", "Mohenjo-daro"],
    insights: [
      {
        label: "Ritual Transformation",
        text: "The fusion of human facial features with bovine horns signifies shamans or deities mediating between the human settlement and natural forces.",
      },
      {
        label: "Pierced Fastening Holes",
        text: "Two small circular perforations behind the ears allowed the maskette to be laced onto fabric, leather straps, or ceremonial wooden effigies.",
      },
      {
        label: "Expressive Naturalism",
        text: "The gentle curve of the lips and defined brow line showcase sophisticated portrait sculpture in miniature ceramic form.",
      },
    ],
  },
  {
    id: "figurine-painted-bearer",
    name: "Painted Terracotta Offering-Bearer Figurine",
    category: "Terracotta & Sculpture",
    image: "/images/artifacts/terracotta-painted-figurine.jpg",
    emoji: "🏺",
    short: "Slender standing figurine holding an offering vessel, decorated with black-painted geometric checkered skirt bands.",
    locked: false,
    featured: false,
    type: "Polychrome Painted Figurine",
    period: "Early to Mature Harappan (c. 2800–2200 BCE)",
    material: "Terracotta, Black Manganese Pigment over Cream Slip",
    site: "Harappa (Lower Stratum)",
    dimensions: "14.2 × 5.8 × 3.1 cm",
    discoveryContext: "Found in early structural stratigraphy associated with craft workshops.",
    significance: "Bridges the stylistic transition between early regional Mehrgarh/Kot Diji painted pottery traditions and mature Harappan urban figurine modeling.",
    description:
      "This graceful terracotta figure holds a small presentation bowl between both hands at the waist. The flared bell-like skirt is meticulously decorated with black-painted crosshatch and grid motifs, representing early woven textile patterns. Traces of dark pigment around the throat and head indicate painted torque necklaces and hair ribbons.",
    tags: ["Painted Pottery", "Offering Bearer", "Textiles", "Early Harappan", "Craft"],
    insights: [
      {
        label: "Crosshatch Textile Patterns",
        text: "The painted grid on the lower garment reflects block-printed or warp-and-weft dyed cotton textiles produced in ancient Indus river settlements.",
      },
      {
        label: "Votive Gesture",
        text: "Holding an offering bowl directly in front of the body points to devotional presentation of grain, clarified butter, or aromatic oils.",
      },
      {
        label: "Stable Flared Base",
        text: "The solid flared bottom allowed the figurine to stand upright independently on household altars and display ledges.",
      },
    ],
  },
  {
    id: "figurine-bull-toy",
    name: "Terracotta Humped Bull Figurine",
    category: "Terracotta & Sculpture",
    image: "/images/artifacts/terracotta-bull-figurine.jpg",
    emoji: "🐂",
    short: "Hand-modeled terracotta zebu bull with swept-back horns and pierced axle holes, used as a votive prop and wheeled cart toy.",
    locked: false,
    featured: false,
    type: "Zoomorphic Toy / Votive Figurine",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Buff Baked Terracotta",
    site: "Harappa",
    dimensions: "9.5 × 6.8 × 4.2 cm",
    discoveryContext: "Abundantly recovered from residential street debris, courtyards, and drainage sumps.",
    significance: "Demonstrates the central role of draught cattle in the Harappan agricultural economy, as well as the playful domestic world of Harappan children who pulled these animals on miniature wooden carts.",
    description:
      "Modelled with energetic hand pinches, this terracotta bull features the iconic muscular shoulder hump, stout legs, and curved horns characteristic of indigenous Indus Zebu cattle (Bos indicus). The nostrils and eye contours are indicated by simple punctured impressions. Many such figurines were fitted with wooden axles through drilled holes to roll as pull-toys.",
    tags: ["Zebu Bull", "Toy", "Domestic Life", "Terracotta", "Agrarian Economy"],
    insights: [
      {
        label: "Agrarian Heart of Civilization",
        text: "Humped cattle powered ploughs in alluvial wheat/barley fields and hauled heavy bullock carts laden with goods along paved city streets.",
      },
      {
        label: "Children's Play & Education",
        text: "Toy bullock carts and whistles reflect a society where craft skills and agricultural knowledge were passed to youth through play.",
      },
      {
        label: "Rapid Hand-Shaping",
        text: "Formed in minutes by urban potters using spare kiln space, making art universally accessible across social tiers.",
      },
    ],
  },
  {
    id: "tablet-hunting-plaque",
    name: "Narrative Molded Tablet (Hunter & Yogic Figure)",
    category: "Inscriptions & Plaques",
    image: "/images/artifacts/harappan-molded-tablet-plaque.jpg",
    emoji: "📜",
    short: "Narrative molded terracotta relief plaque illustrating an archer confronting a wild water buffalo, accompanied by a seated yogic deity.",
    locked: false,
    featured: true,
    type: "Two-Sided Molded Relief Plaque",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Terracotta Pressed from Intaglio Master Mold",
    site: "Harappa",
    dimensions: "5.4 × 2.2 × 0.8 cm",
    discoveryContext: "Found along the main ceremonial avenue of Mound E.",
    significance: "Provides extraordinary iconographic evidence of heroic mythologies, wildlife confrontation, and meditative seated postures in pre-Vedic South Asia.",
    description:
      "This elongated terracotta tablet was mass-pressed using a precision intaglio mold. The left scene shows an agile hunter or deity thrusting a spear into a charging water buffalo whose head is held back by the hero's foot. On the right, a serene horned figure sits in cross-legged yogic meditation (mulabandhasana). Inscriptions of Indus signs are crisply impressed in the field.",
    tags: ["Molded Tablet", "Hunter & Buffalo", "Yogic Posture", "Epigraphy", "Harappa"],
    insights: [
      {
        label: "Heroic Mythological Cycle",
        text: "Identical tablets found in distant Harappan cities prove this scene depicts a well-known shared cultural myth or epic narrative.",
      },
      {
        label: "Proto-Yogic Asana",
        text: "The cross-legged seated figure with heels pressed together represents the earliest pictorial evidence of systematic meditative discipline.",
      },
      {
        label: "Molded Replication",
        text: "Unlike one-off stone seals, molded tablets were mass-produced in clay as pilgrimage tokens or protective amulets distributed to travelers.",
      },
    ],
  },
  {
    id: "jewelry-bronze-bangles",
    name: "Cast Bronze & Copper Armlet Bangles",
    category: "Ornaments & Metallurgy",
    image: "/images/artifacts/harappan-bronze-bangles.jpg",
    emoji: "💍",
    short: "Heavy cast copper-bronze annular personal ornaments with open terminals, recovered from an ancient metalworking hoard.",
    locked: false,
    featured: true,
    type: "Cast Metal Torcs / Arm Bangles",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Cast Tin-Alloy Bronze & Refined Copper",
    site: "Harappa / Mohenjo-daro",
    dimensions: "Diameter: 7.6 cm each; Thickness: 0.8 cm",
    discoveryContext: "Discovered inside a sealed terracotta storage jar cache in a coppersmith's workshop.",
    significance: "Demonstrates advanced pyrotechnology and lost-wax/mold casting. Matching bangles are seen worn stacked from wrist to shoulder on the iconic bronze 'Dancing Girl' of Mohenjo-daro.",
    description:
      "These heavy annular bangles were cast in copper-tin bronze, cold-hammered to high tensile density, and finished with smoothed rounded terminals. Harappan women and men wore bangles of bronze, gold, faience, conch shell, and vitrified stoneware, with the number and material reflecting guild association, regional identity, and civic status.",
    tags: ["Bronze Metallurgy", "Bangles", "Adornment", "Dancing Girl", "Coppersmiths"],
    insights: [
      {
        label: "Sophisticated Alloying",
        text: "Chemical assay shows a deliberate 9–11% tin-copper mixture, giving the alloy strength, golden sheen, and corrosion resistance.",
      },
      {
        label: "Stacked Armlet Tradition",
        text: "Sculptures show Harappan women wearing twenty or more bangles on the left arm and several on the right wrist.",
      },
      {
        label: "Precious Hoards",
        text: "Found stored in copper pots beneath house floors, serving as portable family wealth and emergency bullion reserves.",
      },
    ],
  },
  {
    id: "bead",
    name: "Long Barrel Etched Carnelian Bead",
    category: "Ornaments & Metallurgy",
    image: "/images/artifacts/harappan-bronze-bangles.jpg",
    emoji: "🟠",
    short: "Slender carnelian bead etched with white geometric alkali patterns, highly prized across ancient Mesopotamia.",
    locked: false,
    featured: false,
    type: "Etched Long Barrel Bead",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Fine Carnelian Agate with Alkali Etching",
    site: "Chanhudaro (Artisan Quarter)",
    dimensions: "Length: 6.8 cm; Diameter: 0.9 cm",
    discoveryContext: "Recovered from specialized bead-drilling lapidary workshops at Chanhudaro.",
    significance: "Harappan carnelian beads were world-famous luxury exports mentioned in Mesopotamian cuneiform tablets from the Royal Tombs of Ur as prized 'Madu/Meluhha' carnelian.",
    description:
      "Crafted from high-grade carnelian mined in Gujarat, these beads required weeks of firing, chipping, grinding on sandstone, and drilling using specialized hard-stone drills (ernestite). White geometric circles and bands were etched onto the deep orange stone using an alkaline paste of washing soda and plant sap before a final glaze firing.",
    tags: ["Carnelian", "Bead-making", "Long-distance Trade", "Chanhudaro", "Mesopotamia"],
    insights: [
      {
        label: "Tapered Ernestite Drills",
        text: "Indus lapidaries invented microscopic drills of hard metamorphic rock capable of drilling a 7 cm stone barrel without fracturing.",
      },
      {
        label: "Meluhha Export Trade",
        text: "King Sargon of Akkad (Mesopotamia) boasted that ships from Meluhha (Indus) docked at his quays laden with carnelian beads.",
      },
      {
        label: "Chemical Etching Innovation",
        text: "Alkaline white painting fused permanently into the crystalline structure of the agate during controlled secondary baking.",
      },
    ],
  },
  {
    id: "weight",
    name: "Standardized Cubical Chert Weight",
    category: "Tools & Everyday Life",
    image: "/images/artifacts/indus-seal-zebu-bull.jpg",
    emoji: "⚖️",
    short: "Precisely cut cubical stone weight from the binary and decimal Indus metrology system.",
    locked: false,
    featured: false,
    type: "Standardized Balance Weight",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Fine Banded Rohri Chert",
    site: "Harappa / Mohenjo-daro",
    dimensions: "2.8 × 2.8 × 2.8 cm; Mass: 13.63 g",
    discoveryContext: "Found at customs gates, market plazas, and gemstone workshops.",
    significance: "Indicates unprecedented commercial honesty and centralized standards across a million square kilometers of Indus territory with less than 1% variance.",
    description:
      "This polished cubical weight was cut from high-density Rohri chert with beveled edges to prevent chipping. The Indus weight system followed a binary progression for smaller units (1, 2, 4, 8, 16, 32, 64) and decimal ratios for larger bulk commodities, used to weigh gold dust, lapis lazuli, perfumes, and agricultural grain.",
    tags: ["Metrology", "Standardization", "Rohri Chert", "Trade", "Civic Administration"],
    insights: [
      {
        label: "Universal Metric Harmony",
        text: "A weight found at Lothal in Gujarat weighs identical to one found a thousand miles north in Harappa, confirming unified civic oversight.",
      },
      {
        label: "Fair Taxation & Trust",
        text: "Standard weights prevented commercial fraud at city gates, cementing merchant confidence across international maritime routes.",
      },
      {
        label: "Rohri Chert Quarries",
        text: "The hard, fine-grained flint was quarried in the Rohri Hills of Sindh and transported across waterways to urban stone-cutters.",
      },
    ],
  },
  {
    id: "blade",
    name: "Prismatic Core Chert Blade",
    category: "Tools & Everyday Life",
    image: "/images/artifacts/harappan-molded-tablet-plaque.jpg",
    emoji: "🔪",
    short: "Sharp parallel-sided stone blade struck from a prepared prismatic core, used in everyday urban crafts.",
    locked: false,
    featured: false,
    type: "Prismatic Pressure Flake Blade",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Rohri Chert",
    site: "Mohenjo-daro",
    dimensions: "8.5 × 1.4 × 0.4 cm",
    discoveryContext: "Recovered from domestic kitchens, butchery areas, and shell-inlay craft shops.",
    significance: "A hallmark of Harappan stone tool technology. Pressure-flaking long, uniform blades provided durable razor-sharp edges without consuming expensive copper-bronze alloy.",
    description:
      "Struck with copper-tipped pressure flakers from a prepared polyhedral core, these chert blades feature razor-straight parallel cutting edges. They were mounted into wooden handles with bitumen or tree resin to serve as sickles, leather knives, and fine wood-carving gouges.",
    tags: ["Chert Blade", "Lithic Technology", "Craftsmanship", "Everyday Life"],
    insights: [
      {
        label: "Standardized Knapping",
        text: "Specialized stone knappers produced hundreds of identical parallel blades from a single cylindrical core with virtually no wasted stone.",
      },
      {
        label: "Micro-Wear Evidence",
        text: "Microscopic analysis reveals 'sickle gloss' on edges from harvesting cereal grasses, as well as meat-cutting and shell-working striations.",
      },
      {
        label: "Economical Utility",
        text: "While bronze was reserved for prestige items, chert blades provided every household with dependable cutting edges.",
      },
    ],
  },
  {
    id: "harappa-tablets",
    name: "Incised Miniature Epigraphic Tablets",
    category: "Inscriptions & Plaques",
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    emoji: "🔢",
    short: "Incised miniature steatite and terracotta tablets bearing standardized Indus script sequences and numerical stroke tallies.",
    locked: false,
    featured: true,
    type: "Miniature Incised Epigraphic Tokens",
    period: "Mature Harappan Period 3B/3C (c. 2450–1900 BCE)",
    material: "Glazed Soft Steatite & Molded Terracotta",
    site: "Harappa (Mound E & Mound ET)",
    dimensions: "1.8 × 1.2 × 0.4 cm each",
    discoveryContext: "Excavated from residential alleyways, artisan workshops, and city gateway deposits at Harappa.",
    significance: "Crucial for understanding Indus administrative notation. Unlike square stamp seals, these miniature tablets were produced in grouped series with standardized sequences of script signs and stroke counts (numerical tallies).",
    description:
      "Recovered during modern stratigraphic excavations at Harappa, these miniature flat tablets carry incised script signs and numerical tally strokes (groups of 1 to 7 vertical strokes). Archaeologists hypothesize they served as accounting tokens, pilgrimage receipts, ritual rations, or guild transit tokens issued at urban customs checkpoints.",
    tags: ["Harappa", "Indus Script", "Accounting Tokens", "Tallies", "Administration"],
    insights: [
      {
        label: "Standardized Sequences",
        text: "Identical sign combinations appear across dozens of tablets, indicating standardized administrative formulas or cargo classifications.",
      },
      {
        label: "Numerical Stroke Tallies",
        text: "Parallel vertical incised lines represent quantifiable units of measure, rations, or days within seasonal civic cycles.",
      },
      {
        label: "Portable Tokens",
        text: "Unlike seals with cord bosses, these thin tablets were pocketed or distributed in lots to merchants and laborers.",
      },
    ],
  },
  {
    id: "seal-confronting-bulls",
    name: "Scalloped Plaque (Confronting Bulls & Sacred Tree)",
    category: "Seals & Epigraphy",
    image: "/images/artifacts/indus-confronting-bulls-seal.jpg",
    emoji: "🌳",
    short: "Arched and scalloped terracotta seal plaque portraying two powerful bulls locking horns beneath a sacred stylized acacia/pipal tree.",
    locked: false,
    featured: true,
    type: "Arched Crest Bas-Relief Plaque",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Fine Molded Buff Terracotta",
    site: "Harappa",
    dimensions: "5.1 × 4.8 × 1.1 cm",
    discoveryContext: "Found near a monumental gateway precinct at Harappa.",
    significance: "An extraordinary departures from standard square Indus seal conventions, featuring an elaborate crenellated scalloped top edge and dynamic zoomorphic tension between two confronting horned bulls.",
    description:
      "This unique molded terracotta plaque features an undulating scalloped crest framing a botanical and zoomorphic scene. In the upper register, a branching sacred tree with delicate leaves spreads its canopy. Beneath the foliage, two muscular bulls stand in head-to-head confrontation with locked horns and curved dewlaps, capturing animal vigor and natural harmony.",
    tags: ["Confronting Bulls", "Sacred Tree", "Scalloped Plaque", "Zoomorphic Art", "Harappa"],
    insights: [
      {
        label: "Dynamic Animal Tension",
        text: "Captures naturalistic physical tension as the two bulls lean into each other with lowered brow horns and braced hooves.",
      },
      {
        label: "Sacred Grove Canopy",
        text: "The overhead tree with radiating fronds symbolizes nature sanctuaries where civic gatherings and ritual contests took place.",
      },
      {
        label: "Crenellated Crest Framing",
        text: "The serrated perimeter mimics stepped architectural battlements seen on Indus fortress walls and ceremonial platforms.",
      },
    ],
  },
  {
    id: "figurine-lady-rosettes",
    name: "The 'Lady of the Rosettes' Elite Figurine",
    category: "Terracotta & Sculpture",
    image: "/images/artifacts/terracotta-lady-of-rosettes.jpg",
    emoji: "👑",
    short: "Masterpiece terracotta female sculpture adorned with elaborate floral rosettes, pannier headpieces, and a jeweled disc girdle.",
    locked: false,
    featured: true,
    type: "Ornate Hand-Modeled Anthropomorphic Sculpture",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Fine Fired Terracotta with Burnished Ochre Slip",
    site: "Harappa (DK Area)",
    dimensions: "21.4 × 9.8 × 5.2 cm",
    discoveryContext: "Recovered from an elite multi-room residence near the central avenue of Harappa.",
    significance: "The pinnacle of Harappan terracotta sculpting. Showcases an extraordinarily intricate floral headdress, multilayered necklaces with leaf pendants, cross-body textile sash, and a wide girdle with applied medallions.",
    description:
      "This iconic sculpture displays the supreme mastery of Harappan terracotta artists. The figure wears an opulent headpiece crowned with four deeply grooved flower rosettes, lateral cup panniers, applied oval eyes with incised lids, a heavy choker collar with dangling leaf-shaped pendants, and a criss-cross chest harness. Her slender waist is clasped by a double-banded girdle with circular disc medallions.",
    tags: ["Lady of the Rosettes", "Elite Adornment", "Floral Headdress", "Terracotta Masterpiece", "Harappa"],
    insights: [
      {
        label: "Intricate Floral Appliqué",
        text: "Each individual petal and rosette bud was sculpted by hand and affixed to the headpiece before precision kiln firing.",
      },
      {
        label: "Courtly & Priestess Regalia",
        text: "The lavish tiering of jewelry, armbands, and cross-torques indicates high-status ceremonial attire of elite Harappan women.",
      },
      {
        label: "Textile & Girdle Technology",
        text: "The wide hip belt with central clasp reflects heavy woven metal or leather girdles adorned with steatite and gold beads.",
      },
    ],
  },
  {
    id: "figurine-archaic-head",
    name: "Archaic Terracotta Head with Fan Coiffure",
    category: "Terracotta & Sculpture",
    image: "/images/artifacts/early-harappan-terracotta-head.jpg",
    emoji: "🗿",
    short: "Early hand-modeled terracotta head featuring deep punctured circular eye sockets and an expansive flared fan-shaped coiffure.",
    locked: false,
    featured: false,
    type: "Archaic Votive Figurine Head",
    period: "Early Harappan / Kot Diji Phase (c. 2900–2600 BCE)",
    material: "Fired Coarse Buff Clay with Mineral Inclusions",
    site: "Mehrgarh / Harappa Early Stratum",
    dimensions: "8.2 × 6.5 × 3.8 cm",
    discoveryContext: "Excavated from deep pre-urban occupational layers below the mature Harappan brick levels.",
    significance: "Demonstrates the deep prehistoric ancestry of the Harappan artistic tradition, linking 4th-millennium BCE Mehrgarh Neolithic clay modeling directly to mature urban Indus iconographies.",
    description:
      "With its wide, scalloped fan-like hair crest and deep, hypnotic punctured circular eye depressions, this archaic terracotta head provides a direct evolutionary window into the emergence of South Asian figurative art. The elongated neck, prominent chin, and pierced mouth reflect early votive traditions before the advent of mass kiln firing.",
    tags: ["Early Harappan", "Mehrgarh Tradition", "Archaic Sculpture", "Fan Headdress", "Prehistoric Art"],
    insights: [
      {
        label: "Ancestral Stylistic Roots",
        text: "Bridges the 1,000-year evolution from early pastoralist clay totems to the sophisticated urban art of Mohenjo-daro.",
      },
      {
        label: "Punctured Tool Technique",
        text: "Eyes and nostrils were formed with hollow bone or reed styluses pressed into damp clay.",
      },
      {
        label: "Scalloped Fan Crest",
        text: "The broad serrated crest represents ceremonial hair dressing stiffened with oils, combs, and clay pastes.",
      },
    ],
  },
  {
    id: "jewelry-royal-necklace",
    name: "Royal Gold, Amazonite & Banded Agate Necklace",
    category: "Ornaments & Metallurgy",
    image: "/images/artifacts/harappan-gold-gemstone-necklace.jpg",
    emoji: "📿",
    short: "Prestige royal collar assembled from microcline amazonite barrel beads, cast gold biconical spacers, and banded agate pendants with gold terminal pins.",
    locked: false,
    featured: true,
    type: "Polychrome Gemstone & Gold Collar",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    material: "Amazonite (Microcline), Banded Agate, Jasper & Cast Gold",
    site: "Mohenjo-daro (DK Area Jewelry Hoard)",
    dimensions: "Total Length: 38.5 cm; Agate Pendants: 3.4 cm each",
    discoveryContext: "Discovered inside a silver and copper alloy vessel hidden beneath the floor of a large courtyard house.",
    significance: "A masterpiece of ancient luxury lapidary craft. Illustrates the vast trans-continental trade networks of the Indus Civilization, sourcing green amazonite from Gujarat/Deccan, gold from Karnataka, and banded agate from the Narmada River valley.",
    description:
      "This magnificent polychrome necklace features alternating translucent green amazonite gemstone barrels separated by fluted gold spacer disks. The centerpiece consists of three cylindrical banded agate and jasper drops fitted into solid gold terminal tubes and hanging pins. Worn by high-ranking civic rulers and merchant dignitaries during monumental public ceremonies.",
    tags: ["Royal Hoard", "Gold Jewelry", "Amazonite", "Banded Agate", "Lapidary Masterwork", "Mohenjo-daro"],
    insights: [
      {
        label: "Long-Distance Mineral Exchange",
        text: "Combines minerals sourced across thousands of miles—gold from the Nilgiris/Kolar, amazonite from Gujarat, and agate from Ratanpur.",
      },
      {
        label: "Precision Gold Smithing",
        text: "The biconical disk spacers were cast in refined gold, filed to razor-sharp perimeters, and burnished with agate smoothers.",
      },
      {
        label: "Hidden Hoards",
        text: "Stored inside sealed metal jars beneath house floors to protect family dynasties' wealth against flood and civic crisis.",
      },
    ],
  },
];

export const LOCKED_ARTIFACT_MESSAGE =
  "Locked — complete chapters and collect clues in The Lost Seal to unveil this exhibit.";

export const LOCKED_CIVILIZATION_MESSAGE =
  "Complete the required historical chapters to unlock this civilizational period.";

export const museumProgress = {
  artifactsUnlocked: 14,
  artifactsTotal: 14,
  cluesCollected: 0,
  cluesTotal: 15,
};



