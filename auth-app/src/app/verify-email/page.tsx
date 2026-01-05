'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { profile, sendOTP, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        // If already verified, redirect
        if (profile?.email_verified) {
            router.push('/dashboard/builder');
        }
    }, [profile, router]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSendVerification = async () => {
        if (!profile?.email) return;

        setLoading(true);
        setError('');

        const { error: sendError } = await sendOTP('email', profile.email);

        if (sendError) {
            setError(sendError.message);
        } else {
            setSuccess(true);
            setResendCooldown(60);
            setTimeout(() => {
                router.push('/verify-otp?type=email');
            }, 2000);
        }

        setLoading(false);
    };

    const handleSkip = () => {
        router.push('/profile/complete');
    };

    if (profile?.email_verified) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-semibold text-white mb-2 text-center">
                        Verify Your Email
                    </h2>
                    <p className="text-slate-400 mb-6 text-center">
                        We need to verify your email address to ensure account security and enable all platform features.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <p className="text-green-400 text-sm">
                                Verification code sent! Redirecting to OTP page...
                            </p>
                        </div>
                    )}

                    {/* Email Display */}
                    <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-slate-400 mb-1">Sending verification to:</p>
                        <p className="text-white font-medium">{profile?.email}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSendVerification}
                            disabled={loading || resendCooldown > 0}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : (
                                <>
                                    Send Verification Code
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleSkip}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                        >
                            Skip for Now
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-300 text-sm">
                            <strong>Why verify?</strong> Email verification helps us protect your account and enables important features like project applications and team chat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
