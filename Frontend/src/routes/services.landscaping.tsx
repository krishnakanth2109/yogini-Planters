import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import landscape from "@/assets/landscape.jpg";

export const Route = createFileRoute("/services/landscaping")({
  head: () => ({
    meta: [
      { title: "Landscaping Services — Yogini Planters" },
      { name: "description", content: "Professional landscaping for residential and commercial spaces." },
      { property: "og:image", content: landscape },
    ],
  }),
  component: () => (
    <ServiceDetail
      eyebrow="Landscaping"
      title="Landscaping Services"
      intro="Professional landscaping solutions for residential and commercial spaces — designed to create functional and aesthetic outdoor environments."
      image={landscape}
      provide={["Landscape planning", "Garden design", "Plant selection", "Outdoor styling", "Green space development", "Lawn & garden enhancement", "Customized landscape concepts"]}
    />
  ),
});
