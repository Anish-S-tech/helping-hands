"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaHref: string;
    badgeText?: string;
    tagline?: string;
}

interface HeroCarouselProps {
    slides: HeroSlide[];
    autoPlayInterval?: number;
}

export function HeroCarousel({ slides, autoPlayInterval = 6000 }: HeroCarouselProps) {
    // Clone first and last slides for infinite loop
    const clonedSlides = [
        slides[slides.length - 1], // Slide at index 0 (clone of last)
        ...slides,                 // Real slides at indices 1 to slides.length
        slides[0]                  // Slide at index slides.length+1 (clone of first)
    ]

    const [currentIndex, setCurrentIndex] = React.useState(1)
    const [isTransitioning, setIsTransitioning] = React.useState(false)
    const [useTransition, setUseTransition] = React.useState(true)
    const [isPaused, setIsPaused] = React.useState(false)

    const nextSlide = React.useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setUseTransition(true)
        setCurrentIndex((prev) => prev + 1)
    }, [isTransitioning])

    const prevSlide = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setUseTransition(true)
        setCurrentIndex((prev) => prev - 1)
    }

    const handleTransitionEnd = () => {
        setIsTransitioning(false)

        // Handle jump from clones back to real slides
        if (currentIndex === 0) {
            setUseTransition(false)
            setCurrentIndex(slides.length)
        } else if (currentIndex === clonedSlides.length - 1) {
            setUseTransition(false)
            setCurrentIndex(1)
        }
    }

    React.useEffect(() => {
        if (isPaused || isTransitioning) return
        const timer = setInterval(nextSlide, autoPlayInterval)
        return () => clearInterval(timer)
    }, [nextSlide, autoPlayInterval, isPaused, isTransitioning])

    // Calculate which "real" slide we're on for indicators
    const activeRealIndex = (currentIndex - 1 + slides.length) % slides.length

    return (
        <section
            className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-[2.5rem] border border-border/30 bg-background shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Sliding Container */}
            <div
                className={cn(
                    "flex h-full will-change-transform",
                    useTransition ? "transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)" : "transition-none"
                )}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    width: `${clonedSlides.length * 100}%`
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {clonedSlides.map((slide, idx) => (
                    <div
                        key={`${slide.id}-${idx}`}
                        className="relative h-full w-full flex-shrink-0 overflow-hidden"
                    >
                        {/* Image Layer */}
                        <Image
                            src={slide.imageUrl}
                            alt={slide.title}
                            fill
                            priority={idx === 1}
                            className="object-cover"
                        />

                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent md:from-background/90 md:via-background/20 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

                        {/* Content Layer */}
                        <div className="relative z-20 h-full container px-8 md:px-16 flex flex-col justify-center">
                            <div className="max-w-2xl space-y-6">
                                <div className="space-y-4">
                                    {slide.badgeText && (
                                        <Badge className="mb-2 bg-primary/20 text-primary border-primary/30 backdrop-blur-md">
                                            <Sparkles className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
                                            {slide.badgeText}
                                        </Badge>
                                    )}

                                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-foreground drop-shadow-sm">
                                        {slide.title} <span className="text-primary">{slide.subtitle}</span>
                                    </h2>

                                    <p className="text-lg md:text-xl text-muted-foreground/90 max-w-lg leading-relaxed font-medium">
                                        {slide.description}
                                    </p>

                                    <div className="pt-6 flex flex-wrap gap-4">
                                        <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group/btn" asChild>
                                            <a href={slide.ctaHref}>
                                                {slide.ctaText}
                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                            </a>
                                        </Button>
                                        <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold bg-background/20 backdrop-blur-md border-border/50 hover:bg-background/40 transition-all">
                                            Learn More
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 md:left-8 z-30 flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-xl border border-white/10 text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground shadow-2xl"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>
            <div className="absolute inset-y-0 right-4 md:right-8 z-30 flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-xl border border-white/10 text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground shadow-2xl"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (isTransitioning) return
                            setIsTransitioning(true)
                            setUseTransition(true)
                            setCurrentIndex(index + 1)
                        }}
                        className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            index === activeRealIndex
                                ? "w-10 bg-primary"
                                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                    />
                ))}
            </div>
        </section>
    )
}
