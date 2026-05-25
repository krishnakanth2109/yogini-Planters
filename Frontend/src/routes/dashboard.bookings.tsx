import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Booking } from "@/lib/seed";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/bookings")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useStore<Booking[]>("bookings", []);
  const mine = items.filter(b => b.customer === user?.name);
  function cancel(id: string) { if (!confirm("Cancel this booking?")) return; setItems(p => p.map(b => b.id === id ? { ...b, status: "Cancelled" } : b)); toast.success("Cancelled"); }

  return (
    <div className="space-y-6">
      <PageHeader title="My bookings" subtitle={`${mine.length} total`} />
      <div className="space-y-3">
        {mine.map(b => (
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
            <div>
              <div className="font-medium">{b.service}</div>
              <div className="text-xs text-muted-foreground">{b.date} • {b.address}</div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={statusTone(b.status)}>{b.status}</Badge>
              {b.status !== "Cancelled" && b.status !== "Completed" && <button onClick={() => cancel(b.id)} className="rounded-full border border-border px-3 py-1 text-xs text-rose-600">Cancel</button>}
            </div>
          </div>
        ))}
        {mine.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No bookings yet.</div>}
      </div>
    </div>
  );
}
