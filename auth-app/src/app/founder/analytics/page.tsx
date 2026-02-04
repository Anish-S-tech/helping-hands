'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    FolderKanban,
    Eye,
    UserPlus,
    Clock,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Calendar
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_INCOMING_APPLICATIONS,
    MOCK_TEAM_MEMBERS,
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { BackButton } from '@/components/BackButton';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Mock analytics data
const analyticsData = {
    overview: {
        totalViews: 2847,
        viewsChange: 12.5,
        totalApplications: 156,
        applicationsChange: 8.3,
        conversionRate: 5.5,
        conversionChange: -2.1,
        activeProjects: 4,
        projectsChange: 0,
    },
    weeklyViews: [320, 410, 380, 520, 490, 430, 297],
    weeklyApplications: [12, 18, 15, 22, 19, 25, 14],
    topProjects: [
        { name: 'AI-Powered Analytics Dashboard', views: 892, applications: 45, conversion: 5.0 },
        { name: 'HealthTech Mobile App', views: 654, applications: 32, conversion: 4.9 },
        { name: 'FinTech Payment Gateway', views: 521, applications: 28, conversion: 5.4 },
        { name: 'E-commerce Platform', views: 410, applications: 21, conversion: 5.1 },
    ],
    applicationsByRole: [
        { role: 'Frontend Developer', count: 42, percentage: 27 },
        { role: 'Backend Developer', count: 38, percentage: 24 },
        { role: 'UI/UX Designer', count: 31, percentage: 20 },
        { role: 'Product Manager', count: 24, percentage: 15 },
        { role: 'DevOps Engineer', count: 21, percentage: 14 },
    ],
    recentActivity: [
        { type: 'application', message: 'New application from Alex Chen for Frontend Developer', time: '2 hours ago' },
        { type: 'view', message: 'AI Analytics project reached 500 views', time: '5 hours ago' },
        { type: 'team', message: 'Sarah Miller joined HealthTech project', time: '1 day ago' },
        { type: 'application', message: 'Application accepted: Mike Johnson', time: '2 days ago' },
    ],
};

function StatCard({
    title,
    value,
    change,
    icon: Icon,
    color
}: {
    title: string;
    value: string | number;
    change: number;
    icon: React.ElementType;
    color: string;
}) {
    const isPositive = change >= 0;
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        <div className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            isPositive ? "text-emerald-500" : "text-red-500"
                        )}>
                            {isPositive ? (
                                <ArrowUpRight className="h-3 w-3" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3" />
                            )}
                            <span>{Math.abs(change)}% vs last week</span>
                        </div>
                    </div>
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        color
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function MiniBarChart({ data, maxHeight = 60 }: { data: number[]; maxHeight?: number }) {
    const maxValue = Math.max(...data);
    return (
        <div className="flex items-end gap-1 h-16">
            {data.map((value, index) => (
                <div
                    key={index}
                    className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors cursor-pointer"
                    style={{ height: `${(value / maxValue) * maxHeight}px` }}
                    title={`${value}`}
                />
            ))}
        </div>
    );
}

export default function FounderAnalyticsPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    // Get founder's projects
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const pendingApplications = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');
    const teamMembers = MOCK_TEAM_MEMBERS.filter(m =>
        founderProjects.some(p => p.id === m.project_id)
    );

    useEffect(() => {
        if (authLoading) return;
        if (profile && profile.role_type === 'builder') {
            router.push('/builder/home');
        }
    }, [profile, authLoading, router]);

    if (authLoading) {
        return (
            <MainLayout>
                <div className="space-y-8">
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                    </div>
                    <Skeleton className="h-64 w-full" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <section className="space-y-2">
                    <BackButton />
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                                <Badge variant="secondary">Last 7 days</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Track your project performance and team growth
                            </p>
                        </div>
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Change Period
                        </Button>
                    </div>
                </section>

                {/* Overview Stats */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Views"
                        value={analyticsData.overview.totalViews.toLocaleString()}
                        change={analyticsData.overview.viewsChange}
                        icon={Eye}
                        color="bg-blue-500/10 text-blue-500"
                    />
                    <StatCard
                        title="Applications"
                        value={analyticsData.overview.totalApplications}
                        change={analyticsData.overview.applicationsChange}
                        icon={UserPlus}
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <StatCard
                        title="Conversion Rate"
                        value={`${analyticsData.overview.conversionRate}%`}
                        change={analyticsData.overview.conversionChange}
                        icon={TrendingUp}
                        color="bg-violet-500/10 text-violet-500"
                    />
                    <StatCard
                        title="Active Projects"
                        value={founderProjects.length}
                        change={analyticsData.overview.projectsChange}
                        icon={FolderKanban}
                        color="bg-amber-500/10 text-amber-500"
                    />
                </section>

                {/* Charts Row */}
                <section className="grid lg:grid-cols-2 gap-6">
                    {/* Weekly Views */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Eye className="h-4 w-4 text-blue-500" />
                                Weekly Views
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <MiniBarChart data={analyticsData.weeklyViews} />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Total this week
                                </span>
                                <span className="font-semibold">
                                    {analyticsData.weeklyViews.reduce((a, b) => a + b, 0).toLocaleString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Applications */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <UserPlus className="h-4 w-4 text-emerald-500" />
                                Weekly Applications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <MiniBarChart data={analyticsData.weeklyApplications} />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Total this week
                                </span>
                                <span className="font-semibold">
                                    {analyticsData.weeklyApplications.reduce((a, b) => a + b, 0)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Project Performance & Applications by Role */}
                <section className="grid lg:grid-cols-2 gap-6">
                    {/* Top Projects */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-violet-500" />
                                Project Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analyticsData.topProjects.map((project, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium truncate max-w-[200px]">
                                            {project.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {project.views} views
                                        </span>
                                    </div>
                                    <Progress
                                        value={(project.views / analyticsData.topProjects[0].views) * 100}
                                        className="h-2"
                                    />
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{project.applications} applications</span>
                                        <span>{project.conversion}% conversion</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Applications by Role */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Users className="h-4 w-4 text-amber-500" />
                                Applications by Role
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analyticsData.applicationsByRole.map((role, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{role.role}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {role.count} ({role.percentage}%)
                                        </span>
                                    </div>
                                    <Progress value={role.percentage} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                {/* Recent Activity */}
                <section className="space-y-4">
                    <SectionHeader
                        title="Recent Activity"
                        subtitle="Latest updates across your projects"
                        icon={Activity}
                    />
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {analyticsData.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4">
                                        <div className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                                            activity.type === 'application' && "bg-emerald-500/10 text-emerald-500",
                                            activity.type === 'view' && "bg-blue-500/10 text-blue-500",
                                            activity.type === 'team' && "bg-violet-500/10 text-violet-500"
                                        )}>
                                            {activity.type === 'application' && <UserPlus className="h-5 w-5" />}
                                            {activity.type === 'view' && <Eye className="h-5 w-5" />}
                                            {activity.type === 'team' && <Users className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Quick Stats Footer */}
                <section className="grid grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{teamMembers.length}</p>
                                <p className="text-xs text-muted-foreground">Team Members</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{pendingApplications.length}</p>
                                <p className="text-xs text-muted-foreground">Pending Reviews</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-500">
                                <FolderKanban className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{founderProjects.length}</p>
                                <p className="text-xs text-muted-foreground">Active Projects</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </MainLayout>
    );
}
