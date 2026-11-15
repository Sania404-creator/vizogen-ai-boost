import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Plus, ShieldCheck, Zap, Ban, PhoneCall, Volume2, Play, BadgeCheck, Star } from "lucide-react";
import { WA } from "./config";
import { DemoModal, Fade, CountUp, Heading, Marquee, Pill, ReviewCard, StarsFill, BrandLogo, btnPrimary, btnSecondary, card, ext } from "./kit";
import { CountdownTimer, hasRealDeadline, DemoPlayer, TemplateCarousel, TryItDemo, VideoBlock, WelcomePopup, ToastProof } from "./demos";
import logo from "@/assets/vizogen-ai-logo.png.asset.json";
import heroWoman from "@/assets/wa-hero-woman.png";

const plan = WA.pricing.plans.find((p) => p.name === WA.offer.plan) ?? WA.pricing.plans[1];
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const youPay = Math.max(0, plan.monthly - WA.offer.discount);

const chips = ["Bulk Broadcasting", "WhatsApp Retargeting", "Official WhatsApp API", "Multi-Human Live Chat", "Facebook/Instagram Ads", "Blue Tick Application", "WhatsApp Payments", "AI Templates", "6 Team Members"];
const vsRows = [
  ["Broadcast reach", "256 contacts per list, saved contacts only", "Unlimited contacts with approved templates"],
  ["Number safety", "Bulk sends get numbers banned", "Official API — no blocking"],
  ["Blue Tick", "Not available", "Blue Tick application support"],
  ["In-chat payments", "Share UPI IDs manually", "UPI, card & net banking inside chat"],
  ["Ads & retargeting", "No ad sync or audiences", "Click-to-WhatsApp ads + retargeting"],
];
const groups = [
  { n: "01", title: "Build the audience", items: ["Official WhatsApp API", "Unlimited contacts upload", "Blue Tick application"], demo: "Broadcast" as const },
  { n: "02", title: "Sell in the chat", items: ["Live dashboard", "Multi-agent live chat", "UPI / card / net-banking in chat", "Shopify, Razorpay & WooCommerce integrations", "API automations"], demo: "Payments" as const },
  { n: "03", title: "Retarget & scale", items: ["Broadcasting & retargeting", "Tags, attributes & segments", "Meta (Facebook/Instagram) ads", "Free onboarding call"], demo: "Analytics" as const },
];
const faqs = [
  { q: "What's included in the offer?", a: `The ${plan.name} plan — ${plan.features.slice(0, 5).join(", ").toLowerCase()} and more — plus a free expert setup call.` },
  { q: "Is the price locked?", a: "Yes. The price you sign up at stays the same for as long as your subscription is active." },
  { q: "How fast can I go live?", a: "Most businesses are live on the Official WhatsApp API in about 30 minutes with our onboarding team." },
  { q: "What about Meta message charges?", a: "Meta charges per template message by category. We bill them at zero markup, separate from your plan." },
  { q: "Do I need a developer?", a: "No. Broadcasts, chatbots, payments and integrations are all no-code. Our team helps with setup for free." },
  { q: "Do you include ad credits?", a: WA.offer.credits.length ? `Yes: ${WA.offer.credits.map((c) => `${c.value} ${c.label}`).join(", ")}.` : "Not with this offer. You can connect your own Facebook/Instagram ad account and run click-to-WhatsApp ads." },
  { q: "Is this a subscription or one-time?", a: "It's a subscription billed monthly or yearly. Cancel anytime from your dashboard." },
];

function Cta({ label = `Start Free Demo · ${inr(plan.monthly)}/mo`, className = "" }: { label?: string; className?: string }) {
  return <a href={WA.app.dashboard} {...ext} className={btnPrimary + " px-7 py-3.5 text-base " + className}>{label}</a>;
}

function Float({ children, className, d = 5, delay = 0 }: { children: React.ReactNode; className: string; d?: number; delay?: number }) {
  return (
    <motion.div className={`absolute ${className}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + delay }}>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: d, repeat: Infinity, ease: "easeInOut" }} className="motion-reduce:!transform-none">{children}</motion.div>
    </motion.div>
  );
}

export function IndiaGrowthPage() {
  const [demo, setDemo] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const timer = hasRealDeadline();
  return (
    <div className="theme-wa min-h-screen overflow-x-clip font-sans">
      {/* 1. Offer bar */}
      <div className="sticky top-0 z-50 gradient-wa text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
          <span>{WA.offer.bar}</span>{timer && <CountdownTimer compact />}
        </div>
      </div>
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6" aria-label="Main">
          <a href="/whatsapp-crm" aria-label="Vizogen.ai home"><img src={logo.url} alt="Vizogen.ai" className="h-8 w-auto" width={132} height={30} /></a>
          <a href={WA.app.dashboard} {...ext} className={btnPrimary + " py-2.5"}>Start Free Demo</a>
        </nav>
      </header>

      <main>
        {/* 2. Hero */}
        <section className="wa-dots relative overflow-hidden py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2">
            <div>
              <Fade><Pill icon="Sparkles">AI-Powered WhatsApp Marketing Platform</Pill></Fade>
              <Fade delay={0.08}><h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-5xl">3X Your Revenue via <span className="text-gradient-wa">Official WhatsApp Marketing</span>, Without Getting Blocked</h1></Fade>
              <Fade delay={0.16} className="mt-6 flex flex-wrap gap-2">{chips.map((c) => <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground"><Check className="size-3.5 text-primary" />{c}</span>)}</Fade>
              <Fade delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><Cta /><span className="text-sm font-semibold text-muted-foreground">⚡ Go live in 30 minutes</span></Fade>
            </div>
            <div className="relative mx-auto h-[520px] w-full max-w-xl">
              <div aria-hidden className="absolute left-1/2 top-10 size-[400px] -translate-x-1/2 rounded-full bg-secondary" />
              <img src={heroWoman} alt="Business owner growing sales on WhatsApp with Vizogen" width={896} height={1152} fetchPriority="high" className="absolute bottom-0 left-1/2 h-[480px] w-auto -translate-x-1/2 object-contain" />
              <Float className="left-0 top-4" d={5}><div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-xl"><p className="text-[11px] font-semibold text-muted-foreground">Revenue this week</p><p className="text-2xl font-extrabold text-foreground"><CountUp to={25} prefix="₹" suffix="L" /></p></div></Float>
              <Float className="right-0 top-10" d={6} delay={0.2}><div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-xl"><p className="text-[11px] font-semibold text-muted-foreground">Broadcast sent</p><p className="text-lg font-extrabold text-foreground"><CountUp to={3572} /> contacts</p><p className="text-xs font-bold text-primary">Clicked +<CountUp to={752} /></p></div></Float>
              <Float className="bottom-28 left-0 hidden sm:block" d={5.5} delay={0.5}><div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-xl"><span className="grid size-7 place-items-center rounded-full gradient-wa"><Check className="size-4 text-primary-foreground" /></span><p className="text-xs text-foreground"><b>Priya · Mumbai</b><br />Paid ₹2,499 via UPI ✓</p></div></Float>
              <Float className="bottom-4 right-0" d={7} delay={0.7}>
                <div className="w-56 rounded-2xl border border-border bg-card p-4 text-xs shadow-xl">
                  <p className="font-bold text-foreground">{plan.name} plan</p>
                  <div className="mt-2 space-y-1 text-muted-foreground">
                    <p className="flex justify-between"><span>Platform price</span><span>{inr(plan.monthly)}</span></p>
                    {WA.offer.credits.map((c) => <p key={c.label} className="flex justify-between"><span>{c.label}</span><span>{c.value}</span></p>)}
                    <p className="flex justify-between"><span>Subtotal</span><span>{inr(plan.monthly)}</span></p>
                    {WA.offer.discount > 0 && <p className="flex justify-between text-primary"><span>Discount</span><span>−{inr(WA.offer.discount)}</span></p>}
                  </div>
                  <p className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-extrabold text-foreground"><span>You pay</span><span>{inr(youPay)}/mo</span></p>
                </div>
              </Float>
              <Float className="right-[30%] top-0" d={4.5} delay={0.3}><BrandLogo name="WhatsApp" size="size-11" /></Float>
            </div>
          </div>
        </section>

        {/* 3. Reassurance */}
        <section className="border-y border-border bg-muted py-10">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3 md:px-6">
            {[[Ban, "Broadcasting with no blocking", "Official API, approved templates, safe numbers."], [PhoneCall, "Setup in 30 minutes", "Free onboarding call with an expert."], [Zap, "Cancel anytime", "No lock-in. Your price stays locked while you stay."]].map(([I, t, d], i) => {
              const Ico = I as typeof Ban;
              return <Fade key={t as string} delay={i * 0.08} className="flex items-start gap-3 rounded-2xl bg-card p-5"><span className="grid size-10 shrink-0 place-items-center rounded-xl gradient-wa"><Ico className="size-5 text-primary-foreground" /></span><div><p className="font-bold text-foreground">{t as string}</p><p className="text-sm text-muted-foreground">{d as string}</p></div></Fade>;
            })}
          </div>
          <div className="mt-8 text-center"><Cta label="Start Free Demo" /></div>
        </section>

        {/* 4. Reviews */}
        <section className="py-20">
          <Heading icon="Heart" eyebrow="Reviews" title="What our customers say" />
          <Fade className="mx-auto -mt-4 mb-10 flex w-fit items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
            <StarsFill /><span className="text-sm font-bold text-foreground"><CountUp to={WA.rating.score} decimals={1} />/5 · <CountUp to={WA.rating.businesses} suffix="+" /> businesses</span>
          </Fade>
          <Marquee speed={60}>{WA.reviews.map((r) => <ReviewCard key={r.name} r={r} />)}</Marquee>
        </section>

        {/* 5. Templates */}
        <section className="bg-secondary py-20">
          <Heading icon="MessageSquare" eyebrow="WhatsApp templates" title="Messages that sell, right inside WhatsApp" />
          <div className="px-4"><TemplateCarousel /></div>
          <div className="mt-10 text-center"><Cta label="Start Free Demo" /></div>
        </section>

        {/* 6. Social proof */}
        <section className="py-16">
          {WA.realClients.length > 0 && <div className="mb-10"><p className="mb-6 text-center text-sm font-semibold text-muted-foreground">Trusted by growing Indian brands</p><Marquee speed={35}>{WA.realClients.map((l) => <span key={l} className="whitespace-nowrap px-6 text-xl font-extrabold text-muted-foreground/60">{l}</span>)}</Marquee></div>}
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-6">
            {WA.trust.filter((t) => t.value).map((t) => <Fade key={t.label + t.prefix} className={card + " p-5 text-center"}><p className="text-3xl font-extrabold text-gradient-wa">{t.prefix}<CountUp to={t.value} decimals={"decimals" in t ? t.decimals : 0} suffix={t.suffix} /></p><p className="mt-1 text-sm text-muted-foreground">{t.label || "to go live"}</p></Fade>)}
          </div>
        </section>

        {/* 7. Vs table */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <Heading icon="Scale" eyebrow="Compare" title="Free WhatsApp App vs Vizogen WhatsApp API" />
            <Fade className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="grid grid-cols-3 bg-muted text-sm font-bold text-foreground"><span className="p-4" /><span className="p-4">Free WhatsApp App</span><span className="bg-secondary p-4 text-primary">Vizogen WhatsApp API</span></div>
              {vsRows.map(([f, a, b]) => <div key={f} className="grid grid-cols-3 border-t border-border text-sm"><span className="p-4 font-semibold text-foreground">{f}</span><span className="flex gap-2 p-4 text-muted-foreground"><X className="mt-0.5 size-4 shrink-0 text-destructive" />{a}</span><span className="flex gap-2 bg-secondary/50 p-4 text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{b}</span></div>)}
            </Fade>
            <Fade className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl gradient-wa p-6 text-primary-foreground sm:flex-row"><p className="text-lg font-bold">Stop risking your number. Switch to the official API.</p><a href={WA.app.dashboard} {...ext} className="rounded-xl bg-background px-6 py-3 font-semibold text-primary">Start Free Demo</a></Fade>
          </div>
        </section>

        {/* 8. Features explained */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl space-y-20 px-4 md:px-6">
            <Heading icon="LayoutGrid" eyebrow="All features explained" title="Everything you need to sell on WhatsApp" />
            {groups.map((g, i) => (
              <div key={g.n} className="grid items-center gap-10 lg:grid-cols-2">
                <Fade dir={i % 2 ? "right" : "left"} className={i % 2 ? "lg:order-2" : ""}>
                  <p className="text-5xl font-extrabold text-gradient-wa">{g.n}</p>
                  <h3 className="mt-2 text-3xl font-extrabold text-foreground">{g.title}</h3>
                  <ul className="mt-5 space-y-3">{g.items.map((it) => <li key={it} className="flex gap-3 text-foreground"><Check className="mt-0.5 size-5 shrink-0 text-primary" />{it}</li>)}</ul>
                  <Cta label="Start Free Demo" className="mt-7" />
                </Fade>
                <Fade dir={i % 2 ? "left" : "right"}><DemoPlayer only={g.demo} /></Fade>
              </div>
            ))}
            <Fade><TryItDemo /></Fade>
          </div>
        </section>

        {/* 9. Shorts */}
        {WA.shorts.length > 0 && (
          <section className="bg-secondary py-20">
            <Heading icon="Video" eyebrow="Customer stories" title="Hear it from our customers" />
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-6">
              {WA.shorts.slice(0, 4).map((s) => (
                <figure key={s.src} className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-foreground">
                  <video src={s.src} poster={s.poster} preload="none" playsInline controls className="size-full object-cover" />
                  <figcaption className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-1.5 bg-gradient-to-b from-foreground/70 to-transparent p-3 text-xs font-semibold text-background"><Volume2 className="size-3.5" />Tap to play with sound</figcaption>
                  <p className="pointer-events-none absolute inset-x-0 bottom-12 px-3 text-xs font-bold text-background">{s.name} · {s.biz}</p>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* 10. Walkthrough */}
        {WA.videoUrl && <section className="mx-auto max-w-5xl px-4 py-20 md:px-6"><Heading icon="PlayCircle" eyebrow="Walkthrough" title="See the whole product in 3 minutes" /><VideoBlock /></section>}

        {/* 11. Offer card */}
        <section id="offer" className="bg-muted py-20">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Heading icon="Gift" eyebrow="Your offer" title="Your subscription" />
            <Fade dir="scale" className="wa-glow rounded-3xl border-2 border-primary bg-card p-6 md:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-sm font-semibold text-muted-foreground">Plan</p><p className="text-2xl font-extrabold text-foreground">{plan.name}</p></div>
                <p className="text-4xl font-extrabold text-foreground">{inr(youPay)}<span className="text-base font-medium text-muted-foreground">/mo</span></p>
              </div>
              {WA.offer.credits.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2">{WA.offer.credits.map((c) => <div key={c.label} className="rounded-2xl bg-secondary p-4"><p className="text-xl font-extrabold text-primary">{c.value}</p><p className="text-sm text-foreground">{c.label}</p></div>)}</div>}
              <p className="mt-6 text-sm font-bold text-foreground">What's included</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">{[...plan.features, "Free expert onboarding call"].map((f) => <li key={f} className="flex gap-2 text-sm text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>)}</ul>
              <div className="mt-6 space-y-1.5 rounded-2xl bg-muted p-4 text-sm">
                <p className="flex justify-between text-muted-foreground"><span>{plan.name} platform</span><span>{inr(plan.monthly)}/mo</span></p>
                <p className="flex justify-between text-muted-foreground"><span>Expert setup</span><span className="text-primary">Free</span></p>
                {WA.offer.discount > 0 && <p className="flex justify-between text-primary"><span>Discount</span><span>−{inr(WA.offer.discount)}</span></p>}
                <p className="flex justify-between border-t border-border pt-2 font-extrabold text-foreground"><span>You pay</span><span>{inr(youPay)}/mo</span></p>
              </div>
              <Cta className="mt-6 w-full" />
              <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" />30-day money back guarantee • Meta charges billed at zero markup</p>
            </Fade>
          </div>
        </section>

        {/* 12. Results */}
        <section className="py-20">
          <Heading icon="TrendingUp" eyebrow="Results" title="What businesses achieve with Vizogen" />
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
            {WA.results.map((r, i) => <Fade key={r.label} delay={i * 0.08} className={card + " p-6"}><p className="text-4xl font-extrabold text-gradient-wa"><CountUp to={r.value} prefix={"prefix" in r ? r.prefix : ""} suffix={r.suffix} /></p><p className="mt-1 font-semibold text-foreground">{r.label}</p><p className="mt-3 text-sm italic text-muted-foreground">“{r.quote}”</p></Fade>)}
          </div>
        </section>

        {/* 13. FAQ */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Heading icon="HelpCircle" eyebrow="FAQ" title="Questions before you start" />
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card">
                  <h3><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-foreground">{f.q}<Plus className={`size-5 shrink-0 text-primary transition-transform ${faq === i ? "rotate-45" : ""}`} /></button></h3>
                  <AnimatePresence initial={false}>{faq === i && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden"><p className="px-6 pb-5 text-muted-foreground">{f.a}</p></motion.div>}</AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. Final CTA */}
        <section className="px-4 py-20 md:px-6">
          <Fade dir="scale" className="mx-auto max-w-5xl rounded-3xl gradient-wa px-6 py-16 text-center text-primary-foreground">
            <h2 className="text-3xl font-extrabold md:text-5xl">Make WhatsApp pay. Starting this week.</h2>
            <p className="mt-4 text-lg font-semibold">{plan.name} plan · {inr(youPay)}/mo</p>
            {timer && <div className="mt-5 flex justify-center"><CountdownTimer /></div>}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WA.app.dashboard} {...ext} className="inline-flex items-center justify-center rounded-xl bg-background px-7 py-3.5 font-semibold text-primary">Start Free Demo</a>
              <button onClick={() => setDemo(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/60 px-7 py-3.5 font-semibold"><Play className="size-4" />Join Live Demo</button>
            </div>
          </Fade>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1.5"><BadgeCheck className="size-4 text-primary" />{WA.footer.copyright}</p>
        <p className="mt-2"><a href="/privacy-policy" className="hover:text-primary">Privacy</a> · <a href="/terms-and-conditions" className="hover:text-primary">Terms</a> · <a href="/compare" className="hover:text-primary">Compare plans</a></p>
      </footer>

      <DemoModal open={demo} onClose={() => setDemo(false)} />
      <WelcomePopup onDemo={() => setDemo(true)} />
      <ToastProof />
    </div>
  );
}
