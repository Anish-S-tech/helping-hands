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
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="text-sm tracking-tight uppercase">Helping Hands</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium gap-1">
                    <p className="px-2 mb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Main</p>
                    {mainNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.title === "Dashboard" && profile?.role_type === 'user' ? "/dashboard/builder" :
                                item.title === "Dashboard" && profile?.role_type === 'founder' ? "/dashboard/founder" : item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                isActive(item.href) ? "bg-muted text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}

                    <p className="px-2 mb-2 mt-6 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Account</p>
                    {settingsNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                isActive(item.href) ? "bg-muted text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t">
                <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-semibold truncate">{profile?.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate uppercase">{profile?.role_type}</span>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r md:block fixed inset-y-0 z-50 bg-card">
                <NavigationContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <NavigationContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col md:ml-64">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/20 px-6 sticky top-0 z-40 backdrop-blur-sm">
                    <div className="flex-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            {pathname.split('/').filter(Boolean).join(' / ')}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Bell className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={profile?.avatar_url || ""} aria-label="profile-navbar-avatar" />
                                        <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
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
