'use client';

import { MainLayout } from '@/components/MainLayout';
import { MOCK_INCOMING_APPLICATIONS } from '@/data/mock-data';
import { SectionHeader } from '@/components/SectionHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RequestsPage() {
    const pendingRequests = MOCK_INCOMING_APPLICATIONS.filter(a => a.status === 'pending');

    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Join Requests</h1>
                    <p className="text-muted-foreground mt-1">
                        Review and manage applications to your projects
                    </p>
                </div>

                <section className="space-y-4">
                    <SectionHeader
                        title="Pending Applications"
                        badge={{ label: `${pendingRequests.length} pending`, variant: "warning" }}
                    />
                    <div className="space-y-3">
                        {pendingRequests.map((app) => (
                            <div
                                key={app.id}
                                className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/50"
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={app.applicant_avatar} />
                                    <AvatarFallback>
                                        {app.applicant_name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{app.applicant_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {app.role_applied} • {app.project_title}
                                    </p>
                                </div>
                                <Badge variant="secondary">{app.status}</Badge>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">View</Button>
                                    <Button size="sm">Accept</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
