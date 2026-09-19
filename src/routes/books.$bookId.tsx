import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { books, pdfUrl, readUrl } from "@/lib/library";
import { tracks } from "@/lib/tracks";

export const Route = createFileRoute("/books/$bookId")({
  head: ({ params }) => {
    const book = books.find((item) => item.id === params.bookId);
    const title = book
      ? `${book.title} — DevOps By Nabawy`
      : "Book — DevOps By Nabawy";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: book
            ? `${book.title}: read online or download the PDF.`
            : "DevOps book reader.",
        },
      ],
    };
  },
  component: BookReaderPage,
});

function BookReaderPage() {
  const { bookId } = Route.useParams();
  const book = books.find((item) => item.id === bookId);
  const [section, setSection] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [wide, setWide] = useState(false);
  const [full, setFull] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const frameBox = useRef<HTMLDivElement>(null);
  if (!book) throw notFound();
  const copyLink = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(label);
    window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1600);
  };
  const track = tracks.find((item) => item.slug === book.track);
  const url = readUrl(book);
  const shown = book.chapters.slice(0, 60);
  const sectionList = (
    <>
      {shown.map((chapter, i) => (
        <button
          key={`${chapter}-${i}`}
          onClick={() => setSection(i)}
          className={`mb-1 w-full rounded-md p-3 text-left text-sm ${
            section === i
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          <span className="mr-2 font-mono text-xs">
            {String(i + 1).padStart(2, "0")}
          </span>
          {chapter}
        </button>
      ))}
      {book.chapters.length > shown.length && (
        <p className="p-3 text-xs text-muted-foreground">
          + {book.chapters.length - shown.length} more inside the full book
          below.
        </p>
      )}
    </>
  );

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <Link
            to="/tracks/$slug"
            params={{ slug: book.track }}
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tracks /{" "}
            <span className="text-foreground">
              {track?.title ?? book.track}
            </span>
          </Link>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-[10px] font-bold text-primary-foreground">
              {book.kind === "guide"
                ? "GUIDEBOOK"
                : book.kind === "lab"
                  ? "HANDS-ON DOC"
                  : "CHEAT SHEET"}
            </span>
            <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
              {book.lang === "ar" ? "العربية" : "English"}
            </span>
            <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
              {book.pdfMB} MB PDF
            </span>
          </div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display max-w-4xl text-4xl font-extrabold sm:text-5xl">
                {book.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                {book.chapters.length > 0
                  ? `${book.chapters.length} sections. Read online below or download the print-ready PDF.`
                  : "Read online below or download the print-ready PDF."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href={pdfUrl(book)} target="_blank" rel="noreferrer">
                  <Download className="mr-1 h-4 w-4" /> PDF · {book.pdfMB} MB
                </a>
              </Button>
              {url && (
                <Button variant="outline" asChild>
                  <a href={url} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-1 h-4 w-4" /> Full page
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {url ? (
        <section
          className={`mx-auto px-6 py-12 ${wide ? "max-w-[110rem]" : "max-w-7xl"}`}
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold text-primary">
                READ ONLINE
              </p>
              <h2 className="font-display mt-2 text-3xl font-extrabold">
                Full book
              </h2>
            </div>
            <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-md border border-border bg-card p-1 shadow-card">
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                disabled={zoom <= 70}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <button
                onClick={() => setZoom(100)}
                className="min-w-14 shrink-0 rounded px-2 py-1 font-mono text-xs font-bold text-muted-foreground hover:bg-accent"
                aria-label="Reset zoom"
              >
                {zoom}%
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                disabled={zoom >= 150}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-5 w-px shrink-0 bg-border" />
              <Button
                variant="ghost"
                size="sm"
                className={`hidden shrink-0 sm:inline-flex ${wide ? "bg-accent" : ""}`}
                onClick={() => setWide((w) => !w)}
                aria-label="Toggle wide view"
              >
                {wide ? "Narrow" : "Wide"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  if (document.fullscreenElement) {
                    void document.exitFullscreen();
                    setFull(false);
                  } else {
                    void frameBox.current?.requestFullscreen();
                    setFull(true);
                  }
                }}
                aria-label="Toggle fullscreen"
              >
                {full ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              <span className="mx-1 h-5 w-px shrink-0 bg-border" />
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() =>
                  copyLink(
                    "page",
                    window.location.href.split("#", 1)[0] ??
                      window.location.href,
                  )
                }
                aria-label="Copy link to this book"
              >
                {copied === "page" ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                <span className="ml-1 hidden text-xs md:inline">
                  {copied === "page" ? "Copied" : "Copy link"}
                </span>
              </Button>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <details className="border border-border bg-card p-4 shadow-card lg:hidden">
              <summary className="flex cursor-pointer items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <FileText className="h-4 w-4" /> Sections ·{" "}
                {book.chapters.length}
              </summary>
              <div className="mt-3 max-h-[50dvh] overflow-y-auto">
                {sectionList}
              </div>
            </details>
            <aside className="hidden border border-border bg-card p-4 shadow-card lg:sticky lg:top-24 lg:block lg:max-h-[80dvh] lg:overflow-y-auto">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <FileText className="h-4 w-4" /> Sections
              </p>
              {sectionList}
            </aside>
            <div
              ref={frameBox}
              className="overflow-auto border border-border bg-card shadow-card"
            >
              <iframe
                title={book.title}
                src={url}
                className="h-[75dvh] w-full origin-top-left bg-white"
                style={{
                  zoom: `${zoom}%`,
                  height: full ? "100dvh" : "75dvh",
                }}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3 border border-border bg-card p-6 shadow-card">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
              <BookOpen />
            </span>
            <p className="text-sm text-muted-foreground">
              Online reading is not available for this cheat sheet — download
              the PDF above.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
