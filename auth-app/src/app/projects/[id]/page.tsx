'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import {
    ArrowLeft,
    Users,
    Clock,
    MessageSquare,
    Briefcase,
    Calendar,
    CheckCircle2,
    UploadCloud,
    Send,
    Loader2,
    Star,
    TrendingUp,
    Target,
    Zap,
    ChevronRight,
    ExternalLink,
    Heart,
    Share2,
    Bookmark,
    Award,
    Layers
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_FOUNDERS, formatRelativeTime, type Project } from '@/data/mock-data';
import { Mail, MapPin, ShieldCheck, Sparkle } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { ProjectPhaseBadge } from '@/components/ProjectPhaseBadge';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Image mapping for projects
const PROJECT_IMAGE_MAP: Record<string, string> = {
    p1: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p2: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p3: 'https://images.pexels.com/photos/3730760/pexels-photo-3730760.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p4: 'https://images.pexels.com/photos/8370755/pexels-photo-8370755.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p5: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p6: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p7: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p8: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p9: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p10: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p11: 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=1200',
    p12: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

function getProjectImage(project: Project): string {
    if (project.imageUrl) return project.imageUrl;
    if (PROJECT_IMAGE_MAP[project.id]) return PROJECT_IMAGE_MAP[project.id];
    return 'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=1200';
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
}) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    const [isApplying, setIsApplying] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [applicationSent, setApplicationSent] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Find the project
    const project = MOCK_PROJECTS.find(p => p.id === id);

    const handleApply = async () => {
        if (!selectedRole || !coverLetter.trim()) return;

        setIsApplying(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsApplying(false);
        setApplicationSent(true);
        setTimeout(() => {
            setDialogOpen(false);
            setApplicationSent(false);
            setSelectedRole('');
            setCoverLetter('');
        }, 2000);
    };

    if (authLoading) {
        return (
            <MainLayout>
                <div className="max-w-6xl mx-auto space-y-8">
                    <Skeleton className="h-72 w-full rounded-2xl" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
                    </div>
                    <Skeleton className="h-48 w-full" />
                </div>
            </MainLayout>
        );
    }

    if (!project) {
        return (
            <MainLayout>
                <div className="max-w-6xl mx-auto">
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
                                <Briefcase className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h1 className="text-2xl font-bold mb-3">Project Not Found</h1>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                The project you're looking for doesn't exist or has been removed.
                            </p>
                            <Button asChild>
                                <Link href="/">Browse Projects</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    const isFounder = profile?.role_type === 'founder';
    const hasOpenRoles = project.open_roles.length > 0;
    const imageSrc = getProjectImage(project);
    const capacityPercent = Math.min(100, ((project.member_count) / project.team_size_needed) * 100);
    const founderProfile = MOCK_FOUNDERS.find(f => f.id === project.founder.id);

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Back Button */}
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                {/* Hero Section with Image */}
                <section className="relative overflow-hidden rounded-2xl border border-border/50">
                    {/* Hero Image */}
                    <div className="relative h-64 md:h-80 w-full">
                        <Image
                            src={imageSrc}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                        {/* Floating badges on image */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 px-3 py-1">
                                {project.sector}
                            </Badge>
                            <ProjectPhaseBadge phase={project.phase} />
                        </div>

                        {/* Action buttons on image */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9 backdrop-blur-md bg-background/80"
                                onClick={() => setIsSaved(!isSaved)}
                            >
                                <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                            </Button>
                            <Button variant="secondary" size="icon" className="h-9 w-9 backdrop-blur-md bg-background/80">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative p-6 md:p-8 -mt-20 md:-mt-24">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="space-y-3 max-w-2xl">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                    {project.title}
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {project.vision}
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        Created {formatRelativeTime(project.created_at)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        Active {formatRelativeTime(project.last_activity)}
                                    </span>
                                </div>
                            </div>

                            {/* CTA Buttons - NEW APPLICATION FORM DIALOG */}
                            <div className="flex gap-3 shrink-0">
                                {project.status === 'open' && !isFounder && hasOpenRoles && (
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                                                <Zap className="h-4 w-4" />
                                                Apply to Join
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-card border-border shadow-2xl">
                                            <div className="sticky top-0 z-10 flex flex-col space-y-1.5 p-6 bg-card/95 backdrop-blur-md border-b border-border/40">
                                                <DialogTitle className="text-xl font-semibold tracking-tight">Apply for {project.title}</DialogTitle>
                                                <DialogDescription className="text-base">
                                                    Submit your profile for the <span className="font-medium text-foreground">{selectedRole || "role"}</span> position.
                                                </DialogDescription>
                                            </div>

                                            {applicationSent ? (
                                                <div className="p-12 text-center space-y-6">
                                                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
                                                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold text-foreground">Application Submitted</h3>
                                                        <p className="text-muted-foreground max-w-xs mx-auto">
                                                            The founder has been notified. You can track this application in your dashboard.
                                                        </p>
                                                    </div>
                                                    <Button variant="outline" onClick={() => setDialogOpen(false)} className="mt-4">
                                                        Close Window
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="p-6 space-y-8">
                                                    {/* 1. Role Selection */}
                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-medium text-foreground">Select Role <span className="text-destructive">*</span></Label>
                                                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                                                            <SelectTrigger className="h-11 border-input/60 bg-muted/5 focus:bg-background transition-colors">
                                                                <SelectValue placeholder="Which role fits you best?" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {project.open_roles.map(role => (
                                                                    <SelectItem key={role} value={role} className="py-3">
                                                                        {role}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {selectedRole && (
                                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                                            {/* 2. Professional Identity */}
                                                            <div className="space-y-4">
                                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Professional Identity</h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs">LinkedIn URL <span className="text-destructive">*</span></Label>
                                                                        <input type="url" className="flex h-10 w-full rounded-md border border-input/60 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all" placeholder="linkedin.com/in/..." />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs">Portfolio / GitHub</Label>
                                                                        <input type="url" className="flex h-10 w-full rounded-md border border-input/60 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all" placeholder="github.com/..." />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* 3. Resume Upload (Mock UI) */}
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resume / CV</h4>
                                                                    <span className="text-[10px] text-muted-foreground">PDF, DOCX up to 5MB</span>
                                                                </div>
                                                                <div className="border-2 border-dashed border-border/60 rounded-xl p-6 hover:bg-muted/5 transition-colors cursor-pointer text-center group">
                                                                    <div className="flex flex-col items-center gap-2">
                                                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                                            <UploadCloud className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                                                                            <p className="text-xs text-muted-foreground">Professional Resume required</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* 4. Role-Specific Questions */}
                                                            <div className="space-y-4">
                                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role Fit</h4>

                                                                {/* Engineering Roles */}
                                                                {(selectedRole.toLowerCase().match(/engineer|developer|backend|frontend|fullstack/)) && (
                                                                    <div className="space-y-4">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs">Years of Experience</Label>
                                                                            <Select>
                                                                                <SelectTrigger className="h-10 border-input/60"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="0-1">0-1 Years</SelectItem>
                                                                                    <SelectItem value="1-3">1-3 Years</SelectItem>
                                                                                    <SelectItem value="3-5">3-5 Years</SelectItem>
                                                                                    <SelectItem value="5+">5+ Years</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs">Primary Tech Stack</Label>
                                                                            <input type="text" className="flex h-10 w-full rounded-md border border-input/60 bg-transparent px-3 py-2 text-sm" placeholder="e.g. React, Node, Python..." />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Design Roles */}
                                                                {(selectedRole.toLowerCase().match(/designer|ui|ux|creative/)) && (
                                                                    <div className="space-y-4">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs">Design Tools</Label>
                                                                            <input type="text" className="flex h-10 w-full rounded-md border border-input/60 bg-transparent px-3 py-2 text-sm" placeholder="Figma, Adobe XD, Spline..." />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs">Link to Best Case Study</Label>
                                                                            <input type="url" className="flex h-10 w-full rounded-md border border-input/60 bg-transparent px-3 py-2 text-sm" placeholder="https://..." />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="space-y-2">
                                                                    <Label className="text-xs">Why this project? (Cover Note)</Label>
                                                                    <Textarea
                                                                        className="min-h-[100px] bg-transparent border-input/60 focus:border-primary resize-y"
                                                                        placeholder="Briefly explain your relevant experience and motivation..."
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Footer Actions */}
                                                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/40">
                                                                <Button variant="ghost" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                                                <Button
                                                                    onClick={handleApply}
                                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 min-w-[120px]"
                                                                >
                                                                    Submit Application
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                )}

                                <Button variant="outline" size="lg" className="gap-2" asChild>
                                    <Link href={`/chat/project-${project.id}`}>
                                        <MessageSquare className="h-4 w-4" />
                                        Project Chat
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Users}
                        label="Team Members"
                        value={`${project.member_count}/${project.team_size_needed}`}
                        color="bg-primary/10 text-primary"
                    />
                    <StatCard
                        icon={Briefcase}
                        label="Open Roles"
                        value={project.open_roles.length}
                        color="bg-violet-500/10 text-violet-500"
                    />
                    <StatCard
                        icon={Target}
                        label="Applications"
                        value={project.applications_pending}
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Commitment"
                        value={project.commitment.charAt(0).toUpperCase() + project.commitment.slice(1)}
                        color="bg-amber-500/10 text-amber-500"
                    />
                </section>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-primary" />
                                    About this Project
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {project.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Team Capacity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-violet-500" />
                                    Team Capacity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Current team size</span>
                                    <span className="font-semibold">{project.member_count} of {project.team_size_needed} members</span>
                                </div>
                                <Progress value={capacityPercent} className="h-3" />
                                <p className="text-xs text-muted-foreground">
                                    {project.team_size_needed - project.member_count} spots remaining for new contributors
                                </p>
                            </CardContent>
                        </Card>

                        {/* Skills Needed */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-emerald-500" />
                                    Skills Needed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills_needed.map(skill => (
                                        <Badge
                                            key={skill}
                                            variant="secondary"
                                            className="px-4 py-2 text-sm bg-secondary/50"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Open Roles */}
                        {hasOpenRoles && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-amber-500" />
                                        Open Roles
                                        <Badge variant="secondary" className="ml-2">{project.open_roles.length} available</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {project.open_roles.map(role => (
                                            <div
                                                key={role}
                                                className="group p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <Briefcase className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{role}</span>
                                                </div>
                                                {!isFounder && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="gap-1 text-primary"
                                                        onClick={() => {
                                                            setSelectedRole(role);
                                                            setDialogOpen(true);
                                                        }}
                                                    >
                                                        Apply <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Founder Card - Premium Revamp */}
                        <Card className="overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl">
                            <div className="h-24 w-full bg-gradient-to-br from-primary/10 via-violet-500/5 to-background relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                            </div>
                            <CardContent className="relative pt-0">
                                <Link href={`/profile/${project.founder.id}`} className="block group">
                                    <div className="-mt-12 mb-4 flex flex-col items-center text-center">
                                        <div className="relative">
                                            <Avatar className="h-24 w-24 border-4 border-background shadow-2xl ring-1 ring-border/50 transition-transform duration-500 group-hover:scale-105">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${project.founder.id}`} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 text-xl font-bold">
                                                    {project.founder.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {founderProfile?.is_verified && (
                                                <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-lg">
                                                    <ShieldCheck className="h-3.5 w-3.5 text-primary-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-1">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                    {project.founder.name}
                                                </h3>
                                                <Sparkle className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Founder & Visionary</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 px-2 pb-2">
                                        {founderProfile?.bio && (
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 text-center italic">
                                                "{founderProfile.bio}"
                                            </p>
                                        )}

                                        <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 pt-2 border-t border-border/40">
                                            {founderProfile?.location && (
                                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                                    <MapPin className="h-3 w-3 text-primary" />
                                                    {founderProfile.location}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                                <Users className="h-3 w-3 text-violet-500" />
                                                4 Projects Launched
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="w-full text-xs h-9 rounded-xl border-border/60 hover:bg-primary/5 hover:text-primary transition-all">
                                                <Mail className="mr-2 h-3.5 w-3.5" />
                                                Message
                                            </Button>
                                            <Button variant="secondary" size="sm" className="w-full text-xs h-9 rounded-xl group/btn">
                                                Profile
                                                <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Quick Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Quick Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge
                                        variant={project.status === 'open' ? 'active' : project.status === 'in-progress' ? 'warning' : 'outline'}
                                    >
                                        {project.status === 'open' ? 'Accepting contributors' : project.status === 'in-progress' ? 'In active build' : 'Closed'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Phase</span>
                                    <ProjectPhaseBadge phase={project.phase} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Sector</span>
                                    <Badge variant="outline">{project.sector}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Commitment</span>
                                    <Badge variant={project.commitment === 'high' ? 'destructive' : project.commitment === 'medium' ? 'warning' : 'secondary'}>
                                        {project.commitment}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Banner */}
                        {project.status !== 'open' && (
                            <Card className="border-amber-500/20 bg-amber-500/5">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <Clock className="h-5 w-5 text-amber-500" />
                                    <p className="text-sm">
                                        This project is <span className="font-medium">{project.status}</span> and not accepting new applications.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
