import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  return (
    <Reveal
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"
      }
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1] ${
          tone === "dark" ? "text-navy-foreground" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-4 text-base leading-relaxed ${
            tone === "dark" ? "text-navy-foreground/70" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
