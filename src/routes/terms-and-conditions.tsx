import { createFileRoute } from "@tanstack/react-router";
import { LegalList, LegalPage, type LegalSection } from "@/components/site/legal-page";

const title = "Terms & Conditions — Vizogen";
const description =
  "Vizogen's Terms & Conditions: eligibility, payment and activation terms, the strictly non-refundable policy, acceptable use, Google API compliance and governing law.";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: (
      <p>
        Vizogen.in ("Vizogen", "we", "our", "us") is owned and operated by NG Marketing Solution.
        These Terms &amp; Conditions govern your access to and use of the Vizogen platform, including
        our website, dashboard, and all related services. By creating an account, making a payment,
        or using our services, you agree to be bound by these terms.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    body: (
      <p>
        You must be at least 18 years old and legally authorized to represent the business you are
        registering to use Vizogen's services.
      </p>
    ),
  },
  {
    id: "account-registration",
    title: "3. Account Registration",
    body: (
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for
        all activity that occurs under your account. Notify us immediately if you suspect
        unauthorized access.
      </p>
    ),
  },
  {
    id: "services-provided",
    title: "4. Services Provided",
    body: (
      <p>
        Vizogen provides AI-powered Google Business Profile automation, including but not limited to:
        post generation and scheduling, review management and automated replies, Magic QR feedback
        collection, local ranking tracking, and related features as described on our website and
        within your chosen plan.
      </p>
    ),
  },
  {
    id: "payment-terms",
    title: "5. Payment Terms",
    body: (
      <LegalList
        items={[
          "All prices listed on the website are in the currency shown (INR or USD equivalent) and are exclusive of applicable taxes (including GST) unless stated otherwise.",
          "Payment must be completed in full before any service, plan, or feature is activated. No service, subscription, or one-time plan will be provisioned, unlocked, or made available until payment is successfully received and confirmed by our payment gateway.",
          "Subscription plans (Starter, Growth, Pro) renew automatically for the billing cycle selected (quarterly or yearly) unless cancelled before the renewal date.",
          "One-time service plans (e.g. GMB Assistance & Update Plan, GMB Creation & Management Plan) are billed once and do not renew automatically.",
        ]}
      />
    ),
  },
  {
    id: "activation-policy",
    title: "6. Activation Policy",
    body: (
      <p>
        Services are activated ONLY after payment is successfully processed and confirmed. There is
        no provisional, trial, or pre-payment activation of any paid plan or feature unless
        explicitly offered as part of a clearly-labeled free trial. If a payment fails, is reversed,
        or is disputed after activation, Vizogen reserves the right to immediately suspend or
        deactivate the associated account or service until the payment issue is resolved.
      </p>
    ),
  },
  {
    id: "refund-policy",
    title: "7. Refund Policy — Strictly Non-Refundable",
    emphasis: true,
    body: (
      <LegalList
        items={[
          "ALL PAYMENTS MADE TO VIZOGEN ARE FINAL AND NON-REFUNDABLE, once the associated service or subscription has been activated. This applies to all subscription plans (Starter, Growth, Pro) and all one-time service plans, regardless of usage level, satisfaction, or reason for discontinuation.",
          "No partial refunds, prorated refunds, or credits will be issued for unused time remaining on a subscription, downgrades, or early cancellation.",
          "The ONLY exception is a genuine duplicate or erroneous transaction (e.g. accidentally charged twice for the same plan). Such cases must be reported to us in writing within 7 days of the transaction date, along with valid proof of the duplicate charge (transaction ID, payment receipt). Approved duplicate-transaction refunds will be processed within 7 business days to the original payment method.",
          "By completing a payment on Vizogen, you explicitly acknowledge and agree to this non-refundable policy.",
        ]}
      />
    ),
  },
  {
    id: "cancellation",
    title: "8. Cancellation",
    body: (
      <p>
        You may cancel your subscription at any time from your account settings or by contacting
        support. Cancellation stops future automatic renewals but does NOT entitle you to a refund
        for the current active billing period — access continues until the end of the already-paid
        period, after which the service will not renew.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "9. Acceptable Use",
    body: (
      <p>
        You agree not to: misuse the platform, attempt to reverse-engineer or resell our services
        without authorization, use the platform for any unlawful purpose, publish content that
        violates Google's policies or applicable law through our automation tools, or attempt to
        circumvent any usage limits of your plan. Violation may result in immediate suspension or
        termination without refund.
      </p>
    ),
  },
  {
    id: "google-api-compliance",
    title: "10. Google API Compliance",
    body: (
      <p>
        Your use of Vizogen's Google Business Profile integration must comply with Google's own terms
        of service and API usage policies. Vizogen is not responsible for any suspension,
        restriction, or penalty applied to your Google Business Profile by Google directly.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "11. Limitation of Liability",
    body: (
      <p>
        Vizogen provides its services on an "as is" and "as available" basis. We do not guarantee
        specific ranking positions, review volumes, or business outcomes, as these depend on factors
        outside our control (including Google's algorithms). To the maximum extent permitted by law,
        Vizogen and NG Marketing Solution shall not be liable for any indirect, incidental, or
        consequential damages arising from use of the platform.
      </p>
    ),
  },
  {
    id: "changes-to-plans",
    title: "12. Changes to Plans & Pricing",
    body: (
      <p>
        Vizogen reserves the right to modify plan features, pricing, or availability at any time.
        Existing active subscriptions will continue under their originally agreed terms until the
        next renewal, at which point updated pricing (if any) will apply.
      </p>
    ),
  },
  {
    id: "changes-to-terms",
    title: "13. Changes to These Terms",
    body: (
      <p>
        We may update these Terms &amp; Conditions from time to time. Continued use of the platform
        after changes are posted constitutes acceptance of the revised terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "14. Governing Law",
    body: (
      <p>
        These terms are governed by the laws of India, and any disputes shall be subject to the
        exclusive jurisdiction of the courts located in Rajkot, Gujarat.
      </p>
    ),
  },
  {
    id: "contact-information",
    title: "15. Contact Information",
    body: (
      <dl className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Legal Entity
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">NG Marketing Solution</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 break-all text-sm font-medium text-foreground">
            <a href="mailto:info.vizogen@gmail.com" className="hover:text-brand">
              info.vizogen@gmail.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Phone
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            <a href="tel:+918488918358" className="hover:text-brand">
              +91 84889 18358
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Website
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">vizogen.in</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Address
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-foreground">
            Tower-B, RK ICONIC, 923, 150 Feet Ring Rd, nr. Ayodhya Chowk, Sheetal Park, Puneet Nagar,
            Bajrang Wadi, Rajkot, Gujarat 360006
          </dd>
        </div>
      </dl>
    ),
  },
];

function TermsPage() {
  return (
    <LegalPage
      heading="Terms & Conditions"
      effectiveDate="1 September 2026"
      sections={sections}
      closing="By using our platform or making any payment, you acknowledge that you have read, understood, and agree to these Terms & Conditions, including our strictly non-refundable payment policy."
      footerNote={`© ${new Date().getFullYear()} Vizogen.in, operated by NG Marketing Solution. All rights reserved.`}
    />
  );
}
