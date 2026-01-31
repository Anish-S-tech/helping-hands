'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth');
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center space-y-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                <p className="text-sm text-muted-foreground">Redirecting to signup...</p>
            </div>
        </div>
    );
}
