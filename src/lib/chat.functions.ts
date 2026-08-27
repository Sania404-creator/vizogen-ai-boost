import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT = `You are the Vizogen Assistant, a friendly sales & support assistant for Vizogen (vizogen.ai) — an AI automation platform for Google Business Profiles (GBP / Google Maps listings) used mainly by local businesses in India.

What Vizogen does:
- AI Post Generation: daily/scheduled AI-written Google Business Profile posts with generated images.
- Smart Scheduling: content calendar, auto-publishing to GBP at the best times.
- Review Management: instant AI replies to reviews in your brand voice, review monitoring.
- Magic QR: a feedback-collection QR code that routes happy customers to leave 5-star Google reviews.
- Local ranking / Local SEO: keyword rank tracking on Google Maps, citations, profile optimization, performance analytics.

Pricing (INR, yearly): Starter ₹9,999/yr (₹3,499/quarter), Growth ₹14,999/yr (₹4,499/quarter, most popular), Pro ₹19,999/yr (₹5,999/quarter). One-time services: GMB Assistance & Update ₹1,500; GMB Creation & Management from scratch ₹3,000 + 18% GST. USD pricing is indicative ($100 / $150 / $200 yearly); billing is in INR. Point users to the /pricing page for the full feature comparison.

Contact: info.vizogen@gmail.com, +91 84889 18358, office in Rajkot, Gujarat.

Style rules:
- Be concise: 2-4 short sentences or a tight bullet list. Plain markdown only.
- Be helpful and honest; never invent features, integrations or discounts.
- Nudge toward booking a demo or WhatsApp chat when the question is sales-related or needs a human.`;

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
});

export const askVizogenAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => chatSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return {
        reply:
          "The assistant isn't configured yet. Please WhatsApp us at +91 84889 18358 and our team will help right away.",
      };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        reasoning_effort: "none",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`AI gateway error [${response.status}]: ${body}`);
      if (response.status === 429) {
        return { reply: "We're getting a lot of questions right now — please try again in a moment." };
      }
      return {
        reply:
          "I couldn't reach the assistant just now. You can WhatsApp our team at +91 84889 18358 or book a demo and we'll walk you through it.",
      };
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = json.choices?.[0]?.message?.content?.trim();
    return {
      reply:
        reply ||
        "Sorry, I didn't catch that. Could you rephrase your question about Vizogen's features or pricing?",
    };
  });
