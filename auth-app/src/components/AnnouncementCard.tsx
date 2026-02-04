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
            'group relative overflow-hidden rounded-xl transition-all duration-300',
            'border-l-4 border-primary/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent',
            'hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
            compact ? 'p-3.5' : 'p-5',
            className
        )}>
            {announcement.is_pinned && (
                <div className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Pin className="h-3.5 w-3.5 text-primary rotate-45" />
                </div>
            )}

            <div className="relative z-10 flex items-center gap-2.5 mb-3">
                <span className="text-sm font-bold text-foreground">{announcement.author_name}</span>
                <ProjectRoleBadge role={announcement.author_role} showIcon={false} size="sm" />
                <span className="text-xs text-muted-foreground/70 font-medium">
                    {formatRelativeTime(announcement.created_at)}
                </span>
            </div>

            <p className={cn(
                'relative z-10 text-muted-foreground leading-relaxed',
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
        <div className={cn('space-y-4', className)}>
            {sorted.map((announcement, index) => (
                <div
                    key={announcement.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms` }}
                >
                    <AnnouncementCard
                        announcement={announcement}
                        compact={compact}
                    />
                </div>
            ))}
        </div>
    );
}
