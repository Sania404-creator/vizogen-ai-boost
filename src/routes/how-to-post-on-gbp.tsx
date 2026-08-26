import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  Camera,
  Gift,
  Heart,
  HelpCircle,
  Megaphone,
  Newspaper,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";

const title = "How to Post on Google Business Profile — Vizogen";
const description =
  "Publish and schedule Google Business Profile posts with Vizogen: pick the Google platform, generate AI content, preview it live and post or schedule for local peak hours.";

export const Route = createFileRoute("/how-to-post-on-gbp")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowToPostOnGbp,
});

const steps = [
  {
    n: "01",
    title: "Select the Google Platform",
    desc: "In the 'Post Management' dashboard, look at the platform selector at the top. Click the 'G' icon (Google Business Profile) to ensure your post is optimized specifically for local search.",
    cta: "Open Post Management",
  },
  {
    n: "02",
    title: "Generate Content",
    desc: "Use the 'Auto Post' tab to let AI write your GBP update. Type your business offer or news in the prompt box. GBP posts work best when they're clear and actionable.",
  },
  {
    n: "03",
    title: "Verify the Live Preview",
    desc: "Check the 'Live Preview' panel on the right side. This shows exactly how your business update will appear to customers searching on Google Maps and Google Search.",
  },
  {
    n: "04",
    title: "Instant 'Post to GBP'",
    desc: "Ready to go live? Click the amber 'Post to GBP' button. Vizogen will instantly transmit your post to your verified Google Business Profile.",
    widget: true,
  },
  {
    n: "05",
    title: "Schedule for Local Peak Hours",
    desc: "Want to post later? Click 'Schedule' to pick a time when your local customers are most active. Regular posting on GBP is a proven way to rank higher in local results.",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Boost Local Rankings",
    desc: "Google rewards active businesses. Regular posting signals to Google that your business is open and relevant, helping you appear higher in the 'Local 3-Pack'.",
  },
  {
    icon: Users,
    title: "Convert Searchers to Customers",
    desc: "Posts let you showcase offers, events, and products directly on the search results page, giving customers a reason to choose you over competitors.",
  },
];

const ideas = [
  {
    icon: Megaphone,
    title: "Offers & Deals",
    desc: "Announce a 20% discount or a 'Buy 1 Get 1' weekend special to drive immediate foot traffic.",
  },
  {
    icon: Sparkles,
    title: "New Arrivals",
    desc: "Showcase your latest products or services to keep your profile fresh and exciting.",
  },
  {
    icon: Newspaper,
    title: "Business News",
    desc: "Update your customers about holiday hours, new staff members, or renovations.",
  },
];

const postExamples = [
  {
    icon: BadgePercent,
    title: "Offer Post",
    label: "Promotion",
    sample: "Flat 20% off all haircuts this week at Glow Salon! Walk-ins welcome. Offer ends Sunday.",
  },
  {
    icon: CalendarDays,
    title: "Event Post",
    label: "Event",
    sample: "Free yoga workshop this Saturday, 7 AM at Zen Yoga Studio. Limited to 20 seats — reserve yours now!",
  },
  {
    icon: Sparkles,
    title: "New Product",
    label: "Announcement",
    sample: "Just landed: artisan sourdough loaves at Butter & Crumb Bakery. Fresh from the oven daily at 8 AM.",
  },
  {
    icon: Newspaper,
    title: "Business Update",
    label: "News",
    sample: "We've moved! Find Sunrise Dental at our new, bigger clinic on MG Road — same care, more comfort.",
  },
  {
    icon: Heart,
    title: "Customer Story",
    label: "Social Proof",
    sample: "From couch to 5K in 8 weeks — congrats, Arjun! Start your own journey at FitPeak Gym today.",
  },
  {
    icon: Star,
    title: "Review Highlight",
    label: "Social Proof",
    sample: "'Best butter chicken in the city!' — thank you for the love, Google reviewers. Come taste it yourself.",
  },
  {
    icon: Gift,
    title: "Festive Post",
    label: "Seasonal",
    sample: "Celebrate the festive season with our special gift hampers — pre-orders open now at Butter & Crumb.",
  },
  {
    icon: HelpCircle,
    title: "FAQ Post",
    label: "Educational",
    sample: "Do I need an appointment? Nope! Walk in anytime — Torque Auto Garage serves you 7 days a week.",
  },
  {
    icon: Camera,
    title: "Behind the Scenes",
    label: "Engagement",
    sample: "5 AM at the bakery: our bakers kneading today's batch. This is what fresh really means.",
  },
  {
    icon: Users,
    title: "Hiring Post",
    label: "Announcement",
    sample: "Join our team! Spice Route is hiring chefs and service staff. Walk-in interviews this Friday.",
  },
];

function ButtonActionWidget() {
  return (
    <div className="rotate-[-2.5deg] rounded-2xl border border-border/70 bg-card p-5 shadow-lift transition-transform duration-300 hover:rotate-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Button Action
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
          <span className="size-1.5 rounded-full bg-success" /> Approved
        </span>
      </div>
      <div className="mt-4 grid h-11 place-items-center rounded-full bg-amber-500 text-sm font-semibold text-navy shadow-[0_10px_30px_-8px_rgb(245_158_11_/_0.7)]">
        Post to GBP
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        This button in your dashboard makes you live instantly.
      </p>
    </div>
  );
}

function HowToPostOnGbp() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-[360px] max-w-3xl rounded-full bg-amber-400/25 opacity-60 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Local SEO Strategy
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:leading-[1.1] font-display">
                How to Post on <span className="text-gradient">Google Business Profile</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Improve your local visibility and attract more customers from Google Maps.
                Learn how to publish regular business updates effortlessly using Vizogen.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Steps */}
        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                The GBP Workflow
              </p>
            </Reveal>

            <div className="relative mt-8">
              <div
                aria-hidden
                className="absolute bottom-10 left-9 top-10 w-px bg-border sm:left-11"
              />
              <div className="space-y-5">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:flex-row sm:items-start sm:gap-7 sm:p-7">
                      <span className="shrink-0 font-mono text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        {s.n}
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl font-display">
                          {s.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {s.desc}
                        </p>
                        {s.cta ? (
                          <Button asChild variant="outline" className="mt-5 rounded-full">
                            <Link to="/post-management">
                              {s.cta} <ArrowRight className="size-4" />
                            </Link>
                          </Button>
                        ) : null}
                        {s.widget ? (
                          <div className="mt-6 max-w-[260px]">
                            <ButtonActionWidget />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why post */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-display">
                Why Post on GBP?
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <span className="grid size-11 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <b.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-foreground font-display">
                      {b.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {b.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* What to post */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-display">
                What to Post on GBP?
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((item, i) => (
                <Reveal key={item.title} delay={(i % 3) * 0.08}>
                  <div className="gradient-border h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <span className="grid size-11 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <item.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-foreground font-display">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-12 text-center">
              <Button
                asChild
                size="lg"
                className="rounded-full gradient-brand px-8 shadow-glow transition-transform hover:scale-[1.03] hover:opacity-95"
              >
                <Link to="/post-management">
                  Go to Post Studio <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </section>

        {/* 10 Example Posts */}
        <section className="bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="10 Examples"
              title="10 Example GBP Posts"
              subtitle="Real posts generated by Vizogen AI for different business types — steal these formats for your own profile."
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {postExamples.map((ex, i) => (
                <Reveal key={ex.title} delay={(i % 3) * 0.08}>
                  <div className="gradient-border flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        <ex.icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="truncate text-base font-bold text-foreground font-display">
                          {ex.title}
                        </h3>
                      </div>
                    </div>
                    <span className="mt-4 inline-flex w-fit items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {ex.label}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      “{ex.sample}”
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gradient-brand py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl font-display">
                Ready to keep your GBP active?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Vizogen writes, previews and publishes your Google Business Profile updates —
                daily, automatically.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-amber-500 px-8 text-navy shadow-lift transition-transform hover:scale-[1.03] hover:bg-amber-400"
                >
                  <Link to="/post-management">
                    Go to Post Studio <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
