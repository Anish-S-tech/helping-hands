'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    User, Shield, Bell, Lock, MessageSquare, Users, Eye, Trash2,
    ArrowLeft, LogOut, Settings, Monitor, Smartphone, Globe,
    ChevronRight, Crown, Check, X, AlertTriangle, Download,
    Archive, KeyRound, Loader2
} from 'lucide-react';
import { MainLayout } from '@/components/MainLayout'; // TODO: Legacy DashboardLayout removed - Amazon-style navigation only
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/Toast';
import { DeleteAccountModal } from '@/components/DeleteAccountModal';
import {
    MOCK_PROJECTS,
    MOCK_TEAM_MEMBERS,
    MOCK_ACTIVE_SESSIONS,
    MOCK_LINKED_PROVIDERS,
    MOCK_NOTIFICATION_SETTINGS,
    MOCK_COMMUNICATION_SETTINGS,
    formatRelativeTime
} from '@/data/mock-data';
import { ProjectRoleBadge } from '@/components/ProjectRoleBadge';
import { cn } from '@/lib/utils';

// Settings Row Component
function SettingsRow({
    label,
    description,
    children,
    className
}: {
    label: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center justify-between py-4 border-b border-border last:border-0', className)}>
            <div className="space-y-0.5">
                <p className="text-sm font-medium">{label}</p>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const router = useRouter();
    const { profile, signOut, deleteAccount, loading: authLoading } = useAuth();

    // State management
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState('p1');

    // Profile settings
    const [displayName, setDisplayName] = useState('David Hoffman');
    const [bio, setBio] = useState('Building the future of work through meaningful collaboration.');
    const [isPublicProfile, setIsPublicProfile] = useState(true);

    // Security settings
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);

    // Project settings
    const [projectVisibility, setProjectVisibility] = useState<'public' | 'private'>('public');
    const [autoApprove, setAutoApprove] = useState(false);

    // Notification settings
    const [notifSettings, setNotifSettings] = useState(MOCK_NOTIFICATION_SETTINGS);

    // Communication settings
    const [commSettings, setCommSettings] = useState(MOCK_COMMUNICATION_SETTINGS);

    const founderProjects = MOCK_PROJECTS.filter(p => p.founder.id === 'f1');
    const currentProject = MOCK_PROJECTS.find(p => p.id === selectedProject);
    const projectMembers = MOCK_TEAM_MEMBERS.filter(m => m.project_id === selectedProject);

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login');
        }
        if (profile) {
            setTwoFAEnabled(profile.two_fa_enabled || false);
        }
    }, [profile, authLoading, router]);

    // Mock save handler
    const handleSave = async () => {
        setSaving(true);
        // TODO: Integrate with backend API
        await new Promise(resolve => setTimeout(resolve, 800));
        setSaving(false);
        toast.success('Settings saved successfully');
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const handleDeleteAccount = async (password: string) => {
        const result = await deleteAccount(password);
        if (result.error) return result;
        toast.success('Account deleted');
        router.push('/login');
        return { error: null };
    };

    const handleRevokeSession = async (sessionId: string) => {
        // TODO: Integrate with backend API
        toast.success('Session revoked');
    };

    const handleRemoveMember = async (memberId: string) => {
        // TODO: Integrate with backend API
        setRemoveModalOpen(false);
        setSelectedMember(null);
        toast.success('Member removed from project');
    };

    if (authLoading) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-6">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <Skeleton className="h-96 w-full" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your account, security, and preferences
                        </p>
                    </div>
                    <Button onClick={handleSignOut} variant="ghost" className="text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 h-auto flex-wrap gap-1">
                        <TabsTrigger value="profile" className="text-xs px-3 py-2">
                            <User className="h-3.5 w-3.5 mr-1.5" />Profile
                        </TabsTrigger>
                        <TabsTrigger value="security" className="text-xs px-3 py-2">
                            <Shield className="h-3.5 w-3.5 mr-1.5" />Security
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="text-xs px-3 py-2">
                            <Settings className="h-3.5 w-3.5 mr-1.5" />Projects
                        </TabsTrigger>
                        <TabsTrigger value="communications" className="text-xs px-3 py-2">
                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />Communications
                        </TabsTrigger>
                        <TabsTrigger value="team" className="text-xs px-3 py-2">
                            <Users className="h-3.5 w-3.5 mr-1.5" />Team
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="text-xs px-3 py-2">
                            <Bell className="h-3.5 w-3.5 mr-1.5" />Notifications
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="text-xs px-3 py-2">
                            <Eye className="h-3.5 w-3.5 mr-1.5" />Privacy
                        </TabsTrigger>
                        <TabsTrigger value="danger" className="text-xs px-3 py-2 data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />Danger
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Profile & Identity</CardTitle>
                                <CardDescription>Your public profile information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-20 w-20 border-2 border-border">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=f1" />
                                        <AvatarFallback>DH</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, or GIF. Max 2MB.</p>
                                    </div>
                                </div>

                                {/* Display Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Display Name</label>
                                    <Input
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your display name"
                                    />
                                </div>

                                {/* Role Badge */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">Role</span>
                                    <Badge variant="premium" className="text-xs">
                                        <Crown className="h-3 w-3 mr-1" />
                                        {profile?.role_type === 'founder' ? 'Founder' : 'Builder'}
                                    </Badge>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Bio / Vision Statement</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background resize-none h-24"
                                        placeholder="Tell others about yourself or your vision..."
                                    />
                                </div>

                                {/* Public Profile Toggle */}
                                <SettingsRow
                                    label="Public Profile"
                                    description="Allow others to view your profile and projects"
                                >
                                    <Switch checked={isPublicProfile} onCheckedChange={setIsPublicProfile} />
                                </SettingsRow>

                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        {/* Password */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Password</CardTitle>
                                <CardDescription>Update your password</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline">
                                    <KeyRound className="h-4 w-4 mr-2" />
                                    Change Password
                                </Button>
                            </CardContent>
                        </Card>

                        {/* OAuth Providers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Linked Accounts</CardTitle>
                                <CardDescription>Connected OAuth providers</CardDescription>
                            </CardHeader>
                            <CardContent className="divide-y divide-border">
                                {MOCK_LINKED_PROVIDERS.map((provider) => (
                                    <div key={provider.provider} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                'h-10 w-10 rounded-lg flex items-center justify-center',
                                                provider.provider === 'google' ? 'bg-red-500/10' : 'bg-gray-800'
                                            )}>
                                                {provider.provider === 'google' ? (
                                                    <Globe className="h-5 w-5 text-red-500" />
                                                ) : (
                                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium capitalize">{provider.provider}</p>
                                                <p className="text-xs text-muted-foreground">{provider.email}</p>
                                            </div>
                                        </div>
                                        {provider.is_connected ? (
                                            <Badge variant="active" className="text-[10px]">Connected</Badge>
                                        ) : (
                                            <Button variant="outline" size="sm">Connect</Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Active Sessions */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Active Sessions</CardTitle>
                                    <CardDescription>Devices currently logged into your account</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                                    Revoke All
                                </Button>
                            </CardHeader>
                            <CardContent className="divide-y divide-border">
                                {MOCK_ACTIVE_SESSIONS.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                {session.device.includes('iPhone') ? (
                                                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                                                ) : (
                                                    <Monitor className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{session.device}</p>
                                                    {session.is_current && (
                                                        <Badge variant="active" className="text-[9px]">Current</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {session.browser} · {session.location} · {formatRelativeTime(session.last_active)}
                                                </p>
                                            </div>
                                        </div>
                                        {!session.is_current && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRevokeSession(session.id)}
                                            >
                                                Revoke
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* 2FA */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                                <CardDescription>Add an extra layer of security</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SettingsRow label="Enable 2FA" description="Require OTP when signing in">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <Switch
                                                        checked={twoFAEnabled}
                                                        onCheckedChange={() => router.push('/settings/2fa-setup')}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </SettingsRow>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Project Settings</CardTitle>
                                <CardDescription>Configure settings for your projects</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Project Selector */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Project</label>
                                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                                        <SelectTrigger className="w-full max-w-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {founderProjects.map((project) => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    {project.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="border-t pt-6 space-y-4">
                                    <SettingsRow label="Default Visibility" description="Who can see this project">
                                        <Select value={projectVisibility} onValueChange={(v: 'public' | 'private') => setProjectVisibility(v)}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>

                                    <SettingsRow label="Auto-Approve Requests" description="Automatically accept join requests">
                                        <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
                                    </SettingsRow>

                                    <SettingsRow label="Archive Project" description="Hide project from active list">
                                        <Button variant="outline" size="sm">
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archive
                                        </Button>
                                    </SettingsRow>

                                    <SettingsRow label="Transfer Ownership" description="Transfer this project to another founder">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" disabled>
                                                        Transfer
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Coming soon</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </SettingsRow>

                                    <SettingsRow label="Delete Project" description="Permanently delete this project" className="border-t border-destructive/20 pt-4">
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </SettingsRow>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Communications Tab */}
                    <TabsContent value="communications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Communication Controls</CardTitle>
                                <CardDescription>Manage messaging and notification preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SettingsRow label="Who Can Message You" description="Control who can send you direct messages">
                                    <Select
                                        value={commSettings.who_can_message}
                                        onValueChange={(v: 'everyone' | 'team_only' | 'founder_only') =>
                                            setCommSettings({ ...commSettings, who_can_message: v })
                                        }
                                    >
                                        <SelectTrigger className="w-36">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="everyone">Everyone</SelectItem>
                                            <SelectItem value="team_only">Team Only</SelectItem>
                                            <SelectItem value="founder_only">Founders Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </SettingsRow>

                                <SettingsRow label="Enable Direct Messages" description="Allow others to message you directly">
                                    <Switch
                                        checked={commSettings.dm_enabled}
                                        onCheckedChange={(v) => setCommSettings({ ...commSettings, dm_enabled: v })}
                                    />
                                </SettingsRow>

                                <SettingsRow label="Announcement-Only Mode" description="Only receive announcements, mute other messages">
                                    <Switch
                                        checked={commSettings.announcement_only_mode}
                                        onCheckedChange={(v) => setCommSettings({ ...commSettings, announcement_only_mode: v })}
                                    />
                                </SettingsRow>

                                <SettingsRow label="Quiet Hours" description="Mute notifications during set hours">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={commSettings.quiet_hours_enabled}
                                            onCheckedChange={(v) => setCommSettings({ ...commSettings, quiet_hours_enabled: v })}
                                        />
                                        {commSettings.quiet_hours_enabled && (
                                            <span className="text-xs text-muted-foreground">
                                                {commSettings.quiet_hours_start} - {commSettings.quiet_hours_end}
                                            </span>
                                        )}
                                    </div>
                                </SettingsRow>

                                <SettingsRow label="Message Retention" description="How long to keep message history">
                                    <Select
                                        value={commSettings.message_retention}
                                        onValueChange={(v: '30_days' | '90_days' | '1_year' | 'forever') =>
                                            setCommSettings({ ...commSettings, message_retention: v })
                                        }
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30_days">30 Days</SelectItem>
                                            <SelectItem value="90_days">90 Days</SelectItem>
                                            <SelectItem value="1_year">1 Year</SelectItem>
                                            <SelectItem value="forever">Forever</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </SettingsRow>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Team Tab */}
                    <TabsContent value="team" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Team & Roles</CardTitle>
                                        <CardDescription>Manage team members for {currentProject?.title || 'your project'}</CardDescription>
                                    </div>
                                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {founderProjects.map((project) => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    {project.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y divide-border">
                                    {projectMembers.length === 0 ? (
                                        <p className="text-sm text-muted-foreground py-8 text-center">No team members yet</p>
                                    ) : (
                                        projectMembers.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={member.avatar_url} />
                                                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium">{member.name}</p>
                                                            <ProjectRoleBadge role={member.project_role} showIcon={false} size="sm" />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                                    </div>
                                                </div>
                                                {member.project_role !== 'founder' && (
                                                    <div className="flex items-center gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="outline" size="sm" disabled>
                                                                        Promote
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Promote to Team Lead</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => {
                                                                setSelectedMember(member.id);
                                                                setRemoveModalOpen(true);
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Notification Preferences</CardTitle>
                                <CardDescription>Control how you receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SettingsRow label="In-App Notifications" description="Show notifications within the app">
                                    <Switch
                                        checked={notifSettings.in_app}
                                        onCheckedChange={(v) => setNotifSettings({ ...notifSettings, in_app: v })}
                                    />
                                </SettingsRow>

                                <SettingsRow label="Email Notifications" description="Receive notifications via email">
                                    <Switch
                                        checked={notifSettings.email}
                                        onCheckedChange={(v) => setNotifSettings({ ...notifSettings, email: v })}
                                    />
                                </SettingsRow>

                                <SettingsRow label="Mentions Only" description="Only notify when you are mentioned">
                                    <Switch
                                        checked={notifSettings.mentions_only}
                                        onCheckedChange={(v) => setNotifSettings({ ...notifSettings, mentions_only: v })}
                                    />
                                </SettingsRow>

                                <SettingsRow label="Digest Frequency" description="How often to send email digests">
                                    <Select
                                        value={notifSettings.digest_frequency}
                                        onValueChange={(v: 'instant' | 'daily' | 'weekly' | 'never') =>
                                            setNotifSettings({ ...notifSettings, digest_frequency: v })
                                        }
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="instant">Instant</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="never">Never</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </SettingsRow>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Privacy & Data</CardTitle>
                                <CardDescription>Control your data and privacy settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SettingsRow label="Export Your Data" description="Download a copy of all your data">
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </SettingsRow>

                                <SettingsRow label="Project Visibility" description="Control who can discover your projects">
                                    <Select defaultValue="public">
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="unlisted">Unlisted</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </SettingsRow>

                                <SettingsRow label="Chat History Visibility" description="Who can see your message history">
                                    <Select defaultValue="team">
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="team">Team Only</SelectItem>
                                            <SelectItem value="self">Only Me</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </SettingsRow>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Danger Zone Tab */}
                    <TabsContent value="danger" className="space-y-6">
                        <Card className="border-destructive/30">
                            <CardHeader className="border-b border-destructive/20">
                                <CardTitle className="text-base text-destructive flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Danger Zone
                                </CardTitle>
                                <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <SettingsRow label="Archive Account" description="Temporarily disable your account">
                                    <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                    </Button>
                                </SettingsRow>

                                <SettingsRow label="Delete All Projects" description="Permanently delete all your projects">
                                    <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete All
                                    </Button>
                                </SettingsRow>

                                <SettingsRow label="Delete Account" description="Permanently delete your account and all data" className="border-t border-destructive/20 pt-4">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteModalOpen(true)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </SettingsRow>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />

            {/* Remove Member Modal */}
            <Dialog open={removeModalOpen} onOpenChange={setRemoveModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this member from the project? They will lose access to all project resources.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRemoveModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => selectedMember && handleRemoveMember(selectedMember)}>
                            Remove Member
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
