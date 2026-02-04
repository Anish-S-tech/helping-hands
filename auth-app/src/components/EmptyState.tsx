'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center p-12 rounded-xl border border-dashed border-border/50 bg-gradient-to-b from-background to-muted/20',
                className
            )}
        >
            {icon && (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 ring-1 ring-primary/20 backdrop-blur-sm">
                    <div className="text-primary/70">
                        {icon}
                    </div>
                </div>
            )}

            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>

            {description && (
                <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
            )}

            {action && <div className="animate-fade-in">{action}</div>}
        </div>
    );
}
