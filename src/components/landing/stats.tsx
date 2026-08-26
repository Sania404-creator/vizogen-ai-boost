import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Reveal } from "./reveal";

const stats = [
  {
    value: 3,
    decimals: 1,
    suffix: "x",
    label: "Profile visibility growth",
    copy: "Businesses see higher visibility on Google Search & Maps within 30 days.",
  },
  {
    value: 87,
    suffix: "%",
    label: "Audience growth",
    copy: "Customers see audience growth in their first 30 days.",
  },
  {
    value: 99,
    suffix: "%",
    label: "Lower cost vs agencies",
    copy: "Agency-level strategy for a fraction of the price.",
  },
];

function Counter({
  to,
  decimals = 0,
  suffix,
  active,
}: {
  to: number;
  decimals?: number;
  suffix: string;
  active: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);

  return (
    <span>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative overflow-hidden bg-navy py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 size-[420px] -translate-y-1/2 rounded-full opacity-25 blur-3xl gradient-brand"
      />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.12} className="text-center sm:text-left">
              <p className="text-5xl font-bold tracking-tight text-navy-foreground sm:text-6xl font-display">
                <Counter
                  to={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.suffix}
                  active={inView}
                />
              </p>
              <p className="mt-3 text-lg font-semibold text-navy-foreground">{s.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-foreground/65">{s.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
