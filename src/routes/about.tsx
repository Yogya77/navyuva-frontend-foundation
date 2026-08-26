import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/home/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — NAVYUVA" },
      {
        name: "description",
        content:
          "Learn about NAVYUVA, the interactive heritage and culture platform.",
      },
      { property: "og:title", content: "About — NAVYUVA" },
      {
        property: "og:description",
        content:
          "Learn about NAVYUVA, the interactive heritage and culture platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About"
          title="About NAVYUVA"
          subtitle="Transforming how the next generation connects with heritage."
        />
        <div className="mt-12 space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            NAVYUVA is a prototype platform built for SIH Problem Statement 26208
            under the Heritage & Culture theme. It reimagines historical learning
            as an interactive adventure.
          </p>
          <p>
            Instead of reading static facts, users explore civilizations,
            discover artifacts, collect clues, solve quizzes, and unlock stories
            — building their own virtual museum along the way.
          </p>
          <p>
            Our vision is to make heritage education engaging, accessible, and
            memorable for learners everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
