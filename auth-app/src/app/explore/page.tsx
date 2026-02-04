'use client';

import { Suspense, useMemo, useState, useCallback } from 'react';
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
import { Card } from '@/components/ui/card';
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
import { ProjectCard } from '@/components/ProjectCard';
import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel';
import { getProjectImage } from '@/lib/images';

// Featured Project Card (large, premium styling) -- KEEPING LOCAL for unique layout, but updating style
function FeaturedProjectCard({ project, onView }: { project: Project; onView: () => void }) {
  const imageSrc = project.imageUrl || getProjectImage(project.id);

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
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:bg-gradient-to-r md:via-card/20" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md shadow-lg">
              <Sparkles className="mr-1 h-3 w-3" />
              Featured Choice
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/5">
              #1 in {project.sector}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">Sponsored</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>4.9</span>
              <span className="text-muted-foreground font-normal">(128 reviews)</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-sm text-muted-foreground">
              1k+ views this week
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <p className="font-semibold text-foreground">Led by {project.founder.name}</p>
                <p className="text-xs text-muted-foreground">Looking for {project.team_size_needed - project.member_count} experts</p>
              </div>
            </div>
            <Button className="rounded-full shadow-lg hover:shadow-primary/20 px-6">
              View Project
            </Button>
          </div>
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
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
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
        {/* Hero Carousel Section - Amazon Style */}
        <section className="relative">
          <HeroCarousel
            slides={[
              {
                id: 'slide-1',
                title: 'Build the',
                subtitle: 'Next Big Thing',
                description: 'Join elite teams building the future of AI, Web3, and HealthTech. Your skills, their vision, one project at a time.',
                imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600',
                ctaText: 'Browse AI Projects',
                ctaHref: '/explore?sector=AI%20%26%20ML',
                badgeText: 'Trending Domain',
                tagline: 'AI & Machine Learning'
              },
              {
                id: 'slide-2',
                title: 'Scale your',
                subtitle: 'Founder Journey',
                description: 'Find the technical co-founders and early builders you need to turn your MVP into a market leader.',
                imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
                ctaText: 'Post a Project',
                ctaHref: '/dashboard/founder',
                badgeText: 'For Founders',
                tagline: 'Team Building'
              },
              {
                id: 'slide-3',
                title: 'Unlock your',
                subtitle: 'Full Potential',
                description: 'Level up your portfolio by contributing to real-world products. Get verified, get noticed, get hired.',
                imageUrl: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1600',
                ctaText: 'Join a Team',
                ctaHref: '/builder/home',
                badgeText: 'Builder Rewards',
                tagline: 'Skill Development'
              }
            ]}
          />

          {/* Floating Search Bar (Amazon Style - overlaps the hero slightly) */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-20">
            <div className="flex gap-3 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search projects, skills, or categories..."
                  className="h-12 pl-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-xl bg-background/50 hover:bg-primary/10 transition-colors"
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
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  sector={project.sector}
                  tags={project.skills_needed}
                  phase={project.phase}
                  memberCount={project.member_count}
                  teamSize={project.team_size_needed}
                  founderName={project.founder.name}
                  lastActivity={formatRelativeTime(project.last_activity)}
                  applicationsPending={project.applications_pending}
                  imageUrl={project.imageUrl || getProjectImage(project.id)}
                  onAction={() => handleViewProject(project.id)}
                  variant="default" // Using our new Default Amazon style
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
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      sector={project.sector}
                      tags={project.skills_needed}
                      phase={project.phase}
                      memberCount={project.member_count}
                      teamSize={project.team_size_needed}
                      founderName={project.founder.name}
                      lastActivity={formatRelativeTime(project.last_activity)}
                      applicationsPending={project.applications_pending}
                      imageUrl={project.imageUrl || getProjectImage(project.id)}
                      onAction={() => handleViewProject(project.id)}
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
                    <div key={project.id} className="w-72 flex-shrink-0 h-full">
                      {/* Carousel cards also use the new design */}
                      <ProjectCard
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        sector={project.sector}
                        tags={project.skills_needed}
                        phase={project.phase}
                        memberCount={project.member_count}
                        teamSize={project.team_size_needed}
                        founderName={project.founder.name}
                        lastActivity={formatRelativeTime(project.last_activity)}
                        applicationsPending={project.applications_pending}
                        imageUrl={project.imageUrl || getProjectImage(project.id)}
                        onAction={() => handleViewProject(project.id)}
                        className="h-full"
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

