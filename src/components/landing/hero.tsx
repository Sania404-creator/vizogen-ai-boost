import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CalendarDays, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openFreeDemo } from "@/lib/site-contact";
import dashboard from "@/assets/dashboard.jpg";

const HEADLINE_PREFIX = "Automate Your Google Business Profile and";

const ROTATING_WORDS = [
  "Rank Higher on Google Maps",
  "Win More Local Customers",
  "Get More 5-Star Reviews",
  "Save 20+ Hours Every Month",
  "Grow Without Hiring an Agency",
];

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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

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
          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {HEADLINE_PREFIX}{" "}
            <span className="inline-block align-top">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={ROTATING_WORDS[index]}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-gradient"
                >
                  {ROTATING_WORDS[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Automate your Google Business Profile. Get daily AI posts, authentic 5-star
            reviews, and instant review replies to dominate local search.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full gradient-brand px-7 shadow-glow transition-transform hover:scale-[1.03] hover:opacity-95 sm:w-auto"
            >
              <a href="https://vizogen.in">Start Free Trial</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={openFreeDemo}
              className="w-full rounded-full px-6 text-foreground sm:w-auto"
            >
              <CalendarDays className="size-4" /> Book a Demo
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
