import { Scroll, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ArchaeologicalClue } from "./types";

interface CluePanelProps {
  isOpen: boolean;
  onClose: () => void;
  clues: ArchaeologicalClue[];
}

export function CluePanel({ isOpen, onClose, clues }: CluePanelProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clue-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Scroll className="h-5 w-5" />
            </span>
            <div>
              <h2 id="clue-panel-title" className="font-serif text-xl font-bold text-foreground">
                Archaeological Field Dossier
              </h2>
              <p className="text-xs text-muted-foreground">
                {clues.length} {clues.length === 1 ? "Clue" : "Clues"} Recorded from Mohenjo-daro
                Excavation
              </p>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close dossier">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {clues.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <p>No clues uncovered yet.</p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Inspect interactive objects in the excavation trench to record evidence.
              </p>
            </div>
          ) : (
            clues.map((clue) => (
              <article
                key={clue.id}
                className="rounded-xl border border-border/50 bg-background/60 p-4 transition-all hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-2xl">
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
                          Stage {clue.discoveredInStage} Finding
                        </span>
                      </div>
                    </div>
                  </div>

                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-foreground/90">{clue.fullNote}</p>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-border/40 pt-4 text-right">
          <Button
            onClick={onClose}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Close Dossier
          </Button>
        </div>
      </div>
    </div>
  );
}
