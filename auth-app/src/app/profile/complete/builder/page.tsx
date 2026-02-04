'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    User, Briefcase, Github, Linkedin, Globe, Upload, Camera,
    ChevronRight, ChevronLeft, CheckCircle, Loader2, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SkillsInput } from '@/components/SkillsInput';
import Link from 'next/link';

type Step = 'basic' | 'skills' | 'links' | 'availability';

const EXPERIENCE_LEVELS = [
    { value: 'entry', label: 'Entry Level', desc: '0-2 years' },
    { value: 'mid', label: 'Mid Level', desc: '2-5 years' },
    { value: 'senior', label: 'Senior', desc: '5+ years' },
];

const AVAILABILITY_OPTIONS = [
    { value: 'available', label: 'Available', desc: 'Actively looking for projects' },
    { value: 'open', label: 'Open to Offers', desc: 'Not actively looking but open' },
    { value: 'not_available', label: 'Not Available', desc: 'Not looking right now' },
];

const PROJECT_TYPES = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Equity/Co-founder'
];

export default function BuilderProfileCompletePage() {
    const router = useRouter();
    const { profile, updateProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<Step>('basic');

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
        experience_level: 'entry',
        skills: [] as string[],
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        portfolio_url: profile?.portfolio_url || '',
        availability: 'available',
        project_types: [] as string[]
    });

    const steps: Step[] = ['basic', 'skills', 'links', 'availability'];
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

        const { error } = await updateProfile({
            name: formData.name,
            bio: formData.bio,
            avatar_url: formData.avatar_url,
            experience_level: formData.experience_level as any,
            github_url: formData.github_url,
            linkedin_url: formData.linkedin_url,
            portfolio_url: formData.portfolio_url,
            profile_completed: true,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard/builder');
        }
    };

    const toggleProjectType = (type: string) => {
        const types = formData.project_types.includes(type)
            ? formData.project_types.filter(t => t !== type)
            : [...formData.project_types, type];
        updateFormData('project_types', types);
    };

    const renderStepContent = () => {
        switch (step) {
            case 'basic':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">About You</h2>
                            <p className="text-sm text-muted-foreground">Let's start with the basics</p>
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
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bio</label>
                                <textarea
                                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                                    value={formData.bio}
                                    onChange={(e) => updateFormData('bio', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'skills':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">Skills & Experience</h2>
                            <p className="text-sm text-muted-foreground">Help founders find your expertise</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Experience Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {EXPERIENCE_LEVELS.map(level => (
                                    <button
                                        key={level.value}
                                        type="button"
                                        onClick={() => updateFormData('experience_level', level.value)}
                                        className={`p-4 rounded-lg border text-center transition-all ${formData.experience_level === level.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-muted-foreground'
                                            }`}
                                    >
                                        <div className="text-sm font-medium">{level.label}</div>
                                        <div className="text-xs text-muted-foreground">{level.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Skills & Technologies</label>
                            <SkillsInput
                                skills={formData.skills}
                                onChange={(skills) => updateFormData('skills', skills)}
                            />
                            <p className="text-xs text-muted-foreground">Add your technical skills, tools, and frameworks</p>
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
                                    <Github className="w-4 h-4" /> GitHub
                                </label>
                                <Input
                                    value={formData.github_url}
                                    onChange={(e) => updateFormData('github_url', e.target.value)}
                                    placeholder="https://github.com/username"
                                />
                            </div>

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

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Portfolio Website
                                </label>
                                <Input
                                    value={formData.portfolio_url}
                                    onChange={(e) => updateFormData('portfolio_url', e.target.value)}
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'availability':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">Availability</h2>
                            <p className="text-sm text-muted-foreground">Let founders know when you're available</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Current Status</label>
                            <div className="space-y-2">
                                {AVAILABILITY_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => updateFormData('availability', option.value)}
                                        className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-3 ${formData.availability === option.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-muted-foreground'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${option.value === 'available' ? 'bg-green-500' :
                                                option.value === 'open' ? 'bg-yellow-500' : 'bg-muted'
                                            }`} />
                                        <div>
                                            <div className="text-sm font-medium">{option.label}</div>
                                            <div className="text-xs text-muted-foreground">{option.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Preferred Project Types</label>
                            <div className="flex flex-wrap gap-2">
                                {PROJECT_TYPES.map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleProjectType(type)}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.project_types.includes(type)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-lg space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                            <Package className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </Link>
                    <Badge variant="secondary" className="text-xs bg-primary/10 border-primary/20 text-primary">Builder Profile</Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">Step {currentStepIndex + 1} of {steps.length}</span>
                        <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 shadow-sm"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Main Card */}
                <div className="p-6 bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl shadow-xl space-y-6">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="min-h-[320px]">
                        {renderStepContent()}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border/50">
                        {currentStepIndex > 0 && (
                            <Button variant="outline" onClick={handleBack} className="flex-1 hover:bg-primary/5 hover:border-primary/30 transition-all">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        )}
                        {currentStepIndex === steps.length - 1 ? (
                            <Button onClick={handleComplete} disabled={loading} className="flex-[2] shadow-md hover:shadow-lg transition-all">
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>Complete <CheckCircle className="ml-2 w-4 h-4" /></>
                                )}
                            </Button>
                        ) : (
                            <Button onClick={handleNext} className="flex-[2] shadow-md hover:shadow-lg transition-all">
                                Next <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => router.push('/dashboard/builder')}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors block mx-auto font-medium hover:underline"
                >
                    Skip for now - complete later in settings
                </button>
            </div>
        </div>
    );
}
