import { useEffect } from "react";
import { Sparkles, X, CheckCircle2, Search, Image as ImageIcon } from "lucide-react";
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
  category: "Stratigraphy" | "Epigraphy" | "Iconography" | "Trade";
  observation: string;
  analysis: string;
  image: string;
  imageCaption: string;
  clueSnippet?: string;
  clueFullNote?: string;
}

const OBJECT_DETAILS: Record<string, ObjectDetail> = {
  camp_logbook: {
    title: "DK-G Archaeological Field Journal",
    category: "Stratigraphy",
    observation:
      "A leather-bound excavation logbook documenting Mature Harappan habitation layers (2600–1900 BCE) in Trench DK-G, noting missing artifact records.",
    analysis:
      "Stratigraphic analysis indicates the Master Steatite Stamp Seal was deliberately concealed in a subterranean architectural cache prior to the abandonment of Mohenjo-daro.",
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    imageCaption: "Excavation Field Notes & Stratigraphic Inventory — Trench DK-G",
    clueSnippet: "Field notes confirm deliberate subterranean seal concealment.",
    clueFullNote:
      "Trench DK-G stratigraphy proves the merchant cache was sealed under intact floor flagstones prior to abandonment.",
  },
  trench_strata: {
    title: "Excavation Trench DK-G Stratigraphy",
    category: "Stratigraphy",
    observation:
      "Exposed 3-meter stratigraphic profile displaying intact Mature Harappan brick courses and alluvial silt seals.",
    analysis:
      "The undisturbed silt profile proves the subterranean architectural features were sealed during antiquity, preserving all votive and economic contents in situ.",
    image: "/artifacts/pottery.jpg",
    imageCaption: "Undisturbed Mature Harappan Stratigraphic Layer (2600–1900 BCE)",
    clueSnippet: "Stratigraphy confirms undisturbed Mature Harappan layers.",
    clueFullNote:
      "Trench DK-G stratigraphy confirms undisturbed Mature Harappan habitation layers (2600–1900 BCE).",
  },
  survey_marker: {
    title: "Archaeological Grid Datum Stake (DK-G)",
    category: "Stratigraphy",
    observation:
      "A brass-capped hardwood survey stake anchoring Sector DK-G quadrant 4 at Mohenjo-daro.",
    analysis:
      "This datum point aligns precisely with the grand north-south thoroughfare connecting the lower-town merchant guild with the Great Bath citadel.",
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    imageCaption: "Sector DK-G Excavation Grid Coordinates",
  },
  mound: {
    title: "Stratified Silt Excavation Mound",
    category: "Stratigraphy",
    observation:
      "A 3-meter exposed profile showing undisturbed Mature Harappan brick collapse silt.",
    analysis:
      "Charred timber and unbroken floor pavers indicate the merchant building was sealed suddenly around 1900 BCE, preserving artifacts in pristine subterranean chambers.",
    image: "/artifacts/pottery.jpg",
    imageCaption: "Stratified Alluvial Deposit & Fired Brick Courses",
    clueSnippet: "Stratigraphy confirms undisturbed Mature Harappan layers.",
    clueFullNote:
      "Trench DK-G stratigraphy proves the merchant cache was sealed under intact floor flagstones prior to abandonment.",
  },
  seal_impression: {
    title: "Monumental Gate Seal Impression (Clay Bulla)",
    category: "Epigraphy",
    observation:
      "A baked clay bulla tag fragment bearing the crisp intaglio seal impression of the city magistrate, backed with cord weave imprints.",
    analysis:
      "Confirms that the northern monumental archway leads directly into the Merchant Quarter warehouse complex and that transit clearance was authorized.",
    image: "/images/artifacts/indus-seal-unicorn-bovine.jpg",
    imageCaption: "Authentic Magistrate Seal Impression on Terracotta Bulla Tag",
    clueSnippet: "Clay bulla confirms transit clearance into the Merchant Quarter.",
    clueFullNote:
      "The clay tag verifies that merchant consignments carrying the chief magistrate's seal were granted clearance into the northern warehouse quarter.",
  },
  northern_tablet: {
    title: "Inscribed Soapstone Testing Slab",
    category: "Epigraphy",
    observation:
      "A soft steatite slab fragment displaying practice engravings of the sacred feeding manger and zebu horns.",
    analysis:
      "Indus seal carvers practiced intaglio relief on test slabs. Seal inscriptions were carved in reverse so impressions read right-to-left.",
    image: "/images/artifacts/harappan-molded-tablet-plaque.jpg",
    imageCaption: "Molded Epigraphic Tablet with Sacred Iconography",
  },
  crate: {
    title: "Standardized Binary Chert Weights",
    category: "Trade",
    observation:
      "Set of highly polished cubic chert balance weights following strict binary ratios (1:2:4:8:16:32) cut from fine Rohri chert.",
    analysis:
      "The Indus civilization enforced strictly standardized metrology from Sindh to Gujarat, essential for guild trade taxation and commodity valuation.",
    image: "/artifacts/blade.jpg",
    imageCaption: "Standardized Binary Chert Cubes (Indus Metrology System)",
    clueSnippet: "Standard binary weights (1, 2, 4, 8, 16) were used across the trade network.",
    clueFullNote:
      "Harappan merchants used standardized cubic chert weights to govern taxation and precious metal commerce.",
  },
  tablet: {
    title: "Merchant Guild Inscribed Account Tablet",
    category: "Epigraphy",
    observation:
      "Inscribed steatite tablet documenting maritime trade goods, lapis lazuli beads, and grain export quantities with numerical tally marks.",
    analysis:
      "Features Indus pictographic signs alongside standardized numerical tally marks governing merchant transactions across the Arabian Sea.",
    image: "/images/artifacts/harappa-miniature-script-tablets.jpg",
    imageCaption: "Incised Miniature Epigraphic Account Tablet with Tally Strokes",
    clueSnippet: "Indus script reads Right-to-Left starting with sacred emblems.",
    clueFullNote:
      "Seal inscriptions read right-to-left, beginning with animal totems and ending with terminal signs.",
  },
  storage_jars: {
    title: "Grain & Oil Storage Amphorae (With Bullae)",
    category: "Trade",
    observation:
      "Massive wheel-thrown terracotta storage jars with thick rim collars, stamped with clay seal tags to prevent tampering.",
    analysis:
      "Harappan warehouses stored export grain, sesame oil, and dried fruits in standardized vessels stamped by guild inspectors before maritime transport.",
    image: "/artifacts/pottery.jpg",
    imageCaption: "Mature Harappan Red Ware Storage Amphora",
    clueSnippet: "Pottery storage jars were secured with stamped clay tags.",
    clueFullNote:
      "Harappan storage jars were plugged and sealed with square steatite stamp impressions to verify merchant goods.",
  },
  pottery_sherd: {
    title: "Red Ware Painted Ceramic Sherds",
    category: "Trade",
    observation:
      "Wheel-thrown terracotta vessel fragments bearing rich ferric oxide slip with intersecting black circles.",
    analysis:
      "Intersecting circle motifs were the guild hallmark of Harappan master potters. These large amphorae were sealed with wet clay tags stamped by authority seals.",
    image: "/artifacts/pottery.jpg",
    imageCaption: "Intersecting Circle Red Ware Ceramic Sherds",
    clueSnippet: "Pottery storage jars were secured with stamped clay tags.",
    clueFullNote:
      "Harappan storage jars were plugged and sealed with square steatite stamp impressions to verify merchant goods.",
  },
  textile_bales: {
    title: "Carbonized Export Textiles with Clay Bullae",
    category: "Trade",
    observation: "Carbonized cotton textile bundles bearing broken clay sealing tags (bullae).",
    analysis:
      "Clay tags with reverse cloth weave imprints prove goods were stamped here before being shipped through Lothal to Mesopotamia.",
    image: "/images/artifacts/harappan-bronze-bangles.jpg",
    imageCaption: "Export Textile Consignment with Authority Seal Tag",
    clueSnippet: "Clay bullae verify export packaging for international trade.",
    clueFullNote:
      "Export textiles were sealed with steatite stamp impressions to prevent tampering during maritime transit.",
  },
  wall_shrine: {
    title: "Zebu Bull Merchant Altar Niche",
    category: "Iconography",
    observation:
      "A recessed wall niche carved with stylized zebu horns, holding burnt terracotta oil dish lamps.",
    analysis:
      "The merchant lineage dedicated prayers here for safe passage across the Arabian Sea. But the master stamp seal was stored in a secret architectural vault.",
    image: "/images/artifacts/indus-seal-seven-figures-pipal.jpg",
    imageCaption: "Sacred Altar Frieze with Ritual Offerings",
  },
  carved_tablet: {
    title: "Carved Soapstone Testing Tablet",
    category: "Epigraphy",
    observation:
      "A soft steatite slab fragment displaying practice engravings of the sacred manger and zebu horns.",
    analysis:
      "Indus seal carvers practiced intaglio relief on test slabs. Notice sign cramming on the left: Indus inscriptions were carved in reverse so impressions read right-to-left.",
    image: "/images/artifacts/harappan-molded-tablet-plaque.jpg",
    imageCaption: "Intaglio Engraved Practice Slab",
    clueSnippet: "Indus script reads Right-to-Left, starting with sacred emblems.",
    clueFullNote:
      "Seal impressions read right-to-left, starting with the ritual offering stand, animal totem, and terminal signs.",
  },
  tool_crate: {
    title: "Field Excavation Equipment Crate",
    category: "Stratigraphy",
    observation:
      "Precision archaeological micro-trowels, camel-hair dusting brushes, and vernier calipers.",
    analysis:
      "Delicate tools essential for recovering brittle vitrified steatite without marring its 4,000-year-old surface glaze.",
    image: "/artifacts/blade.jpg",
    imageCaption: "Archaeological Precision Excavation Instruments",
  },
  bath_pottery: {
    title: "Submerged Storage Amphorae",
    category: "Trade",
    observation:
      "Thick-walled terracotta vessel fragments found in the Great Bath drainage conduit.",
    analysis:
      "Bearing geometric slip motifs and evidence of stamped clay stopper tags used to seal trade liquids.",
    image: "/artifacts/pottery.jpg",
    imageCaption: "Submerged Ceramic Fragments in Bath Conduit",
  },
};

export function ObjectInspectionModal({
  entity,
  onClose,
  onClueFound,
}: ObjectInspectionModalProps) {
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

  const details = OBJECT_DETAILS[entity.id] ?? OBJECT_DETAILS[entity.type] ?? {
    title: entity.name,
    category: "Stratigraphy" as const,
    observation: "A notable archaeological feature observed in the ancient ruins.",
    analysis: "Field inspection and documentation recorded in the expedition dossier.",
    image: "/artifacts/pottery.jpg",
    imageCaption: "Archaeological Specimen under Field Inspection",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary/50 bg-stone-950 p-5 sm:p-7 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-3xl shadow-inner">
              {entity.icon || "🏺"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/15 text-[10px] uppercase font-bold text-primary"
                >
                  {details.category}
                </Badge>
                <span className="text-xs text-stone-400 font-serif">{entity.zone}</span>
              </div>
              <h2
                id="inspection-modal-title"
                className="font-serif text-lg sm:text-xl font-bold text-foreground mt-0.5"
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
            className="text-stone-400 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Artifact Image Showcase */}
        <div className="mt-4 space-y-2">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-stone-900/90 p-2 shadow-inner">
            <div className="relative flex items-center justify-center bg-black/60 rounded-xl overflow-hidden min-h-[180px] sm:min-h-[220px] max-h-[260px]">
              <img
                src={details.image}
                alt={details.title}
                className="max-h-[240px] w-auto max-w-full object-contain rounded-lg transition-transform duration-300 hover:scale-105"
                loading="eager"
              />
            </div>
            {details.imageCaption && (
              <div className="mt-2 text-center">
                <span className="font-serif text-[11px] font-semibold text-stone-300 italic">
                  {details.imageCaption}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Observation & Archaeological Analysis */}
        <div className="mt-4 space-y-3.5 text-xs">
          <div>
            <span className="font-serif text-[10px] font-bold uppercase tracking-wider text-primary">
              Physical Observation:
            </span>
            <p className="mt-1 leading-relaxed text-stone-300 font-medium">
              {details.observation}
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-stone-900/70 p-3.5">
            <span className="font-serif text-[10px] font-bold uppercase tracking-wider text-primary">
              Archaeological Analysis:
            </span>
            <p className="mt-1 leading-relaxed text-stone-200">{details.analysis}</p>
          </div>

          {/* Clue notification if present */}
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
            className="bg-primary text-black font-serif font-bold tracking-wider uppercase hover:bg-primary/90"
          >
            Resume Exploration
          </Button>
        </div>
      </div>
    </div>
  );
}
