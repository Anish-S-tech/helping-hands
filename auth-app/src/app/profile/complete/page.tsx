'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    User, Briefcase, Link as LinkIcon, Upload, Phone, Loader2,
    ChevronRight, ChevronLeft, CheckCircle, Github, Linkedin, Globe,
    Building2, Rocket, Award, ShieldCheck, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SkillsInput } from '@/components/SkillsInput';
import { VerificationBadge } from '@/components/VerificationBadge';

type Step = 'basic' | 'professional' | 'links' | 'media' | 'verify';

export default function ProfileCompletePage() {
    const router = useRouter();
    const { profile, updateProfile, sendOTP, isFounder } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State for Founder/Builder separation
    const [step, setStep] = useState<Step>('basic');
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        role: '',
        bio: profile?.bio || '',
        experience_level: 'fresher' as 'fresher' | 'experienced',
        skills: [] as string[],
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        portfolio_url: profile?.portfolio_url || '',
        avatar_url: profile?.avatar_url || '',
        phone: profile?.phone || '',
        // Founder specific
        company_name: '',
        vision: '',
    });

    // Define steps based on role
    const getSteps = (): Step[] => {
        if (isFounder) {
            return ['basic', 'professional', 'links', 'verify'];
        }
        return ['basic', 'professional', 'links', 'media', 'verify'];
    };

    const steps = getSteps();
    const currentStepIndex = steps.indexOf(step);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        setError('');

        // Validation per step
        if (step === 'basic') {
            if (!formData.name.trim()) {
                setError('Full name is required');
                return;
            }
            if (!formData.role.trim()) {
                setError('Role is required');
                return;
            }
        }

        if (step === 'professional' && isFounder) {
            if (!formData.company_name.trim()) {
                setError('Project name is required');
                return;
            }
        }

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setStep(steps[nextIndex]);
        }
    };

    const handleBack = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setStep(steps[prevIndex]);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            updateFormData('avatar_url', reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleComplete = async () => {
        setLoading(true);
        setError('');

        const { error } = await updateProfile({
            ...formData,
            profile_completed: true,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push(isFounder ? '/dashboard/founder' : '/dashboard/builder');
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'basic':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Basic Information</h2>
                            <p className="text-sm text-muted">Let's start with the essentials</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                    placeholder="John Doe"
                                    className="bg-surface-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                                    {isFounder ? 'Your Role (e.g. CEO, Product Lead)' : 'Primary Role (e.g. Frontend Dev, UI Designer)'}
                                </label>
                                <Input
                                    value={formData.role}
                                    onChange={(e) => updateFormData('role', e.target.value)}
                                    placeholder={isFounder ? "CEO" : "Frontend Developer"}
                                    className="bg-surface-2"
                                />
                            </div>
                            <div className="space-y-2 text-sm text-muted">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted inline-block mb-1">Brief Bio</label>
                                <textarea
                                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/20 min-h-[100px] resize-none"
                                    placeholder="Tell us a bit about yourself..."
                                    value={formData.bio}
                                    onChange={(e) => updateFormData('bio', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'professional':
                return isFounder ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Startup Details</h2>
                            <p className="text-sm text-muted">Tell us about your project</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">Startup/Project Name</label>
                                <Input
                                    value={formData.company_name}
                                    onChange={(e) => updateFormData('company_name', e.target.value)}
                                    placeholder="Acme Corp"
                                    className="bg-surface-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted inline-block mb-1">Vision Statement</label>
                                <textarea
                                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/20 min-h-[120px] resize-none"
                                    placeholder="What is the final goal of your project?"
                                    value={formData.vision}
                                    onChange={(e) => updateFormData('vision', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Professional Background</h2>
                            <p className="text-sm text-muted">Help founders find your expertise</p>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">Experience Level</label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <button
                                        onClick={() => updateFormData('experience_level', 'fresher')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${formData.experience_level === 'fresher' ? 'border-accent bg-accent/5' : 'border-border bg-surface-2 hover:border-muted'}`}
                                    >
                                        <Award className={`w-5 h-5 mb-2 ${formData.experience_level === 'fresher' ? 'text-accent' : 'text-muted'}`} />
                                        <span className="text-xs font-medium">Fresher</span>
                                    </button>
                                    <button
                                        onClick={() => updateFormData('experience_level', 'experienced')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${formData.experience_level === 'experienced' ? 'border-accent bg-accent/5' : 'border-border bg-surface-2 hover:border-muted'}`}
                                    >
                                        <Briefcase className={`w-5 h-5 mb-2 ${formData.experience_level === 'experienced' ? 'text-accent' : 'text-muted'}`} />
                                        <span className="text-xs font-medium">Experienced</span>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted inline-block mb-1">Skills & Technologies</label>
                                <SkillsInput
                                    skills={formData.skills}
                                    onChange={(skills) => updateFormData('skills', skills)}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'links':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Social Presence</h2>
                            <p className="text-sm text-muted">Connect your professional platforms</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted flex items-center gap-2">
                                    <Linkedin className="w-3 h-3" /> LinkedIn URL
                                </label>
                                <Input
                                    value={formData.linkedin_url}
                                    onChange={(e) => updateFormData('linkedin_url', e.target.value)}
                                    placeholder="https://linkedin.com/in/..."
                                    className="bg-surface-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted flex items-center gap-2">
                                    <Github className="w-3 h-3" /> GitHub URL
                                </label>
                                <Input
                                    value={formData.github_url}
                                    onChange={(e) => updateFormData('github_url', e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="bg-surface-2"
                                />
                            </div>
                            {!isFounder && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Portfolio URL (Recommended)
                                    </label>
                                    <Input
                                        value={formData.portfolio_url}
                                        onChange={(e) => updateFormData('portfolio_url', e.target.value)}
                                        placeholder="https://..."
                                        className="bg-surface-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'media':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Profile Identity</h2>
                            <p className="text-sm text-muted">A professional photo increases trust</p>
                        </div>
                        <div className="py-8 flex flex-col items-center">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-32 h-32 rounded-full border border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden group hover:border-accent transition-colors bg-surface-1"
                            >
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <Camera className="w-8 h-8 text-muted group-hover:text-accent transition-colors" />
                                        <span className="text-[10px] uppercase font-bold text-muted">Upload</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            {formData.avatar_url && (
                                <button onClick={() => updateFormData('avatar_url', '')} className="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors">
                                    Remove Photo
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'verify':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Security Check</h2>
                            <p className="text-sm text-muted">Final step to secure your account</p>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 bg-surface-2 border border-border rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-surface-1 rounded-lg border border-border">
                                            <ShieldCheck className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Phone Verification</p>
                                            <p className="text-xs text-muted">Used for critical account actions</p>
                                        </div>
                                    </div>
                                    <VerificationBadge type="phone" verified={false} size="sm" showLabel={false} />
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => updateFormData('phone', e.target.value)}
                                        placeholder="+1 234 567 890"
                                        className="bg-surface-1"
                                    />
                                    <Button variant="outline" size="sm" className="h-10">Send OTP</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-background to-background">
            <div className="w-full max-w-[480px] space-y-8">
                {/* Progress Header */}
                <div className="space-y-4 mb-2">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex gap-1.5">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-500 ${i <= currentStepIndex ? 'w-8 bg-accent' : 'w-4 bg-border'}`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                            Step {currentStepIndex + 1} of {steps.length}
                        </span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="p-8 bg-surface-1 border border-border rounded-2xl shadow-2xl space-y-8 relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-xs text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="min-h-[300px]">
                        {renderStepContent()}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border/50">
                        {currentStepIndex > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                className="flex-1 h-11 border-border hover:bg-surface-2"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        )}
                        {currentStepIndex === steps.length - 1 ? (
                            <Button
                                onClick={handleComplete}
                                isLoading={loading}
                                className="flex-[2] h-11 bg-accent hover:bg-accent/90 text-white font-medium"
                            >
                                Complete Profile <CheckCircle className="ml-2 w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="flex-[2] h-11 bg-accent hover:bg-accent/90 text-white font-medium"
                            >
                                Next Step <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <button onClick={() => router.push('/')} className="text-[10px] text-muted hover:text-foreground uppercase tracking-widest transition-colors font-bold">
                        Skip for now • Complete later in settings
                    </button>
                </div>
            </div>
        </div>
    );
}
