import * as React from "react";

import { cn } from "@/lib/utils";

type SectionProps = React.ComponentPropsWithoutRef<"section"> & {
  innerClassName?: string;
};

export function Section({
  className,
  innerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)} {...props}>
      <div className={cn("mx-auto w-full max-w-6xl px-6", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
