import { useState, useEffect } from "react";
import {
  Scroll,
  X,
  CheckCircle2,
  Circle,
  Package,
  FileText,
  Compass,
  Trophy,
  Sparkles,
  Eye,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  ArchaeologicalClue,
  JournalArtifact,
  JournalDocument,
  ExpeditionObjective,
} from "./types";
import { cn } from "@/lib/utils";

interface CluePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentActId?: "act-1-discovery" | "act-2-lost-city" | "act-3-merchant-quarter" | "act-4-sealed-sanctum";
  objectives?: ExpeditionObjective[];
  clues: ArchaeologicalClue[];
  artifacts?: JournalArtifact[];
  documents?: JournalDocument[];
  score?: number;
  maxScore?: number;
}

type JournalTab = "objectives" | "clues" | "artifacts" | "documents" | "stats";

interface InspectPreviewData {
  title: string;
  category: string;
  image?: string | undefined;
  imageCaption?: string | undefined;
  icon: string;
  description: string;
  historicalContext?: string | undefined;
}

const ACT_TITLES: Record<string, { actNumber: string; title: string }> = {
  "act-1-discovery": { actNumber: "CHAPTER 1", title: "THE LOST CITY — EXCAVATION CAMP" },
  "act-2-lost-city": { actNumber: "CHAPTER 1", title: "THE LOST CITY — CITADEL & GREAT BATH" },
  "act-3-merchant-quarter": { actNumber: "CHAPTER 2", title: "THE MERCHANT QUARTER" },
  "act-4-sealed-sanctum": { actNumber: "CHAPTER 3", title: "THE SEALED SANCTUM" },
};

export function CluePanel({
  isOpen,
  onClose,
  currentActId = "act-1-discovery",
  objectives = [],
  clues,
  artifacts = [],
  documents = [],
  score = 0,
  maxScore = 800,
}: CluePanelProps) {
  const [activeTab, setActiveTab] = useState<JournalTab>("objectives");
  const [inspectPreview, setInspectPreview] = useState<InspectPreviewData | null>(null);

  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (inspectPreview) {
          setInspectPreview(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, inspectPreview]);

  if (!isOpen) return null;

  const completedObjectivesCount = objectives.filter((o) => o.completed).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clue-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex h-[90vh] max-h-[740px] w-full max-w-4xl flex-col rounded-3xl border border-primary/50 bg-stone-950 p-5 sm:p-7 shadow-2xl shadow-black overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary shadow-inner">
              <Scroll className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/15 text-[10px] uppercase font-bold text-primary"
                >
                  {ACT_TITLES[currentActId]?.actNumber ?? "EXPEDITION"}
                </Badge>
                <span className="text-xs text-stone-400 font-serif">
                  {ACT_TITLES[currentActId]?.title ?? "MOHENJO-DARO ARCHAEOLOGICAL EXPEDITION"}
                </span>
              </div>
              <h2
                id="clue-panel-title"
                className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-0.5"
              >
                Archaeological Field Dossier
              </h2>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            aria-label="Close dossier"
            className="text-stone-400 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto border-b border-border/30 pb-2.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("objectives")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "objectives"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-stone-900 text-stone-400 hover:text-foreground hover:bg-stone-800",
            )}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Objectives ({completedObjectivesCount}/{objectives.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clues")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "clues"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-stone-900 text-stone-400 hover:text-foreground hover:bg-stone-800",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Clues & Evidence ({clues.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("artifacts")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "artifacts"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-stone-900 text-stone-400 hover:text-foreground hover:bg-stone-800",
            )}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Recovered Artifacts ({artifacts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "documents"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-stone-900 text-stone-400 hover:text-foreground hover:bg-stone-800",
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Deciphered Documents ({documents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "stats"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-stone-900 text-stone-400 hover:text-foreground hover:bg-stone-800",
            )}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Expedition Stats</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {/* TAB 1: OBJECTIVES */}
          {activeTab === "objectives" && (
            <div className="space-y-3">
              {objectives.length === 0 ? (
                <div className="py-16 text-center text-sm text-stone-400">
                  <p>Explore the excavation site to receive expedition missions.</p>
                </div>
              ) : (
                objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 transition-all",
                      obj.completed
                        ? "border-emerald-500/30 bg-emerald-950/20"
                        : "border-border/60 bg-stone-900/60",
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {obj.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-stone-500" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={cn(
                            "font-serif text-sm sm:text-base font-bold",
                            obj.completed ? "text-stone-300 line-through opacity-85" : "text-foreground",
                          )}
                        >
                          {obj.title}
                        </h3>
                        {obj.completed ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/40 text-[10px] text-emerald-400 shrink-0"
                          >
                            Completed ✓
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-primary/30 text-[10px] text-primary shrink-0"
                          >
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: CLUES & EVIDENCE (WITH LARGE CRISP THUMBNAILS & INSPECT ON CLICK) */}
          {activeTab === "clues" && (
            <div className="space-y-3">
              {clues.length === 0 ? (
                <div className="py-16 text-center text-sm text-stone-400">
                  <p>No archaeological clues recorded yet.</p>
                  <p className="mt-1 text-xs text-stone-500">
                    Explore the site and inspect excavation trenches, water conduits, and tablets.
                  </p>
                </div>
              ) : (
                clues.map((clue) => (
                  <article
                    key={clue.id}
                    onClick={() =>
                      setInspectPreview({
                        title: clue.title,
                        category: clue.category,
                        image: clue.image,
                        imageCaption: clue.imageCaption,
                        icon: clue.icon,
                        description: clue.fullNote,
                      })
                    }
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-border/60 bg-stone-900/60 p-4 transition-all hover:border-primary/60 hover:bg-stone-900 cursor-pointer shadow-md"
                  >
                    {clue.image && (
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-primary/40 bg-black/80 p-1.5 flex items-center justify-center group-hover:border-primary transition-colors">
                        <img
                          src={clue.image}
                          alt={clue.title}
                          className="h-full w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <ZoomIn className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{clue.icon}</span>
                            <h3 className="font-serif text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                              {clue.title}
                            </h3>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-primary/30 text-[10px] text-primary"
                            >
                              {clue.category}
                            </Badge>
                            <span className="text-[11px] text-stone-400 font-mono">
                              Chapter {clue.discoveredInStage} Finding
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-primary opacity-80 group-hover:opacity-100">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-[10px] hidden sm:inline font-mono">Inspect</span>
                        </div>
                      </div>

                      <p className="mt-2.5 text-xs leading-relaxed text-stone-200 font-medium">
                        {clue.fullNote}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ARTIFACTS (WITH LARGE CRISP THUMBNAILS & INSPECT ON CLICK) */}
          {activeTab === "artifacts" && (
            <div className="space-y-3">
              {artifacts.length === 0 ? (
                <div className="py-16 text-center text-sm text-stone-400">
                  <p>No cataloged physical artifacts yet.</p>
                  <p className="mt-1 text-xs text-stone-500">
                    Recover physical artifacts from storage caches, the Great Bath, and merchant warehouses.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {artifacts.map((art) => (
                    <div
                      key={art.id}
                      onClick={() =>
                        setInspectPreview({
                          title: art.name,
                          category: `${art.category} • ${art.period}`,
                          image: art.image,
                          imageCaption: `${art.provenance}`,
                          icon: art.icon,
                          description: art.description,
                          historicalContext: art.historicalSignificance,
                        })
                      }
                      className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-stone-900/60 p-4 transition-all hover:border-primary/60 hover:bg-stone-900 cursor-pointer shadow-md"
                    >
                      <div>
                        {art.image && (
                          <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl border border-primary/40 bg-black/80 p-2 flex items-center justify-center group-hover:border-primary transition-colors">
                            <img
                              src={art.image}
                              alt={art.name}
                              className="h-full w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                              <ZoomIn className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="text-xl">{art.icon}</span>
                          <div>
                            <h3 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {art.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                              <span>{art.category}</span>
                              <span>•</span>
                              <span>{art.provenance}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed mt-2">
                          {art.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-border/30 text-[11px] text-gold font-serif">
                        {art.historicalSignificance}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOCUMENTS (WITH LARGE CRISP THUMBNAILS & INSPECT ON CLICK) */}
          {activeTab === "documents" && (
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="py-16 text-center text-sm text-stone-400">
                  <p>No epigraphic documents deciphered yet.</p>
                  <p className="mt-1 text-xs text-stone-500">
                    Search scribe stations, merchant guild archives, and sacred friezes.
                  </p>
                </div>
              ) : (
                documents.map((doc) => (
                  <article
                    key={doc.id}
                    onClick={() =>
                      setInspectPreview({
                        title: doc.title,
                        category: doc.docType,
                        image: doc.image,
                        imageCaption: doc.transcription,
                        icon: doc.icon,
                        description: `"${doc.excerpt}"`,
                        historicalContext: doc.historicalContext,
                      })
                    }
                    className="group flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-border/60 bg-stone-900/60 p-4 transition-all hover:border-primary/60 hover:bg-stone-900 cursor-pointer shadow-md"
                  >
                    {doc.image && (
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-primary/40 bg-black/80 p-1.5 flex items-center justify-center group-hover:border-primary transition-colors">
                        <img
                          src={doc.image}
                          alt={doc.title}
                          className="h-full w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <ZoomIn className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{doc.icon}</span>
                          <div>
                            <h3 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {doc.title}
                            </h3>
                            <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">
                              {doc.docType}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-gold shrink-0">
                          Deciphered ✓
                        </Badge>
                      </div>
                      <blockquote className="my-2 border-l-2 border-primary/40 pl-3 text-xs italic text-stone-200 font-serif">
                        &ldquo;{doc.excerpt}&rdquo;
                      </blockquote>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        {doc.historicalContext}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* TAB 5: EXPEDITION STATS */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-border/60 bg-stone-900/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-primary">{clues.length}</div>
                  <div className="text-xs text-stone-400 mt-1">Clues Logged</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-stone-900/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-emerald-400">{artifacts.length}</div>
                  <div className="text-xs text-stone-400 mt-1">Artifacts Found</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-stone-900/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-gold">{documents.length}</div>
                  <div className="text-xs text-stone-400 mt-1">Documents Decoded</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-stone-900/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-foreground">{score} / {maxScore}</div>
                  <div className="text-xs text-stone-400 mt-1">Expedition Score</div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Expedition Synthesis: Mohenjo-daro Sector DK-G</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Your archaeological exploration reconstructs the civic, economic, and administrative life of Mature Harappan society (2600–1900 BCE). Every recorded stratum, deciphered epigraphic sign, and authenticated steatite relief contributes to the complete expedition dossier.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Full Image / Inspection Preview Overlay inside Dossier */}
        {inspectPreview && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-primary/50 bg-stone-950 p-6 shadow-2xl">
              <div className="flex items-start justify-between border-b border-border/40 pb-3">
                <div>
                  <Badge variant="outline" className="border-primary/40 text-[10px] text-primary">
                    {inspectPreview.category}
                  </Badge>
                  <h3 className="font-serif text-lg font-bold text-foreground mt-1">
                    {inspectPreview.title}
                  </h3>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setInspectPreview(null)}
                  className="text-stone-400 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {inspectPreview.image && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-primary/40 bg-black/80 p-3">
                  <div className="flex items-center justify-center max-h-[260px] min-h-[180px]">
                    <img
                      src={inspectPreview.image}
                      alt={inspectPreview.title}
                      className="max-h-[240px] w-auto max-w-full object-contain rounded-lg"
                    />
                  </div>
                  {inspectPreview.imageCaption && (
                    <div className="mt-2 text-center font-serif text-[11px] text-stone-300 italic">
                      {inspectPreview.imageCaption}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 space-y-2 text-xs leading-relaxed text-stone-200">
                <p>{inspectPreview.description}</p>
                {inspectPreview.historicalContext && (
                  <div className="mt-2 rounded-xl border border-border/40 bg-stone-900/60 p-3 text-stone-300">
                    <span className="font-serif font-bold text-primary text-[11px] block uppercase">
                      Historical Significance:
                    </span>
                    <p className="mt-1">{inspectPreview.historicalContext}</p>
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-end border-t border-border/40 pt-3">
                <Button
                  onClick={() => setInspectPreview(null)}
                  size="sm"
                  className="bg-primary text-black font-bold text-xs"
                >
                  Back to Dossier
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <div className="text-xs text-stone-400">
            <span>Press <kbd className="rounded bg-black px-1.5 py-0.5 border border-border/60 text-[10px] text-foreground font-mono">ESC</kbd> or click Close</span>
          </div>
          <Button onClick={onClose} size="sm" className="bg-primary text-black font-serif font-bold hover:bg-primary/90">
            Return to Expedition
          </Button>
        </div>
      </div>
    </div>
  );
}
