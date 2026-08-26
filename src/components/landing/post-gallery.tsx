import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";
import p1 from "@/assets/post-1.jpg";
import p2 from "@/assets/post-2.jpg";
import p3 from "@/assets/post-3.jpg";
import p4 from "@/assets/post-4.jpg";
import p5 from "@/assets/post-5.jpg";
import p6 from "@/assets/post-6.jpg";

const posts = [
  { src: p1, alt: "AI generated gym promotion post", title: "FitPeak Gym" },
  { src: p2, alt: "AI generated bakery promotion post", title: "Butter & Crumb" },
  { src: p3, alt: "AI generated dental clinic post", title: "Sunrise Dental" },
  { src: p4, alt: "AI generated salon promotion post", title: "Glow Salon" },
  { src: p5, alt: "AI generated restaurant promotion post", title: "Spice Route" },
  { src: p6, alt: "AI generated yoga studio post", title: "Zen Yoga" },
];

export function PostGallery() {
  return (
    <section className="bg-card/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="AI Generated Post Examples"
          subtitle="Every post is written, designed and scheduled for your profile — no designer, no agency."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.title} delay={(i % 3) * 0.08}>
              <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <img
                  src={post.src}
                  alt={post.alt}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-navy/70 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-semibold text-navy-foreground">
                      {post.title}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                      View Post <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
