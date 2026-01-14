'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Plus,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Users,
    Loader2,
    AlertCircle,
    MessageSquare,
    FolderKanban,
    Clock
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_INCOMING_APPLICATIONS,
    MOCK_TEAM_MEMBERS,
    MOCK_ROOMS,
    formatRelativeTime
} from '@/data/mock-data';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProjectPhaseBadge } from '@/components/ProjectPhaseBadge';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export default function FounderDashboardPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Filter projects for this founder (using f1 for demo)
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const pendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');
    const teamMembers = MOCK_TEAM_MEMBERS.filter(m => founderProjects.some(p => p.id === m.project_id));

    // Direct messages
    const directMessages = MOCK_ROOMS.filter(r => r.type === 'direct');
    const unreadMessages = directMessages.filter(r => r.unread_count > 0);

    // Stats
    const stats = {
        projects: founderProjects.length,
        pending: pendingApplications.length,
        team: teamMembers.length,
        messages: unreadMessages.length
    };

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login/founder');
            return;
        }
        if (profile?.role_type === 'user') {
            router.push('/dashboard/builder');
            return;
        }
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [profile, authLoading, router]);

    const handleAccept = (id: string) => {
        setProcessingId(id);
        setTimeout(() => setProcessingId(null), 1000);
    };

    const handleReject = (id: string) => {
        setProcessingId(id);
        setTimeout(() => setProcessingId(null), 1000);
    };

    if (authLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-20" />
                        ))}
                    </div>
                    <Skeleton className="h-64 w-full" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <TooltipProvider>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Clean Header */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome back, {profile?.name?.split(' ')[0] || 'Founder'}
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your projects and team
                            </p>
                        </div>
                        <Button size="sm" asChild>
                            <Link href="/projects/create">
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Link>
                        </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FolderKanban className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{stats.projects}</p>
                                    <p className="text-xs text-muted-foreground">Projects</p>
                                </div>
                            </div>
                        </div>
                        <div className={cn(
                            "p-4 rounded-lg border bg-card/50",
                            stats.pending > 0 ? "border-warning/30 bg-warning/5" : "border-border/50"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center",
                                    stats.pending > 0 ? "bg-warning/10" : "bg-muted/50"
                                )}>
                                    <AlertCircle className={cn(
                                        "h-5 w-5",
                                        stats.pending > 0 ? "text-warning" : "text-muted-foreground"
                                    )} />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{stats.pending}</p>
                                    <p className="text-xs text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{stats.team}</p>
                                    <p className="text-xs text-muted-foreground">Team</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{stats.messages}</p>
                                    <p className="text-xs text-muted-foreground">Messages</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Pending Applications - Priority Section */}
                            {pendingApplications.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-semibold">Pending Applications</h2>
                                            <Badge variant="warning" className="text-[10px]">
                                                {pendingApplications.length} to review
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {pendingApplications.map((app) => (
                                            <div
                                                key={app.id}
                                                className="flex items-center gap-4 p-4 rounded-lg border border-warning/20 bg-warning/5"
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={app.applicant_avatar} />
                                                    <AvatarFallback className="text-xs">
                                                        {app.applicant_name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium">{app.applicant_name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {app.role_applied} for {app.project_title}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleAccept(app.id)}
                                                                disabled={processingId === app.id}
                                                                className="h-9 w-9 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                                            >
                                                                {processingId === app.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="h-5 w-5" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Accept</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleReject(app.id)}
                                                                disabled={processingId === app.id}
                                                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                {processingId === app.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="h-5 w-5" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Reject</TooltipContent>
                                                    </Tooltip>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/profile/${app.applicant_id}`}>
                                                            View Profile
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Your Projects</h2>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/projects">View all</Link>
                                    </Button>
                                </div>
                                {loading ? (
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => (
                                            <Skeleton key={i} className="h-20 w-full" />
                                        ))}
                                    </div>
                                ) : founderProjects.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
                                        <p className="text-muted-foreground mb-3">No projects yet</p>
                                        <Button size="sm" asChild>
                                            <Link href="/projects/create">Create your first project</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {founderProjects.map((project) => (
                                            <Link key={project.id} href={`/projects/${project.id}`}>
                                                <div className="p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all group">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                                                                    {project.title}
                                                                </h3>
                                                                <ProjectPhaseBadge phase={project.phase} showIcon={false} />
                                                                <Badge
                                                                    variant={project.status === 'open' ? 'active' : 'secondary'}
                                                                    className="text-[10px]"
                                                                >
                                                                    {project.status}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Users className="h-3 w-3" />
                                                                    {project.member_count}/{project.team_size_needed} members
                                                                </span>
                                                                {project.applications_pending > 0 && (
                                                                    <span className="text-warning flex items-center gap-1">
                                                                        <AlertCircle className="h-3 w-3" />
                                                                        {project.applications_pending} pending
                                                                    </span>
                                                                )}
                                                                <span>{project.sector}</span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Messages */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Messages</h3>
                                    {unreadMessages.length > 0 && (
                                        <Badge variant="default" className="text-[10px]">
                                            {unreadMessages.length} new
                                        </Badge>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {directMessages.slice(0, 4).map((chat) => (
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

                            {/* Team */}
                            <div className="space-y-3">
                                <h3 className="font-semibold">Team Members</h3>
                                <div className="space-y-2">
                                    {teamMembers.slice(0, 5).map((member) => (
                                        <Link key={member.id} href={`/profile/${member.user_id}`}>
                                            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={member.avatar_url} />
                                                    <AvatarFallback className="text-xs bg-muted">
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {member.role}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={member.role_badge === 'founder' ? 'premium' : 'secondary'}
                                                    className="text-[9px]"
                                                >
                                                    {member.role_badge}
                                                </Badge>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </TooltipProvider>
    );
}
