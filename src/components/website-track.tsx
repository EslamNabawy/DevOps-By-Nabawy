import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  ListTree,
  Play,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trackBadge, tracks } from "@/lib/tracks";

export type WebsiteOutlineItem = {
  n: string;
  title: string;
  text: string;
};

type WebsiteTrackProps = {
  slug: string;
  siteName: string;
  siteUrl: string;
  outline: WebsiteOutlineItem[];
};

export function WebsiteTrackPage({
  slug,
  siteName,
  siteUrl,
  outline,
}: WebsiteTrackProps) {
  const track = tracks.find((item) => item.slug === slug);
  const [entered, setEntered] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  if (!track) return null;
  const Icon = track.icon;

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <Link
            to="/tracks"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tracks /{" "}
            <span className="text-foreground">{track.title}</span>
          </Link>
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display max-w-4xl text-4xl font-extrabold sm:text-5xl">
                {track.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  {trackBadge(track)}
                </span>
                <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  {outline.length} sections on the course site
                </span>
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            {track.intro ?? (
              <span className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                TRACK INTRO TO BE SUPPLIED
              </span>
            )}
          </p>
          <Button className="mt-7 h-12 px-7 text-base" asChild>
            <a href="#preview">Preview course</a>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <details className="rounded-2xl border border-border bg-card p-4 shadow-card lg:hidden">
              <summary className="flex cursor-pointer items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <ListTree className="h-4 w-4" /> Track contents ·{" "}
                {outline.length}
              </summary>
              <ol className="mt-3 grid gap-2">
                {outline.map((item) => (
                  <li key={item.n} className="text-sm leading-6">
                    <span className="mr-2 font-mono text-xs font-bold text-primary">
                      {item.n}
                    </span>
                    <span className="font-semibold">{item.title}</span>
                    <span className="block pl-8 text-muted-foreground">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ol>
            </details>
            <nav aria-label="Track contents" className="hidden lg:block">
              <p className="mb-3 font-mono text-xs font-bold text-primary">
                MAP
              </p>
              <ol className="grid gap-3 border-l-2 border-border pl-4">
                {outline.map((item) => (
                  <li key={item.n} className="text-sm leading-6">
                    <span className="font-mono text-xs font-bold text-primary">
                      {item.n}
                    </span>
                    <span className="mt-0.5 block font-semibold">
                      {item.title}
                    </span>
                    <span className="block text-muted-foreground">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div id="preview" className="min-w-0 scroll-mt-28">
            {!entered ? (
              <div>
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  <div className="h-[320px] overflow-hidden sm:h-[420px]">
                    <iframe
                      key={frameKey}
                      title={`${siteName} preview`}
                      src={siteUrl}
                      tabIndex={-1}
                      aria-hidden="true"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                      className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEntered(true)}
                    aria-label="Preview — click to enter the full course"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-foreground/60 p-6 text-center transition-colors hover:bg-foreground/55"
                  >
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-card-hover">
                      <Play className="ml-1 h-7 w-7" />
                    </span>
                    <span className="font-display max-w-md text-xl font-bold text-white sm:text-2xl">
                      Preview — click to enter the full course
                    </span>
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-muted-foreground hover:text-primary"
                  >
                    Open in a new tab ↗
                  </a>
                  <p className="text-xs text-muted-foreground">
                    Preview not loading?{" "}
                    <button
                      type="button"
                      onClick={() => setFrameKey((value) => value + 1)}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <RotateCcw className="h-3 w-3" /> Try again
                    </button>{" "}
                    or{" "}
                    <a
                      href={siteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      Open in new tab
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                    {siteUrl}
                  </span>
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-primary hover:bg-accent"
                  >
                    <ExternalLink className="h-4 w-4" /> Open in a new tab ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setEntered(false)}
                    className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    Back to preview
                  </button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  <iframe
                    title={siteName}
                    src={siteUrl}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    className="h-[80vh] w-full bg-white"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <Link
            to="/tracks"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All tracks
          </Link>
        </div>
      </section>
    </div>
  );
}
