import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageSquareText, Send, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askVizogenAssistant } from "@/lib/chat.functions";
import { WHATSAPP_URL, openDemoScheduler } from "@/lib/site-contact";
import logoAsset from "@/assets/vizogen-logo.png.asset.json";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the Vizogen Assistant. Ask me anything about pricing, features, or how to get started — or I can connect you with our team.",
};

const QUICK_REPLIES = [
  "What does Vizogen do?",
  "See pricing",
  "Book a demo",
  "Talk to a human",
];

export function ChatWidget({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askVizogenAssistant);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || pending) return;
    setInput("");
    const history = [...messages, { role: "user" as const, content: value }];
    setMessages(history);
    setPending(true);
    try {
      const { reply } = await ask({
        data: { messages: history.filter((m) => m.content !== WELCOME.content) },
      });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Something went wrong on my side. Please WhatsApp us at +91 84889 18358 and we'll help right away.",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const onQuickReply = (label: string) => {
    if (label === "Book a demo") {
      onOpenChange(false);
      openDemoScheduler();
      return;
    }
    if (label === "Talk to a human") {
      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
      return;
    }
    void send(label);
  };

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] flex flex-col bg-card shadow-glow sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[480px] sm:w-[360px] sm:rounded-3xl sm:border sm:border-border"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <img src={logoAsset.url} alt="Vizogen" className="h-8 w-auto object-contain" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  Vizogen Assistant
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500" /> Online
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close chat"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "gradient-brand text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => onQuickReply(q)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand/60 hover:bg-brand/5"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : null}

              {pending ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                    Thinking…
                  </div>
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-border px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, features…"
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-brand/60"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                aria-label="Send message"
                className="grid size-10 shrink-0 place-items-center rounded-full gradient-brand text-white shadow-soft transition-opacity disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-label="Open Vizogen Assistant"
          className="group grid size-14 place-items-center rounded-full gradient-brand text-white shadow-glow transition-transform hover:scale-105"
        >
          <MessageSquareText className="size-6" />
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100 lg:block">
            Ask Vizogen AI
          </span>
        </button>
      ) : null}
    </>
  );
}
