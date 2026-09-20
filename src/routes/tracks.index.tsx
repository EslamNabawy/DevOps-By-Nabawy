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
    <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs font-bold text-primary">LIBRARY MAP</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">
          Tracks
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Pick a learning path, then move through its material in a clear order.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <TrackCard key={track.slug} track={track} />
        ))}
      </div>
    </div>
  );
}

function TrackCard({ track }: { track: Track }) {
  const Icon = track.format === "website" ? Globe : FileText;
  return (
    <Link
      to={trackHref(track)}
      className="group flex min-h-72 flex-col border border-border bg-card p-6 shadow-card transition-all duration-180 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary">
          <track.icon className="h-6 w-6" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {trackBadge(track)}
        </span>
      </div>
      <h2 className="font-display mt-7 text-xl font-bold">{track.title}</h2>
      <p className="mt-3 min-h-16 text-sm leading-6 text-muted-foreground">
        {track.description}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-5 text-sm font-semibold text-primary">
        <span>View track</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
