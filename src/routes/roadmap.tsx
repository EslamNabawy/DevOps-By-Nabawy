import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Map } from "lucide-react";
import { tracks } from "@/lib/tracks";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Learning Roadmap — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Follow the ordered DevOps roadmap from foundations to production orchestration.",
      },
      { property: "og:title", content: "Learning Roadmap — DevOps By Nabawy" },
      {
        property: "og:description",
        content:
          "Foundation, intermediate, and advanced phases across nine practical tracks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoadmapPage,
});

const phases = [
  {
    step: "Phase 01",
    title: "Foundations",
    text: "Command line, containers, and delivery mindset. Start here if anything still feels new.",
    level: "Foundation",
  },
  {
    step: "Phase 02",
    title: "Automation",
    text: "Infrastructure as code, pipelines, and repeatable operations with feedback.",
    level: "Intermediate",
  },
  {
    step: "Phase 03",
    title: "Production",
    text: "Cloud architecture, orchestration, and intelligent operations at scale.",
    level: "Advanced",
  },
] as const;

function RoadmapPage() {
  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-bold text-primary">
            <Map className="h-4 w-4" /> FOLLOW IN ORDER
          </p>
          <h1 className="font-display max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Learning Roadmap
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Nine tracks in three phases. Finish one milestone, build something,
            then move on.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl space-y-14 px-6 py-14 sm:py-20">
        {phases.map((phase) => {
          const items = tracks.filter((track) => track.level === phase.level);
          return (
            <section key={phase.step}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-bold text-secondary-accent">
                    {phase.step}
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-extrabold">
                    {phase.title}
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {phase.text}
                </p>
              </div>
              <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((track, index) => (
                  <li key={track.slug}>
                    <Link
                      to={
                        track.slug === "terraform"
                          ? "/tracks/terraform"
                          : "/tracks/$slug"
                      }
                      params={
                        track.slug === "terraform" ? {} : { slug: track.slug }
                      }
                      className="group flex h-full flex-col border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">
                          {phase.step}.{index + 1}
                        </span>
                        <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                          <track.icon />
                        </span>
                      </div>
                      <h3 className="font-display mt-5 text-xl font-bold">
                        {track.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {track.description}
                      </p>
                      <span className="mt-5 flex items-center gap-1 border-t border-border pt-4 text-sm font-bold text-primary">
                        <CheckCircle2 className="h-4 w-4" /> {track.milestones}{" "}
                        milestones · {track.hours}
                        <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
