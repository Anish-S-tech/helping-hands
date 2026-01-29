'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import {
    Plus,
    FolderKanban,
    Users,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    TrendingUp,
    UserPlus,
    Activity,
    Layers,
    Clock,
    Star,
    ChevronRight,
    Briefcase,
    Edit,
    Sparkles,
    Rocket,
    Target,
    ArrowRight,
    Settings,
    Eye
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_INCOMING_APPLICATIONS,
    MOCK_TEAM_MEMBERS,
    MOCK_ROOMS,
    formatRelativeTime,
    type Project
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { DashboardCarousel } from '@/components/DashboardCarousel';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Image mapping for projects
const PROJECT_IMAGE_MAP: Record<string, string> = {
    p1: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
    p2: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
    p3: 'https://images.pexels.com/photos/3730760/pexels-photo-3730760.jpeg?auto=compress&cs=tinysrgb&w=800',
    p4: 'https://images.pexels.com/photos/8370755/pexels-photo-8370755.jpeg?auto=compress&cs=tinysrgb&w=800',
    p5: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800',
    p6: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
};

function getProjectImage(project: Project): string {
    if (PROJECT_IMAGE_MAP[project.id]) return PROJECT_IMAGE_MAP[project.id];
    return 'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=800';
}

// Project Hero Card with image
function ProjectHeroCard({ project, onView }: { project: Project; onView: () => void }) {
    const imageSrc = getProjectImage(project);

    return (
        <Card
            className="group relative flex w-72 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-border/60 bg-card/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            onClick={onView}
        >
            <div className="relative h-36 w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 288px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute left-3 top-3 flex flex-col gap-1">
                    <Badge variant="secondary" className="w-max text-[10px] font-semibold backdrop-blur-sm">
                        {project.sector}
                    </Badge>
                    <Badge
                        variant={project.status === 'open' ? 'active' : project.status === 'in-progress' ? 'warning' : 'outline'}
                        className="w-max text-[10px] font-semibold backdrop-blur-sm"
                    >
                        {project.status === 'open' ? 'Open' : project.status === 'in-progress' ? 'In Progress' : 'Closed'}
                    </Badge>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] text-white/90">
                    <Layers className="h-3.5 w-3.5" />
                    <span className="truncate font-medium drop-shadow-sm">{project.phase.toUpperCase()}</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-semibold tracking-tight group-hover:text-primary">
                            {project.title}
                        </h3>
                        <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                            {formatRelativeTime(project.last_activity)}
                        </span>
                    </div>
                    <p className="line-clamp-2 text-[12px] text-muted-foreground/90">
                        {project.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {project.skills_needed.slice(0, 3).map((skill) => (
                        <Badge
                            key={skill}
                            variant="secondary"
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-secondary/40 border-0"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-dashed border-border/60 pt-3 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        <span>{project.member_count}/{project.team_size_needed} team</span>
                    </div>
                    <span className="truncate">{project.applications_pending} applicants</span>
                </div>
            </div>
        </Card>
    );
}

// Explore style card for grid layout
function ExploreStyleProjectCard({ project, onView }: { project: Project; onView: () => void }) {
    const imageSrc = getProjectImage(project);

    return (
        <Card
            className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
            onClick={onView}
        >
            <div className="relative h-32 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <Badge
                    variant={project.status === 'open' ? 'active' : 'secondary'}
                    className="absolute top-2 left-2 text-[9px]"
                >
                    {project.status}
                </Badge>
            </div>
            <CardContent className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{project.sector}</p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.member_count}/{project.team_size_needed}
                    </span>
                    <span>{formatRelativeTime(project.last_activity)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function FounderHomePage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Filter projects for this founder
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const activeProjects = founderProjects.filter(p => p.status === 'open' || p.status === 'in-progress');
    const pendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');
    const teamMembers = MOCK_TEAM_MEMBERS.filter(m => founderProjects.some(p => p.id === m.project_id));

    // Messages
    const directMessages = MOCK_ROOMS.filter(r => r.type === 'direct').slice(0, 5);
    const unreadMessages = directMessages.filter(r => r.unread_count > 0);

    // Stats
    const stats = {
        projects: founderProjects.length,
        pending: pendingApplications.length,
        team: teamMembers.length,
        messages: unreadMessages.length
    };

    useEffect(() => {
        if (authLoading) return;
        if (profile && profile.role_type === 'user') {
            router.push('/builder/home');
        }
    }, [profile, authLoading, router]);

    const handleViewProject = (id: string) => {
        router.push(`/projects/${id}`);
    };

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
            <MainLayout>
                <div className="space-y-8">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </MainLayout>
        );
    }

    return (
        <TooltipProvider>
            <MainLayout>
                <div className="max-w-[1400px] mx-auto space-y-10">
                    {/* HERO SECTION */}
                    <section className="grid gap-6 rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/5 p-6 md:grid-cols-[2fr,1.2fr] md:p-8">
                        <div className="flex flex-col justify-center space-y-5">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Badge variant="premium" className="gap-1.5 px-3 py-1">
                                        <Star className="h-3 w-3" />
                                        Founder Dashboard
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                    Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
                                </h1>
                                <p className="text-muted-foreground max-w-lg">
                                    Build amazing projects and assemble your dream team. Here's an overview of your founder journey.
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FolderKanban className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{stats.projects}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Projects</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50">
                                    <div className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg",
                                        stats.pending > 0 ? "bg-amber-500/10 text-amber-500" : "bg-muted"
                                    )}>
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{stats.pending}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{stats.team}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Team</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50">
                                    <div className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg",
                                        stats.messages > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-muted"
                                    )}>
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{stats.messages}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Unread</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button asChild className="gap-2 shadow-lg shadow-primary/20">
                                    <Link href="/projects/create">
                                        <Plus className="h-4 w-4" />
                                        Create Project
                                    </Link>
                                </Button>
                                <Button variant="outline" className="gap-2" asChild>
                                    <Link href="/profile/edit">
                                        <Edit className="h-4 w-4" />
                                        Edit Profile
                                    </Link>
                                </Button>
                                <Button variant="outline" className="gap-2" asChild>
                                    <Link href="/chat">
                                        <MessageSquare className="h-4 w-4" />
                                        Messages
                                        {stats.messages > 0 && (
                                            <Badge variant="default" className="ml-1 h-5 px-1.5">{stats.messages}</Badge>
                                        )}
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right side - Quick info panel */}
                        <div className="hidden md:flex flex-col gap-4">
                            <Card className="flex-1 border-border/40 bg-card/60">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Team Growth</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end gap-4">
                                        <div>
                                            <p className="text-3xl font-bold">{stats.team}</p>
                                            <p className="text-sm text-muted-foreground">total members</p>
                                        </div>
                                        <div className="flex-1">
                                            <Progress value={Math.min((stats.team / 20) * 100, 100)} className="h-2" />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {Math.round((stats.team / 20) * 100)}% of capacity
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 border-border/40 bg-card/60">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-bold text-amber-500">{stats.pending}</p>
                                            <p className="text-sm text-muted-foreground">awaiting review</p>
                                        </div>
                                        {stats.pending > 0 && (
                                            <Button variant="outline" size="sm" className="gap-1" asChild>
                                                <Link href="#requests">
                                                    Review <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* YOUR PROJECTS */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <FolderKanban className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">Your Projects</h2>
                                    <p className="text-sm text-muted-foreground">{activeProjects.length} active projects</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1" asChild>
                                <Link href="/projects">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        {activeProjects.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                                        <FolderKanban className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold mb-2">No projects yet</h3>
                                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                        Create your first project and start building your team
                                    </p>
                                    <Button asChild>
                                        <Link href="/projects/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Your First Project
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <DashboardCarousel showArrows>
                                {activeProjects.map((project) => (
                                    <ProjectHeroCard
                                        key={project.id}
                                        project={project}
                                        onView={() => handleViewProject(project.id)}
                                    />
                                ))}
                            </DashboardCarousel>
                        )}
                    </section>

                    {/* JOIN REQUESTS */}
                    {pendingApplications.length > 0 && (
                        <section id="requests" className="space-y-4 p-6 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                                        <UserPlus className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">Join Requests</h2>
                                        <p className="text-sm text-muted-foreground">{pendingApplications.length} pending review</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {pendingApplications.map((app) => (
                                    <Card key={app.id} className="border-amber-500/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 ring-2 ring-background">
                                                    <AvatarImage src={app.applicant_avatar} />
                                                    <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-violet-500/20">
                                                        {app.applicant_name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold">{app.applicant_name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Applied for <span className="text-foreground font-medium">{app.role_applied}</span> in {app.project_title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatRelativeTime(app.applied_at)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handleAccept(app.id)}
                                                                disabled={processingId === app.id}
                                                                className="h-9 w-9 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                                            >
                                                                {processingId === app.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Accept</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handleReject(app.id)}
                                                                disabled={processingId === app.id}
                                                                className="h-9 w-9 border-destructive/30 text-destructive hover:bg-destructive/10"
                                                            >
                                                                {processingId === app.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Reject</TooltipContent>
                                                    </Tooltip>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/profile/${app.applicant_id}`}>
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Profile
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* DISCOVER PROJECTS */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                                    <Sparkles className="h-5 w-5 text-violet-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">Discover Projects</h2>
                                    <p className="text-sm text-muted-foreground">Explore what others are building</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1" asChild>
                                <Link href="/explore">
                                    Browse All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {MOCK_PROJECTS.filter(p => p.founder.id !== 'f1').slice(0, 4).map((project) => (
                                <ExploreStyleProjectCard
                                    key={project.id}
                                    project={project}
                                    onView={() => handleViewProject(project.id)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* RECENT CONVERSATIONS */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">Recent Conversations</h2>
                                    {unreadMessages.length > 0 && (
                                        <p className="text-sm text-muted-foreground">{unreadMessages.length} unread messages</p>
                                    )}
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1" asChild>
                                <Link href="/chat">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {directMessages.map((chat) => (
                                <Link key={chat.id} href={`/chat/${chat.id}`}>
                                    <Card className={cn(
                                        "transition-all hover:shadow-md",
                                        chat.unread_count > 0
                                            ? "border-primary/30 bg-primary/5"
                                            : "hover:border-primary/20"
                                    )}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${chat.id}`} />
                                                        <AvatarFallback className="text-xs bg-muted">
                                                            {chat.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className={cn(
                                                            "text-sm truncate",
                                                            chat.unread_count > 0 ? "font-semibold" : "font-medium"
                                                        )}>
                                                            {chat.name}
                                                        </p>
                                                        {chat.last_message_time && (
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {formatRelativeTime(chat.last_message_time)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {chat.last_message}
                                                    </p>
                                                </div>
                                                {chat.unread_count > 0 && (
                                                    <Badge className="h-5 px-1.5 text-[10px]">
                                                        {chat.unread_count}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </MainLayout>
        </TooltipProvider>
    );
}
