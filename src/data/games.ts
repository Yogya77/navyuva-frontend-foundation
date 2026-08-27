export type GameDifficulty = "Easy" | "Medium" | "Hard";
export type GameType =
  | "Artifact Mystery"
  | "Historical Quiz"
  | "Trade & Decision Puzzle"
  | "Symbol/Pattern Puzzle"
  | "Strategy & Governance"
  | "Science & Arts"
  | "Architecture & Diplomacy";

export interface GameReward {
  type: "artifact" | "clue";
  name: string;
  artifactId?: string;
  emoji: string;
  description: string;
}

export interface GameDefinition {
  id: string;
  title: string;
  civilization: string;
  era: string;
  type: GameType;
  difficulty: GameDifficulty;
  duration: string;
  shortDescription: string;
  longDescription: string;
  reward: GameReward;
  locked: boolean;
  lockRequirement?: string;
  iconName: string;
}

export const GAMES_CATALOG: GameDefinition[] = [
  {
    id: "lost-seal",
    title: "The Lost Seal",
    civilization: "Indus Valley Civilization",
    era: "2600–1900 BCE",
    type: "Artifact Mystery",
    difficulty: "Easy",
    duration: "4–6 mins",
    shortDescription:
      "Investigate an archaeological trench in Mohenjo-daro to identify and deduce the purpose of a mysterious carved steatite stamp.",
    longDescription:
      "Step into the role of an archaeologist unearthing a rare carved square seal. Examine physical wear, animal iconography, and ancient script impressions to deduce its true historical purpose in Bronze Age commerce.",
    reward: {
      type: "artifact",
      name: "Steatite Seal",
      artifactId: "seal",
      emoji: "🔷",
      description: "Unlocks the Steatite Stamp Seal exhibit in the Indus Valley Virtual Museum.",
    },
    locked: false,
    iconName: "Search",
  },
  {
    id: "harappa-secrets",
    title: "Secrets of Harappa",
    civilization: "Indus Valley Civilization",
    era: "2600–1900 BCE",
    type: "Historical Quiz",
    difficulty: "Easy",
    duration: "5–8 mins",
    shortDescription:
      "Test your archaeological knowledge on Harappan urban planning, sophisticated drainage, standardized weights, and artisan workshops.",
    longDescription:
      "Answer 5 curated archaeological questions exploring the marvels of Harappan engineering, bronze metallurgy, and international maritime trade networks across the Arabian Sea.",
    reward: {
      type: "clue",
      name: "Harappan Knowledge Scroll",
      emoji: "📜",
      description: "Adds 1 Historical Clue to your Museum Collection Archive.",
    },
    locked: false,
    iconName: "HelpCircle",
  },
  {
    id: "traders-journey",
    title: "Trader's Journey",
    civilization: "Indus Valley Civilization",
    era: "2600–1900 BCE",
    type: "Trade & Decision Puzzle",
    difficulty: "Medium",
    duration: "6–10 mins",
    shortDescription:
      "Manage resources, select maritime or overland routes from Lothal port, and navigate historical trade diplomacy with Mesopotamia.",
    longDescription:
      "Take command of a Harappan merchant guild. Choose your cargo of etched carnelian and fine cotton, navigate seasonal monsoon winds or mountain passes, and successfully trade with Dilmun and Ur.",
    reward: {
      type: "artifact",
      name: "Carnelian Bead",
      artifactId: "bead",
      emoji: "🟠",
      description: "Unlocks the Etched Carnelian Bead exhibit in the Indus Valley Virtual Museum.",
    },
    locked: false,
    iconName: "Compass",
  },
  {
    id: "decipher-past",
    title: "Decipher the Past",
    civilization: "Indus Valley Civilization",
    era: "2600–1900 BCE",
    type: "Symbol/Pattern Puzzle",
    difficulty: "Medium",
    duration: "5–7 mins",
    shortDescription:
      "Analyze recurring Indus script signs and seal glyph patterns in an educational symbol sequence puzzle.",
    longDescription:
      "Inspect authentic Harappan seal motifs including the unicorn, standard vessel, and composite glyphs. Identify the missing sequences and learn how archaeologists analyze ancient visual communication systems.",
    reward: {
      type: "clue",
      name: "Epigraphic Clue Fragment",
      emoji: "🔣",
      description: "Adds 1 Epigraphic Historical Clue to your Museum Collection Archive.",
    },
    locked: false,
    iconName: "Key",
  },
  {
    id: "empire-builder",
    title: "Empire Builder",
    civilization: "Maurya Empire",
    era: "322–185 BCE",
    type: "Strategy & Governance",
    difficulty: "Medium",
    duration: "10–12 mins",
    shortDescription:
      "Enact imperial edicts, establish rock inscriptions, and balance statecraft along the Grand Trunk road.",
    longDescription:
      "Guide Emperor Ashoka's administrative emissaries across the subcontinent, balancing Dhamma edicts, trade outposts, and agricultural security.",
    reward: {
      type: "artifact",
      name: "Ashokan Capital",
      emoji: "🦁",
      description: "Unlocks the Lion Capital of Ashoka in the Maurya Gallery.",
    },
    locked: true,
    lockRequirement: "Complete all Indus Valley challenges to unlock the Maurya Gallery.",
    iconName: "Shield",
  },
  {
    id: "golden-age",
    title: "Golden Age",
    civilization: "Gupta Empire",
    era: "320–550 CE",
    type: "Science & Arts",
    difficulty: "Hard",
    duration: "10–15 mins",
    shortDescription:
      "Collaborate with ancient astronomers, mathematicians at Nalanda, and classical Sanskrit dramatists.",
    longDescription:
      "Explore the golden age of classical Indian science, zero numeral notation, metallurgy of the Iron Pillar, and rock-cut architectural genius at Ajanta.",
    reward: {
      type: "artifact",
      name: "Gold Dinar Coin",
      emoji: "🪙",
      description: "Unlocks the Chandragupta Gold Dinar in the Gupta Gallery.",
    },
    locked: true,
    lockRequirement: "Requires unlocking Maurya Civilization records first.",
    iconName: "Award",
  },
  {
    id: "medieval-chronicles",
    title: "Medieval Chronicles",
    civilization: "Medieval India",
    era: "1200–1750 CE",
    type: "Architecture & Diplomacy",
    difficulty: "Hard",
    duration: "12–15 mins",
    shortDescription:
      "Construct monumental stepwells, study Indo-Islamic and Dravidian architectural geometry, and manage court diplomacy.",
    longDescription:
      "Journey through the architectural wonders of Vijayanagara, the Chola bronze foundries, and Mughal garden geometry.",
    reward: {
      type: "artifact",
      name: "Chola Bronze Nataraja",
      emoji: "🔱",
      description: "Unlocks the Medieval Bronze Sculpture in the Medieval Gallery.",
    },
    locked: true,
    lockRequirement: "Requires completing earlier era timelines.",
    iconName: "Landmark",
  },
];

/* -------------------------------------------------------------------------- */
/* Game 1: The Lost Seal (Artifact Mystery) Scenario Data                      */
/* -------------------------------------------------------------------------- */

export interface MysteryClueStep {
  stepNumber: number;
  stageTitle: string;
  archaeologicalContext: string;
  visualEvidence: {
    title: string;
    icon: string;
    description: string;
  };
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const LOST_SEAL_STEPS: MysteryClueStep[] = [
  {
    stepNumber: 1,
    stageTitle: "Trench Excavation & Material Analysis",
    archaeologicalContext:
      "During excavation of Trench DK-G in Mohenjo-daro's lower town, workers unearth a 2.5 cm smooth square tablet with high-temperature glazed luster.",
    visualEvidence: {
      title: "Physical Tablet Properties",
      icon: "💎",
      description:
        "Soft soapstone (steatite) carved in fine intaglio relief, coated with alkali slurry and kiln-fired above 1000°C for extreme surface hardness.",
    },
    question:
      "Why did Indus artisans carve seals from soft steatite before heating them to intense temperatures?",
    options: [
      {
        id: "a",
        text: "Steatite was easy to engrave with delicate micro-tools, while kiln-firing made it hard, durable, and shiny.",
        isCorrect: true,
        explanation:
          "Correct! Steatite (talc stone) is soft (Mohs 1), allowing intricate micro-carving of Indus glyphs and anatomy. Firing converted it to hard enstatite (Mohs 5.5–6), durable for stamping thousands of wet clay tags.",
      },
      {
        id: "b",
        text: "Kiln-firing melted the stone into malleable liquid molds for bronze casting.",
        isCorrect: false,
        explanation:
          "Incorrect. Steatite does not melt into casting liquid; high heat dehydrates and vitrifies the stone surface without melting it.",
      },
      {
        id: "c",
        text: "It was used exclusively as edible medicinal mineral tablets in ancient pharmacies.",
        isCorrect: false,
        explanation:
          "Incorrect. Steatite seals were administrative and economic instruments, not consumable medicines.",
      },
    ],
  },
  {
    stepNumber: 2,
    stageTitle: "Iconography & Anatomical Motif",
    archaeologicalContext:
      "Cleaning the tablet reveals a majestic carved animal in profile beneath a line of five distinct pictographic glyphs.",
    visualEvidence: {
      title: "The Zebu Bull & Inverted Feeding Trough",
      icon: "🐂",
      description:
        "A prominent humped Zebu bull (Bos indicus) with heavy dewlap, curved horns, and a ritual manger beneath its muzzle.",
    },
    question:
      "What did prominent animal motifs (like the Zebu Bull, Elephant, or Unicorn) most likely signify on Harappan stamp seals?",
    options: [
      {
        id: "a",
        text: "Purely decorative wall hangings given as children's toys.",
        isCorrect: false,
        explanation:
          "Incorrect. Miniature terracotta animals were occasionally toys, but steatite seals with script were elite commercial and civic identifiers.",
      },
      {
        id: "b",
        text: "Emblems of influential merchant lineages, guilds, civic administrators, or port authorities.",
        isCorrect: true,
        explanation:
          "Correct! Archaeologists deduce that distinct animal totems represented merchant clans, ruling councils, or civic quarters, enabling quick recognition by merchants across distant language barriers.",
      },
      {
        id: "c",
        text: "Price tags indicating the exact weight of wheat bags in local markets.",
        isCorrect: false,
        explanation:
          "Incorrect. Standardized cubical chert weights tracked mass; seals verified ownership, authenticity, and legal sealings.",
      },
    ],
  },
  {
    stepNumber: 3,
    stageTitle: "Reverse Boss & Functional Deduction",
    archaeologicalContext:
      "Inspecting the back of the square seal reveals a perforated boss (knob) with traces of fine cord impressions.",
    visualEvidence: {
      title: "Perforated Suspension Boss",
      icon: "🧵",
      description:
        "A central hemispherical lug pierced horizontally with a 1.5 mm hole, allowing a cord to be threaded through.",
    },
    question:
      "Based on clay seal impressions found on bales of Mesopotamian cloth, how was this seal used in daily life?",
    options: [
      {
        id: "a",
        text: "Merchants wore it on a cord around the neck or wrist and pressed it into wet clay sealings (sealings) securing trade packages.",
        isCorrect: true,
        explanation:
          "Correct! Clay tags (bullae) with cloth weave on the reverse and seal impressions on the front prove Harappans sealed warehouse doors and export crates to guarantee untampered delivery.",
      },
      {
        id: "b",
        text: "It was hammered directly into bronze weapons as a blacksmith hallmark.",
        isCorrect: false,
        explanation:
          "Incorrect. Steatite is brittle and would shatter if hammered into metal; it was pressed into pliable clay.",
      },
      {
        id: "c",
        text: "It served as an astronomical mirror for sighting solstice sunrises.",
        isCorrect: false,
        explanation:
          "Incorrect. The seal is opaque stone with intaglio carving designed for stamping, not reflective observation.",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Game 2: Secrets of Harappa (Historical Quiz) Data                          */
/* -------------------------------------------------------------------------- */

export interface QuizQuestion {
  id: number;
  question: string;
  topic: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const HARAPPA_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: "Urban Engineering",
    question:
      "What distinctive feature characterized the street layouts of major Indus cities like Mohenjo-daro and Harappa?",
    options: [
      "Concentric circular avenues radiating from a king's palace",
      "A disciplined orthogonal grid plan oriented along cardinal directions (North-South, East-West)",
      "Unplanned winding lanes shaped organically by river flood boundaries",
      "Tiered hillside fortifications connected by rope bridges",
    ],
    correctIndex: 1,
    explanation:
      "Harappan city planning was remarkably standardized: wide straight thoroughfares crossed at precise right angles, forming rectangular residential blocks aligned to cardinal directions.",
  },
  {
    id: 2,
    topic: "Hydraulic Architecture",
    question:
      "How did the Indus Valley sanitation and drainage system compare to other contemporaneous Bronze Age civilizations?",
    options: [
      "They had no drains and dumped wastewater into dry riverbeds",
      "Only the ruler's residence had a private bathing chamber",
      "Almost every house had a private bath connected by terracotta pipes to covered brick street drains with inspection sumps",
      "They shared open wooden troughs running along rooftop eaves",
    ],
    correctIndex: 2,
    explanation:
      "The Indus sanitation system was unprecedented in antiquity. Household wastewater flowed through brick chutes into covered street drains fitted with removable stone covers for regular municipal maintenance.",
  },
  {
    id: 3,
    topic: "Standardization & Metrology",
    question:
      "What standard ratios were used for the dimensions of Harappan kiln-baked bricks across hundreds of sites spanning thousands of miles?",
    options: [
      "1 : 2 : 4 (Thickness : Width : Length)",
      "1 : 1 : 1 (Perfect cubes)",
      "1 : 3 : 9 (Elongated flat slabs)",
      "Random sizes varying by each individual potter's kiln",
    ],
    correctIndex: 0,
    explanation:
      "Across cities separated by 1,000+ km (from Gujarat to Punjab), Harappan construction used a uniform brick proportion of 1:2:4 (e.g., 7 × 14 × 28 cm), demonstrating rigorous civic standardization.",
  },
  {
    id: 4,
    topic: "Maritime Trade & Ports",
    question:
      "Which famous Harappan coastal settlement in Gujarat features a massive trapezoidal brick basin identified as an ancient tidal dockyard?",
    options: ["Kalibangan", "Lothal", "Banawali", "Rakhigarhi"],
    correctIndex: 1,
    explanation:
      "Lothal boasts a 214 × 36 meter brick basin connected via a sluice gate to the Gulf of Khambhat, allowing ocean-going ships to berth during high tide for loading beads, ivory, and textiles.",
  },
  {
    id: 5,
    topic: "Craftsmanship & Metallurgy",
    question:
      "Which metallurgical technique did Harappan bronze-smiths master to craft the celebrated 'Dancing Girl' figurine found at Mohenjo-daro?",
    options: [
      "Lost-wax casting (Cire Perdue)",
      "Cold-hammered copper foil repoussé",
      "Iron blast furnace smelting",
      "Extruded wire filigree",
    ],
    correctIndex: 0,
    explanation:
      "The delicate, expressive 'Dancing Girl' was created using the lost-wax casting technique (cire perdue), showcasing master-level bronze alloy blending (copper and tin) around 2500 BCE.",
  },
];

/* -------------------------------------------------------------------------- */
/* Game 3: Trader's Journey (Trade & Decision Puzzle) Data                    */
/* -------------------------------------------------------------------------- */

export interface TradeDecisionOption {
  id: string;
  title: string;
  description: string;
  risk: "Low" | "Moderate" | "High";
  costDescription: string;
  outcomeText: string;
  pointsDelta: number;
  resourceOutcome: {
    gold: number;
    reputation: number;
  };
}

export interface TradeDecisionStage {
  stage: number;
  location: string;
  scenarioTitle: string;
  narrative: string;
  historicalContext: string;
  options: TradeDecisionOption[];
}

export const TRADERS_JOURNEY_STAGES: TradeDecisionStage[] = [
  {
    stage: 1,
    location: "Lothal Artisan Quarter (Gujarat)",
    scenarioTitle: "Assembling Your Export Cargo",
    narrative:
      "As Master Trader of the Lothal Guild, you have 100 bundles of raw silver ingots to invest. Local bead workshops offer long-barrel etched carnelian, lapis lazuli from Badakhshan, and fine combed cotton bolts.",
    historicalContext:
      "Harappan etched carnelian was prized in Mesopotamian royal tombs (Ur, Kish) because only Indus craftsmen possessed the specialized alkaline-bleach etching technology.",
    options: [
      {
        id: "opt1",
        title: "Load Fine Etched Carnelian & Shell Bangles",
        description:
          "High demand in foreign royal courts; compact to transport and highly valued per unit weight.",
        risk: "Low",
        costDescription: "Balanced investment of 60 silver bundles",
        outcomeText:
          "Foreign merchants prize your genuine Harappan carnelian beads for their symmetrical alkali etchings. Your cargo is compact and safe from moisture.",
        pointsDelta: 100,
        resourceOutcome: { gold: 80, reputation: 30 },
      },
      {
        id: "opt2",
        title: "Load Bulky Timber & Raw Terracotta Pots",
        description:
          "Heavy and fragile cargo that requires significant vessel ballast and slow handling.",
        risk: "High",
        costDescription: "High cargo weight of 85 silver bundles",
        outcomeText:
          "Rough sea swells damaged 30% of the terracotta vessels in transit, though the teak timber was purchased by local shipwrights.",
        pointsDelta: 40,
        resourceOutcome: { gold: 30, reputation: 10 },
      },
      {
        id: "opt3",
        title: "Balanced Manifest: Carnelian, Cotton Textiles & Steatite Seals",
        description:
          "Diversified manifest carrying both luxury prestige goods and high-grade dyed cloth.",
        risk: "Moderate",
        costDescription: "Optimal investment of 75 silver bundles",
        outcomeText:
          "An ideal trade inventory! The textile rolls and luxury ornaments meet the demands of both temple elites and urban guild masters.",
        pointsDelta: 120,
        resourceOutcome: { gold: 100, reputation: 40 },
      },
    ],
  },
  {
    stage: 2,
    location: "Arabian Sea Coastal Waters (Off Makran Coast)",
    scenarioTitle: "Navigating the Coastal Monsoon Winds",
    narrative:
      "Your wooden reed-and-teak dhow approaches the Makran coast near Sutkagen-dor. Dark monsoon squalls appear on the horizon, and the crew questions whether to hug the treacherous rocky coast or make for the open deep channel.",
    historicalContext:
      "Harappan navigators built fortified coastal outposts like Sutkagen-dor and Sotka Koh along the Makran coast to supply freshwater and shelter merchant fleets during seasonal squalls.",
    options: [
      {
        id: "opt1",
        title: "Shelter in the Fortified Haven of Sutkagen-dor",
        description:
          "Pay a modest port harbor fee to wait out the gale in the calm waters of the Gwandar Bay.",
        risk: "Low",
        costDescription: "Minor delay of 2 days",
        outcomeText:
          "A wise maritime decision. While sheltering safely behind the stone ramparts, you trade spare cotton for fresh dried fish and replenish sweet water casks.",
        pointsDelta: 100,
        resourceOutcome: { gold: 50, reputation: 35 },
      },
      {
        id: "opt2",
        title: "Sail Directly into the Open Deepwater Storm",
        description:
          "Press forward with all sails hoisted to beat competing merchants to the Persian Gulf ports.",
        risk: "High",
        costDescription: "Severe hull stress and risk of capsizing",
        outcomeText:
          "Raging waves tear a foresail and soak some ballast. You arrive faster but your crew is exhausted and several cargo crates suffered seawater exposure.",
        pointsDelta: 30,
        resourceOutcome: { gold: 20, reputation: 5 },
      },
    ],
  },
  {
    stage: 3,
    location: "Dilmun Market (Modern Bahrain)",
    scenarioTitle: "Trade Intermediaries & Standard Weights",
    narrative:
      "You reach the bustling island entrepôt of Dilmun. Mesopotamian cuneiform scribes and Elamite brokers inspect your goods. They question whether your standard weights match their local royal shekels.",
    historicalContext:
      "Excavations in Bahrain uncovered Harappan chert cubical weights alongside Mesopotamian cylinder seals, proving Dilmun served as the central clearinghouse between Meluhha (Indus) and Mesopotamia.",
    options: [
      {
        id: "opt1",
        title: "Demonstrate Standard Harappan Cubical Chert Weights",
        description:
          "Show your certified polished chert stone weights operating in the binary ratio 1 : 2 : 4 : 8 : 16 : 32.",
        risk: "Low",
        costDescription: "Formal verification before the market supervisor",
        outcomeText:
          "The Dilmun port magistrates verify your weights' accuracy to within fractions of a gram. Trust in your guild soars, and transactions proceed with zero dispute!",
        pointsDelta: 120,
        resourceOutcome: { gold: 90, reputation: 50 },
      },
      {
        id: "opt2",
        title: "Attempt to Use Unmarked River Pebbles for Quick Barter",
        description:
          "Estimate goods roughly by hand to avoid waiting in the magistrate's weighing queue.",
        risk: "High",
        costDescription: "Breaches international market protocol",
        outcomeText:
          "The scribes refuse to certify your transactions without official weight verification, forcing you to accept discounted prices from opportunistic middlemen.",
        pointsDelta: 20,
        resourceOutcome: { gold: 15, reputation: -10 },
      },
    ],
  },
  {
    stage: 4,
    location: "Port of Ur (Mesopotamia / Euphrates River)",
    scenarioTitle: "The Royal Exchange & Final Treaty",
    narrative:
      "Your fleet docks along the quayside of Ur. The High Priestess and Royal Treasury envoys arrive to inspect the Meluhhan cargo. You must negotiate the final contract.",
    historicalContext:
      "Mesopotamian records under King Sargon of Akkad (c. 2334 BCE) boast that 'the ships from Meluhha, Magan, and Dilmun tied up at the quay of Akkad.'",
    options: [
      {
        id: "opt1",
        title: "Exchange for Mesopotamian Copper Ingots, Wool & Frankincense",
        description:
          "Accept Oman/Mesopotamian copper ingots and refined oils, which are in huge demand back in Indus metallurgist guilds.",
        risk: "Low",
        costDescription: "Long-term bilateral trade partnership",
        outcomeText:
          "A triumphant trade mission! Your hold is packed with valuable copper ingots for Lothal bronze foundries, and the King of Ur seals your clay tablets with royal praise.",
        pointsDelta: 150,
        resourceOutcome: { gold: 120, reputation: 60 },
      },
      {
        id: "opt2",
        title: "Demand Immediate Payment Exclusively in Silver Dust",
        description: "Refuse raw materials and demand raw precious metal immediately.",
        risk: "Moderate",
        costDescription: "Short-term bullion gain",
        outcomeText:
          "The treasury pays you in silver, but without copper ballast your empty return voyage is harder to stabilize in choppy seas.",
        pointsDelta: 80,
        resourceOutcome: { gold: 70, reputation: 25 },
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Game 4: Decipher the Past (Symbol / Pattern Puzzle) Data                    */
/* -------------------------------------------------------------------------- */

export interface PatternPuzzleItem {
  id: number;
  title: string;
  theme: string;
  scenario: string;
  symbolSequence: {
    glyph: string;
    label: string;
    hint: string;
  }[];
  missingIndex: number;
  options: {
    id: string;
    glyph: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  educationalNote: string;
}

export const PATTERN_PUZZLES: PatternPuzzleItem[] = [
  {
    id: 1,
    title: "The Standard & Sacred Animal Motif",
    theme: "Seal Heraldry Structure",
    scenario:
      "Examine a classic Harappan square stamp seal formula. On standard administrative seals, the composition follows a rigorous balance: Animal Emblem → Standard Cult Vessel → Inscription Line.",
    symbolSequence: [
      { glyph: "🦄", label: "Unicorn Creature", hint: "Sacred mythical one-horned animal" },
      { glyph: "🏺", label: "Cult Feeding Trough", hint: "Sacred incense / offering stand" },
      { glyph: "🐟", label: "Fish Sign (Mīn)", hint: "Frequent Indus glyph" },
      { glyph: "❓", label: "Missing Inscription Element", hint: "Final terminal sign" },
    ],
    missingIndex: 3,
    options: [
      {
        id: "opt-a",
        glyph: "🏛️",
        label: "Roman Corinthian Column",
        isCorrect: false,
        explanation:
          "Incorrect. Classical Mediterranean columns belong to Greek/Roman antiquity, not the Indus Bronze Age.",
      },
      {
        id: "opt-b",
        glyph: "🏹",
        label: "Bow & Arrow Glyph",
        isCorrect: true,
        explanation:
          "Correct! The bow sign (often combined with an arrow or stroke) is one of the ~400 verified Indus script signs frequently appearing in terminal positions on seals.",
      },
      {
        id: "opt-c",
        glyph: "⚡",
        label: "Modern Electrical Bolt",
        isCorrect: false,
        explanation: "Incorrect. This is a modern icon not attested on Indus seal epigraphy.",
      },
      {
        id: "opt-d",
        glyph: "⚙️",
        label: "Industrial Cogwheel",
        isCorrect: false,
        explanation: "Incorrect. Toothed gear cogs were invented much later in history.",
      },
    ],
    educationalNote:
      "Note: The Indus script remains undeciphered to this day because texts are brief (average 5 signs) and no bilingual Rosetta-style inscription has been found. This puzzle reflects the structural pattern recognition archaeologists use to study sign frequency and syntax.",
  },
  {
    id: 2,
    title: "Standard Sign Clustering & Directionality",
    theme: "Boustrophedon & Right-to-Left Reading",
    scenario:
      "Most Indus inscriptions were written from right to left, as evidenced by sign cramming on the left edge. Identify the missing sign that completes this common Indus sign pair.",
    symbolSequence: [
      { glyph: "🐟", label: "Fish Sign (Basic)", hint: "Sign #59 in Mahadevan Corpus" },
      { glyph: "🎏", label: "Fish with Fin Modifier", hint: "Diacritical modified sign" },
      { glyph: "❓", label: "Missing Modified Sign", hint: "Roofed Fish Variant" },
      { glyph: "🌾", label: "Grain Stalk Sign", hint: "Agricultural sign symbol" },
    ],
    missingIndex: 2,
    options: [
      {
        id: "opt-a",
        glyph: "🏠",
        label: "Fish inside Roof/House Sign",
        isCorrect: true,
        explanation:
          "Correct! Indus epigrapher Iravatham Mahadevan noted that the fish sign is uniquely modified by adding roofs, fins, or internal strokes, forming systematic compound ideograms.",
      },
      {
        id: "opt-b",
        glyph: "🚀",
        label: "Modern Rocket",
        isCorrect: false,
        explanation:
          "Incorrect. Modern space iconography does not exist in ancient archaeological contexts.",
      },
      {
        id: "opt-c",
        glyph: "💻",
        label: "Silicon Computer",
        isCorrect: false,
        explanation: "Incorrect.",
      },
      {
        id: "opt-d",
        glyph: "🚲",
        label: "Bicycle",
        isCorrect: false,
        explanation: "Incorrect.",
      },
    ],
    educationalNote:
      "Epigraphers count approximately 417 distinct signs in the Indus corpus. Over 67% of inscriptions begin on the right side of the seal stamp impression.",
  },
];
