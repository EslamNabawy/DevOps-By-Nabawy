import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Images,
  Link2,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type PdfViewerSource =
  { kind: "url"; url: string } | { kind: "file"; file: File };

export type PdfViewerMatch = {
  order: number;
  page: number;
  pageOrder: number;
  preview: string;
};

type PdfViewerProps = {
  source: PdfViewerSource;
  sourceKey: string;
  title: string;
  eyebrow: string;
  breadcrumb: ReactNode;
  actions?: ReactNode;
  initialPage: number;
  buildPageLink: (page: number) => string;
  onPageChange?: (page: number) => void;
  errorAction?: ReactNode;
};

type PdfApi = typeof import("pdfjs-dist");

const clampPage = (value: number, total: number) => {
  if (!Number.isFinite(value)) return 1;
  const max = Math.max(1, total || 1);
  return Math.min(Math.max(1, Math.floor(value)), max);
};

const snippet = (text: string, start: number, length: number) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const begin = Math.max(0, start - 56);
  const end = Math.min(clean.length, start + length + 56);
  const clipped = clean.slice(begin, end);
  return `${begin > 0 ? "…" : ""}${clipped}${end < clean.length ? "…" : ""}`;
};

const applyHighlights = (
  container: HTMLElement,
  query: string,
  selectedPageOrder: number,
) => {
  const needle = query.toLocaleLowerCase();
  if (needle.length < 2) return;
  let order = -1;
  const spans = container.querySelectorAll("span");
  spans.forEach((span) => {
    const text = span.textContent ?? "";
    if (!text || span.querySelector("mark")) return;
    const lower = text.toLocaleLowerCase();
    let cursor = 0;
    let position = lower.indexOf(needle, cursor);
    if (position === -1) return;
    const fragment = document.createDocumentFragment();
    while (position !== -1) {
      order += 1;
      if (position > cursor) {
        fragment.append(document.createTextNode(text.slice(cursor, position)));
      }
      const mark = document.createElement("mark");
      mark.textContent = text.slice(position, position + query.length);
      if (order === selectedPageOrder) mark.classList.add("selected");
      fragment.append(mark);
      cursor = position + query.length;
      position = lower.indexOf(needle, cursor);
    }
    if (cursor < text.length) {
      fragment.append(document.createTextNode(text.slice(cursor)));
    }
    span.replaceChildren(fragment);
  });
};

function PageThumbnail({
  doc,
  pageNumber,
  active,
  onSelect,
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  active: boolean;
  onSelect: (page: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const page = await doc.getPage(pageNumber);
      if (cancelled) return;
      const viewport = page.getViewport({ scale: 0.24 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvas, viewport }).promise;
    };
    void render();
    return () => {
      cancelled = true;
    };
  }, [doc, pageNumber]);

  return (
    <button
      type="button"
      onClick={() => onSelect(pageNumber)}
      aria-current={active ? "page" : undefined}
      aria-label={`Go to page ${pageNumber}`}
      className={`w-full rounded-xl border p-2 text-left transition-colors ${
        active
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="h-auto w-full rounded bg-white"
        aria-hidden="true"
      />
      <span className="mt-2 block text-center font-mono text-xs font-bold text-muted-foreground">
        {pageNumber}
      </span>
    </button>
  );
}

export function PdfViewer({
  source,
  sourceKey,
  title,
  eyebrow,
  breadcrumb,
  actions,
  initialPage,
  buildPageLink,
  onPageChange,
  errorAction,
}: PdfViewerProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(() => clampPage(initialPage, 1));
  const [draft, setDraft] = useState(() => String(clampPage(initialPage, 1)));
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [matches, setMatches] = useState<PdfViewerMatch[]>([]);
  const [matchIndex, setMatchIndex] = useState(-1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [thumbsOpen, setThumbsOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1024,
  );
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pdfjsRef = useRef<PdfApi | null>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const initialPageRef = useRef(initialPage);
  const onPageChangeRef = useRef(onPageChange);

  useEffect(() => {
    initialPageRef.current = initialPage;
    onPageChangeRef.current = onPageChange;
  }, [initialPage, onPageChange]);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    let document: PDFDocumentProxy | null = null;
    let pendingTask: PDFDocumentLoadingTask | null = null;
    let fileUrl: string | null = null;
    setLoading(true);
    setError(null);
    setPdf(null);
    pdfRef.current = null;
    setPageCount(0);
    setMatches([]);
    setMatchIndex(-1);

    const load = async () => {
      try {
        if (typeof window === "undefined") return;
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        pdfjsRef.current = pdfjs;
        const params =
          source.kind === "url"
            ? { url: source.url, withCredentials: false }
            : (() => {
                fileUrl = URL.createObjectURL(source.file);
                return { url: fileUrl };
              })();
        const loadingTask = pdfjs.getDocument(params);
        pendingTask = loadingTask;
        document = await loadingTask.promise;
        pendingTask = null;
        if (cancelled) {
          await document.cleanup().catch(() => {});
          return;
        }
        pdfRef.current = document;
        setPdf(document);
        setPageCount(document.numPages);
        const safe = clampPage(initialPageRef.current, document.numPages);
        setPage(safe);
        setDraft(String(safe));
        setLoading(false);
        if (safe !== initialPageRef.current) {
          onPageChangeRef.current?.(safe);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "This PDF could not be opened.",
          );
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      if (document) {
        void document.cleanup().catch(() => {});
      } else if (pendingTask) {
        void pendingTask.destroy().catch(() => {});
      }
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      pdfRef.current = null;
    };
  }, [source, sourceKey, reloadToken]);

  useEffect(() => {
    setPage(clampPage(initialPage, pageCount || 1));
  }, [initialPage, pageCount]);

  useEffect(() => {
    setDraft(String(page));
  }, [page]);

  useEffect(() => {
    const document = pdfRef.current;
    const needle = debouncedQuery.trim();
    if (!document || needle.length < 2) {
      setMatches([]);
      setMatchIndex(-1);
      return;
    }
    let cancelled = false;
    const search = async () => {
      const found: PdfViewerMatch[] = [];
      const target = needle.toLocaleLowerCase();
      for (
        let pageNumber = 1;
        pageNumber <= document.numPages;
        pageNumber += 1
      ) {
        if (cancelled || found.length >= 300) break;
        const pageProxy = await document.getPage(pageNumber);
        if (cancelled) break;
        const textContent = await pageProxy.getTextContent();
        if (cancelled) break;
        let pageOrder = -1;
        const items = textContent.items as Array<{ str?: unknown }>;
        for (const item of items) {
          if (typeof item !== "object" || item === null || !("str" in item)) {
            continue;
          }
          const text = String((item as { str: unknown }).str ?? "");
          if (!text) continue;
          const lower = text.toLocaleLowerCase();
          let cursor = 0;
          let position = lower.indexOf(target, cursor);
          let itemMatches = 0;
          while (position !== -1 && found.length < 300 && itemMatches < 80) {
            pageOrder += 1;
            itemMatches += 1;
            found.push({
              order: found.length,
              page: pageNumber,
              pageOrder,
              preview: snippet(text, position, needle.length),
            });
            cursor = position + needle.length;
            position = lower.indexOf(target, cursor);
          }
          if (found.length >= 300) break;
        }
      }
      if (!cancelled) {
        setMatches(found);
        setMatchIndex(found.length > 0 ? 0 : -1);
      }
    };
    void search();
    return () => {
      cancelled = true;
    };
  }, [pdf, debouncedQuery]);

  const selectedPageOrder = useMemo(() => {
    const current = matchIndex >= 0 ? matches[matchIndex] : undefined;
    if (!current || current.page !== page) return -1;
    return current.pageOrder;
  }, [matches, matchIndex, page]);

  const highlightKey = `${debouncedQuery}|${matches.length}|${matchIndex}|${selectedPageOrder}`;

  useEffect(() => {
    const document = pdfRef.current;
    const pdfjs = pdfjsRef.current;
    const canvas = canvasRef.current;
    const textLayerDiv = textRef.current;
    if (!document || !pdfjs || !canvas || !textLayerDiv) return;
    let cancelled = false;
    const render = async () => {
      try {
        const pageProxy = await document.getPage(page);
        if (cancelled) return;
        const viewport = pageProxy.getViewport({ scale });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        textLayerDiv.innerHTML = "";
        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.height = `${viewport.height}px`;
        const renderTask = pageProxy.render({
          canvas,
          viewport,
        });
        renderTaskRef.current = renderTask;
        const textContent = await pageProxy.getTextContent();
        if (cancelled) return;
        const textLayer = new pdfjs.TextLayer({
          textContentSource: textContent,
          container: textLayerDiv,
          viewport,
        });
        await textLayer.render();
        if (cancelled) return;
        const needle = debouncedQuery.trim();
        if (needle.length >= 2) {
          applyHighlights(textLayerDiv, needle, selectedPageOrder);
        }
      } catch (err) {
        if (
          !cancelled &&
          err instanceof Error &&
          err.name !== "RenderingCancelledException"
        ) {
          setError(err.message);
        }
      }
    };
    void render();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [pdf, page, scale, highlightKey, debouncedQuery, selectedPageOrder]);

  const goToPage = (next: number) => {
    if (!pageCount) return;
    const safe = clampPage(next, pageCount);
    setPage(safe);
    setDraft(String(safe));
    onPageChangeRef.current?.(safe);
  };

  const goToMatch = (nextIndex: number) => {
    if (!matches.length) return;
    const safe = (nextIndex + matches.length) % matches.length;
    const match = matches[safe];
    if (!match) return;
    setMatchIndex(safe);
    goToPage(match.page);
  };

  const copyPageLink = async () => {
    const link = buildPageLink(page);
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const area = document.createElement("textarea");
      area.value = link;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => setCopied(false), 1600);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <div className="mt-6 grid gap-4 lg:grid-cols-[176px_1fr]">
          <Skeleton className="hidden h-[70vh] lg:block" />
          <Skeleton className="h-[70vh]" />
        </div>
        <Skeleton className="mx-auto mt-6 h-14 w-full max-w-3xl rounded-full" />
      </div>
    );
  }

  if (error || !pdf || pageCount < 1) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <span
          aria-hidden="true"
          className="relative grid h-14 w-14 place-items-center"
        >
          <span className="absolute h-10 w-10 rounded-2xl bg-primary/20" />
          <span className="absolute h-6 w-6 rotate-12 rounded-lg bg-secondary-accent/50" />
        </span>
        <h1 className="font-display mt-6 text-3xl font-extrabold">
          This PDF didn&apos;t open
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Check the connection or file, then try again. Nothing was uploaded or
          remembered.
        </p>
        {error ? (
          <p className="mt-2 max-w-full break-words font-mono text-xs text-muted-foreground">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={() => setReloadToken((value) => value + 1)}>
            Try again
          </Button>
          {errorAction}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-36 pt-6 sm:px-6 md:pb-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-muted-foreground"
          >
            {breadcrumb}
          </nav>
          <p className="mt-3 font-mono text-xs font-bold text-primary">
            {eyebrow}
          </p>
          <h1 className="font-display mt-1 max-w-4xl text-3xl font-extrabold sm:text-4xl">
            {title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            aria-live="polite"
            className="rounded-full border border-border bg-card px-3 py-2 font-mono text-xs font-bold text-muted-foreground"
          >
            Page {page} of {pageCount}
          </span>
          {actions}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row">
        {thumbsOpen ? (
          <aside
            aria-label="Page thumbnails"
            className="hidden max-h-[76vh] w-44 shrink-0 overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-card lg:block"
          >
            <div className="grid gap-2">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <PageThumbnail
                    key={pageNumber}
                    doc={pdf}
                    pageNumber={pageNumber}
                    active={pageNumber === page}
                    onSelect={goToPage}
                  />
                ),
              )}
            </div>
          </aside>
        ) : null}

        <div className="min-w-0 flex-1">
          {searchOpen ? (
            <section
              aria-label="Search in this PDF"
              className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        if (matches.length) {
                          goToMatch(matchIndex >= 0 ? matchIndex + 1 : 0);
                        }
                      }
                      if (event.key === "Escape") {
                        setSearchOpen(false);
                      }
                    }}
                    placeholder="Search in this PDF…"
                    className="h-full w-full bg-transparent text-sm outline-none"
                  />
                </label>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11"
                    onClick={() => goToMatch(matchIndex - 1)}
                    disabled={!matches.length}
                    aria-label="Previous match"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11"
                    onClick={() => goToMatch(matchIndex + 1)}
                    disabled={!matches.length}
                    aria-label="Next match"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close PDF search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p
                aria-live="polite"
                className="mt-3 text-xs font-semibold text-muted-foreground"
              >
                {debouncedQuery.trim().length < 2
                  ? "Type at least two characters."
                  : matches.length
                    ? `${matchIndex + 1} of ${matches.length} matches`
                    : "No matches in this PDF."}
              </p>
              {matches.length ? (
                <ol className="mt-3 grid max-h-56 gap-2 overflow-y-auto pr-1">
                  {matches.slice(0, 80).map((match) => (
                    <li key={match.order}>
                      <button
                        type="button"
                        onClick={() => {
                          setMatchIndex(match.order);
                          goToPage(match.page);
                        }}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                          match.order === matchIndex
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/50"
                        }`}
                        aria-label={`Open match on page ${match.page}`}
                      >
                        <span className="font-mono text-xs font-bold text-primary">
                          PAGE {match.page}
                        </span>
                        <span className="mt-1 block leading-5 text-muted-foreground">
                          {match.preview}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              ) : null}
            </section>
          ) : null}

          <div className="overflow-auto rounded-2xl border border-border bg-card p-3 shadow-card sm:p-5">
            <div className="relative mx-auto w-fit max-w-full">
              <canvas
                ref={canvasRef}
                className="h-auto max-w-full rounded bg-white shadow"
                aria-label={`${title}, page ${page}`}
                role="img"
              />
              <div ref={textRef} className="pdf-text-layer" />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-3 md:static md:z-auto md:mt-6 md:px-0 md:pb-0">
        <div className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-1 rounded-2xl border border-border bg-background/95 p-2 shadow-card backdrop-blur md:w-fit md:rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <input
            value={draft}
            inputMode="numeric"
            aria-label="Page number"
            onChange={(event) =>
              setDraft(event.target.value.replace(/[^0-9]/g, ""))
            }
            onBlur={() => {
              if (draft) goToPage(Number(draft));
              else setDraft(String(page));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && draft) goToPage(Number(draft));
            }}
            className="h-11 w-16 rounded-xl border border-border bg-background text-center font-mono text-sm font-bold outline-none"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => goToPage(page + 1)}
            disabled={page >= pageCount}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <span
            aria-hidden="true"
            className="mx-1 hidden h-6 w-px bg-border sm:block"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => setScale((value) => Math.max(0.6, value - 0.15))}
            disabled={scale <= 0.6}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <button
            type="button"
            onClick={() => setScale(1)}
            aria-label="Reset zoom to 100 percent"
            className="h-11 min-w-16 rounded-xl px-2 font-mono text-xs font-bold text-muted-foreground hover:bg-accent"
          >
            {Math.round(scale * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => setScale((value) => Math.min(3, value + 0.15))}
            disabled={scale >= 3}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <span
            aria-hidden="true"
            className="mx-1 hidden h-6 w-px bg-border sm:block"
          />
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-11 w-11 lg:inline-flex"
            onClick={() => setThumbsOpen((value) => !value)}
            aria-pressed={thumbsOpen}
            aria-label="Toggle thumbnails"
          >
            <Images className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => setSearchOpen((value) => !value)}
            aria-expanded={searchOpen}
            aria-label="Search in this PDF"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant={copied ? "secondary" : "ghost"}
            size="icon"
            className="h-11 w-11"
            onClick={copyPageLink}
            aria-label="Copy link to this page"
            title="Copy link to this page"
          >
            {copied ? (
              <Check className="h-5 w-5 text-primary" />
            ) : (
              <Link2 className="h-5 w-5" />
            )}
          </Button>
          <span className="hidden w-full text-center text-xs font-semibold text-muted-foreground sm:block">
            {copied ? "Copied" : "Copy link to this page"}
          </span>
        </div>
      </div>
    </div>
  );
}
