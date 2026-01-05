'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Mail, Loader2, Lock, User, Building2, Eye, EyeOff,
    ArrowRight, Package, CheckCircle2, Github, Chrome, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FOUNDER_ROLES = [
    'CEO / Founder',
    'CTO',
    'COO',
    'CPO',
    'Co-Founder',
    'Technical Lead',
    'Product Lead',
    'Other'
];

export default function FounderSignupPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle, signInWithGitHub } = useAuth();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        founderRole: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.name.trim()) {
            setError('Full name is required');
            return;
        }

        if (!form.companyName.trim()) {
            setError('Company/Project name is required');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        const { error } = await signUp(form.email, form.password, 'founder');

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/profile/complete/founder');
        }
    };

    const handleOAuth = async (provider: 'google' | 'github') => {
        setLoading(true);
        try {
            if (provider === 'google') {
                await signInWithGoogle();
            } else {
                await signInWithGitHub();
            }
        } catch (err: any) {
            setError(err.message || 'OAuth authentication failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-500/10 via-background to-background p-12 flex-col justify-between">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
                </div>

                <Link href="/" className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Package className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">HELPING HANDS</span>
                </Link>

                <div className="space-y-6 max-w-md">
                    <Badge variant="premium" className="text-xs">
                        <Building2 className="h-3 w-3 mr-1" /> Founder Account
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight leading-tight">
                        Build your dream team. Launch faster.
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Access a curated network of elite builders ready to help bring your vision to life.
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Post projects and attract talent
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Review verified builder profiles
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Manage your team all in one place
                        </li>
                    </ul>
                </div>

                <p className="text-xs text-muted-foreground">
                    2024 Helping Hands. All rights reserved.
                </p>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">HELPING HANDS</span>
                    </div>

                    <Card className="border-0 shadow-elevated">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold">Create Founder Account</CardTitle>
                            <CardDescription>
                                Start building your team today
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in-up">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="h-11"
                                    onClick={() => handleOAuth('google')}
                                    disabled={loading}
                                >
                                    <Chrome className="mr-2 h-4 w-4" /> Google
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11"
                                    onClick={() => handleOAuth('github')}
                                    disabled={loading}
                                >
                                    <Github className="mr-2 h-4 w-4" /> GitHub
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground font-medium">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Your Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder="Jane Smith"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="pl-10 h-11"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="founderRole">Your Role</Label>
                                        <select
                                            id="founderRole"
                                            value={form.founderRole}
                                            onChange={(e) => setForm({ ...form, founderRole: e.target.value })}
                                            className="w-full h-11 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">Select role</option>
                                            {FOUNDER_ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company/Project Name *</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="companyName"
                                            placeholder="Acme Inc."
                                            value={form.companyName}
                                            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                            className="pl-10 h-11"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Work Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@company.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="pl-10 h-11"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Min. 8 characters"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="pl-10 pr-10 h-11"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                                            placeholder="Confirm your password"
                                            value={form.confirmPassword}
                                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                            className="pl-10 h-11"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    variant="premium"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center border-t bg-muted/20 py-4">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/login/founder" className="text-primary font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        Looking to join as a builder?{' '}
                        <Link href="/signup/user" className="text-primary font-medium hover:underline">
                            Sign up here instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
