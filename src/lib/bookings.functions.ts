import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_EMAIL = "info.bizzdigitalschool@gmail.com";

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/),
  businessName: z.string().trim().min(2).max(120),
  slotDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotTime: z.string().trim().min(3).max(20),
  note: z.string().trim().max(600).optional().default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const createDemoBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendGmail } = await import("@/lib/email.server");
    const { buildAdminEmail, buildCustomerEmail, formatSlot } = await import(
      "@/lib/booking-emails"
    );

    const { data: row, error } = await supabaseAdmin
      .from("demo_bookings")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        business_name: data.businessName,
        slot_date: data.slotDate,
        slot_time: data.slotTime,
        note: data.note || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to save demo booking", error);
      throw new Error("We couldn't save your booking. Please try again.");
    }

    const pretty = formatSlot(data.slotDate, data.slotTime);

    const adminSent = await sendGmail(
      ADMIN_EMAIL,
      `New Demo Booked — ${data.businessName} (${pretty})`,
      buildAdminEmail(data, pretty),
    );
    const customerSent = await sendGmail(
      data.email,
      "Your Vizogen Demo is Confirmed",
      buildCustomerEmail(data, pretty),
    );

    await supabaseAdmin
      .from("demo_bookings")
      .update({ admin_email_sent: adminSent, customer_email_sent: customerSent })
      .eq("id", row.id);

    return { id: row.id, slotLabel: pretty, emailSent: customerSent };
  });

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  businessName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/),
  email: z.string().trim().email().max(255),
  industry: z.string().trim().min(2).max(60),
});

export type DemoLeadInput = z.infer<typeof leadSchema>;

export const createDemoLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendGmail } = await import("@/lib/email.server");
    const { buildLeadAdminEmail, buildLeadCustomerEmail } = await import("@/lib/lead-emails");

    const today = new Date().toISOString().slice(0, 10);

    const { data: row, error } = await supabaseAdmin
      .from("demo_bookings")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        business_name: data.businessName,
        slot_date: today,
        slot_time: "To be confirmed",
        source: "popup",
        note: `Industry: ${data.industry}`,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to save demo lead", error);
      throw new Error("We couldn't save your request. Please try again.");
    }

    const adminSent = await sendGmail(
      ADMIN_EMAIL,
      `New Free Demo Request — ${data.businessName} (${data.industry})`,
      buildLeadAdminEmail(data),
    );
    const customerSent = await sendGmail(
      data.email,
      "We've received your Vizogen demo request",
      buildLeadCustomerEmail(data),
    );

    await supabaseAdmin
      .from("demo_bookings")
      .update({ admin_email_sent: adminSent, customer_email_sent: customerSent })
      .eq("id", row.id);

    return { id: row.id, emailSent: customerSent };
  });
