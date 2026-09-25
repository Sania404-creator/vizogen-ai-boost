import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildSystemPrompt } from "./assistant-knowledge";

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
  path: z.string().max(200).optional(),
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
