import { Section } from "@/components/site/section";

const listings = [
  {
    name: "DJI Mini 4 Pro",
    location: "San Diego, CA",
    price: "$32",
    meta: "Drone · 4K camera · Extra batteries",
  },
  {
    name: "Makita Tool Set",
    location: "Chicago, IL",
    price: "$18",
    meta: "Driver, drill, saw · Day rental",
  },
  {
    name: "Road Bike Bundle",
    location: "Portland, OR",
    price: "$25",
    meta: "Bike · Helmet · Lock",
  },
];

export function Listings() {
  return (
    <Section id="listings">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Featured listings
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Pick up what you need today
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Every listing is verified for condition, pricing, and availability.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing.name}
              className="flex flex-col justify-between rounded-3xl border border-border/60 bg-background p-5 shadow-sm"
            >
              <div>
                <div className="mb-4 h-32 rounded-2xl bg-gradient-to-br from-muted to-muted/30" />
                <h3 className="text-lg font-semibold">{listing.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {listing.location}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {listing.meta}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-semibold">{listing.price}</span>
                <span className="text-xs text-muted-foreground">per day</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
