'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    ArrowUpRight,
    AlertTriangle,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    ExternalLink
} from 'lucide-react';
import {
    MOCK_ACTIVE_PROJECTS,
    MOCK_USER_APPLICATIONS,
    MOCK_ROOMS,
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export default function BuilderDashboardPage() {
    const router = useRouter();
    const { profile, supabase, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);

    // Check if profile is incomplete
    const isProfileIncomplete = profile && !profile.profile_completed;
    const unreadMessages = MOCK_ROOMS.reduce((acc, room) => acc + room.unread_count, 0);

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login/user');
            return;
        }
        if (profile?.role_type === 'founder') {
            router.push('/dashboard/founder');
            return;
        }
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [profile, authLoading, router]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="active" className="text-[10px]">Active</Badge>;
            case 'archived':
                return <Badge variant="secondary" className="text-[10px]">Archived</Badge>;
            case 'pending':
                return <Badge variant="pending" className="text-[10px]">Pending</Badge>;
            case 'accepted':
                return <Badge variant="active" className="text-[10px]">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="text-[10px]">Rejected</Badge>;
            default:
                return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
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
                    </div>
                    <SkeletonTable rows={5} />
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
                                Welcome back, <span className="text-foreground font-medium">{profile?.name || 'Builder'}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {unreadMessages > 0 && (
                                <Link href="/chat" className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="h-4 w-4" />
                                    {unreadMessages} unread
                                </Link>
                            )}
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/explore">
                                    Browse Projects
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Profile Incomplete Warning */}
                    {isProfileIncomplete && (
                        <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg animate-fade-in-up">
                            <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-warning">Complete your profile</p>
                                <p className="text-xs text-muted-foreground">Profiles below 80% completion have limited visibility to founders.</p>
                            </div>
                            <Button variant="outline" size="sm" asChild className="shrink-0">
                                <Link href="/profile/edit">Complete Profile</Link>
                            </Button>
                        </div>
                    )}

                    {/* Active Projects Table */}
                    <div className="border rounded-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                        <div className="px-4 py-3 bg-muted/20 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">Active Projects</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Projects you are currently contributing to</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                                {MOCK_ACTIVE_PROJECTS.length} Projects
                            </Badge>
                        </div>
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">Loading projects...</span>
                                </div>
                            </div>
                        ) : MOCK_ACTIVE_PROJECTS.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No active projects. Start by exploring available projects.</p>
                                <Button size="sm" className="mt-3" asChild>
                                    <Link href="/explore">Browse Projects</Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[280px]">Project</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Activity</TableHead>
                                        <TableHead className="text-right w-[100px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_ACTIVE_PROJECTS.map((project, index) => (
                                        <TableRow
                                            key={project.id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{project.project_title}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        by {project.founder_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] font-medium">{project.role}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(project.status)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatRelativeTime(project.last_activity)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {project.status === 'archived' ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span>
                                                                <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
                                                                    View
                                                                </Button>
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>This project has been archived</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/projects/${project.project_id}`}>
                                                            View <ArrowUpRight className="ml-1 h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Applications Table */}
                    <div className="border rounded-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="px-4 py-3 bg-muted/20 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">My Applications</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Track your project applications</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                                {MOCK_USER_APPLICATIONS.filter(a => a.status === 'pending').length} Pending
                            </Badge>
                        </div>
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">Loading applications...</span>
                                </div>
                            </div>
                        ) : MOCK_USER_APPLICATIONS.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No applications yet. Apply to projects to get started.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">Project</TableHead>
                                        <TableHead>Applied Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Applied</TableHead>
                                        <TableHead className="text-right w-[120px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_USER_APPLICATIONS.map((application, index) => (
                                        <TableRow
                                            key={application.id}
                                            className={cn(
                                                "animate-fade-in-up",
                                                application.action_required && "bg-warning/5"
                                            )}
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {application.action_required && (
                                                        <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                                                    )}
                                                    <span className="font-medium text-sm">{application.project_title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{application.role_applied}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    {application.status === 'pending' && <Clock className="h-3 w-3 text-yellow-500" />}
                                                    {application.status === 'accepted' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                                    {application.status === 'rejected' && <XCircle className="h-3 w-3 text-destructive" />}
                                                    {getStatusBadge(application.status)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatRelativeTime(application.applied_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {application.status === 'pending' ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span>
                                                                <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
                                                                    Withdraw
                                                                </Button>
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Withdrawal disabled during review period</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : application.status === 'accepted' ? (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/projects/${application.project_id}`}>
                                                            Open <ExternalLink className="ml-1 h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/projects/${application.project_id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </TooltipProvider>
    );
}
