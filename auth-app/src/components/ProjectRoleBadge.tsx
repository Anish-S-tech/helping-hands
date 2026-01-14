'use client';

import { Badge } from '@/components/ui/badge';
import { ProjectRole } from '@/data/mock-data';
import { Crown, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectRoleBadgeProps {
    role: ProjectRole;
    showIcon?: boolean;
    size?: 'sm' | 'md';
    className?: string;
}

const roleConfig: Record<ProjectRole, {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'premium';
    icon: typeof Crown;
    className: string;
}> = {
    founder: {
        label: 'Founder',
        variant: 'premium',
        icon: Crown,
        className: ''
    },
    team_lead: {
        label: 'Team Lead',
        variant: 'default',
        icon: Shield,
        className: ''
    },
    contributor: {
        label: 'Contributor',
        variant: 'secondary',
        icon: User,
        className: ''
    }
};

export function ProjectRoleBadge({
    role,
    showIcon = true,
    size = 'sm',
    className
}: ProjectRoleBadgeProps) {
    const config = roleConfig[role];
    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={cn(
                'font-medium',
                size === 'sm' ? 'text-[9px] px-1.5 py-0' : 'text-[10px] px-2 py-0.5',
                config.className,
                className
            )}
        >
            {showIcon && <Icon className={cn('mr-1', size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} />}
            {config.label}
        </Badge>
    );
}
