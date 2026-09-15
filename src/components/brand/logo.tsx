import logoAsset from "@/assets/vizogen-mark.png.asset.json";

const LOGO = logoAsset.url;

/** Square Vizogen brand mark used throughout product surfaces. */
export function VizogenMark({ className = "size-9" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <img
        src={LOGO}
        alt="Vizogen logo"
        className="h-full w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

/**
 * Mark + wordmark lock-up used in app shells, sign-in cards and documents.
 */
export function VizogenLockup({
  label = "Vizogen",
  sublabel,
  markClassName = "size-9",
  labelClassName = "text-base font-bold tracking-tight text-foreground font-display",
}: {
  label?: string;
  sublabel?: string;
  markClassName?: string;
  labelClassName?: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <VizogenMark className={markClassName} />
      <span className="min-w-0 leading-tight">
        <span className={`block truncate ${labelClassName}`}>{label}</span>
        {sublabel ? (
          <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {sublabel}
          </span>
        ) : null}
      </span>
    </span>
  );
}
