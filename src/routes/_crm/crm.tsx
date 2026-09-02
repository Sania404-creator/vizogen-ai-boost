import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_crm/crm")({
  component: () => <Outlet />,
});
