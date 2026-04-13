"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Section } from "@/components/site/section";
import { rentalsApi } from "@/lib/api/rentals-api";

const formatPrice = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;

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
        <HomeListingsGrid />
      </div>
    </Section>
  );
}

function HomeListingsGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-listings"],
    queryFn: () => rentalsApi.list({ limit: 3 }),
  });

  const items = data?.success ? data.data?.details?.items ?? [] : [];

  if (isError) {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
        Featured listings are unavailable right now.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`home-listing-skeleton-${index}`}
            className="h-64 rounded-3xl border border-border/60 bg-muted/30"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
        No listings to show yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((listing) => (
        <Link
          key={listing.id}
          href={`/rental/${listing.slug}`}
          className="group flex flex-col justify-between rounded-3xl border border-border/60 bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div>
            <div className="mb-4 h-32 overflow-hidden rounded-2xl bg-muted">
              {listing.images?.[0] ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title || listing.description}
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-muted/30" />
              )}
            </div>
            <h3 className="text-lg font-semibold group-hover:text-primary">
              {listing.title || listing.description}
            </h3>
            <p className="text-sm text-muted-foreground">
              {[listing.location_city, listing.location_state, listing.location_country]
                .filter(Boolean)
                .join(", ") || "Location not specified"}
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-lg font-semibold">
              {formatPrice(listing.price_per_day)}
            </span>
            <span className="text-xs text-muted-foreground">per day</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
