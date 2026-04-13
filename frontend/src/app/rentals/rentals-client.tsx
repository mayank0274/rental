"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Section } from "@/components/site/section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/components/home/categories";
import { rentalsApi } from "@/lib/api/rentals-api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const formatPrice = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;

const categoryOptions = [
  { name: "All", value: "all", description: "Every available listing." },
  ...categories,
];

export function RentalsClient({
  initialCategory = "all",
  lockCategory = false,
}: {
  initialCategory?: string;
  lockCategory?: boolean;
}) {
  const [category, setCategory] = useState<string>(initialCategory || "all");
  const [page, setPage] = useState<number>(1);
  const [categorySearch, setCategorySearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase();
    if (!query) return categoryOptions;
    return categoryOptions.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [categorySearch]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["rentals", category, page, PAGE_SIZE],
    queryFn: () =>
      rentalsApi.list({
        category: category === "all" ? undefined : category,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const details = data?.success ? data.data?.details : undefined;
  const items = details?.items ?? [];
  const pagination = details?.pagination;
  const total = pagination?.total ?? items.length;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = pagination?.hasPrev ?? page > 1;
  const canNext = pagination?.hasNext ?? page < totalPages;

  const handleCategoryChange = (value: string) => {
    if (lockCategory) return;
    setCategory(value);
    setPage(1);
  };

  return (
    <Section>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Rentals
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Find the right rental in minutes
              </h1>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Browse listings by category, compare prices, and book what you
              need with confidence.
            </p>
          </div>

          {!lockCategory && (
            <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-muted/20 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-xs">
                  <Input
                    placeholder="Search categories"
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                    aria-label="Search categories"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {isFetching ? "Updating results..." : `${total} rentals`}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredCategories.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    No categories match that search.
                  </span>
                ) : (
                  filteredCategories.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleCategoryChange(item.value)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs font-medium transition",
                        category === item.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {items.length} of {total} rentals
            </span>
            {pagination && (
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
            )}
          </div>

          {isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
              We couldn&apos;t load rentals right now. Please try again.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-background p-5 shadow-sm"
                    >
                      <div className="h-36 rounded-2xl bg-muted" />
                      <div className="h-4 w-3/4 rounded-full bg-muted" />
                      <div className="h-3 w-1/2 rounded-full bg-muted" />
                      <div className="h-3 w-2/3 rounded-full bg-muted" />
                    </div>
                  ))
                : items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/rental/${item.slug}`}
                      className="group flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="relative h-36 overflow-hidden rounded-2xl bg-muted">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.title || item.description}
                              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/30" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {item.title || item.description}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {[
                              item.location_city,
                              item.location_state,
                              item.location_country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Location not specified"}
                          </p>
                        </div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          {formatPrice(item.price_per_day)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          per day
                        </span>
                      </div>
                    </Link>
                  ))}
            </div>
          )}

          {!isLoading && items.length === 0 && !isError && (
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
              No rentals found for this category yet. Try another category or
              check back soon.
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background p-4">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!canPrev || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={!canNext || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
