'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    User, Mail, Github, Linkedin, Globe, Upload, Save, Loader2, Camera,
    ArrowLeft, CheckCircle, Sparkles, Link2, Briefcase, GraduationCap
} from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SkillsInput } from '@/components/SkillsInput';
import { toast } from '@/components/Toast';
import { cn } from '@/lib/utils';

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

    // Calculate profile completion
    const calculateCompletion = () => {
        let score = 0;
        if (formData.name) score += 20;
        if (formData.bio) score += 20;
        if (formData.avatar_url) score += 20;
        if (formData.github_url || formData.linkedin_url) score += 20;
        if (formData.skills.length > 0) score += 20;
        return score;
    };

    const completionScore = calculateCompletion();

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
            router.push(profile?.role_type === 'founder' ? '/founder/home' : '/builder/home');
        }
        setLoading(false);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
                            <p className="text-sm text-muted-foreground">Update your profile information</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={loading} className="gap-2 shadow-lg shadow-primary/20">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>

                {/* Profile Completion */}
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-lg">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Profile Completion</h3>
                                    <p className="text-sm text-muted-foreground">Complete your profile to get better matches</p>
                                </div>
                            </div>
                            <Badge variant={completionScore === 100 ? 'active' : 'secondary'} className="text-sm px-3 py-1">
                                {completionScore}%
                            </Badge>
                        </div>
                        <Progress value={completionScore} className="h-2" />
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Avatar */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Profile Photo</CardTitle>
                            <CardDescription>Upload a professional photo</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center">
                            <div
                                className="relative group cursor-pointer mb-4"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                                    <AvatarImage
                                        src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.name || 'U'}&background=3b82f6&color=fff&size=200`}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-violet-500 text-white">
                                        {(formData.name || 'U').substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                                {formData.avatar_url && (
                                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Photo
                            </Button>
                            {formData.avatar_url && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, avatar_url: '' })}
                                    className="mt-2 text-destructive hover:text-destructive"
                                >
                                    Remove Photo
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            value={profile?.email || ''}
                                            disabled
                                            className="h-11 bg-muted/50"
                                        />
                                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                        placeholder="Tell us about yourself, your interests, and what kind of projects you're looking for..."
                                        className="resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Experience Level */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-violet-500" />
                                    Experience Level
                                </CardTitle>
                                <CardDescription>Select your current experience level</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, experience_level: 'fresher' })}
                                        className={cn(
                                            "flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left",
                                            formData.experience_level === 'fresher'
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/40 hover:bg-primary/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-lg",
                                            formData.experience_level === 'fresher'
                                                ? "bg-primary/20 text-primary"
                                                : "bg-muted"
                                        )}>
                                            <GraduationCap className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Fresher</p>
                                            <p className="text-xs text-muted-foreground">0-2 years of experience</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, experience_level: 'experienced' })}
                                        className={cn(
                                            "flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left",
                                            formData.experience_level === 'experienced'
                                                ? "border-violet-500 bg-violet-500/5"
                                                : "border-border hover:border-violet-500/40 hover:bg-violet-500/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-lg",
                                            formData.experience_level === 'experienced'
                                                ? "bg-violet-500/20 text-violet-500"
                                                : "bg-muted"
                                        )}>
                                            <Briefcase className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Experienced</p>
                                            <p className="text-xs text-muted-foreground">3+ years of experience</p>
                                        </div>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-500" />
                                    Skills & Expertise
                                </CardTitle>
                                <CardDescription>Add skills to help with project matching</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SkillsInput
                                    skills={formData.skills}
                                    onChange={(skills) => setFormData({ ...formData, skills })}
                                    maxSkills={15}
                                />
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Link2 className="h-5 w-5 text-emerald-500" />
                                    Social Links
                                </CardTitle>
                                <CardDescription>Connect your professional profiles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="github" className="flex items-center gap-2">
                                        <Github className="h-4 w-4" />
                                        GitHub
                                    </Label>
                                    <Input
                                        id="github"
                                        type="url"
                                        value={formData.github_url}
                                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                        placeholder="https://github.com/username"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                                        <Linkedin className="h-4 w-4 text-blue-600" />
                                        LinkedIn
                                    </Label>
                                    <Input
                                        id="linkedin"
                                        type="url"
                                        value={formData.linkedin_url}
                                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                        placeholder="https://linkedin.com/in/username"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="portfolio" className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-emerald-500" />
                                        Portfolio Website
                                    </Label>
                                    <Input
                                        id="portfolio"
                                        type="url"
                                        value={formData.portfolio_url}
                                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                                        placeholder="https://yourwebsite.com"
                                        className="h-11"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button - Mobile */}
                        <div className="lg:hidden">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full gap-2 h-12 shadow-lg shadow-primary/20"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
