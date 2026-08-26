import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/museum")({
  head: () => ({
    meta: [
      { title: "Museum — NAVYUVA" },
      {
        name: "description",
        content: "The NAVYUVA virtual museum is coming soon.",
      },
      { property: "og:title", content: "Museum — NAVYUVA" },
      {
        property: "og:description",
        content: "The NAVYUVA virtual museum is coming soon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MuseumPage,
});

function MuseumPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <span className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
        Coming Soon
      </span>
      <h1 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
        The Virtual Museum
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Artifact halls, locked exhibits, and timeline displays are under construction for the next
        phase of NAVYUVA.
      </p>
      <Button className="mt-8" asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}
