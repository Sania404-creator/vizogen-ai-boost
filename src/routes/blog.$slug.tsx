import { useState } from "react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, Copy, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/blog-card";
import { Markdown } from "@/components/blog/markdown";
import { getPostBySlug, getRelatedPosts } from "@/data/blogs";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw redirect({ to: "/blog" });
    return { post };
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Article — Vizogen Blog" }, { name: "robots", content: "noindex" }] };
    }
    const url = `https://seo.vizogen.in/blog/${params.slug}`;
    return {
      meta: [
        { title: `${post.title} | Vizogen Blog` },
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.date,
            keywords: post.tags.join(", "),
            articleSection: post.category,
            author: { "@type": "Organization", name: "Vizogen" },
            publisher: { "@type": "Organization", name: "Vizogen" },
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = getRelatedPosts(post);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://seo.vizogen.in/blog/${post.slug}`;
  const shareText = `${post.title} — ${shareUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <article>
          <header className="relative overflow-hidden pt-20 sm:pt-28">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl gradient-brand"
            />
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <Reveal>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="size-4" /> Back to Blog
                </Link>

                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full gradient-brand px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-white">
                    {post.category}
                  </span>
                </div>

                <h1 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground font-display sm:text-4xl md:text-[2.75rem]">
                  {post.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">{post.dateLabel}</span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    {post.readTime}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to="/blog"
                      search={{ tag }}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
              <Reveal>
                <img
                  src={post.cover}
                  alt={post.coverAlt}
                  width={1280}
                  height={800}
                  className="aspect-[16/9] w-full rounded-2xl object-cover shadow-soft"
                />
              </Reveal>
            </div>
          </header>

          <div className="mx-auto max-w-[740px] px-4 pb-6 pt-12 sm:px-6">
            <Markdown content={post.content} />

            <div className="mt-12 flex flex-wrap items-center gap-3 border-y border-border py-5">
              <span className="text-sm font-semibold text-foreground">Share this article</span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <MessageCircle className="size-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Twitter className="size-4" />
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>

            <Reveal className="mt-12">
              <div className="rounded-2xl gradient-brand p-8 text-center text-white shadow-xl sm:p-10">
                <h2 className="text-2xl font-bold font-display sm:text-3xl">
                  Want Vizogen to handle this for you?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
                  AI posts, instant review replies and profile health monitoring — running on
                  autopilot for your Google Business Profile.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 rounded-full bg-white text-foreground hover:bg-white/90"
                >
                  <a href="https://login.vizogen.in/sign-in">Start Free Trial</a>
                </Button>
              </div>
            </Reveal>
          </div>
        </article>

        {related.length ? (
          <section className="pb-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                Related articles
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <Reveal key={item.slug} delay={index * 0.08} className="h-full">
                    <BlogCard post={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
