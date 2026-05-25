import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Payment } from "@/lib/seed";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/payments")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useStore<Payment[]>("payments", []);
  const mine = items.filter(p => p.customer === user?.name);
  function pay(id: string) { setItems(p => p.map(x => x.id === id ? { ...x, status: "Paid" } : x)); toast.success("Payment successful"); }
  return (
    <div className="space-y-6">
      <PageHeader title="My payments" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th><th></th></tr></thead>
          <tbody>{mine.map(p => (
            <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">{p.invoice}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
              <td className="px-4 py-3">₹{p.amount.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
              <td className="px-4 py-3">{p.status === "Pending" && <button onClick={() => pay(p.id)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Pay now</button>}</td>
            </tr>
          ))}</tbody>
        </table>
        {mine.length === 0 && <div className="p-10 text-center text-muted-foreground">No payments yet.</div>}
      </div>
    </div>
  );
}
