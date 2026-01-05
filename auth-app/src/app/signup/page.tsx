'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Mail, Loader2, Eye, EyeOff, ShieldCheck, Github, Briefcase, UserPlus } from 'lucide-react';
import { PasswordStrength } from '@/components/PasswordStrength';

export default function SignUpPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle, signInWithGitHub } = useAuth();

    const [step, setStep] = useState<'role' | 'details'>('role');
    const [roleType, setRoleType] = useState<'user' | 'founder'>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRoleSelect = (role: 'user' | 'founder') => {
        setRoleType(role);
        setStep('details');
    };

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
        const { error } = await signUp(email, password, roleType);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push(roleType === 'founder' ? '/dashboard/founder' : '/dashboard/builder');
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[440px]">
                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="h-10 w-10 bg-accent rounded flex items-center justify-center mb-4">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-foreground">
                        Identity Registration
                    </h1>
                    <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-2">
                        Initialize your platform credentials
                    </p>
                </div>

                {/* Card */}
                <div className="bg-surface-1 border border-border p-8 rounded-sm shadow-xl">
                    {step === 'role' ? (
                        <>
                            <h2 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6">
                                Select Operational Role
                            </h2>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleRoleSelect('user')}
                                    className="w-full flex items-start gap-4 p-4 rounded-sm border border-border hover:border-accent hover:bg-surface-2 transition-all text-left bg-surface-2/50"
                                >
                                    <div className="h-8 w-8 rounded bg-background border border-border flex items-center justify-center shrink-0">
                                        <Briefcase className="w-4 h-4 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-none mb-1.5">Builder Account</h3>
                                        <p className="text-[10px] text-muted leading-relaxed font-medium">Verify credentials and deploy to projects.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('founder')}
                                    className="w-full flex items-start gap-4 p-4 rounded-sm border border-border hover:border-accent hover:bg-surface-2 transition-all text-left bg-surface-2/50"
                                >
                                    <div className="h-8 w-8 rounded bg-background border border-border flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-4 h-4 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-none mb-1.5">Founder Account</h3>
                                        <p className="text-[10px] text-muted leading-relaxed font-medium">Orchestrate missions and manage teams.</p>
                                    </div>
                                </button>
                            </div>

                            <p className="text-center text-[10px] font-bold text-muted uppercase tracking-widest mt-8 flex flex-col gap-2">
                                <span>Existing identity?</span>
                                <Link href="/login" className="text-accent hover:text-foreground transition-colors">
                                    Auth Access
                                </Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep('role')}
                                className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-foreground mb-6 flex items-center gap-1.5 transition-colors"
                            >
                                ‹ Back to Role Selection
                            </button>

                            <h2 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6">
                                Identity Details: {roleType === 'founder' ? 'Founder' : 'Builder'}
                            </h2>

                            {error && (
                                <div className="bg-red-500/5 border border-red-500/20 px-4 py-3 mb-6">
                                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                                        Registration Error: {error}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => handleOAuth('google')}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-surface-2 border border-border text-[10px] font-bold uppercase tracking-widest text-foreground py-2.5 rounded-sm hover:bg-surface-1 transition-colors disabled:opacity-50"
                                >
                                    Google
                                </button>
                                <button
                                    onClick={() => handleOAuth('github')}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-surface-2 border border-border text-[10px] font-bold uppercase tracking-widest text-foreground py-2.5 rounded-sm hover:bg-surface-1 transition-colors disabled:opacity-50"
                                >
                                    <Github className="w-3.5 h-3.5" />
                                    GitHub
                                </button>
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-[9px] font-bold text-muted uppercase tracking-widest bg-surface-1 px-3">
                                    Manual Identity System
                                </div>
                            </div>

                            <form onSubmit={handleSignUp} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Identifier (Email)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-surface-2 border border-border rounded-sm py-2.5 pl-10 pr-4 text-xs text-foreground placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                            placeholder="uid@system.id"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Protocol (Password)</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-surface-2 border border-border rounded-sm py-2.5 px-4 text-xs text-foreground placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="pt-1">
                                        <PasswordStrength password={password} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Verification</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-surface-2 border border-border rounded-sm py-2.5 px-4 text-xs text-foreground placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-accent text-white font-bold py-3 px-4 rounded-sm text-[11px] uppercase tracking-widest hover:bg-slate-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Initializing...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-[9px] font-bold text-muted uppercase tracking-widest mt-8 leading-relaxed">
                                By registering, you agree to the system <br />
                                <Link href="/terms" className="text-accent underline underline-offset-4">Governance Terms</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-accent underline underline-offset-4">Identity Protocol</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
