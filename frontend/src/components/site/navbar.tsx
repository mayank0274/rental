"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { ChatQuickAccess } from "@/components/chat/chat-quick-access";
import { User } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Rentals", href: "/rentals" },
];

export function Navbar({ className }: { className?: string }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full border-b border-white/10 bg-card/60 backdrop-blur-md transition-all duration-300",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left Side: Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/20">
              RB
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground bg-clip-text">
              RentalBazar
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-primary rounded-md hover:bg-muted/50"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Icons & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  <ChatQuickAccess />
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-1.5 text-sm font-medium hover:text-primary transition rounded-full hover:bg-muted/80 pr-3 border border-transparent hover:border-border"
                  >
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shadow-inner">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline-block">Profile</span>
                  </Link>
                </div>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    className="text-sm font-medium text-muted-foreground transition hover:text-foreground px-3 py-2"
                    href="/login"
                  >
                    Log in
                  </Link>
                  <Button asChild size="sm" className="rounded-full px-5 shadow-md hover:shadow-lg transition-all shadow-primary/10">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile Navigation Trigger */}
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
