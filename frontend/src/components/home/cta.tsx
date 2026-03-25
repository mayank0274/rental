import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";

export function Cta() {
  return (
    <Section>
      <div className="rounded-3xl border border-border/60 bg-primary p-8 text-primary-foreground sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to rent or list your items?
            </h2>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Rent what you need today or publish your own items and start
              earning.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button asChild variant="secondary" size="lg">
              <Link href="/signup">Create your profile</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
