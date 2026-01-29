'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Briefcase,
    Clock,
    CheckCircle2,
    XCircle,
    FileText
} from 'lucide-react';
import {
    MOCK_ACTIVE_PROJECTS,
    MOCK_USER_APPLICATIONS,
    formatRelativeTime,
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ProjectPhase } from "@/data/mock-data";

export default function BuilderContributionsPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    // Active projects
    const activeProjects = MOCK_ACTIVE_PROJECTS.filter(p => p.status === 'active');

    // Applications by status
    const pendingApplications = MOCK_USER_APPLICATIONS.filter(a => a.status === 'pending');
    const acceptedApplications = MOCK_USER_APPLICATIONS.filter(a => a.status === 'accepted');
    const rejectedApplications = MOCK_USER_APPLICATIONS.filter(a => a.status === 'rejected');

    useEffect(() => {
        if (authLoading) return;
        if (profile && profile.role_type === 'founder') {
            router.push('/founder/home');
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-warning" />;
            case 'accepted':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-destructive" />;
            default:
                return <FileText className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="warning">Pending</Badge>;
            case 'accepted':
                return <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-10">
                {/* Header */}
                <section className="space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    My Contributions
                                </h1>
                                <Badge variant="secondary">{activeProjects.length} Active</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Track your project contributions and application status
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/builder/explore">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Find More Projects
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Active Projects */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Active Projects"
                        subtitle="Projects you're currently contributing to"
                        icon={Briefcase}
                        badge={{ label: `${activeProjects.length} projects`, variant: "secondary" }}
                    />
                    {activeProjects.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-border/50 rounded-lg">
                            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground mb-4">You're not contributing to any projects yet</p>
                            <Button asChild>
                                <Link href="/builder/explore">Explore Projects</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {activeProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    id={project.project_id}
                                    title={project.project_title}
                                    description={`Your Role: ${project.role}`}
                                    phase={project.phase as ProjectPhase}
                                    founderName={project.founder_name}
                                    lastActivity={formatRelativeTime(project.last_activity)}
                                    variant="compact"
                                    showActions={true}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Pending Applications */}
                {pendingApplications.length > 0 && (
                    <section className="space-y-4">
                        <SectionHeader
                            title="Pending Applications"
                            subtitle="Awaiting response from project founders"
                            icon={Clock}
                            badge={{ label: `${pendingApplications.length} pending`, variant: "warning" }}
                        />
                        <div className="space-y-3">
                            {pendingApplications.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-warning/20 bg-warning/5"
                                >
                                    <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                                        {getStatusIcon(app.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{app.project_title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Applied for <span className="text-foreground font-medium">{app.role_applied}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            {formatRelativeTime(app.applied_at)}
                                        </p>
                                    </div>
                                    {getStatusBadge(app.status)}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Application History */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Application History"
                        subtitle="All your past applications"
                        icon={FileText}
                    />
                    <div className="space-y-3">
                        {[...acceptedApplications, ...rejectedApplications].map((app) => (
                            <div
                                key={app.id}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-lg border",
                                    app.status === 'accepted'
                                        ? "border-green-500/20 bg-green-500/5"
                                        : "border-destructive/20 bg-destructive/5"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                    app.status === 'accepted' ? "bg-green-500/10" : "bg-destructive/10"
                                )}>
                                    {getStatusIcon(app.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{app.project_title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Applied for <span className="text-foreground font-medium">{app.role_applied}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                        {formatRelativeTime(app.applied_at)}
                                    </p>
                                </div>
                                {getStatusBadge(app.status)}
                            </div>
                        ))}
                        {acceptedApplications.length === 0 && rejectedApplications.length === 0 && (
                            <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
                                <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                                <p className="text-sm text-muted-foreground">No application history yet</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
