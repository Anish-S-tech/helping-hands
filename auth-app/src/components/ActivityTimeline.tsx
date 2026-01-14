'use client';

import { ActivityEntry, ActivityType, formatRelativeTime } from '@/data/mock-data';
import {
    UserPlus,
    Shield,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Megaphone
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
            <div className="text-center py-8 text-muted-foreground text-sm">
                No activity recorded yet
            </div>
        );
    }

    return (
        <div className={cn('relative', className)}>
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
                {displayedActivities.map((activity, index) => {
                    const config = activityConfig[activity.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={activity.id}
                            className="relative flex gap-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {/* Icon */}
                            <div className={cn(
                                'relative z-10 flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                                config.bgColor
                            )}>
                                <Icon className={cn('h-4 w-4', config.color)} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-1">
                                <p className="text-sm text-foreground leading-relaxed">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {formatRelativeTime(activity.timestamp)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
