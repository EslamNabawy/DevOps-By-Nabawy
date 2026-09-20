import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Globe,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { booksByTrack, companions, pdfUrl, releasePdfUrl } from "@/lib/library";
import { trackBadge, tracks } from "@/lib/tracks";

export const Route = createFileRoute("/tracks/cicd")({
  head: () => ({
    meta: [
      { title: "CI/CD Automation — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Read the 8 CI/CD handbooks as hosted PDFs, or preview the companion course site.",
      },
      { property: "og:title", content: "CI/CD Automation — DevOps By Nabawy" },
      {
        property: "og:description",
        content:
          "The CI/CD library: from commit to production with 8 focused handbooks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CicdPage,
});

const OUTLINE = [
  {
    n: "01",
    title: "Start Here",
    text: "Foundations, Git & CI · 75 min · Beginner.",
  },
  {
    n: "02",
    title: "Build",
    text: "Pipelines, test & artifacts · 130 min.",
  },
  {
    n: "03",
    title: "Deliver",
    text: "Deployment & operations · 255 min.",
  },
  {
    n: "04",
    title: "Observability",
    text: "Loki, Prometheus & Grafana · 120 min.",
  },
  { n: "05", title: "Jenkins", text: "Complete guide · 345 min." },
  {
    n: "06",
    title: "Platforms",
    text: "Actions, GitLab, ArgoCD + roadmaps · 190 min.",
  },
  {
    n: "07",
    title: "Labs",
    text: "Build it, break it, recover it · 675 min.",
  },
  { n: "08", title: "Reference", text: "Command cheatsheet · 15 min." },
];

function CicdPage() {
  const track = tracks.find((item) => item.slug === "cicd");
  const hosted = booksByTrack("cicd");
  const totalPages = hosted.reduce((sum, book) => sum + book.pages, 0);
  const firstBookId = hosted[0]?.id;
  const companionSites = companions["cicd"] ?? [];

  const [activeBook, setActiveBook] = useState<string | null>(
    firstBookId ?? null,
  );
  const [downloadState, setDownloadState] = useState<
    "idle" | "working" | "error"
  >("idle");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!hosted.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-book-card");
            if (id) setActiveBook(id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    const nodes = Array.from(document.querySelectorAll("[data-book-card]"));
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [hosted.length]);

  const downloadAll = async () => {
    if (downloadState === "working" || !hosted.length) return;
    setDownloadState("working");
    setDownloadProgress(0);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const book of hosted) {
        let data: ArrayBuffer | null = null;
        for (const url of [pdfUrl(book), releasePdfUrl(book)]) {
          try {
            const response = await fetch(url);
            if (!response.ok) continue;
            data = await response.arrayBuffer();
            break;
          } catch {
            continue;
          }
        }
        if (!data) {
          throw new Error(`Could not fetch ${book.pdfName}`);
        }
        zip.file(book.pdfName, data);
      }
      const blob = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setDownloadProgress(Math.round(metadata.percent));
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "cicd-pdfs.zip";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      setDownloadState("idle");
      setDownloadProgress(null);
    } catch {
      setDownloadState("error");
      setDownloadProgress(null);
    }
  };

  if (!track) return null;

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
          <Link
            to="/tracks"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tracks /{" "}
            <span className="text-foreground">{track.title}</span>
          </Link>
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <track.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display max-w-4xl text-3xl font-extrabold sm:text-4xl">
                {track.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  {trackBadge(track)}
                </span>
                {hosted.length > 0 ? (
                  <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    {hosted.length} PDFs · {totalPages} pages
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            {track.description}
          </p>
          {firstBookId ? (
            <Button className="mt-6 h-11 px-6 text-base" asChild>
              <a href="#book-cicd-01-start-here">
                Start reading <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <nav
            aria-label="Track contents"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="mb-3 hidden font-mono text-xs font-bold text-primary lg:block">
              MAP
            </p>
            <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {hosted.map((book, index) => {
                const active = book.id === activeBook;
                return (
                  <li key={book.id} className="shrink-0 lg:shrink">
                    <a
                      href={`#book-${book.id}`}
                      aria-current={active ? "true" : undefined}
                      className={`flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors lg:rounded-lg lg:rounded-l-none lg:border-0 lg:border-l-2 lg:px-3 lg:py-2 ${
                        active
                          ? "border-primary bg-primary/10 text-foreground lg:border-primary lg:bg-primary/10"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground lg:border-border lg:bg-transparent"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="whitespace-nowrap lg:whitespace-normal">
                        {book.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-primary/20 md:block"
            />
            <ol className="relative grid gap-6">
              {hosted.map((book, index) => (
                <li
                  key={book.id}
                  id={`book-${book.id}`}
                  data-book-card={book.id}
                  className="relative scroll-mt-28 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6"
                >
                  {index === 0 ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-secondary-accent px-3 py-1 font-mono text-[11px] font-bold text-white">
                      Start here
                    </span>
                  ) : null}
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      {book.kind === "cheatsheet" ? (
                        <FileText className="h-6 w-6" />
                      ) : (
                        <BookOpen className="h-6 w-6" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg font-bold sm:text-xl">
                        {book.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {book.chapters.length > 0
                          ? `${book.chapters.length} sections`
                          : book.kind === "cheatsheet"
                            ? "Cheat sheet"
                            : "PDF document"}
                      </p>
                      <p className="mt-1 font-mono text-xs font-bold text-muted-foreground">
                        {book.pages} PAGES ·{" "}
                        {book.lang === "ar" ? "العربية" : "ENGLISH"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button asChild>
                      <Link
                        to="/books/$bookId"
                        params={{ bookId: book.id }}
                        search={{ page: 1 }}
                      >
                        Read <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={pdfUrl(book)} target="_blank" rel="noreferrer">
                        <Download className="mr-1 h-4 w-4" /> PDF
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            className="h-11 px-6 text-base"
            onClick={downloadAll}
            disabled={downloadState === "working"}
          >
            {downloadState === "working" ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Bundling…{" "}
                {downloadProgress !== null ? `${downloadProgress}%` : ""}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download all PDFs
              </>
            )}
          </Button>
          <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
            {downloadState === "error"
              ? "Bundling failed — use the per-PDF download buttons above."
              : "Zipped in your browser. Nothing is uploaded."}
          </p>
        </div>
      </section>

      {companionSites.length > 0 ? (
        <section className="border-t border-border bg-muted/35">
          <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
            <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-card lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary-accent/10 text-secondary-accent">
                  <Globe className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-xs font-bold text-secondary-accent">
                    COMPANION COURSE SITE
                  </p>
                  {companionSites.map((site) => (
                    <div key={site.url} className="mt-2">
                      <p className="font-display text-xl font-bold">
                        {site.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {site.note}
                      </p>
                    </div>
                  ))}
                  <ol className="mt-4 grid gap-1.5 sm:grid-cols-2">
                    {OUTLINE.map((item) => (
                      <li key={item.n} className="text-sm leading-6">
                        <span className="mr-2 font-mono text-xs font-bold text-primary">
                          {item.n}
                        </span>
                        <span className="font-semibold">{item.title}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          — {item.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {companionSites.map((site) => (
                  <Button key={site.url} asChild>
                    <a href={site.url} target="_blank" rel="noreferrer">
                      Open companion site{" "}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/tracks"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> All tracks
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
