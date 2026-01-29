'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import {
    Compass,
    Search,
    Filter,
    TrendingUp,
    Users,
    Layers,
    ChevronRight
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    formatRelativeTime,
    type Project
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { FilterChips } from '@/components/FilterChips';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function FounderExplorePage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Filter chips for sectors
    const sectorChips = [
        { id: 'ai', label: 'AI & Machine Learning', count: 3 },
        { id: 'healthtech', label: 'HealthTech', count: 2 },
        { id: 'fintech', label: 'FinTech', count: 2 },
        { id: 'saas', label: 'SaaS & Enterprise', count: 3 },
        { id: 'web3', label: 'Web3 & Crypto', count: 2 },
        { id: 'edtech', label: 'EdTech', count: 2 },
        { id: 'ecommerce', label: 'E-commerce', count: 1 },
        { id: 'cybersecurity', label: 'Cybersecurity', count: 2 },
    ];

    // Get all projects except founder's own
    const otherProjects = MOCK_PROJECTS.filter(p => p.founder.id !== 'f1');

    // Filter projects based on search and sector filters
    const filteredProjects = otherProjects.filter(project => {
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.skills_needed.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSector = activeFilters.length === 0 ||
            activeFilters.some(filter => project.sector.toLowerCase().includes(filter.toLowerCase()));

        return matchesSearch && matchesSector;
    });

    useEffect(() => {
        if (authLoading) return;
        if (profile && profile.role_type === 'user') {
            router.push('/builder/home');
        }
    }, [profile, authLoading, router]);

    const handleFilterToggle = (filterId: string) => {
        setActiveFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId]
        );
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
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <section className="space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Explore Projects
                                </h1>
                                <Badge variant="secondary">{otherProjects.length} Projects</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Discover what other founders are building and get inspired
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex gap-3">
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by project name, skill, or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            More Filters
                        </Button>
                    </div>
                </section>

                {/* Sector Filters */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Filter by Sector"
                        subtitle="Narrow down projects by industry"
                        icon={TrendingUp}
                    />
                    <FilterChips
                        chips={sectorChips}
                        activeChips={activeFilters}
                        onToggle={handleFilterToggle}
                        variant="sector"
                    />
                </section>

                {/* Project Grid */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Other Founders' Projects"
                        subtitle={`${filteredProjects.length} projects to explore`}
                        icon={Compass}
                    />
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-border/50 rounded-lg">
                            <Compass className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground mb-4">No projects match your filters</p>
                            <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveFilters([]); }}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="group overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary/30"
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        <Image
                                            src={getProjectImage(project)}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                                        <div className="absolute left-3 top-3 flex flex-col gap-1">
                                            <Badge variant="secondary" className="w-max text-[10px]">
                                                {project.sector}
                                            </Badge>
                                            <Badge
                                                variant={project.status === 'open' ? 'active' : project.status === 'in-progress' ? 'warning' : 'outline'}
                                                className="w-max text-[10px]"
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] text-white/90">
                                            <Layers className="h-3.5 w-3.5" />
                                            <span className="font-medium">{project.phase.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
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
                                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>{project.member_count}/{project.team_size_needed}</span>
                                            </div>
                                            <span>by {project.founder.name}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}
