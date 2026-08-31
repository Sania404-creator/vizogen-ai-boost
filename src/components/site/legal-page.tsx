import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
  emphasis?: boolean;
};

type Props = {
  label?: string;
  heading: string;
  effectiveDate: string;
  sections: LegalSection[];
  closing: string;
  footerNote: string;
};

export function LegalPage({
  label = "Legal",
  heading,
  effectiveDate,
  sections,
  closing,
  footerNote,
}: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [jumpOpen, setJumpOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <header className="border-b border-border bg-card/60">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand">{label}</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Effective Date: {effectiveDate}</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
          {/* Desktop TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 no-scrollbar">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                On this page
              </p>
              <ul className="mt-4 space-y-1.5 border-l border-border">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px block border-l-2 py-1 pl-3 text-sm leading-snug transition-colors ${
                        active === s.id
                          ? "border-brand font-semibold text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0">
            {/* Mobile jump-to */}
            <div className="mb-8 lg:hidden">
              <button
                type="button"
                onClick={() => setJumpOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-soft"
              >
                Jump to section
                <ChevronDown
                  className={`size-4 transition-transform ${jumpOpen ? "rotate-180" : ""}`}
                />
              </button>
              {jumpOpen ? (
                <ul className="mt-2 space-y-1 rounded-2xl border border-border bg-card p-2 shadow-soft">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={() => setJumpOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <article className="mx-auto max-w-[730px]">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 pt-10 first:pt-0">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {s.title}
                  </h2>
                  <div
                    className={
                      s.emphasis
                        ? "mt-4 space-y-4 rounded-2xl border border-amber-300/70 bg-amber-50/70 p-5 text-[15px] leading-[1.85] text-foreground/90 dark:border-amber-400/30 dark:bg-amber-400/5"
                        : "mt-4 space-y-4 text-[15px] leading-[1.85] text-muted-foreground"
                    }
                  >
                    {s.body}
                  </div>
                </section>
              ))}

              <div className="mt-14 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <p className="text-[15px] font-semibold leading-relaxed text-foreground">{closing}</p>
                <p className="mt-3 text-xs text-muted-foreground">{footerNote}</p>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc marker:text-brand">
          {item}
        </li>
      ))}
    </ul>
  );
}
