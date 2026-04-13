"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Rentals", href: "/rentals" },
];

export function Navbar({ className }: { className?: string }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-card shadow-sm border-b border-border",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            RB
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">RentalBazar</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
          <div className="hidden items-center gap-6 md:flex border-r border-border/60 pr-6 mr-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                className="text-muted-foreground transition hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition"
                  >
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold uppercase">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline-block">Profile</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      className="text-muted-foreground transition hover:text-foreground px-2"
                      href="/login"
                    >
                      Login
                    </Link>
                    <Button asChild size="sm">
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
