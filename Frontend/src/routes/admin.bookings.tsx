import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Booking } from "@/lib/seed";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({ component: Page });
const statuses: Booking["status"][] = ["Pending","Approved","Scheduled","Ongoing","Completed","Cancelled"];

function Page() {
  const [items, setItems] = useStore<Booking[]>("bookings", []);
  function setStatus(id: string, status: Booking["status"]) {
    setItems(p => p.map(c => c.id === id ? { ...c, status } : c));
    toast.success(`Booking ${status}`);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Service bookings" subtitle={`${items.length} bookings`} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Service</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{c.id.slice(0,6)}</td>
                <td className="px-4 py-3 font-medium">{c.customer}</td>
                <td className="px-4 py-3">{c.service}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.date}</td>
                <td className="px-4 py-3">₹{c.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                <td className="px-4 py-3">
                  <select value={c.status} onChange={(e) => setStatus(c.id, e.target.value as Booking["status"])} className="rounded-md border border-input bg-background px-2 py-1 text-xs">
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
