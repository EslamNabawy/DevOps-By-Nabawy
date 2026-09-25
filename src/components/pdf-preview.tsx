import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, ExternalLink } from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type PdfPreviewSource =
  | { kind: "url"; url: string }
  | { kind: "file"; file: File };

type PdfPreviewProps = {
  source: PdfPreviewSource;
  sourceKey: string;
  title: string;
  eyebrow: string;
  breadcrumb: ReactNode;
  actions?: ReactNode;
  downloadUrl?: string;
  downloadName?: string;
  fallbackUrl?: string;
  errorAction?: ReactNode;
};

export function PdfPreview({
  source,
  sourceKey,
  title,
  eyebrow,
  breadcrumb,
  actions,
  downloadUrl,
  downloadName,
  fallbackUrl,
  errorAction,
}: PdfPreviewProps) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [painted, setPainted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    let cancelled = false;
    let fileUrl: string | null = null;
    let document: PDFDocumentProxy | null = null;
    setLoading(true);
    setError(null);
    setDoc(null);
    docRef.current = null;
    setPageCount(null);
    setPainted(false);

    const load = async () => {
      try {
        if (typeof window === "undefined") return;
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const url =
          source.kind === "url"
            ? source.url
            : (fileUrl = URL.createObjectURL(source.file));
        const candidates =
          source.kind === "url" && fallbackUrl ? [url, fallbackUrl] : [url];
        let lastError: unknown = null;
        for (const candidate of candidates) {
          try {
            document = await pdfjs.getDocument({
              url: candidate,
              withCredentials: false,
            }).promise;
            lastError = null;
            break;
          } catch (err) {
            lastError = err;
            document = null;
          }
        }
        if (!document) {
          throw lastError instanceof Error
            ? lastError
            : new Error("This PDF could not be opened.");
        }
        if (cancelled) {
          await document.cleanup().catch(() => {});
          return;
        }
        docRef.current = document;
        setDoc(document);
        setPageCount(document.numPages);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "This PDF could not be opened.",
          );
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
      if (document) {
        void document.cleanup().catch(() => {});
      }
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [source, sourceKey, fallbackUrl, reloadToken]);

  // Paint runs only after the canvas is mounted (loading finished).
  useEffect(() => {
    const document = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !document || !canvas) return;
    let cancelled = false;
    const paint = async () => {
      try {
        const page = await document.getPage(1);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.removeAttribute("style");
        await page.render({ canvas, viewport }).promise;
        if (!cancelled) setPainted(true);
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
    void paint();
    return () => {
      cancelled = true;
    };
  }, [doc]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <p
          aria-live="polite"
          className="mt-4 text-sm font-semibold text-muted-foreground"
        >
          Loading preview…
        </p>
        <Skeleton className="mt-6 h-[60vh]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="font-display mt-6 text-3xl font-extrabold">
          This preview didn&apos;t open
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Check the connection or file, then try again. Nothing was uploaded or
          remembered.
        </p>
        <p className="mt-2 max-w-full break-words font-mono text-xs text-muted-foreground">
          {error}
        </p>
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
    <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-4 sm:px-6 sm:pt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-muted-foreground sm:text-sm"
          >
            {breadcrumb}
          </nav>
          <p className="mt-1.5 font-mono text-[11px] font-bold text-primary sm:mt-2 sm:text-xs">
            {eyebrow}
          </p>
          <h1 className="font-display mt-1 max-w-4xl break-words text-lg font-extrabold leading-tight sm:text-2xl">
            {title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {pageCount !== null ? (
            <span className="rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs font-bold text-muted-foreground sm:py-2">
              {pageCount} pages
            </span>
          ) : null}
          {actions}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-card sm:p-5">
        <canvas
          ref={canvasRef}
          className="mx-auto h-auto w-full rounded bg-white shadow"
          role="img"
          aria-label={`First-page preview of ${title}`}
        />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          First-page preview
        </p>
      </div>

      {downloadUrl ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button className="w-full whitespace-nowrap sm:w-auto" asChild>
            <a
              href={downloadUrl}
              download={downloadName}
              aria-label={`Download PDF: ${title}`}
            >
              <Download className="mr-2 h-4 w-4 shrink-0" /> Download PDF
            </a>
          </Button>
          <Button
            variant="outline"
            className="w-full whitespace-nowrap sm:w-auto"
            asChild
          >
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open full PDF: ${title}`}
            >
              <ExternalLink className="mr-2 h-4 w-4 shrink-0" /> Open full PDF
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
