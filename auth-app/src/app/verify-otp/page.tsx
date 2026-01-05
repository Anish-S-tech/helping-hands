'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { OTPInput } from '@/components/OTPInput';
import { ArrowLeft, Mail, Smartphone, Clock, Loader2, Package } from 'lucide-react';
import { toast } from '@/components/Toast';

type VerificationType = 'email' | 'phone' | '2fa';

function OTPVerificationForm() {
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
                toast.success('2FA verification successful!');
                router.push('/dashboard/builder');
            } else {
                const { error } = await verifyOTP(type, otp);

                if (error) {
                    toast.error(error.message || 'Invalid OTP code.');
                } else {
                    toast.success(`${type === 'email' ? 'Email' : 'Phone'} verified!`);
                    router.push(type === 'email' ? '/verify-phone' : '/profile/complete');
                }
            }
        } catch (err) {
            toast.error('Verification failed.');
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
                };
            case 'phone':
                return {
                    icon: Smartphone,
                    title: 'Verify Phone Number',
                    description: 'Enter the 6-digit code sent to your phone',
                };
            default:
                return {
                    icon: Mail,
                    title: 'Verify Email',
                    description: 'Enter the 6-digit code sent to your email',
                };
        }
    };

    const config = getTypeConfig();
    const Icon = config.icon;

    return (
        <div className="space-y-6">
            <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-xl font-bold">{config.title}</h1>
                <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>

            <div className="py-4">
                <OTPInput onComplete={handleComplete} loading={loading} />
            </div>

            <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">Didn't receive the code?</p>
                <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || resendLoading}
                    className="text-primary text-sm font-medium disabled:opacity-50"
                >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <Link href="/">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </Link>
                </div>

                <div className="p-6 bg-card border rounded-xl">
                    <Suspense fallback={<LoadingFallback />}>
                        <OTPVerificationForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
