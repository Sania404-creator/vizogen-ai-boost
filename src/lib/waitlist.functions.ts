import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(5).max(255),
  product: z.string().trim().min(2).max(60),
});

/** Saves a coming-soon waitlist sign-up into the Vizogen CRM demo inbox. */
export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => {
    const d = schema.parse(i);
    const isEmail = d.contact.includes("@");
    if (isEmail ? !z.string().email().safeParse(d.contact).success : !/^[0-9+\-\s()]{8,20}$/.test(d.contact))
      throw new Error("Enter a valid email or WhatsApp number");
    return { ...d, isEmail };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("demo_bookings").insert({
      name: data.name,
      email: data.isEmail ? data.contact : "",
      phone: data.isEmail ? "" : data.contact,
      business_name: `${data.product} waitlist`,
      slot_date: new Date().toISOString().slice(0, 10),
      slot_time: "Waitlist",
      source: "waitlist",
      note: `Coming-soon waitlist: ${data.product}`,
    });
    if (error) { console.error("waitlist insert failed", error); throw new Error("Could not join the waitlist. Please try again."); }
    return { ok: true };
  });
