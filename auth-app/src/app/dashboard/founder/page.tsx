'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    Activity
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_INCOMING_APPLICATIONS,
    MOCK_TEAM_MEMBERS,
    MOCK_ROOMS,
    formatRelativeTime
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { DashboardCarousel } from '@/components/DashboardCarousel';
import { ProjectCard } from '@/components/ProjectCard';
import { StatCard } from '@/components/StatCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function FounderHomePage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Filter projects for this founder (using f1 for demo)
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const activeProjects = founderProjects.filter(p => p.status === 'open' || p.status === 'in-progress');
    const pendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');
    const teamMembers = MOCK_TEAM_MEMBERS.filter(m => founderProjects.some(p => p.id === m.project_id));

    // Direct messages
    const directMessages = MOCK_ROOMS.filter(r => r.type === 'direct').slice(0, 5);
    const unreadMessages = directMessages.filter(r => r.unread_count > 0);

    // Stats
    const stats = {
        projects: founderProjects.length,
        pending: pendingApplications.length,
        team: teamMembers.length,
        messages: unreadMessages.length
    };

    // Suggested contributors (mock)
    const suggestedContributors = [
        { id: '1', name: 'Alex Rivers', role: 'Frontend Lead', match: 95, skills: ['React', 'TypeScript'] },
        { id: '2', name: 'Sarah Chen', role: 'UI/UX Designer', match: 88, skills: ['Figma', 'Design Systems'] },
        { id: '3', name: 'Marcus Thorne', role: 'Backend Engineer', match: 92, skills: ['Node.js', 'PostgreSQL'] },
    ];

    // Team activity (mock)
    const teamActivity = [
        { id: '1', type: 'joined', user: 'Alex Rivers', project: 'Nexus AI', time: '2 hours ago' },
        { id: '2', type: 'contribution', user: 'Sarah Chen', project: 'EcoTrack', time: '5 hours ago' },
        { id: '3', type: 'joined', user: 'Marcus Thorne', project: 'Nexus AI', time: '1 day ago' },
    ];

    useEffect(() => {
        if (authLoading) return;
        if (!profile) {
            router.push('/');
            return;
        }
        if (profile && profile.role_type === 'user') {
            router.push('/builder/home');
        }
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
            <MainLayout>
                <div className="space-y-8">
                    <Skeleton className="h-24 w-full" />
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
                    {/* SECTION 1: Founder Snapshot */}
                    <section className="space-y-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
                                    </h1>
                                    <Badge variant="premium">Founder</Badge>
                                </div>
                                <p className="text-muted-foreground">
                                    Manage your projects and build high-performing teams
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/projects/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </Link>
                            </Button>
                        </div>

                        {/* High-level stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon={FolderKanban}
                                iconColor="text-primary"
                                value={stats.projects}
                                label="Total Projects"
                                href="/projects"
                            />
                            <StatCard
                                icon={AlertCircle}
                                iconColor={stats.pending > 0 ? "text-warning" : "text-muted-foreground"}
                                value={stats.pending}
                                label="Pending Requests"
                                highlight={stats.pending > 0}
                            />
                            <StatCard
                                icon={Users}
                                iconColor="text-blue-500"
                                value={stats.team}
                                label="Team Members"
                            />
                            <StatCard
                                icon={MessageSquare}
                                iconColor="text-green-500"
                                value={stats.messages}
                                label="Unread Messages"
                                href="/chat"
                                highlight={stats.messages > 0}
                            />
                        </div>
                    </section>

                    {/* SECTION 2: My Projects */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Your Projects"
                            subtitle="Active projects you're leading"
                            icon={FolderKanban}
                            badge={{ label: `${activeProjects.length} active`, variant: "secondary" }}
                            action={{ label: "Manage All", href: "/projects" }}
                        />
                        {activeProjects.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-border/50 rounded-lg">
                                <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground mb-4">No projects yet</p>
                                <Button asChild>
                                    <Link href="/projects/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Project
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <DashboardCarousel showArrows>
                                {activeProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        id={project.id}
                                        title={project.title}
                                        vision={project.vision}
                                        sector={project.sector}
                                        tags={project.skills_needed.slice(0, 3)}
                                        phase={project.phase}
                                        memberCount={project.member_count}
                                        teamSize={project.team_size_needed}
                                        variant="expanded"
                                    />
                                ))}
                            </DashboardCarousel>
                        )}
                    </section>

                    {/* SECTION 3: Join Requests */}
                    {pendingApplications.length > 0 && (
                        <section className="space-y-4 p-6 bg-warning/5 border border-warning/20 rounded-lg">
                            <SectionHeader
                                title="Join Requests"
                                subtitle="Review and respond to applicants"
                                icon={UserPlus}
                                badge={{ label: `${pendingApplications.length} pending`, variant: "warning" }}
                            />
                            <div className="space-y-3">
                                {pendingApplications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-warning/20 bg-card"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={app.applicant_avatar} />
                                            <AvatarFallback className="text-sm">
                                                {app.applicant_name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">{app.applicant_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Applied for <span className="text-foreground font-medium">{app.role_applied}</span> in {app.project_title}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                {formatRelativeTime(app.applied_at)}
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
                                                            <Loader2 className="h-5 w-5 animate-spin" />
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
                                                        className="h-9 w-9 text-destructive hover:bg-destructive/10"
                                                    >
                                                        {processingId === app.id ? (
                                                            <Loader2 className="h-5 w-5 animate-spin" />
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
                        </section>
                    )}

                    {/* SECTION 4: Team Activity */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Team Activity"
                            subtitle="Recent actions and updates from your team"
                            icon={Activity}
                        />
                        <div className="space-y-2">
                            {teamActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-card/50">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                        activity.type === 'joined' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                                    )}>
                                        {activity.type === 'joined' ? <UserPlus className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.user}</span>{' '}
                                            {activity.type === 'joined' ? 'joined' : 'contributed to'}{' '}
                                            <span className="font-medium">{activity.project}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 5: Communication Overview */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Recent Conversations"
                            icon={MessageSquare}
                            badge={unreadMessages.length > 0 ? { label: `${unreadMessages.length} unread`, variant: "default" } : undefined}
                            action={{ label: "View All", href: "/chat" }}
                        />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {directMessages.map((chat) => (
                                <Link key={chat.id} href={`/chat/${chat.id}`}>
                                    <div className={cn(
                                        "flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md",
                                        chat.unread_count > 0
                                            ? "border-primary/30 bg-primary/5"
                                            : "border-border/50 bg-card/50 hover:bg-card"
                                    )}>
                                        <Avatar className="h-10 w-10">
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
                                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 6: Insights */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Suggested Contributors"
                            subtitle="Talented builders who match your project needs"
                            action={{ label: "Browse All", href: "/explore" }}
                        />
                        <DashboardCarousel>
                            {suggestedContributors.map((contributor) => (
                                <div
                                    key={contributor.id}
                                    className="flex-shrink-0 w-80 p-5 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <Avatar className="h-14 w-14">
                                            <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                                {contributor.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold">{contributor.name}</p>
                                            <p className="text-sm text-muted-foreground">{contributor.role}</p>
                                            <Badge variant="secondary" className="text-[10px] mt-2">
                                                {contributor.match}% match
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {contributor.skills.map(skill => (
                                            <Badge key={skill} variant="outline" className="text-[10px]">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                        <Link href={`/profile/${contributor.id}`}>
                                            View Profile
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </DashboardCarousel>
                    </section>
                </div>
            </MainLayout>
        </TooltipProvider>
    );
}
