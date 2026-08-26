import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, ChevronDown, ShieldCheck, CreditCard, XCircle, Headphones } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./reveal";
import {
  comparisonRows,
  formatPrice,
  plans as defaultPlans,
  pricingFaqs,
  type BillingCycle,
  type Currency,
  type Plan,
} from "./pricing-data";

const trustBadges = [
  { icon: CreditCard, label: "No Credit Card Required" },
  { icon: XCircle, label: "Cancel Anytime" },
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Headphones, label: "24/7 Support" },
];

function PillToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; badge?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-amber-500 text-navy shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
            {o.badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  active ? "bg-navy/15 text-navy" : "bg-amber-500/15 text-amber-600"
                }`}
              >
                {o.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function Pricing({
  plans = defaultPlans,
  condensed = false,
}: {
  plans?: Plan[];
  condensed?: boolean;
}) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [compareOpen, setCompareOpen] = useState(false);

  const period = billingCycle === "yearly" ? "/year" : "/quarter";

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Simple, Transparent Pricing"
          title="Plans That Grow With Your Business"
          subtitle="Choose the plan that fits your business size. Switch billing cycle or currency anytime — no hidden fees."
        />

        <Reveal className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <PillToggle<BillingCycle>
            value={billingCycle}
            onChange={setBillingCycle}
            options={[
              { value: "quarterly", label: "Quarterly" },
              { value: "yearly", label: "Yearly", badge: "Save up to 30%" },
            ]}
          />
          <PillToggle<Currency>
            value={currency}
            onChange={setCurrency}
            options={[
              { value: "INR", label: "₹ INR" },
              { value: "USD", label: "$ USD" },
            ]}
          />
        </Reveal>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const amount = billingCycle === "yearly" ? plan.yearly : plan.quarterly;
            const monthly = Math.round(
              (billingCycle === "yearly" ? plan.yearly / 12 : plan.quarterly / 3),
            );
            return (
              <Reveal
                key={plan.name}
                delay={i * 0.08}
                className={plan.popular ? "order-first lg:order-none" : ""}
              >
                <div
                  className={`group relative flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 sm:p-8 ${
                    plan.popular
                      ? "border-amber-500/70 shadow-[0_20px_60px_-24px_rgba(245,166,35,0.55)] lg:scale-[1.05]"
                      : "border-border shadow-soft hover:border-amber-500/40 hover:shadow-[0_18px_48px_-26px_rgba(245,166,35,0.45)]"
                  }`}
                >
                  {plan.popular ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-navy shadow-soft">
                      Most Popular
                    </span>
                  ) : null}

                  <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {plan.tagline}
                  </p>

                  <div className="mt-6 flex items-end gap-2">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={`${currency}-${billingCycle}-${plan.name}`}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.15 }}
                        className="font-mono text-4xl font-bold tracking-tight text-foreground"
                      >
                        {formatPrice(amount, currency)}
                      </motion.span>
                    </AnimatePresence>
                    <span className="pb-1 text-sm font-medium text-muted-foreground">{period}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {billingCycle === "yearly" ? (
                      <>
                        <span className="mr-1.5 font-mono line-through opacity-60">
                          {formatPrice(plan.quarterly * 4, currency)}
                        </span>
                        billed quarterly — that's like paying{" "}
                        <span className="font-mono font-semibold text-foreground">
                          {formatPrice(monthly, currency)}
                        </span>
                        /month
                      </>
                    ) : (
                      <>
                        That's{" "}
                        <span className="font-mono font-semibold text-foreground">
                          {formatPrice(monthly, currency)}
                        </span>
                        /month
                      </>
                    )}
                  </p>

                  <div className="my-6 h-px w-full bg-border" />

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-amber-500" strokeWidth={2.5} />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    className={`mt-8 w-full rounded-full ${
                      plan.popular ? "gradient-brand shadow-soft hover:opacity-95" : ""
                    }`}
                  >
                    <Link to="/demo">{plan.cta}</Link>
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-muted-foreground">
            All prices exclude applicable taxes. Prices shown in USD are approximate and billed in
            INR at checkout.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground"
              >
                <b.icon className="size-4 text-amber-500" strokeWidth={2} />
                {b.label}
              </span>
            ))}
          </div>
        </Reveal>

        {condensed ? (
          <Reveal className="mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/pricing">See full pricing & feature comparison →</Link>
            </Button>
          </Reveal>
        ) : (
          <>
            <Reveal className="mt-14">
              <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <button
                  type="button"
                  onClick={() => setCompareOpen((v) => !v)}
                  aria-expanded={compareOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-bold text-foreground">
                    Compare all features
                  </span>
                  <ChevronDown
                    className={`size-5 text-muted-foreground transition-transform duration-200 ${
                      compareOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {compareOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="overflow-x-auto border-t border-border">
                        <table className="w-full min-w-[560px] text-sm">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                                Feature
                              </th>
                              {plans.map((p) => (
                                <th
                                  key={p.name}
                                  className="px-4 py-3 text-center font-bold text-foreground"
                                >
                                  {p.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonRows.map((row) => (
                              <tr key={row.label} className="border-t border-border/70">
                                <td className="px-6 py-3 text-left text-foreground">{row.label}</td>
                                {row.values.map((v, idx) => (
                                  <td key={idx} className="px-4 py-3 text-center">
                                    {typeof v === "boolean" ? (
                                      v ? (
                                        <Check
                                          className="mx-auto size-4 text-amber-500"
                                          strokeWidth={2.5}
                                        />
                                      ) : (
                                        <Minus className="mx-auto size-4 text-muted-foreground/50" />
                                      )
                                    ) : (
                                      <span className="text-muted-foreground">{v}</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal className="mx-auto mt-16 max-w-3xl">
              <h3 className="text-center font-display text-2xl font-bold text-foreground">
                Pricing questions
              </h3>
              <Accordion type="single" collapsible className="mt-6 w-full">
                {pricingFaqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`price-faq-${i}`} className="border-border/70">
                    <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
