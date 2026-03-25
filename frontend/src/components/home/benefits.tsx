import { Section } from "@/components/site/section";

const benefits = [
  {
    title: "Verified listings",
    description: "Photos, condition checks, and trusted host profiles.",
  },
  {
    title: "Flexible durations",
    description: "Hourly, daily, or weekly rentals to match your plan.",
  },
  {
    title: "Secure payouts",
    description: "Protected payments for renters and reliable payouts for hosts.",
  },
];

export function Benefits() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Why RentalBazar
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Built for renters and hosts alike
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Whether you are booking a bike for the day or listing a camera for
            the weekend, we keep the process simple and secure.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-3xl border border-border/60 bg-background p-6"
            >
              <h3 className="text-base font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
