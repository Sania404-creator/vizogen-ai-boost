import { useState } from "react";
import { WA } from "./config";
import { Nav, Footer, DemoModal, Fade, Pill } from "./kit";

export type WASection = { title: string; body: string[] };
const A = WA.footer.address;
const LEGAL = `${WA.footer.poweredBy} (operating the Vizogen.ai brand)`;

export const PRIVACY: WASection[] = [
  { title: "Who we are", body: [`Vizogen.ai WhatsApp Marketing is operated by ${LEGAL}, ${A}. Contact: ${WA.contactEmail}, ${WA.contactPhone}.`] },
  { title: "Information we collect", body: ["Account details: name, business name, email, phone number and billing details.", "Messaging data: contacts, chats, templates, broadcasts and chatbot flows you create or receive through WhatsApp, Instagram and Messenger.", "Usage data: device, browser, pages visited and in-app activity, used to keep the service secure and improve it."] },
  { title: "How we use it", body: ["To provide the inbox, broadcasts, chatbots, AI agents, payments and analytics you sign up for.", "To support you, send service and billing notices, and prevent fraud or misuse.", "We never sell your data or your customers' contacts."] },
  { title: "Meta platforms", body: ["Messages are sent and received through Meta's official WhatsApp Business, Instagram and Messenger APIs and are also subject to Meta's own terms and privacy policy.", "You are responsible for collecting opt-in consent from the contacts you message."] },
  { title: "Sharing", body: ["We share data only with service providers needed to run the platform (hosting, Meta APIs, payment gateways, email), under confidentiality obligations, or where the law requires it."] },
  { title: "Security & retention", body: ["Data is encrypted in transit and access is limited by team roles.", "We keep your data while your account is active and delete it on request, unless the law requires us to keep it longer."] },
  { title: "Your rights", body: [`You can ask to access, correct, export or delete your data by writing to ${WA.contactEmail}.`] },
  { title: "Changes", body: ["We may update this policy. The latest version is always on this page."] },
];

export const TERMS: WASection[] = [
  { title: "Agreement", body: [`These terms govern your use of Vizogen.ai WhatsApp Marketing, operated by ${LEGAL}, ${A}. By signing up or paying, you accept them.`] },
  { title: "The service", body: ["Vizogen.ai provides a WhatsApp, Instagram and Messenger CRM with broadcasts, chatbots, AI agents, payments and analytics. Features depend on your plan."] },
  { title: "Your responsibilities", body: ["Follow Meta's WhatsApp Business and Commerce policies and all applicable laws.", "Message only contacts who have opted in. No spam, illegal, misleading or abusive content.", "Keep your login secure. You are responsible for activity on your account."] },
  { title: "Fees & Meta charges", body: ["Plan fees are paid in advance for the chosen billing period.", "Meta's per-message conversation charges are billed separately, based on Meta's rates."] },
  { title: "NO REFUNDS", body: ["ALL PAYMENTS ARE NON-REFUNDABLE. We do not refund any amount — including plan fees, setup fees, renewals, unused periods, wallet or message credits — once paid, for any reason.", "You can cancel any time to stop future renewals; access continues until the end of the paid period."] },
  { title: "Suspension", body: ["We may suspend or end accounts that break these terms or Meta's policies, or whose number is blocked by Meta. No refund is due in such cases."] },
  { title: "Liability", body: ["The service is provided \"as is\". We are not liable for Meta outages, number bans, message delivery failures, or indirect or consequential losses. Our total liability is limited to the fees you paid in the last 3 months."] },
  { title: "Governing law", body: ["These terms are governed by the laws of India. Courts in Rajkot, Gujarat have exclusive jurisdiction."] },
  { title: "Contact", body: [`${WA.contactEmail} · ${WA.contactPhone} · ${A}`] },
];

export function WALegalPage({ title, updated, sections }: { title: string; updated: string; sections: WASection[] }) {
  const [demo, setDemo] = useState(false);
  return (
    <div className="theme-wa min-h-screen overflow-x-clip font-sans">
      <Nav onDemo={() => setDemo(true)} base="/whatsapp-crm" />
      <main className="mx-auto max-w-3xl px-4 py-14 md:py-20">
        <Fade><Pill icon="ShieldCheck">Legal</Pill></Fade>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {updated} · Powered by {WA.footer.poweredBy}</p>
        <div className="mt-10 space-y-6">
          {sections.map((s, i) => (
            <section key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">{i + 1}. {s.title}</h2>
              {s.body.map((p) => <p key={p} className="mt-3 text-sm leading-relaxed text-muted-foreground">{p}</p>)}
            </section>
          ))}
        </div>
      </main>
      <Footer base="/whatsapp-crm" />
      <DemoModal open={demo} onClose={() => setDemo(false)} />
    </div>
  );
}
