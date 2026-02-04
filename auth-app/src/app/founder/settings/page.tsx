'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Lock,
    Mail,
    ChevronRight,
    Save,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { BackButton } from '@/components/BackButton';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from '@/components/Toast';
import { cn } from "@/lib/utils";

export default function FounderSettingsPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();
    const [saving, setSaving] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({
        emailNotifications: true,
        applicationAlerts: true,
        weeklyDigest: false,
        marketingEmails: false,
        twoFactorEnabled: false,
        profilePublic: true,
        showEmail: false,
    });

    useEffect(() => {
        if (authLoading) return;
        if (profile && profile.role_type === 'builder') {
            router.push('/builder/home');
        }
    }, [profile, authLoading, router]);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        toast.success('Settings saved successfully!');
    };

    if (authLoading) {
        return (
            <MainLayout>
                <div className="space-y-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </MainLayout>
        );
    }

    const settingsSections = [
        {
            id: 'profile',
            title: 'Profile Settings',
            description: 'Manage your public profile information',
            icon: User,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Configure how you receive alerts',
            icon: Bell,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
        },
        {
            id: 'security',
            title: 'Security',
            description: 'Protect your account',
            icon: Shield,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            id: 'privacy',
            title: 'Privacy',
            description: 'Control your visibility',
            icon: Lock,
            color: 'text-violet-500',
            bgColor: 'bg-violet-500/10',
        },
    ];

    return (
        <MainLayout>
            <div className="max-w-[1200px] mx-auto space-y-8">
                {/* Header */}
                <section className="space-y-4">
                    <BackButton />
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                                <Badge variant="premium">Founder</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Manage your account preferences and settings
                            </p>
                        </div>
                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </section>

                {/* Quick Navigation */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {settingsSections.map((section) => (
                        <Card
                            key={section.id}
                            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                            onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", section.bgColor)}>
                                        <section.icon className={cn("h-5 w-5", section.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{section.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* Profile Settings */}
                <Card id="profile">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Profile Settings
                        </CardTitle>
                        <CardDescription>Update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={profile?.avatar_url || undefined} />
                                <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-violet-500 text-white">
                                    {(profile?.name || 'U').substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <p className="text-lg font-semibold">{profile?.name || 'User'}</p>
                                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/profile/edit">Edit Profile</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card id="notifications">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-amber-500" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>Configure how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive updates via email</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                            <div>
                                <p className="font-medium">Application Alerts</p>
                                <p className="text-sm text-muted-foreground">Get notified when someone applies to your project</p>
                            </div>
                            <Switch
                                checked={settings.applicationAlerts}
                                onCheckedChange={(checked) => setSettings({ ...settings, applicationAlerts: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                            <div>
                                <p className="font-medium">Weekly Digest</p>
                                <p className="text-sm text-muted-foreground">Receive a weekly summary of your projects</p>
                            </div>
                            <Switch
                                checked={settings.weeklyDigest}
                                onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">Marketing Emails</p>
                                <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
                            </div>
                            <Switch
                                checked={settings.marketingEmails}
                                onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card id="security">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-500" />
                            Security
                        </CardTitle>
                        <CardDescription>Protect your account with additional security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                    <Lock className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-medium">Two-Factor Authentication</p>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.twoFactorEnabled}
                                onCheckedChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">Change Password</p>
                                    <p className="text-sm text-muted-foreground">Update your account password</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                Change <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card id="privacy">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-violet-500" />
                            Privacy
                        </CardTitle>
                        <CardDescription>Control who can see your information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                            <div>
                                <p className="font-medium">Public Profile</p>
                                <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                            </div>
                            <Switch
                                checked={settings.profilePublic}
                                onCheckedChange={(checked) => setSettings({ ...settings, profilePublic: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">Show Email Address</p>
                                <p className="text-sm text-muted-foreground">Display your email on your profile</p>
                            </div>
                            <Switch
                                checked={settings.showEmail}
                                onCheckedChange={(checked) => setSettings({ ...settings, showEmail: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button - Mobile */}
                <div className="lg:hidden pb-8">
                    <Button onClick={handleSave} disabled={saving} className="w-full gap-2 h-12">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
