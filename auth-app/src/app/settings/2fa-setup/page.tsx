'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Shield, Copy, Check, ArrowLeft, Download, AlertCircle } from 'lucide-react';
import { toast } from '@/components/Toast';
import { OTPInput } from '@/components/OTPInput';
import QRCode from 'react-qr-code';

export default function TwoFASetupPage() {
    const router = useRouter();
    const { profile, generate2FASecret, verify2FACode, loading: authLoading } = useAuth();

    const [step, setStep] = useState<'setup' | 'verify'>('setup');
    const [secretCopied, setSecretCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);

    const [secret, setSecret] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (!profile) {
                router.push('/login');
            } else if (profile.two_fa_enabled) {
                toast.info('2FA is already enabled');
                router.push('/settings');
            } else {
                initializeSetup();
            }
        }
    }, [profile, authLoading, router]);

    const initializeSetup = async () => {
        setInitializing(true);
        const result = await generate2FASecret();

        if (result.error) {
            setError(result.error.message);
            toast.error('Failed to generate 2FA secret');
        } else {
            setSecret(result.secret);
            setQrCodeUrl(result.qrCodeUrl);
            setBackupCodes(result.backupCodes);
        }

        setInitializing(false);
    };

    const handleCopySecret = () => {
        navigator.clipboard.writeText(secret);
        setSecretCopied(true);
        toast.success('Secret key copied!');
        setTimeout(() => setSecretCopied(false), 2000);
    };

    const handleDownloadCodes = () => {
        const blob = new Blob(
            [backupCodes.join('\n')],
            { type: 'text/plain' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup-codes.txt';
        a.click();
        toast.success('Backup codes downloaded!');
    };

    const handleVerify = async (code: string) => {
        setLoading(true);
        setError('');

        const result = await verify2FACode(code, secret);

        if (result.error) {
            setError(result.error.message);
            toast.error('Invalid code. Please try again.');
            setLoading(false);
        } else {
            toast.success('Two-factor authentication enabled!');
            router.push('/settings');
        }
    };

    if (authLoading || initializing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error && !secret) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-red-500/50 p-8 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white text-center mb-2">Setup Failed</h2>
                    <p className="text-slate-400 text-center mb-4">{error}</p>
                    <Link
                        href="/settings"
                        className="block w-full bg-purple-500 hover:bg-purple-600 text-white text-center py-3 rounded-xl font-medium transition-colors"
                    >
                        Back to Settings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative w-full max-w-md">
                {/* Back Button */}
                <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Settings
                </Link>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-semibold text-white text-center mb-2">
                        Enable Two-Factor Authentication
                    </h2>
                    <p className="text-slate-400 text-center mb-8">
                        Add an extra layer of security to your account
                    </p>

                    {step === 'setup' ? (
                        <>
                            {/* Step Indicator */}
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                            </div>

                            {/* QR Code */}
                            <div className="bg-white p-6 rounded-xl mb-6 flex justify-center">
                                <QRCode value={qrCodeUrl} size={200} />
                            </div>

                            {/* Instructions */}
                            <div className="space-y-4 mb-6">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        1
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Install an authenticator app like Google Authenticator or Authy
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        2
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Scan the QR code with your authenticator app
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        3
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Or manually enter this secret key
                                    </p>
                                </div>
                            </div>

                            {/* Secret Key */}
                            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <code className="text-sm text-purple-300 font-mono">{secret}</code>
                                    <button
                                        onClick={handleCopySecret}
                                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                                    >
                                        {secretCopied ? (
                                            <Check className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={() => setStep('verify')}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                            >
                                Continue
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Step Indicator */}
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                            </div>

                            <p className="text-center text-slate-400 mb-6">
                                Enter the 6-digit code from your authenticator app
                            </p>

                            {/* OTP Input */}
                            <div className="mb-6">
                                <OTPInput onComplete={handleVerify} loading={loading} />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400 text-center">{error}</p>
                                </div>
                            )}

                            {/* Backup Codes */}
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <Download className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-yellow-300 mb-2">
                                            Save your backup codes
                                        </p>
                                        <p className="text-xs text-yellow-200/80 mb-3">
                                            Use these codes if you lose access to your authenticator app
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            {backupCodes.map((code, i) => (
                                                <code key={i} className="text-xs bg-slate-900/50 rounded px-2 py-1 text-yellow-300">
                                                    {code}
                                                </code>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleDownloadCodes}
                                            className="text-xs text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-1"
                                        >
                                            <Download className="w-3 h-3" />
                                            Download codes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('setup')}
                                disabled={loading}
                                className="w-full text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50"
                            >
                                ← Back to setup
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
