'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function AnalyticsRedirect() {
    const router = useRouter();
    const { profile } = useAuth();

    useEffect(() => {
        // Redirect to role-appropriate analytics page
        if (profile?.role_type === 'founder') {
            router.replace('/founder/analytics');
        } else {
            router.replace('/builder/home');
        }
    }, [router, profile]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center space-y-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                <p className="text-sm text-muted-foreground">Loading analytics...</p>
            </div>
        </div>
    );
}
