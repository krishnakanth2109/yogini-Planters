import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/library")({ component: Page });

const guides = [
  { t: "Watering basics", d: "Most indoor plants prefer to dry out between waterings. Check the top inch of soil — water only when it feels dry." },
  { t: "Light requirements", d: "Bright indirect light suits most tropical plants. Snake plants and ZZ tolerate low light." },
  { t: "Fertilizing schedule", d: "Feed monthly during growing season (Mar–Sept) with diluted organic fertilizer." },
  { t: "Yellow leaves", d: "Usually overwatering. Allow soil to dry, check drainage, reduce frequency." },
  { t: "Pest control", d: "Wipe leaves with neem oil weekly. Isolate infested plants immediately." },
  { t: "Seasonal care", d: "Reduce watering in monsoon; protect plants from direct sun in peak summer." },
];

function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Plant care library" subtitle="Tips & guides for healthy plants" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map(g => (
          <div key={g.t} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-lg text-primary">{g.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{g.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
