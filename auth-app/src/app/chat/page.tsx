'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { MOCK_ROOMS } from '@/data/mock-data';

export default function ChatListPage() {
    const router = useRouter();
    const { profile, loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="flex h-screen bg-background">
                <div className="w-72 border-r bg-card/30" />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!profile) {
        router.push('/login');
        return null;
    }

    // Find a room with unread messages to suggest
    const suggestedRoom = MOCK_ROOMS.find(r => r.unread_count > 0) || MOCK_ROOMS[0];

    return (
        <div className="flex h-screen bg-background text-foreground">
            <ChatSidebar />

            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-6">
                        <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>

                    <h1 className="text-xl font-semibold mb-2">Select a conversation</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Choose a project channel or direct message from the sidebar to start collaborating.
                    </p>

                    {suggestedRoom && (
                        <button
                            onClick={() => router.push(`/chat/${suggestedRoom.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            {suggestedRoom.unread_count > 0 ? (
                                <>Open {suggestedRoom.name} ({suggestedRoom.unread_count} unread)</>
                            ) : (
                                <>Open {suggestedRoom.name}</>
                            )}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Connection Status */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Real-time sync active</span>
                </div>
            </div>
        </div>
    );
}
