'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    Mail,
    Lock,
    ArrowRight,
    Package,
    Loader2,
    Eye,
    EyeOff,
    Github,
    Chrome,
    Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FounderLoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle, signInWithGitHub } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.push('/dashboard/founder');
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
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
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/20 via-background to-background p-12 flex-col justify-between">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Package className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">HELPING HANDS</span>
                </div>

                <div className="space-y-6 max-w-md">
                    <Badge variant="premium" className="text-xs">
                        <Rocket className="h-3 w-3 mr-1" /> Founder Portal
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight leading-tight">
                        Build your dream team. Launch faster.
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Access a curated network of elite builders ready to help you
                        bring your vision to life.
                    </p>
                </div>

                <p className="text-xs text-muted-foreground">
                    © 2024 Helping Hands. All rights reserved.
                </p>
            </div>

            {/* Right Panel - Login Form */}
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
                            <CardTitle className="text-2xl font-bold">Founder Access</CardTitle>
                            <CardDescription>
                                Sign in to manage your missions and team
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-11"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-primary hover:underline font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    variant="premium"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>Access Console <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center border-t bg-muted/20 py-4">
                            <p className="text-sm text-muted-foreground">
                                Need an account?{' '}
                                <Link href="/signup/founder" className="text-primary font-semibold hover:underline">
                                    Register as Founder
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        Looking to join as a builder?{' '}
                        <Link href="/login/user" className="text-primary font-medium hover:underline">
                            Sign in here instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
