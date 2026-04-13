import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/section";
import { Search, MapPin } from "lucide-react";

export function Hero() {
  return (
    <div className="bg-primary pt-14 pb-20 sm:pt-24 sm:pb-28">
      <Section id="home" className="text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Rent anything you need, or list what you own.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 sm:text-xl">
            RentalBazar is a two-sided marketplace where you can rent bikes, cars, tools, cameras, electronics, and more—or publish your own items and earn.
          </p>
          
          <div className="mx-auto max-w-3xl rounded-xl bg-card p-2 shadow-lg sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
                <Input
                  className="w-full border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
                  placeholder="City, Neighborhood or Zip"
                  readOnly
                />
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
                <Input
                  className="w-full border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
                  placeholder="What are you looking for?"
                  readOnly
                />
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto px-8">
                <Link href="/rentals">Search</Link>
              </Button>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-border/50 pt-4">
              <span className="text-sm font-medium text-muted-foreground">Or want to earn money?</span>
              <Button asChild variant="outline" size="sm">
                <Link href="/signup">List your items today</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { label: "Items listed", value: "48k+" },
              { label: "Avg. pickup time", value: "2 hrs" },
              { label: "Cities live", value: "120" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-primary-foreground/10 p-4 text-primary-foreground backdrop-blur-sm border border-primary-foreground/20"
              >
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
