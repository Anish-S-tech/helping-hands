'use client';

import { CheckCircle, XCircle, Shield } from 'lucide-react';

interface VerificationBadgeProps {
    type: 'email' | 'phone' | '2fa';
    verified: boolean;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({
    type,
    verified,
    showLabel = true,
    size = 'md'
}: VerificationBadgeProps) {
    const getConfig = () => {
        switch (type) {
            case 'email':
                return {
                    label: 'Email',
                    verifiedText: 'Email Verified',
                    unverifiedText: 'Email Not Verified',
                };
            case 'phone':
                return {
                    label: 'Phone',
                    verifiedText: 'Phone Verified',
                    unverifiedText: 'Phone Not Verified',
                };
            case '2fa':
                return {
                    label: '2FA',
                    verifiedText: '2FA Enabled',
                    unverifiedText: '2FA Disabled',
                };
        }
    };

    const config = getConfig();

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    if (verified) {
        return (
            <div
                className={`inline-flex items-center gap-1.5 bg-green-500/5 border border-green-500/20 rounded-full ${sizeClasses[size]}`}
                title={config.verifiedText}
            >
                <CheckCircle className={`${iconSizes[size]} text-green-400`} />
                {showLabel && <span className="text-green-400 font-medium tracking-tight">{config.label}</span>}
            </div>
        );
    }

    return (
        <div
            className={`inline-flex items-center gap-1.5 bg-surface-2 border border-border rounded-full ${sizeClasses[size]}`}
            title={config.unverifiedText}
        >
            {type === '2fa' ? (
                <Shield className={`${iconSizes[size]} text-muted`} />
            ) : (
                <XCircle className={`${iconSizes[size]} text-muted`} />
            )}
            {showLabel && <span className="text-muted font-medium tracking-tight">{config.label}</span>}
        </div>
    );
}
