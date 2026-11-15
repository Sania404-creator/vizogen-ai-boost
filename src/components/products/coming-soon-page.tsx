import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, ChevronDown, Loader2, Lock } from "lucide-react";
import { Nav, Footer, DemoModal, Fade, Heading, Blobs, Icon, btnPrimary, btnSecondary } from "@/components/whatsapp-crm/kit";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { PRODUCTS, SITE, type ProductConfig } from "./site.config";

const ProductVisual = lazy(() => import("./visuals"));

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const ms = Math.max(0, new Date(date).getTime() - (now ?? Date.now()));
  const parts = [["Days", ms / 864e5], ["Hrs", (ms / 36e5) % 24], ["Mins", (ms / 6e4) % 60], ["Secs", (ms / 1e3) % 60]] as const;
  return (
    <div className="mt-6 flex gap-2">
      {parts.map(([l, v]) => (
        <div key={l} className="w-16 rounded-xl border border-border bg-card py-2 text-center">
          <AnimatePresence mode="popLayout"><motion.p key={now ? Math.floor(v) : l} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} className="text-xl font-extrabold text-foreground">{now ? String(Math.floor(v)).padStart(2, "0") : "--"}</motion.p></AnimatePresence>
          <p className="text-[10px] uppercase text-muted-foreground">{l}</p>
        </div>
      ))}
    </div>
  );
}

function Progress() {
  return (
    <div className="mt-6 max-w-md">
      <div className="flex justify-between text-xs font-semibold"><span className="text-foreground">Building in progress</span><span className="text-muted-foreground">Launching soon</span></div>
      <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full rounded-full gradient-wa" initial={{ width: 0 }} whileInView={{ width: "72%" }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeOut" }} />
        <motion.div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-background/60 to-transparent" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      </div>
    </div>
  );
}

function WaitlistForm({ product }: { product: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d = { name: String(f.get("name") ?? ""), contact: String(f.get("contact") ?? ""), product };
    setBusy(true); setErr("");
    try {
      if (SITE.waitlistWebhookUrl) {
        const r = await fetch(SITE.waitlistWebhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, page: window.location.pathname, at: new Date().toISOString() }) });
        if (!r.ok) throw new Error("We couldn't add you. Please try again.");
      } else await joinWaitlist({ data: d });
      setDone(true);
    } catch (x) { setErr(x instanceof Error ? x.message : "Something went wrong"); } finally { setBusy(false); }
  }
  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 12 }} className="grid size-10 shrink-0 place-items-center rounded-full gradient-wa text-primary-foreground"><Check className="size-5" /></motion.span>
      <p className="text-sm font-semibold text-foreground">{SITE.successMessage}</p>
    </motion.div>
  );
  const inp = "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary";
  return (
    <form id="waitlist" onSubmit={submit} className="mt-8 scroll-mt-28">
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input name="name" required minLength={2} placeholder="Your name" aria-label="Your name" className={inp} />
        <input name="contact" required minLength={5} placeholder="Email or WhatsApp number" aria-label="Email or WhatsApp number" className={inp} />
        <button disabled={busy} className={btnPrimary + " h-12 whitespace-nowrap"}>{busy ? <Loader2 className="size-4 animate-spin" /> : null}Notify Me at Launch</button>
      </div>
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      <Link to="/contact" className={btnSecondary + " mt-3 inline-flex"}>Talk to our team <ArrowRight className="size-4" /></Link>
    </form>
  );
}

export function ComingSoonProductPage({ p }: { p: ProductConfig }) {
  const [demo, setDemo] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [before, after] = p.name.split(p.keyword);
  const others = PRODUCTS.filter((o) => o.slug !== p.slug);
  return (
    <div className="theme-wa min-h-screen overflow-x-clip font-sans">
      <Nav onDemo={() => setDemo(true)} base="/whatsapp-crm" />
      <main>
        <section className="wa-dots relative overflow-hidden py-14 md:py-20">
          <Blobs />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
            <div>
              <Fade><span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-primary" /></span>Coming Soon</span></Fade>
              <Fade delay={0.08}><h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.02em] text-foreground md:text-6xl">Vizogen {before}<span className="text-gradient-wa">{p.keyword}</span>{after}</h1></Fade>
              <Fade delay={0.14}><p className="mt-4 text-xl font-semibold text-foreground">{p.tagline}</p><p className="mt-3 max-w-xl text-muted-foreground">{p.description}</p></Fade>
              <Fade delay={0.2}><WaitlistForm product={p.name} /></Fade>
              {p.launchDate ? <Countdown date={p.launchDate} /> : <Progress />}
            </div>
            <Fade dir="right" className="relative">
              <div className="absolute -inset-6 rounded-[2rem] gradient-wa opacity-20 blur-3xl" />
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-border bg-muted px-4 py-2.5"><span className="size-2.5 rounded-full bg-destructive/70" /><span className="size-2.5 rounded-full bg-wa-lime" /><span className="size-2.5 rounded-full bg-primary" /><span className="ml-3 text-[11px] text-muted-foreground">vizogen.ai/{p.slug}</span></div>
                <div className="p-4"><Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}><ProductVisual slug={p.slug} /></Suspense></div>
                <span className="absolute right-3 top-12 inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur"><Lock className="size-3" />Preview</span>
              </motion.div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute -left-4 -top-5 hidden rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground shadow-lg sm:block"><Icon name={p.icon} className="mr-1 inline size-4 text-primary" />{p.short.split(",")[0]}</motion.div>
            </Fade>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <Heading icon="Sparkles" eyebrow="What's coming" title={`Everything ${p.name} will do`} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f, i) => (
              <Fade key={f.title} delay={i * 0.06}><motion.div whileHover={{ y: -6 }} className="h-full rounded-2xl border border-border bg-card p-6">
                <motion.span whileHover={{ rotate: 8, scale: 1.1 }} className="grid size-12 place-items-center rounded-xl bg-primary/10"><Icon name={f.icon} className="size-6 text-primary" /></motion.span>
                <h3 className="mt-4 font-bold text-foreground">{f.title}</h3><p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </motion.div></Fade>
            ))}
          </div>
        </section>

        <section className="bg-muted py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <Heading icon="Route" eyebrow="How it will work" title="Three simple steps" />
            <div className="relative mt-12 grid gap-8 md:grid-cols-3">
              <motion.div className="absolute left-[16%] right-[16%] top-6 hidden h-0.5 origin-left gradient-wa md:block" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
              {p.steps.map((s, i) => (
                <div key={s.title} className="relative text-center">
                  <motion.span initial={{ scale: 0.6, opacity: 0.3 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.4 }} className="relative mx-auto grid size-12 place-items-center rounded-full gradient-wa text-lg font-extrabold text-primary-foreground">{i + 1}</motion.span>
                  <h3 className="mt-4 font-bold text-foreground">{s.title}</h3><p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 text-center md:px-6">
          <p className="text-sm font-semibold text-muted-foreground">Built for</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {p.builtFor.map((b, i) => <motion.span key={b} animate={{ y: [0, -5, 0] }} transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">{b}</motion.span>)}
          </div>
        </section>

        {SITE.earlyAccessBenefits.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
            <Heading icon="Gift" eyebrow="Early access" title="Why join the waitlist" />
            <div className="mt-10 grid gap-5 md:grid-cols-3">{SITE.earlyAccessBenefits.map((b) => <div key={b.title} className="rounded-2xl border border-border bg-card p-6"><Icon name={b.icon} className="size-6 text-primary" /><h3 className="mt-3 font-bold text-foreground">{b.title}</h3><p className="mt-1 text-sm text-muted-foreground">{b.text}</p></div>)}</div>
          </section>
        )}

        <section className="mx-auto max-w-3xl px-4 py-14 md:px-6">
          <Heading icon="HelpCircle" eyebrow="FAQ" title="Questions about the launch" />
          <div className="mt-8 space-y-3">
            {p.faqs.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card">
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground">{f.q}<ChevronDown className={`size-4 shrink-0 transition-transform ${faq === i ? "rotate-180" : ""}`} /></button>
                <AnimatePresence initial={false}>{faq === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-5 pb-5 text-sm text-muted-foreground">{f.a}</motion.p>}</AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <Heading icon="LayoutGrid" eyebrow="More from Vizogen" title="Explore other products" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <a key={o.slug} href={`/products/${o.slug}`} className="group rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1">
                <motion.span animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="grid size-11 place-items-center rounded-xl bg-primary/10"><Icon name={o.icon} className="size-5 text-primary" /></motion.span>
                <h3 className="mt-4 font-bold text-foreground">{o.name}</h3><p className="mt-1 text-sm text-muted-foreground">{o.short}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">View <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="px-4 pb-20 md:px-6">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl gradient-wa p-10 text-center md:p-14">
            <h2 className="text-3xl font-extrabold text-primary-foreground md:text-4xl">Be first in line for {p.name}</h2>
            <p className="mt-3 text-primary-foreground/85">Join the waitlist and we'll tell you the moment it launches.</p>
            <a href="#waitlist" className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 font-bold text-foreground transition-transform hover:scale-105">Join the waitlist <ArrowRight className="size-4" /></a>
          </div>
        </section>
      </main>
      <Footer base="/whatsapp-crm" />
      <DemoModal open={demo} onClose={() => setDemo(false)} />
    </div>
  );
}
