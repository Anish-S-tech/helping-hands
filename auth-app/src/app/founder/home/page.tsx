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
    Activity,
    Settings,
    Send,
    ExternalLink,
    Undo
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
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

    // State for interactivity
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [processedRequests, setProcessedRequests] = useState<Record<string, 'accepted' | 'rejected'>>({});
    const [undoTimers, setUndoTimers] = useState<Record<string, NodeJS.Timeout>>({});
    const [quickReplyOpen, setQuickReplyOpen] = useState<string | null>(null);
    const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({});
    const [invitedContributors, setInvitedContributors] = useState<string[]>([]);
    const [teamActivityHighlight, setTeamActivityHighlight] = useState<string[]>([]);

    // Filter projects for this founder (using f1 for demo)
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const activeProjects = founderProjects.filter(p => p.status === 'open' || p.status === 'in-progress');

    // Filter out processed requests
    const allPendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');
    const pendingApplications = allPendingApplications.filter(app => !processedRequests[app.id]);

    const teamMembers = MOCK_TEAM_MEMBERS.filter(m => founderProjects.some(p => p.id === m.project_id));

    // Direct messages
    const directMessages = MOCK_ROOMS.filter(r => r.type === 'direct').slice(0, 5);

    // Initialize unread counts
    useEffect(() => {
        const initialUnread: Record<string, number> = {};
        directMessages.forEach(msg => {
            initialUnread[msg.id] = msg.unread_count;
        });
        setUnreadMessages(initialUnread);
    }, []);

    const unreadMsgs = directMessages.filter(r => (unreadMessages[r.id] || 0) > 0);

    // Stats
    const stats = {
        projects: founderProjects.length,
        pending: pendingApplications.length,
        team: teamMembers.length,
        messages: unreadMsgs.length
    };

    // Suggested contributors (mock)
    const suggestedContributors = [
        { id: '1', name: 'Alex Rivers', role: 'Frontend Lead', match: 95, skills: ['React', 'TypeScript'], avatar: null },
        { id: '2', name: 'Sarah Chen', role: 'UI/UX Designer', match: 88, skills: ['Figma', 'Design Systems'], avatar: null },
        { id: '3', name: 'Marcus Thorne', role: 'Backend Engineer', match: 92, skills: ['Node.js', 'PostgreSQL'], avatar: null },
    ];

    // Team activity (mock with live updates simulation)
    const [teamActivity, setTeamActivity] = useState([
        { id: '1', type: 'joined', user: 'Alex Rivers', project: 'Nexus AI', time: '2 hours ago' },
        { id: '2', type: 'contribution', user: 'Sarah Chen', project: 'EcoTrack', time: '5 hours ago' },
        { id: '3', type: 'joined', user: 'Marcus Thorne', project: 'Nexus AI', time: '1 day ago' },
    ]);

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

    // INTERACTIVE HANDLERS
    const handleAccept = async (id: string) => {
        setProcessingId(id);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setProcessingId(null);
        setProcessedRequests(prev => ({ ...prev, [id]: 'accepted' }));

        // Setup undo timer (3 seconds)
        const timer = setTimeout(() => {
            // Permanently remove from undo options
            setUndoTimers(prev => {
                const newTimers = { ...prev };
                delete newTimers[id];
                return newTimers;
            });
        }, 3000);

        setUndoTimers(prev => ({ ...prev, [id]: timer }));
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        setProcessingId(null);
        setProcessedRequests(prev => ({ ...prev, [id]: 'rejected' }));

        // Setup undo timer (3 seconds)
        const timer = setTimeout(() => {
            setUndoTimers(prev => {
                const newTimers = { ...prev };
                delete newTimers[id];
                return newTimers;
            });
        }, 3000);

        setUndoTimers(prev => ({ ...prev, [id]: timer }));
    };

    const handleUndo = (id: string) => {
        // Clear timer
        if (undoTimers[id]) {
            clearTimeout(undoTimers[id]);
        }

        // Remove from processed
        setProcessedRequests(prev => {
            const newProcessed = { ...prev };
            delete newProcessed[id];
            return newProcessed;
        });

        setUndoTimers(prev => {
            const newTimers = { ...prev };
            delete newTimers[id];
            return newTimers;
        });
    };

    const handleInviteContributor = async (contributorId: string) => {
        setProcessing Id(contributorId);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setProcessingId(null);
        setInvitedContributors(prev => [...prev, contributorId]);
    };

    const handleQuickReply = (messageId: string) => {
        setQuickReplyOpen(quickReplyOpen === messageId ? null : messageId);
    };

    const handleMessageClick = (messageId: string) => {
        setUnreadMessages(prev => ({ ...prev, [messageId]: 0 }));
        router.push(`/chat/${messageId}`);
    };

    // Simulate live team activity updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly add new activity (10% chance every 5 seconds)
            if (Math.random() < 0.1) {
                const newActivity = {
                    id: `activity-${Date.now()}`,
                    type: Math.random() > 0.5 ? 'joined' : 'contribution',
                    user: ['Alex Rivers', 'Sarah Chen', 'Marcus Thorne'][Math.floor(Math.random() * 3)],
                    project: ['Nexus AI', 'EcoTrack'][Math.floor(Math.random() * 2)],
                    time: 'Just now'
                };

                setTeamActivity(prev => [newActivity, ...prev].slice(0, 5));
                setTeamActivityHighlight(prev => [...prev, newActivity.id]);

                // Remove highlight after 3 seconds
                setTimeout(() => {
                    setTeamActivityHighlight(prev => prev.filter(id => id !== newActivity.id));
                }, 3000);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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

                    {/* SECTION 2: My Projects (with Hover Actions) */}
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
                                {activeProjects.map((project) => {
                                    const requestCount = allPendingApplications.filter(
                                        app => app.project_id === project.id
                                    ).length;

                                    return (
                                        <div key={project.id} className="group relative">
                                            <ProjectCard
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

                                            {/* Hover Overlay with Quick Actions */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-6 pointer-events-none group-hover:pointer-events-auto">
                                                <div className="grid grid-cols-3 gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => router.push(`/projects/${project.id}/manage`)}
                                                    >
                                                        <Settings className="mr-1 h-4 w-4" />
                                                        Manage
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => router.push(`/requests?project=${project.id}`)}
                                                        className="relative"
                                                    >
                                                        <Users className="mr-1 h-4 w-4" />
                                                        Requests
                                                        {requestCount > 0 && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                                                            >
                                                                {requestCount}
                                                            </Badge>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => router.push(`/chat/${project.id}`)}
                                                    >
                                                        <MessageSquare className="mr-1 h-4 w-4" />
                                                        Chat
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </DashboardCarousel>
                        )}
                    </section>

                    {/* SECTION 3: Join Requests (Inline Actions with Undo) */}
                    {(pendingApplications.length > 0 || Object.keys(processedRequests).length > 0) && (
                        <section className="space-y-4 p-6 bg-warning/5 border border-warning/20 rounded-lg">
                            <SectionHeader
                                title="Join Requests"
                                subtitle="Review and respond to applicants"
                                icon={UserPlus}
                                badge={{ label: `${pendingApplications.length} pending`, variant: "warning" }}
                            />
                            <div className="space-y-3">
                                {/* Pending Requests */}
                                {pendingApplications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-warning/20 bg-card animate-fade-in-up"
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

                                {/* Processed Requests with Undo */}
                                {Object.entries(processedRequests).map(([id, status]) => {
                                    const app = allPendingApplications.find(a => a.id === id);
                                    if (!app || !undoTimers[id]) return null;

                                    return (
                                        <div
                                            key={id}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-lg border animate-fade-in",
                                                status === 'accepted'
                                                    ? "border-green-500/30 bg-green-500/10"
                                                    : "border-red-500/30 bg-red-500/10"
                                            )}
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {app.applicant_name} {status === 'accepted' ? 'accepted' : 'rejected'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {status === 'accepted' ? 'Welcome to the team!' : 'Application declined'}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleUndo(id)}
                                            >
                                                <Undo className="mr-2 h-4 w-4" />
                                                Undo
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* SECTION 4: Team Activity (Live Updates) */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Team Activity"
                            subtitle="Recent actions and updates from your team"
                            icon={Activity}
                        />
                        <div className="space-y-2">
                            {teamActivity.map((activity) => {
                                const isHighlighted = teamActivityHighlight.includes(activity.id);

                                return (
                                    <div
                                        key={activity.id}
                                        className={cn(
                                            "flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-card/50 transition-all cursor-pointer hover:shadow-md",
                                            isHighlighted && "border-primary/50 bg-primary/10 animate-pulse"
                                        )}
                                        onClick={() => router.push(`/projects/${activity.project}`)}
                                    >
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
                                        {isHighlighted && (
                                            <Badge variant="default" className="text-[10px]">NEW</Badge>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 5: Communication Overview (Quick Reply) */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Recent Conversations"
                            icon={MessageSquare}
                            badge={unreadMsgs.length > 0 ? { label: `${unreadMsgs.length} unread`, variant: "default" } : undefined}
                            action={{ label: "View All", href: "/chat" }}
                        />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {directMessages.map((chat) => {
                                const isUnread = (unreadMessages[chat.id] || 0) > 0;
                                const showQuickReply = quickReplyOpen === chat.id;

                                return (
                                    <div key={chat.id} className="group">
                                        <div
                                            onClick={() => handleMessageClick(chat.id)}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                                                isUnread
                                                    ? "border-primary/30 bg-primary/5 hover:shadow-md"
                                                    : "border-border/50 bg-card/50 hover:bg-card hover:shadow-md"
                                            )}
                                        >
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
                                            {isUnread && (
                                                <Badge variant="default" className="text-[10px] shrink-0">
                                                    {unreadMessages[chat.id]}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Quick Reply */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full text-xs"
                                                onClick={() => handleQuickReply(chat.id)}
                                            >
                                                <Send className="mr-2 h-3 w-3" />
                                                Quick Reply
                                            </Button>
                                        </div>

                                        {showQuickReply && (
                                            <div className="mt-2 p-3 border rounded-lg bg-card animate-fade-in-up">
                                                <Input
                                                    placeholder="Type your message..."
                                                    className="text-sm"
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <Button size="sm" className="flex-1">
                                                        <Send className="mr-2 h-3 w-3" />
                                                        Send
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setQuickReplyOpen(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 6: Insights & Suggestions (Invite Actions) */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Suggested Contributors"
                            subtitle="Talented builders who match your project needs"
                            action={{ label: "Browse All", href: "/explore" }}
                        />
                        <DashboardCarousel>
                            {suggestedContributors.map((contributor) => {
                                const isInvited = invitedContributors.includes(contributor.id);
                                const isLoading = processingId === contributor.id;

                                return (
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
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                asChild
                                            >
                                                <Link href={`/profile/${contributor.id}`}>
                                                    View Profile
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleInviteContributor(contributor.id)}
                                                disabled={isLoading || isInvited}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Inviting...
                                                    </>
                                                ) : isInvited ? (
                                                    <>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Invited
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        Invite
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </DashboardCarousel>
                    </section>
                </div>
            </MainLayout>
        </TooltipProvider>
    );
}
