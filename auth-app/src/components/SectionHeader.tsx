"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
    title: string
    subtitle?: string
    badge?: {
        label: string
        variant?: "default" | "warning" | "success" | "secondary"
    }
    icon?: LucideIcon
    action?: {
        label: string
        href?: string
        onClick?: () => void
    }
    sticky?: boolean
    className?: string
}

export function SectionHeader({
    title,
    subtitle,
    badge,
    icon: Icon,
    action,
    sticky = false,
    className
}: SectionHeaderProps) {
    return (
        <div className={cn(
            "flex items-center justify-between gap-4",
            sticky && "sticky top-16 z-30 bg-background/95 backdrop-blur-sm py-3 -mt-3 border-b border-border/50",
            className
        )}>
            <div className="flex items-center gap-3 min-w-0">
                {Icon && (
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                )}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        {badge && (
                            <Badge variant={badge.variant || "default"} className="text-[10px]">
                                {badge.label}
                            </Badge>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                    )}
                </div>
            </div>

            {action && (
                action.href ? (
                    <Button variant="ghost" size="sm" className="shrink-0" asChild>
                        <Link href={action.href} className="flex items-center gap-1">
                            {action.label}
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Button>
                )
            )}
        </div>
    )
}
