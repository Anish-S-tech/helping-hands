'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function ProfileCompletionPrompt() {
    const { profile } = useAuth();
    // Initialize dismissed state from localStorage using lazy initialization
    const [dismissed, setDismissed] = useState(() => {
        if (typeof window === 'undefined') return false;
        const dismissedTime = localStorage.getItem('profilePromptDismissed');
        if (dismissedTime) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
            return daysSinceDismissed < 7;
        }
        return false;
    });

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('profilePromptDismissed', Date.now().toString());
    };

    // Don't show if dismissed or profile is complete
    if (dismissed || !profile || profile.profile_completed) {
        return null;
    }

    // Calculate completion percentage
    const fields = [
        profile.name,
        profile.bio,
        profile.avatar_url,
        profile.experience_level,
        profile.github_url || profile.linkedin_url || profile.portfolio_url,
        profile.phone,
    ];
    const completionPercentage = Math.round(
        (fields.filter(Boolean).length / fields.length) * 100
    );

    return (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">
                            Your profile is {completionPercentage}% complete
                        </h3>
                        <button
                            onClick={handleDismiss}
                            className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                        A complete profile helps you get discovered by founders and increases your chances of joining projects
                    </p>

                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    <Link
                        href="/profile/complete"
                        className="inline-block text-sm bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Complete Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
