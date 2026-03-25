import { Section } from "@/components/site/section";

const categories = [
  { name: "Bikes", description: "Commute, cruise, or hit the trail." },
  { name: "Cars", description: "City trips, weekends, and getaways." },
  { name: "Tools", description: "DIY projects without buying the gear." },
  { name: "Cameras", description: "Capture moments with pro setups." },
  { name: "Electronics", description: "Speakers, monitors, and gadgets." },
  { name: "Furniture", description: "Stage, host, or upgrade a space." },
  { name: "Sports", description: "Gear for every season and sport." },
  { name: "Outdoor", description: "Camping, hiking, and adventure kits." },
  { name: "Party", description: "Decor, lighting, and event essentials." },
  { name: "Baby", description: "Travel-friendly baby gear on demand." },
  { name: "Music", description: "Instruments and studio equipment." },
  { name: "Costumes", description: "Theme nights, performances, and cosplay." },
  { name: "Books", description: "Textbooks and specialty collections." },
  { name: "Other", description: "Anything else you want to rent out." },
];

export function Categories() {
  return (
    <Section id="categories" className="bg-muted/30">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Categories
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Rent across every category
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            From everyday essentials to specialty gear, discover what you need
            nearby.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-3xl border border-border/60 bg-background p-6"
            >
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
