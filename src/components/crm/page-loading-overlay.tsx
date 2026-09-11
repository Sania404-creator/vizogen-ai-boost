import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { VizogenMark } from "@/components/brand/logo";

const DEBOUNCE_MS = 140;

export function CrmPageLoadingOverlay() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isLoading) {
      timerRef.current = setTimeout(() => setVisible(true), DEBOUNCE_MS);
    } else {
      setVisible(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/90 p-8 shadow-2xl">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
          <VizogenMark className="relative size-16" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
