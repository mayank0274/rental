import { RentalDetailClient } from "./rental-detail-client";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <RentalDetailClient params={params} />;
}
