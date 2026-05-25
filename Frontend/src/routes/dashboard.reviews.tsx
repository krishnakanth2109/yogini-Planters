import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { useStore, uid } from "@/lib/store";
import type { Testimonial } from "@/lib/seed";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/reviews")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useStore<Testimonial[]>("testimonials", []);
  const [text, setText] = useState(""); const [rating, setRating] = useState(5);
  function submit() {
    if (!text) { toast.error("Write a review"); return; }
    setItems(p => [{ id: uid(), name: user?.name || "Customer", text, rating, approved: false }, ...p]);
    setText(""); toast.success("Submitted for review");
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Write a review" subtitle="Share your experience" />
      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex gap-1">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)}><Star className={`h-6 w-6 ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`} /></button>
          ))}
        </div>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell us about your experience…" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <button onClick={submit} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Submit review</button>
      </div>
    </div>
  );
}
