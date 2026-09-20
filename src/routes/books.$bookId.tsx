import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/pdf-viewer";
import { books, pdfUrl, readUrl, releasePdfUrl } from "@/lib/library";
import { tracks } from "@/lib/tracks";

const parsePage = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const page =
    typeof raw === "string" || typeof raw === "number" ? Number(raw) : NaN;
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
};

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
            ? `${book.title}: read the PDF with page links, search, and thumbnails.`
            : "DevOps PDF viewer.",
        },
      ],
    };
  },
  component: BookPdfPage,
});

function BookPdfPage() {
  const { bookId } = Route.useParams();
  const search = Route.useSearch();
  const page = parsePage(
    typeof search === "object" && search !== null
      ? (search as Record<string, unknown>)["page"]
      : undefined,
  );
  const navigate = Route.useNavigate();
  const book = books.find((item) => item.id === bookId);
  if (!book) throw notFound();
  const track = tracks.find((item) => item.slug === book.track);
  const onlineUrl = readUrl(book);
  const source = useMemo(
    () => ({ kind: "url", url: pdfUrl(book) }) as const,
    [book],
  );

  return (
    <PdfViewer
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
            <a href={onlineUrl} target="_blank" rel="noreferrer">
              Read online <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        ) : undefined
      }
      initialPage={page}
      fallbackUrl={releasePdfUrl(book)}
      buildPageLink={(next) =>
        new URL(
          `${import.meta.env.BASE_URL}books/${book.id}?page=${next}`,
          window.location.origin,
        ).toString()
      }
      onPageChange={(next) => {
        navigate({
          search: (previous) => ({ ...previous, page: next }),
        });
      }}
    />
  );
}
