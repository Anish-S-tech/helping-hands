'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import { DashboardCarousel } from '@/components/DashboardCarousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MOCK_PROJECTS, type Project, formatRelativeTime } from '@/data/mock-data';
import { Layers, TrendingUp, Clock, Users, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Image mapping for projects (same as explore page)
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
    p13: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
    p14: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800',
    p15: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800',
    p16: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=800',
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

// Hero carousel slides
const heroSlides = [
    {
        id: 1,
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'Discover Real Startup Projects',
        subtitle: 'Browse active products, explore domains, and find where your skills create the most leverage.',
        badge: 'Discovery First',
        gradient: 'from-violet-600/90 via-violet-900/70 to-background',
    },
    {
        id: 2,
        image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'Join Teams That Build Products',
        subtitle: 'Connect with founders looking for talented builders. Apply to projects that match your skills.',
        badge: 'For Builders',
        gradient: 'from-emerald-600/90 via-emerald-900/70 to-background',
    },
    {
        id: 3,
        image: 'https://images.pexels.com/photos/3182821/pexels-photo-3182821.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'Find Your Perfect Co-Founder',
        subtitle: 'Launch your startup idea with the right team. Post your project and attract talented contributors.',
        badge: 'For Founders',
        gradient: 'from-amber-600/90 via-amber-900/70 to-background',
    },
    {
        id: 4,
        image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'AI & Machine Learning Projects',
        subtitle: 'Explore cutting-edge AI startups building the future. Join teams pushing technological boundaries.',
        badge: 'Trending Domain',
        gradient: 'from-blue-600/90 via-blue-900/70 to-background',
    },
    {
        id: 5,
        image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'FinTech & Web3 Opportunities',
        subtitle: 'Revolutionary financial technology startups seeking skilled developers and designers.',
        badge: 'Hot Sector',
        gradient: 'from-cyan-600/90 via-cyan-900/70 to-background',
    },
];

function projectStatusLabel(project: Project) {
    if (project.status === 'open') return 'Open';
    if (project.status === 'in-progress') return 'In progress';
    return 'Closed';
}

// Explore-style Project Card (matches explore page UI)
function ExploreStyleProjectCard({ project, onView }: { project: Project; onView: () => void }) {
    const imageSrc = getProjectImage(project);
    const difficulty = getDifficulty(project);
    const capacityPercent = Math.min(
        100,
        ((project.member_count + 1) / project.team_size_needed) * 100
    );

    const statusBadgeVariant =
        project.status === 'open'
            ? ('active' as const)
            : project.status === 'in-progress'
                ? ('warning' as const)
                : ('outline' as const);

    return (
        <Card
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border/50 bg-card/50 text-xs transition-all duration-200 hover:border-primary/30 hover:bg-card/70 focus-within:ring-2 focus-within:ring-ring"
            onClick={onView}
        >
            {/* Image strip */}
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
                        <span>
                            {new Date(project.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                </div>
                <CardTitle className="line-clamp-1 text-sm font-bold leading-snug">
                    {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/80">
                    {project.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pb-3 pt-1 px-4">
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

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">Team capacity</span>
                        <span className="text-[11px] font-semibold">
                            {project.member_count + 1}/{project.team_size_needed}
                        </span>
                    </div>
                    <Progress value={capacityPercent} className="h-1.5" />
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <Badge variant={statusBadgeVariant} className="text-[10px] font-medium rounded-full">
                        {projectStatusLabel(project)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] rounded-full border-border/60">
                        {difficulty === 'beginner'
                            ? 'Beginner friendly'
                            : difficulty === 'intermediate'
                                ? 'Intermediate'
                                : 'Advanced'}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                        {project.commitment === 'low'
                            ? 'Low commitment'
                            : project.commitment === 'medium'
                                ? 'Medium commitment'
                                : 'High commitment'}
                    </Badge>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2 border-t border-border/50 bg-muted/10 py-3 px-4">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-muted/30">
                        <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[11px] font-medium">
                            {project.founder.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Founder</span>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 rounded-full px-3 text-[11px] font-medium shadow-none"
                >
                    View Project
                    <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
            </CardFooter>
        </Card>
    );
}

// ProjectHeroCard with images for Recommended section (carousel style)
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
                        View project details and request to join as a Builder or Founder.
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

export default function HomePage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    const goToPrev = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    const goToNext = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    const recommended = MOCK_PROJECTS.slice(0, 8);
    const trending = [...MOCK_PROJECTS]
        .sort((a, b) => b.applications_pending - a.applications_pending)
        .slice(0, 8);
    const recent = [...MOCK_PROJECTS]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);

    const byDomainMap = MOCK_PROJECTS.reduce<Record<string, Project[]>>((acc, project) => {
        const key = project.sector;
        if (!acc[key]) acc[key] = [];
        acc[key].push(project);
        return acc;
    }, {});

    const handleViewProject = () => {
        // Discovery comes first; actual details require auth
        router.push('/auth');
    };

    return (
        <MainLayout>
            <div className="space-y-10 pb-2">
                {/* Amazon-style Hero Carousel */}
                <section className="relative w-full overflow-hidden rounded-2xl">
                    {/* Slides Container */}
                    <div
                        className="relative flex transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {heroSlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className="relative min-w-full h-[280px] md:h-[360px] lg:h-[400px]"
                            >
                                {/* Background Image */}
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    priority={index === 0}
                                    className="object-cover"
                                    sizes="100vw"
                                />
                                {/* Gradient Overlay */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-r",
                                    slide.gradient
                                )} />
                                {/* Bottom fade for content visibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                                    <div className="max-w-2xl space-y-4">
                                        <Badge
                                            variant="secondary"
                                            className="w-max backdrop-blur-sm bg-white/20 text-white border-white/30 text-xs font-semibold uppercase tracking-wider"
                                        >
                                            {slide.badge}
                                        </Badge>
                                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                                            {slide.title}
                                        </h1>
                                        <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-xl drop-shadow-md">
                                            {slide.subtitle}
                                        </p>
                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                onClick={() => router.push('/explore')}
                                                className="bg-white text-black hover:bg-white/90 font-semibold shadow-lg"
                                            >
                                                Explore Projects
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => router.push('/auth')}
                                                className="border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                                            >
                                                Get Started
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows - Amazon Style */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-0 top-0 bottom-0 w-12 md:w-16 flex items-center justify-center bg-gradient-to-r from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity group"
                        aria-label="Previous slide"
                    >
                        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-lg group-hover:bg-white transition-colors">
                            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-black" />
                        </div>
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-0 bottom-0 w-12 md:w-16 flex items-center justify-center bg-gradient-to-l from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity group"
                        aria-label="Next slide"
                    >
                        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-lg group-hover:bg-white transition-colors">
                            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-black" />
                        </div>
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    currentSlide === index
                                        ? "w-8 bg-white"
                                        : "w-2 bg-white/50 hover:bg-white/70"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Auto-play indicator */}
                    {isAutoPlaying && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/70 text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="hidden md:inline">Auto-playing</span>
                        </div>
                    )}
                </section>

                {/* 1. Recommended Projects */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold tracking-tight md:text-base">
                                Recommended Projects
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                High-signal startups looking for committed Builders and Founders.
                            </p>
                        </div>
                    </div>
                    <DashboardCarousel>
                        {recommended.map((project) => (
                            <ProjectHeroCard
                                key={project.id}
                                project={project}
                                onView={handleViewProject}
                            />
                        ))}
                    </DashboardCarousel>
                </section>

                {/* 2. Trending Projects - Grid Layout matching Explore page */}
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
                                onView={handleViewProject}
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
                                onView={handleViewProject}
                            />
                        ))}
                    </DashboardCarousel>
                </section>

                {/* 4. Projects by Domain - Grid Layout matching Explore page */}
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
                                            onView={handleViewProject}
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
