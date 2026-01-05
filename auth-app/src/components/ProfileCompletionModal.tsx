'use client';

import { useRouter } from 'next/navigation';
import { X, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Modal } from './ui/Modal';
import { ProfileProgressBar } from './ProfileProgressBar';
import { Profile } from '@/contexts/auth-context';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile | null;
}

export function ProfileCompletionModal({
    isOpen,
    onClose,
    profile,
}: ProfileCompletionModalProps) {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/profile/complete');
        onClose();
    };

    const handleLater = () => {
        localStorage.setItem('profileModalDismissed', Date.now().toString());
        onClose();
    };

    if (!profile || profile.profile_completed) {
        return null;
    }

    const missingFields = [];
    if (!profile.name) missingFields.push('Name');
    if (!profile.bio) missingFields.push('Bio');
    if (!profile.avatar_url) missingFields.push('Profile Picture');
    if (!profile.experience_level) missingFields.push('Experience Level');
    if (!profile.github_url && !profile.linkedin_url && !profile.portfolio_url) {
        missingFields.push('Social Links');
    }
    if (!profile.phone) missingFields.push('Phone Number');

    const completionPercentage = Math.round(
        ((6 - missingFields.length) / 6) * 100
    );

    return (
        <Modal isOpen={isOpen} onClose={handleLater} size="md">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Complete Your Profile
                            </h2>
                            <p className="text-sm text-slate-400">
                                {completionPercentage}% complete
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLater}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <ProfileProgressBar profile={profile} showDetails={false} />
                </div>

                {/* Why Complete? */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Why complete your profile?
                    </h4>
                    <ul className="text-sm text-blue-200/80 space-y-1">
                        <li>• Get discovered by founders for relevant projects</li>
                        <li>• Build trust with the community</li>
                        <li>• Unlock full platform features</li>
                        <li>• Increase your chances of joining teams</li>
                    </ul>
                </div>

                {/* Missing Fields */}
                {missingFields.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3">
                            Complete these sections:
                        </h4>
                        <div className="space-y-2">
                            {missingFields.map((field) => (
                                <div
                                    key={field}
                                    className="flex items-center gap-2 text-sm text-slate-300"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    {field}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleComplete}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                    >
                        Complete Profile Now
                    </button>
                    <button
                        onClick={handleLater}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                    >
                        Later
                    </button>
                </div>

                {/* Reminder */}
                <p className="text-xs text-slate-500 text-center mt-4">
                    You can always complete your profile from the dashboard
                </p>
            </div>
        </Modal>
    );
}
