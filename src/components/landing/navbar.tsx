import { useEffect, useState } from "react";
import { Menu, Phone, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/80 shadow-soft backdrop-blur-xl"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-soft">
            <Sparkles className="size-4" />
          </span>
          <span className="truncate text-lg font-bold tracking-tight text-foreground font-display">
            Vizogen
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            href="tel:+919000000000"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="size-4" />
            +91 90000 00000
          </a>
          <Button variant="outline" size="lg" className="rounded-full">
            Start Now
          </Button>
          <Button size="lg" className="rounded-full gradient-brand shadow-soft transition-transform hover:scale-[1.03] hover:opacity-95">
            Free Demo →
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground xl:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background px-4 pb-5 pt-3 xl:hidden">
          <div className="flex flex-col lg:hidden">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="outline" className="w-full rounded-full">
              Start Now
            </Button>
            <Button className="w-full rounded-full gradient-brand">Free Demo →</Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
