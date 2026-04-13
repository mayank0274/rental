import Link from "next/link";
import { Section } from "@/components/site/section";
import { 
  Bike, Car, Wrench, Camera, Laptop, Armchair, 
  Activity, Tent, PartyPopper, Baby, Music, Shirt, BookOpen, Package 
} from "lucide-react";

export const categories = [
  { name: "Bikes", value: "bikes", description: "Commute, cruise, or hit the trail.", icon: Bike },
  { name: "Cars", value: "cars", description: "City trips, weekends, and getaways.", icon: Car },
  { name: "Tools", value: "tools", description: "DIY projects without buying the gear.", icon: Wrench },
  { name: "Cameras", value: "cameras", description: "Capture moments with pro setups.", icon: Camera },
  { name: "Electronics", value: "electronics", description: "Speakers, monitors, and gadgets.", icon: Laptop },
  { name: "Furniture", value: "furniture", description: "Stage, host, or upgrade a space.", icon: Armchair },
  { name: "Sports", value: "sports", description: "Gear for every season and sport.", icon: Activity },
  { name: "Outdoor", value: "outdoor", description: "Camping, hiking, and adventure kits.", icon: Tent },
  { name: "Party", value: "party", description: "Decor, lighting, and event essentials.", icon: PartyPopper },
  { name: "Baby", value: "baby", description: "Travel-friendly baby gear on demand.", icon: Baby },
  { name: "Music", value: "music", description: "Instruments and studio equipment.", icon: Music },
  { name: "Costumes", value: "costumes", description: "Theme nights, performances, and cosplay.", icon: Shirt },
  { name: "Books", value: "books", description: "Textbooks and specialty collections.", icon: BookOpen },
  { name: "Other", value: "other", description: "Anything else you want to rent out.", icon: Package },
];

export function Categories() {
  return (
    <Section id="categories" className="bg-background py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-center text-foreground sm:text-3xl">
          Explore Categories
        </h2>
        
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/rentals/${category.value}`}
                className="group flex flex-col items-center justify-start gap-3 rounded-lg p-2 transition hover:bg-muted/50"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-16">
                  <Icon className="size-6 sm:size-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-center text-xs font-medium text-foreground sm:text-sm">
                  {category.name}
                </h3>
              </Link>
            )
          })}
        </div>
      </div>
    </Section>
  );
}
