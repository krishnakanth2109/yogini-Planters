import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import wellness from "@/assets/wellness.jpg";

export const Route = createFileRoute("/services/wellness")({
  head: () => ({
    meta: [
      { title: "Plant Wellness & Care — Yogini Planters" },
      { name: "description", content: "Plant health assessment, diagnosis, recovery and seasonal care." },
      { property: "og:image", content: wellness },
    ],
  }),
  component: () => (
    <ServiceDetail
      eyebrow="Wellness & care"
      title="Plant Wellness & Health Care"
      intro="Professional plant care focused on maintaining healthy, thriving, and visually attractive plants — and bringing struggling ones back to life."
      image={wellness}
      provide={["Plant health assessment", "Yellow leaf diagnosis", "Pest and disease inspection", "Soil condition monitoring", "Growth observation", "Plant recovery guidance", "Seasonal care recommendations"]}
      sections={[{ title: "Fertilizing services", bullets: ["Organic fertilizer support", "Nutrient planning", "Seasonal fertilizing", "Soil enrichment", "Growth support", "Plant nourishment guidance"] }]}
    />
  ),
});
