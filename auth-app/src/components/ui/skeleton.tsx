import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-muted",
                "after:absolute after:inset-0",
                "after:animate-[shimmer_1.5s_infinite]",
                "after:bg-gradient-to-r after:from-transparent after:via-muted-foreground/10 after:to-transparent",
                "after:bg-[length:200%_100%]",
                className
            )}
            {...props}
        />
    )
}

function SkeletonCard() {
    return (
        <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
        </div>
    )
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <div className="bg-muted/30 p-4 border-b">
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="p-4 border-b last:border-b-0 flex gap-4 items-center">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                </div>
            ))}
        </div>
    )
}

function SkeletonProfile() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
    )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonProfile }
