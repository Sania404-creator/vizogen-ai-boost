import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOGIN_URL = "https://login.vizogen.in/sign-in";

const title = "Vizogen Login — Sign in to your dashboard";
const description =
  "Sign in to your Vizogen account to manage AI posts, reviews and replies for your Google Business Profile.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const target = email
    ? `${LOGIN_URL}?email=${encodeURIComponent(email.trim())}`
    : LOGIN_URL;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl rounded-full opacity-25 blur-3xl gradient-brand"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-border rounded-3xl bg-card p-7 shadow-glow sm:p-9"
        >
          <div className="flex flex-col items-center text-center">
            <span className="grid size-12 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-soft">
              <Sparkles className="size-5" />
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground font-display">
              Sign in to Vizogen
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your Google Business Profile automation dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="pl-9"
                  maxLength={255}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  maxLength={100}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full gradient-brand shadow-glow transition-transform hover:scale-[1.01] hover:opacity-95"
            >
              Continue to Vizogen <ExternalLink className="size-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            Sign-in is completed securely on{" "}
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              login.vizogen.in
            </a>
            .
          </p>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            New to Vizogen?{" "}
            <Link to="/demo" className="font-semibold text-primary hover:underline">
              Start Free Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
