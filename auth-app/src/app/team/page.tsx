'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Users,
    Search,
    MessageSquare,
    ChevronRight,
    Crown,
    FolderKanban,
    Clock,
    Activity,
    Mail
} from 'lucide-react';
import {
    MOCK_PROJECTS,
    MOCK_TEAM_MEMBERS,
    formatRelativeTime,
} from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { BackButton } from '@/components/BackButton';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function TeamPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    // Founder's projects
    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');

    // Team members across all projects
    const teamMembers = MOCK_TEAM_MEMBERS.filter(m =>
        founderProjects.some(p => p.id === m.project_id)
    );

    // Group members by project
    const membersByProject = founderProjects.map(project => ({
        project,
        members: MOCK_TEAM_MEMBERS.filter(m => m.project_id === project.id)
    })).filter(group => group.members.length > 0);

    // Filter members based on search
    const filteredMembers = teamMembers.filter(member =>
        searchQuery === '' ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
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
                                    My Team
                                </h1>
                                <Badge variant="secondary">{teamMembers.length} Members</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Manage your team members across all projects
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{teamMembers.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Members</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                                        <FolderKanban className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{membersByProject.length}</p>
                                        <p className="text-xs text-muted-foreground">Active Projects</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'active').length}</p>
                                        <p className="text-xs text-muted-foreground">Active Now</p>
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
                                        <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'inactive').length}</p>
                                        <p className="text-xs text-muted-foreground">Away</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Team by Project */}
                {membersByProject.map(({ project, members }) => (
                    <section key={project.id} className="space-y-4">
                        <SectionHeader
                            title={project.title}
                            subtitle={`${members.length} team members`}
                            icon={FolderKanban}
                            action={{ label: "View Project", href: `/projects/${project.id}` }}
                        />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {members.map((member) => (
                                <Card
                                    key={member.id}
                                    className="group hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => router.push(`/profile/${member.id}`)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={member.avatar_url} />
                                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 text-sm">
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className={cn(
                                                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                                                    member.status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                                                )} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                                        {member.name}
                                                    </p>
                                                    {member.role_badge === 'lead' && (
                                                        <Crown className="h-4 w-4 text-amber-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                                <p className="text-xs text-muted-foreground/70 mt-1">
                                                    Joined {formatRelativeTime(member.joined_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/chat`);
                                                }}
                                            >
                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                Message
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                ))}

                {/* All Team Members */}
                {searchQuery && (
                    <section className="space-y-4">
                        <SectionHeader
                            title="Search Results"
                            subtitle={`${filteredMembers.length} members found`}
                            icon={Users}
                        />
                        {filteredMembers.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
                                        <Users className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">No team members match your search</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredMembers.map((member) => (
                                    <Card
                                        key={member.id}
                                        className="hover:border-primary/30 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/profile/${member.id}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={member.avatar_url} />
                                                    <AvatarFallback>
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{member.name}</p>
                                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Empty state */}
                {teamMembers.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold mb-2">No team members yet</h3>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                Start by creating a project and accepting applications from builders
                            </p>
                            <Button asChild>
                                <Link href="/projects/create">Create Project</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
