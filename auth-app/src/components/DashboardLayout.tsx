"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Compass,
    MessageSquare,
    Settings,
    Menu,
    LogOut,
    Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlobalSearch } from "@/components/GlobalSearch"
import { NotificationsDropdown } from "@/components/NotificationsDropdown"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Profile } from "@/contexts/auth-context"

interface NavItem {
    title: string
    href: string
    icon: React.ElementType
}

const mainNav: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Explore", href: "/explore", icon: Compass },
    { title: "Messages", href: "/chat", icon: MessageSquare },
]

const settingsNav: NavItem[] = [
    { title: "Settings", href: "/settings", icon: Settings },
]

interface NavigationContentProps {
    profile: Profile | null
    isActive: (href: string) => boolean
}

// Simplified NavItem styling
function NavigationContent({ profile, isActive }: NavigationContentProps) {
    return (
        <div className="flex h-full flex-col bg-card border-r border-border">
            {/* Logo Section - Clean & Flat */}
            <div className="flex h-16 items-center border-b border-border/50 px-6">
                <Link href="/" className="flex items-center gap-3 font-semibold text-foreground/90 hover:text-foreground transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                        <Shield className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold tracking-tight uppercase">Helping Hands</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium gap-1">
                    <p className="px-3 mb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Main</p>
                    {mainNav.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.title === "Dashboard" && profile?.role_type === 'builder' ? "/dashboard/builder" :
                                    item.title === "Dashboard" && profile?.role_type === 'founder' ? "/dashboard/founder" : item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-200",
                                    active
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        )
                    })}

                    <p className="px-3 mb-2 mt-8 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Account</p>
                    {settingsNav.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-200",
                                    active
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User Profile Section - Simple Border Top */}
            <div className="mt-auto p-4 border-t border-border/50">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="relative">
                        <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarImage src={profile?.avatar_url || ""} />
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">{profile?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate text-foreground">{profile?.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate uppercase">{profile?.role_type}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { profile, signOut } = useAuth()

    const isActive = React.useCallback((href: string) => {
        if (href === "/dashboard") {
            return pathname.startsWith("/dashboard")
        }
        return pathname.startsWith(href)
    }, [pathname])

    return (
        <div className="flex min-h-screen bg-background relative">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 md:block fixed inset-y-0 z-50">
                <NavigationContent profile={profile} isActive={isActive} />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50 bg-background/80 backdrop-blur-sm border border-border/50">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-r border-border bg-card">
                        <NavigationContent profile={profile} isActive={isActive} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col md:ml-64 bg-background">
                <header className="flex h-16 items-center gap-4 border-b border-border/40 px-6 sticky top-0 z-40 bg-background/80 backdrop-blur-md">
                    <div className="flex-1 flex justify-center max-w-2xl mx-auto">
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-3">
                        <NotificationsDropdown />
                        <div className="h-5 w-px bg-border/50" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-muted/50">
                                    <Avatar className="h-8 w-8 border border-border/50">
                                        <AvatarImage src={profile?.avatar_url || ""} />
                                        <AvatarFallback className="bg-muted text-xs">{profile?.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{profile?.name}</p>
                                        <p className="text-xs text-muted-foreground">{profile?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/profile/edit">Edit Profile</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/settings">Account Settings</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
