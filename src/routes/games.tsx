import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Compass, Lock } from "lucide-react";
import { GameHeader } from "@/components/games/GameHeader";
import { GameStatsBanner } from "@/components/games/GameStatsBanner";
import { GameCard } from "@/components/games/GameCard";
import { LockedGameCard } from "@/components/games/LockedGameCard";
import { GameCompletionView } from "@/components/games/GameCompletionView";
import { TheLostSealGame } from "@/components/games/TheLostSealGame";
import { SecretsOfHarappaGame } from "@/components/games/SecretsOfHarappaGame";
import { TradersJourneyGame } from "@/components/games/TradersJourneyGame";
import { DecipherThePastGame } from "@/components/games/DecipherThePastGame";
import { GAMES_CATALOG, type GameDefinition } from "@/data/games";
import { useGameProgress } from "@/hooks/use-game-progress";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Historical Games — NAVYUVA" },
      {
        name: "description",
        content:
          "Solve archaeological mysteries, conquer ancient trade routes, and unlock historical artifacts in NAVYUVA interactive games.",
      },
      { property: "og:title", content: "Historical Games — NAVYUVA" },
      {
        property: "og:description",
        content:
          "Discover the past by playing interactive historical games: Indus Valley mysteries, trading expeditions, and epigraphy challenges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamesPage,
});

interface CompletionState {
  game: GameDefinition;
  score: number;
  maxScore: number;
  accuracy: number;
  historicalInsight: string;
}

const HISTORICAL_INSIGHTS: Record<string, string> = {
  "lost-seal":
    "Steatite stamp seals were the hallmark of Harappan civic and commercial administration. Intaglio animal motifs and unread inscriptions identified merchants and ensured the integrity of goods traded across the ancient Near East.",
  "harappa-secrets":
    "Harappan civic planning, standardized 1:2:4 brick ratios, and advanced covered drainage systems stand as monumental achievements in ancient public health and engineering, unmatched for millennia.",
  "traders-journey":
    "Maritime trade linked the Indus port of Lothal with Dilmun (Bahrain), Magan (Oman), and Mesopotamian city-states like Ur. Exporting etched carnelian, lapis, and cotton, Harappan traders maintained rigorous international weight standards.",
  "decipher-past":
    "The Indus script contains over 400 signs, predominantly read right-to-left. While its language remains a profound archaeological mystery, analyzing sign frequencies and pairings provides vital clues about ancient administrative structure.",
};

function GamesPage() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [completionData, setCompletionData] = useState<CompletionState | null>(null);

  const { progress, completeGame, isGameCompleted, getGameScore, resetProgress } =
    useGameProgress();

  const availableGames = GAMES_CATALOG.filter((g) => !g.locked);
  const lockedGames = GAMES_CATALOG.filter((g) => g.locked);

  const handleStartGame = (gameId: string) => {
    setCompletionData(null);
    setActiveGameId(gameId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGameFinished = (gameId: string, score: number, maxScore: number) => {
    const game = GAMES_CATALOG.find((g) => g.id === gameId);
    if (!game) return;

    const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;

    // Trigger reward in centralized progress store
    completeGame(gameId, score, maxScore, {
      artifactId: game.reward.artifactId,
      clueCount: 1,
    });

    setCompletionData({
      game,
      score,
      maxScore,
      accuracy,
      historicalInsight:
        HISTORICAL_INSIGHTS[gameId] ??
        "Expedition complete! Your discovery has deepened our collective understanding of ancient civilization.",
    });

    setActiveGameId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExitGame = () => {
    setActiveGameId(null);
    setCompletionData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Completion View */}
        {completionData && (
          <div className="mb-12">
            <GameCompletionView
              gameTitle={completionData.game.title}
              score={completionData.score}
              maxScore={completionData.maxScore}
              accuracy={completionData.accuracy}
              reward={completionData.game.reward}
              historicalInsight={completionData.historicalInsight}
              onPlayAgain={() => handleStartGame(completionData.game.id)}
              onBackToGames={() => setCompletionData(null)}
            />
          </div>
        )}

        {/* Active Game Player */}
        {activeGameId === "lost-seal" && (
          <TheLostSealGame
            onComplete={(score, maxScore) => handleGameFinished("lost-seal", score, maxScore)}
            onExit={handleExitGame}
          />
        )}

        {activeGameId === "harappa-secrets" && (
          <SecretsOfHarappaGame
            onComplete={(score, maxScore) => handleGameFinished("harappa-secrets", score, maxScore)}
            onExit={handleExitGame}
          />
        )}

        {activeGameId === "traders-journey" && (
          <TradersJourneyGame
            onComplete={(score, maxScore) => handleGameFinished("traders-journey", score, maxScore)}
            onExit={handleExitGame}
          />
        )}

        {activeGameId === "decipher-past" && (
          <DecipherThePastGame
            onComplete={(score, maxScore) => handleGameFinished("decipher-past", score, maxScore)}
            onExit={handleExitGame}
          />
        )}

        {/* Games Hub Dashboard (when no active game is being played) */}
        {!activeGameId && !completionData && (
          <>
            <GameHeader />

            {/* Stats & Progress Dossier */}
            <div className="mt-12">
              <GameStatsBanner
                progress={progress}
                onReset={resetProgress}
                totalAvailableGames={availableGames.length}
              />
            </div>

            {/* Featured Highlight Banner */}
            <section aria-label="Featured Challenge" className="mt-12">
              <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-card via-card/90 to-background p-6 sm:p-8">
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <Sparkles className="h-4 w-4" />
                    Featured Historical Quest
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">
                    The Lost Seal of Mohenjo-daro
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Examine microscopic carving marks and animal iconography on a genuine Indus
                    steatite seal to unlock the exhibit in your virtual museum.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleStartGame("lost-seal")}
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90"
                    >
                      <Compass className="mr-2 h-4 w-4" />
                      Play Featured Quest
                    </button>
                    <span className="text-xs text-gold">Reward: Steatite Seal Relic</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Available Games Grid */}
            <section aria-label="Available historical games" className="mt-14">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Indus Valley Challenges
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Available expeditions ready to explore
                  </p>
                </div>
                <span className="text-xs font-medium text-primary">
                  {availableGames.length} Missions Ready
                </span>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {availableGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isCompleted={isGameCompleted(game.id)}
                    scoreRecord={getGameScore(game.id)}
                    onPlay={handleStartGame}
                  />
                ))}
              </div>
            </section>

            {/* Locked Future Civilizations Section */}
            <section aria-label="Future civilization games" className="mt-16">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-muted-foreground">
                      Locked Civilizational Eras
                    </h2>
                    <p className="text-xs text-muted-foreground/80">
                      Unlock future galleries through Indus Valley game completion
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">3 Future Eras</span>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {lockedGames.map((game) => (
                  <LockedGameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
