'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Phone, Shield, AlertCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { VerificationBadge } from './VerificationBadge';

interface VerificationReminderProps {
    isOpen: boolean;
    onClose: () => void;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFAEnabled: boolean;
}

export function VerificationReminder({
    isOpen,
    onClose,
    emailVerified,
    phoneVerified,
    twoFAEnabled,
}: VerificationReminderProps) {
    const router = useRouter();
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const pendingVerifications = [
        {
            type: 'email',
            verified: emailVerified,
            icon: Mail,
            title: 'Email Verification',
            description: 'Verify your email to apply to projects',
            action: () => router.push('/verify-email'),
            actionText: 'Verify Email',
            importance: 'high',
        },
        {
            type: 'phone',
            verified: phoneVerified,
            icon: Phone,
            title: 'Phone Verification',
            description: 'Required for team communication',
            action: () => router.push('/verify-phone'),
            actionText: 'Verify Phone',
            importance: 'medium',
        },
        {
            type: '2fa',
            verified: twoFAEnabled,
            icon: Shield,
            title: 'Two-Factor Authentication',
            description: 'Add extra security to your account',
            action: () => router.push('/settings/2fa-setup'),
            actionText: 'Enable 2FA',
            importance: 'low',
        },
    ];

    const pending = pendingVerifications.filter((v) => !v.verified);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('hideVerificationReminder', 'true');
        }
        onClose();
    };

    const handleVerify = (action: () => void) => {
        action();
        onClose();
    };

    if (pending.length === 0) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Complete Your Verification
                            </h2>
                            <p className="text-sm text-slate-400">
                                {pending.length} verification{pending.length > 1 ? 's' : ''} pending
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Pending Verifications */}
                <div className="space-y-3 mb-6">
                    {pending.map((verification) => {
                        const Icon = verification.icon;
                        return (
                            <div
                                key={verification.type}
                                className="bg-slate-800 rounded-xl border border-slate-700 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${verification.importance === 'high'
                                            ? 'bg-red-500/20'
                                            : verification.importance === 'medium'
                                                ? 'bg-yellow-500/20'
                                                : 'bg-blue-500/20'
                                        }`}>
                                        <Icon className={`w-5 h-5 ${verification.importance === 'high'
                                                ? 'text-red-400'
                                                : verification.importance === 'medium'
                                                    ? 'text-yellow-400'
                                                    : 'text-blue-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-white">{verification.title}</h3>
                                            <VerificationBadge
                                                type={verification.type as 'email' | 'phone' | '2fa'}
                                                verified={verification.verified}
                                                size="sm"
                                            />
                                        </div>
                                        <p className="text-sm text-slate-400 mb-3">
                                            {verification.description}
                                        </p>
                                        <button
                                            onClick={() => handleVerify(verification.action)}
                                            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${verification.importance === 'high'
                                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                                    : verification.importance === 'medium'
                                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}
                                        >
                                            {verification.actionText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Benefits */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-medium text-purple-300 mb-2">
                        Why verify your account?
                    </h4>
                    <ul className="text-sm text-purple-200/80 space-y-1">
                        <li>• Apply to projects and join teams</li>
                        <li>• Build trust with founders and members</li>
                        <li>• Access all platform features</li>
                        <li>• Protect your account with 2FA</li>
                    </ul>
                </div>

                {/* Don't Show Again */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-400">
                        Don't show this again
                    </span>
                </label>
            </div>
        </Modal>
    );
}
