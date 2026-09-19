import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useState } from "react";
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
  if (!book) throw notFound();
  const track = tracks.find((item) => item.slug === book.track);
  const url = readUrl(book);
  const shown = book.chapters.slice(0, 60);

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
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6">
            <p className="font-mono text-xs font-bold text-primary">
              READ ONLINE
            </p>
            <h2 className="font-display mt-2 text-3xl font-extrabold">
              Full book
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="border border-border bg-card p-4 shadow-card lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <FileText className="h-4 w-4" /> Sections
              </p>
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
                  + {book.chapters.length - shown.length} more inside the full
                  book below.
                </p>
              )}
            </aside>
            <div className="overflow-hidden border border-border bg-card shadow-card">
              <iframe
                title={book.title}
                src={url}
                className="h-[80vh] w-full"
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
