/* Static-export replacement for the Radix accordion: native <details>, no JS needed. */
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

export function AccordionItem({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <details className={cn("group border-b", className)}>{children}</details>;
}

export function AccordionTrigger({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <summary
      className={cn(
        "flex flex-1 cursor-pointer list-none items-center justify-between py-4 text-left text-sm font-medium transition-all marker:hidden [&::-webkit-details-marker]:hidden",
        className,
      )}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
    </summary>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cn("overflow-hidden pb-4 pt-0 text-sm", className)}>{children}</div>;
}
