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
    const recommendedProjects = MOCK_PROJECTS.filter(p => p.status === 'open').slice(0, 10);

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
            <div className="max-w-[1400px] mx-auto space-y-10 pb-12 px-4 md:px-6">
                {/* SECTION 1: Welcome / Quick Stats */}
                <div className="space-y-8 animate-fade-in stagger-1">
                    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                        <div className="space-y-1.5">
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text">
                                Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2 font-medium">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                Your contribution portfolio is 85% complete.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="h-10 px-4 hover:bg-muted/50" asChild>
                                <Link href="/profile/edit">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Portfolio
                                </Link>
                            </Button>
                            <Button size="sm" className="h-10 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95" asChild>
                                <Link href="/explore">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Find Projects
                                </Link>
                            </Button>
                        </div>
                    </section>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in stagger-2">
                        <StatCard
                            icon={Briefcase}
                            value={activeProjects.length}
                            label="Active Projects"
                            highlight
                        />
                        <StatCard
                            icon={TrendingUp}
                            value="4.8"
                            label="Portfolio Rating"
                            trend={{ value: 12, isPositive: true }}
                        />
                        <StatCard
                            icon={MessageSquare}
                            value={unreadChats.length}
                            label="New Messages"
                            href="/chat"
                            iconColor="text-emerald-500"
                        />
                        <StatCard
                            icon={Clock}
                            value="2"
                            label="Waitlist Apps"
                            iconColor="text-amber-500"
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* MAIN COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-12 animate-fade-in stagger-3">
                        {/* SECTION 2: Recommended Projects */}
                        <section className="space-y-6">
                            <SectionHeader
                                title="Recommended for You"
                                subtitle="Top picks based on your skill graph"
                                badge={{ label: "For You", variant: "secondary" }}
                                action={{ label: "View All", href: "/explore" }}
                                className="px-1"
                            />
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-transparent rounded-3xl blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                                <DashboardCarousel showArrows className="relative pb-4">
                                    {recommendedProjects.map((project) => (
                                        <div key={project.id} className="min-w-[320px] max-w-[320px] px-1">
                                            <ProjectCard
                                                {...project}
                                                id={project.id}
                                                tags={project.skills_needed}
                                                founderName={project.founder.name}
                                                lastActivity={formatRelativeTime(project.last_activity)}
                                                variant="default"
                                            />
                                        </div>
                                    ))}
                                </DashboardCarousel>
                            </div>
                        </section>

                        {/* SECTION 3: Skill Filter */}
                        <section className="space-y-6 p-8 rounded-3xl bg-card border border-border/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                            <SectionHeader
                                title="Master Your Stack"
                                subtitle="Discover opportunities to refine your expertise"
                                icon={TrendingUp}
                            />
                            <FilterChips
                                chips={skillChips}
                                activeChips={activeSkills}
                                onToggle={handleSkillToggle}
                                variant="skill"
                            />
                        </section>
                    </div>

                    {/* SIDEBAR COLUMN (1/3) */}
                    <div className="space-y-10 animate-fade-in stagger-4">
                        {/* Portfolio Goals / Progress */}
                        <section className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Goal Progress</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Top Rated Builder</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span>XP to Level 5</span>
                                    <span>850 / 1000</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full w-[85%] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold h-8 hover:bg-primary/10 text-primary">
                                VIEW ACHIEVEMENTS
                            </Button>
                        </section>

                        {/* Active Contributions Sidebar */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    Active Missions
                                </h3>
                                <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-bold bg-muted/50">
                                    {activeProjects.length}
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                {activeProjects.length === 0 ? (
                                    <div className="text-center py-10 border border-dashed border-border/40 rounded-2xl bg-muted/5">
                                        <Briefcase className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-20" />
                                        <p className="text-[11px] font-semibold text-muted-foreground mb-4">No active missions</p>
                                        <Button variant="outline" size="sm" className="text-[10px] h-8 px-4 font-bold border-dashed" asChild>
                                            <Link href="/explore">Deploy Your Skills</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    activeProjects.map((project) => (
                                        <Link key={project.id} href={`/projects/${project.project_id}`} className="block group">
                                            <div className="p-4 rounded-xl border border-border/40 bg-card hover:border-primary/40 transition-all hover:shadow-md hover:bg-card/80">
                                                <div className="flex justify-between items-start mb-2 gap-2">
                                                    <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors leading-tight">{project.project_title}</h4>
                                                    <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5" />
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                                                    <span className="truncate max-w-[120px]">{project.role}</span>
                                                    <span className="tabular-nums">{formatRelativeTime(project.last_activity)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
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
                                            "flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm",
                                            chat.unread_count > 0
                                                ? "border-primary/30 bg-primary/5"
                                                : "border-border/30 bg-card/50 hover:bg-card hover:border-border/60"
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
                                                    <span className="text-[9px] text-muted-foreground/60 tabular-nums">2m</span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground truncate opacity-70 italic font-medium">
                                                    "{chat.last_message}"
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Important Alerts */}
                        {alerts.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/50 px-1">
                                    Alert Signals
                                </h3>
                                <div className="space-y-3">
                                    {alerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 relative group overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => dismissAlert(alert.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                            <div className="flex items-start gap-4">
                                                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                                    <AlertTriangle className="h-4 w-4" />
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="text-[11px] font-semibold leading-relaxed text-amber-200/90">{alert.message}</p>
                                                    <Button variant="outline" size="sm" className="h-8 text-[10px] px-4 font-bold border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200" asChild>
                                                        <Link href={alert.action}>{alert.actionLabel}</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
