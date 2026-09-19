import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Rocket,
  Signal,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  booksByTrack,
  companions,
  isComingSoon,
  pdfUrl,
  readUrl,
} from "@/lib/library";
import { tracks } from "@/lib/tracks";

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
  const hosted = booksByTrack(slug);
  const links = companions[slug] ?? [];
  const comingSoon = isComingSoon(slug);
  const totalSections = hosted.reduce(
    (sum, book) => sum + book.chapters.length,
    0,
  );

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
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-sm px-2.5 py-1 font-mono text-[10px] font-bold ${
                comingSoon
                  ? "bg-muted text-muted-foreground"
                  : track.kind === "lab"
                    ? "bg-secondary-accent/10 text-secondary-accent"
                    : "bg-primary px-2.5 text-primary-foreground"
              }`}
            >
              {track.status}
            </span>
            <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
              {track.level}
            </span>
            {!comingSoon && (
              <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
                {hosted.length > 0
                  ? `${hosted.length} docs hosted here`
                  : "Companion site"}
              </span>
            )}
          </div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display max-w-4xl text-4xl font-extrabold sm:text-5xl">
                {track.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                {track.description}
              </p>
            </div>
            <div className="min-w-56 border border-border bg-card p-4 shadow-card">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span>
                  <b className="block text-base text-foreground">
                    {hosted.length > 0 ? hosted.length : links.length}
                  </b>
                  <span className="text-muted-foreground">
                    {hosted.length > 0 ? "Docs" : "Sites"}
                  </span>
                </span>
                <span>
                  <b className="block text-base text-foreground">
                    {totalSections > 0 ? totalSections : "—"}
                  </b>
                  <span className="text-muted-foreground">Sections</span>
                </span>
                <span>
                  <b className="block text-base text-foreground">
                    {track.hours}
                  </b>
                  <span className="text-muted-foreground">Est. time</span>
                </span>
              </div>
              {slug === "terraform" && (
                <Button className="mt-4 w-full" asChild>
                  <Link to="/tracks/terraform">
                    <Wifi className="mr-1 h-4 w-4" /> Open sandbox
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {comingSoon && (
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-4 border border-border bg-card p-8 shadow-card">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <Rocket />
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Coming soon
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No books for this track yet. Start with Kubernetes, Ansible, or
                Docker — or follow the roadmap order.
              </p>
            </div>
            <Button className="ml-auto" asChild>
              <Link to="/roadmap">
                Roadmap <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {hosted.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold text-primary">
                BOOKSHELF
              </p>
              <h2 className="font-display mt-2 text-3xl font-extrabold">
                {hosted.length} docs · {totalSections} sections
              </h2>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> About {track.hours} ·{" "}
              <Signal className="h-4 w-4" /> {track.level}
            </p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {hosted.map((book, index) => (
              <li
                key={book.id}
                className="flex flex-col border border-border bg-card p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    DOC {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                    {book.kind === "cheatsheet" ? <FileText /> : <BookOpen />}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-xl font-bold">
                  {book.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {book.chapters.length > 0
                    ? `${book.chapters.length} sections · ${book.pdfMB} MB PDF · ${
                        book.lang === "ar" ? "العربية" : "English"
                      }`
                    : `${book.pdfMB} MB PDF · ${
                        book.lang === "ar" ? "العربية" : "English"
                      }`}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                  {readUrl(book) ? (
                    <Button size="sm" asChild>
                      <Link to="/books/$bookId" params={{ bookId: book.id }}>
                        Read online <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" asChild>
                    <a href={pdfUrl(book)} target="_blank" rel="noreferrer">
                      <Download className="mr-1 h-4 w-4" /> PDF
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {links.length > 0 && (
        <section
          className={
            hosted.length > 0
              ? "border-t border-border bg-muted/35"
              : "mx-auto max-w-7xl px-6 py-14"
          }
        >
          <div
            className={
              hosted.length > 0 ? "mx-auto max-w-7xl px-6 py-14" : undefined
            }
          >
            <p className="font-mono text-xs font-bold text-secondary-accent">
              COMPANION SITE
            </p>
            <h2 className="font-display mt-2 text-3xl font-extrabold">
              Keep reading there
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary-accent/10 text-secondary-accent">
                    <ExternalLink />
                  </span>
                  <span>
                    <span className="font-display block text-xl font-bold">
                      {link.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {link.note}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
