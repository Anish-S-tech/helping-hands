"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    MessageCircle,
    Search,
    ArrowLeft,
    Plus,
    Settings,
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

    const [activeTab, setActiveTab] = useState<'all' | 'channels' | 'direct'>('all');

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
                finalRooms = dbRooms.map(r => ({
                    id: r.id,
                    name: r.name,
                    type: r.project_id ? 'project' : 'direct',
                    project_id: r.project_id,
                    unread_count: 0, // Placeholder
                    updated_at: r.updated_at || r.created_at
                }));
            } else {
                finalRooms = MOCK_ROOMS;
            }
            finalRooms.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            setRooms(finalRooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms(MOCK_ROOMS);
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = rooms.filter(r => {
        const matchesSearch = searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'channels' && r.type === 'project') ||
            (activeTab === 'direct' && r.type === 'direct');
        return matchesSearch && matchesTab;
    });

    const totalUnread = rooms.reduce((acc, r) => acc + r.unread_count, 0);

    return (
        <aside className="w-80 h-screen border-r border-border/40 bg-card/50 backdrop-blur-xl flex flex-col shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-border/40 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text">Messages</h1>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-dashed bg-background/50">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="pl-9 h-10 text-sm bg-background/30 border-border/40 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all"
                    />
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-muted/30 rounded-lg backdrop-blur-sm">
                    {(['all', 'channels', 'direct'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all capitalize",
                                activeTab === tab
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                {loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center px-6 opacity-60">
                        <MessageCircle className="h-8 w-8 mb-2 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground italic">No conversations found</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredRooms.map((room) => {
                            const isActive = activeRoomId === room.id;
                            const hasUnread = room.unread_count > 0;
                            const isProject = room.type === 'project';

                            return (
                                <Link
                                    key={room.id}
                                    href={`/chat/${room.id}`}
                                    className={cn(
                                        "group flex items-center gap-3 p-3 rounded-2xl transition-all relative overflow-hidden",
                                        isActive
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
                                    )}
                                >
                                    {/* Active Highlight */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                    )}

                                    <div className="relative shrink-0">
                                        <Avatar className={cn(
                                            "h-12 w-12 transition-transform group-hover:scale-105",
                                            isProject ? "rounded-xl" : "rounded-2xl"
                                        )}>
                                            <AvatarImage src={isProject ? undefined : `https://i.pravatar.cc/150?u=${room.id}`} />
                                            <AvatarFallback className={cn(
                                                "font-bold text-sm",
                                                isProject ? "bg-violet-500/10 text-violet-500" : "bg-primary/10 text-primary"
                                            )}>
                                                {room.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* Status / Type Indicator */}
                                        <span className={cn(
                                            "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
                                            hasUnread ? "bg-primary" : "bg-emerald-500"
                                        )} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={cn(
                                                "text-sm truncate leading-none",
                                                hasUnread || isActive ? "font-bold text-foreground" : "font-medium"
                                            )}>
                                                {room.name}
                                            </p>
                                            {room.last_message_time && (
                                                <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                                                    {formatRelativeTime(room.last_message_time)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs truncate text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors">
                                            {room.last_message || "No messages yet"}
                                        </p>
                                    </div>

                                    {hasUnread && (
                                        <Badge className="h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground font-bold text-[10px] flex items-center justify-center">
                                            {room.unread_count}
                                        </Badge>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer - Minimal */}
            <div className="p-3 border-t border-border/40 bg-muted/20">
                <Link
                    href={profile?.role_type === 'founder' ? '/founder/home' : '/builder/home'}
                    className="flex w-full items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground py-2 hover:bg-muted/50 rounded-md transition-colors"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Workspace
                </Link>
            </div>
        </aside>
    );
}
