import { useState } from "react";
import { X, ZoomIn, MapPin, Calendar, Layers, Sparkles, Tag, ShieldCheck, ArrowLeft } from "lucide-react";
import type { Artifact } from "@/data/museum";
import { Button } from "@/components/ui/button";

interface ArtifactDetailModalProps {
  artifact: Artifact | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArtifactDetailModal({ artifact, isOpen, onClose }: ArtifactDetailModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen || !artifact) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="artifact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-primary/40 bg-stone-950/95 p-5 text-foreground shadow-2xl shadow-primary/10 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-stone-900/80 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-stone-800 hover:text-foreground"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Image Exhibit Frame */}
          <div className="flex flex-col items-center lg:col-span-6">
            <div
              className={`group relative flex h-72 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-3 sm:h-96 ${
                isZoomed ? "cursor-zoom-out" : ""
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={artifact.image}
                alt={artifact.name}
                className={`max-h-full max-w-full rounded-lg object-contain transition-transform duration-500 ${
                  isZoomed ? "scale-125" : "group-hover:scale-105"
                }`}
                loading="eager"
              />

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-primary/30 bg-black/70 px-3 py-1 text-xs text-primary backdrop-blur-sm">
                <ZoomIn className="h-3.5 w-3.5" />
                <span>{isZoomed ? "Click to Reset" : "Click to Inspect"}</span>
              </div>
            </div>

            {/* Category & Dimensions Pill */}
            <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-serif text-[11px] font-medium text-primary">
                {artifact.category}
              </span>
              {artifact.dimensions && (
                <span className="font-mono text-[11px] text-muted-foreground/80">
                  Dim: {artifact.dimensions}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Historical Dossier */}
          <div className="flex flex-col lg:col-span-6">
            <span className="font-serif text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              Archival Exhibit Record
            </span>
            <h2 id="artifact-modal-title" className="mt-1.5 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {artifact.name}
            </h2>

            {/* Metadata Tags */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl border border-border/40 bg-stone-900/60 p-3.5 text-xs sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Excavation Site</span>
                  <span className="font-medium text-foreground">{artifact.site}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Chronology</span>
                  <span className="font-medium text-foreground">{artifact.period}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Material</span>
                  <span className="font-medium text-foreground">{artifact.material}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Classification</span>
                  <span className="font-medium text-foreground">{artifact.type}</span>
                </div>
              </div>
            </div>

            {/* Significance Quote Banner */}
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
              <div className="flex items-center gap-1.5 font-serif text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Archaeological Significance
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                {artifact.significance}
              </p>
            </div>

            {/* Full Historical Description */}
            <div className="mt-4">
              <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Historical Context & Use
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {artifact.description}
              </p>
            </div>
          </div>
        </div>

        {/* Curatorial Insights Section */}
        {artifact.insights && artifact.insights.length > 0 && (
          <div className="mt-8 border-t border-border/40 pt-6">
            <h3 className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Curator Insights & Archaeological Observations
            </h3>
            <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
              {artifact.insights.map((insight) => (
                <div
                  key={insight.label}
                  className="rounded-xl border border-border/40 bg-stone-900/50 p-3.5"
                >
                  <span className="block font-serif text-xs font-bold text-foreground">
                    {insight.label}
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="h-3.5 w-3.5 text-primary/70" />
            {artifact.tags?.map((t) => (
              <span key={t} className="rounded bg-stone-900 px-2 py-0.5 text-[10px] text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="gap-1.5 border-primary/40 hover:bg-primary/10">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Collection
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ArtifactDetailsProps {
  artifact: Artifact;
  onExploreMore?: (artifact: Artifact) => void;
}

function Field({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ArtifactDetails({ artifact, onExploreMore }: ArtifactDetailsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-stone-950 via-stone-900/80 to-stone-950 p-5 sm:p-8 shadow-xl shadow-black/40">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Authentic Photographic Exhibition Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="group relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-stone-950 p-3 sm:h-80">
            <img
              src={artifact.image}
              alt={artifact.name}
              className="max-h-full max-w-full rounded-md object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute left-3 top-3 rounded border border-primary/30 bg-black/70 px-2.5 py-0.5 font-serif text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
              {artifact.category}
            </div>
            {onExploreMore && (
              <button
                type="button"
                onClick={() => onExploreMore(artifact)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/75 px-3 py-1 text-xs text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-black"
              >
                <ZoomIn className="h-3.5 w-3.5" />
                <span>Examine High-Res</span>
              </button>
            )}
          </div>
          {artifact.dimensions && (
            <span className="mt-2 text-[11px] font-mono text-muted-foreground">
              Specimen Scale: {artifact.dimensions}
            </span>
          )}
        </div>

        {/* Right Column: Historical Analysis */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-serif text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                Featured Masterwork
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 font-mono text-xs text-primary">
                {artifact.site}
              </span>
            </div>

            <h3 className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {artifact.name}
            </h3>

            <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-border/40 bg-stone-900/40 p-4 sm:grid-cols-4">
              <Field label="Type" value={artifact.type} />
              <Field label="Period" value={artifact.period} />
              <Field label="Material" value={artifact.material} />
              <Field label="Site" value={artifact.site} />
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {artifact.description}
            </p>

            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <span className="font-serif text-[10px] font-semibold uppercase tracking-wider text-primary">
                Significance
              </span>
              <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                {artifact.significance}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-4">
            <div className="flex flex-wrap gap-1.5">
              {artifact.tags?.map((tag) => (
                <span key={tag} className="rounded bg-stone-900 px-2 py-0.5 text-[10px] text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
            {onExploreMore && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExploreMore(artifact)}
                className="gap-2 border-primary/40 text-primary hover:bg-primary hover:text-black"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Full Archaeological Dossier
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

