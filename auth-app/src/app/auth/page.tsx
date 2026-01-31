'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, Building2, ArrowRight, Lock, Mail, Sparkles, Users, Rocket, Shield, Check } from 'lucide-react';

type RoleChoice = 'builder' | 'founder' | null;

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, profile } = useAuth();

  const [selectedRole, setSelectedRole] = useState<RoleChoice>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleLabel = selectedRole === 'founder' ? 'Founder' : selectedRole === 'builder' ? 'Builder' : '—';

  const isCtaDisabled = !selectedRole || !email || !password || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsSubmitting(true);
    setError(null);

    const roleType = selectedRole === 'founder' ? 'founder' : 'user';

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await signUp(email, password, roleType);
        if (signUpError) {
          setError(signUpError.message);
          setIsSubmitting(false);
          return;
        }
      } else {
        const { error: signInError } = await signIn(email, password, roleType);
        if (signInError) {
          setError(signInError.message);
          setIsSubmitting(false);
          return;
        }
      }

      const redirectPath = selectedRole === 'founder' ? '/founder/home' : '/builder/home';
      router.replace(redirectPath);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-500/15 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* LEFT PANEL - Hero / Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16">
          {/* Logo & Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">Helping Hands</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-lg space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                Join the Community
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
                Build startups
                <span className="block text-primary">together.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect with founders seeking talent or find exciting projects to contribute to.
                Your next big opportunity starts here.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-muted-foreground">Join <span className="font-semibold text-foreground">2,500+</span> builders and founders</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                  <Rocket className="h-4 w-4 text-violet-500" />
                </div>
                <span className="text-muted-foreground">Explore <span className="font-semibold text-foreground">500+</span> active projects</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Shield className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-muted-foreground">Trusted by teams at <span className="font-semibold text-foreground">leading startups</span></span>
              </div>
            </div>
          </div>

          {/* Testimonial / Social proof */}
          <div className="space-y-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-violet-500/40"
                />
              ))}
              <div className="flex h-8 items-center justify-center rounded-full border-2 border-background bg-muted px-3 text-[11px] font-semibold">
                +2.5k
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              "Helping Hands connected me with the perfect co-founder. We launched in 3 months!"
            </p>
            <p className="text-xs text-muted-foreground/70">— Sarah K., Founder @ TechStart</p>
          </div>
        </div>

        {/* RIGHT PANEL - Authentication */}
        <div className="flex w-full flex-col justify-center p-6 sm:p-8 lg:w-1/2 lg:p-12 xl:p-16">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">Helping Hands</span>
            </div>

            {/* Auth Card */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {mode === 'login'
                        ? 'Sign in to continue to your dashboard'
                        : 'Join thousands of builders and founders'}
                    </p>
                  </div>

                  {/* Tabs */}
                  <Tabs value={mode} onValueChange={(val) => setMode(val as 'login' | 'signup')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-11">
                      <TabsTrigger value="login" className="text-sm font-medium">Sign in</TabsTrigger>
                      <TabsTrigger value="signup" className="text-sm font-medium">Sign up</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      I want to join as a
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('builder')}
                        className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${selectedRole === 'builder'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
                          }`}
                      >
                        {selectedRole === 'builder' && (
                          <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${selectedRole === 'builder' ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                          <User className={`h-5 w-5 ${selectedRole === 'builder' ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">Builder</p>
                          <p className="text-[10px] text-muted-foreground">Join projects</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('founder')}
                        className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${selectedRole === 'founder'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
                          }`}
                      >
                        {selectedRole === 'founder' && (
                          <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${selectedRole === 'founder' ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                          <Building2 className={`h-5 w-5 ${selectedRole === 'founder' ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">Founder</p>
                          <p className="text-[10px] text-muted-foreground">Create projects</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Auth Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email address
                      </Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11 pl-10 text-sm bg-background/50"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        {mode === 'login' && (
                          <a href="/forgot-password" className="text-xs text-primary hover:underline">
                            Forgot password?
                          </a>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 pl-10 text-sm bg-background/50"
                          placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                        <p className="text-xs font-medium text-destructive" role="alert">
                          {error}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isCtaDisabled}
                      className="h-11 w-full gap-2 text-sm font-semibold shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        <>
                          <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground">or continue with</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-11" type="button">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-11" type="button">
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </Button>
                  </div>

                  {/* Terms */}
                  <p className="text-center text-[11px] text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <button type="button" className="text-foreground underline underline-offset-2 hover:text-primary">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-foreground underline underline-offset-2 hover:text-primary">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
