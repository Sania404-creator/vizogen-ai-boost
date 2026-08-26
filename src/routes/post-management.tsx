import { createFileRoute, redirect } from "@tanstack/react-router";

/** Post Studio lives in the Vizogen app — send visitors to the login gateway. */
export const Route = createFileRoute("/post-management")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});
