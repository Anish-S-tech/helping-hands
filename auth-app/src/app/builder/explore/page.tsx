'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Compass,
    Search,
    Filter,
    TrendingUp
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    formatRelativeTime,
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeader } from '@/components/SectionHeader';
import { FilterChips } from '@/components/FilterChips';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function BuilderExplorePage() {
    const { loading: authLoading } = useAuth();
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

    // Get open projects
    const openProjects = MOCK_PROJECTS.filter(p => p.status === 'open');

    // Filter projects based on search and sector filters
    const filteredProjects = openProjects.filter(project => {
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.skills_needed.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSector = activeFilters.length === 0 ||
            activeFilters.some(filter => project.sector.toLowerCase().includes(filter.toLowerCase()));

        return matchesSearch && matchesSector;
    });

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
                                <Badge variant="secondary">{openProjects.length} Open</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Discover exciting projects looking for talented builders like you
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
                        title="Available Projects"
                        subtitle={`${filteredProjects.length} projects match your criteria`}
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
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}
