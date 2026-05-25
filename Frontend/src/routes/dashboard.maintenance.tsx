import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, statusTone } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Subscription } from "@/lib/seed";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/maintenance")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [items] = useStore<Subscription[]>("subscriptions", []);
  const mine = items.filter(s => s.customer === user?.name);
  return (
    <div className="space-y-6">
      <PageHeader title="My maintenance plans" subtitle="Subscription details & schedule" />
      <div className="grid gap-4 md:grid-cols-2">
        {mine.map(s => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between"><h3 className="font-display text-xl">{s.plan} Plan</h3><Badge tone={statusTone(s.status)}>{s.status}</Badge></div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Plants covered</dt><dd>{s.plants}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd>{s.start}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Renewal</dt><dd>{s.renewal}</dd></div>
            </dl>
          </div>
        ))}
        {mine.length === 0 && <div className="md:col-span-2 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No active plans. Visit Maintenance to subscribe.</div>}
      </div>
    </div>
  );
}
