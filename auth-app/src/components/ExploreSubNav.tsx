"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { TrendingUp, Sparkles, Clock, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExploreSubNavProps {
    className?: string
}

export function ExploreSubNav({ className }: ExploreSubNavProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Only show on /explore page
    if (pathname !== '/explore') return null

    const viewMode = searchParams.get('view') || 'all'

    const navItems = [
        { href: '/explore', label: 'All Projects', param: 'all', icon: null },
        { href: '/explore?view=recommended', label: 'Recommended for You', param: 'recommended', icon: Sparkles },
        { href: '/explore?view=trending', label: 'Trending', param: 'trending', icon: TrendingUp },
        { href: '/explore?view=recent', label: 'Recently Added', param: 'recent', icon: Clock },
        { href: '/explore?view=interests', label: 'Your Interests', param: 'interests', icon: Heart },
    ]

    return (
        <nav className={cn("sticky top-28 z-30 w-full border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80", className)}>
            <div className="container px-4 md:px-6">
                <div className="flex h-11 items-center overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = viewMode === item.param

                            return (
                                <Link
                                    key={item.param}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                                        isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {Icon && <Icon className="h-3.5 w-3.5" />}
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
