import Link from "next/link";
import { Section } from "@/components/site/section";

export const categories = [
  {
    name: "Bikes",
    value: "bikes",
    description: "Commute, cruise, or hit the trail.",
  },
  {
    name: "Cars",
    value: "cars",
    description: "City trips, weekends, and getaways.",
  },
  {
    name: "Tools",
    value: "tools",
    description: "DIY projects without buying the gear.",
  },
  {
    name: "Cameras",
    value: "cameras",
    description: "Capture moments with pro setups.",
  },
  {
    name: "Electronics",
    value: "electronics",
    description: "Speakers, monitors, and gadgets.",
  },
  {
    name: "Furniture",
    value: "furniture",
    description: "Stage, host, or upgrade a space.",
  },
  {
    name: "Sports",
    value: "sports",
    description: "Gear for every season and sport.",
  },
  {
    name: "Outdoor",
    value: "outdoor",
    description: "Camping, hiking, and adventure kits.",
  },
  {
    name: "Party",
    value: "party",
    description: "Decor, lighting, and event essentials.",
  },
  {
    name: "Baby",
    value: "baby",
    description: "Travel-friendly baby gear on demand.",
  },
  {
    name: "Music",
    value: "music",
    description: "Instruments and studio equipment.",
  },
  {
    name: "Costumes",
    value: "costumes",
    description: "Theme nights, performances, and cosplay.",
  },
  {
    name: "Books",
    value: "books",
    description: "Textbooks and specialty collections.",
  },
  {
    name: "Other",
    value: "other",
    description: "Anything else you want to rent out.",
  },
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
            <Link
              key={category.name}
              href={`/rentals/${category.value}`}
              className="group rounded-3xl border border-border/60 bg-background p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold group-hover:text-primary">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
