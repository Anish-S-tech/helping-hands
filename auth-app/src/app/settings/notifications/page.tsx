'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Bell, Mail, MessageSquare, Briefcase, Users, Save, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/Toast';

export default function NotificationSettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState({
        projectUpdates: true,
        newMessages: true,
        teamInvites: true,
        applicationStatus: true,
        weeklyDigest: false,
        marketingEmails: false,
    });

    const [pushNotifications, setPushNotifications] = useState({
        messages: true,
        projectActivity: true,
        teamUpdates: false,
    });

    const handleSaveSettings = () => {
        toast.success('System parameters synced');
    };

    const toggleEmail = (key: keyof typeof emailNotifications) => {
        setEmailNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

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
                        <p className="px-2 text-[9px] font-bold text-muted uppercase tracking-widest mb-4">Settings Context</p>
                        <Link href="/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-muted hover:text-foreground hover:bg-surface-2 text-[11px] font-bold uppercase tracking-widest transition-all">
                            General Info
                        </Link>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-sm bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-widest text-left">
                            Transmissions
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Console */}
            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="h-14 border-b border-border bg-surface-1/50 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link href="/settings" className="text-muted hover:text-foreground transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Console / Settings / Transmissions</span>
                    </div>
                    <Button
                        onClick={handleSaveSettings}
                        size="sm"
                        className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest h-8 px-4"
                    >
                        <Save className="w-3 h-3 mr-2" /> System Sync
                    </Button>
                </header>

                <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h2 className="text-xl font-bold uppercase tracking-widest">Network Transmissions</h2>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted font-mono">Status: Connected</span>
                            </div>
                        </div>

                        {/* Email Transmission Matrix */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-4 h-4" /> SMTP Relays (Email)
                            </h3>

                            <div className="grid gap-2">
                                {[
                                    { key: 'projectUpdates' as const, label: 'Mission Updates', desc: 'Real-time telemetry from active missions.' },
                                    { key: 'newMessages' as const, label: 'Command Directives', desc: 'New messages in project command channels.' },
                                    { key: 'teamInvites' as const, label: 'Coalition Requests', desc: 'Invitations to join new project networks.' },
                                    { key: 'applicationStatus' as const, label: 'Auth Protocols', desc: 'Updates on your mission access requests.' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between p-6 bg-surface-1 border border-border rounded-sm hover:border-muted transition-all group">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground transition-colors">{label}</p>
                                            <p className="text-[10px] font-medium text-muted uppercase tracking-tight">{desc}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleEmail(key)}
                                            className={`relative w-10 h-5 rounded-sm transition-all border ${emailNotifications[key] ? 'bg-accent border-accent' : 'bg-surface-2 border-border'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-sm transition-all ${emailNotifications[key] ? 'left-[22px]' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Push Protocols */}
                        <div className="space-y-4 pt-8 border-t border-border opacity-50">
                            <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2 font-mono">
                                <Bell className="w-4 h-4" /> Direct UI Injections (Push)
                            </h3>
                            <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-accent" /> Module: UNDER_DEVELOPMENT (Alpha v0.8)
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
