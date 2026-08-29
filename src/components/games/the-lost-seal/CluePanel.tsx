import { useState } from "react";
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
  maxScore = 650,
}: CluePanelProps) {
  const [activeTab, setActiveTab] = useState<JournalTab>("objectives");

  if (!isOpen) return null;

  const completedObjectivesCount = objectives.filter((o) => o.completed).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clue-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex h-[90vh] max-h-[720px] w-full max-w-4xl flex-col rounded-3xl border border-primary/50 bg-card p-5 sm:p-7 shadow-2xl shadow-black overflow-hidden">
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
                <span className="text-xs text-muted-foreground font-serif">
                  {ACT_TITLES[currentActId]?.title ?? "MOHENJO-DARO ARCHAEOLOGICAL EXPEDITION"}
                </span>
              </div>
              <h2
                id="clue-panel-title"
                className="font-serif text-xl sm:text-2xl font-bold text-foreground"
              >
                Archaeological Field Dossier
              </h2>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close dossier">
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
                : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background",
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
                : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Clues ({clues.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("artifacts")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "artifacts"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background",
            )}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Artifacts ({artifacts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "documents"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background",
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Documents ({documents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all shrink-0 cursor-pointer",
              activeTab === "stats"
                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background",
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
                <div className="py-16 text-center text-sm text-muted-foreground">
                  <p>Explore the excavation site to receive expedition missions.</p>
                </div>
              ) : (
                objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 transition-all",
                      obj.completed
                        ? "border-emerald-500/30 bg-emerald-950/15"
                        : "border-border/60 bg-background/50",
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {obj.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "font-serif text-sm sm:text-base font-bold",
                            obj.completed ? "text-foreground line-through opacity-85" : "text-foreground",
                          )}
                        >
                          {obj.title}
                        </h3>
                        {obj.completed && (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/40 text-[10px] text-emerald-400"
                          >
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: CLUES */}
          {activeTab === "clues" && (
            <div className="space-y-3">
              {clues.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  <p>No archaeological clues recorded yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Explore the site and inspect excavation trenches, water conduits, and tablets.
                  </p>
                </div>
              ) : (
                clues.map((clue) => (
                  <article
                    key={clue.id}
                    className="rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-2xl">
                          {clue.icon}
                        </span>
                        <div>
                          <h3 className="font-serif text-base font-bold text-foreground">
                            {clue.title}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-primary/30 text-[10px] text-primary"
                            >
                              {clue.category}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">
                              Chapter {clue.discoveredInStage} Finding
                            </span>
                          </div>
                        </div>
                      </div>

                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-foreground/90 font-medium">
                      {clue.fullNote}
                    </p>
                  </article>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ARTIFACTS */}
          {activeTab === "artifacts" && (
            <div className="space-y-3">
              {artifacts.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  <p>No cataloged artifacts yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Recover physical artifacts from storage caches, the Great Bath, and merchant warehouses.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {artifacts.map((art) => (
                    <div
                      key={art.id}
                      className="flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-4"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-2xl">
                            {art.icon}
                          </span>
                          <div>
                            <h3 className="font-serif text-sm font-bold text-foreground">
                              {art.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <span>{art.category}</span>
                              <span>•</span>
                              <span>{art.provenance}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {art.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-border/30 text-[11px] text-gold/90 font-serif">
                        {art.historicalSignificance}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  <p>No epigraphic documents deciphered yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Search scribe stations, merchant guild archives, and sacred friezes.
                  </p>
                </div>
              ) : (
                documents.map((doc) => (
                  <article
                    key={doc.id}
                    className="rounded-2xl border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{doc.icon}</span>
                        <div>
                          <h3 className="font-serif text-sm font-bold text-foreground">
                            {doc.title}
                          </h3>
                          <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">
                            {doc.docType}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-gold">
                        Deciphered
                      </Badge>
                    </div>
                    <blockquote className="my-2 border-l-2 border-primary/40 pl-3 text-xs italic text-foreground/90 font-serif">
                      "{doc.excerpt}"
                    </blockquote>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {doc.historicalContext}
                    </p>
                  </article>
                ))
              )}
            </div>
          )}

          {/* TAB 5: EXPEDITION STATS */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-primary">{clues.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Clues Logged</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-emerald-400">{artifacts.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Artifacts Found</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-gold">{documents.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Documents Decoded</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-center">
                  <div className="text-2xl font-serif font-black text-foreground">{score} / {maxScore}</div>
                  <div className="text-xs text-muted-foreground mt-1">Expedition Score</div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Expedition Synthesis: Mohenjo-daro Sector DK-G</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your archaeological exploration reconstructs the civic, economic, and administrative life of Mature Harappan society (2600–1900 BCE). Every recorded stratum, deciphered epigraphic sign, and authenticated steatite relief contributes to the complete expedition dossier.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <div className="text-xs text-muted-foreground">
            <span>Press <kbd className="rounded bg-black/60 px-1.5 py-0.5 border border-border/60 text-[10px] text-foreground font-mono">ESC</kbd> or click Close</span>
          </div>
          <Button onClick={onClose} size="sm" className="bg-primary text-black hover:bg-primary/90 font-bold">
            Return to Expedition
          </Button>
        </div>
      </div>
    </div>
  );
}

