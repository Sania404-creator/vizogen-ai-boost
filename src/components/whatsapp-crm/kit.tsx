import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, AnimatePresence, animate } from "motion/react";
import * as Icons from "lucide-react";
import { Sparkles, Check, ChevronDown, Menu, Star, X, Plus, ShieldCheck, Zap, TrendingUp, BadgeCheck, MessageCircle, Instagram, Users, Play, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { WA } from "./config";
import logo from "@/assets/vizogen-ai-logo.png.asset.json";
import mark from "@/assets/vizogen-ai-v-logo.png.asset.json";
import heroWoman from "@/assets/wa-hero-woman.png";
import armchair from "@/assets/wa-armchair.jpg";
import { createDemoLead } from "@/lib/bookings.functions";
import { setOverlayOpen } from "@/lib/site-contact";

export const ext = { target: "_blank", rel: "noopener" } as const;

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <C className={className} aria-hidden />;
}

type Dir = "up" | "left" | "right" | "scale";
export function Fade({ children, delay = 0, className, dir = "up" }: { children: ReactNode; delay?: number; className?: string; dir?: Dir }) {
  const reduce = useReducedMotion();
  const from = reduce ? { opacity: 0 } : dir === "left" ? { opacity: 0, x: -32 } : dir === "right" ? { opacity: 0, x: 32 } : dir === "scale" ? { opacity: 0, scale: 0.92 } : { opacity: 0, y: 24 };
  return (
    <motion.div className={className} initial={from} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setV(to); return; }
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{prefix}{v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export const btnPrimary =
  "btn-shine relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl gradient-wa px-5 py-3 text-sm font-semibold text-primary-foreground shadow-wa transition-transform hover:-translate-y-0.5";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary";
export const card = "rounded-[22px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-wa";

export function Pill({ icon, children }: { icon: string; children: ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary px-3 py-1 text-xs font-semibold text-accent-foreground"><Icon name={icon} className="size-3.5" />{children}</span>;
}

export function Heading({ icon = "Sparkles", eyebrow, title, sub }: { icon?: string; eyebrow?: string; title: string; sub?: string }) {
  return (
    <Fade className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && <Pill icon={icon}>{eyebrow}</Pill>}
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-[2.6rem] md:leading-tight">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </Fade>
  );
}

export function Marquee({ children, reverse = false, speed = 40, offset = 0 }: { children: ReactNode; reverse?: boolean; speed?: number; offset?: number }) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max gap-4 py-2 group-hover:[animation-play-state:paused] motion-reduce:!animate-none"
        style={{ animation: `marquee ${speed}s linear infinite`, animationDirection: reverse ? "reverse" : "normal", animationDelay: `-${offset}s` }}>
        <div className="flex gap-4">{children}</div>
        <div className="flex gap-4" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

export function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="wa-blob absolute -left-32 top-10 size-[420px] rounded-full gradient-wa opacity-20 blur-3xl" />
      <div className="wa-blob absolute -right-24 top-1/3 size-[380px] rounded-full bg-wa-lime opacity-15 blur-3xl [animation-delay:-6s]" />
    </div>
  );
}

/** Sends a lead to a configured webhook, or saves it into the Vizogen CRM. */
export async function submitLead(kind: "lead" | "demo", d: { name: string; phone: string; business?: string; businessType?: string; preferredTime?: string; email?: string }) {
  const url = kind === "lead" ? WA.leadWebhookUrl : WA.demoWebhookUrl;
  if (url) {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, source: kind, page: window.location.pathname, at: new Date().toISOString() }) });
    if (!r.ok) throw new Error("We couldn't send your details. Please try again.");
    return;
  }
  await createDemoLead({ data: {
    name: d.name, phone: d.phone, email: d.email ?? "",
    businessName: d.business && d.business.length >= 2 ? d.business : d.businessType || "WhatsApp CRM lead",
    industry: (d.businessType || "WhatsApp CRM").slice(0, 60), preferredTime: d.preferredTime,
  } });
}

/* ---------------- Navbar ---------------- */
export function Nav({ onDemo, base = "" }: { onDemo: () => void; base?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [feat, setFeat] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { setOverlayOpen(open); }, [open]);
  const href = (h: string) => (h.startsWith("#") ? base + h : h);
  const side = WA.nav.filter((n) => n.href.startsWith("#"));
  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "border-b border-border bg-background/75 backdrop-blur-xl" : "bg-transparent"}`}>
      <motion.div className="absolute inset-x-0 top-0 h-0.5 origin-left gradient-wa" style={{ scaleX: progress }} />
      <nav className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all md:px-6 ${scrolled ? "h-14" : "h-20"}`} aria-label="Main">
        <a href={base || "#top"} aria-label="Vizogen.ai home"><img src={logo.url} alt="Vizogen.ai" className="h-8 w-auto" width={132} height={30} /></a>
        <ul className="hidden items-center gap-8 lg:flex">
          {side.map((n) => n.label === "Features" ? (
            <li key={n.href} className="relative" onMouseEnter={() => setFeat(true)} onMouseLeave={() => setFeat(false)}>
              <a href={href(n.href)} aria-haspopup="true" aria-expanded={feat} onFocus={() => setFeat(true)} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">{n.label}<ChevronDown className="size-3.5" /></a>
              <AnimatePresence>{feat && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }} className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                  <div className="rounded-2xl border border-border bg-card p-2 shadow-xl">
                    <a href={href("#features")} className="block rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-muted">All features</a>
                    <a href={href("#demo")} className="block rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-muted">See Vizogen in action</a>
                    <a href={WA.links.vizogenAIStudio} {...ext} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-muted"><Sparkles className="size-4 text-primary" />Vizogen AI Studio<span className="ml-auto rounded-full gradient-wa px-2 py-0.5 text-[10px] font-bold text-primary-foreground">New</span></a>
                  </div>
                </motion.div>)}</AnimatePresence>
            </li>
          ) : <li key={n.href}><a href={href(n.href)} className="text-sm font-medium text-muted-foreground hover:text-foreground">{n.label}</a></li>)}
        </ul>
        <div className="hidden items-center gap-4 lg:flex">
          <a href={WA.app.dashboard} {...ext} className="text-sm font-semibold text-foreground hover:text-primary">Login</a>
          <a href={WA.app.dashboard} {...ext} className={btnPrimary + " py-2.5"}>Start Free Demo</a>
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu className="size-6" /></button>
      </nav>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={() => setOpen(false)} />
            <motion.div role="dialog" aria-label="Menu" className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-background p-6 shadow-2xl lg:hidden" initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
              <div className="flex items-center justify-between"><img src={logo.url} alt="Vizogen.ai" className="h-7 w-auto" /><button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1"><X className="size-6" /></button></div>
              <ul className="mt-6 flex flex-col">
                {side.map((n) => <li key={n.href}><a href={href(n.href)} onClick={() => setOpen(false)} className="block border-b border-border py-3.5 font-medium text-foreground">{n.label}</a></li>)}
                <li><a href={WA.links.vizogenAIStudio} {...ext} onClick={() => setOpen(false)} className="flex items-center gap-2 border-b border-border py-3.5 font-medium text-foreground"><Sparkles className="size-4 text-primary" />Vizogen AI Studio<span className="rounded-full gradient-wa px-2 py-0.5 text-[10px] font-bold text-primary-foreground">New</span></a></li>
              </ul>
              <div className="mt-auto grid gap-3">
                <a href={WA.app.dashboard} {...ext} onClick={() => setOpen(false)} className={btnSecondary + " w-full"}>Login</a>
                <a href={WA.app.dashboard} {...ext} onClick={() => setOpen(false)} className={btnPrimary + " w-full"}>Start Free Demo</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------- Demo booking modal ---------------- */
export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => { setOverlayOpen(open); if (open) setDone(false); return () => setOverlayOpen(false); }, [open]);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open, onClose]);
  if (!open) return null;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submitLead("demo", { name: String(f.get("name")), phone: String(f.get("phone")), preferredTime: String(f.get("time")), businessType: "Live demo" });
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }
  return (
    <div className="theme-wa fixed inset-0 z-[100] grid place-items-center bg-foreground/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div><h2 id="demo-title" className="text-2xl font-bold text-foreground">Join a Live Demo</h2><p className="mt-1 text-sm text-muted-foreground">See Vizogen.ai live in 20 minutes.</p></div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>
        {done ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full gradient-wa"><Check className="size-7 text-primary-foreground" /></span>
            <p className="mt-4 font-bold text-foreground">You're booked in!</p><p className="mt-1 text-sm text-muted-foreground">We'll confirm your slot on WhatsApp shortly.</p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="grid gap-3">
            <input name="name" required minLength={2} placeholder="Your name" aria-label="Name" className={field} />
            <PhoneInput />
            <select name="time" required aria-label="Preferred time" className={field} defaultValue=""><option value="" disabled>Preferred time</option>{["Morning (10am – 1pm)", "Afternoon (1pm – 4pm)", "Evening (4pm – 7pm)"].map((t) => <option key={t}>{t}</option>)}</select>
            <button disabled={busy} className={btnPrimary + " mt-2 disabled:opacity-60"}>{busy ? "Sending…" : "Book my demo"}</button>
          </form>
        )}
        {WA.calendlyUrl && <iframe title="Book on Calendly" src={WA.calendlyUrl} className="mt-5 h-[520px] w-full rounded-2xl border border-border" loading="lazy" />}
      </div>
    </div>
  );
}

export const field = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";
export function PhoneInput() {
  return (
    <div className="flex overflow-hidden rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
      <span className="grid place-items-center border-r border-input bg-muted px-3 text-sm font-semibold text-muted-foreground">+91</span>
      <input name="phone" required type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="WhatsApp number" aria-label="WhatsApp number" className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none" />
    </div>
  );
}

/* ---------------- Footer ---------------- */
export function Footer({ base = "" }: { base?: string }) {
  const href = (h: string) => (h.startsWith("#") ? base + h : h);
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-7 md:px-6">
        <div className="md:col-span-2">
          <img src={logo.url} alt="Vizogen.ai" className="h-8 w-auto" loading="lazy" width={132} height={30} />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{WA.footer.description}</p>
          <p className="mt-4 text-sm"><a className="text-foreground hover:text-primary" href={`mailto:${WA.contactEmail}`}>{WA.contactEmail}</a><br /><a className="text-foreground hover:text-primary" href={`tel:${WA.contactPhone.replace(/\s/g, "")}`}>{WA.contactPhone}</a></p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={WA.app.dashboard} {...ext} className={btnSecondary + " py-2"}>Login</a>
            <a href={WA.app.dashboard} {...ext} className={btnPrimary + " py-2"}>Start Free Demo</a>
          </div>
        </div>
        {WA.footer.columns.map((c) => (
          <div key={c.title}><p className="font-semibold text-foreground">{c.title}</p><ul className="mt-4 space-y-2 text-sm">{c.links.map((l) => <li key={l.label}><a href={href(l.href)} className="text-muted-foreground hover:text-primary">{l.label}</a></li>)}</ul></div>
        ))}
      </div>
      <p className="border-t border-border py-6 text-center text-sm text-muted-foreground">{WA.footer.copyright}</p>
    </footer>
  );
}

/* ---------------- Pricing helpers ---------------- */
export function yearlySaving(p: { monthly: number; yearly: number }) {
  const full = p.monthly * 12;
  return { amount: full - p.yearly, percent: Math.round(((full - p.yearly) / full) * 100) };
}

export function RollingPrice({ value, className }: { value: number; className?: string }) {
  const digits = `₹${value.toLocaleString("en-IN")}`.split("");
  return (
    <span className={`inline-flex overflow-hidden ${className ?? ""}`} aria-label={`₹${value.toLocaleString("en-IN")}`}>
      {digits.map((d, i) => (
        <AnimatePresence key={i} mode="popLayout" initial={false}>
          <motion.span key={d + i + value} aria-hidden initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }} className="inline-block">{d}</motion.span>
        </AnimatePresence>
      ))}
    </span>
  );
}

export function BillingToggle({ yearly, setYearly }: { yearly: boolean; setYearly: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm font-semibold">
      <span className={yearly ? "text-muted-foreground" : "text-foreground"}>Monthly</span>
      <button role="switch" aria-checked={yearly} aria-label="Yearly billing" onClick={() => setYearly(!yearly)} className={`relative h-7 w-12 rounded-full transition-colors ${yearly ? "gradient-wa" : "bg-input"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-background shadow transition-all ${yearly ? "left-6" : "left-1"}`} />
      </button>
      <span className={yearly ? "text-foreground" : "text-muted-foreground"}>Yearly</span>
    </div>
  );
}

export function MetaCharges() {
  return (
    <Fade className="mt-12 grid gap-8 rounded-3xl border border-border bg-secondary p-6 md:grid-cols-2 md:p-10">
      <div>
        <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">Meta WhatsApp Message Charges</h3>
        <p className="mt-3 text-muted-foreground">Zero markup. Direct bill to Meta. You only pay for what you use based on conversation categories.</p>
        <span className="mt-4 inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">Rates effective from {WA.pricing.metaRatesDate}, as set by Meta</span>
        <div className="mt-5 rounded-2xl border border-primary/30 bg-card p-4 text-sm text-foreground"><span className="font-bold text-primary">AI Assistant:</span> AI message charges apply as per the selected model (e.g., Gemini, OpenAI, Claude).</div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Per template message</p>
        <ul className="mt-4 divide-y divide-border">{WA.pricing.metaRates.map((r) => <li key={r.cat} className="flex justify-between py-3 text-sm"><span className="text-foreground">{r.cat}</span><span className="font-bold text-foreground">{r.rate}</span></li>)}</ul>
        <p className="mt-3 text-sm font-semibold text-primary">First 1,000 Service messages every month are FREE</p>
      </div>
    </Fade>
  );
}



export function RotatingWord() {
  const words = WA.hero.rotating;
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => { if (reduce) return; const t = setInterval(() => setI((x) => (x + 1) % words.length), 2200); return () => clearInterval(t); }, [reduce, words.length]);
  return (
    <span className="relative inline-block min-w-[5ch] align-bottom">
      <AnimatePresence mode="wait">
        <motion.span key={words[i]} className="inline-block text-gradient-wa" initial={{ y: "60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-60%", opacity: 0 }} transition={{ duration: 0.35 }}>{words[i]}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ---------------- Hero collage ---------------- */
export function Bob({ children, className, d = 5, delay = 0 }: { children: ReactNode; className?: string; d?: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={`absolute ${className}`} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + delay, duration: 0.5 }}>
      <motion.div animate={reduce ? { y: 0 } : { y: [0, -10, 0] }} transition={{ duration: d, repeat: Infinity, ease: "easeInOut", delay }}>{children}</motion.div>
    </motion.div>
  );
}

export function ChatLoop() {
  const msgs = WA.collage.chat;
  const [n, setN] = useState(1);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setN(msgs.length); return; }
    const t = setInterval(() => setN((x) => (x >= msgs.length + 2 ? 1 : x + 1)), 1400);
    return () => clearInterval(t);
  }, [reduce, msgs.length]);
  return (
    <div className="flex h-[230px] flex-col justify-end gap-1.5 overflow-hidden bg-muted/60 p-2.5 text-[10px]">
      <AnimatePresence initial={false}>
        {msgs.slice(0, Math.min(n, msgs.length)).map((m, i) => (
          <motion.div key={i} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={m.from === "user" ? "max-w-[85%] rounded-xl rounded-tl-sm bg-card px-2.5 py-1.5 text-foreground shadow-sm" : "ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-accent px-2.5 py-1.5 text-accent-foreground"}>
            {m.text === "products"
              ? <div className="flex gap-1">{["", "hue-rotate-[160deg] saturate-50", "grayscale"].map((f) => <img key={f} src={armchair} alt="Armchair option" className={`size-10 rounded-md object-cover ${f}`} width={40} height={40} />)}</div>
              : m.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function HeroCollage() {
  const s = WA.collage.stats;
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mt-14 h-[620px] w-full max-w-6xl sm:h-[680px]">
      <div aria-hidden className="absolute left-1/2 top-16 size-[440px] -translate-x-1/2 rounded-full bg-secondary sm:size-[520px]" />
      <div aria-hidden className="absolute left-1/2 top-24 size-[360px] -translate-x-1/2 rounded-full bg-accent/50 blur-2xl sm:size-[440px]" />
      <svg aria-hidden className="absolute inset-0 hidden size-full md:block" viewBox="0 0 1000 680" fill="none" preserveAspectRatio="none">
        {["M150 120 C 320 40, 420 60, 500 90", "M500 90 C 600 60, 720 80, 830 170", "M180 420 C 260 560, 400 620, 500 600", "M500 600 C 640 620, 760 560, 830 480"].map((d, i) => (
          <g key={d}>
            <motion.path id={`orbit${i}`} d={d} stroke="currentColor" className="text-primary/40" strokeWidth="1.5" strokeDasharray="5 6"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: i * 0.25 }} />
            {!reduce && <circle r="4" className="fill-primary"><animateMotion dur={`${4 + i}s`} repeatCount="indefinite" path={d} /></circle>}
          </g>
        ))}
      </svg>
      <img src={heroWoman} alt="Smiling business owner using Vizogen on her phone" width={896} height={1152} fetchPriority="high"
        className="absolute bottom-16 left-1/2 h-[480px] w-auto -translate-x-1/2 object-contain sm:h-[580px]" />

      <Bob className="left-[2%] top-[4%] sm:left-[8%]" d={5}>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
          <div><p className="text-2xl font-extrabold text-foreground"><CountUp to={10} suffix="X" /></p><p className="text-[11px] font-semibold text-muted-foreground">ROAS</p></div>
          <TrendingUp className="size-6 text-primary" />
        </div>
      </Bob>
      <Bob className="left-1/2 top-0 -translate-x-1/2" d={4} delay={0.2}><BrandLogo name="WhatsApp" /></Bob>
      <Bob className="left-[24%] top-[22%] hidden sm:block" d={6} delay={0.4}><BrandLogo name="Instagram" /></Bob>
      <Bob className="right-[26%] top-[4%] hidden sm:block" d={5.5} delay={0.6}><BrandLogo name="Shopify" /></Bob>
      <Bob className="left-[30%] bottom-[30%] hidden lg:block" d={6.2} delay={0.5}><BrandLogo name="Facebook" /></Bob>

      <Bob className="left-0 top-[30%] hidden w-[210px] md:block" d={6.5} delay={0.3}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center gap-2 p-2.5"><span className="grid size-6 place-items-center rounded-full bg-secondary text-[9px] font-bold text-accent-foreground">LL</span><div><p className="text-[11px] font-bold text-foreground">Luxe Living</p><p className="text-[9px] text-muted-foreground">Sponsored</p></div></div>
          <img src={armchair} alt="Green lounge armchair" className="aspect-square w-full object-cover" loading="lazy" width={210} height={210} />
          <p className="px-2.5 pt-2 text-[11px] font-semibold text-foreground">Modern comfort. Made for you.</p>
          <div className="m-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-wa-green px-2 py-1.5 text-[10px] font-semibold text-primary-foreground"><MessageCircle className="size-3" />Chat on WhatsApp</div>
          <p className="px-2.5 pb-2.5 text-[10px] text-muted-foreground">Get 15% OFF your first order</p>
        </div>
      </Bob>

      <Bob className="right-0 top-[6%] hidden w-[250px] md:block" d={7} delay={0.5}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2"><img src={mark.url} alt="" className="size-5" /><span className="text-[11px] font-bold text-foreground">Vizogen Inbox</span></div>
          <div className="flex items-center gap-2 px-3 py-2"><span className="grid size-6 place-items-center rounded-full gradient-wa text-[9px] font-bold text-primary-foreground">AS</span><div><p className="text-[11px] font-semibold text-foreground">Ananya Sharma</p><p className="text-[9px] text-primary">New Lead</p></div></div>
          <ChatLoop />
        </div>
      </Bob>

      <Bob className="right-[2%] top-[50%] hidden md:block" d={5} delay={0.7}>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-xl"><span className="grid size-7 place-items-center rounded-full gradient-wa"><Check className="size-4 text-primary-foreground" /></span><div><p className="text-sm font-extrabold text-foreground"><CountUp to={92} suffix="%" /></p><p className="text-[10px] text-muted-foreground">Read Rate</p></div></div>
      </Bob>
      <Bob className="right-[22%] top-[40%] hidden lg:block" d={6} delay={0.9}>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground shadow-xl"><Users className="size-4 text-primary" />Lead Captured</div>
      </Bob>

      <Bob className="bottom-[2%] right-0 hidden w-[300px] lg:block" d={8} delay={0.6}>
        <div className="rounded-2xl border border-border bg-card p-3 shadow-xl">
          <div className="mb-2 flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive/60" /><span className="size-2 rounded-full bg-wa-lime" /><span className="size-2 rounded-full bg-primary" /><span className="ml-2 text-[10px] font-semibold text-muted-foreground">Vizogen – Overview</span></div>
          <p className="text-[10px] font-semibold text-foreground">Live Performance</p>
          <div className="mt-1.5 grid grid-cols-4 gap-1.5 text-center">
            {[["New Leads", <CountUp key="a" to={s.leads} />], ["Convos", <CountUp key="b" to={s.conversations} />], ["Orders", <CountUp key="c" to={s.orders} />], ["Revenue", <CountUp key="d" to={s.revenueLakh} decimals={1} prefix="₹" suffix="L" />]].map(([l, v]) => (
              <div key={String(l)} className="rounded-lg bg-muted px-1 py-1.5"><p className="text-[11px] font-extrabold text-foreground">{v}</p><p className="text-[8px] text-muted-foreground">{l}</p></div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 space-y-1 text-[9px]">
              <p className="font-semibold text-foreground">Top Channels</p>
              {[["WhatsApp", 72], ["Instagram", 28]].map(([c, w]) => <div key={c}><div className="flex justify-between text-muted-foreground"><span>{c}</span><span>{w}%</span></div><div className="h-1.5 rounded-full bg-muted"><motion.div className="h-full rounded-full gradient-wa" initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ duration: 1.2 }} /></div></div>)}
            </div>
            <div className="relative size-16">
              <svg viewBox="0 0 36 36" className="size-16 -rotate-90"><circle cx="18" cy="18" r="15" className="stroke-muted" strokeWidth="4" fill="none" />
                <motion.circle cx="18" cy="18" r="15" className="stroke-primary" strokeWidth="4" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: s.automation / 100 }} viewport={{ once: true }} transition={{ duration: 1.4 }} /></svg>
              <span className="absolute inset-0 grid place-items-center text-[10px] font-extrabold text-foreground">{s.automation}%</span>
            </div>
          </div>
        </div>
      </Bob>

      <Bob className="bottom-[14%] left-0 sm:left-[4%]" d={5.5} delay={0.8}>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-xl"><span className="grid size-8 place-items-center rounded-xl bg-secondary"><Zap className="size-4 text-primary" /></span><div><p className="text-xs font-bold text-foreground">Bot replied in 0.4s</p><p className="text-[10px] text-muted-foreground">AI Agent • Vizogen</p></div></div>
      </Bob>

      <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2" initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.8, type: "spring", stiffness: 220, damping: 14 }}>
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/25 motion-reduce:hidden" />
        <span className="flex items-center gap-2 whitespace-nowrap rounded-full gradient-wa px-4 py-2.5 text-xs sm:px-5 sm:py-3 sm:text-sm font-bold text-primary-foreground shadow-wa"><BadgeCheck className="size-5" />Lead Converted – Order Placed Successfully</span>
      </motion.div>
    </div>
  );
}

/* ---------------- Feature micro-animations ---------------- */
export function MicroAnim({ kind }: { kind: string }) {
  if (kind === "bars")
    return <div className="flex h-8 items-end gap-1">{[40, 70, 55, 90, 65].map((h, i) => <span key={i} className="wa-bar w-2 rounded-sm gradient-wa" style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }} />)}</div>;
  if (kind === "flow")
    return <div className="flex h-8 items-center gap-1"><span className="size-3 rounded-full gradient-wa" /><span className="wa-line h-0.5 w-8 origin-left gradient-wa" /><span className="size-3 rounded-full border-2 border-primary" /><span className="wa-line h-0.5 w-8 origin-left gradient-wa [animation-delay:.6s]" /><span className="size-3 rounded-full border-2 border-primary" /></div>;
  return <div className="flex h-8 items-center gap-1 rounded-full bg-secondary px-3">{[0, 1, 2].map((i) => <span key={i} className="wa-dot size-1.5 rounded-full bg-primary" style={{ animationDelay: `${i * 0.18}s` }} />)}</div>;
}

/* ---------------- Deep-dive visuals ---------------- */
export function DeepVisual({ kind }: { kind: string }) {
  if (kind === "flow")
    return (
      <div className="rounded-3xl border border-border bg-muted p-6">
        <div className="mx-auto flex max-w-xs flex-col items-center text-xs">
          <Fade dir="scale" className="w-full rounded-xl gradient-wa px-4 py-3 text-center font-semibold text-primary-foreground">Trigger: “Hi”</Fade>
          <motion.span className="h-8 w-0.5 origin-top gradient-wa" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 1 }} transition={{ duration: 0.5 }} />
          <Fade delay={0.3} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground shadow-sm">Welcome! What can we help with?<div className="mt-2 flex gap-1.5"><span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">Shop</span><span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">Track order</span><span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">Agent</span></div></Fade>
          <motion.span className="h-8 w-0.5 origin-top gradient-wa" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
          <div className="grid w-full grid-cols-2 gap-3">
            <Fade dir="left" delay={0.7} className="rounded-xl border border-border bg-card px-3 py-3 text-foreground shadow-sm">💳 Send payment link</Fade>
            <Fade dir="right" delay={0.8} className="rounded-xl border border-border bg-card px-3 py-3 text-foreground shadow-sm">👤 Hand off to human</Fade>
          </div>
        </div>
      </div>
    );
  if (kind === "campaign")
    return (
      <div className="rounded-3xl border border-border bg-muted p-6 text-sm">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="font-semibold text-foreground">Diwali Sale Broadcast · 4,280 contacts</p>
          <div className="mt-5 space-y-3">
            {WA.funnel.map((f, i) => (
              <div key={f.label}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{f.label}</span><span className="font-bold text-foreground"><CountUp to={f.value} suffix="%" /></span></div>
                <div className="h-3 rounded-full bg-muted"><motion.div className="h-full rounded-full gradient-wa" initial={{ width: 0 }} whileInView={{ width: `${f.value}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.2 }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div className="rounded-3xl border border-border bg-muted p-6 text-xs">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full gradient-wa font-bold text-primary-foreground">AS</div><div><p className="text-sm font-semibold text-foreground">Ananya Sharma</p><p className="text-muted-foreground">+91 98xxx xx210</p></div></div>
        <div className="mt-4 flex flex-wrap gap-1.5">{["VIP", "Instagram", "Mumbai", "Repeat buyer"].map((t, i) => <Fade key={t} dir="right" delay={i * 0.1}><span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">{t}</span></Fade>)}</div>
        <Fade dir="left" delay={0.4}><p className="mt-4 rounded-lg bg-muted p-3 text-muted-foreground">📝 Note: Wants the green lounge chair, follow up Friday.</p></Fade>
        <div className="mt-4 space-y-2">{[["#4821", "₹17,999", "Confirmed"], ["#4710", "₹2,340", "Delivered"], ["#4602", "₹980", "Delivered"]].map(([o, a, st], i) => <Fade key={o} dir="right" delay={0.5 + i * 0.1}><div className="flex justify-between border-b border-border pb-2"><span className="text-foreground">{o}</span><span className="text-foreground">{a}</span><span className="text-primary">{st}</span></div></Fade>)}</div>
      </div>
    </div>
  );
}

export function PhoneSequence() {
  const msgs = WA.ecommerce.messages;
  const [n, setN] = useState(1);
  const reduce = useReducedMotion();
  useEffect(() => { if (reduce) { setN(msgs.length); return; } const t = setInterval(() => setN((x) => (x >= msgs.length + 1 ? 1 : x + 1)), 1600); return () => clearInterval(t); }, [reduce, msgs.length]);
  return (
    <div className="mx-auto w-full max-w-[300px] rounded-[2.5rem] border-8 border-foreground bg-muted p-3 shadow-2xl">
      <div className="mb-3 flex items-center gap-2 rounded-2xl gradient-wa px-4 py-3 text-sm font-semibold text-primary-foreground"><img src={mark.url} alt="" className="size-5 brightness-200" />Luxe Living ✓</div>
      <div className="flex h-[340px] flex-col gap-3">
        <AnimatePresence initial={false}>
          {msgs.slice(0, Math.min(n, msgs.length)).map((m) => (
            <motion.div key={m.title} layout initial={{ opacity: 0, y: 14, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="rounded-2xl rounded-tl-sm bg-card p-3 text-xs shadow-sm">
              <p className="font-semibold text-foreground">{m.title}</p><p className="mt-1 text-muted-foreground">{m.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [lit, setLit] = useState(-1);
  useEffect(() => { if (!inView) return; let i = 0; const t = setInterval(() => { setLit(i); i++; if (i > 2) clearInterval(t); }, 500); return () => clearInterval(t); }, [inView]);
  return (
    <div ref={ref} className="relative grid gap-10 md:grid-cols-3">
      <div aria-hidden className="absolute left-[16%] right-[16%] top-7 hidden h-0.5 bg-border md:block"><motion.div className="h-full origin-left gradient-wa" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.4 }} /></div>
      {WA.steps.map((s, i) => (
        <div key={s.title} className="relative text-center">
          <div className={`mx-auto grid size-14 place-items-center rounded-full text-xl font-bold transition-all duration-500 ${lit >= i ? "gradient-wa text-primary-foreground shadow-wa scale-110" : "border-2 border-border bg-card text-muted-foreground"}`}>{i + 1}</div>
          <h3 className="mt-5 text-lg font-bold text-foreground">{s.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export function intUrl(u: string) { return u === "shopify" ? WA.links.shopify : u; }

export function IntegrationTile({ t }: { t: (typeof WA.integrations)[number] }) {
  const href = intUrl(t.url);
  const ext = href.startsWith("http");
  return (
    <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined} title={`Connect ${t.name}`}
      className="group/tile relative flex w-[120px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card px-3 py-4 transition-all hover:scale-105 hover:border-primary hover:shadow-wa">
      <img src={t.logo} alt={`${t.name} logo`} loading="lazy" width={44} height={44} className="size-11 object-contain" />
      <span className="text-center text-xs font-semibold text-foreground">{t.name}</span>
      <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background opacity-0 transition-opacity group-hover/tile:opacity-100">Connect →</span>
    </a>
  );
}

export function ReviewCard({ r }: { r: (typeof WA.reviews)[number] }) {
  return (
    <figure className="w-[300px] shrink-0 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-wa-lime" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}</div>
        {r.ch === "instagram" ? <Instagram className="size-4 text-muted-foreground" aria-label="Instagram" /> : <MessageCircle className="size-4 text-muted-foreground" aria-label="WhatsApp" />}
      </div>
      <blockquote className="mt-3 text-sm text-foreground">“{r.quote}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full gradient-wa text-xs font-bold text-primary-foreground">{r.name.replace("Dr. ", "").split(" ").map((x) => x[0]).join("")}</span>
        <span className="min-w-0"><span className="block text-sm font-semibold text-foreground">{r.name}</span><span className="block truncate text-xs text-muted-foreground">{r.biz}</span></span>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-primary"><BadgeCheck className="size-3.5" />Verified</span>
      </figcaption>
    </figure>
  );
}

export function StarsFill() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex gap-1" aria-label="4.9 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={inView ? { scale: 1, rotate: 0 } : {}} transition={{ delay: i * 0.15, type: "spring" }}><Star className="size-5 fill-current text-wa-lime" /></motion.span>
      ))}
    </div>
  );
}

export function logoOf(name: string) { return WA.integrations.find((i) => i.name === name)?.logo ?? ""; }
export function BrandLogo({ name, size = "size-12" }: { name: string; size?: string }) {
  return <span className={`grid ${size} place-items-center rounded-2xl border border-border bg-card p-2 shadow-xl`}><img src={logoOf(name)} alt={`${name} logo`} className="size-full object-contain" width={40} height={40} /></span>;
}
