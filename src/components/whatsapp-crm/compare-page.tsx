import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { WA } from "./config";
import { Nav, Footer, DemoModal, Fade, Pill, BillingToggle, RollingPrice, MetaCharges, yearlySaving, btnPrimary, btnSecondary, ext } from "./kit";
import { WelcomePopup } from "./demos";

type Cell = string | boolean;
function CellView({ v }: { v: Cell }) {
  if (v === true) return <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 400, damping: 14 }} className="mx-auto grid size-6 place-items-center rounded-full gradient-wa"><Check className="size-3.5 text-primary-foreground" aria-label="Included" /></motion.span>;
  if (v === false) return <Minus className="mx-auto size-4 text-muted-foreground/60" aria-label="Not included" />;
  return <span className="font-semibold text-foreground">{v}</span>;
}

export function ComparePage() {
  const [yearly, setYearly] = useState(true);
  const [demo, setDemo] = useState(false);
  const [closed, setClosed] = useState<string[]>([]);
  const [tab, setTab] = useState(1);
  const [faq, setFaq] = useState<number | null>(0);
  const plans = WA.pricing.plans;
  const price = (p: (typeof plans)[number]) => (yearly ? Math.round(p.yearly / 12) : p.monthly);
  return (
    <div className="theme-wa min-h-screen overflow-x-clip font-sans">
      <Nav onDemo={() => setDemo(true)} base="/whatsapp-crm" />
      <main>
        <section className="wa-dots py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <Fade><Pill icon="Scale">Compare Plans</Pill></Fade>
            <Fade delay={0.08}><h1 className="mt-5 text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-5xl">Find the right Vizogen plan for your business</h1></Fade>
            <Fade delay={0.16}><p className="mt-4 text-muted-foreground">Every plan includes the Official WhatsApp API, unlimited messages and broadcasting. Pick by contacts, chatbots, integrations and AI.</p></Fade>
            <Fade delay={0.24} className="mt-8"><BillingToggle yearly={yearly} setYearly={setYearly} /></Fade>
          </div>
        </section>

        {/* Desktop table */}
        <section className="mx-auto hidden max-w-6xl px-6 pb-16 md:block">
          <div className="rounded-3xl border border-border bg-card">
            <div className="sticky top-14 z-30 grid grid-cols-4 gap-4 rounded-t-3xl border-b border-border bg-card/95 p-5 backdrop-blur">
              <div className="self-end text-sm font-semibold text-muted-foreground">Features</div>
              {plans.map((p) => {
                const pop = "popular" in p && p.popular;
                return (
                  <div key={p.name} className={`rounded-2xl p-4 text-center ${pop ? "wa-glow border-2 border-primary bg-secondary" : ""}`}>
                    <p className="font-bold text-foreground">{p.name}</p>
                    <p className="mt-1"><RollingPrice value={price(p)} className="text-2xl font-extrabold text-foreground" /><span className="text-xs text-muted-foreground">/mo</span></p>
                    <p className="text-[11px] text-muted-foreground">{yearly ? `billed ₹${p.yearly.toLocaleString("en-IN")}/yr · save ${yearlySaving(p).percent}%` : "billed monthly"}</p>
                    <a href={WA.app.dashboard} {...ext} className={(pop ? btnPrimary : btnSecondary) + " mt-3 w-full py-2 text-xs"}>Start Free Demo</a>
                  </div>
                );
              })}
            </div>
            {WA.pricing.comparison.map((g) => {
              const isClosed = closed.includes(g.group);
              return (
                <div key={g.group} className="border-b border-border last:border-0">
                  <button onClick={() => setClosed(isClosed ? closed.filter((x) => x !== g.group) : [...closed, g.group])} aria-expanded={!isClosed} className="flex w-full items-center justify-between bg-muted px-5 py-3 text-left text-sm font-bold text-foreground">
                    {g.group}<ChevronDown className={`size-4 transition-transform ${isClosed ? "-rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {!isClosed && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        {g.rows.map((r, i) => (
                          <motion.div key={r.f} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="grid grid-cols-4 items-center gap-4 border-t border-border px-5 py-3.5 text-sm transition-colors hover:bg-secondary/60">
                            <span className="text-foreground">{r.f}</span>
                            {r.v.map((v, j) => <div key={j} className={`text-center ${j === 1 ? "rounded-lg bg-secondary/50 py-1" : ""}`}><CellView v={v} /></div>)}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mobile tabs */}
        <section className="px-4 pb-16 md:hidden">
          <div role="tablist" aria-label="Plans" className="sticky top-14 z-30 grid grid-cols-3 gap-1 rounded-2xl border border-border bg-card p-1">
            {plans.map((p, i) => <button key={p.name} role="tab" aria-selected={tab === i} onClick={() => setTab(i)} className={`rounded-xl py-2 text-sm font-semibold ${tab === i ? "gradient-wa text-primary-foreground" : "text-muted-foreground"}`}>{p.name}</button>)}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (info.offset.x < -60) setTab(Math.min(2, tab + 1)); if (info.offset.x > 60) setTab(Math.max(0, tab - 1)); }}
              className="mt-4 rounded-3xl border border-border bg-card p-5">
              <p className="text-center"><RollingPrice value={price(plans[tab]!)} className="text-3xl font-extrabold text-foreground" /><span className="text-sm text-muted-foreground">/mo</span></p>
              <p className="text-center text-xs text-muted-foreground">{yearly ? `billed ₹${plans[tab]!.yearly.toLocaleString("en-IN")} yearly` : "billed monthly"}</p>
              {WA.pricing.comparison.map((g) => (
                <div key={g.group} className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.group}</p>
                  <ul className="mt-2 divide-y divide-border">{g.rows.map((r) => <li key={r.f} className="flex items-center justify-between gap-3 py-2.5 text-sm"><span className="text-foreground">{r.f}</span><span className="shrink-0 text-right"><CellView v={r.v[tab] ?? false} /></span></li>)}</ul>
                </div>
              ))}
              <a href={WA.app.dashboard} {...ext} className={btnPrimary + " mt-6 w-full"}>Start Free Demo</a>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="mx-auto max-w-6xl px-4 md:px-6"><MetaCharges /></section>

        <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-foreground">Plan FAQs</h2>
          <div className="space-y-3">
            {WA.pricing.faqs.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card">
                <h3><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-foreground">{f.q}<Plus className={`size-5 shrink-0 text-primary transition-transform ${faq === i ? "rotate-45" : ""}`} /></button></h3>
                <AnimatePresence initial={false}>{faq === i && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden"><p className="px-6 pb-4 text-muted-foreground">{f.a}</p></motion.div>}</AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-20 md:px-6">
          <Fade dir="scale" className="mx-auto max-w-5xl rounded-3xl gradient-wa px-6 py-14 text-center">
            <h2 className="text-3xl font-extrabold text-primary-foreground md:text-4xl">Start your free demo</h2>
            <p className="mt-3 text-primary-foreground/90">Go live on the Official WhatsApp API in about 30 minutes.</p>
            <a href={WA.app.dashboard} {...ext} className="mt-7 inline-flex rounded-xl bg-background px-7 py-3.5 font-semibold text-primary">Start Free Demo</a>
          </Fade>
        </section>
      </main>
      <Footer base="/whatsapp-crm" />
      <DemoModal open={demo} onClose={() => setDemo(false)} />
      <WelcomePopup onDemo={() => setDemo(true)} />
    </div>
  );
}
