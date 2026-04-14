import { Suspense } from "react";
import { RentalsClient } from "./rentals-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>}>
      <RentalsClient />
    </Suspense>
  );
}
