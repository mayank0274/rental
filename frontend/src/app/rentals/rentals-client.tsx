"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Section } from "@/components/site/section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/components/home/categories";
import { rentalsApi } from "@/lib/api/rentals-api";
import { cn } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Consolidate state into a single object
  const [filters, setFilters] = useState({
    category: initialCategory || searchParams.get("category") || "all",
    title: searchParams.get("title") || "",
    city: searchParams.get("city") || "",
    page: Number(searchParams.get("page")) || 1,
    categorySearch: ""
  });

  // Sync internal state with URL params (handles back/forward navigation and direct link entry)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get("category") || initialCategory || "all",
      title: searchParams.get("title") || "",
      city: searchParams.get("city") || "",
      page: Number(searchParams.get("page")) || 1,
    }));
  }, [searchParams, initialCategory]);

  const filteredCategories = useMemo(() => {
    const query = filters.categorySearch.trim().toLowerCase();
    if (!query) return categoryOptions;
    return categoryOptions.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [filters.categorySearch]);

  // Use URL params as the ground truth for data fetching
  // This removes the need for separate "applied" states
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [
      "rentals",
      searchParams.get("category") || initialCategory || "all",
      searchParams.get("title") || "",
      searchParams.get("city") || "",
      searchParams.get("page") || "1",
      PAGE_SIZE
    ],
    queryFn: () =>
      rentalsApi.list({
        category: (searchParams.get("category") || initialCategory || "all") === "all" 
          ? undefined 
          : (searchParams.get("category") || initialCategory || "all"),
        title: searchParams.get("title") || undefined,
        city: searchParams.get("city") || undefined,
        page: Number(searchParams.get("page")) || 1,
        limit: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const details = data?.success ? data.data?.details : undefined;
  const items = details?.items ?? [];
  const pagination = details?.pagination;
  const total = pagination?.total ?? items.length;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = pagination?.hasPrev ?? filters.page > 1;
  const canNext = pagination?.hasNext ?? filters.page < totalPages;

  const updateUrl = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
      else params.delete(key);
    });
    router.replace(`/rentals?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (value: string) => {
    if (lockCategory) return;
    updateUrl({ category: value, page: 1 });
  };

  const handleAdvancedSearch = () => {
    updateUrl({ 
      title: filters.title, 
      city: filters.city, 
      page: 1 
    });
  };

  const handleClearFilters = () => {
    setFilters(prev => ({
      ...prev,
      title: "",
      city: "",
      category: "all",
      categorySearch: "",
      page: 1
    }));
    router.replace("/rentals", { scroll: false });
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
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border bg-card p-2 shadow-sm mb-2 max-w-4xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                      className="w-full border-0 bg-transparent pl-9 text-sm shadow-none focus-visible:ring-0"
                      placeholder="City or location"
                      value={filters.city}
                      onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAdvancedSearch()}
                    />
                  </div>
                  <div className="hidden h-8 w-px bg-border sm:block" />
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                      className="w-full border-0 bg-transparent pl-9 text-sm shadow-none focus-visible:ring-0"
                      placeholder="What are you looking for?"
                      value={filters.title}
                      onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAdvancedSearch()}
                    />
                  </div>
                  <div className="flex items-center gap-2 px-2 sm:px-0">
                    <Button size="sm" className="w-full sm:w-auto px-6" onClick={handleAdvancedSearch}>
                      Search
                    </Button>
                    {(searchParams.get("title") || searchParams.get("city") || filters.category !== "all" || filters.categorySearch) && (
                      <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/20 p-5 sm:p-6 mt-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="w-full sm:max-w-xs">
                    <Input
                      placeholder="Filter categories..."
                      value={filters.categorySearch}
                      onChange={(event) => setFilters(prev => ({ ...prev, categorySearch: event.target.value }))}
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
                          filters.category === item.value
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
                      className="flex flex-col rounded-lg border bg-card shadow-sm"
                    >
                      <div className="h-48 rounded-t-lg bg-muted" />
                      <div className="p-4 flex flex-col gap-3">
                        <div className="h-5 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-1/2 rounded bg-muted" />
                        <div className="mt-2 h-6 w-1/3 rounded bg-muted" />
                      </div>
                    </div>
                  ))
                : items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/rental/${item.slug}`}
                      className="group flex flex-col rounded-lg border bg-card shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative h-48 overflow-hidden rounded-t-lg bg-muted/30">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title || item.description}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted/40">
                            <span className="text-muted-foreground text-sm uppercase">No Image</span>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 rounded bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur text-foreground uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-col p-4">
                        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
                          {item.title || item.description}
                        </h3>
                        
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" />
                          <span className="line-clamp-1">
                            {[
                              item.location_city,
                              item.location_state,
                              item.location_country,
                            ].filter(Boolean).join(", ") || "Location not specified"}
                          </span>
                        </div>
                        
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(item.price_per_day)}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium uppercase">
                            / day
                          </span>
                        </div>
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
            Page {filters.page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrl({ page: Math.max(1, filters.page - 1) })}
              disabled={!canPrev || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrl({ page: Math.min(totalPages, filters.page + 1) })}
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
