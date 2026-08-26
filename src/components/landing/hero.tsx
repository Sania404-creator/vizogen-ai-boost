import { motion } from "motion/react";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboard from "@/assets/dashboard.jpg";

const clients = [
  "FitPeak Gym",
  "Sunrise Clinic",
  "Butter & Crumb",
  "Glow Salon",
  "Spice Route",
  "PestGuard",
  "AutoWorks",
  "Wander Travels",
  "Zen Yoga",
  "FixIt Handyman",
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-14 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-4xl rounded-full opacity-25 blur-3xl gradient-brand"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
            <Star className="size-3.5" /> AI automation for Google Business Profiles
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Grow Your Business on Google —<br className="hidden sm:block" />{" "}
            <span className="text-gradient">Manage Your GBP with Vizogen AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Automate your Google Business Profile. Get daily AI posts, authentic 5-star
            reviews, and instant review replies to dominate local search.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full rounded-full gradient-brand px-7 shadow-glow transition-transform hover:scale-[1.03] hover:opacity-95 sm:w-auto"
            >
              Start Today — Get 500 Coins
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full rounded-full px-6 text-foreground sm:w-auto"
            >
              <Play className="size-4" /> Watch Demo →
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 max-w-6xl"
        >
          <div className="gradient-border overflow-hidden rounded-3xl border border-border/60 bg-card p-1.5 shadow-glow sm:p-2.5">
            <img
              src={dashboard}
              alt="Vizogen dashboard showing Google Business Profile views, reviews and insights"
              width={1600}
              height={1008}
              className="w-full rounded-2xl"
            />
          </div>
        </motion.div>

        <div className="mt-14 pb-16 sm:pb-24">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by 2,000+ local businesses
          </p>
          <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-10">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="whitespace-nowrap text-lg font-semibold text-muted-foreground/50 grayscale transition-colors hover:text-foreground/70 font-display"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
