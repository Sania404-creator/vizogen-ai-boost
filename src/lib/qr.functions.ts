import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface QrRow {
  id: string;
  slug: string;
  title: string;
  review_link: string | null;
  business_name: string;
  scans: number;
  active: boolean;
  created_at: string;
}

export interface FeedbackRow {
  id: string;
  rating: number;
  comment: string | null;
  customer_name: string | null;
  customer_contact: string | null;
  routed_to_google: boolean;
  created_at: string;
}

const QR_COLUMNS = "id, slug, title, review_link, business_name, scans, active, created_at";

function makeSlug(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "vizogen";
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export const listQrCodes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: codes }, { data: feedback }] = await Promise.all([
      context.supabase
        .from("qr_codes")
        .select(QR_COLUMNS)
        .eq("owner_id", context.userId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("qr_feedback")
        .select("id, rating, comment, customer_name, customer_contact, routed_to_google, created_at")
        .eq("owner_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    return {
      codes: (codes ?? []) as QrRow[],
      feedback: (feedback ?? []) as FeedbackRow[],
    };
  });

export const createQrCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().trim().min(2).max(120),
        reviewLink: z.string().trim().max(400).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: business } = await supabase
      .from("businesses")
      .select("id, name, review_link")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();
    if (!business) throw new Error("Add your business details first.");

    const { data: created, error } = await supabase
      .from("qr_codes")
      .insert({
        owner_id: userId,
        business_id: business.id,
        slug: makeSlug(business.name),
        title: data.title,
        review_link: data.reviewLink || business.review_link || null,
        business_name: business.name,
      })
      .select(QR_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return created as QrRow;
  });

export const updateQrCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        title: z.string().trim().min(2).max(120).optional(),
        reviewLink: z.string().trim().max(400).optional().or(z.literal("")),
        active: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const payload: Record<string, unknown> = {};
    if (data.title !== undefined) payload["title"] = data.title;
    if (data.reviewLink !== undefined) payload["review_link"] = data.reviewLink || null;
    if (data.active !== undefined) payload["active"] = data.active;
    const { error } = await context.supabase
      .from("qr_codes")
      .update(payload)
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteQrCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("qr_codes")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Renders a QR code for a Magic QR link as an inline SVG data string. */
export const renderQrSvg = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ url: z.string().url().max(400) }).parse(input),
  )
  .handler(async ({ data }) => {
    const QRCode = await import("qrcode");
    const svg = await QRCode.toString(data.url, {
      type: "svg",
      margin: 1,
      width: 320,
      color: { dark: "#111827", light: "#ffffff" },
    });
    return { svg };
  });
