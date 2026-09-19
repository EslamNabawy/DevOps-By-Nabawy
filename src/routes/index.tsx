import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  Globe2,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { tracks } from "@/lib/tracks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevOps By Nabawy — Learn DevOps, one page at a time" },
      {
        name: "description",
        content:
          "Free DevOps guidebooks, interactive labs, and practical learning tracks.",
      },
      { property: "og:title", content: "DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Learn DevOps with practical guidebooks and interactive labs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const guidebooks = tracks.filter((track) => track.kind === "guide");
  const labs = tracks.filter((track) => track.kind === "lab");
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-hero">
        <div className="mx-auto max-w-6xl px-6 pb-18 pt-16 text-center sm:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            HI! SEARCH A TOPIC OR PICK A TRACK.
          </div>
          <h1 className="font-display mx-auto max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Learn DevOps,{" "}
            <span className="text-primary">one page at a time.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Read at your own pace — free, and yours to keep coming back to.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-18">
        <SectionHeading
          icon={<BookMarked />}
          eyebrow="OFFLINE-READY GUIDEBOOKS"
          title="Read tracks"
          text="Carefully structured notes you can keep, revisit, and learn from anywhere."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guidebooks.map((track) => (
            <Link
              to="/tracks/$slug"
              params={{ slug: track.slug }}
              key={track.slug}
              className="group border-t-4 border-primary bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                  <track.icon />
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                  <WifiOff className="h-3 w-3" />
                  OFFLINE
                </span>
              </div>
              <h3 className="font-display mt-6 text-xl font-bold">
                {track.title}
              </h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                {track.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>{track.chapters} chapters</span>
                <span className="flex items-center font-semibold text-foreground">
                  Open guide{" "}
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-muted/35">
        <div className="mx-auto max-w-7xl px-6 py-18">
          <SectionHeading
            icon={<Globe2 />}
            eyebrow="INTERACTIVE CURRICULA"
            title="Learn online"
            text="Practice in realistic sandboxes with guided tasks and instant feedback."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {labs.map((track) => (
              <Link
                to={
                  track.slug === "terraform"
                    ? "/tracks/terraform"
                    : "/tracks/$slug"
                }
                params={track.slug === "terraform" ? {} : { slug: track.slug }}
                key={track.slug}
                className="group bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-secondary-accent/10 text-secondary-accent">
                    <track.icon />
                  </span>
                  <span className="rounded-sm bg-secondary-accent/10 px-2 py-1 text-[10px] font-extrabold text-secondary-accent">
                    {track.status}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-xl font-bold">
                  {track.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {track.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Needs internet · {track.hours}
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-18">
        <div className="grid overflow-hidden border border-border bg-card shadow-card md:grid-cols-[1fr_1.4fr]">
          <div className="bg-primary p-8 text-primary-foreground sm:p-10">
            <p className="font-mono text-xs font-bold opacity-75">
              NABAWY'S STUDY RHYTHM
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold">
              Small steps.
              <br />
              Real practice.
              <br />
              Lasting skill.
            </h2>
          </div>
          <div className="p-8 sm:p-10">
            <div className="mb-4 flex items-center gap-2 font-bold text-secondary-accent">
              <CheckCircle2 />
              Mentor tip
            </div>
            <p className="font-display text-2xl font-bold leading-snug">
              “Don't try to absorb entire technologies overnight. Read 5 pages,
              execute 2 labs, and reflect.”
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Consistency compounds. Your next session should feel easy to
              begin.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  icon,
  eyebrow,
  title,
  text,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-xs font-extrabold text-primary">
          {icon}
          {eyebrow}
        </p>
        <h2 className="font-display mt-2 text-3xl font-extrabold">{title}</h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
