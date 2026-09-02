import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Star, Loader2, CheckCircle2, MessageSquareHeart } from "lucide-react";
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
      if (data) await supabase.rpc("register_qr_scan", { _slug: slug });
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
      _comment: comment || undefined,
      _customer_name: name || undefined,
      _customer_contact: contact || undefined,
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
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Wonderful! We&apos;ll take you to Google so you can share it publicly.
              </p>
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
