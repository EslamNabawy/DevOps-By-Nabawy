import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, FileText, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/logo";
import { searchItems } from "@/lib/tracks";

export function AppShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="DevOps By Nabawy home"
          >
            <Logo className="h-10 w-10 shrink-0" />
            <span className="font-display hidden text-base font-extrabold sm:block">
              DevOps By Nabawy
            </span>
          </Link>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button
              variant="outline"
              className="w-64 justify-start text-muted-foreground"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
              Search anything{" "}
              <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                Ctrl K
              </kbd>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/tracks">Tracks</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/roadmap">Roadmap</Link>
            </Button>
          </div>
          <Button
            className="ml-auto md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <div className="grid gap-2 border-t border-border p-4 md:hidden">
            <Button
              variant="outline"
              onClick={() => {
                setSearchOpen(true);
                setMenuOpen(false);
              }}
            >
              <Search />
              Search
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/tracks">Tracks</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/roadmap">Roadmap</Link>
            </Button>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-semibold text-foreground">
              DevOps By Nabawy
            </span>
          </div>
          <p>Study steadily. Build fearlessly.</p>
        </div>
      </footer>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(
    () =>
      searchItems
        .filter((item) =>
          `${item.title} ${item.subtitle}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 8),
    [query],
  );
  useEffect(() => {
    setSelected(0);
  }, [query]);
  const go = (href: string) => {
    onOpenChange(false);
    setQuery("");
    navigate({ to: href });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12%] max-w-2xl translate-y-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search learning library</DialogTitle>
          <DialogDescription>
            Search tracks, modules, commands, and guidebooks.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="text-muted-foreground" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((v) => Math.min(v + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((v) => Math.max(v - 1, 0));
              }
              if (e.key === "Enter" && results[selected])
                go(results[selected].href);
            }}
            placeholder="Search tracks, commands, and guides…"
            className="h-15 flex-1 bg-transparent text-base outline-none"
          />
          <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length ? (
            results.map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                onMouseEnter={() => setSelected(index)}
                onClick={() => go(item.href)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors ${index === selected ? "bg-accent" : "hover:bg-accent"}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-semibold">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </span>
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </button>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No learning resources found.
            </p>
          )}
        </div>
        <div className="border-t border-border bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
          Use ↑↓ to navigate · Enter to open · Esc to close
        </div>
      </DialogContent>
    </Dialog>
  );
}
