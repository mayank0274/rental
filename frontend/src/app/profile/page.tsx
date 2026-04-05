"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  LogOut,
  Settings,
  ShieldQuestion
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const infoItems = [
    { label: "Full Name", value: user.name, icon: User },
    { label: "Email Address", value: user.email, icon: Mail },
    { label: "Phone Number", value: user.phone || "Not provided", icon: Phone },
  ];

  const accountItems = [
    { label: "Account Role", value: user.role, icon: ShieldCheck, className: "capitalize" },
    { label: "Member Since", value: new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }), icon: Calendar },
  ];

  return (
    <div className="min-h-screen pb-20">

      <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col gap-8">
          {/* Main Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-xl">
            <div className="p-6 sm:p-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  {/* Avatar Placeholder */}
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-neutral-100 text-3xl font-bold tracking-tighter text-neutral-900 ring-4 ring-background shadow-sm">
                    {initials}
                  </div>

                  <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">{user.name}</h1>
                    <p className="mt-1 text-lg text-muted-foreground">{user.email}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="rounded-xl border-neutral-200 hover:bg-neutral-50 transition-all duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </Button>
              </div>

              <div className="mt-12 grid gap-12 lg:grid-cols-2">
                {/* Personal Information Section */}
                <div>
                  <h2 className="flex items-center text-lg font-bold tracking-tight text-foreground">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Personal Information
                  </h2>
                  <div className="mt-6 space-y-6">
                    {infoItems.map((item) => (
                      <div key={item.label} className="group flex items-start gap-4 transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="text-base font-medium text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Details Section */}
                <div>
                  <h2 className="flex items-center text-lg font-bold tracking-tight text-foreground">
                    <Settings className="mr-2 h-5 w-5 text-primary" />
                    Account Details
                  </h2>
                  <div className="mt-6 space-y-6">
                    {accountItems.map((item) => (
                      <div key={item.label} className="group flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.label}
                          </p>
                          <p className={`text-base font-medium text-foreground ${item.className || ""}`}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions / Help */}
            <div className="border-t border-border/40 bg-muted/5 p-6 sm:px-10">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-xs text-muted-foreground">
                  Need to change your details? Contact support for assistance.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
