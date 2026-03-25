import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Category", href: "#categories" },
  { label: "Login", href: "/login" },
  { label: "Signup", href: "/signup" },
];

export function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            RN
          </span>
          <span className="text-base font-semibold tracking-tight">RentalBazar</span>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <div className="hidden items-center gap-6 md:flex">
            <Link
              className="text-muted-foreground transition hover:text-foreground"
              href={navItems[0].href}
            >
              {navItems[0].label}
            </Link>
            <Link
              className="text-muted-foreground transition hover:text-foreground"
              href={navItems[1].href}
            >
              {navItems[1].label}
            </Link>
            <Link
              className="text-muted-foreground transition hover:text-foreground"
              href={navItems[2].href}
            >
              {navItems[2].label}
            </Link>
          </div>
          <Button asChild size="sm" className="ml-2">
            <Link href={navItems[3].href}>{navItems[3].label}</Link>
          </Button>
        </nav>
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center gap-5 px-6 pb-4 text-sm md:hidden">
        {navItems.slice(0, 3).map((item) => (
          <Link
            key={item.label}
            className="text-muted-foreground transition hover:text-foreground"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
