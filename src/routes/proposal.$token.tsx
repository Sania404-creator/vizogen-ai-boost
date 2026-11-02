import { createFileRoute, redirect } from "@tanstack/react-router";

/** Older proposal links now open the secure billing page. */
export const Route = createFileRoute("/proposal/$token")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/billing/$token", params: { token: params.token }, replace: true });
  },
  head: () => ({
    meta: [
      { title: "Your Vizogen billing" },
      { name: "description", content: "Review and sign your Vizogen billing." },
      { property: "og:title", content: "Your Vizogen billing" },
      { property: "og:description", content: "Review and sign your Vizogen billing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
