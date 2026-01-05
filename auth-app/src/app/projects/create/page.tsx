'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    ArrowLeft, Rocket, Users, Code, CheckCircle,
    ChevronRight, ChevronLeft, Plus, X, Loader2,
    Shield, Globe, Briefcase, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/Toast';

type Step = 'details' | 'roles' | 'review';

const SECTORS = [
    'AI & Machine Learning',
    'SaaS & Enterprise',
    'FinTech',
    'HealthTech',
    'EdTech',
    'Web3 & Crypto',
    'E-commerce',
    'Open Source Tooling',
    'Cybersecurity',
    'Social Impact'
];

const COMMON_ROLES = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'UI/UX Designer',
    'Product Manager',
    'Mobile Developer',
    'AI/ML Engineer',
    'DevOps Engineer'
];

interface ProjectRole {
    title: string;
    skills: string[];
    count: number;
}

export default function CreateProjectPage() {
    const router = useRouter();
    const { profile, supabase, loading: authLoading } = useAuth();

    const [currentStep, setCurrentStep] = useState<Step>('details');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sector: '',
        vision: '',
        roles: [] as ProjectRole[]
    });

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login');
            return;
        }
        if (profile && profile.role_type !== 'founder') {
            router.push('/dashboard/builder');
        }
    }, [profile, authLoading, router]);

    const handleNext = () => {
        if (currentStep === 'details') {
            if (!formData.title || !formData.description || !formData.sector) {
                toast.error('Please fill in all required fields');
                return;
            }
            setCurrentStep('roles');
        } else if (currentStep === 'roles') {
            if (formData.roles.length === 0) {
                toast.error('Please add at least one role');
                return;
            }
            setCurrentStep('review');
        }
    };

    const handleBack = () => {
        if (currentStep === 'roles') setCurrentStep('details');
        else if (currentStep === 'review') setCurrentStep('roles');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Flatten roles and skills for the DB schema if needed, or store as JSON
            // Current schema has skills_needed as string[] and team_size_needed as number
            const allSkills = Array.from(new Set(formData.roles.flatMap(r => r.skills)));
            const totalTeamSize = formData.roles.reduce((acc, r) => acc + r.count, 0);

            const { data, error } = await supabase
                .from('projects')
                .insert({
                    founder_id: profile?.id,
                    title: formData.title,
                    description: formData.description,
                    sector: formData.sector,
                    vision: formData.vision,
                    skills_needed: allSkills,
                    team_size_needed: totalTeamSize,
                    status: 'open'
                })
                .select()
                .single();

            if (error) throw error;

            toast.success('Project published successfully!');
            router.push(`/projects/${data.id}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to create project');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-slate-200 selection:bg-blue-500/30">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/dashboard/founder"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Launch New Project</h1>
                            <p className="text-slate-400">Define your vision and recruit your dream team.</p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-4 mt-8">
                        {(['details', 'roles', 'review'] as const).map((step, idx) => (
                            <div key={step} className="flex items-center gap-4 flex-1">
                                <div className={`flex items-center gap-2 pb-2 border-b-2 transition-colors flex-1 ${currentStep === step ? 'border-blue-500 text-blue-500' :
                                        (idx < ['details', 'roles', 'review'].indexOf(currentStep) ? 'border-emerald-500/50 text-emerald-500/50' : 'border-slate-800 text-slate-500')
                                    }`}>
                                    <span className="text-xs font-bold uppercase tracking-widest">0{idx + 1}. {step}</span>
                                    {idx < ['details', 'roles', 'review'].indexOf(currentStep) && <CheckCircle className="w-3 h-3" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                    {currentStep === 'details' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Project Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                                        placeholder="e.g. Nexus Protocol"
                                    />
                                    <p className="text-[10px] text-slate-500 ml-1 uppercase tracking-wider">A catchy, professional name for your initiative</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Industry Sector</label>
                                    <select
                                        value={formData.sector}
                                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a sector</option>
                                        {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <p className="text-[10px] text-slate-500 ml-1 uppercase tracking-wider">Help builders find you by industry</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">One-Sentence Vision</label>
                                <input
                                    type="text"
                                    value={formData.vision}
                                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 font-medium italic"
                                    placeholder="Building the future of decentralized collaboration."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Project Description</label>
                                <textarea
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 resize-none leading-relaxed"
                                    placeholder="Explain your project goals, current progress, and why someone should join your team..."
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 'roles' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Build Your Team</h3>
                                <p className="text-slate-400 text-sm">Define the specific talent you need to move forward.</p>
                            </div>

                            <div className="space-y-6">
                                {formData.roles.map((role, rIdx) => (
                                    <div key={rIdx} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative group">
                                        <button
                                            onClick={() => setFormData({ ...formData, roles: formData.roles.filter((_, i) => i !== rIdx) })}
                                            className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role Title</label>
                                                <input
                                                    type="text"
                                                    value={role.title}
                                                    onChange={(e) => {
                                                        const newRoles = [...formData.roles];
                                                        newRoles[rIdx].title = e.target.value;
                                                        setFormData({ ...formData, roles: newRoles });
                                                    }}
                                                    className="w-full bg-transparent border-b border-slate-800 py-2 text-white focus:border-blue-500 focus:outline-none transition-colors"
                                                    placeholder="Frontend Lead"
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Required Skills</label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {role.skills.map((skill, sIdx) => (
                                                        <Badge key={sIdx} variant="secondary" className="bg-slate-800 text-slate-300 border-none px-3 py-1 flex items-center gap-2">
                                                            {skill}
                                                            <button onClick={() => {
                                                                const newRoles = [...formData.roles];
                                                                newRoles[rIdx].skills = role.skills.filter((_, i) => i !== sIdx);
                                                                setFormData({ ...formData, roles: newRoles });
                                                            }}><X className="w-3 h-3 hover:text-white" /></button>
                                                        </Badge>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        className="bg-transparent text-xs text-blue-400 placeholder:text-slate-700 focus:outline-none min-w-[120px]"
                                                        placeholder="+ Add Skill"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const val = (e.currentTarget as HTMLInputElement).value.trim();
                                                                if (val) {
                                                                    const newRoles = [...formData.roles];
                                                                    newRoles[rIdx].skills = [...newRoles[rIdx].skills, val];
                                                                    setFormData({ ...formData, roles: newRoles });
                                                                    (e.currentTarget as HTMLInputElement).value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setFormData({ ...formData, roles: [...formData.roles, { title: '', skills: [], count: 1 }] })}
                                    className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    Add Another Role
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 'review' && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Final Review</h3>
                                    <p className="text-slate-400 text-sm">Everything looks set for takeoff.</p>
                                </div>
                                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 px-4 py-1.5">RESERVED: FOUNDER DASHBOARD</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-6">
                                    <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Project Overview</h4>
                                        <h2 className="text-2xl font-bold text-white mb-2">{formData.title}</h2>
                                        <p className="text-blue-400 font-medium italic mb-4">"{formData.vision}"</p>
                                        <p className="text-slate-400 text-sm leading-relaxed">{formData.description}</p>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Requested Talent</h4>
                                        <div className="space-y-4">
                                            {formData.roles.map((role, idx) => (
                                                <div key={idx} className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-white">{role.title}</span>
                                                        <span className="text-xs text-slate-500">1 Position</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {role.skills.map((s, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400 uppercase tracking-tighter">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Security & Trust</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-emerald-500" />
                                                <span className="text-xs text-slate-300">Identity Verified</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-blue-500" />
                                                <span className="text-xs text-slate-300">Global Visibility</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="w-5 h-5 text-purple-500" />
                                                <span className="text-xs text-slate-300">Professional Only</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-600/10 rounded-2xl p-6 border border-blue-500/20">
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-blue-300 leading-relaxed">By publishing, your project will be instantly visible to over 2,000+ builders in our ecosystem.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-800">
                        <button
                            onClick={handleBack}
                            className={`flex items-center gap-2 text-slate-500 hover:text-white transition-colors py-3 px-6 ${currentStep === 'details' ? 'invisible' : ''}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        {currentStep === 'review' ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-10 py-6 rounded-2xl shadow-[0_10px_30px_-5px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        Publish Project
                                        <Rocket className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="bg-white text-black hover:bg-slate-200 font-bold px-8 py-6 rounded-2xl transition-all flex items-center gap-2"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
