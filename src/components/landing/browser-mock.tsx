import type { ReactNode } from "react";

export function BrowserMock({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-full bg-background px-3 py-1 text-[11px] text-muted-foreground">
          {url}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function MockBar({ w = "100%", tall = false }: { w?: string; tall?: boolean }) {
  return (
    <div
      className={`rounded-full bg-muted ${tall ? "h-4" : "h-2.5"}`}
      style={{ width: w }}
    />
  );
}
