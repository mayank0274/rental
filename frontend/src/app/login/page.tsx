"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    login(data);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Welcome back
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Log in to rent or manage your listings
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your bookings, messages, and listed items across every
              category.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Need an account?</span>
              <Link className="font-medium text-foreground" href="/signup">
                Create one
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold">Log in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your email and password to continue.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Sign in"}
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              By continuing, you agree to RentalBazar terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

