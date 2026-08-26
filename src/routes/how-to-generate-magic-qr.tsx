import { createFileRoute } from "@tanstack/react-router";
import {
  Cake,
  Car,
  Dumbbell,
  GraduationCap,
  HandPlatter,
  Home,
  Scissors,
  Stethoscope,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { GuideWithExamples } from "@/components/landing/guide-with-examples";
import { guideHead } from "@/components/landing/guide-placeholder";

export const Route = createFileRoute("/how-to-generate-magic-qr")({
  head: guideHead(
    "How to Generate a Magic QR — Vizogen",
    "Generate a Magic QR code that sends walk-in customers straight to your Google review form — plus 10 ways businesses use it.",
  ),
  component: () => (
    <GuideWithExamples
      eyebrow="Magic QR Guide"
      title="How to Generate a"
      highlight="Magic QR"
      subtitle="Magic QR turns any counter, receipt or table tent into a one-tap path to a fresh 5-star Google review. Happy customers go to Google; unhappy ones reach you privately first."
      steps={[
        {
          title: "Open Magic QR Studio",
          desc: "In your Vizogen dashboard, open Magic QR and pick the location you want to collect reviews for.",
        },
        {
          title: "Customise Your Code",
          desc: "Add your logo, brand colours and a headline like 'Loved us? Rate us!' — the QR matches your business, not a generic black square.",
        },
        {
          title: "Set the Smart Routing",
          desc: "4–5 star ratings go straight to your Google review page. Lower ratings open a private feedback form so you can fix issues first.",
        },
        {
          title: "Print & Track",
          desc: "Download print-ready files for counters, tables and receipts. Every scan is tracked per location in your dashboard.",
        },
      ]}
      examplesTitle="10 Magic QR Examples"
      examplesSubtitle="How real businesses place their Magic QR to collect reviews at the exact moment customers are happiest."
      examples={[
        {
          icon: UtensilsCrossed,
          title: "Table Tent",
          label: "Restaurant",
          sample: "A tent card on every table: 'Enjoyed your meal? Scan to rate us on Google!' — scans peak right after dessert.",
        },
        {
          icon: HandPlatter,
          title: "Bill Folder",
          label: "Café",
          sample: "QR printed inside the bill folder with 'Thank you! 10 seconds for 5 stars?' — catches guests at payment time.",
        },
        {
          icon: Scissors,
          title: "Mirror Sticker",
          label: "Salon",
          sample: "Sticker on the styling mirror: 'Love your new look? Tell Google!' — clients scan while admiring the result.",
        },
        {
          icon: Dumbbell,
          title: "Front Desk Stand",
          label: "Gym",
          sample: "Counter standee at check-out: 'Crushed today's workout? Rate us!' — members scan on their way out.",
        },
        {
          icon: Stethoscope,
          title: "Reception Card",
          label: "Clinic",
          sample: "Small card at reception handed with the prescription: 'How was your visit today?' — private feedback first for unhappy patients.",
        },
        {
          icon: Cake,
          title: "Cake Box Print",
          label: "Bakery",
          sample: "QR printed on every cake box: 'Made your celebration sweeter? Review us!' — reviews arrive the same evening.",
        },
        {
          icon: Car,
          title: "Service Tag",
          label: "Car Garage",
          sample: "Hanging tag on the rear-view mirror after service: 'Happy with the ride? Scan & rate!' — seen the moment they drive off.",
        },
        {
          icon: GraduationCap,
          title: "Certificate Corner",
          label: "Education",
          sample: "QR on course-completion certificates: 'Proud of your achievement? Rate your experience!' — parents scan it too.",
        },
        {
          icon: Wrench,
          title: "Invoice Footer",
          label: "Handyman",
          sample: "QR at the bottom of every invoice: 'Fixed it right? One tap to review!' — works even for digital invoices.",
        },
        {
          icon: Home,
          title: "Open House Sign",
          label: "Real Estate",
          sample: "QR on the 'Sold' board and open-house signage: 'Loved the tour? Share your experience!' — builds agent reputation fast.",
        },
      ]}
      ctaTitle="Turn walk-ins into 5-star reviews"
      ctaSubtitle="Generate your branded Magic QR in 60 seconds — and watch your Google rating climb on autopilot."
      ctaTo="/demo"
      ctaLabel="Start Free Demo"
    />
  ),
});
