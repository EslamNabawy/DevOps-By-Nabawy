import { createFileRoute } from "@tanstack/react-router";
import { FileUp, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/open")({
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
  const [url, setUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );

  const openFile = (file: File | undefined) => {
    if (!file) return;
    if (url) URL.revokeObjectURL(url);
    setUrl(URL.createObjectURL(file));
    setName(file.name);
  };

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

      {!url ? (
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
            openFile(e.dataTransfer.files[0]);
          }}
          className={`mt-8 flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition-colors sm:p-20 ${
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
            onChange={(e) => openFile(e.target.files?.[0])}
          />
        </button>
      ) : (
        <div className="mt-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">
              {name}
            </p>
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
              onClick={() => {
                if (url) URL.revokeObjectURL(url);
                setUrl(null);
                setName("");
              }}
              aria-label="Close document"
            >
              <X className="h-4 w-4" />
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => openFile(e.target.files?.[0])}
            />
          </div>
          <div className="overflow-hidden border border-border bg-card shadow-card">
            <iframe
              title={name}
              src={url}
              className="h-[75dvh] w-full bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
