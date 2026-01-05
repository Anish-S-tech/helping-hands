'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    ArrowLeft, MessageSquare, Github, Linkedin, Globe, Mail,
    MapPin, Calendar, Briefcase, Users, Shield, Package, CheckCircle
} from 'lucide-react';
import { MOCK_BUILDERS, MOCK_FOUNDERS, MOCK_PROJECTS } from '@/data/mock-data';

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
}

interface Project {
    id: string;
    title: string;
    status: string;
    skills_needed: string[];
}

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { profile: currentProfile, supabase, loading: authLoading } = useAuth();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const isOwnProfile = currentProfile?.id === params.id;

    useEffect(() => {
        if (!authLoading && !currentProfile) {
            router.push('/login');
            return;
        }
        if (params.id) {
            fetchProfile();
        }
    }, [currentProfile, authLoading, params.id]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            // Check Mocks first for specific IDs
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
                    bio: mockProfile.bio || 'Enterprise-tier contributor with high project completion velocity.',
                    role_type: mockProfile.role_type as 'user' | 'founder',
                    experience_level: (mockProfile.experience_years ?? 0) > 3 ? 'experienced' : 'fresher',
                    github_url: mockProfile.github_url || '',
                    linkedin_url: mockProfile.linkedin_url || '',
                    portfolio_url: '',
                    created_at: '2025-01-01T00:00:00Z'
                });

                // Mock projects
                if (mockProfile.role_type === 'founder') {
                    setProjects(MOCK_PROJECTS.slice(0, 3));
                } else {
                    setProjects(MOCK_PROJECTS.slice(3, 5));
                }
            } else {
                // Try DB
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center border border-border p-12 bg-surface-1 rounded-sm">
                    <Users className="w-12 h-12 text-muted mx-auto mb-4 stroke-[1px]" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-4">Registry Record Missing</h2>
                    <Link href="/explore" className="text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/30 px-4 py-2 hover:bg-accent/10 transition-all">
                        Back to Discovery
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header Background - Operational Grid */}
            <div className="h-64 bg-surface-1 border-b border-border relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="max-w-5xl mx-auto px-8 -mt-32 relative z-10 pb-24">
                {/* Back Button */}
                <Link
                    href={currentProfile?.role_type === 'founder' ? '/dashboard/founder' : '/explore'}
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground mb-6 transition-all"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Console / Back
                </Link>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Identity */}
                    <div className="col-span-4 space-y-6">
                        <div className="bg-surface-1 border border-border rounded-sm p-8 flex flex-col items-center text-center space-y-6">
                            <div className="relative">
                                <img
                                    src={profileData.avatar_url || `https://ui-avatars.com/api/?name=${profileData.name || 'U'}&background=3b82f6&color=fff&size=200`}
                                    alt={profileData.name}
                                    className="w-40 h-40 rounded-sm grayscale hover:grayscale-0 transition-all duration-700 border border-border p-1 bg-background"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-accent text-white p-1 rounded-sm">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-tighter mb-1">{profileData.name}</h1>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Verified Entity</p>
                            </div>

                            <div className="w-full pt-6 border-t border-border space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                                    <span>Authority</span>
                                    <span className={profileData.role_type === 'founder' ? 'text-blue-500' : 'text-green-500'}>
                                        {profileData.role_type}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                                    <span>Expertise</span>
                                    <span className="text-foreground">{profileData.experience_level}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                                    <span>Clearance</span>
                                    <span className="text-foreground">Level 4</span>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-2 pt-4">
                                {!isOwnProfile && (
                                    <button className="w-full flex items-center justify-center gap-2 bg-accent text-white h-10 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-500 transition-all">
                                        <MessageSquare className="w-3.5 h-3.5" /> Establish Link
                                    </button>
                                )}
                                {isOwnProfile && (
                                    <Link
                                        href="/profile/edit"
                                        className="w-full flex items-center justify-center gap-2 bg-surface-2 border border-border text-foreground h-10 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-1 transition-all"
                                    >
                                        Modify Parameters
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Social Matrix */}
                        <div className="bg-surface-1 border border-border rounded-sm p-6 space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-4">Social Matrix</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {profileData.github_url && (
                                    <a href={profileData.github_url} className="flex items-center gap-2 p-2 bg-surface-2 border border-border hover:border-accent transition-all text-[10px] font-bold uppercase tracking-tighter">
                                        <Github className="w-3.5 h-3.5" /> GitHub
                                    </a>
                                )}
                                {profileData.linkedin_url && (
                                    <a href={profileData.linkedin_url} className="flex items-center gap-2 p-2 bg-surface-2 border border-border hover:border-accent transition-all text-[10px] font-bold uppercase tracking-tighter">
                                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                )}
                                {profileData.portfolio_url && (
                                    <a href={profileData.portfolio_url} className="flex items-center gap-2 p-2 bg-surface-2 border border-border hover:border-accent transition-all text-[10px] font-bold uppercase tracking-tighter">
                                        <Globe className="w-3.5 h-3.5" /> Portfolio
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Projects */}
                    <div className="col-span-8 space-y-8">
                        {/* Summary Block */}
                        <div className="bg-surface-1 border border-border rounded-sm p-8">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted mb-6 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 bg-accent" /> Entity Summary
                            </h2>
                            <p className="text-sm font-medium leading-relaxed text-foreground/80 font-mono">
                                {profileData.bio || 'No operational summary provided. This entity maintains a low-profile architectural footprint.'}
                            </p>

                            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted block mb-1">Registration</span>
                                    <span className="text-[11px] font-mono font-bold">{getJoinedDate(profileData.created_at)}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted block mb-1">Missions</span>
                                    <span className="text-[11px] font-mono font-bold">{projects.length} Total</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted block mb-1">Status</span>
                                    <span className="text-[11px] font-bold text-green-500 uppercase">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Mission Log */}
                        <div className="bg-surface-1 border border-border rounded-sm overflow-hidden">
                            <div className="px-8 py-4 border-b border-border bg-surface-2/30 flex items-center justify-between">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted">Mission Log</h3>
                                <Package className="w-4 h-4 text-muted stroke-[1px]" />
                            </div>

                            <div className="divide-y divide-border/50">
                                {projects.length === 0 ? (
                                    <div className="p-12 text-center opacity-30">
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No Record of Mission Participation</p>
                                    </div>
                                ) : (
                                    projects.map((project) => (
                                        <Link
                                            key={project.id}
                                            href={`/projects/${project.id}`}
                                            className="block p-8 hover:bg-surface-2/50 transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-base font-bold uppercase tracking-tight group-hover:text-accent transition-colors">{project.title}</h4>
                                                <div className={`h-2 w-2 rounded-full ${project.status === 'open' ? 'bg-green-500' : project.status === 'in_progress' ? 'bg-yellow-500' : 'bg-slate-500'}`}></div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {project.skills_needed?.map((skill, i) => (
                                                    <span key={i} className="text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 border border-border bg-surface-2 text-muted">
                                                        {skill}
                                                    </span>
                                                ))}
                                                <div className="ml-auto text-[9px] font-bold uppercase tracking-widest text-muted group-hover:text-foreground transition-all">
                                                    View Intelligence ↗
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
