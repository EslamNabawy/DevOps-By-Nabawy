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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl text-left">
              <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-4xl">
                DevOps Library
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Explore a collection of DevOps resources, from practical guides
                and websites to downloadable PDFs.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 sm:gap-3 lg:w-[340px] lg:shrink-0">
              {tracks.map((track) => {
                const isSoon = track.source === "soon";
                const content = (
                  <>
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl sm:h-10 sm:w-10 ${isSoon ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"}`}
                    >
                      <track.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <span className="mt-1.5 line-clamp-1 text-center font-mono text-[10px] font-bold leading-none sm:text-xs">
                      {track.slug.toUpperCase()}
                    </span>
                  </>
                );
                return isSoon ? (
                  <div
                    key={track.slug}
                    className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/30 p-3 opacity-60"
                    title={`${track.title} — Coming Soon`}
                  >
                    {content}
                  </div>
                ) : (
                  <Link
                    key={track.slug}
                    to={trackHref(track)}
                    className="group flex flex-col items-center rounded-2xl border border-border bg-card p-3 shadow-card transition-colors hover:border-primary/50 hover:shadow-card-hover"
                    title={track.title}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
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
        <div className="flex items-start justify-between gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground sm:h-10 sm:w-10">
            <track.icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="inline-flex max-w-[58%] shrink-0 items-center justify-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400 sm:max-w-none sm:px-3 sm:py-1.5 sm:text-xs">
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
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
          <track.icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <span className="inline-flex max-w-[58%] shrink-0 items-center justify-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-semibold leading-none text-muted-foreground sm:max-w-none sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
          <Icon className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5" />
          <span className="truncate">{trackBadge(track)}</span>
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
