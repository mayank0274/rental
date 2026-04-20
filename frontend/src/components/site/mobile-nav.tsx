"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, User, LogOut, MessageCircle, Home, Layers3 } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useLogout } from "@/hooks/useAuthMutations"
import { cn } from "@/lib/utils"

interface MobileNavProps {
    items: { label: string; href: string }[]
    className?: string
}

export function MobileNav({ items, className }: MobileNavProps) {
    const [open, setOpen] = React.useState(false)
    const { isAuthenticated, user } = useAuth()
    const { mutate: logout } = useLogout()

    const close = () => setOpen(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("md:hidden", className)}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
                <SheetHeader className="p-6 border-b bg-muted/20">
                    <SheetTitle className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">RB</span>
                        RentalBazar
                    </SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2">Navigation</p>
                        {items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={close}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-primary"
                            >
                                {item.label === "Home" ? <Home className="h-4 w-4" /> : <Layers3 className="h-4 w-4" />}
                                {item.label}
                            </Link>
                        ))}
                        
                        {isAuthenticated && (
                            <>
                                <hr className="my-2 border-border" />
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2">Account</p>
                                <Link
                                    href="/profile"
                                    onClick={close}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-primary"
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout()
                                        close()
                                    }}
                                    className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-medium rounded-md text-destructive transition-colors hover:bg-destructive/5"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className="p-6 border-t flex flex-col gap-2 bg-muted/5">
                        <Button asChild variant="outline" onClick={close}>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button asChild onClick={close}>
                            <Link href="/signup">Sign up</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
