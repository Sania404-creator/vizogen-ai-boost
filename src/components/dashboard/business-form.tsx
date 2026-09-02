import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { saveBusiness, type Business } from "@/lib/workspace.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const TONES = ["friendly", "professional", "premium", "playful", "local"] as const;
const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "twice-weekly", label: "Twice a week" },
  { value: "weekly", label: "Weekly" },
] as const;

export function BusinessForm({
  business,
  onSaved,
  submitLabel = "Save business",
}: {
  business: Business | null;
  onSaved: (business: Business) => void;
  submitLabel?: string;
}) {
  const save = useServerFn(saveBusiness);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: business?.name ?? "",
    category: business?.category ?? "",
    city: business?.city ?? "",
    brand_tone: (business?.brand_tone ?? "friendly") as (typeof TONES)[number],
    keywords: (business?.keywords ?? []).join(", "),
    website: business?.website ?? "",
    phone: business?.phone ?? "",
    posting_frequency: (business?.posting_frequency ?? "weekly") as "daily" | "twice-weekly" | "weekly",
    review_link: business?.review_link ?? "",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await save({
        data: {
          name: form.name.trim(),
          category: form.category.trim(),
          city: form.city.trim(),
          brand_tone: form.brand_tone,
          keywords: form.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
            .slice(0, 12),
          website: form.website.trim(),
          phone: form.phone.trim(),
          posting_frequency: form.posting_frequency,
          review_link: form.review_link.trim(),
        },
      });
      toast.success("Business details saved.");
      onSaved(saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="name">Business name</Label>
        <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required minLength={2} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="Dental clinic, gym, bakery…"
          required
          minLength={2}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="city">City</Label>
        <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ahmedabad" required minLength={2} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" />
      </div>
      <div className="space-y-1.5">
        <Label>Brand tone</Label>
        <Select value={form.brand_tone} onValueChange={(v) => set("brand_tone", v as (typeof TONES)[number])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((tone) => (
              <SelectItem key={tone} value={tone} className="capitalize">
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Posting frequency</Label>
        <Select
          value={form.posting_frequency}
          onValueChange={(v) => set("posting_frequency", v as typeof form.posting_frequency)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCIES.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="keywords">Keywords (comma separated)</Label>
        <Input
          id="keywords"
          value={form.keywords}
          onChange={(e) => set("keywords", e.target.value)}
          placeholder="teeth whitening, root canal, family dentist"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="website">Website</Label>
        <Input id="website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="review_link">Google review link</Label>
        <Input
          id="review_link"
          value={form.review_link}
          onChange={(e) => set("review_link", e.target.value)}
          placeholder="https://g.page/r/…/review"
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={busy} className="gradient-brand text-white">
          {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
