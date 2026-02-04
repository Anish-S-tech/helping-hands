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
            "group relative p-5 rounded-xl border transition-all duration-300 overflow-hidden",
            "hover:shadow-md hover:border-border/80 hover:-translate-y-0.5",
            highlight
                ? "border-primary/50 bg-primary/5 shadow-sm"
                : "border-border/50 bg-card hover:bg-card/80",
            href && "cursor-pointer",
            className
        )}>
            {/* Subtle Inner Glow for Premium Feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 border border-border/50",
                    highlight
                        ? "bg-primary text-primary-foreground shadow-sm group-hover:scale-105"
                        : "bg-muted/50 group-hover:bg-muted text-muted-foreground group-hover:text-foreground"
                )}>
                    <Icon className={cn("h-5 w-5 transition-transform duration-300", !highlight && iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-2xl font-bold tracking-tight truncate",
                        highlight ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}>
                        {value}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate mt-0.5 opacity-80">{label}</p>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border",
                        trend.isPositive
                            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                            : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                    )}>
                        {trend.isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(trend.value)}%</span>
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
