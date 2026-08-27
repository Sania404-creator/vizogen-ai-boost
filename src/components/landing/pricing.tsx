import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCircle2, XCircle } from "lucide-react";
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
  formatInr,
  oneTimeServices,
  planPrice,
  plans as defaultPlans,
  pricingFaqs,
  whatsappLink,
  type BillingCycle,
  type Currency,
  type Plan,
} from "./pricing-data";

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
                ? "gradient-brand text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
            {o.badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-accent-pink/10 text-accent-pink"
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

function OneTimeServices() {
  return (
    <section id="one-time-services" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="No Subscription Needed"
          title="One-Time GMB Services"
          subtitle="Need a quick fix or a fresh setup? These one-time services get your Google Business Profile sorted — no subscription required."
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {oneTimeServices.map((svc, i) => (
            <Reveal key={svc.name} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-glow sm:p-8">
                <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                  {svc.name}
                </h3>
                <div className="mt-4 flex flex-wrap items-end gap-2">
                  <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
                    {formatInr(svc.price)}
                  </span>
                  {svc.priceNote ? (
                    <span className="pb-1.5 text-sm text-muted-foreground">{svc.priceNote}</span>
                  ) : (
                    <span className="pb-1.5 text-sm text-muted-foreground">one-time</span>
                  )}
                </div>

                <div className="my-6 h-px w-full bg-border" />

                <ul className="flex-1 space-y-3">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full gradient-brand">
                        <Check className="size-3 text-primary-foreground" strokeWidth={3} />
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild size="lg" variant="outline" className="mt-8 w-full rounded-full">
                  <a
                    href={whatsappLink(svc.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get This Service
                  </a>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          One-time service prices exclude applicable taxes unless stated otherwise.
        </p>
      </div>
    </section>
  );
}

function SubscriptionPlans({ plans }: { plans: Plan[] }) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [currency, setCurrency] = useState<Currency>("INR");
  const period = billingCycle === "yearly" ? "/year" : "/quarter";

  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[520px] rounded-full bg-brand-2/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Simple, Transparent Pricing"
          title="Subscription Plans"
          subtitle="Pick a plan that scales with your business — switch billing cycle or currency anytime."
        />

        <Reveal className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <PillToggle<BillingCycle>
            value={billingCycle}
            onChange={setBillingCycle}
            options={[
              { value: "quarterly", label: "Quarterly" },
              { value: "yearly", label: "Yearly", badge: "Save more" },
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
          {plans.map((plan, i) => (
            <Reveal
              key={plan.name}
              delay={i * 0.08}
              className={`h-full ${plan.popular ? "order-first lg:order-none" : ""}`}
            >
              <div
                className={`relative flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 sm:p-8 ${
                  plan.popular
                    ? "border-brand/60 shadow-glow lg:scale-[1.05]"
                    : "border-border shadow-soft hover:border-brand/40 hover:shadow-glow"
                }`}
              >
                {plan.popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-pink px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-soft">
                    Most Popular
                  </span>
                ) : null}

                <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>

                <div className="mt-6 flex items-end gap-2">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={`${currency}-${billingCycle}-${plan.name}`}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.18 }}
                      className="font-mono text-4xl font-bold tracking-tight text-foreground"
                    >
                      {planPrice(plan, billingCycle, currency)}
                    </motion.span>
                  </AnimatePresence>
                  <span className="pb-1 text-sm font-medium text-muted-foreground">{period}</span>
                </div>

                <div className="my-6 h-px w-full bg-border" />

                <ul className="flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2.5} />
                      ) : (
                        <XCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" strokeWidth={2.5} />
                      )}
                      <span
                        className={`leading-snug ${
                          f.included ? "text-foreground" : "text-muted-foreground/70"
                        }`}
                      >
                        {f.label}
                      </span>
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
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
          Subscription prices exclude applicable taxes. USD prices are indicative; billing is
          processed in INR.
        </p>

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
      </div>
    </section>
  );
}

export function Pricing({ plans = defaultPlans }: { plans?: Plan[] }) {
  return (
    <>
      <OneTimeServices />
      <SubscriptionPlans plans={plans} />
    </>
  );
}
