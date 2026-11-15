import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, CheckCheck, Pause, Play, X, Sparkles, MousePointer2, Upload, Send, Bot, BadgeCheck, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { WA } from "./config";
import { btnPrimary, btnSecondary, ext, field, PhoneInput, submitLead, Fade, Heading } from "./kit";
import mark from "@/assets/vizogen-ai-v-logo.png.asset.json";

/* ---------- helpers ---------- */
function useTicker(running: boolean, ms = 100, max = 80) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((x) => (x + 1) % max), ms);
    return () => clearInterval(id);
  }, [running, ms, max]);
  return [t, setT] as const;
}
const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
const lerp = (t: number, a: number, b: number, to: number) => (t <= a ? 0 : t >= b ? to : ((t - a) / (b - a)) * to);

export function Confetti({ fire }: { fire: number }) {
  const reduce = useReducedMotion();
  if (!fire || reduce) return null;
  return (
    <div aria-hidden key={fire} className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span key={i} className={`absolute left-1/2 top-1/3 size-2 rounded-sm ${i % 3 === 0 ? "bg-wa-lime" : i % 3 === 1 ? "bg-primary" : "bg-accent"}`}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: Math.cos((i / 24) * Math.PI * 2) * (80 + (i % 5) * 25), y: Math.sin((i / 24) * Math.PI * 2) * (60 + (i % 4) * 20) + 60, opacity: 0, rotate: 360 }}
          transition={{ duration: 1.4, ease: "easeOut" }} />
      ))}
    </div>
  );
}

/* ---------- CountdownTimer ---------- */
function left(to: string) { const d = new Date(to).getTime() - Date.now(); return Number.isFinite(d) ? Math.max(0, d) : 0; }
export function hasRealDeadline() { return !!WA.offer.endsAt && left(WA.offer.endsAt) > 0; }
export function CountdownTimer({ to = WA.offer.endsAt, compact = false }: { to?: string; compact?: boolean }) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => { if (!to) return; setMs(left(to)); const id = setInterval(() => setMs(left(to)), 1000); return () => clearInterval(id); }, [to]);
  if (!to || ms === null || ms <= 0) return null;
  const parts = [["days", Math.floor(ms / 864e5)], ["hrs", Math.floor(ms / 36e5) % 24], ["mins", Math.floor(ms / 6e4) % 60], ["secs", Math.floor(ms / 1e3) % 60]] as const;
  return (
    <div className="flex items-center gap-1.5" role="timer" aria-label="Offer ends in">
      {parts.map(([l, v]) => (
        <div key={l} className={`text-center ${compact ? "" : "min-w-12"}`}>
          <div className={`relative overflow-hidden rounded-lg bg-foreground font-mono font-bold text-background ${compact ? "px-1.5 py-0.5 text-xs" : "px-2 py-1.5 text-lg"}`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v} className="block" initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }} transition={{ duration: 0.3 }}>{String(v).padStart(2, "0")}</motion.span>
            </AnimatePresence>
          </div>
          {!compact && <span className="text-[10px] font-semibold uppercase text-muted-foreground">{l}</span>}
        </div>
      ))}
    </div>
  );
}

/* ---------- WhatsAppPhone ---------- */
export type Msg = { from: "user" | "bot"; text: ReactNode; badge?: string };
export function WhatsAppPhone({ title = "Vizogen Store", msgs, typing, footer, className = "" }: { title?: string; msgs: Msg[]; typing?: boolean; footer?: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[290px] rounded-[2.3rem] border-[7px] border-foreground bg-foreground shadow-2xl ${className}`}>
      <div className="overflow-hidden rounded-[1.8rem] bg-muted">
        <div className="flex items-center gap-2 gradient-wa px-4 py-3 text-sm font-semibold text-primary-foreground">
          <img src={mark.url} alt="" className="size-6 rounded-full bg-background p-0.5" width={24} height={24} />
          <span className="truncate">{title}</span><BadgeCheck className="size-4 shrink-0" />
        </div>
        <div className="flex h-[330px] flex-col justify-end gap-1.5 overflow-hidden p-2.5 text-[11px]">
          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div key={i} layout initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                className={m.from === "user" ? "max-w-[85%] rounded-xl rounded-tl-sm bg-card px-2.5 py-1.5 text-foreground shadow-sm" : "ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-accent px-2.5 py-1.5 text-accent-foreground shadow-sm"}>
                {m.text}
                <span className="mt-0.5 flex items-center justify-end gap-1 text-[9px] opacity-70">{m.badge && <span className="rounded bg-primary px-1 font-bold text-primary-foreground">{m.badge}</span>}{m.from === "bot" && <CheckCheck className="size-3 text-primary" />}</span>
              </motion.div>
            ))}
            {typing && <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-fit gap-1 rounded-xl bg-card px-3 py-2 shadow-sm">{[0, 1, 2].map((i) => <span key={i} className="wa-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 0.18}s` }} />)}</motion.div>}
          </AnimatePresence>
        </div>
        {footer}
      </div>
    </div>
  );
}

/* ---------- DemoPlayer scenes ---------- */
function Cursor({ x, y, click }: { x: string; y: string; click?: boolean }) {
  return (
    <motion.div aria-hidden className="pointer-events-none absolute z-20" animate={{ left: x, top: y, scale: click ? 0.85 : 1 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
      <MousePointer2 className="size-5 fill-foreground text-background drop-shadow" />
    </motion.div>
  );
}

function BroadcastScene({ t }: { t: number }) {
  const step = t < 15 ? 0 : t < 30 ? 1 : t < 42 ? 2 : 3;
  const audience = lerp(t, 30, 42, 3572);
  return (
    <div className="relative grid h-full gap-4 p-4 text-xs sm:grid-cols-2 sm:p-6">
      <div className="space-y-3">
        <div className={`rounded-xl border p-3 transition-colors ${step >= 0 ? "border-primary bg-secondary" : "border-border bg-card"}`}>
          <p className="flex items-center gap-2 font-semibold text-foreground"><Upload className="size-4 text-primary" />1. Upload contacts</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full gradient-wa transition-all" style={{ width: `${lerp(t, 2, 14, 100)}%` }} /></div>
          <p className="mt-1 text-muted-foreground">{t > 14 ? "customers_diwali.csv · 3,572 rows ✓" : "Uploading customers_diwali.csv…"}</p>
        </div>
        <div className={`rounded-xl border p-3 ${step >= 1 ? "border-primary bg-secondary" : "border-border bg-card opacity-60"}`}>
          <p className="font-semibold text-foreground">2. Pick approved template</p>
          <div className="mt-2 flex flex-wrap gap-1.5">{["diwali_offer", "cart_reminder", "new_arrivals"].map((n, i) => <span key={n} className={`rounded-md px-2 py-1 ${step >= 1 && i === 0 && t > 22 ? "gradient-wa text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</span>)}</div>
        </div>
        <div className={`rounded-xl border p-3 ${step >= 2 ? "border-primary bg-secondary" : "border-border bg-card opacity-60"}`}>
          <p className="font-semibold text-foreground">3. Audience</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{fmt(audience)} <span className="text-xs font-medium text-muted-foreground">contacts</span></p>
        </div>
        <button tabIndex={-1} className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-bold ${step >= 3 ? "gradient-wa text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Send className="size-4" />{step >= 3 ? "Sending…" : "Send broadcast"}</button>
      </div>
      <div className="grid content-start gap-3">
        {[["Delivered", lerp(t, 44, 60, 3501)], ["Read", lerp(t, 48, 68, 3286)], ["Clicked", lerp(t, 54, 74, 752)]].map(([l, v]) => (
          <div key={l as string} className="rounded-xl border border-border bg-card p-3">
            <div className="flex justify-between"><span className="text-muted-foreground">{l}</span><span className="font-bold text-foreground">{fmt(v as number)}</span></div>
            <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full gradient-wa transition-all duration-100" style={{ width: `${((v as number) / 3572) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <Cursor x={step === 0 ? "20%" : step === 1 ? "18%" : step === 2 ? "30%" : "40%"} y={step === 0 ? "18%" : step === 1 ? "40%" : step === 2 ? "58%" : "84%"} click={t % 15 > 12} />
    </div>
  );
}

function AIAgentScene({ t }: { t: number }) {
  const prompt = "Reply to customers about order status in Hinglish";
  const reply = "Namaste! 🙏 Aapka order #4821 ship ho gaya hai, kal tak deliver ho jayega. Track: vzg.in/t/4821";
  const typed = prompt.slice(0, Math.floor(lerp(t, 0, 18, prompt.length)));
  const written = reply.slice(0, Math.floor(lerp(t, 22, 46, reply.length)));
  const msgs: Msg[] = [];
  if (t > 50) msgs.push({ from: "user", text: "Bhai mera order kab aayega?" });
  if (t > 58) msgs.push({ from: "bot", text: reply, badge: "Bot replied · 0.4s" });
  return (
    <div className="grid h-full items-center gap-4 p-4 text-xs sm:grid-cols-2 sm:p-6">
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Sparkles className="size-4 text-primary" />Vizogen AI Studio</p>
        <div className="rounded-xl border border-primary bg-card p-3 font-mono text-foreground">{typed}<span className="wa-dot ml-0.5 inline-block h-3 w-0.5 bg-primary align-middle" /></div>
        <div className="min-h-[96px] rounded-xl border border-border bg-secondary p-3 text-foreground"><p className="mb-1 font-semibold text-primary">AI draft</p>{written || <span className="text-muted-foreground">Waiting for prompt…</span>}</div>
        <div className="flex gap-2">{["Hinglish", "Friendly", "Order status"].map((c) => <span key={c} className="rounded-full bg-accent px-2 py-1 text-accent-foreground">{c}</span>)}</div>
      </div>
      <WhatsAppPhone title="Luxe Living" msgs={msgs} typing={t > 52 && t <= 58} className="scale-90" />
    </div>
  );
}

function FlowScene({ t }: { t: number }) {
  const nodes = [
    { x: 8, y: 12, label: "Trigger: “Hi”", main: true },
    { x: 38, y: 40, label: "Welcome + buttons" },
    { x: 8, y: 72, label: "💳 Payment link" },
    { x: 68, y: 72, label: "👤 Human agent" },
    { x: 68, y: 12, label: "🏷 Tag: New lead" },
  ];
  const edges = [[0, 1], [1, 2], [1, 3], [0, 4]];
  const dot = Math.floor(lerp(t, 40, 76, 3));
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden wa-dots">
      <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map(([a, b], i) => {
          const A = nodes[a!]!, B = nodes[b!]!;
          return <motion.line key={i} x1={A.x + 12} y1={A.y + 6} x2={B.x + 12} y2={B.y + 6} className="stroke-primary" strokeWidth="0.6" strokeDasharray="2 1.5" initial={{ pathLength: 0 }} animate={{ pathLength: t > 18 + i * 5 ? 1 : 0 }} transition={{ duration: 0.6 }} />;
        })}
      </svg>
      {nodes.map((n, i) => (
        <motion.div key={n.label} className={`absolute w-[26%] min-w-[96px] rounded-xl border px-2 py-2 text-center text-[10px] font-semibold shadow-md sm:text-xs ${n.main ? "gradient-wa border-transparent text-primary-foreground" : "border-border bg-card text-foreground"} ${dot === i - 0 && t > 40 ? "ring-2 ring-wa-lime" : ""}`}
          style={{ left: `${n.x}%`, top: `${n.y}%` }} initial={{ y: -40, opacity: 0 }} animate={t > i * 3 ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
          {n.label}
        </motion.div>
      ))}
      {t > 40 && <motion.div className="absolute z-10 rounded-full bg-wa-lime px-2 py-0.5 text-[10px] font-bold text-foreground shadow" animate={{ left: `${nodes[Math.min(dot, 2)]!.x + 4}%`, top: `${nodes[Math.min(dot, 2)]!.y - 6}%` }} transition={{ duration: 0.8 }}>“Hi” ✉</motion.div>}
      <span className="absolute bottom-3 right-3 rounded-full bg-card px-3 py-1 text-[10px] font-semibold text-primary shadow">{t > 40 ? "Test message running…" : "Building flow…"}</span>
    </div>
  );
}

function PaymentScene({ t, onPaid }: { t: number; onPaid: () => void }) {
  const fired = useRef(false);
  useEffect(() => { if (t > 62 && !fired.current) { fired.current = true; onPaid(); } if (t < 5) fired.current = false; }, [t, onPaid]);
  const msgs: Msg[] = [{ from: "user", text: "Show me the bestsellers" }];
  if (t > 8) msgs.push({ from: "bot", text: <div className="grid grid-cols-3 gap-1">{[["👟", "₹2,499"], ["🧢", "₹799"], ["🎒", "₹1,999"]].map(([e, p], i) => <div key={p} className={`rounded-md bg-card p-1 text-center text-foreground ${t > 22 && i === 0 ? "ring-2 ring-primary" : ""}`}><div className="text-lg">{e}</div><div className="text-[9px] font-bold">{p}</div></div>)}</div> });
  if (t > 24) msgs.push({ from: "user", text: "Buy 👟 Runner Pro" });
  if (t > 32) msgs.push({ from: "bot", text: <div className="rounded-lg bg-card p-2 text-foreground"><p className="font-bold">Review & pay · ₹2,499</p><div className="mt-1 grid gap-1">{["UPI", "Card", "Net Banking"].map((m, i) => <span key={m} className={`rounded px-2 py-0.5 ${t > 46 && i === 0 ? "gradient-wa text-primary-foreground" : "bg-muted"}`}>{m}</span>)}</div></div> });
  if (t > 62) msgs.push({ from: "bot", text: <span className="font-bold">Paid ₹2,499 ✓ Order #5120 confirmed</span>, badge: "UPI" });
  return <div className="grid h-full place-items-center p-4"><WhatsAppPhone title="Stride Shoes" msgs={msgs} typing={(t > 4 && t <= 8) || (t > 28 && t <= 32)} /></div>;
}

function AnalyticsScene({ t }: { t: number }) {
  const bars = [42, 58, 51, 76, 64, 88, 96];
  return (
    <div className="relative grid h-full gap-3 p-4 text-xs sm:p-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Revenue this week", "₹" + fmt(lerp(t, 0, 30, 2500000))], ["Broadcast sent", fmt(lerp(t, 4, 30, 3572))], ["Clicked", fmt(lerp(t, 8, 34, 752))], ["Orders", fmt(lerp(t, 10, 36, 418))]].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-border bg-card p-3"><p className="text-muted-foreground">{l}</p><p className="mt-1 text-lg font-extrabold text-foreground">{v}</p></div>
        ))}
      </div>
      <div className="flex h-40 items-end gap-2 rounded-xl border border-border bg-card p-4">
        {bars.map((h, i) => <motion.div key={i} className="flex-1 rounded-t-md gradient-wa" initial={{ height: 0 }} animate={{ height: t > 6 + i * 3 ? `${h}%` : "0%" }} transition={{ duration: 0.6 }} />)}
      </div>
      <AnimatePresence>{t > 44 && (
        <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-4 top-4 flex items-center gap-2 rounded-xl border border-primary bg-card px-3 py-2 shadow-xl">
          <span className="grid size-6 place-items-center rounded-full gradient-wa"><Check className="size-3.5 text-primary-foreground" /></span><span className="font-semibold text-foreground">New order · ₹2,499</span>
        </motion.div>)}</AnimatePresence>
    </div>
  );
}

const TABS = ["Broadcast", "AI Agent", "Chatbot Flow", "Payments", "Analytics"] as const;

/* ---------- DemoPlayer ---------- */
export function DemoPlayer({ only }: { only?: (typeof TABS)[number] }) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(only ? TABS.indexOf(only) : 0);
  const [playing, setPlaying] = useState(!reduce);
  const [hover, setHover] = useState(false);
  const [boom, setBoom] = useState(0);
  const [t, setT] = useTicker(playing && !hover, 100, 80);
  useEffect(() => { if (reduce) { setPlaying(false); setT(79); } }, [reduce, setT]);
  useEffect(() => { if (t === 79 && !only && playing && !hover) setTab((x) => (x + 1) % TABS.length); }, [t, only, playing, hover]);
  const pick = (i: number) => { setTab(i); setT(0); };
  const paid = useCallback(() => setBoom((b) => b + 1), []);
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-2xl" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="flex items-center gap-1.5 border-b border-border bg-muted px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive/60" /><span className="size-2.5 rounded-full bg-wa-lime" /><span className="size-2.5 rounded-full bg-primary" />
        <span className="ml-3 truncate text-xs font-semibold text-muted-foreground">app.vizogen.in · {TABS[tab]}</span>
        <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause demo" : "Play demo"} className="ml-auto grid size-7 place-items-center rounded-full bg-card text-foreground shadow-sm">{playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}</button>
      </div>
      {!only && (
        <div role="tablist" aria-label="Demo" className="flex gap-1 overflow-x-auto border-b border-border px-2 py-2">
          {TABS.map((l, i) => (
            <button key={l} role="tab" aria-selected={tab === i} onClick={() => pick(i)} className={`relative shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${tab === i ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {tab === i && <motion.span layoutId="demo-tab" className="absolute inset-0 -z-0 rounded-lg gradient-wa" />}
              <span className="relative">{l}</span>
            </button>
          ))}
        </div>
      )}
      <div className="h-0.5 bg-muted"><div className="h-full gradient-wa transition-[width] duration-100" style={{ width: `${(t / 79) * 100}%` }} /></div>
      <div className="relative min-h-[420px] bg-background">
        {tab === 0 && <BroadcastScene t={t} />}
        {tab === 1 && <AIAgentScene t={t} />}
        {tab === 2 && <FlowScene t={t} />}
        {tab === 3 && <PaymentScene t={t} onPaid={paid} />}
        {tab === 4 && <AnalyticsScene t={t} />}
        <Confetti fire={boom} />
      </div>
    </div>
  );
}

/* ---------- Try it yourself ---------- */
const CASES = {
  "D2C store": { greet: "Hi! 👋 Welcome to {b}. Looking for something special today?", opts: ["Bestsellers", "New arrivals", "Track order"], pick: "Bestsellers", done: "Order #2041 placed · ₹1,899 ✓", kind: "order", value: 1899 },
  "Real estate": { greet: "Hello from {b} 🏡 Which property type are you looking for?", opts: ["2 BHK", "3 BHK", "Villa"], pick: "3 BHK", done: "Site visit booked · Sat 11:00 AM ✓", kind: "booking", value: 0 },
  Clinic: { greet: "Welcome to {b} 🩺 How can we help you today?", opts: ["Book appointment", "Reports", "Timings"], pick: "Book appointment", done: "Appointment confirmed · Tomorrow 5:30 PM ✓", kind: "booking", value: 500 },
  Coaching: { greet: "Hi! Thanks for contacting {b} 📚 Which course interests you?", opts: ["NEET", "JEE", "Spoken English"], pick: "JEE", done: "Demo class booked · Mon 6:00 PM ✓", kind: "booking", value: 0 },
} as const;
type CaseKey = keyof typeof CASES;

export function TryItDemo() {
  const [c, setC] = useState<CaseKey>("D2C store");
  const [biz, setBiz] = useState("");
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!run) return;
    setStep(0);
    let i = 0;
    const id = setInterval(() => { i++; setStep(i); if (i >= 6) clearInterval(id); }, 1100);
    return () => clearInterval(id);
  }, [run]);
  const cfg = CASES[c];
  const name = biz.trim() || "Your Business";
  const msgs: Msg[] = [];
  if (run) {
    if (step >= 0) msgs.push({ from: "user", text: "Hi" });
    if (step >= 1) msgs.push({ from: "bot", text: <>{cfg.greet.replace("{b}", name)}<div className="mt-1.5 flex flex-wrap gap-1">{cfg.opts.map((o) => <span key={o} className={`rounded-md px-2 py-0.5 ${step >= 2 && o === cfg.pick ? "gradient-wa text-primary-foreground" : "bg-card text-foreground"}`}>{o}</span>)}</div></> });
    if (step >= 2) msgs.push({ from: "user", text: cfg.pick });
    if (step >= 3) msgs.push({ from: "bot", text: cfg.kind === "order" ? "Great pick! Pay securely in chat 💳 UPI · Card · Net Banking" : "Perfect! Choose a slot: Today 5 PM · Tomorrow 11 AM" });
    if (step >= 4) msgs.push({ from: "user", text: cfg.kind === "order" ? "Paid via UPI" : "Tomorrow works" });
    if (step >= 5) msgs.push({ from: "bot", text: <span className="font-bold">{cfg.done}</span>, badge: "Auto" });
  }
  function go(e: FormEvent) { e.preventDefault(); setRun((r) => r + 1); }
  return (
    <div className="grid items-center gap-8 rounded-[28px] border border-border bg-secondary p-5 md:grid-cols-[1fr_auto_1fr] md:p-8">
      <form onSubmit={go} className="space-y-4">
        <p className="text-lg font-extrabold text-foreground">Try it yourself</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Use case">
          {(Object.keys(CASES) as CaseKey[]).map((k) => <button type="button" role="radio" aria-checked={c === k} key={k} onClick={() => setC(k)} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${c === k ? "gradient-wa text-primary-foreground" : "border border-border bg-card text-foreground"}`}>{k}</button>)}
        </div>
        <input value={biz} onChange={(e) => setBiz(e.target.value)} maxLength={40} placeholder="Your business name" aria-label="Business name" className={field} />
        <button className={btnPrimary + " w-full"}><Play className="size-4" />Play my demo</button>
      </form>
      <WhatsAppPhone title={name} msgs={msgs} typing={run > 0 && step < 5 && step % 2 === 0 && step > 0} />
      <div className="space-y-3">
        {[["New lead", run ? "+1" : "0"], [cfg.kind === "order" ? "Order placed" : "Booking", step >= 5 ? "1 ✓" : "—"], ["Revenue", step >= 5 && cfg.value ? `₹${cfg.value.toLocaleString("en-IN")}` : "₹0"]].map(([l, v]) => (
          <motion.div key={String(l) + String(v)} initial={{ scale: 0.95, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">{String(l)}</span><span className="text-lg font-extrabold text-foreground">{String(v)}</span>
          </motion.div>
        ))}
        <AnimatePresence>{step >= 5 && (
          <motion.a initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} href={WA.app.dashboard} {...ext} className={btnPrimary + " w-full"}>Get this live in 30 minutes → Start Free Demo</motion.a>
        )}</AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Demo section (home + offer) ---------- */
export function DemoSection({ onDemo }: { onDemo: () => void }) {
  return (
    <section id="demo" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl space-y-10 px-4 md:px-6">
        <Heading icon="PlayCircle" eyebrow="Live product demo" title="See Vizogen in action" sub="Real product flows, playing live — hover to pause, or pick a tab." />
        <Fade><DemoPlayer /></Fade>
        <Fade><TryItDemo /></Fade>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href={WA.app.dashboard} {...ext} className={btnPrimary}>Start Free Demo</a>
          <button onClick={onDemo} className={btnSecondary}>Join Live Demo</button>
        </div>
        <VideoBlock />
      </div>
    </section>
  );
}

/* ---------- Video lightbox ---------- */
function isYouTube(u: string) { return /youtube\.com|youtu\.be/.test(u); }
export function VideoBlock({ url = WA.videoUrl }: { url?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open]);
  if (!url) return null;
  return (
    <>
      <Fade className="relative grid aspect-video place-items-center overflow-hidden rounded-[28px] gradient-wa">
        <button onClick={() => setOpen(true)} aria-label="Play product walkthrough" className="grid size-20 place-items-center rounded-full bg-background/90 shadow-2xl transition-transform hover:scale-110"><Play className="size-8 fill-current text-primary" /></button>
        <p className="absolute bottom-6 text-sm font-semibold text-primary-foreground">Product walkthrough</p>
      </Fade>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Product walkthrough" className="fixed inset-0 z-[110] grid place-items-center bg-foreground/80 p-4" onClick={() => setOpen(false)}>
          <button aria-label="Close video" className="absolute right-4 top-4 rounded-full bg-background p-2"><X className="size-5" /></button>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-foreground" onClick={(e) => e.stopPropagation()}>
            {isYouTube(url) ? <iframe title="Product walkthrough" src={url} className="size-full" allow="autoplay; encrypted-media; fullscreen" /> : <video src={url} controls autoPlay className="size-full" />}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Template carousel ---------- */
const SLIDES: { title: string; msg: ReactNode }[] = [
  { title: "Collect payments in chat", msg: <><p className="font-bold">Your order is ready 🛍</p><p>Total ₹2,499 · Pay now to confirm.</p><span className="mt-2 block rounded-md bg-card py-1 text-center font-bold text-primary">💳 Review & pay</span></> },
  { title: "Offer / coupon", msg: <><p className="font-bold">Diwali Dhamaka 🪔</p><p>Flat 20% off sitewide. Use code</p><span className="mt-2 block rounded-md border border-dashed border-primary bg-card py-1 text-center font-mono font-bold text-primary">DIWALI20</span></> },
  { title: "Quick-reply buttons", msg: <><p>Did you like your last order?</p><div className="mt-2 grid gap-1">{["😍 Loved it", "🙂 It was okay", "😕 Need help"].map((b) => <span key={b} className="rounded-md bg-card py-1 text-center font-semibold text-primary">{b}</span>)}</div></> },
  { title: "Product carousel", msg: <div className="flex gap-1.5 overflow-hidden">{["👟 ₹2,499", "🧢 ₹799", "🎒 ₹1,999"].map((p) => <div key={p} className="w-24 shrink-0 rounded-md bg-card p-2 text-center"><p className="text-2xl">{p.split(" ")[0]}</p><p className="font-bold">{p.split(" ")[1]}</p><p className="mt-1 text-primary">Buy</p></div>)}</div> },
  { title: "Multi-item carousel", msg: <><p className="font-bold">Complete the look ✨</p><div className="mt-2 grid grid-cols-2 gap-1">{["👕", "👖", "🧥", "👞"].map((e) => <span key={e} className="rounded-md bg-card py-2 text-center text-xl">{e}</span>)}</div><span className="mt-2 block text-center font-semibold text-primary">View 4 items</span></> },
  { title: "Full catalogue", msg: <><p className="font-bold">Browse our catalogue 📒</p><p>120 products · Tap to shop in WhatsApp</p><span className="mt-2 block rounded-md bg-card py-1 text-center font-bold text-primary">View catalogue</span></> },
];
export function TemplateCarousel() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => { if (hover || reduce) return; const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 4000); return () => clearInterval(id); }, [hover, reduce]);
  const s = SLIDES[i]!;
  return (
    <div className="mx-auto max-w-md" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <WhatsAppPhone title="WhatsApp template" msgs={[{ from: "bot", text: <AnimatePresence mode="wait"><motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{s.msg}</motion.div></AnimatePresence> }]} />
      <div className="mt-5 flex items-center justify-between">
        <button onClick={() => setI((i - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous template" className="grid size-10 place-items-center rounded-full border border-border bg-card"><ChevronLeft className="size-5" /></button>
        <div className="text-center"><p className="font-bold text-foreground">{s.title}</p><p className="text-sm text-muted-foreground">{i + 1} / {SLIDES.length}</p></div>
        <button onClick={() => setI((i + 1) % SLIDES.length)} aria-label="Next template" className="grid size-10 place-items-center rounded-full border border-border bg-card"><ChevronRight className="size-5" /></button>
      </div>
    </div>
  );
}

/* ---------- Welcome popup ---------- */
const SNOOZE = "vz_wa_welcome_dismissed";
const SEEN = "vz_wa_welcome_seen";
function canShow() {
  try {
    if (sessionStorage.getItem(SEEN)) return false;
    const d = Number(localStorage.getItem(SNOOZE) || 0);
    return !d || Date.now() - d > 864e5;
  } catch { return true; }
}
export function WelcomePopup({ onDemo }: { onDemo: () => void }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const show = useCallback(() => { if (!canShow()) return; try { sessionStorage.setItem(SEEN, "1"); } catch { /* ignore */ } setOpen(true); }, []);
  useEffect(() => {
    const t = setTimeout(show, 4000);
    const exit = (e: MouseEvent) => { if (e.clientY <= 0 && window.innerWidth >= 1024) show(); };
    document.addEventListener("mouseout", exit);
    return () => { clearTimeout(t); document.removeEventListener("mouseout", exit); };
  }, [show]);
  const close = useCallback(() => { setOpen(false); try { localStorage.setItem(SNOOZE, String(Date.now())); } catch { /* ignore */ } }, []);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === "Escape" && close(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open, close]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submitLead("lead", { name: String(f.get("name")), phone: String(f.get("phone")), businessType: String(f.get("type")) });
      setDone(true);
      window.open(WA.app.dashboard, "_blank", "noopener");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Something went wrong."); } finally { setBusy(false); }
  }
  const w = WA.welcome;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="theme-wa fixed inset-0 z-[105] flex items-end justify-center bg-foreground/50 backdrop-blur-sm sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <motion.div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl md:p-8"
            initial={{ y: "100%", scale: 1 }} animate={{ y: 0, scale: 1 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
            <div aria-hidden className="wa-blob absolute -right-16 -top-16 size-48 rounded-full gradient-wa opacity-25 blur-2xl" />
            <div aria-hidden className="wa-blob absolute -bottom-16 -left-10 size-40 rounded-full bg-wa-lime opacity-20 blur-2xl [animation-delay:-4s]" />
            <Confetti fire={1} />
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full p-1 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full gradient-wa px-3 py-1 text-xs font-bold text-primary-foreground"><Sparkles className="size-3.5" />{w.badge}</span>
              <h2 id="welcome-title" className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-foreground">{w.title}</h2>
              <ul className="mt-4 space-y-2">{w.benefits.map((b, i) => (
                <li key={b} className="flex items-center gap-2 text-sm text-foreground">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.2, type: "spring" }} className="grid size-5 shrink-0 place-items-center rounded-full gradient-wa"><Check className="size-3 text-primary-foreground" /></motion.span>{b}
                </li>))}</ul>
              {hasRealDeadline() && <div className="mt-4 flex items-center gap-3"><span className="text-xs font-semibold text-muted-foreground">Ends in</span><CountdownTimer /></div>}
              {done ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-6 rounded-2xl bg-secondary p-5 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-full gradient-wa"><Check className="size-6 text-primary-foreground" /></span>
                  <p className="mt-3 font-bold text-foreground">You're in! 🎉</p><p className="text-sm text-muted-foreground">Our team will WhatsApp you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="mt-5 grid gap-3">
                  <input name="name" required minLength={2} maxLength={100} placeholder="Your name" aria-label="Name" className={field} />
                  <PhoneInput />
                  <select name="type" required defaultValue="" aria-label="Business type" className={field}><option value="" disabled>Business type</option>{w.businessTypes.map((b) => <option key={b}>{b}</option>)}</select>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button disabled={busy} className={btnPrimary + " disabled:opacity-60"}>{busy ? "Sending…" : "Start Free Demo"}</button>
                    <button type="button" onClick={() => { close(); onDemo(); }} className={btnSecondary}>Join Live Demo</button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Social-proof toast (real data only) ---------- */
type Signup = { name: string; business: string; minutesAgo: number };
export function ToastProof({ url = WA.recentSignupsUrl }: { url?: string }) {
  const [list, setList] = useState<Signup[]>([]);
  const [i, setI] = useState(-1);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (!url) return;
    fetch(url).then((r) => (r.ok ? r.json() : [])).then((d) => Array.isArray(d) && setList(d.filter((x) => x && x.name))).catch(() => {});
  }, [url]);
  useEffect(() => {
    if (!list.length || closed) return;
    const first = setTimeout(() => setI(0), 6000);
    const id = setInterval(() => setI((x) => (x + 1) % list.length), 20000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [list, closed]);
  useEffect(() => { if (i < 0) return; const h = setTimeout(() => setI(-1), 6000); return () => clearTimeout(h); }, [i]);
  if (!url || !list.length || closed) return null;
  const s = i >= 0 ? list[i] : null;
  return (
    <AnimatePresence>{s && (
      <motion.div initial={{ x: -320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -320, opacity: 0 }} className="fixed bottom-4 left-4 z-[90] flex max-w-xs items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-2xl" role="status">
        <span className="grid size-9 shrink-0 place-items-center rounded-full gradient-wa text-xs font-bold text-primary-foreground">{s.name[0]}</span>
        <p className="text-xs text-foreground"><b>{s.name}</b>, {s.business} · Started free demo · {s.minutesAgo} min ago</p>
        <button onClick={() => setClosed(true)} aria-label="Dismiss" className="text-muted-foreground"><X className="size-4" /></button>
      </motion.div>)}</AnimatePresence>
  );
}

/* ---------- Vizogen AI Studio spotlight ---------- */
export function AIStudioSpotlight() {
  const [t] = useTicker(true, 120, 70);
  const prompt = "Build an agent that answers price questions and books demos";
  return (
    <section id="ai-studio" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <Fade dir="left">
          <span className="inline-flex items-center gap-2 rounded-full gradient-wa px-3 py-1 text-xs font-bold text-primary-foreground"><Sparkles className="size-3.5" />Included in Pro</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">Vizogen AI Studio</h2>
          <p className="mt-4 text-muted-foreground">Describe what you want in plain words. AI Studio builds the agent, trains it on your catalogue and FAQs, and starts auto-replying on WhatsApp — in English, Hindi or Hinglish.</p>
          <ul className="mt-6 space-y-3">{["Prompt-to-agent builder", "Trained on your products, prices and policies", "Auto-reply preview before going live", "Hands over to a human when needed"].map((b) => <li key={b} className="flex gap-3 text-foreground"><Check className="mt-0.5 size-5 shrink-0 text-primary" />{b}</li>)}</ul>
          <a href={WA.links.vizogenAIStudio} {...ext} className={btnPrimary + " mt-8"}><Sparkles className="size-4" />Explore AI Studio</a>
        </Fade>
        <Fade dir="right" className="space-y-3 rounded-[28px] border border-border bg-muted p-5 text-sm">
          <div className="rounded-2xl border border-primary bg-card p-4 font-mono text-xs text-foreground"><span className="text-primary">› </span>{prompt.slice(0, Math.floor(lerp(t, 0, 20, prompt.length)))}</div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {["📚 Knowledge", "🧠 Persona", "⚡ Actions"].map((n, i) => <motion.div key={n} animate={{ opacity: t > 22 + i * 4 ? 1 : 0.3, scale: t > 22 + i * 4 ? 1 : 0.95 }} className="rounded-xl border border-border bg-card p-3 font-semibold text-foreground">{n}</motion.div>)}
          </div>
          <div className="rounded-2xl bg-card p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Bot className="size-4 text-primary" />Auto-reply preview</p>
            <AnimatePresence>{t > 38 && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="w-fit rounded-xl rounded-tl-sm bg-muted px-3 py-2 text-xs text-foreground">What's the price of the Pro plan?</motion.p>}</AnimatePresence>
            <AnimatePresence>{t > 46 && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="ml-auto mt-2 w-fit max-w-[85%] rounded-xl rounded-tr-sm bg-accent px-3 py-2 text-xs text-accent-foreground">Pro is ₹3,999/month with unlimited chatbots and AI Studio. Want me to book a quick demo? 📅</motion.p>}</AnimatePresence>
          </div>
        </Fade>
      </div>
    </section>
  );
}
