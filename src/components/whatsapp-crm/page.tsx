import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Plus, ShieldCheck, Play, ArrowRight } from "lucide-react";
import { WA } from "./config";
import { Nav, Footer, DemoModal, Fade, CountUp, Heading, Marquee, Blobs, Pill, Icon, RotatingWord, HeroCollage, MicroAnim, DeepVisual, PhoneSequence, Steps, IntegrationTile, ReviewCard, StarsFill, BrandLogo, BillingToggle, RollingPrice, MetaCharges, yearlySaving, btnPrimary, btnSecondary, card, ext } from "./kit";
import { DemoSection, AIStudioSpotlight, WelcomePopup } from "./demos";

/* ---------------- Page ---------------- */
export function WhatsAppCrmPage() {
  const [demo, setDemo] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [faq, setFaq] = useState<number | null>(0);
  const openDemo = () => setDemo(true);
  const ints = WA.integrations;
  const rows = [ints.slice(0, 8), ints.slice(8, 16), ints.slice(16)];
  const revs = WA.reviews;
  const revRows = [revs.slice(0, 4), revs.slice(4, 8), revs.slice(8)];

  return (
    <div id="top" className="theme-wa min-h-screen overflow-x-clip font-sans">
      <style>{`html{scroll-behavior:smooth}`}</style>
      <Nav onDemo={openDemo} />
      <main>
        {/* Hero */}
        <section className="wa-dots relative overflow-hidden pb-16">
          <Blobs />
          <div className="relative mx-auto max-w-5xl px-4 pt-12 text-center md:px-6 lg:pt-16">
            <Fade><Pill icon="BadgeCheck">{WA.hero.badge}</Pill></Fade>
            <Fade delay={0.08}>
              <h1 className="mt-6 text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[3.6rem]">
                {WA.hero.line1.replace("WhatsApp Conversation.", "")}<span className="text-gradient-wa">WhatsApp Conversation.</span><br className="hidden md:block" />{" "}
                {WA.hero.line2Prefix} <RotatingWord />
              </h1>
            </Fade>
            <Fade delay={0.16}><p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{WA.hero.sub}</p></Fade>
            <Fade delay={0.24} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WA.app.dashboard} {...ext} className={btnPrimary + " px-7 py-3.5 text-base"}>Start Free Demo <ArrowRight className="size-4" /></a>
              <button onClick={openDemo} className={btnSecondary + " px-7 py-3.5 text-base"}>Book a Demo</button>
            </Fade>
            <Fade delay={0.3}><p className="mt-4 text-sm text-muted-foreground">{WA.hero.note}</p></Fade>
            <Fade delay={0.36} className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
              {WA.trust.map((t) => (
                <div key={t.label + t.prefix} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2.5 text-xs font-semibold text-foreground backdrop-blur">
                  <Icon name={t.icon} className="size-4 shrink-0 text-primary" />
                  {t.value ? <span>{t.prefix}<CountUp to={t.value} decimals={"decimals" in t ? t.decimals : 0} suffix={t.suffix} />{t.label && ` ${t.label}`}</span> : <span>{t.label}</span>}
                </div>
              ))}
            </Fade>
          </div>
          <div className="relative px-4"><HeroCollage /></div>
        </section>

        <DemoSection onDemo={openDemo} />

        {/* Logo marquee */}
        <section className="border-y border-border bg-muted py-10" aria-label="Trusted by">
          <p className="mb-6 text-center text-sm font-semibold text-muted-foreground">Trusted by <CountUp to={1500} suffix="+" /> growing brands</p>
          <Marquee speed={35}>{WA.logos.map((l) => <span key={l} className="whitespace-nowrap px-6 text-xl font-extrabold tracking-tight text-muted-foreground/50 grayscale transition-colors hover:text-foreground">{l}</span>)}</Marquee>
        </section>

        {/* Problem / Solution */}
        <section className="py-20 md:py-28">
          <Heading icon="Shuffle" eyebrow="Before → After" title="From scattered chats to one clean inbox" />
          <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 md:px-6">
            <Fade dir="left" className="relative overflow-hidden rounded-3xl border border-border bg-muted p-8">
              <h3 className="text-2xl font-bold text-foreground">Without Vizogen</h3>
              <ul className="mt-6 space-y-3">{WA.pains.map((p, i) => <motion.li key={p} initial={{ rotate: 0 }} whileInView={{ rotate: i % 2 ? 1.5 : -1.5 }} viewport={{ once: true }} className="flex gap-3 rounded-xl border border-dashed border-destructive/40 bg-card px-4 py-3 text-sm text-muted-foreground"><X className="mt-0.5 size-4 shrink-0 text-destructive" />{p}</motion.li>)}</ul>
            </Fade>
            <Fade dir="right" delay={0.1} className="rounded-3xl border border-primary/30 bg-secondary p-8">
              <h3 className="text-2xl font-bold text-foreground">With Vizogen</h3>
              <ul className="mt-6 space-y-3">{WA.fixes.map((p, i) => <Fade key={p} delay={0.2 + i * 0.08}><li className="flex gap-3 rounded-xl bg-card px-4 py-3 text-sm text-foreground shadow-sm"><span className="grid size-5 shrink-0 place-items-center rounded-full gradient-wa"><Check className="size-3 text-primary-foreground" /></span>{p}</li></Fade>)}</ul>
            </Fade>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="wa-dots scroll-mt-20 bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Heading icon="LayoutGrid" eyebrow="Features" title="Everything you need to sell on chat" sub="One platform for conversations, automation, campaigns and AI." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WA.features.map((f, i) => (
                <Fade key={f.title} delay={(i % 4) * 0.08} dir={i % 2 ? "scale" : "up"} className={card + " group p-6"}>
                  <div className="flex items-start justify-between"><div className="grid size-11 place-items-center rounded-xl gradient-wa transition-transform group-hover:rotate-6"><Icon name={f.icon} className="size-5 text-primary-foreground" /></div><MicroAnim kind={f.anim} /></div>
                  <h3 className="mt-5 font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* Deep dives */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl space-y-24 px-4 md:px-6">
            {WA.deepDives.map((d, i) => (
              <div key={d.title} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                <Fade dir={i % 2 ? "right" : "left"} className={i % 2 ? "md:order-2" : ""}><DeepVisual kind={d.kind} /></Fade>
                <Fade dir={i % 2 ? "left" : "right"} delay={0.1}>
                  <Pill icon="Sparkles">{d.eyebrow}</Pill>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground">{d.title}</h2>
                  <ul className="mt-6 space-y-3">{d.bullets.map((b) => <li key={b} className="flex gap-3 text-muted-foreground"><Check className="mt-0.5 size-5 shrink-0 text-primary" />{b}</li>)}</ul>
                </Fade>
              </div>
            ))}
          </div>
        </section>

        <AIStudioSpotlight />

        {/* E-commerce */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
            <Fade dir="left">
              <Pill icon="ShoppingCart">E-commerce</Pill>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">{WA.ecommerce.title}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">{WA.ecommerce.bullets.map((b) => <li key={b} className="flex gap-2 font-medium text-foreground"><Check className="size-5 text-primary" />{b}</li>)}</ul>
              <div className="mt-6 flex items-center gap-3">{["Shopify", "WhatsApp", "Instagram", "Facebook"].map((n) => <BrandLogo key={n} name={n} size="size-11" />)}</div>
              <p className="mt-3 text-sm text-muted-foreground">Works with {WA.ecommerce.partners.join(", ")}.</p>
              <a href={WA.links.shopify} target="_blank" rel="noopener noreferrer" className={btnPrimary + " mt-6"}><img src="/logos/shopify.svg" alt="" className="size-4 rounded-sm bg-background p-0.5" />Connect Shopify</a>
            </Fade>
            <Fade dir="right" delay={0.1}><PhoneSequence /></Fade>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Heading icon="Rocket" eyebrow="How it works" title="Live in three simple steps" />
            <Steps />
          </div>
        </section>

        {/* Industries */}
        <section id="solutions" className="scroll-mt-20 bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Heading icon="Briefcase" eyebrow="Solutions" title="Built for every industry" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WA.industries.map((d, i) => (
                <Fade key={d.title} delay={(i % 3) * 0.08} dir="scale" className={card + " p-6"}>
                  <Icon name={d.icon} className="size-7 text-primary" />
                  <h3 className="mt-4 font-bold text-foreground">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.text}</p>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="scroll-mt-20 py-20 md:py-28">
          <Heading icon="Plug" eyebrow="Seamless Integrations" title="Connects with your favorite tools" sub="Vizogen integrates natively with the tools you already use, ensuring a smooth flow of data across your entire tech stack." />
          <div className="space-y-3 pt-3">
            {rows.map((r, i) => <Marquee key={i} reverse={i === 1} speed={45} offset={i * 7}>{r.map((t) => <IntegrationTile key={t.name} t={t} />)}</Marquee>)}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="scroll-mt-20 bg-secondary py-20 md:py-28">
          <Heading icon="Heart" eyebrow="Wall of Love" title="Loved by growing businesses" />
          <Fade className="mx-auto -mt-4 mb-10 flex w-fit items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
            <StarsFill /><span className="text-sm font-bold text-foreground"><CountUp to={WA.rating.score} decimals={1} />/5 rating • <CountUp to={WA.rating.businesses} suffix="+" /> businesses</span>
          </Fade>
          <div className="space-y-4">{revRows.map((r, i) => <Marquee key={i} reverse={i === 1} speed={55} offset={i * 9}>{r.map((x) => <ReviewCard key={x.name} r={x} />)}</Marquee>)}</div>
          <div className="mx-auto mt-14 grid max-w-6xl gap-5 px-4 md:grid-cols-4 md:px-6">
            {WA.caseStudies.map((c, i) => (
              <Fade key={c.label} delay={i * 0.08} className={card + " p-6"}>
                <p className="text-4xl font-extrabold text-gradient-wa"><CountUp to={c.value} decimals={c.decimals} suffix={c.suffix} /></p>
                <p className="mt-1 font-semibold text-foreground">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.brand}</p>
                <a href="#reviews" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read case study <ArrowRight className="size-3.5" /></a>
              </Fade>
            ))}
            <Fade delay={0.24} className="relative grid min-h-[180px] place-items-center overflow-hidden rounded-[22px] gradient-wa p-6 text-center">
              <button onClick={openDemo} aria-label="Watch video testimonial" className="grid size-14 place-items-center rounded-full bg-background/90 shadow-xl transition-transform hover:scale-110"><Play className="size-6 fill-current text-primary" /></button>
              <p className="mt-3 text-sm font-semibold text-primary-foreground">Watch customer story</p>
            </Fade>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Heading icon="Tag" eyebrow="Pricing" title="Simple, Transparent Pricing" />
            <div className="mb-10"><BillingToggle yearly={yearly} setYearly={setYearly} /></div>
            <div className="grid gap-6 md:grid-cols-3">
              {WA.pricing.plans.map((p, i) => {
                const pop = "popular" in p && p.popular;
                const save = yearlySaving(p);
                const shown = yearly ? Math.round(p.yearly / 12) : p.monthly;
                return (
                  <Fade key={p.name} delay={i * 0.12} className={`relative flex flex-col rounded-3xl border bg-card p-8 transition-all hover:-translate-y-1.5 ${pop ? "border-2 border-primary shadow-wa md:-translate-y-3" : "border-border hover:border-primary/60"}`}>
                    {pop && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-wa px-3 py-1 text-xs font-bold text-primary-foreground">Most Popular</span>}
                    <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                    <p className="mt-6 flex items-baseline gap-1"><RollingPrice value={shown} className="text-4xl font-extrabold text-foreground" /><span className="text-base font-medium text-muted-foreground">/mo</span></p>
                    <p className="mt-1 h-10 text-xs text-muted-foreground">
                      {yearly ? <>billed ₹{p.yearly.toLocaleString("en-IN")} yearly · <span className="font-semibold text-primary">save ₹{save.amount.toLocaleString("en-IN")} ({save.percent}%)</span></> : "billed monthly"}
                    </p>
                    <ul className="mt-4 flex-1 space-y-3 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2 text-foreground"><span className="grid size-5 shrink-0 place-items-center rounded-full gradient-wa"><Check className="size-3 text-primary-foreground" /></span>{f}</li>)}</ul>
                    <a href={WA.app.dashboard} {...ext} className={(pop ? btnPrimary : btnSecondary) + " mt-8"}>Start Free Demo</a>
                  </Fade>
                );
              })}
            </div>
            <p className="mt-8 flex items-start justify-center gap-2 text-center text-sm text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" />{WA.pricing.guarantee}</p>
            <MetaCharges />
            <div className="mt-8 text-center">
              <a href="/compare" className="inline-flex items-center gap-1 font-semibold text-primary">See full plan comparison <ArrowRight className="size-4" /></a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Heading icon="HelpCircle" eyebrow="FAQ" title="Got questions? We've got answers" />
            <div className="space-y-3">
              {WA.faqs.map((f, i) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card">
                  <h3><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-foreground">
                    {f.q}<Plus className={`size-5 shrink-0 text-primary transition-transform duration-300 ${faq === i ? "rotate-45" : ""}`} />
                  </button></h3>
                  <AnimatePresence initial={false}>
                    {faq === i && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden"><p className="px-6 pb-5 text-muted-foreground">{f.a}</p></motion.div>}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 md:px-6">
          <Fade dir="scale" className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl gradient-wa px-6 py-16 text-center md:py-24">
            <div aria-hidden className="wa-blob absolute -left-16 -top-16 size-64 rounded-full bg-background/20 blur-2xl" />
            <div aria-hidden className="wa-blob absolute -bottom-20 -right-10 size-72 rounded-full bg-background/15 blur-2xl [animation-delay:-5s]" />
            {[["left-[8%] top-[18%]", "Order placed ✅"], ["right-[8%] top-[22%]", "Hi! Is this in stock?"], ["left-[14%] bottom-[16%]", "Payment received 💳"]].map(([c, t], i) => (
              <motion.span key={t} aria-hidden className={`absolute hidden rounded-2xl bg-background/90 px-3 py-2 text-xs font-semibold text-foreground shadow-lg md:block ${c}`} animate={{ y: [0, -10, 0] }} transition={{ duration: 4 + i, repeat: Infinity }}>{t}</motion.span>
            ))}
            <h2 className="relative text-3xl font-extrabold tracking-[-0.02em] text-primary-foreground md:text-5xl">Ready to scale your brand with Vizogen?</h2>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WA.app.dashboard} {...ext} className="inline-flex items-center justify-center rounded-xl bg-background px-7 py-3.5 font-semibold text-primary transition-transform hover:-translate-y-0.5">Start Free Demo</a>
              <button onClick={openDemo} className="inline-flex items-center justify-center rounded-xl border border-primary-foreground/60 px-7 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">Talk to Sales</button>
            </div>
          </Fade>
        </section>
      </main>

      <Footer />

      <DemoModal open={demo} onClose={() => setDemo(false)} />
      <WelcomePopup onDemo={openDemo} />
    </div>
  );
}
