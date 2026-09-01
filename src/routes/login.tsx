import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Phone,
  Building2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dashboardRedirectUrl, forgotPassword, signIn, signUp } from "@/lib/vizogen-auth";


const title = "Vizogen Login — Sign in to your dashboard";
const description =
  "Sign in or create your Vizogen account to manage AI posts, reviews and replies for your Google Business Profile.";

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

type Mode = "signin" | "signup" | "forgot";

function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setNotice(null);

    if (mode === "forgot") {
      if (!emailOrPhone.trim()) {
        setError("Enter the email or phone linked to your account.");
        return;
      }
      setLoading(true);
      const res = await forgotPassword({ emailOrPhone });
      setLoading(false);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setNotice(res.message || "Password reset instructions have been sent.");
      return;
    }

    if (mode === "signup") {
      if (businessName.trim().length < 2) {
        setError("Enter your business name.");
        return;
      }
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        setError("Enter a valid phone number with country code (e.g. 918488918358).");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    const result =
      mode === "signin"
        ? await signIn({ emailOrPhone, password })
        : await signUp({
            businessName,
            phone,
            email,
            password,
            passwordConfirmation: confirmPassword,
          });

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    window.location.href = dashboardRedirectUrl(result.token);
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
              {mode === "signin"
                ? "Sign in to Vizogen"
                : mode === "signup"
                  ? "Create your Vizogen account"
                  : "Reset your password"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Access your Google Business Profile automation dashboard."
                : mode === "signup"
                  ? "Start automating posts, reviews and replies in minutes."
                  : "Enter your registered email or phone and we'll send reset instructions."}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-1 rounded-full border border-border bg-muted/50 p-1">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "gradient-brand text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Vizogen Marketing"
                      className="pl-9"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (with country code)</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="918488918358"
                      className="pl-9"
                      required
                      maxLength={15}
                    />
                  </div>
                </div>

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
                      required
                      maxLength={255}
                    />
                  </div>
                </div>
              </>
            )}

            {mode !== "signup" && (
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">Email or phone</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="emailOrPhone"
                    autoComplete="username"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="you@business.com"
                    className="pl-9"
                    required
                    maxLength={255}
                  />
                </div>
              </div>
            )}

            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                    required
                    maxLength={100}
                  />
                </div>
              </div>
            )}


            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                    required
                    maxLength={100}
                  />
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full rounded-full gradient-brand shadow-glow transition-transform hover:scale-[1.01] hover:opacity-95"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {mode === "signin" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>
                  {mode === "signin" ? "Sign in to dashboard" : "Create account"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            {mode === "signin" ? (
              <>
                New to Vizogen?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-semibold text-primary hover:underline"
                >
                  Create a free account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in instead
                </button>
              </>
            )}
          </p>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            Want a guided walkthrough?{" "}
            <Link to="/demo" className="font-semibold text-primary hover:underline">
              Book a free demo
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
