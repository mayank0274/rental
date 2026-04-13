import { RentalsClient } from "../rentals-client";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <RentalsClient
      initialCategory={category.toLowerCase()}
      lockCategory
    />
  );
}
