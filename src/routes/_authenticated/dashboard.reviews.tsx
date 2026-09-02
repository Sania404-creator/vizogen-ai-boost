import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, Sparkles, Send, Star, AlertCircle } from "lucide-react";
import {
  listReviewRows,
  syncReviews,
  draftReviewReply,
  sendReviewReply,
  type ReviewRow,
} from "@/lib/reviews.functions";
import { getWorkspace } from "@/lib/workspace.functions";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchReviews = useServerFn(listReviewRows);
  const sync = useServerFn(syncReviews);
  const draft = useServerFn(draftReviewReply);
  const send = useServerFn(sendReviewReply);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const reviews = useQuery({ queryKey: ["reviews"], queryFn: () => fetchReviews() });

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const business = workspace.data?.business ?? null;
  const connected = Boolean(business?.google_location_id);

  const runSync = async () => {
    setSyncing(true);
    const result = await sync();
    setSyncing(false);
    if (result.error) toast.info(result.error.message);
    else toast.success(`Synced ${result.synced} review${result.synced === 1 ? "" : "s"}.`);
    void reviews.refetch();
  };

  const makeDraft = async (review: ReviewRow) => {
    setBusyId(review.id);
    try {
      const result = await draft({ data: { id: review.id } });
      setDrafts((prev) => ({ ...prev, [review.id]: result.reply }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not draft a reply.");
    } finally {
      setBusyId(null);
    }
  };

  const sendReply = async (review: ReviewRow) => {
    const reply = drafts[review.id] ?? review.reply_text ?? "";
    if (reply.trim().length < 2) {
      toast.error("Write a reply first.");
      return;
    }
    setBusyId(review.id);
    const result = await send({ data: { id: review.id, reply: reply.trim() } });
    setBusyId(null);
    void reviews.refetch();
    if (result.ok) toast.success(result.message);
    else toast.info(result.message);
  };

  return (
    <DashboardShell
      title="Reviews"
      subtitle="Pull in Google reviews and reply with AI-written responses you approve."
      actions={
        <Button onClick={runSync} disabled={syncing} variant="outline" className="gap-2">
          {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Sync
        </Button>
      }
    >
      {!connected ? (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-semibold text-foreground">Google location not connected</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your profile to import real reviews. Replies you write now are saved and posted
            automatically once the connection is live.
          </p>
          <Button asChild size="sm" className="mt-3 gradient-brand text-white">
            <Link to="/dashboard/settings">Connect Google</Link>
          </Button>
        </div>
      ) : null}

      {reviews.isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (reviews.data ?? []).length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No reviews yet. Hit Sync once your Google location is connected.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {(reviews.data ?? []).map((review) => (
            <div key={review.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`size-4 ${n <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <Badge variant="outline" className="capitalize">
                  {review.reply_status}
                </Badge>
              </div>
              <p className="mt-3 font-semibold text-foreground">{review.reviewer_name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {review.comment || "No comment left."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(review.reviewed_at).toLocaleDateString()}
              </p>

              <Textarea
                className="mt-4"
                rows={4}
                placeholder="Your reply…"
                value={drafts[review.id] ?? review.reply_text ?? ""}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
              />
              {review.error ? (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {review.error}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === review.id}
                  onClick={() => makeDraft(review)}
                >
                  {busyId === review.id ? (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 size-3.5" />
                  )}
                  AI reply
                </Button>
                <Button
                  size="sm"
                  className="gradient-brand text-white"
                  disabled={busyId === review.id}
                  onClick={() => sendReply(review)}
                >
                  <Send className="mr-2 size-3.5" /> Send
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
