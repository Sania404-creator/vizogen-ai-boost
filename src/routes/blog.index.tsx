import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal } from "@/components/landing/reveal";
import { BlogCard } from "@/components/blog/blog-card";
import { blogCategories, blogPosts } from "@/data/blogs";

const searchSchema = z.object({ tag: z.string().optional() });

const TITLE = "Local SEO Tips, Guides & Google Business Profile Insights | Vizogen Blog";
const DESCRIPTION =
  "Practical, no-fluff advice to help your business rank higher on Google Maps — local SEO guides, review strategy and GBP automation playbooks.";

export const Route = createFileRoute("/blog/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://seo.vizogen.in/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://seo.vizogen.in/blog" }],
  }),
  component: BlogListingPage,
});

function BlogListingPage() {
  const { tag } = Route.useSearch();
  const [category, setCategory] = useState("All");

  const posts = blogPosts.filter((post) => {
    const categoryMatch = category === "All" || post.category === category;
    const tagMatch = !tag || post.tags.includes(tag);
    return categoryMatch && tagMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-20 pb-10 sm:pt-28">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl gradient-brand"
          />
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Vizogen Blog
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground font-display sm:text-5xl">
                Local SEO Tips, Guides &amp; Google Business Profile Insights
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Practical, no-fluff advice to help your business rank higher and get found on
                Google.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {blogCategories.map((item) => {
                  const active = item === category;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        active
                          ? "gradient-brand text-white shadow-soft"
                          : "border border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {tag ? (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Filtered by tag:{" "}
                  <span className="font-semibold text-foreground">{tag}</span>
                </p>
              ) : null}
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.08} className="h-full">
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>

            {posts.length === 0 ? (
              <p className="mt-12 text-center text-sm text-muted-foreground">
                No articles match this filter yet.
              </p>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
