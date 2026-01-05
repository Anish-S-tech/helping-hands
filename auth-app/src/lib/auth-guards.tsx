'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * Require user to be authenticated
 */
export function RequireAuth({ children }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Require specific role
 */
interface RequireRoleProps extends AuthGuardProps {
    role: 'user' | 'founder';
}

export function RequireRole({ children, role }: RequireRoleProps) {
    const { profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && profile && profile.role_type !== role) {
            // Redirect to appropriate dashboard
            const redirectPath = profile.role_type === 'founder' ? '/dashboard/founder' : '/dashboard/builder';
            router.push(redirectPath);
        }
    }, [profile, loading, role, router]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (profile.role_type !== role) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Require email/phone verification
 */
interface RequireVerificationProps extends AuthGuardProps {
    type?: 'email' | 'phone' | 'both';
}

export function RequireVerification({ children, type = 'both' }: RequireVerificationProps) {
    const { profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && profile) {
            const needsEmailVerification = type === 'email' || type === 'both';
            const needsPhoneVerification = type === 'phone' || type === 'both';

            if (needsEmailVerification && !profile.email_verified) {
                router.push('/verify-email');
                return;
            }

            if (needsPhoneVerification && !profile.phone_verified) {
                router.push('/verify-phone');
                return;
            }
        }
    }, [profile, loading, type, router]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    const needsEmailVerification = (type === 'email' || type === 'both') && !profile.email_verified;
    const needsPhoneVerification = (type === 'phone' || type === 'both') && !profile.phone_verified;

    if (needsEmailVerification || needsPhoneVerification) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Require profile completion
 */
export function RequireProfileComplete({ children }: AuthGuardProps) {
    const { profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && profile && !profile.profile_completed) {
            router.push('/profile/complete');
        }
    }, [profile, loading, router]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!profile.profile_completed) {
        return null;
    }

    return <>{children}</>;
}
