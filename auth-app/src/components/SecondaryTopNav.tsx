"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Compass,
    Briefcase,
    MessageSquare,
    Bell,
    FolderKanban,
    UserCheck,
    Users,
    BarChart3,
    Settings
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface NavItem {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

// Public (unauthenticated) navigation
const publicNavItems: NavItem[] = [
    { href: '/', label: 'Explore Projects', icon: Compass },
    { href: '/explore?tab=categories', label: 'Categories', icon: FolderKanban },
]

const builderNavItems: NavItem[] = [
    { href: '/builder/home', label: 'Home', icon: Home },
    { href: '/', label: 'Explore Projects', icon: Compass },
    { href: '/builder/contributions', label: 'My Contributions', icon: Briefcase },
    { href: '/chat', label: 'Messages', icon: MessageSquare },
    { href: '/notifications', label: 'Notifications', icon: Bell },
]

const founderNavItems: NavItem[] = [
    { href: '/founder/home', label: 'Home', icon: Home },
    { href: '/founder/projects', label: 'My Projects', icon: FolderKanban },
    { href: '/requests', label: 'Requests', icon: UserCheck },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/founder/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/founder/settings', label: 'Settings', icon: Settings },
]

export function SecondaryTopNav() {
    const pathname = usePathname()
    const { profile } = useAuth()

    // Select navigation items based on role / public state
    const navItems = !profile
        ? publicNavItems
        : profile.role_type === 'founder'
            ? founderNavItems
            : builderNavItems

    return (
        <nav className="sticky top-16 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6">
                <div className="flex h-12 items-center overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            const isExplore = item.label === 'Explore Projects'

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap",
                                        isActive
                                            ? isExplore
                                                ? "text-primary bg-primary/15 font-semibold"
                                                : "text-foreground bg-muted font-medium"
                                            : isExplore
                                                ? "text-primary/80 hover:text-primary hover:bg-primary/10 font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
