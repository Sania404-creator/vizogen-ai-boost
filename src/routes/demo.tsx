import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const title = "Book Your Free Vizogen Demo";
const description =
  "Tell us about your business and book a free Vizogen demo — see how AI automates your Google Business Profile posts, reviews and replies.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  business: z.string().trim().min(2, "Please enter your business name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits and + - ( )"),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  category: z.string().trim().min(1, "Please select your business category"),
  gbp: z.string().trim().max(255).optional(),
  message: z.string().trim().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormValues, string>>;

const categories = [
  "Gym & Fitness",
  "Clinic & Healthcare",
  "Restaurant & Cafe",
  "Salon & Spa",
  "Real Estate",
  "Home Services",
  "Automotive",
  "Retail Store",
  "Education & Coaching",
  "Other",
];

const perks = [
  "Live walkthrough of the Vizogen dashboard",
  "Custom AI post samples for your business",
  "Local ranking audit of your Google profile",
  "500 free coins to start automating today",
];

function DemoPage() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    business: "",
    email: "",
    phone: "",
    city: "",
    category: "",
    gbp: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormValues) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitted(true);
    toast.success("Demo request received — our team will call you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-soft">
              <Sparkles className="size-4" />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground font-display">
              Vizogen
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-20 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
            Free 20-minute session
          </span>
          <h1 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl font-display">
            Book your <span className="text-gradient">free Vizogen demo</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Share a few essential details about your business and our local growth
            specialist will show you exactly how Vizogen AI automates your Google
            Business Profile.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-border rounded-3xl bg-card p-6 shadow-glow sm:p-8"
        >
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-glow">
                <CheckCircle2 className="size-7" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-foreground font-display">
                Your demo is booked!
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
                Thanks {values.name.split(" ")[0]} — we&apos;ve received your details for{" "}
                {values.business}. Our team will reach out on {values.phone} within 24
                hours.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="rounded-full gradient-brand shadow-soft">
                  <Link to="/login">Go to Vizogen login</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="text-xl font-bold text-foreground font-display">
                Business details
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <Input
                    value={values.name}
                    onChange={(e) => set("name")(e.target.value)}
                    placeholder="Gourab Sen"
                    maxLength={100}
                  />
                </Field>
                <Field label="Business name" error={errors.business}>
                  <Input
                    value={values.business}
                    onChange={(e) => set("business")(e.target.value)}
                    placeholder="FitPeak Gym"
                    maxLength={120}
                  />
                </Field>
                <Field label="Email address" error={errors.email}>
                  <Input
                    type="email"
                    value={values.email}
                    onChange={(e) => set("email")(e.target.value)}
                    placeholder="you@business.com"
                    maxLength={255}
                  />
                </Field>
                <Field label="Phone / WhatsApp" error={errors.phone}>
                  <Input
                    type="tel"
                    value={values.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    placeholder="+91 84889 18358"
                    maxLength={20}
                  />
                </Field>
                <Field label="City" error={errors.city}>
                  <Input
                    value={values.city}
                    onChange={(e) => set("city")(e.target.value)}
                    placeholder="Kolkata"
                    maxLength={80}
                  />
                </Field>
                <Field label="Business category" error={errors.category}>
                  <Select value={values.category} onValueChange={set("category")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Google Business Profile link (optional)" error={errors.gbp}>
                <Input
                  value={values.gbp}
                  onChange={(e) => set("gbp")(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  maxLength={255}
                />
              </Field>
              <Field label="What do you want to improve? (optional)" error={errors.message}>
                <Textarea
                  value={values.message}
                  onChange={(e) => set("message")(e.target.value)}
                  placeholder="More calls, better reviews, higher local ranking..."
                  rows={4}
                  maxLength={1000}
                />
              </Field>
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full gradient-brand shadow-glow transition-transform hover:scale-[1.01] hover:opacity-95"
              >
                Book Your Free Demo →
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already a customer?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Log in to Vizogen
                </Link>
              </p>
            </form>
          )}
        </motion.section>
      </main>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
