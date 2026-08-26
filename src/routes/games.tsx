import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Games — NAVYUVA" },
      {
        name: "description",
        content: "NAVYUVA historical exploration games are coming soon.",
      },
      { property: "og:title", content: "Games — NAVYUVA" },
      {
        property: "og:description",
        content: "NAVYUVA historical exploration games are coming soon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <span className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
        Coming Soon
      </span>
      <h1 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
        Historical Games
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Exploration levels, clue hunts, and quiz challenges are being crafted for
        the NAVYUVA experience.
      </p>
      <Button className="mt-8" asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}
