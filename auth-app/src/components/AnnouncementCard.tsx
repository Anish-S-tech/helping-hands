'use client';

import { Announcement, formatRelativeTime } from '@/data/mock-data';
import { ProjectRoleBadge } from '@/components/ProjectRoleBadge';
import { Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
    announcement: Announcement;
    compact?: boolean;
    className?: string;
}

export function AnnouncementCard({
    announcement,
    compact = false,
    className
}: AnnouncementCardProps) {
    return (
        <div className={cn(
            'relative border-l-2 border-primary/50 bg-primary/5 rounded-r-lg',
            compact ? 'p-3' : 'p-4',
            className
        )}>
            {announcement.is_pinned && (
                <div className="absolute top-2 right-2">
                    <Pin className="h-3 w-3 text-primary/50 rotate-45" />
                </div>
            )}

            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">{announcement.author_name}</span>
                <ProjectRoleBadge role={announcement.author_role} showIcon={false} size="sm" />
                <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(announcement.created_at)}
                </span>
            </div>

            <p className={cn(
                'text-muted-foreground leading-relaxed',
                compact ? 'text-xs' : 'text-sm'
            )}>
                {announcement.content}
            </p>
        </div>
    );
}

interface AnnouncementListProps {
    announcements: Announcement[];
    projectId?: string;
    pinnedOnly?: boolean;
    maxItems?: number;
    compact?: boolean;
    className?: string;
}

export function AnnouncementList({
    announcements,
    projectId,
    pinnedOnly = false,
    maxItems = 5,
    compact = false,
    className
}: AnnouncementListProps) {
    let filtered = announcements;

    if (projectId) {
        filtered = filtered.filter(a => a.project_id === projectId);
    }

    if (pinnedOnly) {
        filtered = filtered.filter(a => a.is_pinned);
    }

    const sorted = filtered
        .sort((a, b) => {
            // Pinned first, then by date
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })
        .slice(0, maxItems);

    if (sorted.length === 0) {
        return null;
    }

    return (
        <div className={cn('space-y-3', className)}>
            {sorted.map((announcement, index) => (
                <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    compact={compact}
                />
            ))}
        </div>
    );
}
