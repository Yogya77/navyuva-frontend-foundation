import { useEffect, useState } from "react";
import {
  Sparkles,
  X,
  CheckCircle2,
  Search,
  Maximize2,
  Minimize2,
  Info,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InteractiveEntity } from "../engine/types";
import type { ArchaeologicalClue } from "../types";

interface ObjectInspectionModalProps {
  entity: InteractiveEntity | null;
  onClose: () => void;
  onClueFound?: (clue: ArchaeologicalClue) => void;
}

interface ObjectDetail {
  title: string;
  category: string;
  period: string;
  isAuthenticArtifact: boolean;
  image: string;
  imageCaption: string;
  whatYouAreSeeing: string;
  keyVisualFeatures: string[];
  historicalSignificance: string;
  clueSnippet?: string;
  clueFullNote?: string;
}

const OBJECT_DETAILS: Record<string, ObjectDetail> = {
  camp_logbook: {
    title: "DK-G Archaeological Field Journal",
    category: "Stratigraphy & Field Archives",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    imageCaption: "Excavation Stratigraphic Field Notes & Inventory — Sector DK-G",
    whatYouAreSeeing:
      "A leather-bound field logbook and archaeological records from Trench DK-G detailing stratigraphic layers, water table measurements, and missing artifact inventories.",
    keyVisualFeatures: [
      "Stratigraphic layer logs correlating with Mature Harappan brick courses",
      "Detailed excavation notes documenting the missing sovereign seal",
      "Field survey coordinate tags anchoring Sector DK-G quadrant 4",
    ],
    historicalSignificance:
      "Archaeological excavations at Mohenjo-daro uncovered evidence that elite administrative seals were carefully curated and hidden during periods of environmental crisis and urban decline.",
    clueSnippet: "Field notes confirm deliberate subterranean seal concealment.",
    clueFullNote:
      "Trench DK-G stratigraphy proves the merchant cache was sealed under intact floor flagstones prior to abandonment.",
  },
  trench_strata: {
    title: "Excavation Strata — Mature Harappan Layer",
    category: "Stratigraphy & Sedimentary Profile",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/artifacts/pottery.jpg",
    imageCaption: "Undisturbed Mature Harappan Stratigraphic Section (Trench DK-G)",
    whatYouAreSeeing:
      "A 3-meter exposed archaeological trench profile showing undisturbed Mature Harappan brick courses, alluvial silt beds, and in situ ceramic deposits.",
    keyVisualFeatures: [
      "Intact burnt-brick courses following the standardized 1:2:4 ratio",
      "Undisturbed alluvial silt layer sealing ancient floor flagstones",
      "In situ ceramic storage vessel fragments preserved in silt",
    ],
    historicalSignificance:
      "Stratigraphy establishes relative chronological dating in archaeology. Undisturbed layers in Trench DK-G confirm artifacts were sealed around 1900 BCE during ancient abandonment.",
    clueSnippet: "Stratigraphy confirms undisturbed Mature Harappan layers.",
    clueFullNote:
      "Trench DK-G stratigraphy confirms undisturbed Mature Harappan habitation layers (2600–1900 BCE).",
  },
  survey_marker: {
    title: "Archaeological Grid Datum Stake (DK-G)",
    category: "Archaeological Field Instrument",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    imageCaption: "Sector DK-G Excavation Grid Coordinates",
    whatYouAreSeeing:
      "A brass-capped hardwood survey stake anchoring Sector DK-G quadrant 4 at Mohenjo-daro, establishing the spatial grid for artifact recovery.",
    keyVisualFeatures: [
      "Engraved datum elevation index for Trench DK-G",
      "Survey coordinate marker aligning with the Citadel north boulevard",
      "Stratigraphic reference point for sub-floor chamber depths",
    ],
    historicalSignificance:
      "Modern archaeological excavation uses coordinate grid stakes to record the exact 3D provenance of every artifact discovered in urban layers.",
  },
  mound: {
    title: "Stratified Silt Excavation Mound",
    category: "Stratigraphy & Brick Collapse",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/artifacts/pottery.jpg",
    imageCaption: "Stratified Alluvial Deposit & Fired Brick Courses",
    whatYouAreSeeing:
      "A 3-meter exposed profile showing undisturbed Mature Harappan brick collapse silt, sealing ancient architectural chambers beneath intact pavers.",
    keyVisualFeatures: [
      "Standardized 1:2:4 proportion baked mud bricks",
      "Alluvial silt flood deposit preserving lower floor pavers",
      "Carbonized organic remains confirming 2600–1900 BCE chronology",
    ],
    historicalSignificance:
      "The sudden sealing of architectural chambers under silt helped preserve delicate steatite and copper artifacts from surface weathering for four millennia.",
    clueSnippet: "Stratigraphy confirms undisturbed Mature Harappan layers.",
    clueFullNote:
      "Trench DK-G stratigraphy proves the merchant cache was sealed under intact floor flagstones prior to abandonment.",
  },
  seal_impression: {
    title: "North Gate Clearance Bulla (Clay Tag)",
    category: "Clay Bulla & Epigraphy",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/indus-seal-unicorn-bovine.jpg",
    imageCaption: "Chief Magistrate Bulla Tag with Sacred Standard Seal Impression",
    whatYouAreSeeing:
      "A baked clay bulla tag fragment bearing the crisp intaglio seal impression of the city magistrate, backed with reverse cord fiber impressions.",
    keyVisualFeatures: [
      "High-relief animal emblem facing a two-tiered ritual standard",
      "Five crisp Indus script signs impressed along the top margin",
      "Reverse cord indentations proving it was wrapped around package twine",
    ],
    historicalSignificance:
      "Clay bullae were wrapped around parcel cords and stamped while wet to guarantee authenticity and clearance across ancient trade checkpoints.",
    clueSnippet: "Clay bulla confirms transit clearance into the Merchant Quarter.",
    clueFullNote:
      "The clay tag verifies that merchant consignments carrying the chief magistrate's seal were granted clearance into the northern warehouse quarter.",
  },
  northern_tablet: {
    title: "Scribe Station Ledger Archives",
    category: "Epigraphy & Trade Administration",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    imageCaption: "Merchant Guild Inscribed Accounting Tablets with Numerical Tallies",
    whatYouAreSeeing:
      "A collection of incised steatite and terracotta administrative tablets recording maritime trade consignments, lapis lazuli beads, and guild weights.",
    keyVisualFeatures: [
      "Indus pictographic signs carved in standardized right-to-left order",
      "Vertical numerical stroke counts representing commodity tallies",
      "Stamped authorization marks correlating with Merchant House 7",
    ],
    historicalSignificance:
      "Standardized accounting tablets enabled equitable commerce between Indus cities and Mesopotamian ports such as Ur and Dilmun.",
  },
  crate: {
    title: "Standardized Binary Chert Weights",
    category: "Standardized Metrology & Trade Tools",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/artifacts/blade.jpg",
    imageCaption: "Standardized Binary Chert Balance Cubes (Rohri Flint)",
    whatYouAreSeeing:
      "A set of highly polished cubical balance weights following strict binary ratios (1:2:4:8:16:32), cut from fine-grained Rohri chert with beveled edges.",
    keyVisualFeatures: [
      "Precise cubical geometry with smoothed, beveled non-chip edges",
      "Binary mass progression (unit base ~0.857 grams)",
      "Sourced from ancient flint quarries in the Rohri Hills of Sindh",
    ],
    historicalSignificance:
      "The Indus civilization enforced strictly standardized weights across 1,500 kilometers with less than 1% variance, ensuring fair taxation and merchant trust.",
    clueSnippet: "Standard binary weights (1, 2, 4, 8, 16) were used across the trade network.",
    clueFullNote:
      "Harappan merchants used standardized cubic chert weights to govern taxation and precious metal commerce.",
  },
  tablet: {
    title: "Merchant Guild Inscribed Account Tablet",
    category: "Epigraphy & Trade Notation",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    imageCaption: "Incised Miniature Epigraphic Account Tablet with Tally Strokes",
    whatYouAreSeeing:
      "An inscribed steatite tablet documenting export consignments of lapis lazuli, carnelian ornaments, and copper ingots under Zebu guild authority.",
    keyVisualFeatures: [
      "Right-to-left sign directionality with sacred emblem prefix",
      "Grouped numerical strokes (1 to 7 tallies) denoting commodity units",
      "Thin rectangular format designed for portable guild handling",
    ],
    historicalSignificance:
      "Miniature tablets were issued as customs receipts and trade tokens at city gates, proving advanced bureaucratic coordination.",
    clueSnippet: "Indus script reads Right-to-Left starting with sacred emblems.",
    clueFullNote:
      "Seal inscriptions read right-to-left, beginning with animal totems and ending with terminal signs.",
  },
  storage_jars: {
    title: "Grain & Oil Storage Amphorae (With Bullae)",
    category: "Ceramic Craft & Trade Storage",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/artifacts/pottery.jpg",
    imageCaption: "Mature Harappan Red Ware Storage Amphora with Stamped Stopper Marks",
    whatYouAreSeeing:
      "Thick-walled wheel-thrown terracotta storage amphorae coated in ferric oxide red slip, used to store export grain and oils.",
    keyVisualFeatures: [
      "Intersecting black circle slip decorations on smooth buff clay",
      "Heavy flared rim designed to hold damp clay sealing tags",
      "Tapered base set into courtyard floor sockets for stability",
    ],
    historicalSignificance:
      "Harappan master potters produced standardized high-capacity storage jars, which were plugged with clay and stamped by guild seals to preserve cargo.",
    clueSnippet: "Pottery storage jars were secured with stamped clay tags.",
    clueFullNote:
      "Harappan storage jars were plugged and sealed with square steatite stamp impressions to verify merchant goods.",
  },
  pottery_sherd: {
    title: "Red Ware Painted Ceramic Sherds",
    category: "Ceramic Craft & Epigraphy",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/artifacts/pottery.jpg",
    imageCaption: "Intersecting Circle Red Ware Ceramic Sherds",
    whatYouAreSeeing:
      "Wheel-thrown terracotta vessel fragments bearing rich ferric oxide slip with intersecting black circles.",
    keyVisualFeatures: [
      "Signature intersecting circle motif of Harappan master potters",
      "High-fired durable terracotta with mineral slip",
      "Evidence of stamped clay seal stoppers used on jars",
    ],
    historicalSignificance:
      "Ceramic analysis demonstrates extensive mass-production and guild specialization in ancient Harappan pottery workshops.",
    clueSnippet: "Pottery storage jars were secured with stamped clay tags.",
    clueFullNote:
      "Harappan storage jars were plugged and sealed with square steatite stamp impressions to verify merchant goods.",
  },
  textile_bales: {
    title: "Carbonized Export Textiles with Clay Bullae",
    category: "Textile Industry & Trade",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/harappan-bronze-bangles.jpg",
    imageCaption: "Export Consignment with Authority Sealing Tag",
    whatYouAreSeeing:
      "Carbonized cotton textile bundles bearing broken clay sealing tags (bullae) with weave imprints.",
    keyVisualFeatures: [
      "Fine woven cotton threads preserved through carbonization",
      "Reverse clay impression showing tight textile weave patterns",
      "Stamped guild insignia on the outer surface",
    ],
    historicalSignificance:
      "Indus civilization was one of the earliest to cultivate, spin, and weave cotton (*Gossypium arboreum*), exporting dyed textiles to Mesopotamia.",
    clueSnippet: "Clay bullae verify export packaging for international trade.",
    clueFullNote:
      "Export textiles were sealed with steatite stamp impressions to prevent tampering during maritime transit.",
  },
  wall_shrine: {
    title: "Zebu Bull Merchant Altar Niche",
    category: "Domestic Sacred Iconography",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/indus-seal-seven-figures-pipal.jpg",
    imageCaption: "Sacred Altar Frieze with Ritual Offerings",
    whatYouAreSeeing:
      "A recessed wall niche carved with stylized zebu horns, holding burnt terracotta oil dish lamps.",
    keyVisualFeatures: [
      "Recessed architectural niche in residential courtyard wall",
      "Burnt terracotta oil lamps and clay offerings",
      "Horned deity and bovine authority symbols",
    ],
    historicalSignificance:
      "Merchant households maintained domestic shrines dedicated to safe passage across maritime routes.",
  },
  carved_tablet: {
    title: "Carved Soapstone Testing Tablet",
    category: "Glyptic Craft & Epigraphy",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/images/artifacts/harappan-molded-tablet-plaque.jpg",
    imageCaption: "Intaglio Engraved Practice Slab",
    whatYouAreSeeing:
      "A soft steatite slab fragment displaying practice engravings of the sacred manger and zebu horns.",
    keyVisualFeatures: [
      "Practice intaglio incisions made with micro-chisels",
      "Mirror-reverse script layout reading right-to-left",
      "Soft unvitrified steatite stone test surface",
    ],
    historicalSignificance:
      "Indus seal carvers practiced intaglio relief on test slabs before firing valuable square seals in alkali kilns.",
    clueSnippet: "Indus script reads Right-to-Left, starting with sacred emblems.",
    clueFullNote:
      "Seal impressions read right-to-left, starting with the ritual offering stand, animal totem, and terminal signs.",
  },
  tool_crate: {
    title: "Field Excavation Equipment Crate",
    category: "Archaeological Tool Archive",
    period: "Modern Stratigraphic Excavation Equipment",
    isAuthenticArtifact: true,
    image: "/artifacts/blade.jpg",
    imageCaption: "Archaeological Precision Excavation Instruments",
    whatYouAreSeeing:
      "Precision archaeological micro-trowels, camel-hair dusting brushes, and vernier calipers used in Trench DK-G.",
    keyVisualFeatures: [
      "Precision measuring calipers for millimeter stratigraphy",
      "Soft micro-brushes designed to clean brittle soapstone",
      "Specimen sorting trays for ceramic sherds and seals",
    ],
    historicalSignificance:
      "Delicate tools essential for recovering brittle vitrified steatite without marring its 4,000-year-old surface glaze.",
  },
  bath_pottery: {
    title: "Submerged Storage Amphorae",
    category: "Ceramic Artifact in Hydraulic Sump",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/artifacts/pottery.jpg",
    imageCaption: "Submerged Ceramic Fragments in Bath Conduit",
    whatYouAreSeeing:
      "Thick-walled terracotta vessel fragments found in the Great Bath drainage conduit, bearing stamped clay tags.",
    keyVisualFeatures: [
      "Thick water-resistant ceramic paste",
      "Gypsum mortar traces along drainage rim",
      "Geometric slip motifs on outer shoulder",
    ],
    historicalSignificance:
      "Proves ceremonial water rituals were accompanied by votive oil libations in the Great Bath reservoir.",
  },
};

export function ObjectInspectionModal({
  entity,
  onClose,
  onClueFound,
}: ObjectInspectionModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // ESC key support to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!entity) return null;

  const details: ObjectDetail = OBJECT_DETAILS[entity.id] ?? OBJECT_DETAILS[entity.type] ?? {
    title: entity.name,
    category: "Stratigraphy & Field Specimen",
    period: "Mature Harappan (c. 2600–1900 BCE)",
    isAuthenticArtifact: true,
    image: "/artifacts/pottery.jpg",
    imageCaption: "Archaeological Specimen under Field Inspection",
    whatYouAreSeeing: "A notable archaeological feature observed in the ancient ruins of Mohenjo-daro.",
    keyVisualFeatures: [
      "Mature Harappan material composition",
      "In situ archaeological context in Mohenjo-daro DK-G",
      "Documented in expedition field dossier",
    ],
    historicalSignificance: "Field inspection and documentation recorded in the expedition dossier.",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-primary/50 bg-stone-950 p-5 sm:p-7 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-3xl shadow-inner">
              {entity.icon || "🏺"}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/15 text-[10px] uppercase font-bold text-primary"
                >
                  {details.category}
                </Badge>
                <span className="text-[11px] text-stone-400 font-mono">
                  {details.period}
                </span>
                {details.isAuthenticArtifact ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-950/30 text-[9px] uppercase font-semibold text-emerald-400"
                  >
                    Authentic Historical Reference
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 bg-amber-950/30 text-[9px] uppercase font-semibold text-amber-400"
                  >
                    Gameplay Investigation Feature
                  </Badge>
                )}
              </div>
              <h2
                id="inspection-modal-title"
                className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1"
              >
                {details.title}
              </h2>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            aria-label="Close inspection"
            className="text-stone-400 hover:text-foreground shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Large Artifact Image Showcase (High Visual Quality) */}
        <div className="mt-4 space-y-2">
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-stone-900/90 p-3 shadow-inner">
            <div
              className={`relative flex items-center justify-center bg-black/70 rounded-xl overflow-hidden transition-all duration-300 ${
                isZoomed ? "min-h-[360px] sm:min-h-[440px]" : "min-h-[220px] sm:min-h-[300px] max-h-[340px]"
              }`}
            >
              <img
                src={details.image}
                alt={details.title}
                className={`w-auto max-w-full object-contain rounded-lg transition-transform duration-300 ${
                  isZoomed ? "scale-125 cursor-zoom-out" : "max-h-[300px] hover:scale-105 cursor-zoom-in"
                }`}
                loading="eager"
                onClick={() => setIsZoomed((prev) => !prev)}
              />

              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-black/80 border border-primary/40 text-primary hover:bg-black text-xs transition-colors"
                title={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>

            {details.imageCaption && (
              <div className="mt-2.5 flex items-center justify-between px-1 text-xs">
                <span className="font-serif text-[11px] font-semibold text-stone-300 italic">
                  {details.imageCaption}
                </span>
                <span className="font-mono text-[10px] text-stone-500">
                  {isZoomed ? "Click image to reset zoom" : "Click image to inspect detail"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Hierarchy: What You Are Seeing + Key Features + Historical Significance */}
        <div className="mt-5 space-y-4 text-xs">
          {/* 1. What You Are Seeing */}
          <div className="rounded-xl border border-primary/20 bg-stone-900/60 p-3.5">
            <span className="flex items-center gap-1.5 font-serif text-[11px] font-bold uppercase tracking-wider text-primary">
              <Info className="h-3.5 w-3.5" />
              What You Are Seeing:
            </span>
            <p className="mt-1.5 leading-relaxed text-stone-200 text-[12px] font-medium">
              {details.whatYouAreSeeing}
            </p>
          </div>

          {/* 2. Key Visual Features */}
          {details.keyVisualFeatures && details.keyVisualFeatures.length > 0 && (
            <div className="rounded-xl border border-border/50 bg-stone-900/70 p-3.5">
              <span className="flex items-center gap-1.5 font-serif text-[11px] font-bold uppercase tracking-wider text-gold">
                <Layers className="h-3.5 w-3.5" />
                Key Visual Features to Observe:
              </span>
              <ul className="mt-2 space-y-1.5 pl-1 text-[11px] text-stone-300">
                {details.keyVisualFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Historical Significance */}
          <div className="rounded-xl border border-border/50 bg-stone-900/70 p-3.5">
            <span className="flex items-center gap-1.5 font-serif text-[11px] font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Historical Significance:
            </span>
            <p className="mt-1.5 leading-relaxed text-stone-300 text-[11px]">
              {details.historicalSignificance}
            </p>
          </div>

          {/* Evidence Notification Banner */}
          {details.clueSnippet && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-emerald-200">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
              <div className="text-xs">
                <span className="font-serif font-bold text-emerald-300">
                  Archaeological Evidence Recorded (+50 pts)
                </span>
                <p className="text-[11px] text-emerald-100/90">{details.clueSnippet}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
          <span className="text-[11px] text-stone-400">
            Press <kbd className="rounded bg-black px-1.5 py-0.5 border border-border/60 text-[10px] text-foreground font-mono">ESC</kbd> or click to resume
          </span>
          <Button
            onClick={onClose}
            size="sm"
            className="bg-primary text-black font-serif font-bold tracking-wider uppercase hover:bg-primary/90 px-5 py-2 text-xs"
          >
            Resume Exploration
          </Button>
        </div>
      </div>
    </div>
  );
}
