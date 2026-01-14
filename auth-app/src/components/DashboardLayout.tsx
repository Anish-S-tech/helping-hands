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
    X,
    LogOut,
    User,
    Shield,
    Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { profile, signOut } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Helper to determine active state
    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname.startsWith("/dashboard")
        }
        return pathname.startsWith(href)
    }

    const NavigationContent = () => (
        <div className="flex h-full flex-col">
            {/* Logo Section with gradient */}
            <div className="flex h-16 items-center border-b border-border/50 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <Link href="/" className="flex items-center gap-3 font-semibold relative">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-bold tracking-tight uppercase">Helping Hands</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium gap-1">
                    <p className="px-3 mb-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Main</p>
                    {mainNav.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.title === "Dashboard" && profile?.role_type === 'user' ? "/dashboard/builder" :
                                    item.title === "Dashboard" && profile?.role_type === 'founder' ? "/dashboard/founder" : item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                                    active
                                        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-l-2 border-primary ml-0"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200",
                                    active ? "bg-primary/10" : "bg-muted/30 group-hover:bg-muted/50"
                                )}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                {item.title}
                            </Link>
                        )
                    })}

                    <p className="px-3 mb-3 mt-8 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Account</p>
                    {settingsNav.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                                    active
                                        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-l-2 border-primary ml-0"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200",
                                    active ? "bg-primary/10" : "bg-muted/30"
                                )}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User Profile Section with gradient border */}
            <div className="mt-auto p-4 border-t border-border/50">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-transparent">
                    <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                            <AvatarImage src={profile?.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary">{profile?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate">{profile?.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wide">{profile?.role_type}</span>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-background relative">
            {/* Background Effect */}
            <div className="dashboard-bg-effect" />

            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r border-border/50 md:block fixed inset-y-0 z-50 dashboard-sidebar">
                <NavigationContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 glass">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 dashboard-sidebar">
                        <NavigationContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col md:ml-64">
                <header className="flex h-16 items-center gap-4 border-b border-border/50 px-6 sticky top-0 z-40 glass">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {pathname.split('/').filter(Boolean).join(' / ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </Button>

                        <div className="h-6 w-px bg-border/50" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={profile?.avatar_url || ""} aria-label="profile-navbar-avatar" />
                                        <AvatarFallback className="bg-primary/10 text-primary">{profile?.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{profile?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {profile?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile/edit">Edit Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Account Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
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
