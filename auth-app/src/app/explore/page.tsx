'use client';

import { Suspense, useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import {
  Search,
  Filter,
  ChevronRight,
  Users,
  Clock,
  Layers,
  TrendingUp,
  Star,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  X,
} from 'lucide-react';
import { MOCK_PROJECTS, type Project, formatRelativeTime } from '@/data/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DashboardCarousel } from '@/components/DashboardCarousel';
import { MainLayout } from '@/components/MainLayout';

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
  p13: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
  p14: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800',
  p15: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800',
  p16: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=800',
};

function getProjectImage(project: Project): string {
  if (PROJECT_IMAGE_MAP[project.id]) return PROJECT_IMAGE_MAP[project.id];
  return 'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=800';
}

// Featured Project Card (large, premium styling)
function FeaturedProjectCard({ project, onView }: { project: Project; onView: () => void }) {
  const imageSrc = getProjectImage(project);

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-primary/20 hover:-translate-y-2"
      onClick={onView}
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card md:bg-gradient-to-r" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent md:hidden" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md shadow-lg">
              <Sparkles className="mr-1 h-3 w-3" />
              Featured
            </Badge>
            <Badge variant={project.status === 'open' ? 'active' : 'warning'} className="backdrop-blur-md shadow-sm">
              {project.status === 'open' ? 'Accepting Members' : 'In Progress'}
            </Badge>
          </div>

          {/* Applications Count */}
          {project.applications_pending > 0 && (
            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
              <TrendingUp className="h-3.5 w-3.5" />
              {project.applications_pending} requests
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center p-6 md:p-8">
          <Badge variant="secondary" className="w-max mb-3 text-xs">
            {project.sector}
          </Badge>

          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3">
            {project.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.skills_needed.slice(0, 4).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="rounded-full bg-primary/5 text-primary border-primary/20"
              >
                {skill}
              </Badge>
            ))}
            {project.skills_needed.length > 4 && (
              <Badge variant="outline" className="rounded-full">
                +{project.skills_needed.length - 4}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 ring-2 ring-background">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{project.founder.name}</p>
                <p className="text-xs text-muted-foreground">{project.member_count}/{project.team_size_needed} members</p>
              </div>
            </div>
            <Button className="rounded-full shadow-lg hover:shadow-primary/20">
              View Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Project Card (compact, grid style)
function ProjectCard({ project, onView, index = 0 }: { project: Project; onView: () => void; index?: number }) {
  const imageSrc = getProjectImage(project);

  return (
    <Card
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        `stagger-${(index % 8) + 1}`
      )}
      onClick={onView}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={project.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 top-3">
          <Badge
            variant={project.status === 'open' ? 'active' : project.status === 'in-progress' ? 'warning' : 'outline'}
            className="backdrop-blur-md shadow-sm text-[10px]"
          >
            {project.status === 'open' ? 'Open' : project.status === 'in-progress' ? 'Building' : 'Closed'}
          </Badge>
        </div>

        {/* Applications indicator */}
        {project.applications_pending > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">
            <Zap className="h-3 w-3" />
            {project.applications_pending}
          </div>
        )}

        {/* Bottom sector badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="backdrop-blur-md bg-background/70 text-[10px]">
            {project.sector}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold tracking-tight mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.skills_needed.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-[10px] bg-primary/10 text-primary border-0"
            >
              {skill}
            </Badge>
          ))}
          {project.skills_needed.length > 3 && (
            <span className="text-[10px] text-muted-foreground self-center">
              +{project.skills_needed.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-3 w-3 text-primary" />
            </div>
            <span className="font-medium">{project.member_count}/{project.team_size_needed}</span>
          </div>
          <span className="text-muted-foreground">{formatRelativeTime(project.last_activity)}</span>
        </div>
      </div>
    </Card>
  );
}

// Category Card
function CategoryCard({ name, count, icon: Icon, color, onClick }: {
  name: string;
  count: number;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="p-5">
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-muted-foreground">{count} project{count !== 1 ? 's' : ''}</p>
      </div>
    </Card>
  );
}

// Section Header Component
function SectionHeader({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  action
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconColor)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

// Filter Sheet
function FilterSheet({
  open,
  onOpenChange,
  sectors,
  selectedSectors,
  onSectorChange,
  onClear,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectors: string[];
  selectedSectors: string[];
  onSectorChange: (sector: string) => void;
  onClear: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Filter Projects</SheetTitle>
          <SheetDescription>
            Narrow down projects by category and criteria
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <div className="space-y-2">
              {sectors.map((sector) => (
                <label key={sector} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={selectedSectors.includes(sector)}
                    onChange={() => onSectorChange(sector)}
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">{sector}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClear}>Clear All</Button>
          <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Main Page Content
function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  // Get active tab from URL params
  const activeTab = searchParams.get('tab') || 'all';

  // Derived data
  const sectors = useMemo(() =>
    [...new Set(MOCK_PROJECTS.map(p => p.sector))].sort(),
    []
  );

  const featuredProject = useMemo(() =>
    MOCK_PROJECTS.find(p => p.applications_pending >= 5) || MOCK_PROJECTS[0],
    []
  );

  const trendingProjects = useMemo(() =>
    [...MOCK_PROJECTS]
      .sort((a, b) => b.applications_pending - a.applications_pending)
      .slice(0, 10),
    []
  );

  const recentProjects = useMemo(() =>
    [...MOCK_PROJECTS]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10),
    []
  );

  const projectsByCategory = useMemo(() =>
    MOCK_PROJECTS.reduce<Record<string, Project[]>>((acc, project) => {
      if (!acc[project.sector]) acc[project.sector] = [];
      acc[project.sector].push(project);
      return acc;
    }, {}),
    []
  );

  const filteredProjects = useMemo(() => {
    let projects = [...MOCK_PROJECTS];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sector.toLowerCase().includes(query) ||
        p.skills_needed.some(s => s.toLowerCase().includes(query))
      );
    }

    if (selectedSectors.length > 0) {
      projects = projects.filter(p => selectedSectors.includes(p.sector));
    }

    return projects;
  }, [searchQuery, selectedSectors]);

  const handleViewProject = useCallback((projectId: string) => {
    router.push('/auth');
  }, [router]);

  const handleSectorChange = (sector: string) => {
    setSelectedSectors(prev =>
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleTabChange = (tab: string) => {
    router.push(`/explore?tab=${tab}`);
  };

  const categoryIcons: Record<string, { icon: React.ElementType; color: string }> = {
    'AI & ML': { icon: Sparkles, color: 'bg-violet-500' },
    'FinTech': { icon: TrendingUp, color: 'bg-emerald-500' },
    'EdTech': { icon: Target, color: 'bg-blue-500' },
    'HealthTech': { icon: Zap, color: 'bg-rose-500' },
    'Web3 & Crypto': { icon: Layers, color: 'bg-amber-500' },
    'SaaS & Enterprise': { icon: Star, color: 'bg-cyan-500' },
    'Cybersecurity': { icon: Filter, color: 'bg-red-500' },
  };

  return (
    <MainLayout>
      <div className="space-y-16 pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-violet-500/5 to-background border border-border/30">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="relative px-6 py-12 md:px-10 md:py-16">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Sparkles className="mr-1 h-3 w-3" />
                Explore Projects
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Find Your Next <span className="text-primary">Collaboration</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Discover startups, join teams, and build something meaningful. Browse {MOCK_PROJECTS.length}+ active projects across multiple domains.
              </p>

              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, skills, or categories..."
                    className="h-12 pl-12 rounded-xl bg-background/80 backdrop-blur-sm border-border/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-xl"
                  onClick={() => setFilterOpen(true)}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                  {selectedSectors.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {selectedSectors.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="flex items-center gap-2 border-b border-border/50 pb-4">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTabChange('all')}
          >
            All Projects
          </Button>
          <Button
            variant={activeTab === 'trending' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTabChange('trending')}
          >
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Trending
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTabChange('categories')}
          >
            <Layers className="h-4 w-4 mr-1.5" />
            Categories
          </Button>
          <Button
            variant={activeTab === 'recent' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTabChange('recent')}
          >
            <Clock className="h-4 w-4 mr-1.5" />
            Recent
          </Button>
        </section>

        {/* Featured Project - Only on 'all' tab */}
        {!searchQuery && selectedSectors.length === 0 && activeTab === 'all' && (
          <section>
            <SectionHeader
              icon={Star}
              iconColor="bg-amber-500"
              title="Featured Project"
              subtitle="Hand-picked opportunity with high demand"
            />
            <FeaturedProjectCard
              project={featuredProject}
              onView={() => handleViewProject(featuredProject.id)}
            />
          </section>
        )}

        {/* Categories Grid - Only on 'all' or 'categories' tab */}
        {!searchQuery && selectedSectors.length === 0 && (activeTab === 'all' || activeTab === 'categories') && (
          <section>
            <SectionHeader
              icon={Layers}
              iconColor="bg-violet-500"
              title="Browse by Category"
              subtitle="Find projects in your area of expertise"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {Object.entries(projectsByCategory).map(([category, projects]) => {
                const iconData = categoryIcons[category] || { icon: Layers, color: 'bg-primary' };
                return (
                  <CategoryCard
                    key={category}
                    name={category}
                    count={projects.length}
                    icon={iconData.icon}
                    color={iconData.color}
                    onClick={() => {
                      setSelectedSectors([category]);
                    }}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Show filtered results OR default sections */}
        {(searchQuery || selectedSectors.length > 0) ? (
          // Filtered Results
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-sm text-muted-foreground">
                  {searchQuery && `Searching for "${searchQuery}"`}
                  {searchQuery && selectedSectors.length > 0 && ' in '}
                  {selectedSectors.length > 0 && selectedSectors.join(', ')}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedSectors([]); }}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onView={() => handleViewProject(project.id)}
                />
              ))}
            </div>
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Trending Projects - Only on 'all' or 'trending' tab */}
            {(activeTab === 'all' || activeTab === 'trending') && (
              <section>
                <SectionHeader
                  icon={TrendingUp}
                  iconColor="bg-emerald-500"
                  title="Trending Now"
                  subtitle="Projects with the most join requests this week"
                  action={
                    activeTab !== 'trending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => handleTabChange('trending')}
                      >
                        View all <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {(activeTab === 'trending' ? trendingProjects : trendingProjects.slice(0, 5)).map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onView={() => handleViewProject(project.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recently Added - Only on 'all' or 'recent' tab */}
            {(activeTab === 'all' || activeTab === 'recent') && (
              <section>
                <SectionHeader
                  icon={Clock}
                  iconColor="bg-sky-500"
                  title="Fresh Opportunities"
                  subtitle="Newly posted projects looking for their first members"
                  action={
                    activeTab !== 'recent' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => handleTabChange('recent')}
                      >
                        View all <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {(activeTab === 'recent' ? recentProjects : recentProjects.slice(0, 5)).map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onView={() => handleViewProject(project.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Projects by Category - Only on 'all' tab */}
            {activeTab === 'all' && Object.entries(projectsByCategory).slice(0, 3).map(([category, projects]) => (
              <section key={category}>
                <SectionHeader
                  icon={categoryIcons[category]?.icon || Layers}
                  iconColor={categoryIcons[category]?.color || 'bg-primary'}
                  title={category}
                  subtitle={`${projects.length} active project${projects.length !== 1 ? 's' : ''} in this domain`}
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => setSelectedSectors([category])}
                    >
                      View all <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  }
                />
                <DashboardCarousel>
                  {projects.map((project) => (
                    <div key={project.id} className="w-72 flex-shrink-0">
                      <ProjectCard
                        project={project}
                        onView={() => handleViewProject(project.id)}
                      />
                    </div>
                  ))}
                </DashboardCarousel>
              </section>
            ))}
          </>
        )}
      </div>

      {/* Filter Sheet */}
      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        sectors={sectors}
        selectedSectors={selectedSectors}
        onSectorChange={handleSectorChange}
        onClear={() => setSelectedSectors([])}
      />
    </MainLayout>
  );
}

// Main Export with Suspense
export default function ExplorePage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    }>
      <ExploreContent />
    </Suspense>
  );
}
