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
import { BackButton } from '@/components/BackButton';
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
            <div className="max-w-[1400px] mx-auto space-y-10 pb-12 px-4 md:px-6">
                {/* Header Section */}
                <section className="space-y-6 animate-fade-in stagger-1">
                    <BackButton className="hover:bg-muted/50 transition-all" />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                        <div className="space-y-1.5">
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text">
                                My Contributions
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2 font-medium">
                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                Monitoring active engagements and applications.
                            </p>
                        </div>
                        <Button size="sm" className="h-10 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95" asChild>
                            <Link href="/explore">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Browse Marketplace
                            </Link>
                        </Button>
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* MAIN COLUMN (2/3) - Active Projects */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-in stagger-2">
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <SectionHeader
                                    title="Active Missions"
                                    subtitle="Projects you are currently deployed to"
                                    badge={{ label: `${activeProjects.length} Engaged`, variant: "secondary" }}
                                />
                            </div>

                            {activeProjects.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-border/40 rounded-3xl bg-muted/5 group hover:border-primary/40 transition-colors">
                                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50 group-hover:scale-110 transition-transform">
                                        <Briefcase className="h-8 w-8 text-muted-foreground opacity-30" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">No active missions found</h3>
                                    <p className="text-sm text-muted-foreground mb-6 max-w-[280px] mx-auto">Apply to projects in the marketplace to start your contribution journey.</p>
                                    <Button variant="outline" size="sm" className="h-9 px-6 font-bold" asChild>
                                        <Link href="/explore">View Projects</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {activeProjects.map((project) => (
                                        <div key={project.id} className="group transition-all">
                                            <ProjectCard
                                                id={project.project_id}
                                                title={project.project_title}
                                                vision={`Working as: ${project.role}`}
                                                phase={project.phase as ProjectPhase}
                                                founderName={project.founder_name}
                                                imageUrl={project.imageUrl}
                                                lastActivity={formatRelativeTime(project.last_activity)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* SIDEBAR COLUMN (1/3) - Pipeline & History */}
                    <div className="space-y-10 animate-fade-in stagger-3">
                        {/* Application Pipeline */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    Application Pipeline
                                </h3>
                                {pendingApplications.length > 0 && (
                                    <Badge variant="outline" className="text-[9px] font-bold px-2 py-0 border-amber-500/30 text-amber-500 bg-amber-500/5">
                                        {pendingApplications.length} PENDING
                                    </Badge>
                                )}
                            </div>

                            <div className="space-y-3">
                                {pendingApplications.length === 0 ? (
                                    <div className="text-center py-10 border border-dashed border-border/40 rounded-2xl bg-muted/5">
                                        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Queue Empty</p>
                                    </div>
                                ) : (
                                    pendingApplications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="group relative p-4 rounded-xl border border-border/40 bg-card hover:border-amber-500/40 transition-all hover:bg-card/80"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20">
                                                    <Clock className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate group-hover:text-amber-500 transition-colors leading-tight">{app.project_title}</p>
                                                    <p className="text-[11px] text-muted-foreground mt-1 font-medium">Applied for <span className="text-foreground/80">{app.role_applied}</span></p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-[10px] text-muted-foreground/60 tabular-nums font-medium">{formatRelativeTime(app.applied_at)}</span>
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Action Pending</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Recent History */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/50">
                                    Recent Decisions
                                </h3>
                                <Link href="/archive" className="text-[10px] font-extrabold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                                    History
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {[...acceptedApplications, ...rejectedApplications].slice(0, 4).map((app) => (
                                    <div
                                        key={app.id}
                                        className={cn(
                                            "p-4 rounded-xl border transition-all hover:bg-card/80",
                                            app.status === 'accepted'
                                                ? "border-emerald-500/20 bg-emerald-500/[0.02] hover:border-emerald-500/40"
                                                : "border-border/30 bg-card/30 hover:border-border/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
                                                app.status === 'accepted' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" : "border-border bg-muted/50 text-muted-foreground"
                                            )}>
                                                {app.status === 'accepted' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="text-sm font-bold truncate leading-tight">{app.project_title}</p>
                                                    <span className={cn(
                                                        "text-[9px] font-bold uppercase tracking-widest",
                                                        app.status === 'accepted' ? "text-emerald-500" : "text-muted-foreground/70"
                                                    )}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-medium">Applied as {app.role_applied}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {acceptedApplications.length === 0 && rejectedApplications.length === 0 && (
                                    <div className="text-center py-10 border border-dashed border-border/40 rounded-2xl bg-muted/5">
                                        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">No Archives</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
