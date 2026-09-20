import { createFileRoute } from "@tanstack/react-router";
import { FileUp, ShieldCheck, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/pdf-viewer";

const parsePage = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const page =
    typeof raw === "string" || typeof raw === "number" ? Number(raw) : NaN;
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
};

export const Route = createFileRoute("/open")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: parsePage(search["page"]),
  }),
  head: () => ({
    meta: [
      { title: "Open a PDF — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Open a PDF from your device and read it here. Never uploaded.",
      },
      { property: "og:title", content: "Open a PDF — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Read any PDF on this device. Nothing leaves your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpenPdfPage,
});

function OpenPdfPage() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const source = useMemo(
    () => (file ? ({ kind: "file", file } as const) : null),
    [file],
  );

  if (!file || !source) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-14">
        <p className="font-mono text-xs font-bold text-primary">
          FROM YOUR DEVICE
        </p>
        <h1 className="font-display mt-2 text-4xl font-extrabold sm:text-5xl">
          Open a PDF
        </h1>
        <p className="mt-4 flex max-w-2xl items-center gap-2 text-sm leading-6 text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          Opened on your device only. Never uploaded.
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const next = e.dataTransfer.files[0];
            if (next) setFile(next);
          }}
          className={`mt-8 flex min-h-64 w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition-colors sm:p-20 ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <span className="grid h-14 w-14 place-items-center rounded-md bg-primary/10 text-primary">
            <FileUp className="h-6 w-6" />
          </span>
          <span className="font-display text-xl font-bold">
            Drop a PDF here, or click to choose
          </span>
          <span className="text-sm text-muted-foreground">
            The file stays in your browser. Nothing is sent anywhere.
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const next = e.target.files?.[0];
              if (next) setFile(next);
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <PdfViewer
      source={source}
      sourceKey={`${file.name}-${file.size}-${file.lastModified}`}
      title={file.name}
      eyebrow="LOCAL FILE · NEVER UPLOADED"
      breadcrumb={
        <>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="font-semibold hover:text-primary"
          >
            Open a PDF
          </button>{" "}
          <span aria-hidden="true">›</span>{" "}
          <span aria-current="page" className="text-foreground">
            {file.name}
          </span>
        </>
      }
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Open another
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFile(null)}
            aria-label="Close document"
          >
            <X className="h-4 w-4" />
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const next = e.target.files?.[0];
              if (next) setFile(next);
            }}
          />
        </>
      }
      initialPage={page}
      buildPageLink={(next) =>
        new URL(
          `${import.meta.env.BASE_URL}open?page=${next}`,
          window.location.origin,
        ).toString()
      }
      onPageChange={(next) => {
        navigate({
          search: (previous) => ({ ...previous, page: next }),
        });
      }}
      errorAction={
        <Button variant="outline" onClick={() => setFile(null)}>
          Choose another file
        </Button>
      }
    />
  );
}
