import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "How to read tracks, search, open local PDFs, and download bundles.",
      },
      { property: "og:title", content: "Help — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Short answers for reading, searching, and downloading.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});

const ITEMS = [
  {
    q: "How do I start a track?",
    a: "Open the track, read its intro, then press Start reading. The map on the left jumps to each PDF card.",
  },
  {
    q: "How do I share an exact page?",
    a: "In the PDF viewer, press Copy link to this page. The page number is part of the link.",
  },
  {
    q: "Can I read my own PDF files?",
    a: "Yes. Open a PDF lets you drop any file from your device into the same viewer. It is never uploaded anywhere.",
  },
  {
    q: "How do I download a whole track?",
    a: "Use Download all PDFs at the bottom of a track page. Your browser bundles the files into one zip.",
  },
  {
    q: "A companion course won't preview. What now?",
    a: "Some course sites block embedding. Use Try again once, then Open in new tab — the full course always opens that way.",
  },
  {
    q: "Does the site remember what I read?",
    a: "No. Every visit looks the same for everyone. Your links and bookmarks are the only memory.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <p className="font-mono text-xs font-bold text-primary">HELP</p>
      <h1 className="font-display mt-3 text-3xl font-extrabold sm:text-4xl">
        Short answers
      </h1>
      <div className="mt-6 grid gap-3">
        {ITEMS.map((item) => (
          <details
            key={item.q}
            className="rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <summary className="font-display cursor-pointer font-bold">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
      <Button className="mt-6" asChild>
        <Link to="/tracks">
          Browse tracks <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
