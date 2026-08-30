import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Info, Sparkles, Search, Filter, Compass } from "lucide-react";
import { ArtifactCard } from "@/components/museum/ArtifactCard";
import { ArtifactDetails, ArtifactDetailModal } from "@/components/museum/ArtifactDetails";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/museum")({
  head: () => ({
    meta: [
      { title: "Indus Valley Virtual Museum — NAVYUVA" },
      {
        name: "description",
        content:
          "Explore the NAVYUVA virtual museum: authentic Harappan seals, terracotta sculptures, bronze artifacts, and historical timeline.",
      },
      { property: "og:title", content: "Indus Valley Virtual Museum — NAVYUVA" },
      {
        property: "og:description",
        content:
          "Examine authentic Harappan archaeological artifacts, unlock exhibits, and trace India's ancient civilizations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MuseumPage,
});

const CATEGORIES = [
  "All Exhibits",
  "Seals & Epigraphy",
  "Terracotta & Sculpture",
  "Ornaments & Metallurgy",
  "Inscriptions & Plaques",
  "Tools & Everyday Life",
] as const;

function MuseumPage() {
  const [selectedId, setSelectedId] = useState("seal");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Exhibits");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalArtifact, setModalArtifact] = useState<Artifact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const activeCivilizationId = "indus";

  const { progress, isArtifactUnlocked } = useGameProgress();

  // Dynamically compute lock status based on client game progress
  const dynamicArtifacts: Artifact[] = useMemo(() => {
    return artifacts.map((art) => ({
      ...art,
      locked: !isArtifactUnlocked(art.id),
    }));
  }, [isArtifactUnlocked]);

  const unlockedCount = dynamicArtifacts.filter((a) => !a.locked).length;
  const totalArtifactsCount = dynamicArtifacts.length;
  const cluesCount = progress.cluesCollected;
  const cluesTotal = 15;

  // Filtered artifacts according to search query and category
  const filteredArtifacts = useMemo(() => {
    return dynamicArtifacts.filter((art) => {
      const matchesCategory =
        selectedCategory === "All Exhibits" || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.name.toLowerCase().includes(q) ||
        art.site.toLowerCase().includes(q) ||
        art.material.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.short.toLowerCase().includes(q) ||
        art.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [dynamicArtifacts, selectedCategory, searchQuery]);

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

  function handleOpenModal(artifact: Artifact) {
    if (artifact.locked) {
      setNotice(LOCKED_ARTIFACT_MESSAGE);
      return;
    }
    setNotice(null);
    setModalArtifact(artifact);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Museum Header */}
        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 font-serif text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <Compass className="h-3.5 w-3.5" /> Curated Virtual Gallery
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Indus Valley Archaeological Museum
          </h1>
          <p className="mt-2 font-serif text-sm tracking-[0.2em] text-primary/80">
            Mature Harappan Civilization • 2600–1900 BCE
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Examine authentic high-resolution artifacts, stamp seals, and terracotta sculptures recovered from Harappa, Mohenjo-daro, and Lothal.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Exhibits Unlocked:{" "}
              <span className="font-semibold text-foreground">
                {unlockedCount} / {totalArtifactsCount}
              </span>
            </span>
            <span className="rounded-full border border-border/40 bg-stone-900/40 px-4 py-1">
              Archaeological Clues:{" "}
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

        {/* Selected Featured Artifact Display */}
        <div className="mt-12">
          <ArtifactDetails artifact={selected} onExploreMore={handleOpenModal} />
        </div>

        {/* Collection Gallery Controls & Grid */}
        <div className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Permanent Collection
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
                Explore Archaeological Specimens
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search artifacts, sites, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border/40 pb-4">
            <Filter className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All Exhibits"
                  ? dynamicArtifacts.length
                  : dynamicArtifacts.filter((a) => a.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-serif transition-all ${
                    selectedCategory === cat
                      ? "border border-primary bg-primary text-black font-semibold shadow-sm shadow-primary/20"
                      : "border border-border/50 bg-stone-900/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat} <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Notice Alert */}
          {notice && (
            <p
              role="status"
              className="mt-4 flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/10 p-3.5 text-xs text-foreground"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {notice}
            </p>
          )}

          {/* Civilization Sidebar + Artifacts Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            <CivilizationSidebar
              civilizations={civilizations}
              activeId={activeCivilizationId}
              onSelect={(civ) => setNotice(civ.locked ? LOCKED_CIVILIZATION_MESSAGE : null)}
            />

            <div>
              {filteredArtifacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-stone-950/60 p-12 text-center">
                  <Search className="h-8 w-8 text-muted-foreground/60" />
                  <h3 className="mt-3 font-serif text-lg font-bold text-foreground">
                    No artifacts match your filter
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try adjusting your search terms or selecting a different category.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-primary/40"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All Exhibits");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredArtifacts.map((artifact) => (
                    <ArtifactCard
                      key={artifact.id}
                      artifact={artifact}
                      selected={artifact.id === selected.id && !artifact.locked}
                      onSelect={handleArtifactSelect}
                      onOpenModal={handleOpenModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historical Timeline Section */}
        <div className="mt-20">
          <h2 className="text-center font-serif text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Civilizational Chronology
          </h2>
          <p className="mt-1 text-center font-serif text-xl font-bold text-foreground">
            Historical Timeline of Ancient India
          </p>
          <div className="mt-8">
            <HistoricalTimeline civilizations={civilizations} activeId={activeCivilizationId} />
          </div>
        </div>

        {/* Progress & Collection Dashboard */}
        <div className="mt-16">
          <ProgressPanel
            artifactsUnlocked={unlockedCount}
            artifactsTotal={totalArtifactsCount}
            cluesCollected={cluesCount}
            cluesTotal={cluesTotal}
          />
        </div>

        {/* Educational Disclaimer & Pedagogy Note */}
        <p className="mx-auto mt-12 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground/80">
          Photographs represent authentic archaeological specimens from mature Harappan excavations. The Indus script remains undeciphered; all inscriptions are transcribed faithfully without speculative translations. Exhibits unlock dynamically as you explore chapters in The Lost Seal.
        </p>
      </div>

      {/* Artifact Detail Modal / Lightbox */}
      <ArtifactDetailModal
        artifact={modalArtifact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

