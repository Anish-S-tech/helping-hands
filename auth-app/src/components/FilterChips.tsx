"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterChip {
    id: string
    label: string
    count?: number
}

interface FilterChipsProps {
    chips: FilterChip[]
    activeChips?: string[]
    onToggle?: (chipId: string) => void
    onRemove?: (chipId: string) => void
    className?: string
    variant?: "default" | "skill" | "sector"
}

export function FilterChips({
    chips,
    activeChips = [],
    onToggle,
    onRemove,
    className,
    variant = "default"
}: FilterChipsProps) {
    const isActive = (chipId: string) => activeChips.includes(chipId)

    return (
        <div className={cn(
            "flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2",
            className
        )}>
            {chips.map((chip) => {
                const active = isActive(chip.id)

                if (variant === "skill") {
                    return (
                        <Button
                            key={chip.id}
                            variant={active ? "default" : "outline"}
                            size="sm"
                            className={cn(
                                "h-8 rounded-full text-xs transition-all",
                                active && "pr-1"
                            )}
                            onClick={() => onToggle?.(chip.id)}
                        >
                            <span>{chip.label}</span>
                            {chip.count !== undefined && chip.count > 0 && (
                                <span className={cn(
                                    "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium",
                                    active ? "bg-primary-foreground/20" : "bg-muted"
                                )}>
                                    {chip.count}
                                </span>
                            )}
                            {active && onRemove && (
                                <button
                                    className="ml-2 h-6 w-6 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(chip.id)
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </Button>
                    )
                }

                return (
                    <Badge
                        key={chip.id}
                        variant={active ? "default" : "secondary"}
                        className={cn(
                            "text-xs px-3 py-1.5 cursor-pointer transition-all hover:scale-105",
                            active && "ring-2 ring-primary/20"
                        )}
                        onClick={() => onToggle?.(chip.id)}
                    >
                        {chip.label}
                        {chip.count !== undefined && chip.count > 0 && (
                            <span className="ml-1.5 opacity-70">({chip.count})</span>
                        )}
                    </Badge>
                )
            })}
        </div>
    )
}
