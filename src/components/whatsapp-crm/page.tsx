import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { Check, ChevronDown, Menu, Star, X, Send, Paperclip, Search } from "lucide-react";
import { toast } from "sonner";
import { WA } from "./config";
import logo from "@/assets/vizogen-ai-logo.png.asset.json";
import mark from "@/assets/vizogen-ai-v-logo.png.asset.json";
import { createDemoLead } from "@/lib/bookings.functions";
import { setOverlayOpen } from "@/lib/site-contact";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <C className={className} aria-hidden />;
}

function Fade({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl gradient-wa px-5 py-3 text-sm font-semibold text-primary-foreground shadow-wa transition-transform hover:-translate-y-0.5";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary";

function Heading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <Fade className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </Fade>
  );
}

/* ---------------- Navbar ---------------- */
function Nav({ onDemo }: { onDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "border-b border-border bg-background/80 backdrop-blur-lg" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6" aria-label="Main">
        <a href="#top" aria-label="Vizogen.ai home"><img src={logo.url} alt="Vizogen.ai" className="h-8 w-auto" width={132} height={30} /></a>
        <ul className="hidden items-center gap-8 lg:flex">
          {WA.nav.map((n) => (
            <li key={n.href}><a href={n.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">{n.label}</a></li>
          ))}
        </ul>
        <div className="hidden items-center gap-4 lg:flex">
          <a href={WA.loginUrl} className="text-sm font-semibold text-foreground hover:text-primary">Login</a>
          <a href={WA.signupUrl} className={btnPrimary + " py-2.5"}>Get Started Free</a>
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-border bg-background px-4 pb-6 lg:hidden">
          <ul className="flex flex-col py-2">
            {WA.nav.map((n) => (
              <li key={n.href}><a href={n.href} onClick={() => setOpen(false)} className="block py-3 font-medium text-foreground">{n.label}</a></li>
            ))}
          </ul>
          <div className="grid gap-3">
            <a href={WA.loginUrl} className={btnSecondary}>Login</a>
            <a href={WA.signupUrl} className={btnPrimary}>Get Started Free</a>
            <button onClick={() => { setOpen(false); onDemo(); }} className={btnSecondary}>Book a Demo</button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero mockup ---------------- */
function InboxMock() {
  const chats = [
    { n: "Riya Kapoor", m: "Is the blue kurta in stock?", c: "WhatsApp", active: true },
    { n: "Aman Verma", m: "Price for 2 units?", c: "Instagram" },
    { n: "Sneha Patel", m: "Thanks! Order received", c: "Messenger" },
    { n: "Karan Joshi", m: "Can I book a demo?", c: "WhatsApp" },
  ];
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/60" /><span className="size-2.5 rounded-full bg-wa-lime" /><span className="size-2.5 rounded-full bg-primary" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">Vizogen Inbox</span>
        </div>
        <div className="grid grid-cols-12 text-left">
          <div className="col-span-5 border-r border-border md:col-span-4">
            <div className="m-3 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-2 text-xs text-muted-foreground"><Search className="size-3.5" />Search</div>
            {chats.map((c) => (
              <div key={c.n} className={`border-l-2 px-3 py-2.5 ${c.active ? "border-primary bg-secondary" : "border-transparent"}`}>
                <div className="flex items-center justify-between"><p className="truncate text-xs font-semibold text-foreground">{c.n}</p><span className="text-[10px] text-primary">{c.c}</span></div>
                <p className="truncate text-[11px] text-muted-foreground">{c.m}</p>
              </div>
            ))}
          </div>
          <div className="col-span-7 flex flex-col md:col-span-5">
            <div className="border-b border-border px-4 py-2.5 text-xs font-semibold text-foreground">Riya Kapoor</div>
            <div className="flex flex-1 flex-col gap-2 bg-muted/60 p-3 text-[11px]">
              <p className="max-w-[85%] rounded-xl rounded-tl-sm bg-card px-3 py-2 text-foreground shadow-sm">Is the blue kurta in stock in size M?</p>
              <p className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-accent px-3 py-2 text-accent-foreground">Yes! Size M is available at ₹1,299. Want me to add it to your cart? 🛍️</p>
              <p className="max-w-[85%] rounded-xl rounded-tl-sm bg-card px-3 py-2 text-foreground shadow-sm">Yes please</p>
            </div>
            <div className="flex items-center gap-2 border-t border-border p-2.5 text-[11px] text-muted-foreground"><Paperclip className="size-3.5" /><span className="flex-1">Type a reply…</span><Send className="size-3.5 text-primary" /></div>
          </div>
          <div className="hidden border-l border-border p-4 text-[11px] md:col-span-3 md:block">
            <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full gradient-wa text-xs font-bold text-primary-foreground">RK</div>
            <p className="text-center font-semibold text-foreground">Riya Kapoor</p>
            <p className="mb-3 text-center text-muted-foreground">+91 98xxx xx210</p>
            <div className="flex flex-wrap gap-1"><span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">VIP</span><span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">Repeat buyer</span></div>
            <p className="mt-3 text-muted-foreground">Orders: 6<br />Lifetime: ₹8,940</p>
          </div>
        </div>
      </div>
      {[
        { t: "New order confirmed ✅", cls: "-left-4 top-10 md:-left-10" },
        { t: "Cart recovered ₹2,499", cls: "-right-3 top-1/2 md:-right-8" },
        { t: "Bot replied in 2s ⚡", cls: "bottom-6 left-6 md:-bottom-5" },
      ].map((f, i) => (
        <motion.div key={f.t} className={`absolute ${f.cls} rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground shadow-xl`}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}>
          {f.t}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- Deep-dive visuals ---------------- */
function DeepVisual({ kind }: { kind: string }) {
  if (kind === "flow")
    return (
      <div className="rounded-3xl border border-border bg-muted p-6">
        <div className="mx-auto flex max-w-xs flex-col items-center gap-3 text-xs">
          <div className="w-full rounded-xl gradient-wa px-4 py-3 text-center font-semibold text-primary-foreground">Trigger: “Hi”</div>
          <div className="h-5 w-px bg-border" />
          <div className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm">Welcome! What can we help with?<div className="mt-2 flex gap-1.5"><span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">Shop</span><span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">Track order</span><span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">Agent</span></div></div>
          <div className="grid w-full grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-border bg-card px-3 py-3 text-foreground shadow-sm">💳 Send payment link</div>
            <div className="rounded-xl border border-border bg-card px-3 py-3 text-foreground shadow-sm">👤 Hand off to human</div>
          </div>
        </div>
      </div>
    );
  if (kind === "campaign")
    return (
      <div className="rounded-3xl border border-border bg-muted p-6 text-sm">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="font-semibold text-foreground">Diwali Sale Broadcast</p>
          <div className="mt-4 grid gap-3 text-xs">
            <div className="flex justify-between rounded-lg bg-muted px-3 py-2"><span className="text-muted-foreground">Audience</span><span className="font-semibold text-foreground">Repeat buyers · 4,280</span></div>
            <div className="flex justify-between rounded-lg bg-muted px-3 py-2"><span className="text-muted-foreground">Template</span><span className="font-semibold text-foreground">festive_offer_v2</span></div>
            <div className="flex justify-between rounded-lg bg-muted px-3 py-2"><span className="text-muted-foreground">Schedule</span><span className="font-semibold text-foreground">Oct 28 · 10:00 AM</span></div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {[["98%", "Delivered"], ["91%", "Read"], ["24%", "Clicked"]].map(([v, l]) => (
              <div key={l} className="rounded-lg bg-secondary py-2"><p className="text-lg font-bold text-primary">{v}</p><p className="text-muted-foreground">{l}</p></div>
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div className="rounded-3xl border border-border bg-muted p-6 text-xs">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full gradient-wa font-bold text-primary-foreground">AV</div><div><p className="text-sm font-semibold text-foreground">Aman Verma</p><p className="text-muted-foreground">aman@example.com</p></div></div>
        <div className="mt-4 flex flex-wrap gap-1.5">{["Lead", "Instagram", "Delhi"].map((t) => <span key={t} className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">{t}</span>)}</div>
        <p className="mt-4 rounded-lg bg-muted p-3 text-muted-foreground">📝 Note: Interested in bulk order, follow up Friday.</p>
        <div className="mt-4 space-y-2">{[["#4710", "₹2,340", "Delivered"], ["#4602", "₹980", "Delivered"]].map(([o, a, s]) => <div key={o} className="flex justify-between border-b border-border pb-2"><span className="text-foreground">{o}</span><span className="text-foreground">{a}</span><span className="text-primary">{s}</span></div>)}</div>
      </div>
    </div>
  );
}

/* ---------------- Demo modal ---------------- */
function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  useEffect(() => { setOverlayOpen(open); return () => setOverlayOpen(false); }, [open]);
  if (!open) return null;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await createDemoLead({ data: {
        name: String(f.get("name")), businessName: String(f.get("business")),
        phone: String(f.get("phone")), email: String(f.get("email")), industry: "WhatsApp CRM",
      } });
      toast.success("Thanks! We'll contact you on WhatsApp shortly.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }
  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";
  return (
    <div className="theme-wa fixed inset-0 z-[100] grid place-items-center bg-foreground/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div><h2 id="demo-title" className="text-2xl font-bold text-foreground">Book a Demo</h2><p className="mt-1 text-sm text-muted-foreground">See Vizogen.ai live in 20 minutes.</p></div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <input name="name" required minLength={2} placeholder="Your name" aria-label="Name" className={field} />
          <input name="business" required minLength={2} placeholder="Business name" aria-label="Business" className={field} />
          <input name="phone" required type="tel" pattern="[0-9+\-\s()]{8,20}" placeholder="WhatsApp number" aria-label="WhatsApp number" className={field} />
          <input name="email" required type="email" placeholder="Email" aria-label="Email" className={field} />
          <button disabled={busy} className={btnPrimary + " mt-2 disabled:opacity-60"}>{busy ? "Sending…" : "Book my demo"}</button>
        </form>
      </div>
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("vz-cookies")) setShow(true); }, []);
  if (!show) return null;
  const close = () => { localStorage.setItem("vz-cookies", "1"); setShow(false); };
  return (
    <div className="fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-w-xl flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm shadow-xl sm:flex-row sm:items-center md:right-auto md:left-6 md:mx-0">
      <p className="flex-1 text-muted-foreground">We use cookies to improve your experience. <a href="/privacy-policy" className="font-semibold text-primary">Learn more</a></p>
      <div className="flex gap-2"><button onClick={close} className={btnSecondary + " py-2"}>Decline</button><button onClick={close} className={btnPrimary + " py-2"}>Accept</button></div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export function WhatsAppCrmPage() {
  const [demo, setDemo] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [faq, setFaq] = useState<number | null>(0);
  const openDemo = () => setDemo(true);

  return (
    <div id="top" className="theme-wa min-h-screen scroll-smooth font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans">
      <style>{`html{scroll-behavior:smooth}`}</style>
      <Nav onDemo={openDemo} />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <img src={mark.url} alt="" aria-hidden className="pointer-events-none absolute -right-24 -top-10 w-[520px] opacity-[0.07] blur-[1px]" />
          <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[420px] rounded-full gradient-wa opacity-15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-12 md:px-6 lg:grid-cols-2 lg:pt-20">
            <Fade>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary px-3 py-1 text-xs font-semibold text-accent-foreground"><span className="size-1.5 rounded-full bg-primary" />{WA.hero.badge}</span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
                {WA.hero.title} <span className="text-gradient-wa">{WA.hero.titleAccent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">{WA.hero.sub}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={WA.signupUrl} className={btnPrimary + " px-7 py-3.5 text-base"}>Start Free Trial</a>
                <button onClick={openDemo} className={btnSecondary + " px-7 py-3.5 text-base"}>Book a Demo</button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{WA.hero.note}</p>
            </Fade>
            <Fade delay={0.15}><InboxMock /></Fade>
          </div>
        </section>

        {/* Trust */}
        <section className="border-y border-border bg-muted py-12" aria-label="Trusted by">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trusted by growing brands</p>
            <div className="mt-6 grid grid-cols-3 gap-6 md:grid-cols-6">
              {WA.trustLogos.map((l) => <span key={l} className="text-center text-lg font-bold tracking-tight text-muted-foreground/60">{l}</span>)}
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {WA.stats.map((s) => <div key={s.label}><p className="text-3xl font-extrabold text-gradient-wa md:text-4xl">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>)}
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 md:px-6">
            <Fade className="rounded-3xl border border-border bg-muted p-8">
              <h2 className="text-2xl font-bold text-foreground">Sound familiar?</h2>
              <ul className="mt-6 space-y-4">{WA.pains.map((p) => <li key={p} className="flex gap-3 text-muted-foreground"><X className="mt-0.5 size-5 shrink-0 text-destructive" />{p}</li>)}</ul>
            </Fade>
            <Fade delay={0.1} className="rounded-3xl border border-primary/20 bg-secondary p-8">
              <h2 className="text-2xl font-bold text-foreground">Vizogen fixes this</h2>
              <ul className="mt-6 space-y-4">{WA.fixes.map((p) => <li key={p} className="flex gap-3 text-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full gradient-wa"><Check className="size-3.5 text-primary-foreground" /></span>{p}</li>)}</ul>
              <p className="mt-6 font-semibold text-accent-foreground">Stop relying on emails with low open rates, reach customers where they actually reply.</p>
            </Fade>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Heading eyebrow="Features" title="Everything you need to sell on chat" sub="One platform for conversations, automation and campaigns." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WA.features.map((f, i) => (
                <Fade key={f.title} delay={(i % 4) * 0.06} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-wa">
                  <div className="grid size-11 place-items-center rounded-xl gradient-wa"><Icon name={f.icon} className="size-5 text-primary-foreground" /></div>
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
                <Fade className={i % 2 ? "md:order-2" : ""}><DeepVisual kind={d.kind} /></Fade>
                <Fade delay={0.1}>
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">{d.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{d.title}</h2>
                  <ul className="mt-6 space-y-3">{d.bullets.map((b) => <li key={b} className="flex gap-3 text-muted-foreground"><Check className="mt-0.5 size-5 shrink-0 text-primary" />{b}</li>)}</ul>
                </Fade>
              </div>
            ))}
          </div>
        </section>

        {/* E-commerce */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
            <Fade>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">E-commerce & Shopify</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{WA.ecommerce.title}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">{WA.ecommerce.bullets.map((b) => <li key={b} className="flex gap-2 font-medium text-foreground"><Check className="size-5 text-primary" />{b}</li>)}</ul>
              <a href={WA.signupUrl} className={btnPrimary + " mt-8"}>Connect Shopify</a>
            </Fade>
            <Fade delay={0.1} className="mx-auto w-full max-w-[300px]">
              <div className="rounded-[2.5rem] border-8 border-foreground bg-muted p-3 shadow-2xl">
                <div className="mb-3 rounded-2xl gradient-wa px-4 py-3 text-sm font-semibold text-primary-foreground">Your Store ✓</div>
                <div className="space-y-3">
                  {WA.ecommerce.messages.map((m) => <div key={m.title} className="rounded-2xl rounded-tl-sm bg-card p-3 text-xs shadow-sm"><p className="font-semibold text-foreground">{m.title}</p><p className="mt-1 text-muted-foreground">{m.text}</p></div>)}
                </div>
              </div>
            </Fade>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Heading eyebrow="How it works" title="Live in three simple steps" />
            <div className="relative grid gap-10 md:grid-cols-3">
              <div aria-hidden className="absolute left-[16%] right-[16%] top-7 hidden h-0.5 gradient-wa opacity-40 md:block" />
              {WA.steps.map((s, i) => (
                <Fade key={s.title} delay={i * 0.1} className="relative text-center">
                  <div className="mx-auto grid size-14 place-items-center rounded-full gradient-wa text-xl font-bold text-primary-foreground shadow-wa">{i + 1}</div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section id="solutions" className="scroll-mt-20 bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Heading eyebrow="Solutions" title="Built for every industry" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WA.industries.map((d, i) => (
                <Fade key={d.title} delay={(i % 3) * 0.06} className="rounded-2xl border border-border bg-card p-6">
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
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <Heading eyebrow="Integrations" title="Works with the tools you already use" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {WA.integrations.map((n) => <div key={n} className="grid h-20 place-items-center rounded-2xl border border-border bg-card text-sm font-bold text-foreground transition-colors hover:border-primary">{n}</div>)}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Heading eyebrow="Testimonials" title="Loved by growing brands" />
            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              {WA.testimonials.map((t) => (
                <figure key={t.name} className="min-w-[85%] snap-center rounded-2xl border border-border bg-card p-6 md:min-w-0">
                  <div className="flex gap-0.5 text-wa-lime" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</div>
                  <blockquote className="mt-4 text-foreground">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full gradient-wa text-sm font-bold text-primary-foreground">{t.initials}</span><span><span className="block text-sm font-semibold text-foreground">{t.name}</span><span className="text-xs text-muted-foreground">{t.brand}</span></span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Heading eyebrow="Pricing" title="Simple, Transparent Pricing" />
            <div className="mb-10 flex items-center justify-center gap-3 text-sm font-semibold">
              <span className={yearly ? "text-muted-foreground" : "text-foreground"}>Monthly</span>
              <button role="switch" aria-checked={yearly} aria-label="Yearly billing" onClick={() => setYearly(!yearly)} className={`relative h-7 w-12 rounded-full transition-colors ${yearly ? "gradient-wa" : "bg-input"}`}>
                <span className={`absolute top-1 size-5 rounded-full bg-background shadow transition-all ${yearly ? "left-6" : "left-1"}`} />
              </button>
              <span className={yearly ? "text-foreground" : "text-muted-foreground"}>Yearly</span>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">{WA.pricing.yearlyDiscountLabel}</span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {WA.pricing.plans.map((p) => {
                const price = yearly ? p.yearly : p.monthly;
                const pop = "popular" in p && p.popular;
                return (
                  <Fade key={p.name} className={`relative flex flex-col rounded-3xl border p-8 ${pop ? "border-primary bg-card shadow-wa md:-translate-y-3" : "border-border bg-card"}`}>
                    {pop && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-wa px-3 py-1 text-xs font-bold text-primary-foreground">Most Popular</span>}
                    <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                    <p className="mt-6 text-4xl font-extrabold text-foreground">{price == null ? "Custom" : `₹${price.toLocaleString("en-IN")}`}{price != null && <span className="text-base font-medium text-muted-foreground">/mo</span>}</p>
                    {price != null && <p className="text-xs text-muted-foreground">{yearly ? "billed yearly" : "billed monthly"}</p>}
                    <ul className="mt-6 flex-1 space-y-3 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2 text-foreground"><Check className="size-4 shrink-0 text-primary" />{f}</li>)}</ul>
                    {p.cta === "Talk to Sales"
                      ? <button onClick={openDemo} className={btnSecondary + " mt-8"}>{p.cta}</button>
                      : <a href={WA.signupUrl} className={(pop ? btnPrimary : btnSecondary) + " mt-8"}>{p.cta}</a>}
                  </Fade>
                );
              })}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">{WA.pricing.note}</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Heading eyebrow="FAQ" title="Frequently asked questions" />
            <div className="space-y-3">
              {WA.faqs.map((f, i) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card">
                  <h3><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-foreground">
                    {f.q}<ChevronDown className={`size-5 shrink-0 text-muted-foreground transition-transform ${faq === i ? "rotate-180" : ""}`} />
                  </button></h3>
                  {faq === i && <p className="px-6 pb-5 text-muted-foreground">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 md:px-6">
          <Fade className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl gradient-wa px-6 py-16 text-center md:py-20">
            <img src={mark.url} alt="" aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 w-64 opacity-20 brightness-200" />
            <h2 className="relative text-3xl font-extrabold text-primary-foreground md:text-5xl">Ready to scale your brand with Vizogen?</h2>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WA.signupUrl} className="inline-flex items-center justify-center rounded-xl bg-background px-7 py-3.5 font-semibold text-primary transition-transform hover:-translate-y-0.5">Start Free Trial</a>
              <button onClick={openDemo} className="inline-flex items-center justify-center rounded-xl border border-primary-foreground/60 px-7 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">Talk to Sales</button>
            </div>
          </Fade>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-6 md:px-6">
          <div className="md:col-span-2">
            <img src={logo.url} alt="Vizogen.ai" className="h-8 w-auto" loading="lazy" width={132} height={30} />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{WA.footer.description}</p>
            <p className="mt-4 text-sm"><a className="text-foreground hover:text-primary" href={`mailto:${WA.contactEmail}`}>{WA.contactEmail}</a><br /><a className="text-foreground hover:text-primary" href={`tel:${WA.contactPhone.replace(/\s/g, "")}`}>{WA.contactPhone}</a></p>
            <div className="mt-4 flex gap-3 text-muted-foreground">
              {([["Instagram", "https://instagram.com"], ["Facebook", "https://facebook.com"], ["Linkedin", "https://linkedin.com"], ["Youtube", "https://youtube.com"]] as const).map(([n, h]) => (
                <a key={n} href={h} target="_blank" rel="noopener noreferrer" aria-label={n} className="hover:text-primary"><Icon name={n} className="size-5" /></a>
              ))}
            </div>
          </div>
          {WA.footer.columns.map((c) => (
            <div key={c.title}><p className="font-semibold text-foreground">{c.title}</p><ul className="mt-4 space-y-2 text-sm">{c.links.map((l) => <li key={l.label}><a href={l.href} className="text-muted-foreground hover:text-primary">{l.label}</a></li>)}</ul></div>
          ))}
        </div>
        <p className="border-t border-border py-6 text-center text-sm text-muted-foreground">{WA.footer.copyright}</p>
      </footer>

      <DemoModal open={demo} onClose={() => setDemo(false)} />
      <CookieBanner />
    </div>
  );
}
