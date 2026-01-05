'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
  Rocket,
  Users,
  Shield,
  Activity,
  Layers,
  Package,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  Code,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="border-b glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              HELPING HANDS
            </span>
            <Badge variant="premium" className="ml-2 text-[9px] font-bold">BETA</Badge>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Button size="sm" className="h-9" asChild>
                <Link href={profile?.role_type === 'founder' ? '/dashboard/founder' : '/dashboard/builder'}>
                  Go to Dashboard <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-9 hidden md:flex" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="premium" size="sm" className="h-9" asChild>
                  <Link href="#get-started">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-24 md:py-32 px-6 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-subtle" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-subtle" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
            <Badge variant="premium" className="mb-6 px-4 py-1.5 text-xs font-semibold">
              <Zap className="h-3 w-3 mr-1.5" /> Now in Public Beta
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.05]">
              Build The Future.<br />
              <span className="text-gradient">Together.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Connect elite builders with visionary founders.
              The premier platform for startup team formation.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Lock className="h-4 w-4" /> Secure Platform
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Globe className="h-4 w-4" /> Global Network
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Users className="h-4 w-4" /> 1,200+ Members
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section id="get-started" className="py-20 px-6 border-y bg-muted/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <Badge variant="outline" className="mb-4 text-[10px] font-bold uppercase tracking-widest">
                Get Started
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Choose your path
              </h2>
              <p className="text-muted-foreground text-lg">
                How do you want to use Helping Hands?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Builder Option */}
              <Link href="/signup/user" className="group">
                <Card className="h-full border-2 border-transparent hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Code className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">I'm a Builder</h3>
                      <p className="text-muted-foreground mb-6">
                        Join innovative projects, collaborate with founders, and build products that matter.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Browse curated startup projects
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Showcase your skills and portfolio
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Connect directly with founders
                        </li>
                      </ul>
                      <div className="flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all">
                        Sign up as Builder <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Founder Option */}
              <Link href="/signup/founder" className="group">
                <Card className="h-full border-2 border-transparent hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="h-8 w-8 text-purple-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">I'm a Founder</h3>
                      <p className="text-muted-foreground mb-6">
                        Build your dream team, find skilled builders, and launch your startup faster.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Post projects and find talent
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Review applications and profiles
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Manage your team in one place
                        </li>
                      </ul>
                      <div className="flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all">
                        Sign up as Founder <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <Badge variant="outline" className="mb-4 text-[10px] font-bold uppercase tracking-widest">
                Platform Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Everything you need to build great teams
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Smart Matching',
                  desc: 'Find the perfect fit based on skills, experience, and project requirements.',
                  icon: Shield,
                  gradient: 'from-blue-500/20 to-blue-600/5'
                },
                {
                  title: 'Real-time Collaboration',
                  desc: 'Built-in chat, project tracking, and role-based access for remote teams.',
                  icon: Activity,
                  gradient: 'from-green-500/20 to-green-600/5'
                },
                {
                  title: 'Verified Profiles',
                  desc: 'Portfolio verification and skill assessments ensure quality connections.',
                  icon: Layers,
                  gradient: 'from-purple-500/20 to-purple-600/5'
                }
              ].map((f, i) => (
                <Card
                  key={i}
                  className="group border-0 shadow-premium animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardContent className="p-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <f.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t bg-card/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-tight">Helping Hands</span>
              <p className="text-[10px] text-muted-foreground font-medium">
                2024 All rights reserved
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">All Systems Operational</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
