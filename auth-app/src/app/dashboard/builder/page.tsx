'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Search,
    ArrowRight,
    AlertTriangle,
    MessageSquare,
    Clock,
    Users,
    Sparkles,
    Briefcase
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_ACTIVE_PROJECTS,
    MOCK_ROOMS,
    formatRelativeTime,
    ProjectPhase
} from '@/data/mock-data';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProjectPhaseBadge } from '@/components/ProjectPhaseBadge';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function BuilderDashboardPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter founder projects (open projects from mock data)
    const founderIdeas = MOCK_PROJECTS.filter(p => p.status === 'open');
    const filteredIdeas = founderIdeas.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sector.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Active conversations (1-to-1 direct messages with founders)
    const founderChats = MOCK_ROOMS.filter(r => r.type === 'direct');
    const unreadChats = founderChats.filter(r => r.unread_count > 0);

    // Active projects
    const activeProjects = MOCK_ACTIVE_PROJECTS.filter(p => p.status === 'active');

    // Profile incomplete check
    const isProfileIncomplete = profile && !profile.profile_completed;

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login/user');
            return;
        }
        if (profile?.role_type === 'founder') {
            router.push('/dashboard/founder');
            return;
        }
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [profile, authLoading, router]);

    if (authLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-12 w-full max-w-md" />
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Clean Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back, {profile?.name?.split(' ')[0] || 'Builder'}
                    </h1>
                    <p className="text-muted-foreground">
                        Discover projects that match your skills
                    </p>
                </div>

                {/* Profile Warning - Compact */}
                {isProfileIncomplete && (
                    <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                        <p className="text-sm flex-1">Complete your profile to increase visibility to founders</p>
                        <Button variant="outline" size="sm" asChild className="shrink-0 border-warning/30 text-warning hover:bg-warning/10">
                            <Link href="/profile/edit">Complete</Link>
                        </Button>
                    </div>
                )}

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">{activeProjects.length}</p>
                                <p className="text-xs text-muted-foreground">Active Projects</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">{unreadChats.length}</p>
                                <p className="text-xs text-muted-foreground">Unread Messages</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">{founderIdeas.length}</p>
                                <p className="text-xs text-muted-foreground">Open Projects</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-10 h-11 bg-muted/30 border-border/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content - Projects */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Explore Projects</h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/explore">View all</Link>
                            </Button>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} className="h-28 w-full" />
                                ))}
                            </div>
                        ) : filteredIdeas.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
                                <p className="text-muted-foreground">No projects found</p>
                                {searchQuery && (
                                    <Button variant="link" onClick={() => setSearchQuery('')}>
                                        Clear search
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredIdeas.slice(0, 5).map((project) => (
                                    <Link key={project.id} href={`/projects/${project.id}`}>
                                        <div className="p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all group">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                                                            {project.title}
                                                        </h3>
                                                        <ProjectPhaseBadge phase={project.phase} showIcon={false} />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {project.vision}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {project.member_count}/{project.team_size_needed}
                                                        </span>
                                                        <span>{project.sector}</span>
                                                        <span>by {project.founder.name}</span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Messages */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Messages</h3>
                                {unreadChats.length > 0 && (
                                    <Badge variant="default" className="text-[10px]">
                                        {unreadChats.length} new
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-2">
                                {founderChats.slice(0, 4).map((chat) => (
                                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                                        <div className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                            chat.unread_count > 0
                                                ? "border-primary/30 bg-primary/5"
                                                : "border-border/50 bg-card/30 hover:bg-card/50"
                                        )}>
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="text-xs bg-muted">
                                                    {chat.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{chat.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {chat.last_message}
                                                </p>
                                            </div>
                                            {chat.unread_count > 0 && (
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Your Projects */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Your Projects</h3>
                            <div className="space-y-2">
                                {MOCK_ACTIVE_PROJECTS.map((project) => (
                                    <Link key={project.id} href={`/projects/${project.project_id}`}>
                                        <div className={cn(
                                            "p-3 rounded-lg border transition-all",
                                            project.status === 'archived'
                                                ? "border-border/30 opacity-50"
                                                : "border-border/50 bg-card/30 hover:bg-card/50"
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium truncate">{project.project_title}</span>
                                                <ProjectPhaseBadge phase={project.phase as ProjectPhase} showIcon={false} />
                                            </div>
                                            <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                                                <span>{project.role}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatRelativeTime(project.last_activity)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
