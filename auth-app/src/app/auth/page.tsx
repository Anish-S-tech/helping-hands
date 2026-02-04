'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building2, ArrowRight, Lock, Mail, Sparkles, Check, Github, Globe, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type RoleChoice = 'builder' | 'founder' | null;

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role');

  const [selectedRole, setSelectedRole] = useState<RoleChoice>((defaultRole === 'builder' || defaultRole === 'founder') ? defaultRole : null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to disable button
  const isCtaDisabled = !selectedRole || !email || !password || (mode === 'signup' && !confirmPassword) || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    // Validate passwords match in signup mode
    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const roleType = selectedRole === 'founder' ? 'founder' : 'builder';

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

      // Successful auth -> Redirect based on role
      const redirectPath = selectedRole === 'founder' ? '/dashboard/founder' : '/dashboard/builder';
      router.replace(redirectPath);

    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-primary/20">

      {/* LEFT PANEL - Social Proof & Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-border bg-card/30">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Helping Hands</span>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Where builders find <br />their life&apos;s work.
            </h1>
            <p className="text-lg text-muted-foreground">Join the community building the next generation of startups.</p>
          </div>

          <div className="space-y-4 pt-8">
            {/* Testimonial 1 */}
            <div className="p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm italic text-muted-foreground mb-3">&quot;I found my technical co-founder here in just 3 days. We launched our MVP last week!&quot;</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/150?u=12" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold">Sarah J.</p>
                  <p className="text-[10px] text-muted-foreground">Founder, TechStart</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm translate-x-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm italic text-muted-foreground mb-3">&quot;Helping Hands is the only place I look for side projects. High quality teams only.&quot;</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/150?u=24" />
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold">Mike K.</p>
                  <p className="text-[10px] text-muted-foreground">Senior Backend Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="h-6 w-6 rounded-full border-2 border-background bg-zinc-400" />
            <div className="h-6 w-6 rounded-full border-2 border-background bg-zinc-500" />
            <div className="h-6 w-6 rounded-full border-2 border-background bg-zinc-600" />
          </div>
          <span>Joined by 10,000+ creators</span>
        </div>
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-sm space-y-8">

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? 'Enter your credentials to continue.' : 'Join to start applying or hiring.'}
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Select Role</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('builder')}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${selectedRole === 'builder'
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50 text-muted-foreground'
                  }`}
              >
                <User className="h-6 w-6" />
                <span className="text-sm font-medium">Builder</span>
                {selectedRole === 'builder' && <div className="absolute top-2 right-2"><Check className="h-3 w-3" /></div>}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('founder')}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${selectedRole === 'founder'
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50 text-muted-foreground'
                  }`}
              >
                <Building2 className="h-6 w-6" />
                <span className="text-sm font-medium">Founder</span>
                {selectedRole === 'founder' && <div className="absolute top-2 right-2"><Check className="h-3 w-3" /></div>}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-9 bg-card/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === 'login' && <a href="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 bg-card/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password (Signup Only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-card/50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={isCtaDisabled} size="lg">
              {isSubmitting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {/* Social Auth */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2" onClick={() => { }}>
                <Globe className="h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => { }}>
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </div>
          </div>

          {/* Footer / Toggle Mode */}
          <div className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="font-medium text-foreground hover:text-primary underline underline-offset-4 transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
