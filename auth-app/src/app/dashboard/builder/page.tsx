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
    TrendingUp
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
import { cn } from "@/lib/utils";
import type { ProjectPhase } from "@/data/mock-data";

export default function BuilderHomePage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [activeSkills, setActiveSkills] = useState<string[]>([]);
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

    // Mock skills for filtering
    const skillChips = [
        { id: 'nextjs', label: 'Next.js', count: 8 },
        { id: 'react', label: 'React', count: 12 },
        { id: 'typescript', label: 'TypeScript', count: 10 },
        { id: 'tailwind', label: 'Tailwind', count: 6 },
        { id: 'python', label: 'Python', count: 5 },
        { id: 'nodejs', label: 'Node.js', count: 7 },
    ];

    // Recommended projects (open projects)
    const recommendedProjects = MOCK_PROJECTS.filter(p => p.status === 'open').slice(0, 8);

    // Active conversations
    const directMessages = MOCK_ROOMS.filter(r => r.type === 'direct').slice(0, 5);
    const unreadChats = directMessages.filter(r => r.unread_count > 0);

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
        if (profile && profile.role_type === 'founder') {
            router.push('/dashboard/founder');
        }
    }, [profile, authLoading, router]);

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

                {/* SECTION 2: Recommended Projects */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Recommended for You"
                        subtitle="Projects matching your skills and interests"
                        badge={{ label: `${recommendedProjects.length} projects`, variant: "secondary" }}
                        action={{ label: "View All", href: "/explore" }}
                    />
                    <DashboardCarousel showArrows>
                        {recommendedProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
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
                        ))}
                    </DashboardCarousel>
                </section>

                {/* SECTION 3: Active Contributions */}
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
                                        <ProjectCard
                                            key={project.id}
                                            id={project.project_id}
                                            title={project.project_title}
                                            description={`Role: ${project.role}`}
                                            phase={project.phase as ProjectPhase}
                                            lastActivity={formatRelativeTime(project.last_activity)}
                                            variant="compact"
                                            showActions={false}
                                        />
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

                {/* SECTION 4: Messages Preview */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Recent Conversations"
                        icon={MessageSquare}
                        badge={unreadChats.length > 0 ? { label: `${unreadChats.length} unread`, variant: "default" } : undefined}
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

                {/* SECTION 5: Trending Domains / Tags */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Filter by Skills"
                        subtitle="Refine project recommendations based on your expertise"
                        icon={TrendingUp}
                    />
                    <FilterChips
                        chips={skillChips}
                        activeChips={activeSkills}
                        onToggle={handleSkillToggle}
                        variant="skill"
                    />
                </section>

                {/* SECTION 6: Notifications & Alerts */}
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
