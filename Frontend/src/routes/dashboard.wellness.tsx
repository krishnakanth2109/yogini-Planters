import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore, uid } from "@/lib/store";
import type { Ticket } from "@/lib/seed";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/wellness")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useStore<Ticket[]>("tickets", []);
  const [issue, setIssue] = useState("");
  const mine = items.filter(t => t.customer === user?.name);

  function raise() {
    if (!issue) { toast.error("Describe the issue"); return; }
    setItems(p => [{ id: uid(), customer: user?.name || "", issue, status: "Open", created: new Date().toISOString().slice(0,10) }, ...p]);
    setIssue(""); toast.success("Ticket raised. Expert will respond soon.");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Plant wellness support" subtitle="Raise an issue and our experts will diagnose" />
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl">Raise a new issue</h3>
        <textarea rows={3} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Money plant leaves turning yellow…" className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <button onClick={raise} className="mt-3 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Submit ticket</button>
      </div>
      <div className="space-y-3">
        {mine.map(t => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><div className="text-xs text-muted-foreground">{t.created}</div><Badge tone={statusTone(t.status)}>{t.status}</Badge></div>
            <h4 className="mt-1 font-medium">{t.issue}</h4>
            {t.diagnosis && <p className="mt-2 rounded-lg bg-secondary/60 p-3 text-sm"><strong>Expert says:</strong> {t.diagnosis}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
