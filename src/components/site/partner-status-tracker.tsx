import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, CheckCircle2, Clock, Loader2, Search, XCircle } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getPartnerApplicationStatus,
  PARTNER_STATUS_LABEL,
  type PartnerStatus,
} from "@/lib/partner.functions";

export const STATUS_STYLE: Record<
  PartnerStatus,
  { icon: typeof Clock; className: string; note: string }
> = {
  new: {
    icon: Clock,
    className: "border-border bg-muted text-foreground",
    note: "We have your application. Our partnerships team reviews new applications within 2 business days.",
  },
  reviewing: {
    icon: Search,
    className: "border-primary/30 bg-primary/10 text-primary",
    note: "A partnerships manager is reviewing your details right now. Expect a call or email shortly.",
  },
  approved: {
    icon: CheckCircle2,
    className: "border-success/40 bg-success/10 text-success",
    note: "Congratulations — you're approved! Check your inbox for onboarding, commission details and your portal link.",
  },
  rejected: {
    icon: XCircle,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    note: "We couldn't take this application forward right now. You're welcome to apply again in 3 months.",
  },
};

const TRAIL: PartnerStatus[] = ["new", "reviewing", "approved"];

export function PartnerStatusTracker({ idPrefix = "ps" }: { idPrefix?: string }) {
  const lookup = useServerFn(getPartnerApplicationStatus);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState<{ referenceCode: string; email: string } | null>(null);

  const status = useQuery({
    queryKey: ["partner-status", query?.referenceCode, query?.email],
    queryFn: () => lookup({ data: query! }),
    enabled: !!query,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !email.trim()) return;
    setQuery({ referenceCode: code.trim(), email: email.trim() });
  };

  const result = status.data ?? null;
  const notFound = !!query && status.isFetched && !status.isError && result === null;
  const style = result ? STATUS_STYLE[result.status] : null;
  const StatusIcon = style?.icon ?? Clock;
  const trailIndex = result
    ? result.status === "rejected"
      ? 1
      : TRAIL.indexOf(result.status)
    : -1;

  return (
    <Reveal>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-foreground">
          Check your application status
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter the reference code from your confirmation email along with the email you applied
          with. This panel then updates itself automatically.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <Label htmlFor={`${idPrefix}-code`}>Reference code</Label>
            <Input
              id={`${idPrefix}-code`}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VZP-A1B2C3"
              className="mt-1.5 font-mono tracking-widest"
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-email`}>Email address</Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              className="mt-1.5"
            />
          </div>
          <button
            type="submit"
            disabled={status.isFetching}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-70"
          >
            {status.isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Check status
          </button>
        </form>

        {notFound || status.isError ? (
          <p className="mt-4 rounded-xl border border-border bg-muted p-3 text-xs text-muted-foreground">
            We couldn't find an application with that code and email. Double-check both, or message
            us on WhatsApp.
          </p>
        ) : null}

        {result && style ? (
          <div className={`mt-4 rounded-xl border p-4 ${style.className}`}>
            <div className="flex items-center gap-2 text-sm font-bold">
              <StatusIcon className="size-4" /> {PARTNER_STATUS_LABEL[result.status]}
              {status.isFetching ? <Loader2 className="size-3.5 animate-spin" /> : null}
            </div>

            <ol className="mt-3 flex items-center gap-1.5">
              {TRAIL.map((s, i) => (
                <li key={s} className="flex flex-1 items-center gap-1.5">
                  <span
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= trailIndex ? "bg-current opacity-90" : "bg-current opacity-20"
                    }`}
                  />
                </li>
              ))}
            </ol>
            <div className="mt-1.5 flex justify-between text-[11px] font-semibold opacity-80">
              <span>Received</span>
              <span>Under review</span>
              <span>{result.status === "rejected" ? "Decision made" : "Approved"}</span>
            </div>

            <p className="mt-3 text-xs leading-relaxed opacity-90">{style.note}</p>
            <dl className="mt-3 space-y-1 text-xs opacity-90">
              <div className="flex justify-between gap-3">
                <dt>Applicant</dt>
                <dd className="font-semibold">{result.fullName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Program</dt>
                <dd className="font-semibold">{result.program}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Submitted</dt>
                <dd className="font-semibold">
                  {new Date(result.submittedAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Last update</dt>
                <dd className="font-semibold">
                  {new Date(result.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>

            {result.status === "approved" ? (
              <Link
                to="/partner-portal"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background transition-opacity hover:opacity-90"
              >
                Open your partner portal
                <ArrowRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
