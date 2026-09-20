import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Globe } from "lucide-react";
import { tracks, trackBadge, trackHref, type Track } from "@/lib/tracks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevOps By Nabawy — Learn DevOps, one page at a time" },
      {
        name: "description",
        content:
          "Search anything, read at your own pace — free, and yours to keep coming back to.",
      },
      { property: "og:title", content: "DevOps By Nabawy" },
      {
        property: "og:description",
        content:
          "Search anything, read at your own pace — free, and yours to keep coming back to.",
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
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-10 text-center sm:pb-12 sm:pt-12">
          <h1 className="font-display mx-auto max-w-4xl text-2xl font-extrabold leading-tight sm:text-4xl">
            Learn DevOps, one page at a time.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Search anything, read at your own pace — free, and yours to keep
            coming back to.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
        <div className="mb-5 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs font-bold text-primary">
              ALL TRACKS
            </p>
            <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
              Choose a track
            </h2>
          </div>
          <p className="max-w-sm text-right text-sm leading-6 text-muted-foreground">
            Start with the map, then read or open the full course.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  return (
    <Link
      to={trackHref(track)}
      className="group flex min-h-60 flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-180 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover"
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
