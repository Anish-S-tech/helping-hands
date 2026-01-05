'use client';

import Link from 'next/link';
import { Package, Code, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 w-fit">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-base font-bold tracking-tight">HELPING HANDS</span>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-lg space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
                        <p className="text-muted-foreground">Choose how you want to sign in</p>
                    </div>

                    <div className="space-y-4">
                        {/* Builder Login */}
                        <Link href="/login/user" className="block group">
                            <Card className="border-2 border-transparent hover:border-blue-500/50 transition-all duration-300">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Code className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">Sign in as Builder</h3>
                                        <p className="text-sm text-muted-foreground">Access projects and collaborate with teams</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Founder Login */}
                        <Link href="/login/founder" className="block group">
                            <Card className="border-2 border-transparent hover:border-purple-500/50 transition-all duration-300">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Building2 className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">Sign in as Founder</h3>
                                        <p className="text-sm text-muted-foreground">Manage your projects and team</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/#get-started" className="text-primary font-medium hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
