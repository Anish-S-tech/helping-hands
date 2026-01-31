'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    UserCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    FileText,
    Eye,
    ChevronRight
} from 'lucide-react';
import {
    MOCK_INCOMING_APPLICATIONS,
    formatRelativeTime,
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { BackButton } from '@/components/BackButton';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function RequestsPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Applications by status
    const pendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');
    const acceptedApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'accepted');
    const rejectedApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'rejected');

    useEffect(() => {
        if (authLoading) return;
        // Redirect builders to their home
        if (profile && profile.role_type === 'user') {
            router.push('/builder/home');
        }
    }, [profile, authLoading, router]);

    const handleAccept = (id: string) => {
        setProcessingId(id);
        setTimeout(() => setProcessingId(null), 1000);
    };

    const handleReject = (id: string) => {
        setProcessingId(id);
        setTimeout(() => setProcessingId(null), 1000);
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
        <TooltipProvider>
            <MainLayout>
                <div className="max-w-[1200px] mx-auto space-y-12 pb-8">
                    {/* Header */}
                    <section className="space-y-4">
                        <BackButton />
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Join Requests
                                    </h1>
                                    {pendingApplications.length > 0 && (
                                        <Badge variant="warning">{pendingApplications.length} pending</Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground">
                                    Review and manage applications to your projects
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
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
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{acceptedApplications.length}</p>
                                            <p className="text-xs text-muted-foreground">Accepted</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                            <XCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{rejectedApplications.length}</p>
                                            <p className="text-xs text-muted-foreground">Rejected</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Pending Requests */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Pending Requests"
                            subtitle="Applications awaiting your review"
                            icon={Clock}
                            badge={pendingApplications.length > 0 ? { label: `${pendingApplications.length} pending`, variant: "warning" } : undefined}
                        />
                        {pendingApplications.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
                                        <UserCheck className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">No pending requests</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {pendingApplications.map((app) => (
                                    <Card key={app.id} className="border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 ring-2 ring-background">
                                                    <AvatarImage src={app.applicant_avatar} />
                                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20">
                                                        {app.applicant_name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold">{app.applicant_name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Applied for <span className="text-foreground font-medium">{app.role_applied}</span> in {app.project_title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                                        {formatRelativeTime(app.applied_at)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handleAccept(app.id)}
                                                                disabled={processingId === app.id}
                                                                className="h-10 w-10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                                            >
                                                                {processingId === app.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="h-5 w-5" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Accept</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handleReject(app.id)}
                                                                disabled={processingId === app.id}
                                                                className="h-10 w-10 border-destructive/30 text-destructive hover:bg-destructive/10"
                                                            >
                                                                {processingId === app.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="h-5 w-5" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Reject</TooltipContent>
                                                    </Tooltip>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/profile/${app.applicant_id}`}>
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View Profile
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Request History */}
                    <section className="space-y-4">
                        <SectionHeader
                            title="Request History"
                            subtitle="Previously reviewed applications"
                            icon={FileText}
                        />
                        <div className="space-y-3">
                            {[...acceptedApplications, ...rejectedApplications].map((app) => (
                                <Card
                                    key={app.id}
                                    className={cn(
                                        app.status === 'accepted'
                                            ? "border-emerald-500/20 bg-emerald-500/5"
                                            : "border-destructive/20 bg-destructive/5"
                                    )}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                                app.status === 'accepted' ? "bg-emerald-500/10" : "bg-destructive/10"
                                            )}>
                                                {app.status === 'accepted' ? (
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-destructive" />
                                                )}
                                            </div>
                                            <Avatar className="h-10 w-10">
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
                                            </div>
                                            <Badge
                                                variant={app.status === 'accepted' ? 'default' : 'destructive'}
                                                className={app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
                                            >
                                                {app.status === 'accepted' ? 'Accepted' : 'Rejected'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {acceptedApplications.length === 0 && rejectedApplications.length === 0 && (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground">No history yet</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </section>
                </div>
            </MainLayout>
        </TooltipProvider>
    );
}
