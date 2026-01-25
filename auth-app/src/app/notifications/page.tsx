'use client';

import { MainLayout } from '@/components/MainLayout';
import { SectionHeader } from '@/components/SectionHeader';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockNotifications = [
    { id: '1', title: 'New application received', message: 'Marcus Thorne applied for Backend Engineer', time: '2 hours ago', read: false },
    { id: '2', title: 'Project milestone reached', message: 'Nexus AI is now 80% complete', time: '5 hours ago', read: false },
    { id: '3', title: 'Team member joined', message: 'Sarah Chen joined your EcoTrack project', time: '1 day ago', read: true },
];

export default function NotificationsPage() {
    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-muted-foreground mt-1">
                            Stay updated with important updates and activities
                        </p>
                    </div>
                    <Button variant="outline" size="sm">Mark all as read</Button>
                </div>

                <section className="space-y-3">
                    {mockNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${notification.read
                                    ? 'border-border/50 bg-card/30'
                                    : 'border-primary/30 bg-primary/5'
                                }`}
                        >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-muted' : 'bg-primary/10'
                                }`}>
                                <Bell className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium">{notification.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground/70 mt-2">{notification.time}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </section>
            </div>
        </MainLayout>
    );
}
