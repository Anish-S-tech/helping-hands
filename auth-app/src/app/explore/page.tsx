'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import {
  Search,
  MessageCircle,
  Filter,
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  Settings,
  ChevronRight,
  Users,
  Clock,
  Package,
  Shield,
} from 'lucide-react';
import { MOCK_PROJECTS, type Project } from '@/data/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type StatusFilter = 'open' | 'in-progress' | 'closed';
type CommitmentFilter = 'low' | 'medium' | 'high';
type DifficultyFilter = 'beginner' | 'intermediate' | 'advanced';

import { ExploreSubNav } from '@/components/ExploreSubNav';

interface FilterState {
  domains: string[];
  tech: string[];
  statuses: StatusFilter[];
  commitments: CommitmentFilter[];
  difficulties: DifficultyFilter[];
}

// Derive a simple difficulty from project metadata without changing backend types
function getDifficulty(project: Project): DifficultyFilter {
  if (project.commitment === 'high' || project.phase === 'active' || project.phase === 'review') {
    return 'advanced';
  }
  if (project.commitment === 'medium') return 'intermediate';
  return 'beginner';
}

// Very lightweight, ecommerce-style placeholder imagery
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

// --- NAVBAR ---

interface ExploreNavbarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onOpenFilters: () => void;
  messagesCount: number;
  activeFilterCount: number;
}

function ExploreNavbar({
  searchInput,
  onSearchInputChange,
  onOpenFilters,
  messagesCount,
  activeFilterCount,
}: ExploreNavbarProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const initials = profile?.name?.[0]?.toUpperCase() ?? profile?.email?.[0]?.toUpperCase() ?? 'U';

  const handleSignIn = () => {
    router.push('/auth');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Helping Hands home">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border bg-muted">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
              HELPING HANDS
            </span>
            <span className="text-xs font-medium text-foreground">Explore</span>
          </div>
        </Link>

        {/* Center: Search */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Search startup projects, domains, or skills"
              className="h-10 w-full rounded-full border px-10 text-sm"
              aria-label="Search projects"
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {/* Messages */}
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9"
            aria-label="Explore messages (mocked)"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-amber-50">
              {messagesCount}
            </span>
          </Button>

          {/* Filters trigger */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="relative hidden whitespace-nowrap text-xs font-medium sm:inline-flex"
            onClick={onOpenFilters}
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Notifications placeholder */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Notifications (mocked)"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* Profile / Auth */}
          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border bg-card px-1.5 py-1 text-left text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Open profile menu"
                >
                  <Avatar className="h-7 w-7 border">
                    <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden min-w-0 flex-col sm:flex">
                    <span className="truncate font-medium">
                      {profile.name || profile.email}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {profile.role_type === 'founder' ? 'Founder' : 'Member'}
                    </span>
                  </div>
                  <ChevronDown className="ml-1 hidden h-3 w-3 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">
                  Signed in as
                  <div className="truncate text-[11px] font-medium">
                    {profile.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/builder')}>
                  <Shield className="mr-2 h-3.5 w-3.5" />
                  <span>Go to dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={async () => {
                    await signOut();
                    router.push('/');
                  }}
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-full px-3 text-xs font-semibold"
              onClick={handleSignIn}
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              Sign in
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

// --- FILTER DRAWER ---

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domains: string[];
  techOptions: string[];
  value: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
}

function FilterDrawer({
  open,
  onOpenChange,
  domains,
  techOptions,
  value,
  onChange,
  onClear,
}: FilterDrawerProps) {
  const toggleInArray = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handleApply = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md space-y-4 border-l">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filter Projects
          </SheetTitle>
          <SheetDescription className="text-xs">
            Find projects that match your skills, interests, and availability.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-[calc(100%-5.5rem)] flex-col gap-5 overflow-y-auto pr-1 text-xs">
          {/* Domain / Category */}
          <section>
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground">
              Project Domain
            </h3>
            <div className="grid grid-cols-2  gap-2.5">
              {domains.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  className={cn(
                    'flex items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors',
                    value.domains.includes(sector)
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border/60 hover:bg-muted/60'
                  )}
                  onClick={() =>
                    onChange({ ...value, domains: toggleInArray(value.domains, sector) })
                  }
                >
                  <span className="truncate">{sector}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Tech stack */}
          <section>
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground">
              Skills Required
            </h3>
            <div className="space-y-2.5">
              {techOptions.map((tech) => (
                <label key={tech} className="flex items-center gap-2">
                  <Checkbox
                    checked={value.tech.includes(tech)}
                    onChange={() =>
                      onChange({ ...value, tech: toggleInArray(value.tech, tech) })
                    }
                    aria-label={tech}
                  />
                  <span className="truncate text-xs">{tech}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Project status */}
          <section>
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground">
              Project status
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Open to collaborators', value: 'open' as StatusFilter },
                { label: 'In progress', value: 'in-progress' as StatusFilter },
                { label: 'Closed / completed', value: 'closed' as StatusFilter },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={value.statuses.includes(item.value)}
                    onChange={() =>
                      onChange({
                        ...value,
                        statuses: toggleInArray(value.statuses, item.value),
                      })
                    }
                    aria-label={item.label}
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Commitment */}
          <section>
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground">
              Time Commitment
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Low (weekends / casual)', value: 'low' as CommitmentFilter },
                { label: 'Medium (steady)', value: 'medium' as CommitmentFilter },
                { label: 'High (intensive)', value: 'high' as CommitmentFilter },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={value.commitments.includes(item.value)}
                    onChange={() =>
                      onChange({
                        ...value,
                        commitments: toggleInArray(value.commitments, item.value),
                      })
                    }
                    aria-label={item.label}
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Difficulty */}
          <section>
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground">
              Experience Level
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Beginner friendly', value: 'beginner' as DifficultyFilter },
                { label: 'Intermediate', value: 'intermediate' as DifficultyFilter },
                { label: 'Advanced', value: 'advanced' as DifficultyFilter },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={value.difficulties.includes(item.value)}
                    onChange={() =>
                      onChange({
                        ...value,
                        difficulties: toggleInArray(value.difficulties, item.value),
                      })
                    }
                    aria-label={item.label}
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <SheetFooter className="sticky bottom-0 mt-4 flex items-center justify-between border-t bg-background pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={onClear}
          >
            Clear all
          </Button>
          <Button type="button" size="sm" className="text-xs" onClick={handleApply}>
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// --- PROJECT CARD GRID ---

interface ProjectCardProps {
  project: Project;
  difficulty: DifficultyFilter;
  onViewDetails: () => void;
}

function ProjectCard({ project, difficulty, onViewDetails }: ProjectCardProps) {
  const imageSrc = getProjectImage(project);
  const capacityPercent = Math.min(
    100,
    ((project.member_count + 1) / project.team_size_needed) * 100
  );

  const statusVariant: StatusFilter =
    project.status === 'open'
      ? 'open'
      : project.status === 'in-progress'
        ? 'in-progress'
        : 'closed';

  const statusLabel =
    statusVariant === 'open'
      ? 'Open'
      : statusVariant === 'in-progress'
        ? 'In progress'
        : 'Closed';

  const statusBadgeVariant =
    statusVariant === 'open'
      ? ('active' as const)
      : statusVariant === 'in-progress'
        ? ('warning' as const)
        : ('outline' as const);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card/50 text-xs transition-all duration-200 hover:border-primary/30 hover:bg-card/70 focus-within:ring-2 focus-within:ring-ring">
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
            {statusLabel}
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
          onClick={onViewDetails}
        >
          View Project
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- PAGE ---

function parseFilterStateFromSearchParams(searchParams: URLSearchParams, allDomains: string[], allTech: string[]): FilterState {
  const parseList = (key: string): string[] => {
    const raw = searchParams.get(key);
    if (!raw) return [];
    return raw.split(',').map((v) => decodeURIComponent(v)).filter(Boolean);
  };

  const domains = parseList('domain').filter((d) => allDomains.includes(d));
  const tech = parseList('tech').filter((t) => allTech.includes(t));
  const statuses = parseList('status').filter((s) =>
    ['open', 'in-progress', 'closed'].includes(s)
  ) as StatusFilter[];
  const commitments = parseList('commitment').filter((c) =>
    ['low', 'medium', 'high'].includes(c)
  ) as CommitmentFilter[];
  const difficulties = parseList('difficulty').filter((d) =>
    ['beginner', 'intermediate', 'advanced'].includes(d)
  ) as DifficultyFilter[];

  return { domains, tech, statuses, commitments, difficulties };
}

function writeFilterStateToSearchParams(
  searchParams: URLSearchParams,
  filters: FilterState,
  searchQuery: string
): string {
  const params = new URLSearchParams(searchParams.toString());

  // search
  if (searchQuery) {
    params.set('q', searchQuery);
  } else {
    params.delete('q');
  }

  const setList = (key: string, values: string[]) => {
    if (values.length === 0) {
      params.delete(key);
    } else {
      params.set(
        key,
        values
          .map((v) => encodeURIComponent(v))
          .join(',')
      );
    }
  };

  setList('domain', filters.domains);
  setList('tech', filters.tech);
  setList('status', filters.statuses);
  setList('commitment', filters.commitments);
  setList('difficulty', filters.difficulties);

  return params.toString();
}

function ExplorePageContent() {
  const { profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') ?? '');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);

  // Derive options from mock data (no backend changes)
  const allProjects = useMemo(() => MOCK_PROJECTS, []);

  const allDomains = useMemo(
    () =>
      Array.from(new Set(allProjects.map((p) => p.sector))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [allProjects]
  );

  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    allProjects.forEach((p) => p.skills_needed.forEach((skill) => techSet.add(skill)));
    return Array.from(techSet).sort((a, b) => a.localeCompare(b));
  }, [allProjects]);

  const [filters, setFilters] = useState<FilterState>(() =>
    parseFilterStateFromSearchParams(
      new URLSearchParams(searchParams.toString()),
      allDomains,
      allTech
    )
  );

  // Simulate loading / skeletons for UX
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Keep URL in sync whenever filters or debounced search change
  useEffect(() => {
    const queryString = writeFilterStateToSearchParams(
      new URLSearchParams(searchParams.toString()),
      filters,
      debouncedSearch
    );

    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debouncedSearch]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const difficulty = getDifficulty(project);

      const matchesSearch =
        !debouncedSearch ||
        project.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.founder.name.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesDomain =
        filters.domains.length === 0 || filters.domains.includes(project.sector);

      const matchesTech =
        filters.tech.length === 0 ||
        project.skills_needed.some((skill) => filters.tech.includes(skill));

      const matchesStatus =
        filters.statuses.length === 0 || filters.statuses.includes(project.status as StatusFilter);

      const matchesCommitment =
        filters.commitments.length === 0 ||
        filters.commitments.includes(project.commitment as CommitmentFilter);

      const matchesDifficulty =
        filters.difficulties.length === 0 || filters.difficulties.includes(difficulty);

      return (
        matchesSearch &&
        matchesDomain &&
        matchesTech &&
        matchesStatus &&
        matchesCommitment &&
        matchesDifficulty
      );
    });
  }, [allProjects, debouncedSearch, filters]);

  const projectsToShow = filteredProjects.slice(0, visibleCount);

  const handleViewDetails = (projectId: string) => {
    if (!profile) {
      router.push(`/auth?redirect=/projects/${projectId}`);
      return;
    }
    router.push(`/projects/${projectId}`);
  };

  const handleClearFilters = () => {
    setFilters({
      domains: [],
      tech: [],
      statuses: [],
      commitments: [],
      difficulties: [],
    });
    setSearchInput('');
  };

  const messagesCount = 9; // Mocked badge count, TODO: replace with backend once messaging is wired here

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ExploreNavbar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onOpenFilters={() => setFilterDrawerOpen(true)}
        messagesCount={messagesCount}
        activeFilterCount={
          filters.domains.length +
          filters.tech.length +
          filters.statuses.length +
          filters.commitments.length +
          filters.difficulties.length
        }
      />

      {/* Project-scoped sub-navigation */}
      <ExploreSubNav />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* Category strip / header */}
        <section
          aria-label="Explore startup projects overview"
          className="flex flex-wrap items-center justify-between gap-3 border-b pb-3"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Discover collaboration opportunities in innovative startups.</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">
                {filteredProjects.length.toString().padStart(2, '0')} results
              </span>
              <span aria-hidden="true">•</span>
              <span>Showing {Math.min(visibleCount, filteredProjects.length)} projects</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="relative flex items-center gap-1.5 text-xs sm:hidden"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
              {(filters.domains.length +
                filters.tech.length +
                filters.statuses.length +
                filters.commitments.length +
                filters.difficulties.length) > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {filters.domains.length +
                      filters.tech.length +
                      filters.statuses.length +
                      filters.commitments.length +
                      filters.difficulties.length}
                  </span>
                )}
            </Button>
          </div>
        </section>

        {/* Grid + skeletons */}
        {loading ? (
          <section
            aria-label="Loading project results"
            className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <Card key={idx} className="flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card/50">
                <Skeleton className="h-36 w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="mt-auto border-t border-border/50 p-3">
                  <Skeleton className="h-7 w-24" />
                </div>
              </Card>
            ))}
          </section>
        ) : filteredProjects.length === 0 ? (
          <section className="flex flex-1 flex-col items-center justify-center gap-4 border bg-card/40 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-muted">
              <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">No projects match your filters</p>
              <p className="text-xs text-muted-foreground">
                Try clearing some filters or adjusting your search query.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleClearFilters}>
              Clear filters
            </Button>
          </section>
        ) : (
          <>
            <section
              aria-label="Project results"
              className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {projectsToShow.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  difficulty={getDifficulty(project)}
                  onViewDetails={() => handleViewDetails(project.id)}
                />
              ))}
            </section>

            {visibleCount < filteredProjects.length && (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                >
                  Show more projects
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <FilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        domains={allDomains}
        techOptions={allTech}
        value={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}

// Wrap with Suspense for useSearchParams compatibility with Next.js 13+
function ExplorePageFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32" />
          <div className="flex-1">
            <Skeleton className="mx-auto h-10 max-w-xl rounded-full" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 12 }).map((_, idx) => (
            <Card key={idx} className="flex h-full flex-col overflow-hidden border bg-card">
              <Skeleton className="h-28 w-full" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageFallback />}>
      <ExplorePageContent />
    </Suspense>
  );
}
