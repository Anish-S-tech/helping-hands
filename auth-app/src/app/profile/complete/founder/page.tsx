'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    Building2, Globe, Linkedin, Upload, Camera,
    ChevronRight, ChevronLeft, CheckCircle, Loader2, Package, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Step = 'basic' | 'company' | 'vision' | 'links';

const INDUSTRIES = [
    'Technology',
    'Finance / Fintech',
    'Healthcare',
    'Education / EdTech',
    'E-commerce',
    'SaaS',
    'AI / Machine Learning',
    'Blockchain / Web3',
    'Gaming',
    'Media / Entertainment',
    'Other'
];

const TEAM_SIZES = [
    { value: '1', label: 'Solo Founder', desc: 'Just me' },
    { value: '2-5', label: 'Small Team', desc: '2-5 people' },
    { value: '6-10', label: 'Growing Team', desc: '6-10 people' },
    { value: '11-25', label: 'Established', desc: '11-25 people' },
    { value: '26+', label: 'Scaling', desc: '26+ people' },
];

const FUNDING_STAGES = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B+',
    'Bootstrapped',
    'Not seeking funding'
];

export default function FounderProfileCompletePage() {
    const router = useRouter();
    const { profile, updateProfile, supabase } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<Step>('basic');

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
        company_name: '',
        company_website: '',
        industry: '',
        team_size: '1',
        founding_year: new Date().getFullYear().toString(),
        funding_stage: '',
        vision: '',
        linkedin_url: profile?.linkedin_url || '',
    });

    const steps: Step[] = ['basic', 'company', 'vision', 'links'];
    const currentStepIndex = steps.indexOf(step);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

    const handleNext = () => {
        setError('');

        if (step === 'basic' && !formData.name.trim()) {
            setError('Name is required');
            return;
        }

        if (step === 'company' && !formData.company_name.trim()) {
            setError('Company name is required');
            return;
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

    const handleComplete = async () => {
        setLoading(true);
        setError('');

        try {
            // Update profile
            const { error: profileError } = await updateProfile({
                name: formData.name,
                bio: formData.bio,
                avatar_url: formData.avatar_url,
                linkedin_url: formData.linkedin_url,
                profile_completed: true,
            });

            if (profileError) throw profileError;

            // Update founder details
            if (profile?.id) {
                await supabase
                    .from('founder_details')
                    .upsert({
                        profile_id: profile.id,
                        company_name: formData.company_name,
                        company_website: formData.company_website,
                        about_company: formData.vision,
                    });
            }

            router.push('/dashboard/founder');
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'basic':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">About You</h2>
                            <p className="text-sm text-muted-foreground">Let's start with your personal info</p>
                        </div>

                        {/* Avatar Upload */}
                        <div className="flex justify-center">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden group hover:border-primary transition-colors"
                            >
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name *</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                    placeholder="Jane Smith"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bio</label>
                                <textarea
                                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Tell us about yourself and your background..."
                                    value={formData.bio}
                                    onChange={(e) => updateFormData('bio', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'company':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">Company Details</h2>
                            <p className="text-sm text-muted-foreground">Tell us about your startup</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company/Project Name *</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={formData.company_name}
                                        onChange={(e) => updateFormData('company_name', e.target.value)}
                                        placeholder="Acme Inc."
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={formData.company_website}
                                        onChange={(e) => updateFormData('company_website', e.target.value)}
                                        placeholder="https://yourcompany.com"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Industry</label>
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => updateFormData('industry', e.target.value)}
                                        className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">Select industry</option>
                                        {INDUSTRIES.map(ind => (
                                            <option key={ind} value={ind}>{ind}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Founded</label>
                                    <Input
                                        type="number"
                                        value={formData.founding_year}
                                        onChange={(e) => updateFormData('founding_year', e.target.value)}
                                        placeholder="2024"
                                        min="2000"
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Team Size</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {TEAM_SIZES.map(size => (
                                        <button
                                            key={size.value}
                                            type="button"
                                            onClick={() => updateFormData('team_size', size.value)}
                                            className={`p-2 rounded-lg border text-center transition-all ${formData.team_size === size.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-muted-foreground'
                                                }`}
                                        >
                                            <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                            <div className="text-xs font-medium">{size.value}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'vision':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">Your Vision</h2>
                            <p className="text-sm text-muted-foreground">What are you building?</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">What is your company building?</label>
                                <textarea
                                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Describe your product or service, your mission, and what problem you're solving..."
                                    value={formData.vision}
                                    onChange={(e) => updateFormData('vision', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">This helps builders understand your project</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Funding Stage</label>
                                <div className="flex flex-wrap gap-2">
                                    {FUNDING_STAGES.map(stage => (
                                        <button
                                            key={stage}
                                            type="button"
                                            onClick={() => updateFormData('funding_stage', stage)}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.funding_stage === stage
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80'
                                                }`}
                                        >
                                            {stage}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'links':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">Your Links</h2>
                            <p className="text-sm text-muted-foreground">Connect your professional profiles</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </label>
                                <Input
                                    value={formData.linkedin_url}
                                    onChange={(e) => updateFormData('linkedin_url', e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="text-sm font-medium mb-2">You're almost done!</h4>
                                <p className="text-xs text-muted-foreground">
                                    After completing your profile, you'll be able to create projects and start finding talented builders for your team.
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </Link>
                    <Badge variant="premium" className="text-xs">Founder Profile</Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">Step {currentStepIndex + 1} of {steps.length}</span>
                        <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Main Card */}
                <div className="p-6 bg-card border rounded-xl space-y-6">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="min-h-[340px]">
                        {renderStepContent()}
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        {currentStepIndex > 0 && (
                            <Button variant="outline" onClick={handleBack} className="flex-1">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        )}
                        {currentStepIndex === steps.length - 1 ? (
                            <Button onClick={handleComplete} disabled={loading} className="flex-[2]">
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>Complete <CheckCircle className="ml-2 w-4 h-4" /></>
                                )}
                            </Button>
                        ) : (
                            <Button onClick={handleNext} className="flex-[2]">
                                Next <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => router.push('/dashboard/founder')}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors block mx-auto"
                >
                    Skip for now - complete later in settings
                </button>
            </div>
        </div>
    );
}
