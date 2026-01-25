'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    ArrowLeft,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
    Loader2,
    Shield,
    ChevronRight,
    BarChart3,
    Code,
    Package,
    MoreHorizontal,
    ExternalLink
} from 'lucide-react';
import { toast } from '@/components/Toast';
import { MOCK_PROJECTS, MOCK_ANNOUNCEMENTS, MOCK_ACTIVITY_TIMELINE, ProjectPhase } from '@/data/mock-data';
import { MainLayout } from '@/components/MainLayout'; // TODO: Removed legacy sidebar navigation
import { ProjectPhaseBadge } from '@/components/ProjectPhaseBadge';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { AnnouncementList } from '@/components/AnnouncementCard';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ProjectMember {
    id: string;
    status: 'pending' | 'accepted' | 'rejected';
    role: string;
    joined_at: string;
    user: {
        id: string;
        name: string;
        bio: string;
        role_type: string;
        avatar_url?: string;
    };
}

interface Project {
    id: string;
    title: string;
    description: string;
    vision: string;
    sector: string;
    skills_needed: string[];
    team_size_needed: number;
    status: 'open' | 'in_progress' | 'completed';
    created_at: string;
    founder: {
        id: string;
        user_id: string;
        name: string;
        bio: string;
        avatar_url?: string;
    };
    project_members: ProjectMember[];
    chat_rooms: { id: string }[];
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { profile, supabase, loading: authLoading } = useAuth();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [updating, setUpdating] = useState<string | null>(null);

    const isFounder = project?.founder?.user_id === profile?.user_id;
    const myMembership = project?.project_members?.find(m => m.user?.id === profile?.id);
    const acceptedMembers = project?.project_members?.filter(m => m.status === 'accepted') || [];
    const pendingMembers = project?.project_members?.filter(m => m.status === 'pending') || [];

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login/user');
            return;
        }
        if (params.id) {
            fetchProject();
        }
    }, [profile, authLoading, params.id, router]);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const mockProject = MOCK_PROJECTS.find(p => p.id === params.id);
            if (mockProject) {
                setProject({
                    ...mockProject,
                    founder: {
                        id: mockProject.founder.id,
                        user_id: mockProject.founder.id,
                        name: mockProject.founder.name,
                        bio: 'Enterprise Founder visioning the next-scaled architecture.'
                    },
                    project_members: [
                        {
                            id: 'm1',
                            status: 'accepted',
                            role: 'Core Contributor',
                            joined_at: '2025-12-25T10:00:00Z',
                            user: { id: 'u1', name: 'Alex Rivera', bio: 'Full-stack lead.', role_type: 'builder' }
                        },
                        {
                            id: 'm2',
                            status: 'pending',
                            role: 'Technical Analyst',
                            joined_at: '2026-01-01T14:30:00Z',
                            user: { id: 'u2', name: 'Sarah Chen', bio: 'AI Specialist.', role_type: 'builder' }
                        }
                    ],
                    chat_rooms: [{ id: 'r1' }]
                } as unknown as Project);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    founder:profiles!projects_founder_id_fkey (
                        id,
                        user_id,
                        name,
                        bio
                    ),
                    project_members (
                        id,
                        status,
                        role,
                        joined_at,
                        user:profiles!project_members_user_id_fkey (
                            id,
                            name,
                            bio,
                            role_type
                        )
                    ),
                    chat_rooms (
                        id
                    )
                `)
                .eq('id', params.id)
                .single();

            if (data) {
                setProject(data as unknown as Project);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRequest = async () => {
        if (!profile) return;
        setJoining(true);

        try {
            const { error } = await supabase
                .from('project_members')
                .insert({
                    project_id: params.id,
                    user_id: profile.id,
                    status: 'pending',
                });

            if (error) throw error;
            toast.success('Access Request Submitted');
            await fetchProject();
        } catch (error: any) {
            toast.error(error.message || 'Access Request Failed');
        } finally {
            setJoining(false);
        }
    };

    const handleMemberAction = async (memberId: string, action: 'accepted' | 'rejected') => {
        setUpdating(memberId);

        try {
            const { error } = await supabase
                .from('project_members')
                .update({ status: action })
                .eq('id', memberId);

            if (error) throw error;
            toast.success(`Operational Status: ${action.toUpperCase()}`);
            await fetchProject();
        } catch (error: any) {
            toast.error(error.message || 'Transaction Failed');
        } finally {
            setUpdating(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <MainLayout>
            <div className="space-y-8 max-w-6xl">
                {/* Navigation & Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="-ml-2 h-8 px-2" asChild>
                        <Link href={isFounder ? '/dashboard/founder' : '/explore'}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Copy Resource Identifier</DropdownMenuItem>
                                <DropdownMenuItem>Report Anomaly</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="secondary" className="px-2 py-0 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                                    {project.sector}
                                </Badge>
                                <ProjectPhaseBadge phase={(project as any).phase as ProjectPhase || 'active'} />
                                <div className="h-1 w-1 rounded-full bg-border" />
                                <span className="text-xs text-muted-foreground font-medium">Node_{project.id.slice(0, 8)}</span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl italic">
                                "{project.vision || 'Strategic project deployment under standard operational parameters.'}"
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y">
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Founder</p>
                                <p className="text-sm font-semibold">{project.founder.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Created</p>
                                <p className="text-sm font-semibold">{new Date(project.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Saturation</p>
                                <p className="text-sm font-semibold">{acceptedMembers.length + 1} / {project.team_size_needed}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                                <div className="flex items-center gap-1.5 font-semibold text-sm capitalize">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    {project.status}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" /> Operational Objective
                            </h3>
                            <div className="bg-card/50 border rounded-lg p-6">
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Code className="h-5 w-5 text-primary" /> Technical Requirements
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.skills_needed?.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="px-3 py-1 font-medium bg-muted/50 border-transparent">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Founder Specific - Applications */}
                        {isFounder && pendingMembers.length > 0 && (
                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-bold text-yellow-500 flex items-center gap-2">
                                    <Clock className="h-5 w-5" /> Pending Access Requests
                                </h3>
                                <div className="grid gap-3">
                                    {pendingMembers.map((member) => (
                                        <Card key={member.id} className="bg-yellow-500/5 border-yellow-500/20">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback>{member.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold">{member.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{member.user.role_type} • {member.user.bio}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleMemberAction(member.id, 'rejected')}
                                                        disabled={updating === member.id}
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                                                        onClick={() => handleMemberAction(member.id, 'accepted')}
                                                        disabled={updating === member.id}
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" /> Active Personnel
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-primary opacity-50" />
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Mission Lead</p>
                                            <p className="text-sm font-bold">{project.founder.name}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                {acceptedMembers.map((member) => (
                                    <Card key={member.id}>
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-[10px]">{member.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{member.role || member.user.role_type || 'Operator'}</p>
                                                <p className="text-sm font-bold">{member.user.name}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Announcements Section */}
                        {MOCK_ANNOUNCEMENTS.filter(a => a.project_id === params.id).length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" /> Team Announcements
                                </h3>
                                <AnnouncementList
                                    announcements={MOCK_ANNOUNCEMENTS}
                                    projectId={params.id as string}
                                    maxItems={3}
                                />
                            </div>
                        )}

                        {/* Activity Timeline Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" /> Activity Timeline
                            </h3>
                            <div className="bg-card/50 border rounded-lg p-6">
                                <ActivityTimeline
                                    activities={MOCK_ACTIVITY_TIMELINE.filter(a => a.project_id === params.id)}
                                    maxItems={8}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Controls */}
                    <div className="lg:col-span-4">
                        <Card className="sticky top-8 shadow-xl border-t-4 border-t-primary">
                            <CardHeader>
                                <CardTitle className="text-base font-bold uppercase tracking-wider">Mission Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className="text-muted-foreground">Capacity</span>
                                        <span className="text-primary">{Math.round(((acceptedMembers.length + 1) / project.team_size_needed) * 100)}%</span>
                                    </div>
                                    <Progress value={((acceptedMembers.length + 1) / project.team_size_needed) * 100} className="h-2" />
                                    <p className="text-[10px] text-muted-foreground text-center pt-1 uppercase font-bold tracking-widest">
                                        {acceptedMembers.length + 1} of {project.team_size_needed} nodes filled
                                    </p>
                                </div>

                                <div className="pt-4 space-y-3">
                                    {(isFounder || myMembership?.status === 'accepted') ? (
                                        <Button className="w-full h-12 font-bold uppercase tracking-widest" asChild>
                                            <Link href={`/chat/${project.chat_rooms?.[0]?.id || 'hub'}`}>
                                                <MessageSquare className="mr-2 h-4 w-4" /> Open Command Hub
                                            </Link>
                                        </Button>
                                    ) : myMembership?.status === 'pending' ? (
                                        <Button disabled className="w-full h-12 font-bold uppercase tracking-widest opacity-80">
                                            <Clock className="mr-2 h-4 w-4 animate-pulse" /> Review in Progress
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full h-12 font-bold uppercase tracking-widest"
                                            onClick={handleJoinRequest}
                                            disabled={joining || project.status !== 'open'}
                                        >
                                            {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Request Mission Access"}
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 border-t py-4 justify-center">
                                <div className="flex flex-col items-center gap-1 opacity-50 grayscale">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-center">
                                        Authorization: Verified<br />
                                        Protocol: Secure-TLS
                                    </p>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
