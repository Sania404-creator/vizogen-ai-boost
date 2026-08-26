import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarCheck,
  Heart,
  MessageSquareHeart,
  PartyPopper,
  ShieldCheck,
  Star,
  ThumbsUp,
  Wrench,
} from "lucide-react";
import { GuideWithExamples } from "@/components/landing/guide-with-examples";
import { guideHead } from "@/components/landing/guide-placeholder";
import replyReviewImage from "@/assets/guide-reply-review.jpg";


export const Route = createFileRoute("/how-to-reply-review")({
  head: guideHead(
    "How to Reply to Reviews — Vizogen",
    "See how Vizogen drafts personalised, on-brand replies to every Google review — plus 10 ready-to-use review reply examples.",
  ),
  component: () => (
    <GuideWithExamples
      eyebrow="Review Guide"
      title="How to Reply to"
      highlight="Reviews"
      subtitle="Replying to every Google review builds trust and boosts local rankings. Vizogen drafts personalised replies in your brand voice — you approve in one tap. Here are 10 real examples."
      steps={[
        {
          title: "Connect Your Profile",
          desc: "Link your Google Business Profile once. Vizogen starts pulling every new review into a single inbox.",
        },
        {
          title: "Get Instant Alerts",
          desc: "New review? You're notified immediately — negative reviews get a priority alert so nothing slips through.",
        },
        {
          title: "Review the AI Draft",
          desc: "Vizogen drafts a personalised reply that references the reviewer's name, rating and specifics — in your tone.",
        },
        {
          title: "Approve & Publish",
          desc: "One tap to publish the reply straight to Google. Or turn on auto-reply for 4–5 star reviews.",
        },
      ]}
      examplesTitle="10 Review Reply Examples"
      examplesSubtitle="AI-drafted replies for every situation — glowing praise, tough criticism, and everything in between."
      examples={[
        {
          icon: Star,
          title: "5-Star Praise",
          label: "Positive",
          sample: "Thank you so much, Ananya! We're thrilled you loved the ambience and the pasta. See you again soon at Spice Route!",
        },
        {
          icon: Heart,
          title: "Loyal Customer",
          label: "Positive",
          sample: "Rahul, customers like you are why we do what we do. Thanks for 3 years of trust — the next coffee is on us!",
        },
        {
          icon: ThumbsUp,
          title: "Staff Shout-out",
          label: "Positive",
          sample: "We'll pass your kind words to Meera — she'll be delighted! Thank you for recognising her service, it means a lot.",
        },
        {
          icon: PartyPopper,
          title: "First Visit",
          label: "Positive",
          sample: "So glad your first visit was a great one, Vikram! Welcome to the family — we can't wait to host you again.",
        },
        {
          icon: BadgeCheck,
          title: "Detailed 5-Star",
          label: "Positive",
          sample: "Thank you for the detailed review, Sneha! Hygiene and punctuality are our top priorities — glad it showed.",
        },
        {
          icon: MessageSquareHeart,
          title: "4-Star with Feedback",
          label: "Mixed",
          sample: "Thanks for the honest feedback, Arjun! Great to hear you enjoyed the food — we've noted your point on wait times and are fixing it.",
        },
        {
          icon: CalendarCheck,
          title: "Booking Issue",
          label: "Mixed",
          sample: "Sorry about the booking confusion, Priya. We've upgraded our system so this won't happen again — your next slot is priority-booked.",
        },
        {
          icon: AlertTriangle,
          title: "3-Star Concern",
          label: "Negative",
          sample: "We appreciate you telling us, Karan. This isn't the standard we aim for — our manager has reached out personally to make it right.",
        },
        {
          icon: Wrench,
          title: "Service Complaint",
          label: "Negative",
          sample: "We're sorry the repair took longer than promised. Your vehicle is our priority — please call us directly and we'll expedite it today.",
        },
        {
          icon: ShieldCheck,
          title: "1-Star Recovery",
          label: "Negative",
          sample: "We take this seriously and have escalated it to our owner. We'd value the chance to earn your trust back — please give us one more shot.",
        },
      ]}
      ctaTitle="Never leave a review unanswered"
      ctaSubtitle="Vizogen drafts and publishes personalised replies to every Google review — in minutes, in your voice."
      ctaTo="/demo"
      ctaLabel="Start Free Demo"
    />
  ),
});
