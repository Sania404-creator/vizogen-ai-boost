import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Clock, Loader2, Search, XCircle } from "lucide-react";
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
    note: "Congratulations — you're approved! Check your inbox for onboarding and commission details.",
  },
  rejected: {
    icon: XCircle,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    note: "We couldn't take this application forward right now. You're welcome to apply again in 3 months.",
  },
};

export function PartnerStatusTracker({ idPrefix = "ps" }: { idPrefix?: string }) {
  const lookup = useServerFn(getPartnerApplicationStatus);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    referenceCode: string;
    fullName: string;
    program: string;
    status: PartnerStatus;
    submittedAt: string;
    updatedAt: string;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !email.trim()) return;
    setLoading(true);
    setNotFound(false);
    try {
      const res = await lookup({ data: { referenceCode: code, email } });
      setResult(res);
      setNotFound(!res);
    } catch {
      setNotFound(true);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const style = result ? STATUS_STYLE[result.status] : null;
  const StatusIcon = style?.icon ?? Clock;

  return (
    <Reveal>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-foreground">
          Check your application status
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter the reference code from your confirmation email along with the email you applied
          with.
        </p>
        <form onSubmit={check} className="mt-4 space-y-3">
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
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-70"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Check status
          </button>
        </form>

        {notFound ? (
          <p className="mt-4 rounded-xl border border-border bg-muted p-3 text-xs text-muted-foreground">
            We couldn't find an application with that code and email. Double-check both, or
            message us on WhatsApp.
          </p>
        ) : null}

        {result && style ? (
          <div className={`mt-4 rounded-xl border p-4 ${style.className}`}>
            <div className="flex items-center gap-2 text-sm font-bold">
              <StatusIcon className="size-4" /> {PARTNER_STATUS_LABEL[result.status]}
            </div>
            <p className="mt-2 text-xs leading-relaxed opacity-90">{style.note}</p>
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
                  {new Date(result.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
