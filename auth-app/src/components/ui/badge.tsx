import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive/15 text-destructive shadow-sm shadow-destructive/10",
                outline:
                    "text-foreground border-border/60 hover:border-primary/40 hover:text-primary",
                success:
                    "border-transparent bg-success/15 text-success shadow-sm shadow-success/10",
                warning:
                    "border-transparent bg-warning/15 text-warning shadow-sm shadow-warning/10",
                pending:
                    "border-transparent bg-yellow-500/15 text-yellow-500 animate-pulse-subtle shadow-sm",
                active:
                    "border-transparent bg-green-500/15 text-green-500 shadow-sm shadow-green-500/10",
                premium:
                    "border-transparent bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-sm",
                glow:
                    "border-transparent bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]",
                gradient:
                    "border-transparent bg-gradient-to-r from-primary via-[hsl(var(--accent-violet))] to-[hsl(var(--accent-cyan))] text-white shadow-lg",
                aurora:
                    "border-transparent bg-gradient-to-r from-primary via-[hsl(var(--accent-violet))] to-[hsl(var(--accent-cyan))] text-white bg-[length:200%_100%] animate-[aurora_4s_ease_infinite]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
