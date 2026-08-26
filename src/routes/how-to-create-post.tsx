import { createFileRoute } from "@tanstack/react-router";
import {
  BadgePercent,
  CalendarDays,
  Camera,
  Gift,
  Heart,
  Megaphone,
  Newspaper,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { GuideWithExamples } from "@/components/landing/guide-with-examples";
import { guideHead } from "@/components/landing/guide-placeholder";
import aiPostImage from "@/assets/guide-ai-post.jpg";


export const Route = createFileRoute("/how-to-create-post")({
  head: guideHead(
    "How to Create an AI Post — Vizogen",
    "Generate on-brand Google Business Profile posts in seconds with Vizogen AI — plus 10 real AI post examples you can steal today.",
  ),
  component: () => (
    <GuideWithExamples
      eyebrow="AI Post Guide"
      title="How to Create an"
      highlight="AI Post"
      subtitle="Vizogen writes, designs and schedules Google Business Profile posts for you. Here's the 4-step workflow — followed by 10 real examples of AI-generated posts."
      steps={[
        {
          title: "Open Post Studio",
          desc: "From your Vizogen dashboard, open Post Studio and select the Google Business Profile you want to post to.",
        },
        {
          title: "Describe Your Update",
          desc: "Type a short prompt — an offer, an event, or news. Vizogen AI turns it into a polished, keyword-rich GBP post.",
        },
        {
          title: "Review the AI Draft",
          desc: "Check the live preview: headline, caption, hashtags and a matching AI-generated visual. Edit anything you like.",
        },
        {
          title: "Post or Schedule",
          desc: "Publish instantly or schedule for peak local hours. Vizogen keeps your profile active even while you sleep.",
        },
      ]}
      examplesTitle="10 AI Post Examples"
      examplesSubtitle="Real prompts and the posts Vizogen AI generated from them — for different business types."
      examples={[
        {
          icon: BadgePercent,
          title: "Weekend Offer",
          label: "Gym",
          sample: "This weekend only: 50% off your first month at FitPeak Gym. Walk in with this post and start your transformation today!",
        },
        {
          icon: Sparkles,
          title: "New Menu Launch",
          label: "Restaurant",
          sample: "Say hello to our new wood-fired menu! Fresh sourdough pizzas every evening from 6 PM. Reserve your table this weekend.",
        },
        {
          icon: CalendarDays,
          title: "Holiday Hours",
          label: "Clinic",
          sample: "We're open this festive season! Sunrise Dental will see patients 9 AM – 2 PM on all holidays. Book ahead to skip the wait.",
        },
        {
          icon: Camera,
          title: "Before & After",
          label: "Salon",
          sample: "Another stunning transformation at Glow Salon! Balayage + gloss by our senior stylist. Book your slot for this week.",
        },
        {
          icon: Gift,
          title: "Festive Special",
          label: "Bakery",
          sample: "Our festive gift boxes are here! Handcrafted cookies, brownies and more — pre-order from Butter & Crumb before stocks run out.",
        },
        {
          icon: Megaphone,
          title: "Limited-Time Deal",
          label: "Car Garage",
          sample: "Monsoon car care package: full inspection + wash + polish at 30% off. Offer valid till Sunday at Torque Auto Garage.",
        },
        {
          icon: Heart,
          title: "Customer Story",
          label: "Yoga Studio",
          sample: "Meet Priya — 6 months, 12 kg down, infinite energy up. Start your own journey at Zen Yoga with a free trial class.",
        },
        {
          icon: Star,
          title: "Review Spotlight",
          label: "Café",
          sample: "\"Best cold brew in town!\" — thank you for the love. Tag us in your coffee photos and get featured on our page.",
        },
        {
          icon: Users,
          title: "Hiring Post",
          label: "Real Estate",
          sample: "We're growing! Skyline Realty is hiring client relationship managers. Walk-in interviews this Saturday, 10 AM – 4 PM.",
        },
        {
          icon: Newspaper,
          title: "New Branch Opening",
          label: "Retail",
          sample: "Big news! Our 3rd outlet opens this Friday in Indiranagar. First 50 visitors get an exclusive launch-day gift.",
        },
      ]}
      ctaTitle="Ready to post on autopilot?"
      ctaSubtitle="Vizogen writes, designs and schedules your Google Business Profile posts — daily, automatically."
      ctaTo="/demo"
      ctaLabel="Start Free Demo"
      heroImage={aiPostImage}
      heroImageAlt="AI-generated Google Business Profile post preview"
    />

  ),
});
