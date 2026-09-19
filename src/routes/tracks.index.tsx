import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Search, Sparkles, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { tracks } from "@/lib/tracks";

export const Route = createFileRoute("/tracks/")({
  head: () => ({
    meta: [
      { title: "Explore Learning Tracks — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Explore nine practical DevOps learning tracks, guidebooks, and online labs.",
      },
      {
        property: "og:title",
        content: "Explore Learning Tracks — DevOps By Nabawy",
      },
      {
        property: "og:description",
        content:
          "Nine practical DevOps tracks from Linux foundations to cloud orchestration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TracksPage,
});

function TracksPage() {
  const [filter, setFilter] = useState<"all" | "guide" | "lab">("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      tracks.filter(
        (track) =>
          (filter === "all" || track.kind === filter) &&
          `${track.title} ${track.description}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [filter, query],
  );
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="mb-3 font-mono text-xs font-bold text-primary">
          CHOOSE YOUR PATH
        </p>
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
          Explore Learning Tracks
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          9 comprehensive tracks to take you from foundational command-line
          workflows to full-scale infrastructure orchestration.
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-3 border-y border-border py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All Tracks"],
              ["guide", "Offline Guidebooks"],
              ["lab", "Online Labs"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${filter === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none md:w-64"
            placeholder="Filter tracks…"
          />
        </label>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((track) => (
          <Link
            to={
              track.slug === "terraform" ? "/tracks/terraform" : "/tracks/$slug"
            }
            params={track.slug === "terraform" ? {} : { slug: track.slug }}
            key={track.slug}
            className="group flex min-h-80 flex-col border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary">
                <track.icon />
              </span>
              <span
                className={`rounded-sm px-2 py-1 font-mono text-[10px] font-bold ${track.kind === "lab" ? "bg-secondary-accent/10 text-secondary-accent" : "bg-primary/10 text-primary"}`}
              >
                {track.status}
              </span>
            </div>
            <h2 className="font-display mt-6 text-xl font-bold">
              {track.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {track.description}
            </p>
            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-5 text-xs">
              <span>
                <b className="block text-foreground">{track.hours}</b>
                <span className="text-muted-foreground">Est. time</span>
              </span>
              <span>
                <b className="block text-foreground">{track.level}</b>
                <span className="text-muted-foreground">Level</span>
              </span>
              <span>
                <b className="block text-foreground">
                  {track.milestones > 0 ? track.milestones : "—"}
                </b>
                <span className="text-muted-foreground">Milestones</span>
              </span>
            </div>
            <div className="mt-5 flex items-center text-sm font-bold text-primary">
              {track.kind === "lab" ? (
                <Wifi className="mr-2 h-4 w-4" />
              ) : (
                <BookOpen className="mr-2 h-4 w-4" />
              )}
              Explore track{" "}
              <ArrowRight className="ml-auto transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
      <aside className="mt-12 flex flex-col gap-4 border-l-4 border-secondary-accent bg-accent p-6 sm:flex-row sm:items-center">
        <Sparkles className="h-7 w-7 shrink-0 text-secondary-accent" />
        <div>
          <p className="font-mono text-xs font-bold text-secondary-accent">
            NABAWY’S GOLDEN RULE
          </p>
          <p className="mt-1 font-display text-lg font-bold">
            Pick one track. Finish one milestone. Build something before moving
            on.
          </p>
        </div>
      </aside>
    </div>
  );
}
