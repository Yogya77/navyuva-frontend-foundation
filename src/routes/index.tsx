import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Eye, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/home/FeatureCard";
import { StepItem } from "@/components/home/StepItem";
import { SectionHeading } from "@/components/home/SectionHeading";
import heroImage from "@/assets/hero-museum.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NAVYUVA — Heritage & Culture" },
      {
        name: "description",
        content:
          "Discover the past and play the story with NAVYUVA, an interactive platform for exploring civilization, history, and culture.",
      },
      { property: "og:title", content: "NAVYUVA — Heritage & Culture" },
      {
        property: "og:description",
        content: "Discover the past and play the story with NAVYUVA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    title: "EXPLORE",
    description:
      "Explore historically significant places and civilizations.",
    icon: Compass,
  },
  {
    title: "DISCOVER",
    description:
      "Find artifacts and clues hidden throughout historical game levels.",
    icon: Eye,
  },
  {
    title: "PRESERVE",
    description:
      "Unlock artifacts and build your virtual heritage collection.",
    icon: Shield,
  },
];

const steps = [
  {
    number: "01",
    title: "Explore",
    description: "Wander through historical places and civilizations.",
  },
  {
    number: "02",
    title: "Discover",
    description: "Spot hidden artifacts and secret clues.",
  },
  {
    number: "03",
    title: "Collect",
    description: "Gather pieces for your virtual heritage collection.",
  },
  {
    number: "04",
    title: "Solve",
    description: "Answer quizzes and crack historical challenges.",
  },
  {
    number: "05",
    title: "Unlock",
    description: "Reveal the stories behind each artifact.",
  },
  {
    number: "06",
    title: "Learn",
    description: "Connect facts to understand our shared heritage.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Dark museum hall with ancient artifacts and warm bronze lighting"
            className="h-full w-full object-cover opacity-40"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="font-serif text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Heritage & Culture
          </span>
          <h1 className="mt-4 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            NAVYUVA
          </h1>
          <p className="mt-4 font-serif text-xl font-medium text-gold sm:text-2xl">
            &ldquo;Discover the Past. Play the Story.&rdquo;
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore civilizations, discover historical artifacts, collect clues,
            solve challenges, and unlock the stories behind our heritage.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/games">Begin Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/museum">Explore the Museum</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Experience"
            title="Step Into History"
            subtitle="NAVYUVA brings the past to life through exploration, discovery, and preservation."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* About NAVYUVA */}
      <section className="border-y border-border/50 bg-secondary/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="About NAVYUVA"
                title="History Should Be Experienced"
                subtitle="NAVYUVA transforms passive historical learning into an interactive journey."
                className="mx-0 text-left"
              />
              <div className="mt-8 space-y-4 text-muted-foreground">
                <p>
                  Through games, exploration, and artifact discovery, learners
                  engage with heritage in a way that feels immersive and
                  memorable.
                </p>
                <p>
                  Every clue, quiz, and unlocked artifact is designed to deepen
                  curiosity about the civilizations that shaped our world.
                </p>
              </div>
              <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link to="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50">
              <img
                src={heroImage}
                alt="Museum gallery with warm bronze lighting"
                className="h-full w-full object-cover opacity-60"
                loading="lazy"
                width={1920}
                height={1080}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="Your Journey Through Time"
            subtitle="Follow the path from explorer to heritage keeper in six simple steps."
          />
          <div className="mt-16 flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
            {steps.map((step, index) => (
              <div key={step.title} className="contents">
                <StepItem {...step} />
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden h-5 w-5 shrink-0 text-primary/40 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
