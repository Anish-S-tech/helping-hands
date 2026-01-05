'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Plus,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    Loader2
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_INCOMING_APPLICATIONS,
    MOCK_TEAM_MEMBERS,
    formatRelativeTime
} from '@/data/mock-data';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton, SkeletonTable } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export default function FounderDashboardPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Filter projects for this founder (using f1 for demo)
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const pendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');
    const teamMembers = MOCK_TEAM_MEMBERS.filter(m => founderProjects.some(p => p.id === m.project_id));

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login/founder');
            return;
        }
        if (profile?.role_type === 'user') {
            router.push('/dashboard/builder');
            return;
        }
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [profile, authLoading, router]);

    const handleAccept = (id: string) => {
        setProcessingId(id);
        // Simulate API call
        setTimeout(() => setProcessingId(null), 1000);
    };

    const handleReject = (id: string) => {
        setProcessingId(id);
        // Simulate API call
        setTimeout(() => setProcessingId(null), 1000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge variant="active" className="text-[10px]">Open</Badge>;
            case 'in-progress':
                return <Badge variant="warning" className="text-[10px]">In Progress</Badge>;
            case 'closed':
                return <Badge variant="secondary" className="text-[10px]">Closed</Badge>;
            default:
                return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'founder':
                return <Badge variant="premium" className="text-[9px]">Founder</Badge>;
            case 'lead':
                return <Badge variant="default" className="text-[9px]">Lead</Badge>;
            case 'developer':
                return <Badge variant="secondary" className="text-[9px]">Developer</Badge>;
            case 'designer':
                return <Badge variant="outline" className="text-[9px]">Designer</Badge>;
            case 'analyst':
                return <Badge variant="outline" className="text-[9px]">Analyst</Badge>;
            default:
                return <Badge variant="outline" className="text-[9px]">{role}</Badge>;
        }
    };

    if (authLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                        <Skeleton className="h-9 w-32" />
                    </div>
                    <SkeletonTable rows={4} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <TooltipProvider>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Compact Header */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between animate-fade-in-up">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Welcome back, <span className="text-foreground font-medium">{profile?.name || 'Founder'}</span>
                            </p>
                        </div>
                        <Button size="sm" asChild>
                            <Link href="/projects/create">
                                <Plus className="mr-2 h-4 w-4" /> Create Project
                            </Link>
                        </Button>
                    </div>

                    {/* My Projects Table */}
                    <div className="border rounded-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                        <div className="px-4 py-3 bg-muted/20 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">My Projects</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Manage your projects and team composition</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                                {founderProjects.length} Projects
                            </Badge>
                        </div>
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">Loading projects...</span>
                                </div>
                            </div>
                        ) : founderProjects.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No projects yet. Create your first project to start building your team.</p>
                                <Button size="sm" className="mt-3" asChild>
                                    <Link href="/projects/create">Create Project</Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[280px]">Project Name</TableHead>
                                        <TableHead>Open Roles</TableHead>
                                        <TableHead>Applications</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right w-[100px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {founderProjects.map((project, index) => (
                                        <TableRow
                                            key={project.id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{project.title}</span>
                                                    <span className="text-xs text-muted-foreground">{project.sector}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {project.open_roles.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.open_roles.slice(0, 2).map((role, i) => (
                                                            <Badge key={i} variant="outline" className="text-[10px]">{role}</Badge>
                                                        ))}
                                                        {project.open_roles.length > 2 && (
                                                            <Badge variant="secondary" className="text-[10px]">+{project.open_roles.length - 2}</Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">No open roles</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {project.applications_pending > 0 ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                                                        <span className="text-sm font-medium">{project.applications_pending} pending</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">0 pending</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(project.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/projects/${project.id}`}>
                                                        Manage <ArrowUpRight className="ml-1 h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Incoming Applications Table */}
                    <div className="border rounded-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="px-4 py-3 bg-muted/20 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">Incoming Applications</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Review and respond to applicants</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                                {pendingApplications.length} Pending
                            </Badge>
                        </div>
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">Loading applications...</span>
                                </div>
                            </div>
                        ) : pendingApplications.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No pending applications at the moment.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Applicant</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Applied</TableHead>
                                        <TableHead className="text-right w-[160px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingApplications.map((application, index) => (
                                        <TableRow
                                            key={application.id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={application.applicant_avatar} />
                                                        <AvatarFallback className="text-[10px]">
                                                            {application.applicant_name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-sm">{application.applicant_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px]">{application.role_applied}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{application.project_title}</span>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatRelativeTime(application.applied_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleAccept(application.id)}
                                                                disabled={processingId === application.id}
                                                                className="h-8 px-2 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                                            >
                                                                {processingId === application.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Accept application</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleReject(application.id)}
                                                                disabled={processingId === application.id}
                                                                className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                {processingId === application.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Reject application</TooltipContent>
                                                    </Tooltip>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/profile/${application.applicant_id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Team Overview */}
                    <div className="border rounded-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                        <div className="px-4 py-3 bg-muted/20 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">Team Overview</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">All team members across your projects</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{teamMembers.length} members</span>
                            </div>
                        </div>
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">Loading team...</span>
                                </div>
                            </div>
                        ) : teamMembers.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No team members yet.</p>
                            </div>
                        ) : (
                            <div className="p-4">
                                <div className="flex flex-wrap gap-3">
                                    {teamMembers.map((member, index) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-transparent hover:border-border transition-colors animate-fade-in-up"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={member.avatar_url} />
                                                <AvatarFallback className="text-xs">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{member.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">{member.role}</span>
                                                    {getRoleBadge(member.role_badge)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </TooltipProvider>
    );
}
