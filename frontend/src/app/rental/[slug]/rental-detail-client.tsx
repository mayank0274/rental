"use client";

import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, MapPin, Tag, User, Phone, Mail, CalendarDays } from "lucide-react";

import { rentalsApi } from "@/lib/api/rentals-api";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ChatSheet } from "@/components/chat/chat-sheet";

const formatPrice = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;

export function RentalDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rental-detail", slug],
    queryFn: () => rentalsApi.getBySlug(slug),
  });

  const rental = data?.success ? data.data?.details : undefined;

  useEffect(() => {
    setActiveImage(0);
  }, [slug, rental?.images?.length]);

  if (isLoading) {
    return (
      <Section className="min-h-screen py-8 lg:py-12">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="h-10 w-2/3 rounded-lg bg-muted animate-pulse" />
            <div className="h-5 w-1/3 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="aspect-[4/3] lg:aspect-[21/9] w-full rounded-lg bg-muted animate-pulse" />
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 w-full rounded-lg bg-muted animate-pulse" />
              <div className="h-6 w-5/6 rounded-lg bg-muted animate-pulse" />
              <div className="h-6 w-4/6 rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="h-64 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </Section>
    );
  }

  if (isError || !rental) {
    return (
      <Section className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Rental not found</h2>
          <p className="max-w-[400px] text-sm text-muted-foreground">
            We couldn&apos;t find this rental. It may have been removed or the URL is incorrect.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </Section>
    );
  }

  const location = [
    rental.location_city,
    rental.location_state,
    rental.location_country,
  ]
    .filter(Boolean)
    .join(", ");

  const createdAt = rental.created_at ? new Date(rental.created_at) : null;
  const timeAgo = createdAt ? formatDistanceToNow(createdAt, { addSuffix: true }) : null;

  return (
    <Section className="min-h-screen pb-24 pt-8 lg:pt-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {rental.title || rental.description}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 capitalize transition-colors hover:text-foreground">
              <Tag className="h-4 w-4" />
              <span>{rental.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                {rental.status === 'available' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${rental.status === 'available' ? 'bg-emerald-500' : rental.status === 'paused' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="capitalize">{rental.status}</span>
            </div>
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px] lg:gap-12 pt-4">

          {/* Main Content Area */}
          <div className="flex w-full min-w-0 flex-col gap-10">
            {/* Interactive Image Gallery (Moved above description) */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/3] lg:aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted border border-border">
                {rental.images?.[activeImage] ? (
                  <img
                    src={rental.images[activeImage]}
                    alt={rental.title || rental.description}
                    className="h-full w-full object-contain bg-muted/20 transition-opacity duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/30">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
                {rental.images && rental.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs font-medium text-white backdrop-blur-md">
                    {activeImage + 1} / {rental.images.length}
                  </div>
                )}
              </div>

              {rental.images && rental.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide">
                  {rental.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`group relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${activeImage === index ? "border-primary ring-2 ring-primary/20 ring-offset-1" : "border-transparent hover:border-border/80 opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${rental.title || "Rental"} preview ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {activeImage !== index && (
                        <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-foreground">About this rental</h2>
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-sm">
                  {rental.description}
                </p>
              </div>
            </div>

            <hr className="border-border" />

            {/* Publisher Section */}
            {(rental.publisher?.name || rental.publisher?.email || rental.publisher?.phone) && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-semibold tracking-tight">Meet the owner</h2>
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {rental.publisher?.name && (
                      <p className="text-lg font-medium tracking-tight">{rental.publisher.name}</p>
                    )}
                    {timeAgo && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <p>Listed {timeAgo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="sticky top-24 relative flex w-full flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-primary">{formatPrice(rental.price_per_day)}</span>
                <span className="text-muted-foreground font-medium uppercase text-xs">/ day</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <ChatSheet 
                itemId={rental.id}
                publisherId={rental.user_id}
                itemTitle={rental.title || rental.description}
                publisherName={rental.publisher?.name || "Owner"}
              />

              {rental.publisher?.phone && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 text-base font-semibold bg-background hover:bg-muted"
                  onClick={() => window.location.href = `tel:${rental.publisher?.phone}`}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call {rental.publisher.phone}
                </Button>
              )}

              {rental.publisher?.email && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 text-base font-semibold bg-background hover:bg-muted"
                  onClick={() => window.location.href = `mailto:${rental.publisher?.email}`}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Email Owner
                </Button>
              )}

              <p className="mt-2 text-center text-xs text-muted-foreground">
                You won't be charged yet
              </p>
            </div>

            {/* Meta details if any */}
            <div className="mt-4 border-t border-border/50 pt-4 flex justify-between text-sm">
              <span className="text-muted-foreground underline decoration-dotted underline-offset-4 cursor-help" title="Unique Identifier for this rental">Rental ID</span>
              <span className="font-mono text-xs">{rental.id.split('-')[0]}</span>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}
