import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  FileText,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
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
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [override, setOverride] = useState<boolean | null>(null);
  const showNavigation =
    !location.pathname.startsWith("/books/") && location.pathname !== "/open";

  const dark = override ?? false;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleTheme = () => setOverride((current) => !(current ?? false));

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      {showNavigation && (
        <>
          <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
              <Link
                to="/"
                className="flex min-w-0 items-center gap-3"
                aria-label="DevOps By Nabawy home"
              >
                <Logo className="h-8 w-8 shrink-0" />
                <span className="font-display hidden text-base font-extrabold sm:block">
                  DevOps By Nabawy
                </span>
              </Link>
              <nav
                className="ml-auto hidden items-center gap-2 md:flex"
                aria-label="Primary navigation"
              >
                <Button
                  variant="outline"
                  className="h-10 w-56 justify-start text-muted-foreground"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                  Search
                  <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    Ctrl K
                  </kbd>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/tracks">Tracks</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/open" search={{ page: 1 }}>
                    Open a PDF
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle color theme"
                >
                  {dark ? <Sun /> : <Moon />}
                </Button>
              </nav>
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
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/tracks">Tracks</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/open" search={{ page: 1 }}>
                    Open a PDF
                  </Link>
                </Button>
                <Button variant="ghost" onClick={toggleTheme}>
                  {dark ? <Sun /> : <Moon />}
                  Switch theme
                </Button>
              </div>
            )}
          </header>
          <nav
            className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 px-2 py-2 backdrop-blur-xl md:hidden"
            aria-label="Mobile navigation"
          >
            <MobileNavItem
              to="/tracks"
              label="Tracks"
              icon={FileText}
              active={location.pathname.startsWith("/tracks")}
            />
            <MobileNavItem
              to="/open"
              label="Open a PDF"
              icon={FileText}
              active={location.pathname === "/open"}
            />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle color theme"
            >
              {dark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              Theme
            </button>
          </nav>
        </>
      )}
      <main id="main-content" className={showNavigation ? "pb-24 md:pb-0" : ""}>
        {children}
      </main>
      {showNavigation && (
        <footer className="border-t border-border pb-16 pt-6 md:pb-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-semibold text-foreground">
                DevOps By Nabawy
              </span>
            </div>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
              <Link to="/help" className="hover:text-primary">
                Help
              </Link>
            </div>
          </div>
        </footer>
      )}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

function MobileNavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof FileText;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
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
  const goToSearchPage = () => {
    const q = query.trim();
    onOpenChange(false);
    setQuery("");
    navigate({ to: "/search", search: { q } });
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
                setSelected((value) => Math.min(value + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((value) => Math.max(value - 1, 0));
              }
              if (e.key === "Enter" && results[selected]) {
                go(results[selected].href);
              }
            }}
            placeholder="Search anything..."
            className="h-12 flex-1 bg-transparent text-base outline-none"
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
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  index === selected ? "bg-accent" : "hover:bg-accent"
                }`}
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
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
          <span aria-live="polite">
            {query.trim()
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "Use ↑↓ to navigate · Enter to open · Esc to close"}
          </span>
          {query.trim() ? (
            <button
              type="button"
              onClick={goToSearchPage}
              className="font-semibold text-primary hover:underline"
            >
              See all results
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
