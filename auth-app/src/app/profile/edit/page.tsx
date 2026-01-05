'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    User, Mail, Github, Linkedin, Globe, Upload, Save, Loader2, Camera, Shield, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileProgressBar } from '@/components/ProfileProgressBar';
import { SkillsInput } from '@/components/SkillsInput';
import { toast } from '@/components/Toast';
import { MOCK_METRICS } from '@/data/mock-data';

export default function ProfileEditPage() {
    const router = useRouter();
    const { profile, updateProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        bio: profile?.bio || '',
        experience_level: profile?.experience_level || 'fresher',
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        portfolio_url: profile?.portfolio_url || '',
        avatar_url: profile?.avatar_url || '',
        skills: [] as string[],
    });

    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, avatar_url: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        setLoading(true);
        const { error } = await updateProfile({
            name: formData.name,
            bio: formData.bio || null,
            experience_level: formData.experience_level as 'fresher' | 'experienced',
            github_url: formData.github_url || null,
            linkedin_url: formData.linkedin_url || null,
            portfolio_url: formData.portfolio_url || null,
            avatar_url: formData.avatar_url || null,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Profile updated successfully!');
            router.push(profile?.role_type === 'founder' ? '/dashboard/founder' : '/dashboard/builder');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar-lite for Edit Context */}
            <aside className="w-64 border-r border-border bg-surface-1 hidden lg:flex flex-col fixed inset-y-0">
                <div className="p-6 space-y-8">
                    <div className="flex items-center gap-2 px-2">
                        <div className="h-5 w-5 bg-accent rounded-sm flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Helping Hands</span>
                    </div>

                    <div className="space-y-1">
                        <p className="px-2 text-[9px] font-bold text-muted uppercase tracking-widest mb-4">Configuration Sections</p>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-sm bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-widest">
                            <User className="w-4 h-4" /> Personal Core
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-muted hover:text-foreground hover:bg-surface-2 text-[11px] font-bold uppercase tracking-widest transition-all">
                            <Shield className="w-4 h-4" /> Security Alpha
                        </button>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <div className="p-4 bg-background border border-border rounded-sm space-y-3">
                            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Profile Completion</span>
                            <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-3/4" />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-accent">75% SECURED</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Console */}
            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="h-14 border-b border-border bg-surface-1/50 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/builder" className="text-muted hover:text-foreground transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Console / Profile / Parameters</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            size="sm"
                            className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest h-8 px-4"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                            Sync Parameters
                        </Button>
                    </div>
                </header>

                <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-border pb-4">Personal Core Data</h2>

                        {/* Avatar Sync */}
                        <div className="flex items-center gap-8 p-6 bg-surface-1 border border-border rounded-sm">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <img
                                    src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.name || 'U'}&background=3b82f6&color=fff&size=128`}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-sm grayscale group-hover:grayscale-0 transition-all border border-border p-1 bg-background"
                                />
                                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Camera className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted">Identity Asset</h3>
                                <p className="text-[11px] font-medium max-w-[200px] text-muted leading-tight">Sync your visual identity with the platform network.</p>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                {formData.avatar_url && (
                                    <button onClick={() => setFormData({ ...formData, avatar_url: '' })} className="text-[9px] font-bold text-red-500 uppercase tracking-widest border-b border-red-500/30">
                                        Purge Asset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1">Full Identity Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-11 bg-surface-1 border-border text-sm font-mono"
                                    placeholder="OPERATOR_NAME"
                                />
                            </div>
                            <div className="space-y-2 opacity-60">
                                <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1">Network Address (Immutable)</label>
                                <Input
                                    value={profile?.email || ''}
                                    disabled
                                    className="h-11 bg-surface-2 border-border text-sm font-mono cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1">Entity Summary (Bio)</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full bg-surface-1 border border-border rounded-sm py-3 px-4 text-sm font-mono placeholder-muted focus:outline-none focus:border-accent resize-none"
                                placeholder="// Describe your operational capabilities..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1">Experience Tier</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: 'fresher', label: 'Tier 1 (Fresher)', icon: '🌱' },
                                    { value: 'experienced', label: 'Tier 2 (Experienced)', icon: '💼' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFormData({ ...formData, experience_level: option.value as 'fresher' | 'experienced' })}
                                        className={`flex items-center gap-4 p-4 rounded-sm border transition-all ${formData.experience_level === option.value
                                            ? 'border-accent bg-accent/5'
                                            : 'border-border bg-surface-1 hover:bg-surface-2'
                                            }`}
                                    >
                                        <span className="text-xl grayscale">{option.icon}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pt-8 border-t border-border">
                        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-border pb-4">Specialization Matrix</h2>
                        <div className="bg-surface-1 border border-border rounded-sm p-6">
                            <SkillsInput
                                skills={formData.skills}
                                onChange={(skills) => setFormData({ ...formData, skills })}
                                maxSkills={15}
                            />
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mt-4">
                                // Key technologies indexed for project matching algorithms.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6 pt-8 border-t border-border pb-12">
                        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-border pb-4">Social Network Links</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Github className="w-3 h-3" /> GitHub Matrix
                                </label>
                                <Input
                                    type="url"
                                    value={formData.github_url}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                    className="h-10 bg-surface-1 border-border text-[11px] font-mono"
                                    placeholder="https://github.com/operator"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Linkedin className="w-3 h-3" /> LinkedIn Node
                                </label>
                                <Input
                                    type="url"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                    className="h-10 bg-surface-1 border-border text-[11px] font-mono"
                                    placeholder="https://linkedin.com/in/operator"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
