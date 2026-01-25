"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardCarouselProps {
    children: React.ReactNode
    className?: string
    showArrows?: boolean
    showIndicators?: boolean
    gap?: number
}

export function DashboardCarousel({
    children,
    className,
    showArrows = true,
    showIndicators = false,
    gap = 16
}: DashboardCarouselProps) {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = React.useState(false)
    const [canScrollRight, setCanScrollRight] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const [startX, setStartX] = React.useState(0)
    const [scrollLeft, setScrollLeft] = React.useState(0)

    const checkScroll = React.useCallback(() => {
        const container = scrollContainerRef.current
        if (!container) return

        setCanScrollLeft(container.scrollLeft > 0)
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 1
        )
    }, [])

    React.useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        checkScroll()
        container.addEventListener("scroll", checkScroll)
        window.addEventListener("resize", checkScroll)

        return () => {
            container.removeEventListener("scroll", checkScroll)
            window.removeEventListener("resize", checkScroll)
        }
    }, [checkScroll])

    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current
        if (!container) return

        const scrollAmount = container.clientWidth * 0.8
        const targetScroll =
            direction === "left"
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount

        container.scrollTo({
            left: targetScroll,
            behavior: "smooth"
        })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        const container = scrollContainerRef.current
        if (!container) return

        setIsDragging(true)
        setStartX(e.pageX - container.offsetLeft)
        setScrollLeft(container.scrollLeft)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()

        const container = scrollContainerRef.current
        if (!container) return

        const x = e.pageX - container.offsetLeft
        const walk = (x - startX) * 2
        container.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    return (
        <div className="relative group">
            {/* Left Arrow */}
            {showArrows && canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Carousel Container */}
            <div
                ref={scrollContainerRef}
                className={cn(
                    "flex overflow-x-auto no-scrollbar scroll-smooth",
                    isDragging ? "cursor-grabbing" : "cursor-grab",
                    className
                )}
                style={{ gap: `${gap}px` }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>

            {/* Right Arrow */}
            {showArrows && canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Scroll Indicators */}
            {showIndicators && (
                <div className="flex justify-center gap-1.5 mt-4">
                    <div className={cn(
                        "h-1 rounded-full transition-all",
                        canScrollLeft ? "w-2 bg-muted" : "w-6 bg-primary"
                    )} />
                    <div className={cn(
                        "h-1 rounded-full transition-all",
                        !canScrollLeft && !canScrollRight ? "w-6 bg-primary" : "w-2 bg-muted"
                    )} />
                    <div className={cn(
                        "h-1 rounded-full transition-all",
                        canScrollRight ? "w-2 bg-muted" : "w-6 bg-primary"
                    )} />
                </div>
            )}
        </div>
    )
}
