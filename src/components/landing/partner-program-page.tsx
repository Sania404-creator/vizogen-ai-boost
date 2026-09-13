import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, HelpCircle, MapPin, Users, Wallet } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { PartnerStatusTracker } from "@/components/site/partner-status-tracker";
import { PARTNER_PROGRAMS, PARTNER_SCOPE, partnerProgramFaqs, type PartnerProgram } from "@/lib/aeo";

const ctaClass =
  "group inline-flex items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]";

export function PartnerProgramPage({ program, h1 }: { program: PartnerProgram; h1: string }) {
  const applyHref = program.applyParam
    ? `/partner-application?program=${encodeURIComponent(program.applyParam)}`
    : "/partner-application";
  const others = PARTNER_PROGRAMS.filter((p) => p.slug !== program.slug);
  const faqs = partnerProgramFaqs(program);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[520px] rounded-full bg-brand/12 blur-3xl"
          />
          <div className="relative mx-auto max-w-4xl px-4 pb-14 text-center sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>{" "}
              /{" "}
              <Link to="/partner" className="hover:text-foreground">
                Partner with us
              </Link>{" "}
              / <span className="text-foreground">{program.name}</span>
            </nav>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {h1}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {program.summary}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={applyHref} className={ctaClass}>
                Apply for {program.name}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/partner"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Compare all three programs
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-4">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Wallet, label: "Commission", value: program.commission },
                { icon: BadgeCheck, label: "Joining fee", value: program.joiningFee },
                { icon: Users, label: "Best for", value: program.bestFor },
              ].map((c) => (
                <Reveal key={c.label}>
                  <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                      <c.icon className="size-3.5" /> {c.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{c.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={program.name}
              title={`What you get as a ${program.name}`}
              subtitle="Every benefit below is included the moment your application is approved."
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {program.benefits.map((b) => (
                <Reveal key={b}>
                  <li className="flex h-full items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm text-foreground shadow-soft">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" />
                    {b}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <MapPin className="size-4 text-primary" /> Who can apply and where
                </h2>
                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Who it's for</dt>
                    <dd className="mt-1 font-medium text-foreground">{PARTNER_SCOPE.audience}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Available in</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {PARTNER_SCOPE.areaServed.join(", ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Minimum payout</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      ₹{PARTNER_SCOPE.minPayout}, paid in {PARTNER_SCOPE.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Review time</dt>
                    <dd className="mt-1 font-medium text-foreground">{PARTNER_SCOPE.reviewTime}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                <HelpCircle className="size-4 text-primary" /> {program.name} FAQs
              </h2>
              <dl className="mt-4 space-y-4">
                {faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <dt className="text-sm font-semibold text-foreground">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <PartnerStatusTracker idPrefix={`pp-${program.slug}`} />
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-lg font-bold text-foreground">Other partner programs</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to={`/partner/${o.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <p className="text-sm font-bold text-foreground">{o.name}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">{o.commission}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    Read more
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
