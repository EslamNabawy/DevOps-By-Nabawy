import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tracks/linux")({
  head: () => ({
    meta: [
      { title: "Linux Primitives — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Linux notes, NTI course material, practice labs, flashcards, and quizzes.",
      },
      { property: "og:title", content: "Linux Primitives — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Master processes, filesystems, permissions, and networking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinuxPage,
});

const SITE = "https://eslamnabawy.github.io/linux101/";

const areas = [
  {
    n: "01",
    title: "Linux101 Notes",
    text: "Cheat sheets, command bank, and RH124 notes.",
  },
  {
    n: "02",
    title: "NTI Linux Course",
    text: "Structured course material and exercises.",
  },
  {
    n: "03",
    title: "Practice Lab Drills",
    text: "Hands-on drills with a global roadmap.",
  },
  {
    n: "04",
    title: "Flashcards & Quizzes",
    text: "Lock in commands with active recall.",
  },
];

function LinuxPage() {
  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <Link
            to="/tracks"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tracks /{" "}
            <span className="text-foreground">Linux Primitives</span>
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-[10px] font-bold text-primary-foreground">
                  COMPANION SITE LIVE
                </span>
                <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
                  Notes + Labs
                </span>
                <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
                  Flashcards + Quizzes
                </span>
              </div>
              <h1 className="font-display max-w-4xl text-4xl font-extrabold sm:text-5xl">
                Linux Primitives
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                Master processes, filesystems, permissions, and networking — the
                foundation under everything else here.
              </p>
            </div>
            <Button asChild>
              <a href={SITE} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" /> Open full site
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <p className="font-mono text-xs font-bold text-primary">
            PRACTICE ONLINE
          </p>
          <h2 className="font-display mt-2 text-3xl font-extrabold">
            Learn on the companion site
          </h2>
        </div>
        <div className="overflow-hidden border border-border bg-card shadow-card">
          <iframe
            title="Linux101 companion site"
            src={SITE}
            className="h-[80vh] w-full"
            loading="lazy"
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => (
            <a
              key={area.n}
              href={SITE}
              target="_blank"
              rel="noreferrer"
              className="group border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <p className="font-mono text-xs font-bold text-secondary-accent">
                {area.n}
              </p>
              <h3 className="font-display mt-2 text-lg font-bold">
                {area.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {area.text}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-6 border border-border bg-card p-7 shadow-card lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary-accent/10 text-secondary-accent">
              <Sparkles />
            </span>
            <div>
              <p className="font-mono text-xs font-bold text-secondary-accent">
                NABAWY'S TRACK ADVICE
              </p>
              <p className="font-display mt-2 max-w-3xl text-xl font-bold">
                Live in the terminal for two weeks. Everything in DevOps gets
                easier after that.
              </p>
            </div>
          </div>
          <Button asChild>
            <a href={SITE} target="_blank" rel="noreferrer">
              Start the drills <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
