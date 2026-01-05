'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Shield, Bell, Lock, Mail, Smartphone,
    Eye, LogOut, Trash2, User, ChevronRight, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/Toast';
import { DeleteAccountModal } from '@/components/DeleteAccountModal';

export default function SettingsPage() {
    const router = useRouter();
    const { profile, signOut, deleteAccount, loading: authLoading } = useAuth();
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login');
        }
        if (profile) {
            setTwoFAEnabled(profile.two_fa_enabled);
        }
    }, [profile, authLoading, router]);

    const handle2FAToggle = async () => {
        if (!twoFAEnabled) {
            router.push('/settings/2fa-setup');
        } else {
            setTwoFAEnabled(false);
            toast.success('Two-factor authentication disabled');
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const handleDeleteAccount = async (password: string) => {
        const result = await deleteAccount(password);
        if (result.error) return result;
        toast.success('Account purged');
        router.push('/login');
        return { error: null };
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar-lite */}
            <aside className="w-64 border-r border-border bg-surface-1 hidden lg:flex flex-col fixed inset-y-0">
                <div className="p-6 space-y-8">
                    <div className="flex items-center gap-2 px-2">
                        <div className="h-5 w-5 bg-accent rounded-sm flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Helping Hands</span>
                    </div>

                    <div className="space-y-1">
                        <p className="px-2 text-[9px] font-bold text-muted uppercase tracking-widest mb-4">Configuration Context</p>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-sm bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-widest text-left">
                            Personal Details
                        </button>
                        <Link href="/settings/notifications" className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-muted hover:text-foreground hover:bg-surface-2 text-[11px] font-bold uppercase tracking-widest transition-all">
                            Transmissions
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Console */}
            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="h-14 border-b border-border bg-surface-1/50 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link href={profile?.role_type === 'founder' ? '/dashboard/founder' : '/dashboard/builder'} className="text-muted hover:text-foreground transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Console / Account Settings</span>
                    </div>
                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-bold uppercase tracking-widest h-8 px-4 text-red-500 hover:bg-red-500/10"
                    >
                        <LogOut className="w-3 h-3 mr-2" /> Terminate Session
                    </Button>
                </header>

                <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
                    {/* Identity Block */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-border pb-4">Entity Identity</h2>
                        <div className="bg-surface-1 border border-border rounded-sm overflow-hidden">
                            <div className="p-6 flex items-center justify-between hover:bg-surface-2 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-sm bg-background border border-border flex items-center justify-center p-1">
                                        <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                                            <User className="w-8 h-8 text-accent" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-base font-bold uppercase tracking-widest">{profile?.name || 'OPERATOR_UNIT'}</p>
                                        <p className="text-[10px] font-mono text-muted uppercase tracking-tighter">{profile?.email}</p>
                                    </div>
                                </div>
                                <Link href="/profile/edit" className="text-[9px] font-bold text-accent uppercase tracking-widest border border-accent/20 px-3 py-1.5 hover:bg-accent/10 transition-all">
                                    Modify Parameters
                                </Link>
                            </div>
                            <div className="px-6 py-4 bg-surface-2/30 border-t border-border flex items-center justify-between">
                                <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Authority Tier</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${profile?.role_type === 'founder' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                                    {profile?.role_type}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Security Sublayer */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-border pb-4">Security Sublayer</h2>
                        <div className="grid gap-4">
                            {[
                                {
                                    icon: Mail,
                                    label: 'Email Protocol',
                                    val: profile?.email,
                                    status: profile?.email_verified ? 'VERIFIED' : 'UNSECURED',
                                    action: !profile?.email_verified && (() => router.push('/verify-otp?type=email'))
                                },
                                {
                                    icon: Smartphone,
                                    label: 'Mobile Link',
                                    val: profile?.phone || 'NO_DATA',
                                    status: profile?.phone_verified ? 'VERIFIED' : 'UNSECURED',
                                    action: !profile?.phone_verified && (() => router.push('/verify-otp?type=phone'))
                                },
                                {
                                    icon: Lock,
                                    label: 'Dual Auth (2FA)',
                                    val: twoFAEnabled ? 'ENABLED' : 'DISABLED',
                                    status: twoFAEnabled ? 'SECURED' : 'RISK_DETECTED',
                                    action: handle2FAToggle
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-surface-1 border border-border rounded-sm p-6 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <item.icon className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                                        <div>
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{item.label}</p>
                                            <p className="text-[11px] font-mono font-bold uppercase">{item.val}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${item.status === 'VERIFIED' || item.status === 'SECURED' ? 'text-green-500' : 'text-red-500'}`}>
                                            [{item.status}]
                                        </span>
                                        {item.action && (
                                            <button
                                                onClick={item.action}
                                                className="text-[9px] font-bold uppercase tracking-widest border border-border px-3 py-1.5 hover:bg-accent hover:text-white hover:border-accent transition-all"
                                            >
                                                {item.label.includes('2FA') ? (twoFAEnabled ? 'DISABLE' : 'ENABLE') : 'SYNC'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Danger Sublayer */}
                    <section className="space-y-6 pt-12">
                        <h2 className="text-sm font-bold text-red-500 uppercase tracking-[0.3em] border-b border-red-500/20 pb-4">Critical Protocols</h2>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-sm p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest font-mono">ACCOUNT_PURGE_SEQUENCE</p>
                                <p className="text-[10px] font-medium text-muted uppercase tracking-tight max-w-sm">Warning: This operation permanently removes your identity from the network registry. It cannot be reverted.</p>
                            </div>
                            <Button
                                onClick={() => setDeleteModalOpen(true)}
                                variant="ghost"
                                className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest h-9 px-6 rounded-sm hover:bg-red-600"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Initiate Purge
                            </Button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
}
