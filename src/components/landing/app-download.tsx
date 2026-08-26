import { motion } from "motion/react";
import { Apple, Coins, Play, Star } from "lucide-react";
import { Reveal } from "./reveal";
import phone from "@/assets/phone-app.jpg";

export function AppDownload() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-navy py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 size-[460px] rounded-full opacity-25 blur-3xl gradient-brand"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/15 bg-navy-foreground/5 px-3.5 py-1.5 text-xs font-semibold text-navy-foreground">
            <Coins className="size-3.5" /> Join now, get 500 coins
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight text-navy-foreground sm:text-4xl md:text-[2.75rem]">
            AI-Powered Post Creation
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-foreground/70">
            Download the app for instant post creation. Type your business name, add a few
            keywords, and publish a designed GBP post in seconds — from anywhere.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#"
              className="flex items-center gap-3 rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 px-5 py-3 text-navy-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-navy-foreground/10"
            >
              <Play className="size-5" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] uppercase tracking-widest opacity-70">
                  Get it on
                </span>
                <span className="block text-sm font-semibold">Google Play</span>
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 px-5 py-3 text-navy-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-navy-foreground/10"
            >
              <Apple className="size-5" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] uppercase tracking-widest opacity-70">
                  Download on the
                </span>
                <span className="block text-sm font-semibold">App Store</span>
              </span>
            </a>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -4 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xs"
        >
          <div className="overflow-hidden rounded-[2.25rem] border border-navy-foreground/10 bg-card shadow-glow">
            <img
              src={phone}
              alt="Vizogen mobile app Generate Post screen"
              loading="lazy"
              width={912}
              height={1600}
              className="w-full"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rotate-4 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-lift">
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
