import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, AnimatePresence, animate } from "motion/react";
import * as Icons from "lucide-react";
import { Check, ChevronDown, Menu, Star, X, Plus, ShieldCheck, Zap, TrendingUp, BadgeCheck, MessageCircle, Instagram, Users, Play, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { WA } from "./config";
import logo from "@/assets/vizogen-ai-logo.png.asset.json";
import mark from "@/assets/vizogen-ai-v-logo.png.asset.json";
import heroWoman from "@/assets/wa-hero-woman.png";
import armchair from "@/assets/wa-armchair.jpg";
import { createDemoLead } from "@/lib/bookings.functions";
import { setOverlayOpen } from "@/lib/site-contact";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <C className={className} aria-hidden />;
}

type Dir = "up" | "left" | "right" | "scale";
function Fade({ children, delay = 0, className, dir = "up" }: { children: ReactNode; delay?: number; className?: string; dir?: Dir }) {
  const reduce = useReducedMotion();
  const from = reduce ? { opacity: 0 } : dir === "left" ? { opacity: 0, x: -32 } : dir === "right" ? { opacity: 0, x: 32 } : dir === "scale" ? { opacity: 0, scale: 0.92 } : { opacity: 0, y: 24 };
  return (
    <motion.div className={className} initial={from} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
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

const btnPrimary =
  "btn-shine relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl gradient-wa px-5 py-3 text-sm font-semibold text-primary-foreground shadow-wa transition-transform hover:-translate-y-0.5";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary";
const card = "rounded-[22px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-wa";

function Pill({ icon, children }: { icon: string; children: ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary px-3 py-1 text-xs font-semibold text-accent-foreground"><Icon name={icon} className="size-3.5" />{children}</span>;
}

function Heading({ icon = "Sparkles", eyebrow, title, sub }: { icon?: string; eyebrow?: string; title: string; sub?: string }) {
  return (
    <Fade className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && <Pill icon={icon}>{eyebrow}</Pill>}
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-[2.6rem] md:leading-tight">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </Fade>
  );
}

function Marquee({ children, reverse = false, speed = 40, offset = 0 }: { children: ReactNode; reverse?: boolean; speed?: number; offset?: number }) {
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

function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="wa-blob absolute -left-32 top-10 size-[420px] rounded-full gradient-wa opacity-20 blur-3xl" />
      <div className="wa-blob absolute -right-24 top-1/3 size-[380px] rounded-full bg-wa-lime opacity-15 blur-3xl [animation-delay:-6s]" />
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Nav({ onDemo }: { onDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "border-b border-border bg-background/75 backdrop-blur-xl" : "bg-transparent"}`}>
      <motion.div className="absolute inset-x-0 top-0 h-0.5 origin-left gradient-wa" style={{ scaleX: progress }} />
      <nav className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all md:px-6 ${scrolled ? "h-14" : "h-20"}`} aria-label="Main">
        <a href="#top" aria-label="Vizogen.ai home"><img src={logo.url} alt="Vizogen.ai" className="h-8 w-auto" width={132} height={30} /></a>
        <ul className="hidden items-center gap-8 lg:flex">
          {WA.nav.map((n) => <li key={n.href}><a href={n.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">{n.label}</a></li>)}
        </ul>
        <div className="hidden items-center gap-4 lg:flex">
          <a href={WA.loginUrl} className="text-sm font-semibold text-foreground hover:text-primary">Login</a>
          <a href={WA.signupUrl} className={btnPrimary + " py-2.5"}>Get Started Free</a>
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu className="size-6" /></button>
      </nav>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-background p-6 shadow-2xl lg:hidden" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}>
              <div className="flex items-center justify-between"><img src={logo.url} alt="Vizogen.ai" className="h-7 w-auto" /><button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1"><X className="size-6" /></button></div>
              <ul className="mt-6 flex flex-col">{WA.nav.map((n) => <li key={n.href}><a href={n.href} onClick={() => setOpen(false)} className="block border-b border-border py-3.5 font-medium text-foreground">{n.label}</a></li>)}</ul>
              <div className="mt-auto grid gap-3">
                <a href={WA.loginUrl} className={btnSecondary}>Login</a>
                <a href={WA.signupUrl} className={btnPrimary}>Get Started Free</a>
                <button onClick={() => { setOpen(false); onDemo(); }} className={btnSecondary}>Book a Demo</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function RotatingWord() {
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
function Bob({ children, className, d = 5, delay = 0 }: { children: ReactNode; className?: string; d?: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={`absolute ${className}`} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + delay, duration: 0.5 }}>
      <motion.div animate={reduce ? { y: 0 } : { y: [0, -10, 0] }} transition={{ duration: d, repeat: Infinity, ease: "easeInOut", delay }}>{children}</motion.div>
    </motion.div>
  );
}

function ChatLoop() {
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

function HeroCollage() {
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
      <Bob className="left-1/2 top-0 -translate-x-1/2" d={4} delay={0.2}><span className="grid size-12 place-items-center rounded-2xl gradient-wa shadow-wa"><MessageCircle className="size-6 text-primary-foreground" /></span></Bob>
      <Bob className="left-[24%] top-[22%] hidden sm:block" d={6} delay={0.4}><span className="grid size-11 place-items-center rounded-2xl border border-border bg-card shadow-xl"><Instagram className="size-5 text-primary" /></span></Bob>

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
function MicroAnim({ kind }: { kind: string }) {
  if (kind === "bars")
    return <div className="flex h-8 items-end gap-1">{[40, 70, 55, 90, 65].map((h, i) => <span key={i} className="wa-bar w-2 rounded-sm gradient-wa" style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }} />)}</div>;
  if (kind === "flow")
    return <div className="flex h-8 items-center gap-1"><span className="size-3 rounded-full gradient-wa" /><span className="wa-line h-0.5 w-8 origin-left gradient-wa" /><span className="size-3 rounded-full border-2 border-primary" /><span className="wa-line h-0.5 w-8 origin-left gradient-wa [animation-delay:.6s]" /><span className="size-3 rounded-full border-2 border-primary" /></div>;
  return <div className="flex h-8 items-center gap-1 rounded-full bg-secondary px-3">{[0, 1, 2].map((i) => <span key={i} className="wa-dot size-1.5 rounded-full bg-primary" style={{ animationDelay: `${i * 0.18}s` }} />)}</div>;
}

/* ---------------- Deep-dive visuals ---------------- */
function DeepVisual({ kind }: { kind: string }) {
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

function PhoneSequence() {
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

function Steps() {
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

function intUrl(u: string) { return u === "shopify" ? WA.links.shopify : u; }

function IntegrationTile({ t }: { t: (typeof WA.integrations)[number] }) {
  const href = intUrl(t.url);
  const ext = href.startsWith("http");
  return (
    <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined} title={`Connect ${t.name}`}
      className="group/tile relative flex w-[120px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card px-3 py-4 transition-all hover:scale-105 hover:border-primary hover:shadow-wa">
      <span className="grid size-11 place-items-center rounded-xl bg-secondary"><Icon name={t.icon} className="size-5 text-primary" /></span>
      <span className="text-center text-xs font-semibold text-foreground">{t.name}</span>
      <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background opacity-0 transition-opacity group-hover/tile:opacity-100">Connect →</span>
    </a>
  );
}

function ReviewCard({ r }: { r: (typeof WA.reviews)[number] }) {
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

function StarsFill() {
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

/* ---------------- Page ---------------- */
export function WhatsAppCrmPage() {
  const [demo, setDemo] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [faq, setFaq] = useState<number | null>(0);
  const [compare, setCompare] = useState(false);
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
              <a href={WA.signupUrl} className={btnPrimary + " px-7 py-3.5 text-base"}>Start Free Trial <ArrowRight className="size-4" /></a>
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

        {/* E-commerce */}
        <section className="bg-secondary py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
            <Fade dir="left">
              <Pill icon="ShoppingCart">E-commerce</Pill>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">{WA.ecommerce.title}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">{WA.ecommerce.bullets.map((b) => <li key={b} className="flex gap-2 font-medium text-foreground"><Check className="size-5 text-primary" />{b}</li>)}</ul>
              <p className="mt-6 text-sm text-muted-foreground">Works with {WA.ecommerce.partners.join(", ")}.</p>
              <a href={WA.links.shopify} target="_blank" rel="noopener noreferrer" className={btnPrimary + " mt-6"}><Icon name="ShoppingBag" className="size-4" />Connect Shopify</a>
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
            <div className="mb-10 flex items-center justify-center gap-3 text-sm font-semibold">
              <span className={yearly ? "text-muted-foreground" : "text-foreground"}>Monthly</span>
              <button role="switch" aria-checked={yearly} aria-label="Yearly billing" onClick={() => setYearly(!yearly)} className={`relative h-7 w-12 rounded-full transition-colors ${yearly ? "gradient-wa" : "bg-input"}`}>
                <span className={`absolute top-1 size-5 rounded-full bg-background shadow transition-all ${yearly ? "left-6" : "left-1"}`} />
              </button>
              <span className={yearly ? "text-foreground" : "text-muted-foreground"}>Yearly</span>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">{WA.pricing.yearlyDiscountLabel}</span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {WA.pricing.plans.map((p, i) => {
                const price = yearly ? p.yearly : p.monthly;
                const pop = "popular" in p && p.popular;
                return (
                  <Fade key={p.name} delay={i * 0.08} className={`relative flex flex-col rounded-3xl border bg-card p-8 transition-all hover:-translate-y-1.5 ${pop ? "border-primary shadow-wa md:-translate-y-3" : "border-border hover:border-primary/60"}`}>
                    {pop && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-wa px-3 py-1 text-xs font-bold text-primary-foreground">Most Popular</span>}
                    <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                    <div className="mt-6 h-12 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.p key={String(price) + yearly} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-4xl font-extrabold text-foreground">
                          {price == null ? "Custom" : `₹${price.toLocaleString("en-IN")}`}{price != null && <span className="text-base font-medium text-muted-foreground">/mo</span>}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-muted-foreground">{price == null ? "Tailored to your team" : yearly ? "billed yearly" : "billed monthly"}</p>
                    <ul className="mt-6 flex-1 space-y-3 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2 text-foreground"><span className="grid size-5 shrink-0 place-items-center rounded-full gradient-wa"><Check className="size-3 text-primary-foreground" /></span>{f}</li>)}</ul>
                    {p.cta === "Talk to Sales"
                      ? <button onClick={openDemo} className={btnSecondary + " mt-8"}>{p.cta}</button>
                      : <a href={WA.signupUrl} className={(pop ? btnPrimary : btnSecondary) + " mt-8"}>{p.cta}</a>}
                  </Fade>
                );
              })}
            </div>
            <p className="mt-8 flex items-start justify-center gap-2 text-center text-sm text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" />{WA.pricing.guarantee}</p>

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

            <div className="mt-8 text-center">
              <button onClick={() => setCompare(!compare)} aria-expanded={compare} className="inline-flex items-center gap-1 font-semibold text-primary">See full plan comparison <ArrowRight className={`size-4 transition-transform ${compare ? "rotate-90" : ""}`} /></button>
            </div>
            <AnimatePresence>
              {compare && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="bg-muted"><tr><th className="p-3 text-left font-semibold text-foreground">Feature</th>{WA.pricing.plans.map((p) => <th key={p.name} className="p-3 font-semibold text-foreground">{p.name}</th>)}</tr></thead>
                      <tbody>{WA.pricing.comparison.map((r) => <tr key={r.f} className="border-t border-border"><td className="p-3 text-foreground">{r.f}</td>{r.v.map((v, i) => <td key={i} className="p-3 text-center text-muted-foreground">{v === true ? <Check className="mx-auto size-4 text-primary" /> : v === false ? "—" : v}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              <a href={WA.signupUrl} className="inline-flex items-center justify-center rounded-xl bg-background px-7 py-3.5 font-semibold text-primary transition-transform hover:-translate-y-0.5">Start Free Trial</a>
              <button onClick={openDemo} className="inline-flex items-center justify-center rounded-xl border border-primary-foreground/60 px-7 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">Talk to Sales</button>
            </div>
          </Fade>
        </section>
      </main>

      <footer className="border-t border-border bg-muted">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-7 md:px-6">
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
    </div>
  );
}
