'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { OTPInput } from '@/components/OTPInput';
import { ArrowLeft, Mail, Smartphone, Clock } from 'lucide-react';
import { toast } from '@/components/Toast';

type VerificationType = 'email' | 'phone' | '2fa';

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { profile, verifyOTP, sendOTP } = useAuth();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [type, setType] = useState<VerificationType>('email');

    useEffect(() => {
        const typeParam = searchParams.get('type') as VerificationType;
        if (typeParam) {
            setType(typeParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleComplete = async (otp: string) => {
        setLoading(true);

        try {
            if (type === '2fa') {
                // 2FA verification handled separately
                toast.success('2FA verification successful!');
                router.push('/dashboard/builder');
            } else {
                const { error } = await verifyOTP(type, otp);

                if (error) {
                    toast.error(error.message || 'Invalid OTP code. Please try again.');
                } else {
                    toast.success(`${type === 'email' ? 'Email' : 'Phone'} verified successfully!`);

                    // Route based on verification type
                    if (type === 'email') {
                        router.push('/verify-phone');
                    } else {
                        router.push('/profile/complete');
                    }
                }
            }
        } catch (err) {
            toast.error('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || !profile || type === '2fa') return;

        setResendLoading(true);

        try {
            const value = type === 'email' ? profile.email : profile.phone || '';
            const { error } = await sendOTP(type, value);

            if (error) {
                toast.error(error.message || 'Failed to send code');
            } else {
                toast.success('New code sent!');
                setCooldown(60);
            }
        } catch (err) {
            toast.error('Failed to resend code');
        } finally {
            setResendLoading(false);
        }
    };

    const getTypeConfig = () => {
        switch (type) {
            case '2fa':
                return {
                    icon: Clock,
                    title: 'Two-Factor Authentication',
                    description: 'Enter the 6-digit code from your authenticator app',
                    contact: 'your authenticator app',
                };
            case 'phone':
                return {
                    icon: Smartphone,
                    title: 'Verify Phone Number',
                    description: 'Enter the 6-digit code sent to your phone',
                    contact: profile?.phone || 'your phone',
                };
            default:
                return {
                    icon: Mail,
                    title: 'Verify Email',
                    description: 'Enter the 6-digit code sent to your email',
                    contact: profile?.email || 'your email',
                };
        }
    };

    const config = getTypeConfig();
    const Icon = config.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative w-full max-w-md">
                {/* Back Button */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-semibold text-white text-center mb-2">
                        {config.title}
                    </h2>
                    <p className="text-slate-400 text-center mb-8">
                        {config.description}
                    </p>

                    {/* OTP Input */}
                    <div className="mb-6">
                        <OTPInput onComplete={handleComplete} loading={loading} />
                    </div>

                    {/* Resend */}
                    <div className="text-center mb-6">
                        <p className="text-sm text-slate-400 mb-2">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={cooldown > 0 || resendLoading}
                            className="text-purple-400 hover:text-purple-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cooldown > 0 ? `Resend in ${cooldown}s` : resendLoading ? 'Sending...' : 'Resend Code'}
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-xs text-blue-300 text-center">
                            {type === '2fa'
                                ? 'Open your authenticator app to get the code'
                                : `Check ${config.contact} for the verification code. It may take a few minutes to arrive.`
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
