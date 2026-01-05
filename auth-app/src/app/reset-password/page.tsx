'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            setError('Invalid or missing reset token');
        } else {
            setToken(resetToken);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
            router.push('/login');
        }, 2000);
    };

    if (error && !token) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Invalid Reset Link</h2>
                    <p className="text-sm text-muted-foreground">
                        This link is invalid or has expired.
                    </p>
                </div>
                <Button asChild className="w-full">
                    <Link href="/forgot-password">Request New Link</Link>
                </Button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Password Reset!</h2>
                    <p className="text-sm text-muted-foreground">
                        Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-sm text-muted-foreground">Enter your new password</p>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    'Reset Password'
                )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </Link>
                </div>

                <div className="p-6 bg-card border rounded-xl">
                    <Suspense fallback={<LoadingFallback />}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
