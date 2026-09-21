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
import { SitePreview } from "@/components/website-track";
import { booksByTrack, companions, pdfUrl, releasePdfUrl } from "@/lib/library";
import { trackBadge, tracks } from "@/lib/tracks";

export const Route = createFileRoute("/tracks/linux")({
  head: () => ({
    meta: [
      { title: "Linux Primitives — DevOps By Nabawy" },
      {
        name: "description",
        content: "Read Linux101 Complete Guide as hosted PDF, or preview the companion site.",
      },
      { property: "og:title", content: "Linux Primitives — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Master processes, filesystems, permissions, and networking — PDF + labs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinuxPage,
});

const OUTLINE = [
  { n: "01", title: "Linux101 Notes", text: "Cheat sheets, command bank, and RH124 notes." },
  { n: "02", title: "NTI Linux Course", text: "Structured course material and exercises." },
  { n: "03", title: "Practice Lab Drills", text: "Hands-on drills with a global roadmap." },
  { n: "04", title: "Flashcards & Quizzes", text: "Lock in commands with active recall." },
];

type Tab = "pdfs" | "website";

function LinuxPage() {
  const track = tracks.find((item) => item.slug === "linux");
  const hosted = booksByTrack("linux");
  const totalPages = hosted.reduce((sum, book) => sum + book.pages, 0);
  const companionSites = companions["linux"] ?? [];
  const site = companionSites[0];

  const [tab, setTab] = useState<Tab>("pdfs");
  const [activeBook, setActiveBook] = useState<string | null>(hosted[0]?.id ?? null);
  const [downloadState, setDownloadState] = useState<"idle" | "working" | "error">("idle");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (tab !== "pdfs" || !hosted.length) return;
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
  }, [tab, hosted.length]);

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
        if (!data) throw new Error(`Could not fetch ${book.pdfName}`);
        zip.file(book.pdfName, data);
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
    } catch {
      setDownloadState("error");
      setDownloadProgress(null);
    }
  };

  if (!track) return null;

  const tabs: { id: Tab; label: string; icon: typeof BookOpen; hint: string }[] = [
    { id: "pdfs", label: "PDF guide", icon: BookOpen, hint: `${hosted.length}` },
    ...(site ? [{ id: "website" as Tab, label: "Companion site", icon: Globe, hint: "course" }] : []),
  ];

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8">
          <Link to="/tracks" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Tracks / <span className="text-foreground">{track.title}</span>
          </Link>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <track.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display max-w-4xl text-2xl font-extrabold sm:text-3xl">{track.title}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {trackBadge(track)}
                </span>
                {hosted.length > 0 ? (
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {hosted.length} PDF · {totalPages} pages
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{track.description}</p>
          <div role="tablist" aria-label="Linux content source" className="mt-5 inline-flex rounded-full border border-border bg-muted/60 p-1">
            {tabs.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${active ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.label}
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">{item.hint}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {tab === "pdfs" ? (
        <section className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <nav aria-label="Track contents" className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 hidden font-mono text-xs font-bold text-primary lg:block">MAP</p>
              <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
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
            <div className="relative">
              <span aria-hidden="true" className="absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-primary/20 md:block" />
              <ol className="relative grid gap-5">
                {hosted.map((book, index) => (
                  <li key={book.id} id={`book-${book.id}`} data-book-card={book.id} className="relative scroll-mt-28 rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
                    {index === 0 ? <span className="absolute -top-3 left-6 rounded-full bg-secondary-accent px-3 py-1 font-mono text-[11px] font-bold text-white">Start here</span> : null}
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        {book.kind === "cheatsheet" ? <FileText className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display text-base font-bold sm:text-lg">{book.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {book.chapters.length > 0 ? `${book.chapters.length} sections` : book.kind === "cheatsheet" ? "Cheat sheet" : "PDF document"}
                        </p>
                        <p className="mt-1 font-mono text-xs font-bold text-muted-foreground">{book.pages} PAGES · {book.lang === "ar" ? "العربية" : "ENGLISH"}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                      <Button size="sm" asChild>
                        <Link to="/books/$bookId" params={{ bookId: book.id }} search={{ page: 1 }}>
                          Read <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
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
          <div className="mt-10 border-t border-border pt-6 text-center">
            <Button variant="outline" className="h-10 px-5 text-sm" onClick={downloadAll} disabled={downloadState === "working"}>
              {downloadState === "working" ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Bundling… {downloadProgress !== null ? `${downloadProgress}%` : ""}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Download all PDFs
                </>
              )}
            </Button>
            <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
              {downloadState === "error" ? "Bundling failed — use the per-PDF download buttons above." : "Zipped in your browser. Nothing is uploaded."}
            </p>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
          {site ? (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary-accent/10 text-secondary-accent">
                <Globe className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-bold text-secondary-accent">COMPANION COURSE SITE</p>
                <p className="font-display mt-1 text-lg font-bold">{site.title}</p>
                <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{site.note}</p>
              </div>
              <Button asChild className="shrink-0">
                <a href={site.url} target="_blank" rel="noreferrer">
                  Open site <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          ) : null}
          {site ? <SitePreview siteName={site.title} siteUrl={site.url} outline={OUTLINE} /> : null}
        </section>
      )}
      <div className="mx-auto max-w-7xl px-6 pb-10 text-center">
        <Link to="/tracks" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> All tracks
        </Link>
      </div>
    </div>
  );
}
