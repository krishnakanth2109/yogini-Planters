import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import { Heart, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/wishlist")({ component: Page });

const all = ["Indoor Plant Styling","Balcony Makeover","Landscaping","Plant Wellness","Partial Maintenance","Fully Customized Maintenance"];

function Page() {
  const [items, setItems] = useStore<string[]>("wishlist", ["Balcony Makeover","Plant Wellness"]);
  function toggle(s: string) {
    setItems(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    toast.success("Wishlist updated");
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Wishlist" subtitle="Save services for later" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {all.map(s => {
          const saved = items.includes(s);
          return (
            <div key={s} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
              <div className="font-medium">{s}</div>
              <button onClick={() => toggle(s)} className={`rounded-full p-2 ${saved ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                {saved ? <X className="h-4 w-4"/> : <Heart className="h-4 w-4"/>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
