"use client"

import * as React from "react"
import Link from "next/link"
import { Users, Clock, ArrowRight, Zap, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectPhaseBadge } from "@/components/ProjectPhaseBadge"
import { cn } from "@/lib/utils"
import type { ProjectPhase } from "@/data/mock-data"

export interface ProjectCardProps {
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
    variant?: "default" | "compact" | "featured"
    className?: string
    onAction?: () => void
    applicationsPending?: number
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
    variant = "default",
    className,
    onAction,
    applicationsPending
}: ProjectCardProps) {

    // Amazon-style vertical card (Default)
    return (
        <div className={cn(
            "group relative flex flex-col h-full bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm transition-all duration-300",
            "hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 block",
            className
        )}>
            <Link href={`/projects/${id}`} className="flex flex-col h-full">
                {/* Image Section - Prominent & Interactive */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground/30">
                            <Users className="w-16 h-16" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Right Badges */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                        {sector && (
                            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 hover:bg-background/90 font-semibold shadow-sm text-xs">
                                {sector}
                            </Badge>
                        )}
                        {applicationsPending && applicationsPending > 0 ? (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-[10px] shadow-sm animate-pulse">
                                <Zap className="w-3 h-3 mr-1 fill-current" />
                                {applicationsPending} Hot
                            </Badge>
                        ) : null}
                    </div>

                    {/* Quick Action Overlay (Amazon "Add to Cart" style) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background/95 to-transparent pt-10">
                        {onAction && (
                            <Button
                                size="sm"
                                className="w-full shadow-lg font-semibold active:scale-95 transition-all text-xs h-9"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAction();
                                }}
                            >
                                Must-See Project
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-4 space-y-3">
                    {/* Header */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {title}
                            </h3>
                            {/* Mock Rating/Popularity */}
                            <div className="flex items-center text-amber-500 shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                <Star className="w-3 h-3 fill-current mr-0.5" />
                                4.8
                            </div>
                        </div>
                        {founderName && (
                            <p className="text-xs text-muted-foreground">
                                By <span className="text-foreground hover:underline">{founderName}</span>
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {vision || description || "No description provided."}
                    </p>

                    {/* Tags/Skills - Single Line */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] items-center px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium border border-border/50">
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="text-[10px] px-1 text-muted-foreground self-center">+{tags.length - 3}</span>
                            )}
                        </div>
                    )}

                    {/* Footer / Status */}
                    <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            {/* Phase uses a cleaner text style here to fit e-commerce look */}
                            <div className={cn(
                                "font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider",
                                phase === 'idea' ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" :
                                    (phase === 'planning' || phase === 'review') ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300" :
                                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            )}>
                                {phase}
                            </div>
                        </div>

                        {memberCount !== undefined && teamSize !== undefined && (
                            <span className="font-medium text-foreground/80 flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                {memberCount}/{teamSize} <span className="text-muted-foreground font-normal">Members</span>
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}
