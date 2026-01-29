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
import { MOCK_PROJECTS, formatRelativeTime, type Project } from '@/data/mock-data';
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

                            {/* CTA Buttons */}
                            <div className="flex gap-3 shrink-0">
                                {project.status === 'open' && !isFounder && hasOpenRoles && (
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                                                <Zap className="h-4 w-4" />
                                                Apply to Join
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Apply to {project.title}</DialogTitle>
                                                <DialogDescription>
                                                    Select a role and tell the founder why you'd be a great fit.
                                                </DialogDescription>
                                            </DialogHeader>

                                            {applicationSent ? (
                                                <div className="py-8 text-center">
                                                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-2">Application Sent!</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        The founder will review your application and get back to you.
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="role">Role</Label>
                                                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a role" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {project.open_roles.map(role => (
                                                                        <SelectItem key={role} value={role}>
                                                                            {role}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="cover">Why do you want to join?</Label>
                                                            <Textarea
                                                                id="cover"
                                                                placeholder="Tell the founder about your relevant experience and why you're interested..."
                                                                value={coverLetter}
                                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                                rows={5}
                                                            />
                                                        </div>
                                                    </div>

                                                    <DialogFooter>
                                                        <Button
                                                            onClick={handleApply}
                                                            disabled={!selectedRole || !coverLetter.trim() || isApplying}
                                                            className="gap-2"
                                                        >
                                                            {isApplying ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                    Sending...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Send className="h-4 w-4" />
                                                                    Submit Application
                                                                </>
                                                            )}
                                                        </Button>
                                                    </DialogFooter>
                                                </>
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
                        {/* Founder Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Project Founder
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/profile/${project.founder.id}`} className="block group">
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 transition-all">
                                        <Avatar className="h-14 w-14 ring-2 ring-background">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${project.founder.id}`} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 font-semibold">
                                                {project.founder.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold group-hover:text-primary transition-colors">{project.founder.name}</p>
                                            <p className="text-sm text-muted-foreground">Founder & Creator</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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

                        {/* Share CTA */}
                        <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
                            <CardContent className="p-5 text-center space-y-3">
                                <Heart className="h-8 w-8 text-primary mx-auto" />
                                <p className="text-sm font-medium">Know someone who'd be a great fit?</p>
                                <Button variant="outline" className="gap-2 w-full">
                                    <Share2 className="h-4 w-4" />
                                    Share this Project
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
