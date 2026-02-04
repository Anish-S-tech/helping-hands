'use client';

import { ActivityEntry, ActivityType, formatRelativeTime } from '@/data/mock-data';
import {
    UserPlus,
    Shield,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Megaphone,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
    activities: ActivityEntry[];
    maxItems?: number;
    className?: string;
}

const activityConfig: Record<ActivityType, {
    icon: typeof UserPlus;
    color: string;
    bgColor: string;
}> = {
    member_joined: {
        icon: UserPlus,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10'
    },
    role_assigned: {
        icon: Shield,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10'
    },
    status_changed: {
        icon: RefreshCw,
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10'
    },
    application_approved: {
        icon: CheckCircle2,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10'
    },
    application_rejected: {
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10'
    },
    announcement_posted: {
        icon: Megaphone,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10'
    }
};

export function ActivityTimeline({
    activities,
    maxItems = 10,
    className
}: ActivityTimelineProps) {
    const displayedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, maxItems);

    if (displayedActivities.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm rounded-xl border border-dashed border-border/50 bg-gradient-to-br from-background to-muted/5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="font-medium">No activity recorded yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Activity will appear here as it happens</p>
            </div>
        );
    }

    return (
        <div className={cn('relative', className)}>
            {/* Vertical line */}
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-border via-border to-transparent" />

            <div className="space-y-5">
                {displayedActivities.map((activity, index) => {
                    const config = activityConfig[activity.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={activity.id}
                            className="relative flex gap-4 animate-fade-in group hover:translate-x-1 transition-transform duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Icon */}
                            <div className={cn(
                                'relative z-10 flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-300',
                                'shadow-md border border-border/50 group-hover:scale-110 group-hover:shadow-lg',
                                config.bgColor
                            )}>
                                <Icon className={cn('h-4 w-4 transition-transform duration-300 group-hover:scale-110', config.color)} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-1.5 pb-2 border-b border-border/30 group-hover:border-primary/20 transition-colors duration-300">
                                <p className="text-sm text-foreground leading-relaxed font-medium">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatRelativeTime(activity.timestamp)}</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
