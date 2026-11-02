import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, Link2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { getSignedBillingUrl, regenerateBillingLink } from "@/lib/billing.functions";
import { sendProposal } from "@/lib/proposals.functions";
import { BILLING_STATUS_LABELS, effectiveBillingStatus, istDateTime } from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BillingLike {
  id: string;
  status: string;
  sent_at: string | null;
  viewed_at: string | null;
  expires_at?: string | null;
  confirmed_at?: string | null;
  signer_name?: string | null;
  signed_pdf_path?: string | null;
  billing_number?: string | null;
  change_request?: string | null;
}

const TONE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary/10 text-primary",
  viewed: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  changes_requested: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  confirmed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  accepted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  expired: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
};

export function BillingStatusBadge({ status, expiresAt }: { status: string; expiresAt?: string | null | undefined }) {
  const s = effectiveBillingStatus(status, expiresAt ?? null);
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold", TONE[s] ?? TONE["draft"])}>
      {BILLING_STATUS_LABELS[s] ?? s}
    </span>
  );
}

/** Timeline + Resend / Regenerate / Download for one billing. */
export function BillingActions({ billing, compact }: { billing: BillingLike; compact?: boolean }) {
  const qc = useQueryClient();
  const resend = useServerFn(sendProposal);
  const regen = useServerFn(regenerateBillingLink);
  const signedUrl = useServerFn(getSignedBillingUrl);
  const [busy, setBusy] = useState("");
  const status = effectiveBillingStatus(billing.status, billing.expires_at ?? null);
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["crm-proposals"] });
    void qc.invalidateQueries({ queryKey: ["crm-lead"] });
  };
  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy("");
    }
  };

  const steps = [
    { label: "Sent", at: billing.sent_at },
    { label: "Viewed", at: billing.viewed_at },
    { label: "Signed", at: billing.confirmed_at ?? null },
  ];

  return (
    <div className="space-y-2">
      {!compact ? (
        <ol className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          {steps.map((s) => (
            <li key={s.label} className={s.at ? "text-foreground" : "text-muted-foreground/60"}>
              <span className={cn("mr-1 inline-block size-1.5 rounded-full align-middle", s.at ? "bg-primary" : "bg-muted-foreground/30")} />
              {s.label}
              {s.at ? ` · ${istDateTime(s.at)}` : ""}
            </li>
          ))}
        </ol>
      ) : null}
      {billing.change_request && status === "changes_requested" ? (
        <p className="rounded-lg bg-amber-500/10 p-2 text-xs text-amber-800 dark:text-amber-200">
          Client asked: {billing.change_request}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {billing.signed_pdf_path ? (
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run("pdf", async () => {
            const { url } = await signedUrl({ data: { id: billing.id } });
            window.open(url, "_blank", "noopener");
          })}>
            {busy === "pdf" ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />} Signed PDF
          </Button>
        ) : null}
        {["sent", "viewed", "changes_requested"].includes(status) ? (
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run("resend", async () => {
            await resend({ data: { id: billing.id, subject: "Your Vizogen billing", message: "Here is your billing again. Please review and accept it using the button below." } });
            toast.success("Billing email sent again.");
            refresh();
          })}>
            {busy === "resend" ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Resend email
          </Button>
        ) : null}
        {status === "expired" ? (
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run("regen", async () => {
            const { link } = await regen({ data: { id: billing.id } });
            await navigator.clipboard?.writeText(link).catch(() => undefined);
            toast.success("New 14-day link created and copied.");
            refresh();
          })}>
            {busy === "regen" ? <Loader2 className="size-3.5 animate-spin" /> : <Link2 className="size-3.5" />} Regenerate link
          </Button>
        ) : null}
      </div>
    </div>
  );
}
