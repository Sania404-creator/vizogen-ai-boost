import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Star, Loader2, CheckCircle2, MessageSquareHeart, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/r/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Share your feedback" },
      { name: "description", content: "Tell us how your visit went — it takes 10 seconds." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FeedbackPage,
});

interface ReviewContext {
  business_name: string;
  city: string | null;
  category: string | null;
  keywords: string[] | null;
}

interface QrCode {
  id: string;
  title: string;
  business_name: string;
  review_link: string | null;
}

function FeedbackPage() {
  const { slug } = Route.useParams();
  const [code, setCode] = useState<QrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [ctx, setCtx] = useState<ReviewContext | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase
        .from("qr_codes")
        .select("id, title, business_name, review_link")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      if (!active) return;
      setCode((data as QrCode | null) ?? null);
      setLoading(false);
      if (data) {
        await supabase.rpc("register_qr_scan", { _slug: slug });
        const { data: context } = await supabase.rpc("qr_review_context", { _slug: slug });
        if (active) setCtx(((context as ReviewContext[] | null) ?? [])[0] ?? null);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const submit = async () => {
    if (!rating) {
      toast.error("Pick a star rating first.");
      return;
    }
    setSending(true);
    const { error } = await supabase.rpc("submit_qr_feedback", {
      _slug: slug,
      _rating: rating,
      ...(comment ? { _comment: comment } : {}),
      ...(name ? { _customer_name: name } : {}),
      ...(contact ? { _customer_contact: contact } : {}),
    });
    setSending(false);
    if (error) {
      toast.error("Could not send your feedback. Please try again.");
      return;
    }
    if (rating >= 4 && code?.review_link) {
      window.location.href = code.review_link;
      return;
    }
    setDone(true);
  };

  const keywords = (ctx?.keywords ?? []).filter(Boolean).slice(0, 8);
  const businessName = ctx?.business_name ?? code?.business_name ?? "this business";
  const place = ctx?.city ? ` in ${ctx.city}` : "";
  const suggestions =
    keywords.length > 0
      ? [
          `Great experience with ${businessName}${place}. Went in for ${keywords[0]} and the team was professional and quick. Highly recommended!`,
          `Best ${keywords[1] ?? keywords[0]}${place} I have found. ${businessName} took care of everything and the results were excellent.`,
          `Really happy with ${businessName}. Friendly staff, fair pricing and genuinely good ${keywords[2] ?? keywords[0]}. Will come back.`,
        ]
      : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!code) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <p className="text-muted-foreground">This feedback link is no longer active.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-soft"
      >
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h1 className="mt-4 text-xl font-bold text-foreground font-display">Thank you</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your feedback went straight to the {code.business_name} team.
            </p>
          </div>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <MessageSquareHeart className="size-3.5" /> {code.business_name}
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground font-display">
              {code.title}
            </h1>

            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star`}
                  onClick={() => setRating(value)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-9 ${
                      value <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && rating < 4 ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sorry it fell short. Tell us what happened — this goes privately to the owner.
                </p>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What could we have done better?"
                  rows={4}
                />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" />
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone or email (optional)"
                />
              </div>
            ) : null}

            {rating >= 4 ? (
              <div className="mt-6 space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Wonderful! We&apos;ll take you to Google so you can share it publicly.
                </p>

                {keywords.length > 0 ? (
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Mention one of these in your review
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Reviews that mention what you actually came for help other locals find us on
                      Google.
                    </p>
                  </div>
                ) : null}

                {suggestions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Tap to copy a ready review
                    </p>
                    {suggestions.map((text, index) => (
                      <button
                        key={text}
                        type="button"
                        onClick={() => {
                          void navigator.clipboard.writeText(text);
                          setCopied(index);
                          toast.success("Review copied — paste it on Google.");
                        }}
                        className="flex w-full items-start gap-3 rounded-xl border border-border bg-card p-3 text-left text-sm text-foreground transition-colors hover:border-primary/50"
                      >
                        {copied === index ? (
                          <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Copy className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        )}
                        <span>{text}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <Button
              onClick={submit}
              disabled={sending}
              className="mt-6 w-full gradient-brand text-white"
            >
              {sending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {rating >= 4 ? "Continue to Google" : "Send feedback"}
            </Button>
            <p className="mt-4 text-center text-[0.7rem] text-muted-foreground">
              Powered by Vizogen Magic QR
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
