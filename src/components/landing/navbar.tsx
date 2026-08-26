import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { gbpGuideLinks } from "@/components/landing/gbp-guide-menu";
import logoAsset from "@/assets/vizogen-logo.png.asset.json";

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
  const [guideOpen, setGuideOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  const guideActive = gbpGuideLinks.some((g) => g.to === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setGuideOpen(true);
  };
  const closeMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setGuideOpen(false), 140);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/80 shadow-soft backdrop-blur-xl"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/#top" className="flex min-w-0 items-center gap-2">
          <img
            src={logoAsset.url}
            alt="Vizogen"
            className="h-10 w-auto max-w-[180px] object-contain sm:h-11"
          />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={onHome ? l.href : `/${l.href}`}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}

          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
            onFocus={openMenu}
            onBlur={closeMenu}
          >
            <button
              type="button"
              aria-expanded={guideOpen}
              aria-haspopup="true"
              onClick={() => setGuideOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground ${
                guideActive || guideOpen ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              GBP Guide
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  guideOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {guideOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-full z-50 mt-3 w-[350px] rounded-2xl border border-border bg-card p-5 shadow-xl"
                >
                  <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    GMB Mastery Guide
                  </p>

                  <div className="mt-4 space-y-1.5">
                    {gbpGuideLinks.map((g) => (
                      <Link
                        key={g.label}
                        to={g.to}
                        onClick={() => setGuideOpen(false)}
                        className={`group flex items-start gap-3.5 rounded-xl px-2.5 py-3 transition-all hover:bg-amber-500/5 hover:pl-4 ${
                          pathname === g.to ? "bg-amber-500/10" : ""
                        }`}
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg transition-colors group-hover:bg-amber-500/15">
                          <g.icon className="size-[26px] text-amber-500" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[17px] font-semibold leading-tight text-foreground">
                            {g.label}
                          </span>
                          {g.subtitle ? (
                            <span className="mt-1 block text-[13px] font-normal leading-snug text-muted-foreground">
                              {g.subtitle}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <Link
                      to="/blog"
                      onClick={() => setGuideOpen(false)}
                      className="block rounded-xl px-2.5 py-2 text-lg font-bold text-foreground transition-colors hover:bg-accent"
                    >
                      Blog
                    </Link>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            href="tel:+918488918358"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="size-4" />
            +91 84889 18358
          </a>

          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full gradient-brand shadow-soft transition-transform hover:scale-[1.03] hover:opacity-95"
          >
            <Link to="/demo">Start Free Demo →</Link>
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
                href={onHome ? l.href : `/${l.href}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}

            <button
              type="button"
              aria-expanded={mobileGuideOpen}
              onClick={() => setMobileGuideOpen((v) => !v)}
              className="mt-1 flex items-center justify-between rounded-lg px-2 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
            >
              GBP Guide
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  mobileGuideOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {mobileGuideOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-2 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    GMB Mastery Guide
                  </p>
                  {gbpGuideLinks.map((g) => (
                    <Link
                      key={g.label}
                      to={g.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-amber-500/5 ${
                        pathname === g.to ? "bg-amber-500/10" : ""
                      }`}
                    >
                      <g.icon className="mt-0.5 size-[24px] shrink-0 text-amber-500" strokeWidth={1.75} />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold leading-tight text-foreground">
                          {g.label}
                        </span>
                        {g.subtitle ? (
                          <span className="mt-0.5 block text-[13px] text-muted-foreground">
                            {g.subtitle}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  ))}
                  <div className="mt-2 border-t border-border pt-2">
                    <Link
                      to="/blog"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-2 text-base font-bold text-foreground hover:bg-accent"
                    >
                      Blog
                    </Link>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            </Button>
            <Button asChild className="w-full rounded-full gradient-brand">
              <Link to="/demo" onClick={() => setOpen(false)}>
                Start Free Demo →
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
