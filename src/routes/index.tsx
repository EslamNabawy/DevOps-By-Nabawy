import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Globe } from "lucide-react";
import { tracks, trackBadge, trackHref, type Track } from "@/lib/tracks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevOps Library — Explore a collection of DevOps resources" },
      {
        name: "description",
        content:
          "Explore a collection of DevOps resources, from practical guides and websites to downloadable PDFs.",
      },
      { property: "og:title", content: "DevOps Library" },
      {
        property: "og:description",
        content:
          "Explore a collection of DevOps resources, from practical guides and websites to downloadable PDFs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 text-center sm:px-6 sm:pb-12 sm:pt-12">
          <h1 className="font-display mx-auto max-w-4xl text-xl font-extrabold leading-tight sm:text-4xl">
            DevOps Library
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
            Explore a collection of DevOps resources, from practical guides and
            websites to downloadable PDFs.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="font-mono text-xs font-bold text-primary">
              ALL TRACKS
            </p>
            <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
              Choose a track
            </h2>
          </div>
          <p className="text-sm leading-6 text-muted-foreground sm:max-w-sm sm:text-right">
            Start with the map, then read or open the full course.
          </p>
        </div>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TrackCard({ track }: { track: Track }) {
  const Icon = track.format === "website" ? Globe : FileText;
  const isSoon = track.source === "soon";
  if (isSoon) {
    return (
      <div className="flex min-h-48 sm:min-h-60 flex-col rounded-2xl border border-dashed border-border bg-muted/40 p-4 opacity-75 cursor-not-allowed select-none">
        <div className="flex items-start justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground">
            <track.icon className="h-5 w-5" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold tracking-wide text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
            COMING SOON
          </span>
        </div>
        <h3 className="font-display mt-4 text-base font-bold text-muted-foreground">{track.title}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {track.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm font-semibold text-muted-foreground">
          <span>Coming Soon</span>
        </div>
      </div>
    );
  }
  return (
    <Link
      to={trackHref(track)}
      className="group flex min-h-48 sm:min-h-60 flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-180 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <track.icon className="h-5 w-5" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {trackBadge(track)}
        </span>
      </div>
      <h3 className="font-display mt-4 text-base font-bold">{track.title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {track.description}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm font-semibold text-primary">
        <span>Open track</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
