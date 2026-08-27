import { Link } from "@tanstack/react-router";
import {
  Award,
  Landmark,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Scroll,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LostSealCompletionProps {
  score: number;
  maxScore: number;
  accuracy: number;
  cluesCount: number;
  hintsUsed: number;
  onReplay: () => void;
  onBackToGames: () => void;
}

export function LostSealCompletion({
  score,
  maxScore,
  accuracy,
  cluesCount,
  hintsUsed,
  onReplay,
  onBackToGames,
}: LostSealCompletionProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-primary/50 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 text-center shadow-2xl shadow-primary/20">
      {/* Badge & Glow */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-primary">
        <Sparkles className="h-4 w-4 animate-spin" />
        Archaeological Triumph
      </div>

      <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        THE LOST SEAL HAS BEEN RECOVERED
      </h2>
      <p className="mt-2 font-serif text-sm text-gold sm:text-base">
        Mohenjo-daro DK-G Sector • Mature Harappan Period (2600–1900 BCE)
      </p>

      {/* Score and Stats Grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-border/50 bg-background/60 p-4 sm:p-5">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Expedition Score
          </span>
          <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-gold">
            {score} <span className="text-xs font-normal text-muted-foreground">/ {maxScore}</span>
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Accuracy Rating
          </span>
          <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-emerald-400">
            {accuracy}%
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Clues Discovered
          </span>
          <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-foreground">
            {cluesCount} <span className="text-xs font-normal text-muted-foreground">found</span>
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Hints Requested
          </span>
          <span className="mt-1 block font-serif text-2xl sm:text-3xl font-bold text-muted-foreground">
            {hintsUsed}
          </span>
        </div>
      </div>

      {/* Museum Exhibit Unlocked Banner */}
      <div className="mt-6 rounded-2xl border border-primary/50 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-5 text-left shadow-lg">
        <div className="flex items-start gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/60 bg-background/90 text-4xl shadow-inner"
            aria-hidden="true"
          >
            🔷
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Award className="h-4 w-4" />
              Museum Exhibit Unlocked
            </div>
            <h3 className="mt-1 font-serif text-xl font-bold text-foreground">
              Steatite Stamp Seal (Harappan Masterpiece)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              The recovered artifact has been added to your Virtual Museum collection. Inspect its
              microscopic craftsmanship and historical insights in the Indus Valley Gallery.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Knowledge Takeaway */}
      <div className="mt-6 rounded-2xl border border-border/40 bg-background/40 p-5 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          Archaeological Knowledge Gained
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Indus steatite seals were crafted using a sophisticated sequence: micro-carving into soft
          talc stone, coating with alkali slurry, and high-temperature kiln firing above 1000°C.
          They were worn on suspension cords by merchant guild authorities to stamp wet clay tags on
          export bales bound for ancient Mesopotamia.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto font-serif font-bold"
        >
          <Link to="/museum">
            <Landmark className="mr-2 h-4 w-4" />
            Inspect in Virtual Museum
          </Link>
        </Button>

        <Button onClick={onBackToGames} size="lg" variant="outline" className="w-full sm:w-auto">
          Return to Games Hub
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={onReplay}
          size="lg"
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Replay Expedition
        </Button>
      </div>
    </div>
  );
}
