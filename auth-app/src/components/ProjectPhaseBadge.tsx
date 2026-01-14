'use client';

import { Badge } from '@/components/ui/badge';
import { ProjectPhase } from '@/data/mock-data';
import {
    Lightbulb,
    Target,
    Play,
    Search,
    CheckCircle2,
    Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectPhaseBadgeProps {
    phase: ProjectPhase;
    showIcon?: boolean;
    size?: 'sm' | 'md';
    className?: string;
}

const phaseConfig: Record<ProjectPhase, {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'active' | 'pending' | 'premium' | 'warning';
    icon: typeof Lightbulb;
    className: string;
}> = {
    idea: {
        label: 'Idea',
        variant: 'outline',
        icon: Lightbulb,
        className: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    planning: {
        label: 'Planning',
        variant: 'secondary',
        icon: Target,
        className: 'border-violet-500/30 text-violet-400 bg-violet-500/10'
    },
    active: {
        label: 'Active',
        variant: 'active',
        icon: Play,
        className: 'border-green-500/30 text-green-400 bg-green-500/10'
    },
    review: {
        label: 'Review',
        variant: 'warning',
        icon: Search,
        className: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
    },
    completed: {
        label: 'Completed',
        variant: 'secondary',
        icon: CheckCircle2,
        className: 'border-muted-foreground/30 text-muted-foreground bg-muted/50'
    },
    archived: {
        label: 'Archived',
        variant: 'secondary',
        icon: Archive,
        className: 'border-muted-foreground/20 text-muted-foreground/70 bg-muted/30'
    }
};

export function ProjectPhaseBadge({
    phase,
    showIcon = true,
    size = 'sm',
    className
}: ProjectPhaseBadgeProps) {
    const config = phaseConfig[phase];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={cn(
                'font-medium border',
                config.className,
                size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
                className
            )}
        >
            {showIcon && <Icon className={cn('mr-1', size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />}
            {config.label}
        </Badge>
    );
}
