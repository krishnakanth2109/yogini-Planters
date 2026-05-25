import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Ticket } from "@/lib/seed";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/wellness")({ component: Page });

function Page() {
  const [items, setItems] = useStore<Ticket[]>("tickets", []);
  const [diag, setDiag] = useState<Record<string, string>>({});
  function diagnose(id: string) {
    const text = diag[id];
    if (!text) { toast.error("Add diagnosis text"); return; }
    setItems(p => p.map(t => t.id === id ? { ...t, diagnosis: text, status: "Diagnosed" } : t));
    toast.success("Diagnosis sent");
  }
  function close(id: string) {
    setItems(p => p.map(t => t.id === id ? { ...t, status: "Resolved" } : t));
    toast.success("Case closed");
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Plant wellness tickets" subtitle="Diagnose & treat customer plant issues" />
      <div className="space-y-4">
        {items.map(t => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">{t.created} • {t.customer}</div>
                <h3 className="mt-1 font-display text-lg">{t.issue}</h3>
              </div>
              <Badge tone={statusTone(t.status)}>{t.status}</Badge>
            </div>
            {t.diagnosis && <p className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm"><strong>Diagnosis:</strong> {t.diagnosis}</p>}
            {t.status !== "Resolved" && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input value={diag[t.id] || ""} onChange={(e) => setDiag({ ...diag, [t.id]: e.target.value })} placeholder="Write diagnosis & care plan…" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                <button onClick={() => diagnose(t.id)} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Send diagnosis</button>
                <button onClick={() => close(t.id)} className="rounded-full border border-border px-4 py-2 text-sm">Close case</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
