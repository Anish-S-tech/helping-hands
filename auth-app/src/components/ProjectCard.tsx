"use client"

import * as React from "react"
import Link from "next/link"
import { Users, ArrowRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectPhaseBadge } from "@/components/ProjectPhaseBadge"
import { cn } from "@/lib/utils"
import type { ProjectPhase } from "@/data/mock-data"

interface ProjectCardProps {
    id: string
    title: string
    description?: string
    vision?: string
    sector?: string
    tags?: string[]
    phase: ProjectPhase
    memberCount?: number
    teamSize?: number
    founderName?: string
    lastActivity?: string
    imageUrl?: string
    variant?: "compact" | "expanded"
    showActions?: boolean
    className?: string
    onAction?: () => void
}

export function ProjectCard({
    id,
    title,
    description,
    vision,
    sector,
    tags,
    phase,
    memberCount,
    teamSize,
    founderName,
    lastActivity,
    imageUrl,
    variant = "expanded",
    showActions = true,
    className,
    onAction
}: ProjectCardProps) {
    if (variant === "compact") {
        return (
            <Link href={`/projects/${id}`}>
                <div className={cn(
                    "p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all group min-w-0",
                    className
                )}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                                    {title}
                                </h3>
                                <ProjectPhaseBadge phase={phase} showIcon={false} />
                            </div>
                            {vision && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {vision}
                                </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {memberCount !== undefined && teamSize !== undefined && (
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {memberCount}/{teamSize}
                                    </span>
                                )}
                                {sector && <span>{sector}</span>}
                                {founderName && <span>by {founderName}</span>}
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <div className={cn(
            "flex-shrink-0 w-80 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all group overflow-hidden",
            className
        )}>
            {/* Image */}
            {imageUrl && (
                <div className="h-40 w-full bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                        <ProjectPhaseBadge phase={phase} />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="space-y-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {title}
                    </h3>
                    {vision && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {vision}
                        </p>
                    )}
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                                {tag}
                            </Badge>
                        ))}
                        {tags.length > 3 && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                                +{tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        {memberCount !== undefined && teamSize !== undefined && (
                            <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {memberCount}/{teamSize}
                            </span>
                        )}
                        {lastActivity && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lastActivity}
                            </span>
                        )}
                    </div>
                    {sector && (
                        <span className="text-[10px] text-muted-foreground/70">{sector}</span>
                    )}
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8"
                            asChild
                        >
                            <Link href={`/projects/${id}`}>View Details</Link>
                        </Button>
                        {onAction && (
                            <Button
                                variant="default"
                                size="sm"
                                className="flex-1 h-8"
                                onClick={onAction}
                            >
                                Join
                            </Button>
                        )}
                    </div>
                )}

                {/* Founder */}
                {founderName && (
                    <p className="text-xs text-muted-foreground pt-1">
                        by <span className="text-foreground font-medium">{founderName}</span>
                    </p>
                )}
            </div>
        </div>
    )
}
