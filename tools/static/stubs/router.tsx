/* Static-export stubs for @tanstack/react-router. */
import { createElement, type ReactNode } from "react";

export function Link({ to, children, ...rest }: { to?: string; children?: ReactNode } & Record<string, unknown>) {
  return createElement("a", { href: to ?? "#", ...rest }, children as ReactNode);
}

export function createFileRoute() {
  return (options: unknown) => ({ options });
}

export function createRootRouteWithContext() {
  return (options: unknown) => ({ options });
}

export function useRouterState({ select }: { select?: (s: unknown) => unknown } = {}) {
  const state = { location: { pathname: globalThis.__STATIC_PATHNAME__ ?? "/", hash: "", search: "" } };
  return select ? select(state) : state;
}

export function useRouter() {
  return { invalidate: () => {}, navigate: () => {} };
}

export function useNavigate() {
  return () => {};
}

export function useLocation() {
  return { pathname: globalThis.__STATIC_PATHNAME__ ?? "/", hash: "", search: "" };
}

export function Outlet() {
  return null;
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}

export const Await = () => null;
export const notFound = () => new Error("not found");
export const redirect = () => new Error("redirect");
