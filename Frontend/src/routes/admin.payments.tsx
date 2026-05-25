import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Payment } from "@/lib/seed";

export const Route = createFileRoute("/admin/payments")({ component: Page });

function Page() {
  const [items, setItems] = useStore<Payment[]>("payments", []);
  const total = items.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pending = items.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Payments & billing" subtitle="Invoices and payment tracking" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Collected</div><div className="mt-1 font-display text-2xl text-primary">₹{total.toLocaleString("en-IN")}</div></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Pending</div><div className="mt-1 font-display text-2xl text-accent">₹{pending.toLocaleString("en-IN")}</div></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Invoices</div><div className="mt-1 font-display text-2xl">{items.length}</div></div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th><th></th></tr></thead>
          <tbody>{items.map(p => (
            <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">{p.invoice}</td>
              <td className="px-4 py-3">{p.customer}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
              <td className="px-4 py-3">{p.method}</td>
              <td className="px-4 py-3">₹{p.amount.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
              <td className="px-4 py-3"><button onClick={() => setItems(prev => prev.map(x => x.id === p.id ? {...x, status: x.status === "Paid" ? "Pending" : "Paid"} : x))} className="rounded border border-border px-2 py-1 text-xs">Toggle</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
