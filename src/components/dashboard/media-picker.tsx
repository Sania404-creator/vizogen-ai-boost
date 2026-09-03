import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Image as ImageIcon, Loader2, Sparkles, Trash2, Upload, Video, X } from "lucide-react";
import {
  listMedia,
  uploadMedia,
  deleteMedia,
  generatePostImage,
  type MediaItem,
} from "@/lib/media.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const MAX_BYTES = 45 * 1024 * 1024;

async function toBase64(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function MediaPicker({
  imageUrl,
  videoUrl,
  onChange,
}: {
  imageUrl: string;
  videoUrl: string;
  onChange: (next: { imageUrl?: string; videoUrl?: string }) => void;
}) {
  const queryClient = useQueryClient();
  const fetchMedia = useServerFn(listMedia);
  const upload = useServerFn(uploadMedia);
  const remove = useServerFn(deleteMedia);
  const generate = useServerFn(generatePostImage);

  const media = useQuery({ queryKey: ["post-media"], queryFn: () => fetchMedia() });
  const fileInput = useRef<HTMLInputElement>(null);
  const [brief, setBrief] = useState("");

  const select = (item: MediaItem) => {
    if (item.kind === "video") onChange({ videoUrl: item.url });
    else onChange({ imageUrl: item.url });
    toast.success(item.kind === "video" ? "Video attached." : "Image attached.");
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (file.size > MAX_BYTES) throw new Error("Please pick a file under 45MB.");
      const dataBase64 = await toBase64(file);
      return upload({
        data: {
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          dataBase64,
        },
      });
    },
    onSuccess: (item) => {
      void queryClient.invalidateQueries({ queryKey: ["post-media"] });
      select(item);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Upload failed."),
  });

  const generateMutation = useMutation({
    mutationFn: async () => generate({ data: { prompt: brief.trim() } }),
    onSuccess: (item) => {
      void queryClient.invalidateQueries({ queryKey: ["post-media"] });
      select(item);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not generate the image."),
  });

  const items = media.data ?? [];

  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-semibold">Post media</Label>
        {imageUrl || videoUrl ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChange({ imageUrl: "", videoUrl: "" })}
          >
            <X className="mr-1.5 size-3.5" /> Clear
          </Button>
        ) : null}
      </div>

      {imageUrl || videoUrl ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Selected post image"
              className="size-24 rounded-xl border border-border object-cover"
            />
          ) : null}
          {videoUrl ? (
            <video
              src={videoUrl}
              className="h-24 w-40 rounded-xl border border-border object-cover"
              muted
              playsInline
              controls
            />
          ) : null}
        </div>
      ) : null}

      <Tabs defaultValue="library" className="mt-4">
        <TabsList className="w-full">
          <TabsTrigger value="library" className="flex-1">
            <ImageIcon className="mr-1.5 size-3.5" /> Library
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex-1">
            <Sparkles className="mr-1.5 size-3.5" /> AI image
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">
            <Upload className="mr-1.5 size-3.5" /> Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-4">
          {media.isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Your library is empty. Generate an image with AI or upload a photo or video.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => {
                const active = item.url === imageUrl || item.url === videoUrl;
                return (
                  <div key={item.path} className="group relative">
                    <button
                      type="button"
                      onClick={() => select(item)}
                      className={`block w-full overflow-hidden rounded-xl border ${
                        active ? "border-primary ring-2 ring-primary/30" : "border-border"
                      }`}
                    >
                      {item.kind === "video" ? (
                        <span className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
                          <Video className="size-6" />
                        </span>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          loading="lazy"
                          className="aspect-square w-full object-cover"
                        />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label="Delete media"
                      onClick={async () => {
                        await remove({ data: { path: item.path } });
                        if (item.url === imageUrl) onChange({ imageUrl: "" });
                        if (item.url === videoUrl) onChange({ videoUrl: "" });
                        void queryClient.invalidateQueries({ queryKey: ["post-media"] });
                      }}
                      className="absolute right-1 top-1 rounded-lg bg-background/90 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-3">
          <Input
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Monsoon offer banner with an umbrella and 20% off"
          />
          <Button
            type="button"
            onClick={() => {
              if (brief.trim().length < 3) {
                toast.error("Describe the image you want first.");
                return;
              }
              generateMutation.mutate();
            }}
            disabled={generateMutation.isPending}
            className="w-full gradient-brand text-white sm:w-auto"
          >
            {generateMutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            {generateMutation.isPending ? "Painting your image…" : "Generate image with AI"}
          </Button>
          <p className="text-xs text-muted-foreground">
            The image is saved to your library so you can reuse it on future posts.
          </p>
        </TabsContent>

        <TabsContent value="upload" className="mt-4 space-y-3">
          <input
            ref={fileInput}
            type="file"
            accept="image/*,video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) uploadMutation.mutate(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInput.current?.click()}
            disabled={uploadMutation.isPending}
            className="w-full sm:w-auto"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Upload className="mr-2 size-4" />
            )}
            {uploadMutation.isPending ? "Uploading…" : "Choose image or video"}
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or MP4 up to 45MB. Google publishes photos with posts; videos are stored with
            the post for your own channels.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
