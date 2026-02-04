"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            "relative h-2.5 w-full overflow-hidden rounded-full bg-primary/10 shadow-inner",
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className={cn(
                "h-full w-full flex-1 transition-all duration-500 ease-out relative overflow-hidden",
                "bg-gradient-to-r from-primary via-[hsl(var(--accent-cyan))] to-primary",
                "bg-[length:200%_100%] animate-[aurora_3s_ease_infinite]",
                "shadow-[0_0_10px_hsl(var(--primary)/0.5)]",
                // Shimmer effect
                "after:absolute after:inset-0",
                "after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent",
                "after:translate-x-[-100%] after:animate-[shine-sweep_2s_ease-in-out_infinite]"
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
