import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Info, Sparkles } from "lucide-react";
import { ArtifactCard } from "@/components/museum/ArtifactCard";
import { ArtifactDetails } from "@/components/museum/ArtifactDetails";
import { CivilizationSidebar } from "@/components/museum/CivilizationSidebar";
import { HistoricalTimeline } from "@/components/museum/HistoricalTimeline";
import { ProgressPanel } from "@/components/museum/ProgressPanel";
import {
  artifacts,
  civilizations,
  LOCKED_ARTIFACT_MESSAGE,
  LOCKED_CIVILIZATION_MESSAGE,
  type Artifact,
} from "@/data/museum";
import { useGameProgress } from "@/hooks/use-game-progress";

export const Route = createFileRoute("/museum")({
  head: () => ({
    meta: [
      { title: "Indus Valley Museum — NAVYUVA" },
      {
        name: "description",
        content:
          "Explore the NAVYUVA virtual museum: Harappan artifacts, historical timeline and heritage collection progress.",
      },
      { property: "og:title", content: "Indus Valley Museum — NAVYUVA" },
      {
        property: "og:description",
        content:
          "Explore Harappan artifacts, unlock exhibits and trace India's civilizations on the NAVYUVA timeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MuseumPage,
});

function MuseumPage() {
  const [selectedId, setSelectedId] = useState("pottery");
  const [notice, setNotice] = useState<string | null>(null);
  const activeCivilizationId = "indus";

  const { progress, isArtifactUnlocked } = useGameProgress();

  // Dynamically compute lock status based on client game progress
  const dynamicArtifacts: Artifact[] = artifacts.map((art) => ({
    ...art,
    locked: !isArtifactUnlocked(art.id),
  }));

  const unlockedCount = dynamicArtifacts.filter((a) => !a.locked).length;
  const totalArtifactsCount = dynamicArtifacts.length;
  const cluesCount = progress.cluesCollected;
  const cluesTotal = 15;

  const selected =
    dynamicArtifacts.find((a) => a.id === selectedId && !a.locked) ??
    dynamicArtifacts.find((a) => !a.locked) ??
    dynamicArtifacts[0]!;

  function handleArtifactSelect(artifact: Artifact) {
    if (artifact.locked) {
      setNotice(LOCKED_ARTIFACT_MESSAGE);
      return;
    }
    setNotice(null);
    setSelectedId(artifact.id);
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Museum header */}
        <header className="text-center">
          <span className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Virtual Museum
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Indus Valley (Harappan) Museum
          </h1>
          <p className="mt-2 text-sm tracking-[0.2em] text-muted-foreground">2600–1900 BCE</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Artifacts Unlocked:{" "}
              <span className="font-semibold text-foreground">
                {unlockedCount} / {totalArtifactsCount}
              </span>
            </span>
            <span>
              Clues Collected:{" "}
              <span className="font-semibold text-foreground">
                {cluesCount} / {cluesTotal}
              </span>
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50 sm:w-28" />
            <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
            <span className="h-px w-24 bg-primary/40 sm:w-40" />
            <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50 sm:w-28" />
          </div>
        </header>

        {/* Sidebar + artifacts */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <CivilizationSidebar
            civilizations={civilizations}
            activeId={activeCivilizationId}
            onSelect={(civ) => setNotice(civ.locked ? LOCKED_CIVILIZATION_MESSAGE : null)}
          />

          <div>
            {notice && (
              <p
                role="status"
                className="mb-4 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {notice}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dynamicArtifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  selected={artifact.id === selected.id && !artifact.locked}
                  onSelect={handleArtifactSelect}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selected artifact */}
        <div className="mt-8">
          <ArtifactDetails artifact={selected} />
        </div>

        {/* Timeline */}
        <div className="mt-16">
          <h2 className="text-center font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Historical Timeline
          </h2>
          <div className="mt-8">
            <HistoricalTimeline civilizations={civilizations} activeId={activeCivilizationId} />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-16">
          <ProgressPanel
            artifactsUnlocked={unlockedCount}
            artifactsTotal={totalArtifactsCount}
            cluesCollected={cluesCount}
            cluesTotal={cluesTotal}
          />
        </div>

        {/* Explanation */}
        <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Unlock artifacts and build your museum as you progress through historical game levels.
          Every exhibit, clue and period here becomes available through gameplay.
        </p>
      </div>
    </div>
  );
}
