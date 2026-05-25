import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Testimonial } from "@/lib/seed";
import { Star, Check, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials")({ component: Page });

function Page() {
  const [items, setItems] = useStore<Testimonial[]>("testimonials", []);
  function toggle(id: string) { setItems(p => p.map(t => t.id === id ? { ...t, approved: !t.approved } : t)); toast.success("Updated"); }
  function del(id: string) { if (!confirm("Delete?")) return; setItems(p => p.filter(t => t.id !== id)); }
  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" subtitle="Moderate customer reviews" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(t => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="flex text-accent">{Array.from({length: t.rating}).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              </div>
              <Badge tone={t.approved ? "success" : "warn"}>{t.approved ? "Live" : "Hidden"}</Badge>
            </div>
            <p className="mt-3 text-sm text-foreground/80">"{t.text}"</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => toggle(t.id)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs">
                {t.approved ? <><EyeOff className="h-3 w-3"/> Hide</> : <><Check className="h-3 w-3"/> Approve</>}
              </button>
              <button onClick={() => del(t.id)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-rose-600"><Trash2 className="h-3 w-3"/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
