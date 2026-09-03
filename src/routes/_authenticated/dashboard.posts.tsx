import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Send, Trash2, CalendarClock, AlertCircle } from "lucide-react";
import {
  listPosts,
  generatePostDraft,
  savePost,
  deletePost,
  publishPostNow,
  type PostRow,
} from "@/lib/posts.functions";
import { getWorkspace } from "@/lib/workspace.functions";
import { DashboardShell } from "@/components/dashboard/shell";
import { MediaPicker } from "@/components/dashboard/media-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/posts")({
  component: PostsPage,
});

type PostType = "update" | "offer" | "event";

function statusTone(status: string) {
  if (status === "published") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (status === "scheduled") return "bg-primary/10 text-primary border-primary/20";
  if (status === "failed") return "bg-destructive/10 text-destructive border-destructive/20";
  return "bg-muted text-muted-foreground border-border";
}

function PostsPage() {
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchPosts = useServerFn(listPosts);
  const generate = useServerFn(generatePostDraft);
  const save = useServerFn(savePost);
  const remove = useServerFn(deletePost);
  const publish = useServerFn(publishPostNow);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const posts = useQuery({ queryKey: ["posts"], queryFn: () => fetchPosts() });

  const [postType, setPostType] = useState<PostType>("update");
  const [prompt, setPrompt] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const business = workspace.data?.business ?? null;

  const draft = async () => {
    setGenerating(true);
    try {
      const result = await generate({ data: { postType, prompt: prompt.trim() || undefined } });
      setHeadline(result.headline);
      setBody(result.body);
      setCtaLabel(result.cta_label ?? "");
      setCtaUrl(result.cta_url ?? "");
      toast.success("Draft ready — edit anything you like.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate a draft.");
    } finally {
      setGenerating(false);
    }
  };

  const store = async (status: "draft" | "scheduled") => {
    if (!body.trim()) {
      toast.error("Write or generate some post copy first.");
      return;
    }
    if (status === "scheduled" && !scheduledAt) {
      toast.error("Pick a date and time to schedule.");
      return;
    }
    setSaving(true);
    try {
      await save({
        data: {
          post_type: postType,
          headline: headline.trim(),
          body: body.trim(),
          cta_label: ctaLabel.trim(),
          cta_url: ctaUrl.trim(),
          image_url: imageUrl,
          video_url: videoUrl,
          status,
          scheduled_at: status === "scheduled" ? new Date(scheduledAt).toISOString() : null,
        },
      });
      setHeadline("");
      setBody("");
      setPrompt("");
      setImageUrl("");
      setVideoUrl("");
      setScheduledAt("");
      void posts.refetch();
      toast.success(status === "scheduled" ? "Post scheduled." : "Draft saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the post.");
    } finally {
      setSaving(false);
    }
  };

  const publishNow = async (post: PostRow) => {
    setBusyId(post.id);
    const result = await publish({ data: { id: post.id } });
    setBusyId(null);
    void posts.refetch();
    if (result.ok) toast.success(result.message);
    else toast.info(result.message);
  };

  const destroy = async (post: PostRow) => {
    setBusyId(post.id);
    await remove({ data: { id: post.id } });
    setBusyId(null);
    void posts.refetch();
  };

  if (!workspace.isLoading && !business) {
    return (
      <DashboardShell title="AI Posts">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="text-muted-foreground">Add your business details first.</p>
          <Button asChild className="mt-4 gradient-brand text-white">
            <Link to="/dashboard">Go to setup</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="AI Posts"
      subtitle="Generate, edit and schedule Google Business Profile posts."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="space-y-1.5">
              <Label>Post type</Label>
              <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update">What&apos;s new</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prompt">Anything specific? (optional)</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Monsoon offer, 20% off first session…"
              />
            </div>
          </div>

          <Button
            onClick={draft}
            disabled={generating}
            size="lg"
            className="mt-4 w-full gradient-brand text-white sm:w-auto"
          >
            {generating ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            {generating ? "Writing your post…" : "Generate the post"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            The AI writes a Google-ready post using your business name, city, tone and keywords. You
            can edit everything below before saving.
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="body">Post copy</Label>
              <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ctaLabel">Button label</Label>
                <Input id="ctaLabel" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ctaUrl">Button link</Label>
                <Input id="ctaUrl" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} />
              </div>
            </div>
            <MediaPicker
              imageUrl={imageUrl}
              videoUrl={videoUrl}
              onChange={(next) => {
                if (next.imageUrl !== undefined) setImageUrl(next.imageUrl);
                if (next.videoUrl !== undefined) setVideoUrl(next.videoUrl);
              }}
            />
            <div className="space-y-1.5">
              <Label htmlFor="scheduledAt">Schedule for</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => store("draft")} disabled={saving} variant="outline">
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}Save draft
              </Button>
              <Button onClick={() => store("scheduled")} disabled={saving} className="gradient-brand text-white">
                <CalendarClock className="mr-2 size-4" /> Schedule
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Your posts
          </h2>
          {posts.isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (posts.data ?? []).length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No posts yet. Generate your first one.
            </p>
          ) : (
            (posts.data ?? []).map((post) => (
              <div key={post.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className={`capitalize ${statusTone(post.status)}`}>
                    {post.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">{post.post_type}</span>
                </div>
                <p className="mt-2 font-semibold text-foreground">{post.headline || "Untitled post"}</p>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{post.body}</p>
                {post.scheduled_at ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Scheduled {new Date(post.scheduled_at).toLocaleString()}
                  </p>
                ) : null}
                {post.error ? (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {post.error}
                  </p>
                ) : null}
                <div className="mt-3 flex gap-2">
                  {post.status !== "published" ? (
                    <Button size="sm" variant="outline" disabled={busyId === post.id} onClick={() => publishNow(post)}>
                      {busyId === post.id ? (
                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                      ) : (
                        <Send className="mr-2 size-3.5" />
                      )}
                      Publish now
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                    disabled={busyId === post.id}
                    onClick={() => destroy(post)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
