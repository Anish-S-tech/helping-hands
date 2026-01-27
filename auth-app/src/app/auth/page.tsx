'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Package, Mail, Lock, Eye, EyeOff, Code, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type RoleType = 'builder' | 'founder';

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signUp, signIn, user, profile } = useAuth();

    // Local state for role selection
    const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already authenticated, redirect to dashboard
    useEffect(() => {
        if (user && profile) {
            const dashboardPath = profile.role_type === 'founder' ? '/founder/home' : '/builder/home';
            router.replace(dashboardPath);
        }
    }, [user, profile, router]);

    // Get redirect path from query params
    const redirectPath = searchParams.get('redirect');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            setError('Please select your role first');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const roleType = selectedRole === 'builder' ? 'user' : 'founder';
            const { error: signUpError } = await signUp(email, password, roleType);

            if (signUpError) {
                setError(signUpError.message);
            } else {
                // Redirect to appropriate dashboard
                const dashboardPath = roleType === 'founder' ? '/founder/home' : '/builder/home';
                router.push(redirectPath || dashboardPath);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            setError('Please select your role first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const roleType = selectedRole === 'builder' ? 'user' : 'founder';
            const { error: signInError } = await signIn(email, password, roleType);

            if (signInError) {
                setError(signInError.message);
            } else {
                // Redirect to appropriate dashboard
                const dashboardPath = roleType === 'founder' ? '/founder/home' : '/builder/home';
                router.push(redirectPath || dashboardPath);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navigation */}
            <nav className="border-b glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Package className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-base font-bold tracking-tight text-foreground">
                            HELPING HANDS
                        </span>
                        <Badge variant="premium" className="ml-2 text-[9px] font-bold">BETA</Badge>
                    </Link>

                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </nav>

            {/* Main Content - Two Column Layout */}
            <main className="flex-1 flex items-stretch">
                <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-5 gap-0">
                    {/* LEFT SIDE - Role Selection (40%) */}
                    <div className="lg:col-span-2 bg-muted/30 border-r flex items-center justify-center p-8 lg:p-12">
                        <div className="w-full max-w-md space-y-6 animate-fade-in-up">
                            <div className="text-center lg:text-left space-y-2">
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest mb-4">
                                    Step 1
                                </Badge>
                                <h2 className="text-2xl md:text-3xl font-bold">
                                    Choose Your Role
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    Select how you want to use Helping Hands
                                </p>
                            </div>

                            <div className="space-y-3">
                                {/* Builder Card */}
                                <Card
                                    onClick={() => setSelectedRole('builder')}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all duration-300 overflow-hidden group",
                                        selectedRole === 'builder'
                                            ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                                            : "border-transparent hover:border-primary/30 bg-card"
                                    )}
                                >
                                    <CardContent className="p-5 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {selectedRole === 'builder' && (
                                            <div className="absolute top-4 right-4">
                                                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                <Code className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-1">Builder</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Join and contribute to projects
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Founder Card */}
                                <Card
                                    onClick={() => setSelectedRole('founder')}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all duration-300 overflow-hidden group",
                                        selectedRole === 'founder'
                                            ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                                            : "border-transparent hover:border-primary/30 bg-card"
                                    )}
                                >
                                    <CardContent className="p-5 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {selectedRole === 'founder' && (
                                            <div className="absolute top-4 right-4">
                                                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="h-6 w-6 text-purple-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-1">Founder</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Create and manage projects
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {selectedRole && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in-up">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>Role selected! Continue to authentication →</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE - Auth Form (60%) */}
                    <div className="lg:col-span-3 flex items-center justify-center p-8 lg:p-12">
                        <div className="w-full max-w-md space-y-6">
                            <div className="text-center space-y-2 animate-fade-in-up">
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest mb-4">
                                    Step 2
                                </Badge>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                                </h1>
                                {selectedRole ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-sm text-muted-foreground">Continuing as:</span>
                                        <Badge variant="secondary" className="font-semibold">
                                            {selectedRole === 'builder' ? 'Builder' : 'Founder'}
                                        </Badge>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Select your role to continue
                                    </p>
                                )}
                            </div>

                            <Card className={cn(!selectedRole && "opacity-50 pointer-events-none")}>
                                <CardContent className="pt-6">
                                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 mb-6">
                                            <TabsTrigger value="login" disabled={!selectedRole}>Login</TabsTrigger>
                                            <TabsTrigger value="signup" disabled={!selectedRole}>Sign Up</TabsTrigger>
                                        </TabsList>

                                        {/* Login Tab */}
                                        <TabsContent value="login">
                                            <form onSubmit={handleSignIn} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="login-email">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="login-email"
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="pl-9"
                                                            required
                                                            disabled={!selectedRole}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="login-password">Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="login-password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="••••••••"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="pl-9 pr-9"
                                                            required
                                                            disabled={!selectedRole}
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

                                                {error && (
                                                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                                        {error}
                                                    </div>
                                                )}

                                                <Button type="submit" className="w-full" disabled={loading || !selectedRole}>
                                                    {loading ? 'Signing in...' : (
                                                        <>
                                                            Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </TabsContent>

                                        {/* Sign Up Tab */}
                                        <TabsContent value="signup">
                                            <form onSubmit={handleSignUp} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="signup-email">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="signup-email"
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="pl-9"
                                                            required
                                                            disabled={!selectedRole}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="signup-password">Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="signup-password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="••••••••"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="pl-9 pr-9"
                                                            required
                                                            minLength={6}
                                                            disabled={!selectedRole}
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
                                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="confirm-password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="••••••••"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="pl-9"
                                                            required
                                                            minLength={6}
                                                            disabled={!selectedRole}
                                                        />
                                                    </div>
                                                </div>

                                                {error && (
                                                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                                        {error}
                                                    </div>
                                                )}

                                                <Button type="submit" className="w-full" disabled={loading || !selectedRole}>
                                                    {loading ? 'Creating account...' : (
                                                        <>
                                                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            {!selectedRole && (
                                <div className="text-center text-sm text-muted-foreground">
                                    ← Choose your role to enable authentication
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
