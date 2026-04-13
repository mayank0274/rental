import type { Metadata } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getRental(slug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.success ? payload.data?.details : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rental = await getRental(slug);

  if (!rental) {
    return {
      title: "Rental Not Found",
      description: "The rental you are looking for could not be found.",
    };
  }

  const title = rental.title || rental.description || "Rental Details";
  const description =
    rental.description ||
    "View rental details including pricing, location, and availability.";
  const image = rental.images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
