import { Benefits } from "@/components/home/benefits";
import { Categories } from "@/components/home/categories";
import { Cta } from "@/components/home/cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Listings } from "@/components/home/listings";
import { Testimonials } from "@/components/home/testimonials";
import { SiteFooter } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <Categories />
        <Listings />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  );
}
