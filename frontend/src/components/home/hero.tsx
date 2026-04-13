import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";

export function Hero() {
  return (
    <Section id="home" className="pt-14 sm:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            Rent locally. List easily.
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Rent anything you need, or list what you own.
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            RentalBazar is a two-sided marketplace where you can rent bikes,
            cars, tools, cameras, electronics, and more—or publish your own
            items and earn.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/signup">Rent items</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">List your items</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Items listed", value: "48k+" },
              { label: "Avg. pickup time", value: "2 hrs" },
              { label: "Cities live", value: "120" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-background/80 p-4"
              >
                <p className="text-xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-10 top-10 hidden h-32 w-32 rounded-full bg-primary/10 blur-2xl lg:block" />
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-muted/60 via-background to-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Popular bundle
                </p>
                <p className="text-lg font-semibold">Weekend Creator Kit</p>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Trending
              </span>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                "Mirrorless camera + lens",
                "Portable lighting",
                "Audio recorder",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm"
                >
                  <span className="size-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-border/60 bg-background/90 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Bundle price
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold">₹58</span>
                <span className="text-xs text-muted-foreground">/ day</span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-[72%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                72% of renters extend their booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
