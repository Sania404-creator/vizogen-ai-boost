import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Mail, Phone } from "lucide-react";
import { viewProposal, type PricingLine } from "@/lib/proposals.functions";
import logo from "@/assets/vizogen-logo.png";
import { NAP } from "@/lib/aeo";

export const Route = createFileRoute("/proposal/$token")({
  head: () => ({
    meta: [
      { title: "Your Vizogen proposal" },
      {
        name: "description",
        content:
          "Review the scope, deliverables, pricing and terms of your Vizogen Google Business Profile automation proposal.",
      },
      { property: "og:title", content: "Your Vizogen proposal" },
      {
        property: "og:description",
        content: "Scope, deliverables, pricing and terms for your Vizogen engagement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PublicProposal,
  errorComponent: () => (
    <Fallback message="We couldn't load this proposal. Please ask your Vizogen contact for a fresh link." />
  ),
  notFoundComponent: () => <Fallback message="This proposal link is no longer valid." />,
});

function Fallback({ message }: { message: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 px-4">
      <p className="max-w-md text-center text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface ProposalRow {
  title: string;
  client_name: string;
  client_company: string;
  scope: string;
  deliverables: string[] | null;
  pricing: PricingLine[] | null;
  currency: string;
  notes: string;
  terms: string;
  valid_until: string | null;
  version: number;
  created_at: string;
}

function PublicProposal() {
  const { token } = Route.useParams();
  const fetchProposal = useServerFn(viewProposal);
  const query = useQuery({
    queryKey: ["public-proposal", token],
    queryFn: () => fetchProposal({ data: { token } }),
  });

  if (query.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const p = query.data?.proposal as ProposalRow | null | undefined;
  if (!p) return <Fallback message="This proposal link is no longer valid." />;

  const pricing = p.pricing ?? [];
  const symbol = p.currency === "USD" ? "$" : "₹";
  const total = pricing.reduce((sum, l) => sum + l.qty * l.price, 0);

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <article className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <header className="gradient-brand px-6 py-8 text-white sm:px-9">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Vizogen" width={32} height={32} className="size-8" />
              <span className="text-lg font-bold tracking-tight font-display">Vizogen</span>
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight font-display sm:text-3xl">
              {p.title}
            </h1>
            <p className="mt-2 text-sm opacity-90">
              Prepared for {p.client_company || p.client_name} · Version {p.version} ·{" "}
              {new Date(p.created_at).toLocaleDateString()}
            </p>
          </header>

          <div className="space-y-8 px-6 py-8 sm:px-9">
            {p.scope ? (
              <section>
                <h2 className="text-lg font-semibold text-foreground font-display">
                  Project scope
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {p.scope}
                </p>
              </section>
            ) : null}

            {(p.deliverables ?? []).length ? (
              <section>
                <h2 className="text-lg font-semibold text-foreground font-display">Deliverables</h2>
                <ul className="mt-3 space-y-2">
                  {(p.deliverables ?? []).map((d) => (
                    <li key={d} className="flex gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {pricing.length ? (
              <section>
                <h2 className="text-lg font-semibold text-foreground font-display">Pricing</h2>
                <div className="mt-3 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5">Item</th>
                        <th className="px-4 py-2.5">Qty</th>
                        <th className="px-4 py-2.5">Price</th>
                        <th className="px-4 py-2.5">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pricing.map((l) => (
                        <tr key={l.item}>
                          <td className="px-4 py-2.5 text-foreground">{l.item}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{l.qty}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {symbol}
                            {l.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-foreground">
                            {symbol}
                            {(l.qty * l.price).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted/40">
                        <td colSpan={3} className="px-4 py-3 font-semibold text-foreground">
                          Total
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground">
                          {symbol}
                          {total.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {p.notes ? (
              <section>
                <h2 className="text-lg font-semibold text-foreground font-display">Notes</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {p.notes}
                </p>
              </section>
            ) : null}

            {p.terms ? (
              <section>
                <h2 className="text-lg font-semibold text-foreground font-display">Terms</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {p.terms}
                </p>
              </section>
            ) : null}

            {p.valid_until ? (
              <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                This proposal is valid until {new Date(p.valid_until).toLocaleDateString()}.
              </p>
            ) : null}

            <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{NAP.name}</p>
              <p className="mt-1">{NAP.streetAddress}</p>
              <p>
                {NAP.city}, {NAP.state} {NAP.postalCode}
              </p>
              <p className="mt-3 flex flex-wrap gap-4">
                <a href={`mailto:${NAP.email}`} className="inline-flex items-center gap-1.5">
                  <Mail className="size-4" /> {NAP.email}
                </a>
                <a href={`tel:${NAP.phone}`} className="inline-flex items-center gap-1.5">
                  <Phone className="size-4" /> {NAP.phone}
                </a>
              </p>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
