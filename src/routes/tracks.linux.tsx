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
import { trackBadge, trackFormatBadge, tracks } from "@/lib/tracks";
import { BUILD_META } from "@/lib/build-meta";

export const Route = createFileRoute("/tracks/linux")({
  head: () => ({
    meta: [
      { title: "Linux Primitives — DevOps By Nabawy" },
      {
        name: "description",
        content: "Read the Linux complete guide as a hosted PDF with the in-site viewer.",
      },
      { property: "og:title", content: "Linux Primitives — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Master processes, filesystems, permissions, and networking — PDF hosted here.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinuxPage,
});

function LinuxPage() {
  const track = tracks.find((item) => item.slug === "linux");
  const hosted = booksByTrack("linux");
  const totalPages = hosted.reduce((sum, book) => sum + book.pages, 0);
  const site = (companions["linux"] ?? [])[0];

  const [activeBook, setActiveBook] = useState<string | null>(
    hosted[0]?.id ?? null,
  );
  const [downloadState, setDownloadState] = useState<"idle" | "working" | "error">("idle");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadFile, setDownloadFile] = useState<number>(0);

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
    setDownloadFile(0);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      let done = 0;
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
        if (!data) throw new Error(`Could not fetch ${book.pdfName}`);
        zip.file(book.pdfName, data);
        done += 1;
        setDownloadFile(done);
      }
      const blob = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setDownloadProgress(Math.round(metadata.percent));
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "linux-pdfs.zip";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      setDownloadState("idle");
      setDownloadProgress(null);
      setDownloadFile(0);
    } catch {
      setDownloadState("error");
      setDownloadProgress(null);
      setDownloadFile(0);
    }
  };

  if (!track) return null;

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
          <Link to="/tracks" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Tracks / <span className="text-foreground">{track.title}</span>
          </Link>
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
              <track.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display max-w-4xl text-xl font-extrabold leading-tight sm:text-3xl">{track.title}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {hosted.length > 0 ? (
                  <span className="rounded-full border border-border bg-card px-2 py-1 text-[11px] sm:px-2.5 sm:text-xs font-semibold text-muted-foreground">
                    {hosted.length} {hosted.length === 1 ? "PDF" : "PDFs"} · {totalPages} pages
                  </span>
                ) : (
                  <span className="rounded-full border border-border bg-card px-2 py-1 text-[11px] sm:px-2.5 sm:text-xs font-semibold text-muted-foreground">
                    {trackBadge(track)}
                  </span>
                )}
                <span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[11px] font-bold text-primary sm:px-2.5 sm:text-xs">
                  {trackFormatBadge(track)}
                </span>
                <span className="rounded-full border border-border bg-card px-2 py-1 text-[11px] sm:px-2.5 sm:text-xs font-semibold text-muted-foreground">
                  Last updated {BUILD_META.lastUpdated}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{track.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-10">
        {site ? (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary-accent/10 text-secondary-accent sm:h-10 sm:w-10">
              <Globe className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-bold text-secondary-accent">COMPANION COURSE SITE</p>
              <p className="font-display mt-1 text-lg font-bold">{site.title}</p>
              <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{site.note}</p>
            </div>
            <Button asChild className="shrink-0 whitespace-nowrap">
              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open companion site: ${site.title}`}
              >
                Open site <ExternalLink className="ml-1 h-4 w-4 shrink-0" />
              </a>
            </Button>
          </div>
        ) : null}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Track contents" className="min-w-0 -mx-4 px-4 sm:mx-0 sm:px-0 lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 hidden font-mono text-xs font-bold text-primary lg:block">MAP</p>
            <ol className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0">
              {hosted.map((book, index) => {
                const active = book.id === activeBook;
                return (
                  <li key={book.id} className="shrink-0 lg:shrink">
                    <a
                      href={`#book-${book.id}`}
                      aria-current={active ? "true" : undefined}
                      className={`flex min-h-10 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors lg:rounded-lg lg:rounded-l-none lg:border-0 lg:border-l-2 lg:px-3 lg:py-2 ${active ? "border-primary bg-primary/10 text-foreground lg:border-primary lg:bg-primary/10" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground lg:border-border lg:bg-transparent"}`}
                    >
                      <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                      <span className="whitespace-nowrap lg:whitespace-normal">{book.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="relative min-w-0">
            <span aria-hidden="true" className="absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-primary/20 md:block" />
            <ol className="relative grid gap-4 sm:gap-5">
              {hosted.map((book, index) => (
                <li key={book.id} id={`book-${book.id}`} data-book-card={book.id} className="relative scroll-mt-28 rounded-2xl border border-border bg-card p-3 shadow-card sm:p-5">
                  {index === 0 ? <span className="absolute -top-3 left-6 rounded-full bg-secondary-accent px-3 py-1 font-mono text-[11px] font-bold text-white">Start here</span> : null}
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
                      {book.kind === "cheatsheet" ? <FileText className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-sm font-bold leading-tight sm:text-lg">{book.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {book.chapters.length > 0 ? `${book.chapters.length} sections` : book.kind === "cheatsheet" ? "Cheat sheet" : "PDF document"}
                      </p>
                      <p className="mt-1 font-mono text-xs font-bold text-muted-foreground">{book.pages} PAGES · {book.lang === "ar" ? "العربية" : "ENGLISH"}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 sm:mt-4 sm:flex sm:flex-wrap sm:pt-4">
                    <Button className="w-full sm:w-auto" asChild>
                      <Link
                        to="/books/$bookId"
                        params={{ bookId: book.id }}
                        search={{ page: 1 }}
                        aria-label={`Read in viewer: ${book.title}`}
                      >
                        Read <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto" asChild>
                      <a
                        href={pdfUrl(book)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Download PDF: ${book.title}`}
                      >
                        <Download className="mr-1 h-4 w-4" /> PDF
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center">
          <Button variant="outline" className="h-10 px-5 text-sm" onClick={downloadAll} disabled={downloadState === "working"}>
            {downloadState === "working" ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Zipping {downloadFile}/{hosted.length} files… {downloadProgress !== null ? `${downloadProgress}%` : ""}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download all PDFs
              </>
            )}
          </Button>
          {downloadState === "working" ? (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={downloadProgress ?? 0}
              aria-label="Download progress"
              className="mx-auto mt-3 h-2 w-full max-w-md overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${downloadProgress ?? 0}%` }}
              />
            </div>
          ) : null}
          <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
            {downloadState === "error" ? "Bundling failed — use the per-PDF download buttons above." : "Zipped in your browser. Nothing is uploaded."}
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-10 text-center">
        <Link to="/tracks" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> All tracks
        </Link>
      </div>
    </div>
  );
}
