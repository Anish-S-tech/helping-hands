'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Smartphone, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyPhonePage() {
    const router = useRouter();
    const { profile, sendOTP } = useAuth();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        // If already verified, redirect
        if (profile?.phone_verified) {
            router.push('/dashboard/builder');
        }

        // Pre-fill phone if exists
        if (profile?.phone) {
            setPhone(profile.phone);
        }
    }, [profile, router]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSendVerification = async () => {
        if (!phone || phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setError('');

        const { error: sendError } = await sendOTP('phone', phone);

        if (sendError) {
            setError(sendError.message);
        } else {
            setSuccess(true);
            setResendCooldown(60);
            setTimeout(() => {
                router.push('/verify-otp?type=phone');
            }, 2000);
        }

        setLoading(false);
    };

    const handleSkip = () => {
        // Can't skip phone verification for critical actions
        // But allow skipping during initial setup
        router.push('/profile/complete');
    };

    if (profile?.phone_verified) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-semibold text-white mb-2 text-center">
                        Verify Your Phone
                    </h2>
                    <p className="text-slate-400 mb-6 text-center">
                        Phone verification is required to apply to projects and create projects. This helps maintain trust in our community.
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

                    {/* Phone Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Your phone number will not be shared publicly
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSendVerification}
                            disabled={loading || resendCooldown > 0 || !phone}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <p className="text-amber-300 text-sm">
                            <strong>Note:</strong> You'll need to verify your phone before you can apply to projects or create projects. This ensures all participants are authentic.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
