import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const LOGIN_URL = "https://login.vizogen.in/sign-in";

export const Route = createFileRoute("/post-management")({
  head: () => ({
    meta: [
      { title: "Post Management — Vizogen" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PostManagement,
});

function PostManagement() {
  const navigate = useNavigate();

  useEffect(() => {
    window.open(LOGIN_URL, "_blank", "noopener,noreferrer");
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center text-muted-foreground">
      <p className="text-sm">Opening your Vizogen dashboard…</p>
    </div>
  );
}
