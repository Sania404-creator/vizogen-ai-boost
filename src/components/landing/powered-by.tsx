import { Reveal } from "./reveal";
import openaiAsset from "@/assets/openai-logo.jpg.asset.json";
import googleAsset from "@/assets/google-g.png.asset.json";

const partners = [
  {
    logo: openaiAsset.url,
    alt: "OpenAI logo",
    label: "GPT-Powered AI Content",
    copy: "AI-generated posts and review replies powered by OpenAI's language models.",
  },
  {
    logo: googleAsset.url,
    alt: "Google logo",
    label: "Built on Google Business Profile API",
    copy: "Securely connected via Google's official API for real-time profile management.",
  },
];

export function PoweredBy() {
  return (
    <section className="border-y border-border/70 bg-muted/40 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Built on Trusted Technology
          </span>
          <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Powered by Industry-Leading AI &amp; APIs
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          {partners.map((p, i) => (
            <Reveal
              key={p.label}
              delay={i * 0.1}
              className="w-full sm:w-[300px] lg:w-[340px]"
            >
              <div className="group flex h-full flex-col items-center rounded-2xl border border-border/70 bg-card p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <img
                  src={p.logo}
                  alt={p.alt}
                  className="h-10 w-auto max-w-[150px] object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  loading="lazy"
                />
                <p className="mt-5 text-base font-semibold text-foreground font-display">
                  {p.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
