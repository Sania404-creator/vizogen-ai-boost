import { Check, X } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";

const defaultOldWay = [
  "Posting to Google whenever you remember",
  "Paying an agency ₹25,000+ every month",
  "Reviews sitting unanswered for weeks",
  "Angry feedback landing straight on your profile",
  "No idea where you rank locally",
  "Hiring a designer for every single post",
];

const defaultNewWay = [
  "Daily AI posts published automatically",
  "Agency-level output at a fraction of the cost",
  "Instant AI review replies in your tone",
  "Magic QR routes unhappy feedback privately",
  "Live local rank tracking by keyword & city",
  "Designed post creatives generated in seconds",
];

export function OldVsNew({
  title = "Stop Doing Business The Old Way",
  subtitle = "Same effort, completely different outcome. Here's what changes on day one.",
  oldWay = defaultOldWay,
  newWay = defaultNewWay,
}: {
  title?: string;
  subtitle?: string;
  oldWay?: string[];
  newWay?: string[];
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />
        <Reveal className="mt-12">
          <div className="relative grid overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft lg:grid-cols-2">
            <div className="p-7 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                The old way
              </p>
              <h3 className="mt-3 text-2xl font-bold text-muted-foreground">
                Manual, slow, expensive
              </h3>
              <ul className="mt-7 space-y-4">
                {oldWay.map((item) => (

                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                      <X className="size-3" />
                    </span>
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-brand p-7 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                The Vizogen way
              </p>
              <h3 className="mt-3 text-2xl font-bold text-primary-foreground">
                Automated, daily, compounding
              </h3>
              <ul className="mt-7 space-y-4">
                {newWay.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-primary-foreground/90">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-foreground/20 text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <span className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-bold text-foreground shadow-lift lg:grid">
              VS
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
