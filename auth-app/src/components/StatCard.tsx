"use client"

import * as React from "react"
import Link from "next/link"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    icon: LucideIcon
    iconColor?: string
    value: number | string
    label: string
    trend?: {
        value: number
        isPositive: boolean
    }
    href?: string
    className?: string
    highlight?: boolean
}

export function StatCard({
    icon: Icon,
    iconColor = "text-primary",
    value,
    label,
    trend,
    href,
    className,
    highlight = false
}: StatCardProps) {
    const content = (
        <div className={cn(
            "p-4 rounded-lg border transition-all stat-card",
            highlight
                ? "border-primary/30 bg-primary/5"
                : "border-border/50 bg-card/50",
            href && "cursor-pointer",
            className
        )}>
            <div className="flex items-center gap-3">
                <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    highlight ? "bg-primary/10" : "bg-muted/50"
                )}>
                    <Icon className={cn("h-5 w-5", iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-2xl font-semibold truncate">{value}</p>
                    <p className="text-xs text-muted-foreground truncate">{label}</p>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        trend.isPositive ? "text-green-500" : "text-red-500"
                    )}>
                        {trend.isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>
        </div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }

    return content
}
