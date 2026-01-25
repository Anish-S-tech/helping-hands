'use client';

import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { StatCard } from '@/components/StatCard';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Track project performance and team engagement
                    </p>
                </div>

                <section className="space-y-4">
                    <SectionHeader title="Overview" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={BarChart3}
                            iconColor="text-primary"
                            value="85%"
                            label="Project Completion"
                        />
                        <StatCard
                            icon={Users}
                            iconColor="text-blue-500"
                            value="24"
                            label="Active Contributors"
                        />
                        <StatCard
                            icon={TrendingUp}
                            iconColor="text-green-500"
                            value="+12%"
                            label="Growth This Month"
                        />
                        <StatCard
                            icon={Activity}
                            iconColor="text-orange-500"
                            value="156"
                            label="Total Activities"
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <SectionHeader title="Detailed Analytics" subtitle="Coming soon" />
                    <div className="text-center py-16 border border-dashed border-border/50 rounded-lg">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                            Advanced analytics and insights will be available soon
                        </p>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
