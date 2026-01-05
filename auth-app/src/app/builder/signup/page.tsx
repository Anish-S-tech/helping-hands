'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Github, Loader2, ArrowRight, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordStrength } from '@/components/PasswordStrength';

export default function BuilderSignupPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle, signInWithGitHub } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, 'user');

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Redirect builders to the builder dashboard
            router.push('/dashboard/builder');
        }
    };

    const handleOAuth = async (provider: 'google' | 'github') => {
        setLoading(true);
        const { error } = provider === 'google' ? await signInWithGoogle() : await signInWithGitHub();
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-background to-background">
            <div className="w-full max-w-[440px] space-y-8">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-medium uppercase tracking-wider text-accent mb-2">
                        <UserCircle className="w-3 h-3" /> Builder Access
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Builder Account</h1>
                    <p className="text-sm text-muted">Join the community to collaborate and grow</p>
                </div>

                {/* Main Card */}
                <div className="p-8 bg-surface-1 border border-border rounded-xl shadow-2xl space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-xs text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted ml-1">Email address</label>
                            <Input
                                type="email"
                                placeholder="builder@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-surface-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted ml-1">Choose Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-surface-2"
                            />
                            <PasswordStrength password={password} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted ml-1">Confirm Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-surface-2"
                            />
                        </div>

                        <Button type="submit" isLoading={loading} className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-medium">
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                            <span className="bg-surface-1 px-3 text-muted">or join with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleOAuth('google')}
                            disabled={loading}
                            className="h-10 text-xs border-border hover:bg-surface-2"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" className="opacity-70" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" className="opacity-50" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" className="opacity-80" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleOAuth('github')}
                            disabled={loading}
                            className="h-10 text-xs border-border hover:bg-surface-2"
                        >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                        </Button>
                    </div>

                    <p className="text-[10px] text-center text-muted leading-relaxed">
                        By clicking create account, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted">
                    Already a builder? <Link href="/builder/login" className="text-accent hover:underline font-medium">Log in</Link>
                </p>

                <div className="pt-8 text-center">
                    <Link href="/founder/signup" className="text-xs text-muted hover:text-foreground transition-colors border-b border-border/50 pb-0.5">
                        Are you a Founder? Join as Founder
                    </Link>
                </div>
            </div>
        </div>
    );
}
