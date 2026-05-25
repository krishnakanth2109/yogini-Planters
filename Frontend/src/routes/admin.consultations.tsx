import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Consultation } from "@/lib/seed";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/consultations")({ component: Page });

const statuses: Consultation["status"][] = ["New","Scheduled","In Progress","Completed","Cancelled"];

function Page() {
  const [items, setItems] = useStore<Consultation[]>("consultations", []);

  function setStatus(id: string, status: Consultation["status"]) {
    setItems(p => p.map(c => c.id === id ? { ...c, status } : c));
    toast.success(`Marked ${status}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" subtitle="Review and schedule consultation requests" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Notes</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.customer}</td>
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.date}</td>
                <td className="px-4 py-3 max-w-xs text-muted-foreground">{c.notes}</td>
                <td className="px-4 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                <td className="px-4 py-3">
                  <select value={c.status} onChange={(e) => setStatus(c.id, e.target.value as Consultation["status"])} className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
