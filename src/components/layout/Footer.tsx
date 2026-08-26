import { Link } from "@tanstack/react-router";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/museum", label: "Museum" },
  { to: "/games", label: "Games" },
  { to: "/historical-records", label: "Historical Records" },
  { to: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold tracking-[0.15em] text-foreground">
              NAVYUVA
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover the Past. Play the Story.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 border-t border-border/50 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NAVYUVA. Built for SIH Problem
            Statement 26208 — Heritage & Culture.
          </p>
        </div>
      </div>
    </footer>
  );
}
