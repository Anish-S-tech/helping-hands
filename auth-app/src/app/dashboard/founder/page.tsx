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
        if (profile && profile.role_type === 'builder') {
            router.push('/dashboard/builder');
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
                <div className="max-w-[1400px] mx-auto space-y-10 pb-12 px-4 md:px-6">
                    {/* SECTION 1: Founder Snapshot / Welcome */}
                    <div className="space-y-8 animate-fade-in stagger-1">
                        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text">
                                        Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
                                    </h1>
                                    <Badge variant="premium" className="bg-primary/20 text-primary border-primary/30">Founder</Badge>
                                </div>
                                <p className="text-muted-foreground flex items-center gap-2 font-medium">
                                    <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] animate-pulse" />
                                    You have {pendingApplications.length} pending requests across {activeProjects.length} active projects.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" size="sm" className="h-10 px-4 hover:bg-muted/50" asChild>
                                    <Link href="/founder/projects">
                                        <FolderKanban className="mr-2 h-4 w-4" />
                                        Manage All
                                    </Link>
                                </Button>
                                <Button size="sm" className="h-10 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95" asChild>
                                    <Link href="/projects/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Project
                                    </Link>
                                </Button>
                            </div>
                        </section>

                        {/* High-level stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in stagger-2">
                            <StatCard
                                icon={FolderKanban}
                                value={stats.projects}
                                label="Total Projects"
                                highlight
                            />
                            <StatCard
                                icon={AlertCircle}
                                value={stats.pending}
                                label="Pending Requests"
                                iconColor={stats.pending > 0 ? "text-amber-500" : "text-muted-foreground"}
                                highlight={stats.pending > 0}
                            />
                            <StatCard
                                icon={Users}
                                value={stats.team}
                                label="Active Members"
                                iconColor="text-blue-500"
                            />
                            <StatCard
                                icon={MessageSquare}
                                value={stats.messages}
                                label="New Messages"
                                href="/chat"
                                iconColor="text-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* MAIN COLUMN (2/3) */}
                        <div className="lg:col-span-2 space-y-12 animate-fade-in stagger-3">
                            {/* SECTION 2: My Projects */}
                            <section className="space-y-6">
                                <SectionHeader
                                    title="Your Enterprise"
                                    subtitle="Active projects you're leading"
                                    badge={{ label: `${activeProjects.length} Active`, variant: "secondary" }}
                                    action={{ label: "Manage All", href: "/projects" }}
                                    className="px-1"
                                />
                                {activeProjects.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-border/40 rounded-3xl bg-muted/5">
                                        <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                                        <p className="text-sm font-semibold text-muted-foreground mb-6">No projects launched yet</p>
                                        <Button asChild className="rounded-full px-8">
                                            <Link href="/projects/create">Launch Your First Venture</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-transparent rounded-3xl blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                                        <DashboardCarousel showArrows className="relative pb-4">
                                            {activeProjects.map((project) => (
                                                <div key={project.id} className="min-w-[320px] max-w-[320px] px-1">
                                                    <ProjectCard
                                                        {...project}
                                                        tags={project.skills_needed.slice(0, 3)}
                                                        variant="default"
                                                    />
                                                </div>
                                            ))}
                                        </DashboardCarousel>
                                    </div>
                                )}
                            </section>

                            {/* SECTION 3: Join Requests */}
                            {pendingApplications.length > 0 && (
                                <section className="space-y-6 p-8 rounded-3xl bg-card border border-border/40 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
                                    <SectionHeader
                                        title="Pending Intel"
                                        subtitle="Review and respond to incoming talent requests"
                                        icon={UserPlus}
                                        badge={{ label: `${pendingApplications.length} Pending`, variant: "secondary" }}
                                    />
                                    <div className="space-y-4">
                                        {pendingApplications.map((app) => (
                                            <div
                                                key={app.id}
                                                className="flex items-center gap-5 p-5 rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm hover:border-amber-500/30 transition-all hover:shadow-lg"
                                            >
                                                <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                                                    <AvatarImage src={app.applicant_avatar} />
                                                    <AvatarFallback className="text-sm bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary font-bold">
                                                        {app.applicant_name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="font-bold text-sm">{app.applicant_name}</p>
                                                        <Badge variant="outline" className="text-[9px] h-4 font-bold border-primary/20 bg-primary/5 text-primary">Top Match</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate font-medium">
                                                        Applied for <span className="text-amber-500/90 font-bold">{app.role_applied}</span> in {app.project_title}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAccept(app.id)}
                                                        disabled={processingId === app.id}
                                                        className="h-9 w-9 rounded-full text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-all active:scale-90"
                                                    >
                                                        {processingId === app.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="h-5 w-5" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleReject(app.id)}
                                                        disabled={processingId === app.id}
                                                        className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10 transition-all active:scale-90"
                                                    >
                                                        {processingId === app.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5" />
                                                        )}
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 rounded-full text-[10px] font-bold border-border/60" asChild>
                                                        <Link href={`/profile/${app.applicant_id}`}>
                                                            Profile
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* SECTION 4: Discovery */}
                            <section className="space-y-6">
                                <SectionHeader
                                    title="Talent Pool"
                                    subtitle="High-impact builders matching your vision"
                                    action={{ label: "View All Talent", href: "/explore" }}
                                    className="px-1"
                                />
                                <DashboardCarousel>
                                    {suggestedContributors.map((contributor) => (
                                        <div
                                            key={contributor.id}
                                            className="flex-shrink-0 w-80 p-6 rounded-3xl border border-border/40 bg-card hover:border-primary/40 transition-all hover:shadow-xl group"
                                        >
                                            <div className="flex items-start gap-4 mb-5">
                                                <Avatar className="h-16 w-16 border-2 border-background shadow-lg group-hover:scale-105 transition-transform">
                                                    <AvatarFallback className="text-base bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary font-bold">
                                                        {contributor.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <p className="font-bold text-base leading-tight">{contributor.name}</p>
                                                    <p className="text-xs text-muted-foreground font-medium mb-2">{contributor.role}</p>
                                                    <Badge className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                        {contributor.match}% Match
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-6">
                                                {contributor.skills.map(skill => (
                                                    <Badge key={skill} variant="outline" className="text-[9px] py-0 h-4 font-bold bg-muted/30">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full h-10 rounded-xl font-bold hover:bg-primary/5 hover:border-primary/30 transition-all" asChild>
                                                <Link href={`/profile/${contributor.id}`}>
                                                    View Intelligence
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </DashboardCarousel>
                            </section>
                        </div>

                        {/* SIDEBAR COLUMN (1/3) */}
                        <div className="space-y-10 animate-fade-in stagger-4">
                            {/* Mission Control Sidebar Card */}
                            <section className="p-6 rounded-3xl border border-primary/20 bg-primary/5 space-y-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full -mr-12 -mt-12" />
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">Venture Status</h4>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Operational Health</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span>Team Capacity</span>
                                            <span>72%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full w-[72%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span>Launch Readiness</span>
                                            <span>90%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full w-[90%] shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold h-8 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                                    VIEW FULL ANALYTICS
                                </Button>
                            </section>

                            {/* Team Activity Sidebar */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/50">
                                        Team Signals
                                    </h3>
                                    <Activity className="h-3.5 w-3.5 text-muted-foreground/40" />
                                </div>
                                <div className="space-y-3">
                                    {teamActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center gap-4 p-4 border border-border/30 rounded-2xl bg-card/40 hover:bg-card/60 transition-colors">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                activity.type === 'joined' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                            )}>
                                                {activity.type === 'joined' ? <UserPlus className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] leading-relaxed">
                                                    <span className="font-bold text-foreground">{activity.user}</span>{' '}
                                                    <span className="text-muted-foreground opacity-80">{activity.type === 'joined' ? 'joined' : 'pushed to'}</span>{' '}
                                                    <span className="font-bold text-primary/90">{activity.project}</span>
                                                </p>
                                                <p className="text-[9px] text-muted-foreground/60 font-medium tracking-tight mt-0.5 uppercase">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Messages Mini Sidebar */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/50">
                                        Direct Intel
                                    </h3>
                                    <Link href="/chat" className="text-[10px] font-extrabold text-primary hover:text-primary/80 transition-colors">
                                        VIEW INBOX
                                    </Link>
                                </div>
                                <div className="space-y-2">
                                    {directMessages.slice(0, 3).map((chat) => (
                                        <Link key={chat.id} href={`/chat/${chat.id}`} className="block">
                                            <div className={cn(
                                                "flex items-center gap-3 p-3 rounded-2xl border transition-all hover:shadow-sm",
                                                chat.unread_count > 0
                                                    ? "border-primary/40 bg-primary/5"
                                                    : "border-border/30 bg-card/40 hover:bg-card hover:border-border/60"
                                            )}>
                                                <div className="relative">
                                                    <Avatar className="h-10 w-10 border border-border/50">
                                                        <AvatarFallback className="text-[10px] font-bold bg-muted uppercase text-muted-foreground">
                                                            {chat.name.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {chat.unread_count > 0 && (
                                                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <p className={cn("text-xs font-bold truncate", chat.unread_count > 0 ? "text-foreground" : "text-foreground/90")}>{chat.name}</p>
                                                        <span className="text-[9px] text-muted-foreground/60 tabular-nums font-medium">2m</span>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground truncate opacity-70 italic font-medium leading-tight">
                                                        "{chat.last_message}"
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </TooltipProvider>
    );
}
