import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Keyboard, Link2, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "What DevOps By Nabawy is, and how links remember where you were.",
      },
      { property: "og:title", content: "About — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "A free DevOps library where the link is the memory.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <p className="font-mono text-xs font-bold text-primary">ABOUT</p>
      <h1 className="font-display mt-3 text-2xl font-extrabold sm:text-3xl">
        A library with no memory
      </h1>
      <div className="mt-5 grid gap-3 text-base leading-7 text-muted-foreground">
        <p>
          DevOps By Nabawy is a free collection of DevOps guidebooks, cheat
          sheets, and companion courses. There are no accounts, no sign-ins, and
          nothing that records what you opened.
        </p>
        <p>
          Instead, the link itself remembers. Every track, every PDF page, and
          every search has its own address — copy it, share it, bookmark it, and
          it opens exactly where you left it, on any device.
        </p>
        <p>
          Files you open from your own device never leave your browser. The
          light or dark theme follows your device setting unless you switch it
          for the current visit.
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="font-display mt-3 font-bold">Shareable pages</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Page numbers live in the address bar.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="font-display mt-3 font-bold">Fast search</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Find any track, book, or section instantly.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Moon className="h-5 w-5 text-primary" />
          <h2 className="font-display mt-3 font-bold">Night friendly</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Light and dark themes for late study sessions.
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-card">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold">
          <Keyboard className="h-5 w-5 text-primary" /> Keyboard shortcuts
        </h2>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground">
          <li>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              Ctrl K
            </kbd>{" "}
            or{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              ⌘ K
            </kbd>{" "}
            — open search anywhere
          </li>
          <li>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              ↑↓
            </kbd>{" "}
            navigate results ·{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              ↵
            </kbd>{" "}
            open ·{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              Esc
            </kbd>{" "}
            close
          </li>
        </ul>
      </div>
      <Button className="mt-6" asChild>
        <Link to="/tracks">
          Browse tracks <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
