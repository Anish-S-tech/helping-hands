'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

export function VerificationAlert() {
    const { profile } = useAuth();
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if user has dismissed this alert before
        const isDismissed = localStorage.getItem('verificationAlertDismissed');
        if (isDismissed) {
            setDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('verificationAlertDismissed', 'true');
    };

    // Don't show if dismissed or if all verifications are complete
    if (
        dismissed ||
        !profile ||
        (profile.email_verified && profile.phone_verified)
    ) {
        return null;
    }

    const missingVerifications = [];
    if (!profile.email_verified) missingVerifications.push('email');
    if (!profile.phone_verified) missingVerifications.push('phone');

    return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-yellow-300 mb-1">
                        Complete Your Verification
                    </h3>
                    <p className="text-sm text-yellow-200/80 mb-3">
                        You need to verify your {missingVerifications.join(' and ')} to access all features
                        and apply to projects.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {!profile.email_verified && (
                            <Link
                                href="/verify-email"
                                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Verify Email
                            </Link>
                        )}
                        {!profile.phone_verified && (
                            <Link
                                href="/verify-phone"
                                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Verify Phone
                            </Link>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    aria-label="Dismiss alert"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
