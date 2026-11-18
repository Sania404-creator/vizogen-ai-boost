import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { API_PRODUCTS, UPI_ID, priceForWeek, upiLink, type ApiProduct } from "./config";

function usePrice(slug: string) {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    const key = `vz-api-first-${slug}`;
    let first = Number(localStorage.getItem(key));
    if (!first) { first = Date.now(); localStorage.setItem(key, String(first)); }
    setPrice(priceForWeek(first, Date.now()));
  }, [slug]);
  return price;
}

export function ApiCard({ p, detail }: { p: ApiProduct; detail?: boolean }) {
  const price = usePrice(p.slug);
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-foreground">{p.name}</h2>
      <p className="text-muted-foreground">{p.short}</p>
      <ul className="space-y-1 text-sm text-foreground">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
      <p className="text-4xl font-extrabold text-foreground">{price ? `₹${price.toLocaleString("en-IN")}` : "—"}</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild disabled={!price}>
          <a href={price ? upiLink(price, `${p.name} - Vizogen`) : "#"}>Buy Now (UPI)</a>
        </Button>
        {!detail && <Button variant="outline" asChild><Link to={`/apis/${p.slug}` as "/apis/whatsapp-api"}>Details</Link></Button>}
      </div>
      <p className="text-xs text-muted-foreground">UPI ID: {UPI_ID} — phone par Buy Now dabane se UPI app isi amount ke saath khulega.</p>
    </div>
  );
}

export function ApiShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}
export { API_PRODUCTS };
