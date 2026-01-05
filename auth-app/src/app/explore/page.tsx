'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Search,
    Users,
    Loader2,
    Clock,
    ChevronRight,
    LayoutGrid,
    List,
    Sparkles,
    Filter
} from 'lucide-react';
import { MOCK_PROJECTS } from '@/data/mock-data';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Project {
    id: string;
    title: string;
    description: string;
    vision: string;
    sector: string;
    skills_needed: string[];
    team_size_needed: number;
    status: string;
    created_at: string;
    founder: {
        id: string;
        name: string;
    };
    member_count: number;
}

const SECTORS = [
    'All',
    'AI & ML',
    'SaaS',
    'FinTech',
    'HealthTech',
    'Web3',
];

export default function ExplorePage() {
    const router = useRouter();
    const { profile, supabase, loading: authLoading } = useAuth();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState<string>('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login/user');
            return;
        }
        fetchProjects();
    }, [profile, authLoading, router]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    founder:profiles!projects_founder_id_fkey (
                        id,
                        name
                    ),
                    project_members (
                        id,
                        status
                    )
                `)
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (error) throw error;

            let finalProjects = [];
            if (data && data.length > 0) {
                finalProjects = data.map(p => ({
                    ...p,
                    member_count: p.project_members?.filter((m: { status: string }) => m.status === 'accepted').length || 0,
                }));
            } else {
                finalProjects = MOCK_PROJECTS;
            }
            setProjects(finalProjects as unknown as Project[]);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects(MOCK_PROJECTS as unknown as Project[]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSector = selectedSector === 'All' || project.sector?.includes(selectedSector.split(' ')[0]);

        return matchesSearch && matchesSector;
    });

    if (authLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-11 flex-1" />
                        <Skeleton className="h-11 w-32" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="premium" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" /> {projects.length} Active
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Mission Directory</h1>
                        <p className="text-muted-foreground mt-1">
                            Discover innovative projects and join forces with visionary founders
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-muted p-1 rounded-lg border">
                            <Button
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 px-3"
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 px-3"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects, technologies, or founders..."
                            className="pl-10 h-11"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {SECTORS.map(sector => (
                            <Button
                                key={sector}
                                variant={selectedSector === sector ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedSector(sector)}
                                className="h-9 px-4 shrink-0 text-xs font-semibold"
                            >
                                {sector}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-6 space-y-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-xl bg-card/30 animate-fade-in-up">
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                            <Filter className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No matching projects</h3>
                        <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                        <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedSector('All'); }}>
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className={cn(
                        "grid gap-6",
                        viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}>
                        {filteredProjects.map((project, index) => {
                            const capacityPercent = Math.min(100, ((project.member_count + 1) / project.team_size_needed) * 100);
                            return (
                                <Card
                                    key={project.id}
                                    className="group flex flex-col animate-fade-in-up overflow-hidden"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline" className="text-[10px] font-bold tracking-wider">
                                                {project.sector || 'General'}
                                            </Badge>
                                            <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                                            {project.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs">
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 pt-0">
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.skills_needed?.slice(0, 3).map((skill, i) => (
                                                <Badge key={i} variant="secondary" className="px-2 py-0 text-[10px] bg-muted/50 font-medium">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {project.skills_needed?.length > 3 && (
                                                <Badge variant="secondary" className="px-2 py-0 text-[10px] bg-muted/50 font-medium">
                                                    +{project.skills_needed.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium">Team Capacity</span>
                                                <span className="font-semibold">{project.member_count + 1}/{project.team_size_needed}</span>
                                            </div>
                                            <Progress value={capacityPercent} className="h-1.5" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-4 border-t bg-muted/10 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Users className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                            <span className="text-xs font-medium truncate">{project.founder.name}</span>
                                        </div>
                                        <Button size="sm" className="shrink-0" asChild>
                                            <Link href={`/projects/${project.id}`}>
                                                View <ChevronRight className="ml-1 h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
