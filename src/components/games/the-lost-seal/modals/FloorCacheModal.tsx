import { Sparkles, X, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FloorCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export function FloorCacheModal({ isOpen, onClose, onUnlocked }: FloorCacheModalProps) {
  if (!isOpen) return null;

  const handleOpenCache = () => {
    onUnlocked();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-primary/50 bg-card p-6 shadow-2xl shadow-black">
        <div className="flex items-start justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-3xl">
              🔷
            </span>
            <div>
              <Badge
                variant="outline"
                className="border-primary/30 text-[10px] uppercase text-primary"
              >
                Area 4 • Secret Architectural Vault
              </Badge>
              <h2 className="font-serif text-lg font-bold text-foreground">
                Mortared Sub-Floor Flagstone Cache
              </h2>
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
          <p>
            Underneath the merchant warehouse floor flagstones, you notice hairline seams of white
            gypsum mortar. Prying the stone pavers loose reveals an undisturbed subterranean passage
            leading into the <strong className="text-foreground">Sealed Chamber</strong>.
          </p>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 text-emerald-200">
            <div className="flex items-center gap-2 font-serif font-bold text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Subterranean Passage Discovered (+100 pts)
            </div>
            <p className="mt-1 text-[11px] text-emerald-100/90">
              The doorway to the inner sanctum is now open. Walk east into Area 5 to recover the
              master Steatite Seal!
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-border/40 pt-4">
          <Button
            onClick={handleOpenCache}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            Enter Sealed Sanctum <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
