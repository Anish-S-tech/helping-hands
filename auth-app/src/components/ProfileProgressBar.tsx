'use client';

import { calculateProfileCompletion, getRequiredProfileFields } from '@/lib/permissions';
import { Profile } from '@/contexts/auth-context';
import { CheckCircle, Circle } from 'lucide-react';

interface ProfileProgressBarProps {
    profile: Profile | null;
    showDetails?: boolean;
}

export function ProfileProgressBar({ profile, showDetails = false }: ProfileProgressBarProps) {
    const completionPercentage = calculateProfileCompletion(profile);
    const missingFields = getRequiredProfileFields(profile);
    const isComplete = completionPercentage === 100;

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${isComplete
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                }`}
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
                <span className={`text-sm font-semibold min-w-[3rem] text-right ${isComplete ? 'text-green-400' : 'text-purple-400'
                    }`}>
                    {completionPercentage}%
                </span>
            </div>

            {/* Details */}
            {showDetails && (
                <div className="mt-3">
                    {isComplete ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Profile complete!</span>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <p className="text-slate-400 text-sm mb-2">Missing fields:</p>
                            <div className="flex flex-wrap gap-2">
                                {missingFields.map((field) => (
                                    <span
                                        key={field}
                                        className="inline-flex items-center gap-1.5 bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-300"
                                    >
                                        <Circle className="w-3 h-3" />
                                        {field}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
