"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GlobalSearch } from "@/components/GlobalSearch"
import { NotificationsDropdown } from "@/components/NotificationsDropdown"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export function PrimaryTopNav() {
    const pathname = usePathname()
    const { profile, signOut } = useAuth()

    // Determine home link based on role (Amazon-style: go to your role home)
    const homeLink = profile
        ? profile.role_type === 'founder'
            ? '/founder/home'
            : '/builder/home'
        : '/'

    // Get unread messages count (mock)
    const unreadMessages = 3

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
                {/* Logo - Left */}
                <Link href={homeLink} className="flex items-center gap-2 font-semibold shrink-0">
                    <Package className="h-6 w-6 text-primary" />
                    <span className="hidden sm:inline-block">Helping Hands</span>
                </Link>

                {/* Global Search - Center */}
                <div className="flex-1 max-w-2xl mx-auto">
                    <GlobalSearch />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Messages */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/chat">
                            <MessageSquare className="h-5 w-5" />
                            {unreadMessages > 0 && (
                                <>
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
                                    <span className="sr-only">{unreadMessages} unread messages</span>
                                </>
                            )}
                        </Link>
                    </Button>

                    {/* Notifications */}
                    <NotificationsDropdown />

                    <div className="h-6 w-px bg-border/50 mx-1" />

                    {/* Profile Dropdown */}
                    {profile ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || 'User'} />
                                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                            {profile.name?.substring(0, 2).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{profile.name || 'User'}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile/edit" className="cursor-pointer">
                                        Profile Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={profile.role_type === 'founder' ? '/founder/settings' : '/builder/home'} className="cursor-pointer">
                                        {profile.role_type === 'founder' ? 'Founder Settings' : 'My Activity'}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size="sm" asChild>
                            <Link href="/auth">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
