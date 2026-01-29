'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MessageSquare, ArrowRight, Loader2, Sparkles, Send, Users } from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { MOCK_ROOMS } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ChatListPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="flex h-screen bg-background">
                <div className="w-80 border-r bg-card/30" />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!profile) {
        router.push('/auth');
        return null;
    }

    // Find direct message rooms only
    const directRooms = MOCK_ROOMS.filter(r => r.type === 'direct');
    const suggestedRoom = directRooms.find(r => r.unread_count > 0) || directRooms[0];

    return (
        <div className="flex h-screen bg-background text-foreground">
            <ChatSidebar />

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
                    <div className="absolute bottom-1/4 -left-20 h-60 w-60 rounded-full bg-violet-500/5 blur-[80px]" />
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                            backgroundSize: '32px 32px'
                        }}
                    />
                </div>

                <div className="max-w-lg text-center relative z-10">
                    {/* Icon with gradient */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 mb-8 shadow-xl shadow-primary/10">
                        <MessageSquare className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight mb-3">
                        Select a Conversation
                    </h1>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                        Choose a conversation from the sidebar to start chatting with founders and builders.
                    </p>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <Card className="border-border/50 bg-card/50">
                            <CardContent className="p-4 text-center">
                                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                                <p className="text-2xl font-bold">{directRooms.length}</p>
                                <p className="text-xs text-muted-foreground">Conversations</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 bg-card/50">
                            <CardContent className="p-4 text-center">
                                <Send className="h-6 w-6 text-violet-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold">
                                    {directRooms.reduce((acc, r) => acc + r.unread_count, 0)}
                                </p>
                                <p className="text-xs text-muted-foreground">Unread</p>
                            </CardContent>
                        </Card>
                    </div>

                    {suggestedRoom && (
                        <Button
                            onClick={() => router.push(`/chat/${suggestedRoom.id}`)}
                            className="gap-2 shadow-lg shadow-primary/20"
                            size="lg"
                        >
                            {suggestedRoom.unread_count > 0 ? (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Open {suggestedRoom.name} ({suggestedRoom.unread_count} new)
                                </>
                            ) : (
                                <>
                                    Open {suggestedRoom.name}
                                </>
                            )}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Connection Status */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] text-muted-foreground font-medium">Real-time sync active</span>
                </div>
            </div>
        </div>
    );
}
