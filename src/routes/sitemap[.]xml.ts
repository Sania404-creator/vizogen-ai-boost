import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { blogPosts } from "@/data/blogs";
import { locations } from "@/components/landing/location-configs";

// Sitemap is generated at request time from the route list + data files
// (blogs, locations), so new blog posts and city pages appear automatically.
const BASE_URL = "https://www.vizogen.in";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

const industrySlugs = [
  "gym-marketing-software",
  "salon-marketing-software",
  "clinic-marketing-software",
  "bakery-marketing-software",
  "restaurant-marketing-software",
  "pest-control-marketing-software",
  "car-garage-marketing-software",
  "tour-travel-marketing-software",
  "yoga-wellness-marketing-software",
  "handyman-marketing-software",
  "education-marketing-software",
  "realestate-marketing-software",
];

const guidePaths = [
  "/how-to-connect-gbp",
  "/how-to-create-post",
  "/how-to-reply-review",
  "/how-to-generate-magic-qr",
  "/how-to-post-on-gbp",
];

const featurePaths = [
  "/features/ai-post-generation",
  "/features/smart-scheduling",
  "/features/review-management",
  "/features/magic-qr",
];

function buildEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/pricing", changefreq: "weekly", priority: "0.8" },
    { path: "/partner", changefreq: "monthly", priority: "0.8" },
    { path: "/official-partner", changefreq: "monthly", priority: "0.6" },
    { path: "/post-management", changefreq: "monthly", priority: "0.6" },
    { path: "/services/local-seo", changefreq: "weekly", priority: "0.8" },
  ];

  for (const slug of industrySlugs) {
    entries.push({ path: `/${slug}`, changefreq: "weekly", priority: "0.8" });
  }
  for (const location of locations) {
    entries.push({
      path: `/services/local-seo-${location.slug}`,
      changefreq: "weekly",
      priority: "0.8",
    });
  }
  for (const path of featurePaths) {
    entries.push({ path, changefreq: "monthly", priority: "0.6" });
  }
  for (const path of guidePaths) {
    entries.push({ path, changefreq: "monthly", priority: "0.6" });
  }

  entries.push({ path: "/blog", changefreq: "weekly", priority: "0.6" });
  for (const post of blogPosts) {
    entries.push({
      path: `/blog/${encodeURIComponent(post.slug)}`,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  entries.push({ path: "/privacy-policy", changefreq: "yearly", priority: "0.3" });
  entries.push({ path: "/terms-and-conditions", changefreq: "yearly", priority: "0.3" });

  return entries;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = buildEntries().map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
