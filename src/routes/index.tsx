import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Globe,
  LayoutGrid,
  List,
} from "lucide-react";
import { useState } from "react";
import {
  tracks,
  trackBadge,
  trackFormatBadge,
  trackHref,
  type Track,
} from "@/lib/tracks";

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
  const [view, setView] = useState<"card" | "list">("card");
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
            <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 sm:gap-3 lg:w-[340px] lg:shrink-0">
              {tracks.map((track) => (
                <Link
                  key={track.slug}
                  to={trackHref(track)}
                  className="group flex w-20 shrink-0 flex-col items-center rounded-2xl border border-border bg-card p-3 shadow-card transition-colors hover:border-primary/50 hover:shadow-card-hover sm:w-auto"
                  title={track.title}
                  aria-label={`Open track: ${track.title}`}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground sm:h-10 sm:w-10">
                    <track.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <span className="mt-1.5 line-clamp-1 text-center font-mono text-[10px] font-bold leading-none sm:text-xs">
                    {track.slug.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <h2 className="font-display text-xl font-extrabold sm:text-2xl">
              Choose a track
            </h2>
          </div>
          <div className="inline-flex rounded-full border border-border bg-muted/60 p-1">
            <button
              type="button"
              onClick={() => setView("card")}
              aria-pressed={view === "card"}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${view === "card" ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Card
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${view === "list" ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
        </div>
        {view === "card" ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <TrackCard key={track.slug} track={track} />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {tracks.map((track) => (
              <TrackListItem key={track.slug} track={track} />
            ))}
          </div>
        )}
      </section>
      <AboutAuthor />
    </div>
  );
}

function TrackCard({ track }: { track: Track }) {
  const Icon = track.format === "website" ? Globe : FileText;
  return (
    <Link
      to={trackHref(track)}
      className="group flex min-h-48 sm:min-h-60 flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-180 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover"
      aria-label={`Open track: ${track.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
          <track.icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="inline-flex items-center justify-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-semibold leading-none text-muted-foreground sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
            <Icon className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5" />
            <span className="whitespace-nowrap">{trackBadge(track)}</span>
          </span>
          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold text-primary sm:text-[11px]">
            {trackFormatBadge(track)}
          </span>
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

function TrackListItem({ track }: { track: Track }) {
  const Icon = track.format === "website" ? Globe : FileText;
  return (
    <Link
      to={trackHref(track)}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition-colors hover:border-primary/50 hover:shadow-card-hover sm:gap-4 sm:p-4"
      aria-label={`Open track: ${track.title}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <track.icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-display truncate text-sm font-bold sm:text-base">{track.title}</h3>
        <p className="hidden truncate text-xs leading-5 text-muted-foreground sm:block sm:text-sm">{track.description}</p>
        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:hidden">
          <Icon className="h-3 w-3 text-primary" />
          <span className="truncate">{trackBadge(track)} · {trackFormatBadge(track)}</span>
        </span>
      </div>
      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground sm:inline-flex">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {trackBadge(track)} · {trackFormatBadge(track)}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:text-primary" />
    </Link>
  );
}

function AboutAuthor() {
  return (
    <section aria-label="About the author" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-lg font-extrabold text-primary">
          EN
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold text-primary">ABOUT THE AUTHOR</p>
          <h2 className="font-display mt-1 text-lg font-bold sm:text-xl">Eslam Tarek Nabawy</h2>
        </div>
        <a
          href="https://eslamnabawy.github.io/Nabawy-s-Portfolio-/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Full Portfolio <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
