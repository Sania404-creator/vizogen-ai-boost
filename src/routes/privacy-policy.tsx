import { createFileRoute } from "@tanstack/react-router";
import { LegalList, LegalPage, type LegalSection } from "@/components/site/legal-page";

const title = "Privacy & Compliance — Vizogen";
const description =
  "How Vizogen collects, uses and protects your data, including our Google API limited-use commitments, payment security, refund and data-deletion policies.";

export const Route = createFileRoute("/privacy-policy")({
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
  component: PrivacyPolicyPage,
});

const CONTACT = {
  email: "info.vizogen@gmail.com",
  phone: "+91 84889 18358",
  address:
    "Tower-B, RK ICONIC, 923, 150 Feet Ring Rd, nr. Ayodhya Chowk, Sheetal Park, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
};

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: (
      <p>
        Welcome to Vizogen.in ("we", "our", "us"). We value your privacy and are committed to
        protecting your personal information. This document explains how we collect, use, and
        safeguard your data when you use our AI-powered Google Business Profile automation platform.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    body: (
      <LegalList
        items={[
          "Personal details such as name, email, phone number, and business address.",
          "Billing and payment details processed via our payment gateway (Razorpay).",
          "Google Business Profile data you authorize us to access via Google's official API (business listings, reviews, posts, insights).",
          "Usage data such as IP address, browser type, device information, and in-app activity.",
        ]}
      />
    ),
  },
  {
    id: "how-we-use-your-information",
    title: "3. How We Use Your Information",
    body: (
      <LegalList
        items={[
          "To provide, operate, and manage our services (post automation, review management, ranking tracking, Magic QR, etc.).",
          "To process payments securely.",
          "To send service updates, invoices, and important account notifications.",
          "To improve product performance and user experience.",
          "To provide customer support.",
        ]}
      />
    ),
  },
  {
    id: "payment-security",
    title: "4. Payment & Security",
    body: (
      <p>
        All payments are processed securely through Razorpay. We do not store your card details on
        our servers. Our payment partner uses SSL encryption and is PCI DSS compliant.
      </p>
    ),
  },
  {
    id: "google-api-data-usage",
    title: "5. Google API Data Usage",
    body: (
      <p>
        Vizogen's use and transfer of information received from Google APIs adheres to the Google API
        Services User Data Policy, including the Limited Use requirements. We only access, use, and
        share Google Business Profile data as necessary to provide and improve the features you've
        authorized — such as publishing posts, retrieving reviews, and syncing performance insights.
      </p>
    ),
  },
  {
    id: "terms-of-service",
    title: "6. Terms of Service",
    body: (
      <p>
        By using our platform, you agree not to misuse our services or engage in unlawful activity.
        Fraudulent behavior, spam, or abuse of the platform will result in account suspension or
        termination.
      </p>
    ),
  },
  {
    id: "refund-policy",
    title: "7. Refund Policy",
    body: (
      <p>
        Payments are non-refundable once a subscription is activated. Duplicate transactions can be
        reported within 7 days of the charge. Approved refunds are processed within 7 business days.
      </p>
    ),
  },
  {
    id: "data-protection",
    title: "8. Data Protection",
    body: (
      <p>
        We follow industry-standard security practices to protect your data. However, no system can
        guarantee 100% security. Users are responsible for keeping their account credentials
        confidential.
      </p>
    ),
  },
  {
    id: "third-party-services",
    title: "9. Third-Party Services",
    body: (
      <p>
        We may use trusted third-party tools and services (such as our payment gateway, Google APIs,
        and email/communication providers) to operate our platform. We are not responsible for the
        privacy practices or policies of these third parties — please review their respective
        policies separately.
      </p>
    ),
  },
  {
    id: "data-retention-deletion",
    title: "10. Data Retention & Deletion",
    body: (
      <p>
        We retain your personal data for as long as your account is active or as needed to provide
        our services. You may request deletion of your account and associated data at any time by
        contacting us at the email below.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "11. Your Rights",
    body: (
      <p>
        You have the right to access, correct, or request deletion of your personal data, and to
        withdraw consent for Google Business Profile access at any time via your Google Account
        settings or by contacting us directly.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    title: "12. Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page
        with a revised "Effective Date."
      </p>
    ),
  },
  {
    id: "contact-information",
    title: "13. Contact Information",
    body: (
      <dl className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 break-all text-sm font-medium text-foreground">
            <a href={`mailto:${CONTACT.email}`} className="hover:text-brand">
              {CONTACT.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Phone
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            <a href="tel:+918488918358" className="hover:text-brand">
              {CONTACT.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Address
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-foreground">{CONTACT.address}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Website
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">vizogen.in</dd>
        </div>
      </dl>
    ),
  },
];

function PrivacyPolicyPage() {
  return (
    <LegalPage
      heading="Privacy & Compliance"
      effectiveDate="1 September 2026"
      sections={sections}
      closing="By using our platform, you agree to these terms."
      footerNote={`© ${new Date().getFullYear()} Vizogen.in, operated by NG Marketing Solution. All rights reserved.`}
    />
  );
}
