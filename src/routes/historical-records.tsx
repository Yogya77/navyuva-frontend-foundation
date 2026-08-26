import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/historical-records")({
  head: () => ({
    meta: [
      { title: "Historical Records — NAVYUVA" },
      {
        name: "description",
        content: "NAVYUVA historical records are coming soon.",
      },
      { property: "og:title", content: "Historical Records — NAVYUVA" },
      {
        property: "og:description",
        content: "NAVYUVA historical records are coming soon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoricalRecordsPage,
});

function HistoricalRecordsPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <span className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-primary">
        Coming Soon
      </span>
      <h1 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
        Historical Records
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        A curated archive of civilizations, timelines, and cultural stories is on its way.
      </p>
      <Button className="mt-8" asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}
