import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import indoor from "@/assets/indoor.jpg";
import balcony from "@/assets/balcony.jpg";
import landscape from "@/assets/landscape.jpg";
import wellness from "@/assets/wellness.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Yogini Planters" },
      { name: "description", content: "Indoor plant styling, balcony makeovers, landscaping, plant wellness, fertilizing, and maintenance services." },
      { property: "og:title", content: "Our Services — Yogini Planters" },
    ],
  }),
  component: Services,
});

const list = [
  { title: "Indoor Plant Styling", to: "/services/indoor", img: indoor, desc: "Elegant styling planned for light, AC, furniture and lifestyle." },
  { title: "Balcony Makeovers", to: "/services/balcony", img: balcony, desc: "Peaceful, pollution-resistant green balcony spaces." },
  { title: "Landscaping", to: "/services/landscaping", img: landscape, desc: "Garden design, planting and outdoor styling." },
  { title: "Plant Wellness", to: "/services/wellness", img: wellness, desc: "Diagnosis, treatment and recovery for unhealthy plants." },
  { title: "Fertilizing", to: "/services/wellness", img: wellness, desc: "Organic nutrient planning and seasonal soil enrichment." },
  { title: "Maintenance Plans", to: "/maintenance", img: indoor, desc: "Partial or fully customized professional care plans." },
];

function Services() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Services</p>
        <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Complete plant solutions</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">From thoughtful styling to long-term wellness — choose what your space needs.</p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link key={s.title} to={s.to} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">View <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
