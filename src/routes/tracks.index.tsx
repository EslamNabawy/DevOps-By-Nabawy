import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Globe } from "lucide-react";
import { tracks, trackBadge, trackHref, type Track } from "@/lib/tracks";

export const Route = createFileRoute("/tracks/")({
  head: () => ({
    meta: [
      { title: "Tracks — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Explore DevOps learning tracks, guidebooks, and companion courses.",
      },
      { property: "og:title", content: "Tracks — DevOps By Nabawy" },
      {
        property: "og:description",
        content:
          "Explore DevOps learning tracks, guidebooks, and companion courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TracksPage,
});

function TracksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-3xl">
        <p className="font-mono text-xs font-bold text-primary">LIBRARY MAP</p>
        <h1 className="font-display mt-3 text-2xl font-extrabold sm:text-3xl">
          Tracks
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Pick a learning path, then move through its material in a clear order.
          Prefer steps?{" "}
          <Link
            to="/roadmap"
            className="font-semibold text-primary hover:underline"
          >
            Follow the roadmap
          </Link>
          .
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <TrackCard key={track.slug} track={track} />
        ))}
      </div>
    </div>
  );
}

function TrackCard({ track }: { track: Track }) {
  const Icon = track.format === "website" ? Globe : FileText;
  const isSoon = track.source === "soon";
  if (isSoon) {
    return (
      <div className="flex min-h-48 sm:min-h-60 flex-col rounded-2xl border border-dashed border-border bg-muted/40 p-4 opacity-75 cursor-not-allowed select-none">
        <div className="flex items-start justify-between gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground sm:h-10 sm:w-10">
            <track.icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="inline-flex max-w-[58%] shrink-0 items-center justify-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400 sm:max-w-none sm:px-3 sm:py-1.5 sm:text-xs">
            COMING SOON
          </span>
        </div>
        <h2 className="font-display mt-4 text-base font-bold text-muted-foreground">{track.title}</h2>
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
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
          <track.icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <span className="inline-flex max-w-[58%] shrink-0 items-center justify-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-semibold leading-none text-muted-foreground sm:max-w-none sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
          <Icon className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5" />
          <span className="truncate">{trackBadge(track)}</span>
        </span>
      </div>
      <h2 className="font-display mt-4 text-base font-bold">{track.title}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {track.description}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm font-semibold text-primary">
        <span>View track</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
