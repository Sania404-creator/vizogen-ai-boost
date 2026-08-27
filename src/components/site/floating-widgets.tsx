import { useEffect, useState } from "react";
import { ChatWidget } from "@/components/site/chat-widget";
import { DemoScheduler } from "@/components/site/demo-scheduler";
import { OPEN_DEMO_EVENT, WHATSAPP_URL } from "@/lib/site-contact";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.07 3.3 5.02 4.5.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.11.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.43 1.27 4.87L2 22l5.27-1.26A9.94 9.94 0 0 0 12.02 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.13c-1.6 0-3.09-.46-4.35-1.26l-.31-.19-3.13.75.76-3.06-.2-.32A7.99 7.99 0 0 1 4.03 12c0-4.41 3.58-8 8-8s8 3.59 8 8-3.58 8.13-8 8.13z" />
    </svg>
  );
}

export function FloatingWidgets() {
  const [chatOpen, setChatOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setDemoOpen(true);
    window.addEventListener(OPEN_DEMO_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_DEMO_EVENT, onOpen);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-[85] flex flex-col items-end gap-4">
        {!chatOpen ? (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="group pointer-events-auto relative grid size-14 place-items-center rounded-full text-white shadow-glow transition-transform hover:scale-105"
            style={{ backgroundColor: "#25D366" }}
          >
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full opacity-40"
              style={{ backgroundColor: "#25D366", animationDuration: "3.5s" }}
            />
            <WhatsAppIcon className="relative size-7" />
            <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100 lg:block">
              Chat with us
            </span>
          </a>
        ) : null}

        <div className="pointer-events-auto relative">
          <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
        </div>
      </div>

      <DemoScheduler open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
