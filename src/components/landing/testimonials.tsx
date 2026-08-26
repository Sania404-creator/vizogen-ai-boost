import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeading } from "./reveal";

type Metric = { label: string; value: number };

const testimonials: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  metrics: Metric[];
}[] = [
  {
    quote:
      "We stopped chasing our agency. Vizogen posts every single day and our Maps calls doubled in six weeks.",
    name: "Rahul Mehta",
    role: "Owner, FitPeak Gym — Mumbai",
    initials: "RM",
    metrics: [
      { label: "AVG", value: 82 },
      { label: "GMB", value: 94 },
      { label: "Facebook", value: 61 },
      { label: "Instagram", value: 73 },
    ],
  },
  {
    quote:
      "The AI replies sound like me. Patients notice we respond in minutes, and our rating went from 4.1 to 4.8.",
    name: "Dr. Ananya Rao",
    role: "Founder, Sunrise Clinic — Bangalore",
    initials: "AR",
    metrics: [
      { label: "AVG", value: 76 },
      { label: "GMB", value: 88 },
      { label: "Facebook", value: 54 },
      { label: "Instagram", value: 69 },
    ],
  },
  {
    quote:
      "Magic QR alone paid for the plan. Unhappy feedback comes to us privately instead of on our profile.",
    name: "Karan Shah",
    role: "Director, AutoWorks Garage — Surat",
    initials: "KS",
    metrics: [
      { label: "AVG", value: 71 },
      { label: "GMB", value: 85 },
      { label: "Facebook", value: 48 },
      { label: "Instagram", value: 64 },
    ],
  },
  {
    quote:
      "We rank in the top 3 for 'bakery near me' in our area now. That was never happening on our own.",
    name: "Sneha Kulkarni",
    role: "Co-owner, Butter & Crumb — Pune",
    initials: "SK",
    metrics: [
      { label: "AVG", value: 79 },
      { label: "GMB", value: 91 },
      { label: "Facebook", value: 58 },
      { label: "Instagram", value: 77 },
    ],
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Real Results for Real Businesses"
          subtitle="Owners who swapped agency retainers for automation — and their six-month reports."
        />
        <Carousel opts={{ align: "start", loop: true }} className="mt-12">
          <CarouselContent className="-ml-5">
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="pl-5 sm:basis-1/2 lg:basis-1/3">
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <Quote className="size-7 text-primary/40" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    “{t.quote}”
                  </p>
                  <div className="mt-6 flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full gradient-brand text-sm font-bold text-primary-foreground">
                      {t.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
                      <Star className="size-3.5 fill-current text-primary" /> 5.0
                    </span>
                  </div>
                  <div className="mt-6 rounded-xl border border-border/70 bg-accent/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      6-Month Performance Report
                    </p>
                    <div className="mt-3 space-y-2.5">
                      {t.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="grid grid-cols-[64px_minmax(0,1fr)_40px] items-center gap-2"
                        >
                          <span className="truncate text-xs font-medium text-muted-foreground">
                            {m.label}
                          </span>
                          <span className="h-1.5 overflow-hidden rounded-full bg-border">
                            <span
                              className="block h-full rounded-full gradient-brand"
                              style={{ width: `${m.value}%` }}
                            />
                          </span>
                          <span className="text-right text-xs font-bold text-foreground">
                            +{m.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-3">
            <CarouselPrevious className="static translate-y-0 rounded-full" />
            <CarouselNext className="static translate-y-0 rounded-full" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
