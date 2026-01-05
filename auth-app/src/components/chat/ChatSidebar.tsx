'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    Hash,
    MessageCircle,
    ChevronDown,
    Search,
    ArrowLeft,
    Circle
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
    const [showChannels, setShowChannels] = useState(true);
    const [showDMs, setShowDMs] = useState(true);

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
                    unread_count: 0,
                    updated_at: r.updated_at || r.created_at
                }));
            } else {
                finalRooms = MOCK_ROOMS;
            }
            // Sort by updated_at
            finalRooms.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            setRooms(finalRooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms(MOCK_ROOMS);
        } finally {
            setLoading(false);
        }
    };

    const projectRooms = rooms.filter(r => r.type === 'project');
    const directRooms = rooms.filter(r => r.type === 'direct');

    const filteredProjectRooms = projectRooms.filter(r =>
        searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredDirectRooms = directRooms.filter(r =>
        searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUnread = rooms.reduce((acc, r) => acc + r.unread_count, 0);

    return (
        <aside className="w-72 h-screen border-r bg-card/30 flex flex-col shrink-0">
            {/* Header */}
            <div className="h-14 px-4 border-b flex items-center justify-between shrink-0">
                <Link
                    href={profile?.role_type === 'founder' ? '/dashboard/founder' : '/dashboard/builder'}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Dashboard</span>
                </Link>
                {totalUnread > 0 && (
                    <Badge variant="default" className="h-5 px-1.5 text-[10px] font-bold">
                        {totalUnread}
                    </Badge>
                )}
            </div>

            {/* Search */}
            <div className="p-3 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="pl-9 h-9 text-sm bg-background"
                    />
                </div>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto py-2">
                {loading ? (
                    <div className="space-y-2 px-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Project Channels Section */}
                        <div className="mb-2">
                            <button
                                onClick={() => setShowChannels(!showChannels)}
                                className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Hash className="h-3.5 w-3.5" />
                                    Project Channels
                                </span>
                                <ChevronDown className={cn("h-3 w-3 transition-transform", !showChannels && "-rotate-90")} />
                            </button>
                            {showChannels && (
                                <div className="space-y-0.5 px-2">
                                    {filteredProjectRooms.map((room) => (
                                        <Link
                                            key={room.id}
                                            href={`/chat/${room.id}`}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                                                activeRoomId === room.id
                                                    ? "bg-primary/10 text-foreground"
                                                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                                                activeRoomId === room.id ? "bg-primary/20 text-primary" : "bg-muted"
                                            )}>
                                                <Hash className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={cn(
                                                        "text-sm truncate",
                                                        room.unread_count > 0 ? "font-semibold text-foreground" : "font-medium"
                                                    )}>
                                                        {room.name.toLowerCase().replace(/\s+/g, '-')}
                                                    </p>
                                                    {room.last_message_time && (
                                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                                            {formatRelativeTime(room.last_message_time)}
                                                        </span>
                                                    )}
                                                </div>
                                                {room.last_message && (
                                                    <p className={cn(
                                                        "text-xs truncate mt-0.5",
                                                        room.unread_count > 0 ? "text-foreground/70" : "text-muted-foreground"
                                                    )}>
                                                        {room.last_message}
                                                    </p>
                                                )}
                                            </div>
                                            {room.unread_count > 0 && (
                                                <Badge variant="default" className="h-5 min-w-5 px-1.5 text-[10px] font-bold shrink-0">
                                                    {room.unread_count}
                                                </Badge>
                                            )}
                                        </Link>
                                    ))}
                                    {filteredProjectRooms.length === 0 && (
                                        <p className="px-3 py-2 text-xs text-muted-foreground">No channels found</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Direct Messages Section */}
                        <div>
                            <button
                                onClick={() => setShowDMs(!showDMs)}
                                className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    Direct Messages
                                </span>
                                <ChevronDown className={cn("h-3 w-3 transition-transform", !showDMs && "-rotate-90")} />
                            </button>
                            {showDMs && (
                                <div className="space-y-0.5 px-2">
                                    {filteredDirectRooms.map((room) => (
                                        <Link
                                            key={room.id}
                                            href={`/chat/${room.id}`}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                                                activeRoomId === room.id
                                                    ? "bg-primary/10 text-foreground"
                                                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <div className="relative">
                                                <Avatar className="h-9 w-9 rounded-lg">
                                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${room.id}`} />
                                                    <AvatarFallback className="rounded-lg bg-muted text-[10px] font-bold">
                                                        {room.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* Online indicator - mocked */}
                                                <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-card" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={cn(
                                                        "text-sm truncate",
                                                        room.unread_count > 0 ? "font-semibold text-foreground" : "font-medium"
                                                    )}>
                                                        {room.name}
                                                    </p>
                                                    {room.last_message_time && (
                                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                                            {formatRelativeTime(room.last_message_time)}
                                                        </span>
                                                    )}
                                                </div>
                                                {room.last_message && (
                                                    <p className={cn(
                                                        "text-xs truncate mt-0.5",
                                                        room.unread_count > 0 ? "text-foreground/70" : "text-muted-foreground"
                                                    )}>
                                                        {room.last_message}
                                                    </p>
                                                )}
                                            </div>
                                            {room.unread_count > 0 && (
                                                <Badge variant="default" className="h-5 min-w-5 px-1.5 text-[10px] font-bold shrink-0">
                                                    {room.unread_count}
                                                </Badge>
                                            )}
                                        </Link>
                                    ))}
                                    {filteredDirectRooms.length === 0 && (
                                        <p className="px-3 py-2 text-xs text-muted-foreground">No conversations found</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Footer Status */}
            <div className="p-3 border-t bg-muted/10">
                <div className="flex items-center gap-2">
                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Connected
                    </span>
                </div>
            </div>
        </aside>
    );
}
