import { Section } from "@/components/site/section";

const steps = [
  {
    title: "Tell us what you need",
    description: "Search by category, location, and rental duration.",
  },
  {
    title: "Compare verified options",
    description: "See availability, pricing, and pickup details instantly.",
  },
  {
    title: "Pick up and return",
    description: "Coordinate with the host and return with ease.",
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-muted/30">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Rent in three simple steps
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-border/60 bg-background p-6"
            >
              <span className="text-xs font-semibold text-muted-foreground">
                Step {index + 1}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
