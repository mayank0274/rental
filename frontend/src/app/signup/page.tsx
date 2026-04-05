"use client";

import Link from "next/link";
import { useRegister } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Convert phone to string and ensure it's handled if empty
    if (!data.phone) delete data.phone;
    
    register(data);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Create your account
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Join RentalBazar to rent or list items
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign up to book items, save favorites, and publish your own
              rentals.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Already have one?</span>
              <Link className="font-medium text-foreground" href="/login">
                Log in
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold">Sign up</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your profile in a few quick steps.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Full name"
                  autoComplete="name"
                  minLength={1}
                  maxLength={50}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  1–50 characters.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be a valid email format.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  minLength={8}
                  pattern="(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
                  title="At least 8 characters, 1 uppercase letter, 1 number, and 1 special character."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Min 8 chars, 1 uppercase, 1 number, 1 special character.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone (optional)</Label>
                <Input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit phone number"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                />
                <p className="text-xs text-muted-foreground">
                  Exactly 10 digits.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              By signing up, you agree to RentalBazar terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

