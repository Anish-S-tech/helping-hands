'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

const PROTECTED_PREFIXES = [
    '/builder',
    '/founder',
    '/messages',
    '/projects',
    '/settings',
    '/profile',
    '/chat'
];

const PUBLIC_PATHS = [
    '/',
    '/login',
    '/signup',
    '/auth',
    '/explore',
    '/verify-email',
    '/verify-otp',
    '/forgot-password',
    '/reset-password',
    '/verify-phone'
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        // 1. Check if path is protected
        const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

        if (isProtected) {
            if (!user) {
                // Not authenticated -> Redirect
                console.log('AuthGuard: Access denied. Redirecting to /login');
                router.replace('/login');
                return;
            }

            // 2. Strict Role/Profile Validation
            // Requirement: "Authenticated BUT role is missing or invalid -> Treat user as logged out"
            if (!profile) {
                console.log('AuthGuard: Profile missing (Invalid integrity). Redirecting to /login');
                router.replace('/login');
                return;
            }

            // 3. Role Mismatch
            if (pathname.startsWith('/founder') && profile.role_type !== 'founder') {
                console.log('AuthGuard: Role mismatch (Need Founder). Security Block.');
                router.replace('/login'); // Strict security: Kick out to login
                return;
            }
            if (pathname.startsWith('/builder') && profile.role_type !== 'builder') {
                console.log('AuthGuard: Role mismatch (Need Builder). Security Block.');
                router.replace('/login'); // Strict security: Kick out to login
                return;
            }
        }

        // If we got here, we are good
        setIsAuthorized(true);

    }, [user, profile, loading, pathname, router]);

    // Show Loader while checking auth
    const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

    // If loading, or if protected and not valid yet, show Loader (Prevent Flash)
    if (loading || (isProtected && (!user || !profile || !isAuthorized))) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Verifying security...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
