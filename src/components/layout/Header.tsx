import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/museum", label: "Museum" },
  { to: "/games", label: "Games" },
  { to: "/historical-records", label: "Historical Records" },
  { to: "/about", label: "About" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold tracking-[0.2em] text-foreground">
            NAVYUVA
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.to && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-base font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === link.to && "text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-6 border-t border-border/50 pt-4">
              <button
                type="button"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Search"
              >
                <Search className="h-5 w-5" /> Search
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" /> Settings
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
