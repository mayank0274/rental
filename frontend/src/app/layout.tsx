import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rentalbazar.example"),
  title: {
    default: "RentalBazar | Rent Anything, Anytime",
    template: "%s | RentalBazar",
  },
  description:
    "A modern rental marketplace for bikes, cars, tools, cameras, electronics, furniture, and more.",
  applicationName: "RentalBazar",
  keywords: [
    "rentals",
    "peer-to-peer rentals",
    "bikes",
    "cars",
    "tools",
    "cameras",
    "electronics",
    "furniture",
    "sports",
    "outdoor",
    "party",
    "baby",
    "music",
    "costumes",
    "books",
  ],
  authors: [{ name: "RentalBazar" }],
  openGraph: {
    title: "RentalBazar | Rent Anything, Anytime",
    description:
      "Rent gear, vehicles, and everyday essentials from trusted local hosts.",
    type: "website",
    url: "/",
    siteName: "RentalBazar",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentalBazar | Rent Anything, Anytime",
    description:
      "Rent gear, vehicles, and everyday essentials from trusted local hosts.",
  },
};

import { Providers } from "@/components/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
