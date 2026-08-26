import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./reveal";

const faqs = [
  {
    q: "What exactly does Vizogen automate on my Google Business Profile?",
    a: "Daily AI-written and designed posts, review replies in your brand tone, review collection via Magic QR, and local rank tracking for your keywords and city.",
  },
  {
    q: "Do I need to connect my Google account?",
    a: "Yes — a one-click secure connection to your Google Business Profile. You keep full ownership and can disconnect any time.",
  },
  {
    q: "Are the reviews real?",
    a: "Always. Vizogen only helps you collect authentic reviews from real customers using QR codes, SMS and WhatsApp requests — never fake reviews.",
  },
  {
    q: "How does Magic QR filter negative reviews?",
    a: "Customers scan and rate first. Happy customers are routed to Google; unhappy ones are routed to a private feedback form so you can fix the issue directly.",
  },
  {
    q: "How soon will I see results?",
    a: "Most profiles see measurable visibility and audience growth within the first 30 days of consistent daily posting and review activity.",
  },
  {
    q: "Can I manage multiple locations?",
    a: "Yes. Add unlimited locations, each with its own posting schedule, keywords and review workflows from one dashboard.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-card/60 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-border/70">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
