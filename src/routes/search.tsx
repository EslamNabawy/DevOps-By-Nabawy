import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, FileText, Search } from "lucide-react";
import { useState } from "react";
import { searchItems } from "@/lib/tracks";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Search — DevOps By Nabawy" },
      {
        name: "description",
        content: "Search tracks, books, and sections across the library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

type SearchItem = {
  title: string;
  subtitle: string;
  href: string;
};

type Group = "Tracks" | "Books" | "Sections";

function ResultLink({ item }: { item: SearchItem }) {
  const body = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <FileText className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold">{item.title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {item.subtitle}
        </span>
      </span>
      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
    </>
  );
  const className =
    "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50";
  if (item.href === "/tracks/terraform") {
    return (
      <Link to="/tracks/terraform" className={className}>
        {body}
      </Link>
    );
  }
  if (item.href === "/tracks/cicd") {
    return (
      <Link to="/tracks/cicd" className={className}>
        {body}
      </Link>
    );
  }
  if (item.href === "/tracks/linux") {
    return (
      <Link to="/tracks/linux" className={className}>
        {body}
      </Link>
    );
  }
  if (item.href.startsWith("/books/")) {
    return (
      <Link
        to="/books/$bookId"
        params={{ bookId: item.href.replace("/books/", "") }}
        className={className}
      >
        {body}
      </Link>
    );
  }
  return (
    <Link
      to="/tracks/$slug"
      params={{ slug: item.href.replace("/tracks/", "") }}
      className={className}
    >
      {body}
    </Link>
  );
}

const groupOf = (item: {
  title: string;
  subtitle: string;
  href: string;
}): Group => {
  if (item.href.startsWith("/tracks")) return "Tracks";
  if (item.subtitle.startsWith("Book")) return "Books";
  return "Sections";
};

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [draft, setDraft] = useState(q);
  const needle = q.trim().toLowerCase();
  const results =
    needle.length > 0
      ? searchItems.filter((item) =>
          `${item.title} ${item.subtitle}`.toLowerCase().includes(needle),
        )
      : [];
  const groups: Group[] = ["Tracks", "Books", "Sections"];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <p className="font-mono text-xs font-bold text-primary">SEARCH</p>
      <h1 className="font-display mt-3 text-3xl font-extrabold sm:text-4xl">
        Search the library
      </h1>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          navigate({ search: { q: draft.trim() } });
        }}
      >
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-card">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search anything..."
            aria-label="Search anything"
            className="h-full w-full bg-transparent text-base outline-none"
          />
        </label>
      </form>

      {needle.length === 0 ? (
        <p className="mt-6 text-center text-sm leading-6 text-muted-foreground">
          Type above to search tracks, books, and sections.
        </p>
      ) : (
        <div className="mt-6">
          <p
            aria-live="polite"
            className="text-sm font-semibold text-muted-foreground"
          >
            {results.length === 0
              ? `No results for “${q}”.`
              : `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”.`}
          </p>
          {results.length === 0 ? (
            <div className="mx-auto mt-6 flex max-w-md flex-col items-center py-6 text-center">
              <span
                aria-hidden="true"
                className="relative grid h-12 w-12 place-items-center"
              >
                <span className="absolute h-10 w-10 rounded-2xl bg-primary/20" />
                <span className="absolute h-6 w-6 rotate-12 rounded-lg bg-secondary-accent/50" />
              </span>
              <p className="font-display mt-5 text-xl font-bold">
                Nothing matched that search
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Try a shorter word — “pod”, “role”, “pipeline”.
              </p>
            </div>
          ) : (
            groups.map((group) => {
              const items = results.filter((item) => groupOf(item) === group);
              if (!items.length) return null;
              return (
                <section key={group} className="mt-8">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                    {group}
                  </h2>
                  <ol className="mt-3 grid gap-2">
                    {items.map((item, index) => (
                      <li key={`${item.title}-${index}`}>
                        <ResultLink item={item} />
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
