'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import {
    ArrowLeft,
    MessageSquare,
    Github,
    Linkedin,
    Globe,
    Mail,
    MapPin,
    Calendar,
    Briefcase,
    Users,
    Shield,
    CheckCircle,
    ExternalLink,
    Star,
    TrendingUp,
    Award,
    Zap,
    ChevronRight,
    Edit,
    Share2,
    Heart
} from 'lucide-react';
import { MOCK_BUILDERS, MOCK_FOUNDERS, MOCK_PROJECTS, type Project } from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProfileData {
    id: string;
    user_id: string;
    name: string;
    email: string;
    avatar_url: string;
    bio: string;
    role_type: 'user' | 'founder';
    experience_level: 'fresher' | 'experienced';
    github_url: string;
    linkedin_url: string;
    portfolio_url: string;
    created_at: string;
    skills?: string[];
}

interface ProjectData {
    id: string;
    title: string;
    status: string;
    skills_needed: string[];
    sector?: string;
    description?: string;
}

// Image mapping for projects
const PROJECT_IMAGE_MAP: Record<string, string> = {
    p1: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
    p2: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
    p3: 'https://images.pexels.com/photos/3730760/pexels-photo-3730760.jpeg?auto=compress&cs=tinysrgb&w=800',
    p4: 'https://images.pexels.com/photos/8370755/pexels-photo-8370755.jpeg?auto=compress&cs=tinysrgb&w=800',
    p5: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800',
};

function getProjectImage(projectId: string): string {
    if (PROJECT_IMAGE_MAP[projectId]) return PROJECT_IMAGE_MAP[projectId];
    return 'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=800';
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

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { profile: currentProfile, supabase, loading: authLoading } = useAuth();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    const isOwnProfile = currentProfile?.id === params.id;

    useEffect(() => {
        if (!authLoading && !currentProfile) {
            router.push('/auth');
            return;
        }
        if (params.id) {
            fetchProfile();
        }
    }, [currentProfile, authLoading, params.id]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const mockBuilder = MOCK_BUILDERS.find(b => b.id === params.id);
            const mockFounder = MOCK_FOUNDERS.find(f => f.id === params.id);
            const mockProfile = mockBuilder || mockFounder;

            if (mockProfile) {
                setProfileData({
                    id: mockProfile.id,
                    user_id: mockProfile.id,
                    name: mockProfile.full_name,
                    email: `${mockProfile.full_name.toLowerCase().replace(' ', '.')}@example.com`,
                    avatar_url: mockProfile.avatar_url,
                    bio: mockProfile.bio || 'Passionate about building great products and solving challenging problems.',
                    role_type: mockProfile.role_type as 'user' | 'founder',
                    experience_level: (mockProfile.experience_years ?? 0) > 3 ? 'experienced' : 'fresher',
                    github_url: mockProfile.github_url || '',
                    linkedin_url: mockProfile.linkedin_url || '',
                    portfolio_url: '',
                    created_at: '2025-01-01T00:00:00Z',
                    skills: ['React', 'TypeScript', 'Node.js'],
                });

                if (mockProfile.role_type === 'founder') {
                    setProjects(MOCK_PROJECTS.slice(0, 3).map(p => ({
                        id: p.id,
                        title: p.title,
                        status: p.status,
                        skills_needed: p.skills_needed,
                        sector: p.sector,
                        description: p.description,
                    })));
                } else {
                    setProjects(MOCK_PROJECTS.slice(3, 6).map(p => ({
                        id: p.id,
                        title: p.title,
                        status: p.status,
                        skills_needed: p.skills_needed,
                        sector: p.sector,
                        description: p.description,
                    })));
                }
            } else {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (profile) {
                    setProfileData({
                        ...profile,
                        role_type: profile.role_type === 'founder' ? 'founder' : 'user'
                    });

                    if (profile.role_type === 'founder') {
                        const { data: founderProjects } = await supabase
                            .from('projects')
                            .select('id, title, status, skills_needed')
                            .eq('founder_id', profile.id);
                        if (founderProjects) setProjects(founderProjects as any[]);
                    } else {
                        const { data: memberProjects } = await supabase
                            .from('project_members')
                            .select('project:projects(id, title, status, skills_needed)')
                            .eq('user_id', profile.id)
                            .eq('status', 'accepted');
                        if (memberProjects) setProjects((memberProjects as any[]).map(m => m.project));
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const getJoinedDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    if (authLoading || loading) {
        return (
            <MainLayout>
                <div className="max-w-6xl mx-auto space-y-8">
                    <Skeleton className="h-80 w-full rounded-2xl" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
                    </div>
                    <Skeleton className="h-48 w-full" />
                </div>
            </MainLayout>
        );
    }

    if (!profileData) {
        return (
            <MainLayout>
                <div className="max-w-6xl mx-auto">
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
                                <Users className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h1 className="text-2xl font-bold mb-3">Profile Not Found</h1>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                The profile you're looking for doesn't exist or has been removed.
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

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Back Button */}
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-2xl border border-border/50">
                    {/* Cover Image / Gradient */}
                    <div className="relative h-48 md:h-56 w-full bg-gradient-to-br from-primary/20 via-violet-500/10 to-emerald-500/10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.3),_transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.2),_transparent_50%)]" />
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                                backgroundSize: '24px 24px'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button variant="secondary" size="icon" className="h-9 w-9 backdrop-blur-md bg-background/80">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="relative px-6 md:px-8 pb-8 -mt-16 md:-mt-20">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-background border-4 border-background shadow-xl">
                                    <AvatarImage
                                        src={profileData.avatar_url || `https://ui-avatars.com/api/?name=${profileData.name || 'U'}&background=3b82f6&color=fff&size=200`}
                                        alt={profileData.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-violet-500 text-white">
                                        {profileData.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 pt-4 md:pt-8">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{profileData.name}</h1>
                                            <Badge
                                                variant={profileData.role_type === 'founder' ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {profileData.role_type === 'founder' ? 'Founder' : 'Builder'}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {profileData.experience_level === 'experienced' ? 'Experienced' : 'Rising Star'}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground max-w-2xl">{profileData.bio}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                Joined {getJoinedDate(profileData.created_at)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Briefcase className="h-4 w-4" />
                                                {projects.length} Projects
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 shrink-0">
                                        {isOwnProfile ? (
                                            <Button className="gap-2" asChild>
                                                <Link href="/profile/edit">
                                                    <Edit className="h-4 w-4" />
                                                    Edit Profile
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button className="gap-2 shadow-lg shadow-primary/20">
                                                <MessageSquare className="h-4 w-4" />
                                                Send Message
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Briefcase}
                        label="Projects"
                        value={projects.length}
                        color="bg-primary/10 text-primary"
                    />
                    <StatCard
                        icon={Star}
                        label="Contributions"
                        value={12}
                        color="bg-amber-500/10 text-amber-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Reputation"
                        value="92%"
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <StatCard
                        icon={Award}
                        label="Experience"
                        value={profileData.experience_level === 'experienced' ? '3+ years' : '1-2 years'}
                        color="bg-violet-500/10 text-violet-500"
                    />
                </section>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Skills */}
                        {profileData.skills && profileData.skills.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-primary" />
                                        Skills & Expertise
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.skills.map(skill => (
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
                        )}

                        {/* Projects */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-violet-500" />
                                    {profileData.role_type === 'founder' ? 'Projects Created' : 'Projects Contributed'}
                                    <Badge variant="secondary" className="ml-2">{projects.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {projects.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                        <p>No projects yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {projects.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={`/projects/${project.id}`}
                                                className="block group"
                                            >
                                                <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all">
                                                    <div className="relative h-20 w-28 rounded-lg overflow-hidden shrink-0">
                                                        <Image
                                                            src={getProjectImage(project.id)}
                                                            alt={project.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                                    {project.title}
                                                                </h3>
                                                                {project.sector && (
                                                                    <Badge variant="outline" className="mt-1 text-[10px]">{project.sector}</Badge>
                                                                )}
                                                            </div>
                                                            <Badge
                                                                variant={project.status === 'open' ? 'active' : project.status === 'in-progress' ? 'warning' : 'outline'}
                                                                className="shrink-0 text-[10px]"
                                                            >
                                                                {project.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {project.skills_needed?.slice(0, 3).map((skill, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors self-center shrink-0" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Contact & Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Connect
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {profileData.github_url && (
                                    <a
                                        href={profileData.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                    >
                                        <Github className="h-5 w-5" />
                                        <span className="flex-1 text-sm font-medium">GitHub</span>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </a>
                                )}
                                {profileData.linkedin_url && (
                                    <a
                                        href={profileData.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                    >
                                        <Linkedin className="h-5 w-5 text-blue-600" />
                                        <span className="flex-1 text-sm font-medium">LinkedIn</span>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </a>
                                )}
                                {profileData.portfolio_url && (
                                    <a
                                        href={profileData.portfolio_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                    >
                                        <Globe className="h-5 w-5 text-emerald-500" />
                                        <span className="flex-1 text-sm font-medium">Portfolio</span>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </a>
                                )}
                                {profileData.email && (
                                    <a
                                        href={`mailto:${profileData.email}`}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                    >
                                        <Mail className="h-5 w-5 text-amber-500" />
                                        <span className="flex-1 text-sm font-medium truncate">{profileData.email}</span>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </a>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Profile Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Role</span>
                                    <Badge variant={profileData.role_type === 'founder' ? 'default' : 'secondary'}>
                                        {profileData.role_type === 'founder' ? 'Founder' : 'Builder'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Experience</span>
                                    <Badge variant="outline">
                                        {profileData.experience_level === 'experienced' ? 'Experienced' : 'Fresher'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge variant="active" className="gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                                        Active
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Verified</span>
                                    <div className="flex items-center gap-1 text-emerald-500">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="text-xs font-medium">Yes</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Connect CTA */}
                        {!isOwnProfile && (
                            <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
                                <CardContent className="p-5 text-center space-y-3">
                                    <Heart className="h-8 w-8 text-primary mx-auto" />
                                    <p className="text-sm font-medium">Interested in working together?</p>
                                    <Button className="gap-2 w-full">
                                        <MessageSquare className="h-4 w-4" />
                                        Start Conversation
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
