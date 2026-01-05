'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { PermissionCheck } from '@/lib/permissions';
import { Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PermissionGateProps {
    children: ReactNode;
    check: (profile: any) => PermissionCheck;
    fallback?: 'hide' | 'disabled' | 'message';
    upgradeLink?: string;
}

export function PermissionGate({
    children,
    check,
    fallback = 'message',
    upgradeLink,
}: PermissionGateProps) {
    const { profile } = useAuth();
    const permission = check(profile);

    if (permission.allowed) {
        return <>{children}</>;
    }

    if (fallback === 'hide') {
        return null;
    }

    if (fallback === 'disabled') {
        return (
            <div className="relative">
                <div className="opacity-50 pointer-events-none">
                    {children}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">{permission.reason}</span>
                    </div>
                </div>
            </div>
        );
    }

    // fallback === 'message'
    return (
        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Feature Locked</h3>
                    <p className="text-slate-400 text-sm mb-3">{permission.reason}</p>
                    {upgradeLink && (
                        <Link
                            href={upgradeLink}
                            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            Take Action
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
