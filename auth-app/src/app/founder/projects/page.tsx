'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Plus,
    FolderKanban,
    Search,
    Filter,
    MoreVertical,
    Users,
    MessageSquare,
    ExternalLink,
    Edit
} from 'lucide-react';
import { MOCK_PROJECTS, formatRelativeTime } from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProjectsManagementPage() {
    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter projects for the current founder
    // In demo, we'll show projects where the founder ID matches or all if no profile
    const myProjects = MOCK_PROJECTS.filter(p =>
        !profile || p.founder.id === 'f1' || p.founder.id === profile.id
    );

    const filteredProjects = myProjects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sector.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-8 pb-12 px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in stagger-1">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
                        <p className="text-muted-foreground font-medium">
                            Control your ventures, manage teams, and monitor mission health.
                        </p>
                    </div>
                    <Button asChild className="shadow-lg shadow-primary/20">
                        <Link href="/projects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Project
                        </Link>
                    </Button>
                </div>

                {/* Filters / Search */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects by name or industry..."
                            className="pl-10 h-11 bg-card/40 border-border/40 focus:border-primary/40 transition-all rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-border/40 bg-card/40">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in stagger-3">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full py-20 text-center border border-dashed border-border/40 rounded-3xl bg-muted/5">
                            <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                            <p className="text-muted-foreground font-medium">No projects found matching your criteria</p>
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="group relative rounded-3xl border border-border/40 bg-card overflow-hidden hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5"
                            >
                                {/* Project Header Image/Gradient */}
                                <div className="h-24 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent border-b border-border/40" />

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Badge variant="secondary" className="mb-2 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
                                                {project.sector}
                                            </Badge>
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/projects/${project.id}`} className="cursor-pointer">
                                                        <ExternalLink className="mr-2 h-4 w-4" /> View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/projects/edit/${project.id}`} className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Project
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                                    Archive Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium leading-relaxed">
                                        {project.vision}
                                    </p>

                                    <div className="space-y-4">
                                        {/* Project Stats */}
                                        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                    <Users className="h-3 w-3" /> Team
                                                </div>
                                                <p className="text-sm font-bold">{project.member_count} Members</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                    <MessageSquare className="h-3 w-3" /> Intel
                                                </div>
                                                <p className="text-sm font-bold">12 Applications</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 h-10 rounded-xl font-bold text-[11px] border-border/60 hover:bg-primary/5 transition-all" asChild>
                                                <Link href={`/projects/${project.id}`}>GO TO MISSION</Link>
                                            </Button>
                                            <Button className="flex-1 h-10 rounded-xl font-bold text-[11px] shadow-sm shadow-primary/20" asChild>
                                                <Link href={`/projects/${project.id}/applications`}>TALENT REVIEW</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-3 bg-muted/10 border-t border-border/40 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                        Last Sync: {formatRelativeTime(project.last_activity)}
                                    </span>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <Avatar key={i} className="h-6 w-6 border-2 border-card">
                                                <AvatarFallback className="text-[8px] font-bold bg-muted">U{i}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
