import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Stats } from "@/components/landing/stats";
import { PostGallery } from "@/components/landing/post-gallery";
import { OldVsNew } from "@/components/landing/old-vs-new";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import {
  sharedStatCards,
  trustBadges,
  whatsappLink,
  type IndustryConfig,
} from "@/components/landing/industry-config";

function CountUp({
  to,
  suffix,
  active,
}: {
  to: number;
  suffix: string;
  active: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1500;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);

  return (
    <span>
      {Math.round(value)}
      {suffix}
    </span>
  );
}

export function IndustryLandingPage({ config }: { config: IndustryConfig }) {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });
  const railFill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  const cta = whatsappLink(config.whatsappMessage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* 1. HERO */}
        <section className="relative overflow-hidden pt-14 sm:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-4xl rounded-full opacity-25 blur-3xl gradient-brand"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 sm:px-6 sm:pb-28 lg:grid-cols-2 lg:gap-8 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
                <Sparkles className="size-3.5" /> Growth Software for {config.industryName}
              </span>
              <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] font-display">
                {config.heroHeadline}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {config.heroSubtext}
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full gradient-brand px-7 shadow-glow transition-transform hover:scale-[1.03] hover:opacity-95 sm:w-auto"
                >
                  <a href={cta} target="_blank" rel="noopener noreferrer">
                    Book Free Demo
                  </a>
                </Button>
                <p className="text-sm font-semibold text-muted-foreground">
                  {config.trustLine}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-lg pb-16 sm:pb-24 lg:pb-20"
            >
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-card p-1.5 shadow-lift">
                <img
                  src={config.heroImage}
                  alt={config.heroImageAlt}
                  width={1200}
                  height={1400}
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-0 w-[68%] overflow-hidden rounded-2xl border border-border/60 bg-card p-1.5 shadow-glow sm:-bottom-4 sm:w-[62%]">
                <img
                  src={config.mockupImage}
                  alt={config.mockupImageAlt}
                  loading="lazy"
                  width={1600}
                  height={1008}
                  className="w-full rounded-xl"
                />
                <div className="absolute bottom-3 left-3 rounded-full gradient-brand px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-glow">
                  +312% profile views
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. REVENUE OPPORTUNITY */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="Revenue Opportunity"
                  title="How Many New Clients Are You Missing?"
                  subtitle={config.revenueParagraph}
                  align="left"
                />
              </div>
              <div ref={statsRef} className="grid gap-5 sm:grid-cols-2">
                {sharedStatCards.map((s, i) => (
                  <Reveal key={s.label} delay={i * 0.1}>
                    <div className="gradient-brand rounded-2xl p-7 text-primary-foreground shadow-glow">
                      <s.icon className="size-6 opacity-80" />
                      <p className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl font-display">
                        <CountUp to={s.value} suffix={s.suffix} active={statsInView} />
                      </p>
                      <p className="mt-2 text-sm font-semibold text-primary-foreground/85">
                        {s.label}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. AI POST GALLERY */}
        <PostGallery
          title="Vizogen AI Generated Post Examples"
          subtitle={`Every ${config.industrySingular.toLowerCase()} post is written, designed and scheduled for your profile — no designer, no agency.`}
          posts={config.galleryPosts}
        />

        {/* 4. STATS BAND */}
        <Stats />

        {/* 5. UNFAIR ADVANTAGE */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Unfair Advantage"
              title={`Why ${config.industryPlural} Dominate With Vizogen`}
              subtitle="Automate the heavy lifting of local SEO so you can focus on your customers."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {config.benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="gradient-border h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <span className="grid size-11 place-items-center rounded-xl gradient-brand text-primary-foreground">
                      <b.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-foreground">{b.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {b.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. GROWTH TIMELINE */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Growth Timeline"
              title="Your Journey To #1 On Google"
              subtitle={`Follow the exact 5-step roadmap Vizogen uses to transform your ${config.industrySingular.toLowerCase()} presence from invisible to unbeatable.`}
            />
            <div ref={railRef} className="relative mt-14 pl-14 sm:pl-20">
              <div
                aria-hidden
                className="absolute left-5 top-2 h-full w-px bg-border sm:left-7"
              />
              <motion.div
                aria-hidden
                style={{ scaleY: railFill }}
                className="absolute left-5 top-2 h-full w-px origin-top gradient-brand sm:left-7"
              />
              <ol className="space-y-8">
                {config.timelineSteps.map((step, i) => (
                  <li key={step.title}>
                    <Reveal delay={0.05}>
                      <div className="relative rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                        <span className="absolute -left-14 top-6 grid size-10 place-items-center rounded-full gradient-brand text-sm font-bold text-primary-foreground shadow-glow sm:-left-[4.75rem]">
                          {i + 1}
                        </span>
                        <h3 className="text-base font-bold text-foreground sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 7. OLD WAY VS NEW WAY */}
        <OldVsNew
          title={`Stop Running Your ${config.industrySingular} The Old Way`}
          oldWay={config.oldWay}
          newWay={config.newWay}
        />

        {/* 8. FAQ */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Support & Help"
              title="Frequently Asked Questions"
              subtitle={`Everything you need to know about growing your ${config.industrySingular.toLowerCase()} with Vizogen.`}
            />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="w-full">
                {config.faqs.map((f, i) => (
                  <AccordionItem
                    key={f.question}
                    value={`faq-${i}`}
                    className="border-border/70"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* 9. FINAL CTA */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl gradient-brand px-6 py-14 text-center shadow-glow sm:px-12 sm:py-20">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-display">
                  Ready to automate your {config.industrySingular.toLowerCase()} growth?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/85">
                  Join hundreds of successful businesses who use Vizogen.
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="mt-8 rounded-full px-8 text-base font-semibold shadow-lift transition-transform hover:scale-[1.03]"
                >
                  <a href={cta} target="_blank" rel="noopener noreferrer">
                    Get Started For Free <ArrowRight className="size-4" />
                  </a>
                </Button>
                <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-primary-foreground/80">
                  {trustBadges.map((b) => (
                    <li key={b} className="flex items-center gap-1.5">
                      <Check className="size-3.5" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
