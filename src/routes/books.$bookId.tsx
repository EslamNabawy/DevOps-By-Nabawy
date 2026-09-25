import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "@/components/pdf-preview";
import { books, onlineUrlForBook, pdfUrl, releasePdfUrl } from "@/lib/library";
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
            ? `${book.title}: preview the PDF, then download or open the full file.`
            : "DevOps PDF preview.",
        },
      ],
    };
  },
  component: BookPdfPage,
});

function BookPdfPage() {
  const { bookId } = Route.useParams();
  const book = books.find((item) => item.id === bookId);
  if (!book) throw notFound();
  const track = tracks.find((item) => item.slug === book.track);
  const onlineUrl = onlineUrlForBook(book);
  const external = onlineUrl?.startsWith("http") ?? false;
  const source = useMemo(
    () => ({ kind: "url", url: pdfUrl(book) }) as const,
    [book],
  );

  return (
    <PdfPreview
      source={source}
      sourceKey={book.id}
      title={book.title}
      eyebrow={`${book.pages} PAGES · ${book.lang === "ar" ? "العربية" : "ENGLISH"}`}
      breadcrumb={
        <>
          <Link
            to="/tracks/$slug"
            params={{ slug: book.track }}
            className="font-semibold hover:text-primary"
          >
            {track?.title ?? book.track}
          </Link>{" "}
          <span aria-hidden="true">›</span>{" "}
          <span aria-current="page" className="text-foreground">
            {book.title}
          </span>
        </>
      }
      actions={
        onlineUrl ? (
          <Button variant="outline" size="sm" asChild>
            <a
              href={onlineUrl}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap"
              aria-label={
                external
                  ? `Read on companion site: ${book.title}`
                  : `Read online: ${book.title}`
              }
            >
              {external ? (
                <>
                  Companion site{" "}
                  <ExternalLink className="ml-1 h-4 w-4 shrink-0" />
                </>
              ) : (
                <>
                  Read online <ArrowRight className="ml-1 h-4 w-4 shrink-0" />
                </>
              )}
            </a>
          </Button>
        ) : undefined
      }
      downloadUrl={pdfUrl(book)}
      downloadName={book.pdfName}
      fallbackUrl={releasePdfUrl(book)}
    />
  );
}
