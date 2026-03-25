import { Section } from "@/components/site/section";

const testimonials = [
  {
    quote:
      "Booked a camera kit for a weekend shoot and had it in hand the same day.",
    name: "Maya R.",
    role: "Content creator",
  },
  {
    quote:
      "Rented tools for a remodel project without buying anything outright.",
    name: "Kareem L.",
    role: "Homeowner",
  },
];

export function Testimonials() {
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by renters
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Real stories from every category
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-3xl border border-border/60 bg-background p-6"
            >
              <blockquote className="text-base font-medium">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                {testimonial.name} · {testimonial.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
