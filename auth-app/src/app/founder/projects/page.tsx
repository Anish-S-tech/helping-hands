'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import {
    FolderKanban,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    Users,
    Layers,
    Settings,
    Eye,
    ChevronRight
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_INCOMING_APPLICATIONS,
    MOCK_TEAM_MEMBERS,
    formatRelativeTime,
    type Project
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { BackButton } from '@/components/BackButton';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function FounderProjectsPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    // Founder's projects
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const openProjects = founderProjects.filter(p => p.status === 'open');
    const inProgressProjects = founderProjects.filter(p => p.status === 'in-progress');
    const closedProjects = founderProjects.filter(p => p.status === 'closed');

    // Applications
    const pendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');

    // Team members across all projects
    const teamMembers = MOCK_TEAM_MEMBERS.filter(m => founderProjects.some(p => p.id === m.project_id));

    useEffect(() => {
        if (authLoading) return;
        if (profile && profile.role_type === 'user') {
            router.push('/builder/home');
        }
    }, [profile, authLoading, router]);

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
                {/* Header */}
                <section className="space-y-4">
                    <BackButton />
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    My Projects
                                </h1>
                                <Badge variant="secondary">{founderProjects.length} Total</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Manage your projects, review applications, and track progress
                            </p>
                        </div>
                        <Button asChild className="gap-2">
                            <Link href="/projects/create">
                                <Plus className="h-4 w-4" />
                                Create Project
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <FolderKanban className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{openProjects.length}</p>
                                        <p className="text-xs text-muted-foreground">Open</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{inProgressProjects.length}</p>
                                        <p className="text-xs text-muted-foreground">In Progress</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{pendingApplications.length}</p>
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{teamMembers.length}</p>
                                        <p className="text-xs text-muted-foreground">Team Members</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* All Projects */}
                <section className="space-y-4">
                    <SectionHeader
                        title="All Projects"
                        subtitle="Your projects and their current status"
                        icon={FolderKanban}
                    />
                    {founderProjects.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-border/50 rounded-lg">
                            <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground mb-4">You haven't created any projects yet</p>
                            <Button asChild>
                                <Link href="/projects/create">Create Your First Project</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {founderProjects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="group overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary/30"
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                >
                                    <div className="relative h-36 overflow-hidden">
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
                                                {project.status === 'open' ? 'Open' : project.status === 'in-progress' ? 'In Progress' : 'Closed'}
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
                                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>{project.member_count}/{project.team_size_needed} team</span>
                                            </div>
                                            <span>{project.applications_pending} applicants</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1" asChild onClick={(e) => e.stopPropagation()}>
                                                <Link href={`/projects/${project.id}`}>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* Pending Applications */}
                {pendingApplications.length > 0 && (
                    <section className="space-y-4">
                        <SectionHeader
                            title="Pending Applications"
                            subtitle="Review and respond to applicants"
                            icon={Clock}
                            badge={{ label: `${pendingApplications.length} pending`, variant: "warning" }}
                            action={{ label: "View All", href: "/founder/home#requests" }}
                        />
                        <div className="space-y-3">
                            {pendingApplications.slice(0, 3).map((app) => (
                                <Card key={app.id} className="border-amber-500/20 bg-amber-500/5">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={app.applicant_avatar} />
                                                <AvatarFallback>
                                                    {app.applicant_name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{app.applicant_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Applied for <span className="text-foreground font-medium">{app.role_applied}</span> in {app.project_title}
                                                </p>
                                                <p className="text-xs text-muted-foreground/70 mt-1">
                                                    {formatRelativeTime(app.applied_at)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" className="h-9 w-9 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-9 w-9 border-destructive/30 text-destructive hover:bg-destructive/10">
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/profile/${app.applicant_id}`}>Profile</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Team Overview */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Team Overview"
                        subtitle="Your collaborators across all projects"
                        icon={Users}
                        badge={{ label: `${teamMembers.length} members`, variant: "secondary" }}
                    />
                    {teamMembers.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
                            <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground">No team members yet</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamMembers.map((member) => (
                                <Card key={member.id} className="hover:border-primary/20 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={member.avatar_url} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{member.name}</p>
                                                <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/profile/${member.id}`}>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
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
