import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  booksByTrack,
  isComingSoon,
  pdfUrl,
  releasePdfUrl,
} from "@/lib/library";
import { trackBadge, tracks } from "@/lib/tracks";

export const Route = createFileRoute("/tracks/$slug")({
  head: ({ params }) => {
    const track = tracks.find((item) => item.slug === params.slug);
    const title = track
      ? `${track.title} — DevOps By Nabawy`
      : "Track — DevOps By Nabawy";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: track?.description ?? "Practical DevOps learning track.",
        },
      ],
    };
  },
  component: TrackDetailPage,
});

function TrackDetailPage() {
  const { slug } = Route.useParams();
  const track = tracks.find((item) => item.slug === slug);
  if (!track) throw notFound();
  if (track.format === "website") throw notFound();
  const hosted = booksByTrack(slug);
  const comingSoon = isComingSoon(slug);
  const totalPages = hosted.reduce((sum, book) => sum + book.pages, 0);
  const firstBookId = hosted[0]?.id;

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
  }, [slug, hosted.length]);

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
      anchor.download = `${slug}-pdfs.zip`;
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

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-4 py-6 sm:px-6 sm:py-8">
          <Link
            to="/tracks"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tracks /{" "}
            <span className="text-foreground">{track.title}</span>
          </Link>
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <track.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display max-w-4xl text-2xl font-extrabold sm:text-3xl">
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
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
            {track.intro ?? (
              <span className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                TRACK INTRO TO BE SUPPLIED
              </span>
            )}
          </p>
          {firstBookId ? (
            <Button className="mt-5 h-10 px-5 text-sm" asChild>
              <a href={`#book-${firstBookId}`}>
                Start reading <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </section>

      {comingSoon || !hosted.length ? (
        <section className="mx-auto max-w-xl px-6 py-12 text-center">
          <span
            aria-hidden="true"
            className="relative mx-auto grid h-12 w-12 place-items-center"
          >
            <span className="absolute h-10 w-10 rounded-2xl bg-primary/20" />
            <span className="absolute h-6 w-6 rotate-12 rounded-lg bg-secondary-accent/50" />
          </span>
          <h2 className="font-display mt-6 text-3xl font-extrabold">
            PDFs to be supplied
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This track has no PDFs yet. Start with Kubernetes, Ansible, or
            Docker meanwhile.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/tracks">
              All tracks <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 sm:px-4 py-6 sm:px-6 sm:py-8 sm:py-10">
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
                    className="relative scroll-mt-28 rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5"
                  >
                    {index === 0 ? (
                      <span className="absolute -top-3 left-6 rounded-full bg-secondary-accent px-3 py-1 font-mono text-[11px] font-bold text-white">
                        Start here
                      </span>
                    ) : null}
                    <div className="flex items-start gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        {book.kind === "cheatsheet" ? (
                          <FileText className="h-5 w-5" />
                        ) : (
                          <BookOpen className="h-5 w-5" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display text-base font-bold sm:text-lg">
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
              className="h-12 px-8 text-base"
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
            <p
              aria-live="polite"
              className="mt-3 text-sm text-muted-foreground"
            >
              {downloadState === "error"
                ? "Bundling failed — use the per-PDF download buttons above."
                : "Zipped in your browser. Nothing is uploaded."}
            </p>
            <Link
              to="/tracks"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All tracks
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
