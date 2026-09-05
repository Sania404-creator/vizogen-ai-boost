import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  MapPin,
  MessageSquare,
  QrCode,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal, SectionHeading } from "@/components/landing/reveal";
import { whatsappLink } from "@/components/landing/industry-config";

const TITLE = "Local SEO for Cafés, Resorts & Restaurants in Udaipur | Vizogen";
const DESCRIPTION =
  "Udaipur's tourism and hospitality businesses live and die by their Google Maps visibility. Vizogen automates your Google Business Profile so your café, resort or restaurant stays top of mind for every traveler searching nearby.";
const URL = "https://www.vizogen.in/local-seo-cafe-resort-restaurant-udaipur";

const benefits = [
  {
    icon: MapPin,
    title: "Win Tourist Searches",
    body: "Rank for high-intent searches like 'lake view restaurant Udaipur' or 'boutique resort near City Palace' — the exact phrases travelers type minutes before they book.",
  },
  {
    icon: CalendarClock,
    title: "Automate Seasonal Posts",
    body: "AI posts for peak season offers, festival specials and off-season promotions, published to your profile daily without anyone on your team logging in.",
  },
  {
    icon: QrCode,
    title: "Protect Your Rating from Review Bombs",
    body: "Magic QR captures unhappy feedback privately and routes happy guests to Google — critical for tourism businesses where one public bad review can cost a full season.",
  },
];

const posts = [
  { tag: "Offer", title: "Sunset Rooftop Dinner — Book Your Table Tonight" },
  { tag: "Tips", title: "5 Best Times to Visit Lake Pichola This Season" },
  { tag: "Behind the Scenes", title: "Meet Our Head Chef — Rajasthani Thali Specialist" },
  { tag: "Seasonal", title: "Monsoon Package: 2N/3D Stay at 20% Off" },
  { tag: "Testimonial", title: "5-Star Review: 'Best View in All of Udaipur'" },
  { tag: "Event", title: "Live Folk Music Every Friday by the Lake" },
  { tag: "Offer", title: "Weekday Café Brunch for Two — Flat 15% Off" },
  { tag: "Update", title: "New Poolside Suites Now Open for Winter Bookings" },
];

const timeline = [
  {
    step: "01",
    title: "Connect Your Café / Resort / Restaurant Profile",
    body: "Link your Google Business Profile in a minute through Google's official screen. You keep ownership and can disconnect anytime.",
  },
  {
    step: "02",
    title: "Fix the Basics Travelers Judge You On",
    body: "Categories, amenities, menus, room details, lake-view attributes, hours and landmark-led service areas completed properly.",
  },
  {
    step: "03",
    title: "Daily AI Posts Go Live",
    body: "Seasonal packages, festival specials, chef features and offers published every day in the language travelers search with.",
  },
  {
    step: "04",
    title: "Reviews Start Compounding",
    body: "Magic QR collects reviews from guests before they check out, and AI replies to every review within minutes.",
  },
  {
    step: "05",
    title: "Watch Bookings & Footfall Grow",
    body: "Track calls, direction requests and map impressions week over week so you can see which offers filled tables and rooms.",
  },
];

const faqs = [
  {
    q: "How does Vizogen help my resort rank for tourist searches in Udaipur?",
    a: "Travelers search by landmark and experience — 'lake view resort Udaipur', 'hotel near City Palace', 'rooftop restaurant Udaipur'. Vizogen aligns your categories, attributes, photos and service areas to those landmarks, then keeps your profile active with daily posts and fast review replies, which are the freshness and prominence signals Google weighs for local results.",
  },
  {
    q: "Can Vizogen manage seasonal offers for my restaurant?",
    a: "Yes. You set the offer or season once — Rann-season packages, monsoon rates, festival menus, off-season weekday deals — and the AI writes and publishes posts around it on a daily cadence, then switches messaging when the season changes.",
  },
  {
    q: "We get reviews from guests who have already left the city. Does that hurt us?",
    a: "It only hurts when replies come late. Vizogen drafts a reply to every review within minutes, in the language the guest wrote in, so your listing shows an engaged business even for reviews posted days after checkout.",
  },
  {
    q: "How does Magic QR protect us from one bad review?",
    a: "A guest scans your QR at the table or reception. Happy guests are sent straight to your Google review page, while lower ratings open a private feedback form that reaches you instead of the public listing — so you get the chance to fix it first.",
  },
  {
    q: "How long before we see more bookings?",
    a: "Most Udaipur hospitality profiles see movement in map visibility within 4–8 weeks. Category and content fixes move fastest; review-driven prominence builds over 3–6 months of consistent activity.",
  },
];

function NichePage() {
  const demoLink = whatsappLink(
    "Hi Vizogen, I run a café/resort/restaurant in Udaipur and I'd like a demo.",
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-4xl rounded-full opacity-20 blur-3xl gradient-brand"
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
              <Sparkles className="size-3.5" /> Udaipur&apos;s #1 Local SEO Tool for Hospitality &
              Food Businesses
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
              Rank #1 on Google in Udaipur — Built for Cafés, Resorts &amp; Restaurants
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {DESCRIPTION}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full rounded-full gradient-brand px-7 shadow-glow sm:w-auto"
              >
                <a href="https://login.vizogen.in/sign-in">
                  Start Free Trial <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
                <a href={demoLink} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="size-4" /> Watch Demo
                </a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-brand" strokeWidth={3} /> No Setup Fee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-brand" strokeWidth={3} /> Cancel Anytime
              </span>
            </div>
          </div>
        </section>

        {/* WHY UDAIPUR HOSPITALITY */}
        <section className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="size-3.5" /> Why this matters in Udaipur
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-foreground sm:text-2xl">
                Tourism-driven, seasonal and review-sensitive
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Udaipur runs on visitors, and visitors have no local word-of-mouth to fall back on. A
                traveler searching &ldquo;best rooftop restaurant Udaipur&rdquo; or &ldquo;lake view
                resort Udaipur&rdquo; opens Google Maps, scans the top three listings, reads the
                first few reviews and books — often within the same hour. That makes photos, review
                velocity, reply speed and post freshness far more decisive here than for a
                locals-only business in another city. Demand also swings hard with the season, so a
                profile that looks abandoned in the off months loses the ranking momentum it needs
                when peak season returns. Vizogen keeps all of that running daily, automatically.
              </p>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="What you get"
              title="Built for Udaipur's hospitality and food businesses"
              subtitle="Three things decide who fills tables and rooms from Google — Vizogen automates all three."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-glow">
                    <span className="grid size-11 place-items-center rounded-xl gradient-brand text-primary-foreground">
                      <b.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* AI POST EXAMPLES */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="AI post examples"
              title="Posts written for Udaipur guests, not generic templates"
              subtitle="A sample of what publishes to your Google Business Profile automatically."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/40">
                    <span className="w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                      {p.tag}
                    </span>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground">
                      {p.title}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* GROWTH TIMELINE */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="How it works"
              title="From setup to fuller tables in five steps"
              subtitle="You connect once. Vizogen handles the daily work after that."
            />
            <div className="mt-12 space-y-4">
              {timeline.map((t, i) => (
                <Reveal key={t.step} delay={i * 0.06}>
                  <div className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl gradient-brand font-display text-sm font-bold text-primary-foreground">
                      {t.step}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground sm:text-lg">
                        {t.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {t.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions from Udaipur café, resort and restaurant owners"
              subtitle="Straight answers before you start."
            />
            <Reveal className="mt-10">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">
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

        {/* FINAL CTA */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-primary/60 px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/20 blur-3xl"
              />
              <div className="relative">
                <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-navy-foreground sm:text-4xl">
                  Ready to Fill Every Table &amp; Every Room in Udaipur?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-foreground/75">
                  <TrendingUp className="mr-1 inline size-4" /> Daily posts, instant review replies
                  and Magic QR — running for your café, resort or restaurant from day one.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild size="lg" className="rounded-full">
                    <a href="https://login.vizogen.in/sign-in">
                      Get Started Free <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full">
                    <Link to="/pricing">View pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/local-seo-cafe-resort-restaurant-udaipur")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: NichePage,
});
