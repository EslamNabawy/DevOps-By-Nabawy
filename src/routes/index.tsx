import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  Layers,
  Sparkles,
} from "lucide-react";
import { tracks, type Track } from "@/lib/tracks";

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold text-primary">
              <BookOpen className="h-4 w-4" />
              ALL TRACKS
            </p>
            <h2 className="font-display mt-2 text-3xl font-extrabold">
              Pick your track
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Books live on this site, companion sites open the full experience —
            the flag on each card tells you where.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
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

function SourceFlag({ source }: { source: Track["source"] }) {
  if (source === "hosted")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
        <BookOpen className="h-3.5 w-3.5" />
        ON THIS SITE
      </span>
    );
  if (source === "website")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary-accent">
        <Globe className="h-3.5 w-3.5" />
        COMPANION SITE
      </span>
    );
  if (source === "both")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary-accent">
        <Layers className="h-3.5 w-3.5" />
        SITE + COMPANION
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
      <Clock className="h-3.5 w-3.5" />
      COMING SOON
    </span>
  );
}

function TrackCard({ track }: { track: Track }) {
  const fullRoute =
    track.slug === "terraform" ||
    track.slug === "cicd" ||
    track.slug === "linux";
  return (
    <Link
      to={
        track.slug === "terraform"
          ? "/tracks/terraform"
          : track.slug === "cicd"
            ? "/tracks/cicd"
            : track.slug === "linux"
              ? "/tracks/linux"
              : "/tracks/$slug"
      }
      params={fullRoute ? {} : { slug: track.slug }}
      key={track.slug}
      className="group flex flex-col border-t-4 border-primary bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
          <track.icon />
        </span>
        <SourceFlag source={track.source} />
      </div>
      <h3 className="font-display mt-6 text-xl font-bold">{track.title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {track.description}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>
          {track.chapters > 0 ? `${track.chapters} chapters · ` : ""}
          {track.hours}
        </span>
        <span className="flex items-center font-semibold text-foreground">
          Open{" "}
          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
