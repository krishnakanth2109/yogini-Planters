import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

interface Settings { businessName: string; phone: string; email: string; instagram: string; address: string; }

export const Route = createFileRoute("/admin/settings")({ component: Page });

function Page() {
  const [s, setS] = useStore<Settings>("settings", { businessName: "Yogini Planters", phone: "", email: "", instagram: "", address: "" });
  return (
    <div className="space-y-6">
      <PageHeader title="Business settings" subtitle="Manage your business profile" />
      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
        {(["businessName","phone","email","instagram","address"] as const).map(k => (
          <div key={k}>
            <label className="text-xs font-medium capitalize">{k.replace(/([A-Z])/g, " $1")}</label>
            <input value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
        ))}
        <button onClick={() => toast.success("Saved")} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Save settings</button>
      </div>
    </div>
  );
}
