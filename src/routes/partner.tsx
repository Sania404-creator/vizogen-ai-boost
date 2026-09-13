import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { ArrowRight, BadgeCheck, Briefcase, Handshake, Rocket, Wallet } from "lucide-react";
import { PartnerStatusTracker } from "@/components/site/partner-status-tracker";
import {
  PARTNER_PROGRAMS,
  PARTNER_SCOPE,
  partnerFaqs,
  partnerJsonLdScripts,
  partnerQuickAnswer,
} from "@/lib/aeo";

const title = "Partner with Vizogen — Affiliate, Prime Plus & White-Label Programs";
const description =
  "Three Vizogen partnership programs for India: Affiliate Partner (20% recurring commission, ₹999 min payout, no joining fee), Prime Plus (up to 30% plus co-branding and city exclusivity) and White-Labelled Partner.";
const canonical = "https://www.vizogen.in/partner";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: partnerJsonLdScripts("program"),
  }),
  component: PartnerPage,
});

const ctaClass =
  "group inline-flex items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]";

function PartnerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[520px] rounded-full bg-brand/12 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-32 left-0 h-[360px] w-[460px] rounded-full bg-brand-2/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Partner Program
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Grow With Vizogen.{" "}
                <span className="text-gradient">Earn With Vizogen.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Join our partner network and earn recurring revenue by bringing
                AI-powered Google Business Profile automation to local
                businesses in your network.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/partner-application" className={ctaClass}>
                  Become a Partner Today
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Program cards */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Three Ways to Partner"
              title="Choose the program that fits you"
              subtitle="Whether you refer occasionally, run a full agency, or want your own branded platform, there's a Vizogen partner track built for your goals."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
              {/* Affiliate */}
              <Reveal>
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift sm:p-9">
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Handshake className="size-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">
                    Affiliate Partner
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Refer businesses to Vizogen and earn a recurring 20% commission
                    on every referral. No joining fees, no targets, no commitments.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-foreground">
                    {[
                      "20% recurring commission on every referral",
                      "Minimum payout of just ₹999",
                      "No joining fees — start immediately",
                      "Ready-made creatives & referral dashboard",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/partner-application"
                    className={`${ctaClass} mt-8 w-full sm:w-auto`}
                  >
                    Become an Affiliate Partner
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              {/* Prime Plus */}
              <Reveal delay={0.08}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/30 bg-card p-7 shadow-glow sm:p-9">
                  <span className="absolute right-5 top-5 rounded-full gradient-brand px-3 py-1 text-xs font-bold text-primary-foreground">
                    Exclusive
                  </span>
                  <div className="grid size-12 place-items-center rounded-xl gradient-brand text-primary-foreground">
                    <Rocket className="size-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">
                    Prime Plus Partner
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Earn higher recurring commissions across every revenue stream,
                    up to 30%. Built for agencies and consultants who want exclusive
                    rights, co-branding, and direct client leads from Vizogen.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-foreground">
                    {[
                      "Up to 30% recurring commission",
                      "Agency co-branding & dedicated Partner Growth Manager",
                      "Direct inbound client leads forwarded from Vizogen",
                      "Exclusive rights in your city",
                      "Priority support, faster onboarding & early feature access",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/partner-application"
                    search={{ program: "Prime Plus Partnership" }}
                    className={`${ctaClass} mt-8 w-full sm:w-auto`}
                  >
                    Apply for Prime Plus
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              {/* White-Labelled Partner */}
              <Reveal delay={0.16}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift sm:p-9">
                  <span className="absolute right-5 top-5 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-primary">
                    Agency
                  </span>
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="size-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">
                    White-Labelled Partner
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Best for agencies who want to sell Vizogen under their own brand
                    name. Host the platform on your custom domain, logo, and pricing
                    while Vizogen runs the backend.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-foreground">
                    {[
                      "Your own custom domain, logo & design",
                      "Set your own customer pricing & billing",
                      "Collect client payments directly",
                      "Vizogen handles hosting, engineering & API stability",
                      "Custom pricing based on your client volume",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/partner-application"
                    search={{ program: "White-Labelled Partner" }}
                    className={`${ctaClass} mt-8 w-full sm:w-auto`}
                  >
                    Become a White-Label Partner
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Track application status */}
        <section id="track-status" className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Application Tracking"
              title="Track your partnership program status"
              subtitle="Already applied? Enter your reference code and the email you applied with to see exactly where your application stands."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
              <Reveal>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    How tracking works
                  </h3>
                  <ol className="mt-5 space-y-4 text-sm text-muted-foreground">
                    {[
                      "Submit your application — you get a reference code instantly, plus a copy by email.",
                      "Our partnerships team moves you from Received to Under review within 2 business days.",
                      "Check back here anytime with your code and email to see Approved or Not selected.",
                    ].map((t, i) => (
                      <li key={t} className="flex gap-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full gradient-brand text-xs font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ol>
                  <Link
                    to="/partner-application"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Haven't applied yet? Start your application
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </Reveal>
              <PartnerStatusTracker idPrefix="partner-page" />
            </div>
          </div>
        </section>

        {/* Partner perks */}
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Top Perks for Our Partners"
              title="Everything you need to grow faster"
              subtitle="From daily skill training to sponsored travel, our partners get more than a commission plan."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
              {[
                {
                  title: "Free Trainings",
                  body: "Skill Up With Experts Every Day. Access ongoing training from top mentors to sharpen your freelancing and enrollment skills — at zero cost.",
                },
                {
                  title: "National & International Trips",
                  body: "Earn. Achieve. Travel The World. Hit performance goals and qualify for fully sponsored national and international trips with fellow achievers.",
                },
                {
                  title: "Events & Recognition",
                  body: "Shine On Stage With The Best. Be part of high-energy partner events, award nights, and community meetups where your success is celebrated.",
                },
              ].map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft sm:p-9">
                    <h3 className="font-display text-xl font-bold text-foreground">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA band */}
        <section className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl gradient-brand px-6 py-12 text-primary-foreground sm:px-12 sm:py-16 lg:px-16">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                />
                <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                  <div className="max-w-xl">
                    <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
                      <Wallet className="size-7 shrink-0" />
                      Ready to build a new revenue stream?
                    </h3>
                    <p className="mt-3 text-primary-foreground/80">
                      Apply in under 2 minutes — our team reviews every
                      application and gets back within 48 hours.
                    </p>
                  </div>
                  <Link
                    to="/partner-application"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy shadow-soft transition-transform hover:scale-[1.02]"
                  >
                    Become Partner Today
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
