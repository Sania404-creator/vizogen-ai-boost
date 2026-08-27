import { motion } from "motion/react";
import { CalendarDays, Globe, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import { openFreeDemo } from "@/lib/site-contact";
import logoAsset from "@/assets/vizogen-logo.png.asset.json";
import dashboard from "@/assets/seo-dashboard.jpg";

export function AppDownload() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 size-[460px] rounded-full opacity-25 blur-3xl gradient-brand"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/15 bg-navy-foreground/5 px-3.5 py-1.5 text-xs font-semibold text-navy-foreground">
            <Globe className="size-3.5" /> 100% web-based — nothing to install
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight text-navy-foreground sm:text-4xl md:text-[2.75rem]">
            AI-Powered Post Creation
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-foreground/70">
            Sign in from any browser, type your business name, add a few keywords, and publish a
            designed Google Business Profile post in seconds — desktop, tablet or mobile.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="rounded-full gradient-brand px-7 shadow-glow transition-transform hover:scale-[1.03] hover:opacity-95"
            >
              <Link to="/demo">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={openFreeDemo}
              className="rounded-full border-navy-foreground/20 bg-navy-foreground/5 px-6 text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            >
              <CalendarDays className="size-4" /> Book a Demo
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Vizogen"
              loading="lazy"
              className="h-11 w-auto rounded-lg bg-white/95 px-2 py-1 object-contain shadow-soft"
            />
            <p className="text-xs leading-relaxed text-navy-foreground/60">
              Works in your browser at vizogen.in — no app, no downloads.
            </p>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="overflow-hidden rounded-3xl border border-navy-foreground/10 bg-card shadow-glow">
            <img
              src={dashboard}
              alt="Vizogen web dashboard generating a Google Business Profile post"
              loading="lazy"
              className="w-full"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-lift">
            <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Star className="size-4 fill-current text-primary" /> 4.3★
            </p>
            <p className="text-xs text-muted-foreground">from 3,000+ reviews</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
