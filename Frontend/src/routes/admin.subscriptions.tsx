import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Subscription } from "@/lib/seed";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subscriptions")({ component: Page });

function Page() {
  const [items, setItems] = useStore<Subscription[]>("subscriptions", []);
  function action(id: string, status: Subscription["status"]) {
    setItems(p => p.map(c => c.id === id ? { ...c, status } : c));
    toast.success(`Plan ${status}`);
  }
  function renew(id: string) {
    setItems(p => p.map(c => {
      if (c.id !== id) return c;
      const d = new Date(c.renewal); d.setMonth(d.getMonth() + 6);
      return { ...c, renewal: d.toISOString().slice(0,10), status: "Active" };
    }));
    toast.success("Plan renewed");
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance subscriptions" subtitle="Manage active plans" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(s => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl">{s.customer}</div>
                <div className="text-xs text-muted-foreground">{s.plan} • {s.plants} plants</div>
              </div>
              <Badge tone={statusTone(s.status)}>{s.status}</Badge>
            </div>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd>{s.start}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Renewal</dt><dd>{s.renewal}</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.status === "Active" && <button onClick={() => action(s.id, "Paused")} className="rounded-full border border-border px-3 py-1 text-xs">Pause</button>}
              {s.status === "Paused" && <button onClick={() => action(s.id, "Active")} className="rounded-full border border-border px-3 py-1 text-xs">Resume</button>}
              <button onClick={() => renew(s.id)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Renew +6mo</button>
              {s.status !== "Cancelled" && <button onClick={() => action(s.id, "Cancelled")} className="rounded-full border border-border px-3 py-1 text-xs text-rose-600">Cancel</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
