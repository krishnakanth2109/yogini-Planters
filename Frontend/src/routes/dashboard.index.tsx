import { createFileRoute } from "@tanstack/react-router";
import { StatCard, PageHeader } from "@/components/dashboard/DashboardShell";
import { useStore } from "@/lib/store";
import type { Booking, Subscription, Ticket, Payment, Notification } from "@/lib/seed";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [bookings] = useStore<Booking[]>("bookings", []);
  const [subs] = useStore<Subscription[]>("subscriptions", []);
  const [tickets] = useStore<Ticket[]>("tickets", []);
  const [payments] = useStore<Payment[]>("payments", []);
  const [notifs] = useStore<Notification[]>("notifications", []);

  const mine = (s: string) => s === user?.name;
  const myBookings = bookings.filter(b => mine(b.customer));
  const mySubs = subs.filter(s => mine(s.customer));
  const myTickets = tickets.filter(t => mine(t.customer));
  const myPending = payments.filter(p => mine(p.customer) && p.status === "Pending");

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome back, ${user?.name?.split(" ")[0]}`} subtitle="Your plant wellness summary" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active bookings" value={myBookings.filter(b => !["Completed","Cancelled"].includes(b.status)).length} />
        <StatCard label="Maintenance plans" value={mySubs.filter(s => s.status === "Active").length} />
        <StatCard label="Wellness tickets" value={myTickets.length} />
        <StatCard label="Pending payments" value={`₹${myPending.reduce((s,p)=>s+p.amount,0).toLocaleString("en-IN")}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl">Quick actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link to="/dashboard/book" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">Book a service</div><div className="text-xs text-muted-foreground">Indoor, balcony, wellness…</div></Link>
            <Link to="/dashboard/wellness" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">Raise plant issue</div><div className="text-xs text-muted-foreground">Get expert diagnosis</div></Link>
            <Link to="/dashboard/maintenance" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">View my plan</div><div className="text-xs text-muted-foreground">Maintenance schedule</div></Link>
            <Link to="/dashboard/library" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">Plant care library</div><div className="text-xs text-muted-foreground">Tips & guides</div></Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl">Recent notifications</h3>
          <ul className="mt-4 space-y-3">
            {notifs.slice(0,4).map(n => (
              <li key={n.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
