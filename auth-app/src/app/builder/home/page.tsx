'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/MainLayout';
import { DashboardCarousel } from '@/components/DashboardCarousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    MOCK_PROJECTS,
    MOCK_ACTIVE_PROJECTS,
    MOCK_ROOMS,
    type Project,
    formatRelativeTime,
} from '@/data/mock-data';
import {
    Layers,
    TrendingUp,
    Clock,
    Users,
    Star,
    ChevronRight,
    Briefcase,
    MessageSquare,
    Edit,
    Sparkles,
    Rocket,
    Target,
    ArrowRight
} from 'lucide-react';

// Image mapping for projects
const PROJECT_IMAGE_MAP: Record<string, string> = {
    p1: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
    p2: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
    p3: 'https://images.pexels.com/photos/3730760/pexels-photo-3730760.jpeg?auto=compress&cs=tinysrgb&w=800',
    p4: 'https://images.pexels.com/photos/8370755/pexels-photo-8370755.jpeg?auto=compress&cs=tinysrgb&w=800',
    p5: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800',
    p6: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    p7: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    p8: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    p9: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=800',
    p10: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    p11: 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=800',
    p12: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
};

function getProjectImage(project: Project): string {
    if (PROJECT_IMAGE_MAP[project.id]) return PROJECT_IMAGE_MAP[project.id];
    return 'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=800';
}

// Derive difficulty from project metadata
type DifficultyFilter = 'beginner' | 'intermediate' | 'advanced';
function getDifficulty(project: Project): DifficultyFilter {
    if (project.commitment === 'high' || project.phase === 'active' || project.phase === 'review') {
        return 'advanced';
    }
    if (project.commitment === 'medium') return 'intermediate';
    return 'beginner';
}

// ProjectHeroCard with images (carousel style)
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
                        {project.status === 'open' ? 'Accepting contributors' : project.status === 'in-progress' ? 'In active build' : 'Closed'}
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
                    {project.skills_needed.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                            +{project.skills_needed.length - 3} more
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-dashed border-border/60 pt-3 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                            {project.member_count}/{project.team_size_needed} on team
                        </span>
                    </div>
                    <span className="truncate">Founder: {project.founder.name}</span>
                </div>
            </div>

            {/* Hover CTA overlay */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="mb-4 flex flex-col items-center gap-2 px-3 text-center">
                    <p className="text-xs font-medium text-foreground">
                        View project details and request to join.
                    </p>
                    <Button
                        size="sm"
                        className="pointer-events-auto h-8 rounded-full px-4 text-[11px] font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        View Project
                    </Button>
                </div>
            </div>
        </Card>
    );
}

// Explore-style Project Card (grid layout)
function ExploreStyleProjectCard({ project, onView }: { project: Project; onView: () => void }) {
    const imageSrc = getProjectImage(project);
    const capacityPercent = Math.min(100, ((project.member_count + 1) / project.team_size_needed) * 100);

    const statusBadgeVariant =
        project.status === 'open'
            ? ('active' as const)
            : project.status === 'in-progress'
                ? ('warning' as const)
                : ('outline' as const);

    return (
        <Card
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border/50 bg-card/50 text-xs transition-all duration-200 hover:border-primary/30 hover:bg-card/70"
            onClick={onView}
        >
            <div className="relative h-36 w-full overflow-hidden bg-surface-1">
                <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 260px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                />
            </div>

            <CardHeader className="space-y-2 pb-2 pt-4 px-4">
                <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="max-w-[60%] truncate text-[10px] font-medium rounded-full bg-secondary/50">
                        {project.sector}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(project.last_activity)}</span>
                    </div>
                </div>
                <h3 className="line-clamp-2 text-[13px] font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 px-4 pb-4">
                <p className="line-clamp-2 text-[11px] text-muted-foreground">
                    {project.description}
                </p>

                <div className="mt-auto space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" /> Team capacity
                            </span>
                            <span className="font-semibold">
                                {project.member_count}/{project.team_size_needed}
                            </span>
                        </div>
                        <Progress value={capacityPercent} className="h-1" />
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                        <Badge variant={statusBadgeVariant} className="text-[9px] px-2">
                            {project.status === 'open' ? 'Open' : project.status === 'in-progress' ? 'Building' : 'Closed'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground group-hover:text-primary flex items-center gap-0.5 transition-colors">
                            View <ChevronRight className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BuilderHomePage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    // Active conversations
    const directMessages = MOCK_ROOMS.filter(r => r.type === 'direct').slice(0, 4);
    const unreadChats = directMessages.filter(r => r.unread_count > 0);

    // Active projects
    const activeProjects = MOCK_ACTIVE_PROJECTS.filter(p => p.status === 'active');

    // Project lists
    const recommended = MOCK_PROJECTS.filter(p => p.status === 'open').slice(0, 10);
    const trending = [...MOCK_PROJECTS]
        .sort((a, b) => b.applications_pending - a.applications_pending)
        .slice(0, 10);
    const recent = [...MOCK_PROJECTS]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

    const byDomainMap = MOCK_PROJECTS.reduce<Record<string, Project[]>>((acc, project) => {
        const key = project.sector;
        if (!acc[key]) acc[key] = [];
        acc[key].push(project);
        return acc;
    }, {});

    useEffect(() => {
        if (authLoading) return;
        if (profile && profile.role_type === 'founder') {
            router.push('/founder/home');
        }
    }, [profile, authLoading, router]);

    const handleViewProject = (projectId: string) => {
        router.push(`/projects/${projectId}`);
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
        <MainLayout>
            <div className="space-y-10 pb-2">
                {/* Hero / Builder Dashboard */}
                <section className="grid gap-6 rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-background/80 p-6 md:grid-cols-[2fr,1.2fr] md:p-8">
                    <div className="space-y-4">
                        <Badge variant="outline" className="mb-1 w-max text-[10px] font-semibold uppercase tracking-[0.18em]">
                            <Sparkles className="mr-1.5 h-3 w-3" />
                            Builder Dashboard
                        </Badge>
                        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                            Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
                        </h1>
                        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                            Discover projects that match your skills, contribute to innovative startups, and build your portfolio.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                            <div className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/70 px-3 py-1">
                                <Briefcase className="h-3 w-3 text-primary" />
                                <span>{activeProjects.length} Active Projects</span>
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/70 px-3 py-1">
                                <MessageSquare className="h-3 w-3 text-emerald-500" />
                                <span>{unreadChats.length} Unread Messages</span>
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/70 px-3 py-1">
                                <Star className="h-3 w-3 text-amber-400" />
                                <span>92% Match Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/50 bg-card/70 p-4 text-xs">
                        <div className="space-y-2">
                            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                Quick Actions
                            </p>
                            <p className="text-[13px] text-muted-foreground">
                                Jump to your contributions, update your profile, or explore new opportunities.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-1">
                            <Button variant="outline" size="sm" className="gap-2" asChild>
                                <Link href="/profile/edit">
                                    <Edit className="h-3.5 w-3.5" />
                                    Edit Profile
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2" asChild>
                                <Link href="/builder/contributions">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    My Contributions
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2" asChild>
                                <Link href="/chat">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Messages
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 1. Recommended Projects */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold tracking-tight md:text-base">
                                Recommended for You
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Projects matching your skills and expertise.
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
                            <Link href="/">
                                View All <ArrowRight className="h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                    <DashboardCarousel>
                        {recommended.map((project) => (
                            <ProjectHeroCard
                                key={project.id}
                                project={project}
                                onView={() => handleViewProject(project.id)}
                            />
                        ))}
                    </DashboardCarousel>
                </section>

                {/* 2. Trending Projects - Grid Layout */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <div>
                                <h2 className="text-sm font-semibold tracking-tight md:text-base">
                                    Trending Projects
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Projects with the most join requests and active conversations.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {trending.map((project) => (
                            <ExploreStyleProjectCard
                                key={project.id}
                                project={project}
                                onView={() => handleViewProject(project.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* 3. Recently Added */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-sky-500" />
                            <div>
                                <h2 className="text-sm font-semibold tracking-tight md:text-base">
                                    Recently Added
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Fresh projects that just landed on Helping Hands.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DashboardCarousel>
                        {recent.map((project) => (
                            <ProjectHeroCard
                                key={project.id}
                                project={project}
                                onView={() => handleViewProject(project.id)}
                            />
                        ))}
                    </DashboardCarousel>
                </section>

                {/* 4. Projects by Domain - Grid Layout */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-violet-500" />
                            <div>
                                <h2 className="text-sm font-semibold tracking-tight md:text-base">
                                    Projects by Domain
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Browse by sector to find work that matches your interests.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        {Object.entries(byDomainMap).map(([domain, projects]) => (
                            <div key={domain} className="space-y-4">
                                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] font-semibold">
                                            {domain}
                                        </Badge>
                                        <span className="text-[11px] text-muted-foreground">
                                            {projects.length} active project{projects.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {projects.map((project) => (
                                        <ExploreStyleProjectCard
                                            key={project.id}
                                            project={project}
                                            onView={() => handleViewProject(project.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
