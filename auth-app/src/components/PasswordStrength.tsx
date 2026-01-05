'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = useMemo(() => {
        let score = 0;
        if (!password) return { score: 0, label: '', color: '' };

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Contains lowercase
        if (/[a-z]/.test(password)) score++;

        // Contains uppercase
        if (/[A-Z]/.test(password)) score++;

        // Contains numbers
        if (/\d/.test(password)) score++;

        // Contains special characters
        if (/[^a-zA-Z\d]/.test(password)) score++;

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    }, [password]);

    const requirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', met: /[a-z]/.test(password) },
        { label: 'One number', met: /\d/.test(password) },
        { label: 'One special character', met: /[^a-zA-Z\d]/.test(password) },
    ];

    if (!password) return null;

    return (
        <div className="mt-3 space-y-3">
            {/* Strength Bar */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-medium">Strength:</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${strength.label === 'Weak' ? 'text-red-400' :
                        strength.label === 'Medium' ? 'text-yellow-400' :
                            'text-green-400'
                        }`}>
                        {strength.label}
                    </span>
                </div>
                <div className="h-1 bg-surface-2 rounded-full overflow-hidden border border-border/50">
                    <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.score / 6) * 100}%` }}
                    />
                </div>
            </div>

            {/* Requirements Checklist */}
            <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-[10px]">
                        {req.met ? (
                            <Check className="w-3 h-3 text-green-400" />
                        ) : (
                            <X className="w-3 h-3 text-border" />
                        )}
                        <span className={req.met ? 'text-green-400' : 'text-muted'}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
