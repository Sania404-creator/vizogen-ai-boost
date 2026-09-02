// Server-only Lovable AI Gateway helper.
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

export async function chat(
  messages: { role: "system" | "user"; content: string }[],
  opts?: { model?: string; maxTokens?: number },
) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured yet.");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: opts?.model ?? "google/gemini-2.5-flash",
      messages,
      max_completion_tokens: opts?.maxTokens ?? 700,
    }),
  });
  if (res.status === 429) throw new Error("AI rate limit reached. Try again in a moment.");
  if (!res.ok) {
    throw new Error(`AI request failed (${res.status}).`);
  }
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

export function extractJson<T>(raw: string): T | null {
  const fenced = raw.replace(/```json|```/g, "").trim();
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(fenced.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
