import { Sparkles, X, CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InteractiveEntity } from "../engine/types";
import type { ArchaeologicalClue } from "../types";

interface ObjectInspectionModalProps {
  entity: InteractiveEntity | null;
  onClose: () => void;
  onClueFound?: (clue: ArchaeologicalClue) => void;
}

const OBJECT_DETAILS: Record<
  string,
  {
    title: string;
    category: "Stratigraphy" | "Epigraphy" | "Iconography" | "Trade";
    observation: string;
    analysis: string;
    clueSnippet?: string;
    clueFullNote?: string;
  }
> = {
  survey_marker: {
    title: "Archaeological Grid Datum Stake (DK-G)",
    category: "Stratigraphy",
    observation:
      "A brass-capped hardwood survey stake anchoring Sector DK-G quadrant 4 at Mohenjo-daro.",
    analysis:
      "This datum point aligns precisely with the grand north-south thoroughfare connecting the lower-town merchant guild with the Great Bath citadel.",
  },
  mound: {
    title: "Stratified Silt Excavation Mound",
    category: "Stratigraphy",
    observation:
      "A 3-meter exposed profile showing undisturbed Mature Harappan brick collapse silt.",
    analysis:
      "Charred timber and unbroken floor pavers indicate the merchant building was sealed suddenly around 1900 BCE, preserving artifacts in pristine subterranean chambers.",
    clueSnippet: "Stratigraphy confirms undisturbed Mature Harappan layers.",
    clueFullNote:
      "Trench DK-G stratigraphy proves the merchant cache was sealed under intact floor flagstones prior to abandonment.",
  },
  pottery_sherd: {
    title: "Red Ware Painted Ceramic Sherds",
    category: "Trade",
    observation:
      "Wheel-thrown terracotta vessel fragments bearing rich ferric oxide slip with intersecting black circles.",
    analysis:
      "Intersecting circle motifs were the guild hallmark of Harappan master potters. These large amphorae were sealed with wet clay tags stamped by authority seals.",
    clueSnippet: "Pottery storage jars were secured with stamped clay tags.",
    clueFullNote:
      "Harappan storage jars were plugged and sealed with square steatite stamp impressions to verify merchant goods.",
  },
  carved_tablet: {
    title: "Carved Soapstone Testing Tablet",
    category: "Epigraphy",
    observation:
      "A soft steatite slab fragment displaying practice engravings of the sacred manger and zebu horns.",
    analysis:
      "Indus seal carvers practiced intaglio relief on test slabs. Notice sign cramming on the left: Indus inscriptions were carved in reverse so impressions read right-to-left.",
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
  },
  storage_jars: {
    title: "Shattered Grain Storage Amphorae",
    category: "Trade",
    observation:
      "Massive conical-base storage jars filled with carbonized barley grains and dried dates.",
    analysis:
      "This corner served domestic food rations. High-value administrative seals were never stored in open food grain jars.",
  },
  textile_bales: {
    title: "Carbonized Export Textiles with Clay Bullae",
    category: "Trade",
    observation: "Carbonized cotton textile bundles bearing broken clay sealing tags (bullae).",
    analysis:
      "Clay tags with reverse cloth weave imprints prove goods were stamped here before being shipped through Lothal to Mesopotamia.",
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
  },
};

export function ObjectInspectionModal({
  entity,
  onClose,
  onClueFound,
}: ObjectInspectionModalProps) {
  if (!entity) return null;

  const details = OBJECT_DETAILS[entity.type] ?? {
    title: entity.name,
    category: "Stratigraphy" as const,
    observation: "A notable archaeological feature in the ancient ruins.",
    analysis: "Field inspection underway.",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-primary/50 bg-card p-6 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-3xl">
              {entity.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/30 text-[10px] uppercase text-primary"
                >
                  {details.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{entity.zone}</span>
              </div>
              <h2 className="font-serif text-lg font-bold text-foreground sm:text-xl">
                {details.title}
              </h2>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close inspection">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Physical Observation:
            </span>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {details.observation}
            </p>
          </div>

          <div className="rounded-xl border border-border/40 bg-background/60 p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Archaeological Analysis:
            </span>
            <p className="mt-0.5 text-xs leading-relaxed text-foreground/90">{details.analysis}</p>
          </div>

          {/* Clue notification if present */}
          {details.clueSnippet && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3 text-emerald-200">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
              <div className="text-xs">
                <span className="font-serif font-bold text-emerald-300">
                  Archaeological Clue Recorded (+50 pts)
                </span>
                <p className="text-[11px] text-emerald-100/80">{details.clueSnippet}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
          <span className="text-xs text-muted-foreground">
            Press Esc or click to resume walking
          </span>
          <Button
            onClick={onClose}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Resume Exploration
          </Button>
        </div>
      </div>
    </div>
  );
}
