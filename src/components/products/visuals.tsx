import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Fingerprint, ShoppingCart, MessageCircle, AlertTriangle, PartyPopper } from "lucide-react";
import type { ProductSlug } from "./site.config";

function useTick(ms: number, n: number) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => { if (reduce) { setT(n - 1); return; } const i = setInterval(() => setT((v) => (v + 1) % n), ms); return () => clearInterval(i); }, [ms, n, reduce]);
  return t;
}
const box = "rounded-xl border border-border bg-background p-3";

function Erp() {
  const t = useTick(900, 8);
  const lines = [["Item subtotal", "₹42,000"], ["CGST 9%", "₹3,780"], ["SGST 9%", "₹3,780"], ["IGST", "₹0"], ["Total", "₹49,560"]];
  return (
    <div className="grid gap-3">
      <div className={box}>
        <p className="text-[11px] font-semibold text-muted-foreground">Supply chain</p>
        <div className="relative mt-3 flex justify-between text-[10px] font-semibold text-foreground">
          <div className="absolute inset-x-4 top-2 h-0.5 bg-border" />
          <motion.span className="absolute top-1 size-2.5 rounded-full gradient-wa" animate={{ left: ["4%", "92%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          {["Supplier", "Warehouse", "Dispatch", "Customer"].map((s) => <span key={s} className="relative z-10 flex flex-col items-center gap-1"><span className="size-4 rounded-full border-2 border-primary bg-background" />{s}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className={box}><p className="text-[11px] font-semibold text-muted-foreground">Stock levels</p>
          {[80, 55, 22].map((w, i) => <div key={i} className="mt-2 h-2 rounded-full bg-muted"><motion.div className={`h-2 rounded-full ${w < 30 ? "bg-destructive" : "gradient-wa"}`} initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }} /></div>)}
        </div>
        <div className={box}><p className="text-[11px] font-semibold text-muted-foreground">GST invoice</p>
          {lines.map(([a, b], i) => <motion.div key={a} animate={{ opacity: t > i ? 1 : 0.15 }} className={`mt-1 flex justify-between text-[10px] ${i === 4 ? "font-bold text-foreground" : "text-muted-foreground"}`}><span>{a}</span><span>{b}</span></motion.div>)}
        </div>
      </div>
      <motion.div animate={{ x: t >= 5 ? 0 : 40, opacity: t >= 5 ? 1 : 0 }} className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11px] font-semibold text-foreground"><AlertTriangle className="size-4 text-destructive" />Low stock: Steel bolts M8 (22 left)</motion.div>
    </div>
  );
}

function Hrm() {
  const t = useTick(1000, 8);
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className={box + " grid place-items-center py-5"}>
        <div className="relative grid size-16 place-items-center"><motion.span className="absolute inset-0 rounded-full border-2 border-primary" animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 1.4, repeat: Infinity }} /><Fingerprint className="size-10 text-primary" /></div>
        <motion.p animate={{ opacity: t >= 1 ? 1 : 0 }} className="mt-3 flex items-center gap-1 text-[11px] font-bold text-foreground">Check-in 9:02 AM <Check className="size-3.5 text-primary" /></motion.p>
      </div>
      <div className={box}><p className="text-[11px] font-semibold text-muted-foreground">Attendance</p>
        <div className="mt-2 grid grid-cols-7 gap-1">{Array.from({ length: 28 }).map((_, i) => <motion.span key={i} className={`size-3 rounded-full ${i % 9 === 4 ? "bg-wa-lime" : "bg-primary"}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05, repeat: Infinity, repeatDelay: 5 }} />)}</div>
      </div>
      <div className={box}><p className="text-[11px] font-semibold text-muted-foreground">Leave request · Priya</p><p className="mt-1 text-[10px] text-muted-foreground">12–13 Dec · Casual</p>
        <motion.span animate={{ scale: t === 3 ? 0.9 : 1 }} className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${t >= 3 ? "gradient-wa text-primary-foreground" : "border border-border text-foreground"}`}>{t >= 3 ? "Approved ✓" : "Approve"}</motion.span>
      </div>
      <div className={box}><p className="text-[11px] font-semibold text-muted-foreground">Payroll · Nov</p>
        <motion.span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${t >= 5 ? "bg-primary/15 text-primary" : "gradient-wa text-primary-foreground"}`}>{t >= 5 ? "142 salaries processed ✓" : "Run payroll"}</motion.span>
        <div className="relative h-6">{t >= 5 && [0, 1, 2].map((i) => <motion.span key={i} className="absolute left-2 top-1 h-4 w-3 rounded-sm border border-border bg-card" initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: 30 + i * 20, y: -10, opacity: 0 }} transition={{ duration: 1, delay: i * 0.15 }} />)}</div>
      </div>
    </div>
  );
}

function Commerce() {
  const t = useTick(1000, 8);
  return (
    <div className="relative grid grid-cols-3 gap-2 overflow-hidden">
      {["Sneakers", "Watch", "Bag"].map((p, i) => (
        <div key={p} className={box + " p-2"}><div className="aspect-square rounded-lg bg-muted" /><p className="mt-1 text-[10px] font-semibold text-foreground">{p}</p><p className="text-[10px] text-muted-foreground">₹{(i + 1) * 1299}</p>
          <motion.span animate={{ scale: i === 0 && t === 1 ? 0.88 : 1 }} className="mt-1 block rounded-md gradient-wa py-1 text-center text-[9px] font-bold text-primary-foreground">Add to cart</motion.span></div>
      ))}
      <motion.div animate={{ x: t >= 2 && t < 7 ? "0%" : "110%" }} transition={{ type: "spring", damping: 20 }} className="absolute inset-y-0 right-0 w-1/2 rounded-xl border border-border bg-card p-3 shadow-xl">
        <p className="flex items-center gap-1 text-[11px] font-bold text-foreground"><ShoppingCart className="size-3.5" />Cart · ₹1,299</p>
        {t >= 3 && <div className="mt-2 grid gap-1 text-[10px]">{["UPI", "Card"].map((m, i) => <span key={m} className={`rounded-md border px-2 py-1 ${i === 0 ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}>{m}</span>)}</div>}
        {t >= 5 && <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="mt-2 flex items-center gap-1 text-[11px] font-bold text-primary"><PartyPopper className="size-4" />Order placed</motion.p>}
      </motion.div>
      <div className="col-span-3 flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-[11px]"><span className="text-muted-foreground">Today's revenue</span><span className="font-bold text-foreground">₹{(48200 + (t >= 5 ? 1299 : 0)).toLocaleString("en-IN")}</span></div>
    </div>
  );
}

function Booking() {
  const t = useTick(900, 9);
  const slots = ["10:00", "11:30", "2:00", "4:30"];
  return (
    <div className="grid grid-cols-5 gap-3">
      <div className={box + " col-span-3"}>
        <p className="text-[11px] font-semibold text-muted-foreground">Service</p>
        <div className="mt-1 flex gap-1">{["Haircut", "Facial"].map((s, i) => <span key={s} className={`rounded-full px-2 py-0.5 text-[10px] ${t >= 1 && i === 1 ? "gradient-wa text-primary-foreground" : "border border-border text-foreground"}`}>{s}</span>)}</div>
        <p className="mt-2 text-[11px] font-semibold text-muted-foreground">Date</p>
        <div className="mt-1 grid grid-cols-7 gap-1">{Array.from({ length: 14 }).map((_, i) => <span key={i} className={`grid aspect-square place-items-center rounded text-[9px] ${t >= 2 && i === 9 ? "gradient-wa text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 10}</span>)}</div>
        <p className="mt-2 text-[11px] font-semibold text-muted-foreground">Time</p>
        <div className="mt-1 grid grid-cols-4 gap-1">{slots.map((s, i) => <span key={s} className={`rounded py-0.5 text-center text-[9px] ${t >= 3 && i === 3 ? "bg-primary text-primary-foreground" : "border border-border text-foreground"}`}>{s}</span>)}</div>
      </div>
      <div className={box + " col-span-2"}><p className="text-[11px] font-semibold text-muted-foreground">Staff · Riya</p>
        {[0, 1, 2, 3].map((i) => <motion.div key={i} animate={{ opacity: t >= 4 || i < 2 ? 1 : 0.2 }} className="mt-1.5 h-4 rounded bg-primary/20" />)}
      </div>
      <motion.div animate={{ y: t >= 5 ? 0 : 20, opacity: t >= 5 ? 1 : 0 }} className="col-span-5 flex items-start gap-2 rounded-xl bg-primary/10 px-3 py-2 text-[11px] text-foreground"><MessageCircle className="size-4 shrink-0 text-primary" />Your appointment is confirmed for 4:30 PM</motion.div>
    </div>
  );
}

export default function ProductVisual({ slug }: { slug: ProductSlug }) {
  return slug === "enterprise-erp" ? <Erp /> : slug === "hrm-payroll" ? <Hrm /> : slug === "commerce-cloud" ? <Commerce /> : <Booking />;
}
