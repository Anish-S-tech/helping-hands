'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Sparkles,
    Briefcase,
    MessageSquare,
    AlertTriangle,
    Edit,
    X,
    Clock,
    TrendingUp,
    Loader2,
    Send,
    ExternalLink,
    UserPlus,
    CheckCircle2
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_ACTIVE_PROJECTS,
    MOCK_ROOMS,
    formatRelativeTime,
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { DashboardCarousel } from '@/components/DashboardCarousel';
import { ProjectCard } from '@/components/ProjectCard';
import { StatCard } from '@/components/StatCard';
import { FilterChips } from '@/components/FilterChips';
import { SectionHeader } from '@/components/SectionHeader';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectPhase, Project } from "@/data/mock-data";

export default function BuilderHomePage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    // State for interactivity
    const [activeSkills, setActiveSkills] = useState<string[]>([]);
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
    const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
    const [joinedProjects, setJoinedProjects] = useState<string[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<Project[]>([]);
    const [quickReplyOpen, setQuickReplyOpen] = useState<string | null>(null);
    const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({});
    const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

    // Mock skills for filtering
    const skillChips = [
        { id: 'nextjs', label: 'Next.js', count: 8 },
        { id: 'react', label: 'React', count: 12 },
        { id: 'typescript', label: 'TypeScript', count: 10 },
        { id: 'tailwind', label: 'Tailwind', count: 6 },
        { id: 'python', label: 'Python', count: 5 },
        { id: 'nodejs', label: 'Node.js', count: 7 },
    ];

    // Filter recommended projects based on active skills
    const allRecommendedProjects = MOCK_PROJECTS.filter(p => p.status === 'open');
    const recommendedProjects = activeSkills.length > 0
        ? allRecommendedProjects.filter(p =>
            p.skills_needed.some(skill =>
                activeSkills.some(activeSkill =>
                    skill.toLowerCase().includes(activeSkill.toLowerCase())
                )
            )
        ).slice(0, 8)
        : allRecommendedProjects.slice(0, 8);

    // Active conversations with unread tracking
    const directMessages = MOCK_ROOMS.filter(r => r.type === 'direct').slice(0, 5);

    // Initialize unread counts
    useEffect(() => {
        const initialUnread: Record<string, number> = {};
        directMessages.forEach(msg => {
            initialUnread[msg.id] = msg.unread_count;
        });
        setUnreadMessages(initialUnread);
    }, []);

    const unreadChats = directMessages.filter(r => (unreadMessages[r.id] || 0) > 0);

    // Active projects
    const activeProjects = MOCK_ACTIVE_PROJECTS.filter(p => p.status === 'active');

    // Profile incomplete check
    const isProfileIncomplete = profile && !profile.profile_completed;

    // Important notifications/alerts
    const alerts = [
        { id: 'profile', type: 'warning', message: 'Complete your profile to increase visibility', action: '/profile/edit', actionLabel: 'Complete Profile' },
    ].filter(alert => !dismissedAlerts.includes(alert.id) && (alert.id === 'profile' ? isProfileIncomplete : true));

    useEffect(() => {
        if (authLoading) return;
        if (!profile) {
            router.push('/');
            return;
        }
        if (profile && profile.role_type === 'founder') {
            router.push('/founder/home');
        }
    }, [profile, authLoading, router]);

    // INTERACTIVE HANDLERS
    const handleSkillToggle = (skillId: string) => {
        setActiveSkills(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : [...prev, skillId]
        );
    };

    const dismissAlert = (id: string) => {
        setDismissedAlerts(prev => [...prev, id]);
    };

    const handleRequestToJoin = async (projectId: string) => {
        setLoadingActions(prev => ({ ...prev, [projectId]: true }));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));

        setLoadingActions(prev => ({ ...prev, [projectId]: false }));
        setJoinedProjects(prev => [...prev, projectId]);

        // Show success feedback
        setSuccessFeedback(projectId);
        setTimeout(() => setSuccessFeedback(null), 3000);
    };

    const handleViewProject = (projectId: string) => {
        // Add to recently viewed
        const project = MOCK_PROJECTS.find(p => p.id === projectId);
        if (project && !recentlyViewed.some(p => p.id === projectId)) {
            setRecentlyViewed(prev => [project, ...prev].slice(0, 5));
        }
        router.push(`/projects/${projectId}`);
    };

    const handleMessageClick = (messageId: string) => {
        // Mark as read
        setUnreadMessages(prev => ({ ...prev, [messageId]: 0 }));
        router.push(`/chat/${messageId}`);
    };

    const handleQuickReply = (messageId: string) => {
        setQuickReplyOpen(quickReplyOpen === messageId ? null : messageId);
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
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-10">
                {/* SECTION 1: Welcome / Context */}
                <section className="space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
                                </h1>
                                <Badge variant="secondary">Builder</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Discover projects that match your skills and contribute to innovative ideas
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" asChild>
                                <Link href="/profile/edit">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/explore">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Browse Projects
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Success Feedback Toast */}
                {successFeedback && (
                    <div className="fixed top-20 right-6 z-50 animate-fade-in-up">
                        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Request sent successfully!</span>
                        </div>
                    </div>
                )}

                {/* SECTION 2: Explore by Interest (Interactive Filters) */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Filter by Skills"
                        subtitle={activeSkills.length > 0
                            ? `Showing ${recommendedProjects.length} projects matching your filters`
                            : "Refine project recommendations based on your expertise"
                        }
                        icon={TrendingUp}
                    />
                    <FilterChips
                        chips={skillChips}
                        activeChips={activeSkills}
                        onToggle={handleSkillToggle}
                        variant="skill"
                    />
                </section>

                {/* SECTION 3: Recommended Projects (Dynamic with Hover Actions) */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Recommended for You"
                        subtitle="Projects matching your skills and interests"
                        badge={{
                            label: `${recommendedProjects.length} projects`,
                            variant: activeSkills.length > 0 ? "default" : "secondary"
                        }}
                        action={{ label: "View All", href: "/explore" }}
                    />
                    {recommendedProjects.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground mb-4">No projects match your selected filters</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveSkills([])}
                                >
                                    Clear Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <DashboardCarousel showArrows>
                            {recommendedProjects.map((project) => {
                                const isLoading = loadingActions[project.id];
                                const hasJoined = joinedProjects.includes(project.id);
                                const showSuccess = successFeedback === project.id;

                                return (
                                    <div key={project.id} className="group relative">
                                        <ProjectCard
                                            id={project.id}
                                            title={project.title}
                                            vision={project.vision}
                                            sector={project.sector}
                                            tags={project.skills_needed}
                                            phase={project.phase}
                                            memberCount={project.member_count}
                                            teamSize={project.team_size_needed}
                                            founderName={project.founder.name}
                                            lastActivity={formatRelativeTime(project.last_activity)}
                                            variant="expanded"
                                        />

                                        {/* Hover Overlay with Quick Actions */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-6 pointer-events-none group-hover:pointer-events-auto">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => handleViewProject(project.id)}
                                                    className="flex-1"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    View Project
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleRequestToJoin(project.id)}
                                                    disabled={isLoading || hasJoined}
                                                    className={cn(
                                                        "flex-1",
                                                        showSuccess && "bg-green-500 hover:bg-green-600"
                                                    )}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Joining...
                                                        </>
                                                    ) : hasJoined ? (
                                                        <>
                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                            Requested
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus className="mr-2 h-4 w-4" />
                                                            Request to Join
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </DashboardCarousel>
                    )}
                </section>

                {/* SECTION 4: Continue Where You Left Off (Recently Viewed) */}
                {recentlyViewed.length > 0 && (
                    <section className="space-y-4">
                        <SectionHeader
                            title="Continue Where You Left Off"
                            subtitle="Recently viewed projects"
                            badge={{ label: `${recentlyViewed.length} projects`, variant: "secondary" }}
                        />
                        <DashboardCarousel>
                            {recentlyViewed.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                    className="cursor-pointer"
                                >
                                    <ProjectCard
                                        id={project.id}
                                        title={project.title}
                                        vision={project.vision}
                                        sector={project.sector}
                                        tags={project.skills_needed.slice(0, 3)}
                                        phase={project.phase}
                                        memberCount={project.member_count}
                                        teamSize={project.team_size_needed}
                                        variant="compact"
                                    />
                                </div>
                            ))}
                        </DashboardCarousel>
                    </section>
                )}

                {/* SECTION 5: Active Contributions (with Hover Actions) */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Your Contributions"
                        subtitle="Projects you're actively working on"
                    />
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Active Projects */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Active Projects
                            </h3>
                            {activeProjects.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
                                    <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                                    <p className="text-sm text-muted-foreground mb-3">No active projects yet</p>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/explore">Find Projects</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {activeProjects.map((project) => (
                                        <div key={project.id} className="group relative">
                                            <ProjectCard
                                                id={project.project_id}
                                                title={project.project_title}
                                                description={`Role: ${project.role}`}
                                                phase={project.phase as ProjectPhase}
                                                lastActivity={formatRelativeTime(project.last_activity)}
                                                variant="compact"
                                                showActions={false}
                                            />

                                            {/* Hover Quick Actions */}
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => router.push(`/chat/${project.project_id}`)}
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => router.push(`/projects/${project.project_id}`)}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pending Applications */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Pending Applications
                            </h3>
                            <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
                                <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                                <p className="text-sm text-muted-foreground">No pending applications</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: Messages Preview (Interactive) */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Recent Conversations"
                        icon={MessageSquare}
                        badge={unreadChats.length > 0 ? { label: `${unreadChats.length} unread`, variant: "default" } : undefined}
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

                                    {/* Quick Reply (appears on hover) */}
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

                {/* SECTION 7: Notifications & Alerts */}
                {alerts.length > 0 && (
                    <section className="space-y-3">
                        <SectionHeader
                            title="Important Notifications"
                            subtitle="Action items that need your attention"
                        />
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex items-center gap-3 p-4 rounded-lg border border-warning/20 bg-warning/5"
                            >
                                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                                <p className="text-sm flex-1">{alert.message}</p>
                                <Button variant="outline" size="sm" className="shrink-0 border-warning/30" asChild>
                                    <Link href={alert.action}>{alert.actionLabel}</Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0"
                                    onClick={() => dismissAlert(alert.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
