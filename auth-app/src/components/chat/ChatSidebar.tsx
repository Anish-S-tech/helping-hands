'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    MessageCircle,
    Search,
    ArrowLeft,
    Circle,
    Plus,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import { MOCK_ROOMS, formatRelativeTime } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatRoom {
    id: string;
    name: string;
    type: 'project' | 'direct';
    project_id?: string;
    project_name?: string;
    last_message?: string;
    last_message_time?: string;
    unread_count: number;
    updated_at: string;
    is_archived?: boolean;
    members_count?: number;
}

export default function ChatSidebar({ activeRoomId }: { activeRoomId?: string }) {
    const { profile, supabase } = useAuth();
    const pathname = usePathname();

    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRooms();
    }, [profile]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const { data: dbRooms } = await supabase
                .from('chat_rooms')
                .select('*')
                .order('created_at', { ascending: false });

            let finalRooms: ChatRoom[] = [];
            if (dbRooms && dbRooms.length > 0) {
                // Only get direct (1-to-1) rooms
                finalRooms = dbRooms
                    .filter(r => !r.project_id)
                    .map(r => ({
                        id: r.id,
                        name: r.name,
                        type: 'direct' as const,
                        unread_count: 0,
                        updated_at: r.updated_at || r.created_at
                    }));
            } else {
                // Only get direct rooms from mock data
                finalRooms = MOCK_ROOMS.filter(r => r.type === 'direct');
            }
            finalRooms.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            setRooms(finalRooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms(MOCK_ROOMS.filter(r => r.type === 'direct'));
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = rooms.filter(r =>
        searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUnread = rooms.reduce((acc, r) => acc + r.unread_count, 0);

    return (
        <aside className="w-80 h-screen border-r bg-gradient-to-b from-card/80 to-background flex flex-col shrink-0">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/20">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Messages</h1>
                            <p className="text-xs text-muted-foreground">
                                {rooms.length} conversation{rooms.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    {totalUnread > 0 && (
                        <Badge className="h-6 px-2 text-xs font-bold bg-primary shadow-lg shadow-primary/30">
                            {totalUnread}
                        </Badge>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="pl-9 h-10 text-sm bg-background/50 border-border/50 rounded-xl"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto py-3">
                {loading ? (
                    <div className="space-y-2 px-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-36" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                            <MessageCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-1">No conversations yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Start chatting with founders or builders on projects
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1 px-2">
                        {filteredRooms.map((room) => {
                            const isActive = activeRoomId === room.id;
                            const hasUnread = room.unread_count > 0;

                            return (
                                <Link
                                    key={room.id}
                                    href={`/chat/${room.id}`}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl transition-all group",
                                        isActive
                                            ? "bg-primary/10 shadow-sm"
                                            : "hover:bg-muted/50"
                                    )}
                                >
                                    {/* Avatar with online indicator */}
                                    <div className="relative">
                                        <Avatar className={cn(
                                            "h-12 w-12 ring-2 transition-all",
                                            isActive ? "ring-primary/30" : "ring-transparent"
                                        )}>
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${room.id}`} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 text-sm font-bold">
                                                {room.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* Online indicator */}
                                        <span className={cn(
                                            "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card",
                                            Math.random() > 0.5 ? "bg-emerald-500" : "bg-muted"
                                        )} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <p className={cn(
                                                "text-sm truncate",
                                                hasUnread ? "font-bold text-foreground" : "font-medium",
                                                isActive && "text-primary"
                                            )}>
                                                {room.name}
                                            </p>
                                            {room.last_message_time && (
                                                <span className={cn(
                                                    "text-[10px] shrink-0",
                                                    hasUnread ? "text-primary font-medium" : "text-muted-foreground"
                                                )}>
                                                    {formatRelativeTime(room.last_message_time)}
                                                </span>
                                            )}
                                        </div>
                                        {room.last_message && (
                                            <p className={cn(
                                                "text-xs truncate",
                                                hasUnread ? "text-foreground/80" : "text-muted-foreground"
                                            )}>
                                                {room.last_message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unread badge */}
                                    {hasUnread && (
                                        <Badge className="h-5 min-w-5 px-1.5 text-[10px] font-bold shrink-0 bg-primary shadow-sm">
                                            {room.unread_count}
                                        </Badge>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/5">
                <div className="flex items-center justify-between">
                    <Link
                        href={profile?.role_type === 'founder' ? '/founder/home' : '/builder/home'}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-medium text-emerald-600">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
