'use client';

import { MainLayout } from '@/components/MainLayout';
import { Bell, X, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockNotifications = [
    { id: '1', title: 'New application received', message: 'Marcus Thorne applied for Backend Engineer', time: '2 hours ago', read: false },
    { id: '2', title: 'Project milestone reached', message: 'Nexus AI is now 80% complete', time: '5 hours ago', read: false },
    { id: '3', title: 'Team member joined', message: 'Sarah Chen joined your EcoTrack project', time: '1 day ago', read: true },
];

export default function NotificationsPage() {
    const unreadCount = mockNotifications.filter(n => !n.read).length;

    return (
        <MainLayout>
            <div className="max-w-[900px] mx-auto space-y-10 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                            {unreadCount > 0 && (
                                <Badge variant="default" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                                    {unreadCount} new
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Stay updated with important activities and updates
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark all as read
                    </Button>
                </div>

                {/* Notifications List */}
                <section className="space-y-4">
                    {mockNotifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className={`group flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 hover:shadow-md animate-fade-in-up opacity-0 stagger-${index + 1} ${notification.read
                                ? 'border-border/40 bg-card/40 hover:bg-card/60'
                                : 'border-primary/30 bg-primary/5 hover:border-primary/40'
                                }`}
                            style={{ animationFillMode: 'forwards' }}
                        >
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${notification.read ? 'bg-muted' : 'bg-primary/15'
                                }`}>
                                <Bell className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <p className="font-semibold text-sm">{notification.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
                                <p className="text-xs text-muted-foreground/70 pt-1">{notification.time}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </section>

                {/* Empty state hint */}
                {mockNotifications.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                        <p className="text-muted-foreground">No notifications yet</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

