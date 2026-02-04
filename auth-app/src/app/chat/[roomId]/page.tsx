"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    Search,
    Info,
    ArrowLeft,
    Smile,
    Image as ImageIcon,
    FileText,
    Mic,
    Plus,
    Loader2,
    Users
} from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { MOCK_ROOMS, MOCK_MESSAGES, formatRelativeTime } from '@/data/mock-data';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    room_id: string;
    sender?: {
        full_name: string;
        avatar_url?: string;
    };
    attachments?: { name: string; size: string; type: string }[];
}

interface ChatRoom {
    id: string;
    name: string;
    type: 'project' | 'direct';
    members_count?: number;
    members?: any[];
}

export default function ChatRoomPage() {
    const params = useParams();
    const router = useRouter();
    const { profile, supabase } = useAuth();
    const roomId = params.roomId;

    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        if (profile !== undefined) {
            setAuthLoading(false);
        }
    }, [profile]);

    useEffect(() => {
        if (!authLoading && !profile) {
            // Redirect or handle unauthenticated state if needed, but for now just stop loading
            setLoading(false);
            return;
        }

        if (roomId && !authLoading) {
            fetchRoomData();
            subscribeToMessages();
        }
    }, [roomId, profile, authLoading]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchRoomData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Room Details
            const { data: roomData, error: roomError } = await supabase
                .from('chat_rooms')
                .select('*')
                .eq('id', roomId)
                .single();

            if (roomError) {
                // If not found in DB, try mock data for demo purposes
                const mockRoom = MOCK_ROOMS.find(r => r.id === roomId);
                if (mockRoom) {
                    setRoom(mockRoom as ChatRoom);
                    // Fetch mock messages correctly from Record
                    const roomMessages = MOCK_MESSAGES[roomId as string] || [];
                    // Add sender info to mock messages
                    const enrichedMessages = roomMessages.map((m: any) => ({
                        ...m,
                        sender: {
                            full_name: m.sender_id === profile?.id ? (profile?.name || 'You') : m.sender_name,
                            avatar_url: `https://i.pravatar.cc/150?u=${m.sender_id}`
                        }
                    }));
                    setMessages(enrichedMessages);
                } else {
                    console.error('Room not found');
                }
            } else {
                setRoom(roomData);

                // 2. Fetch Messages
                const { data: msgsData, error: msgsError } = await supabase
                    .from('messages')
                    .select('*, sender:sender_id(full_name, avatar_url)')
                    .eq('room_id', roomId)
                    .order('created_at', { ascending: true });

                if (msgsError) throw msgsError;
                setMessages(msgsData || []);
            }
        } catch (error) {
            console.error('Error fetching chat data:', error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    // Optimistically add, but ideally we need sender info.
                    // For now, if we sent it, we know who we are.
                    // If others sent it, we might need to fetch sender or just show unknown temporarily.
                    setMessages(prev => [...prev, newMsg]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !profile) return;

        setSending(true);
        try {
            const msgData = {
                room_id: roomId,
                sender_id: profile.id,
                content: newMessage,
            };

            const { data, error } = await supabase
                .from('messages')
                .insert(msgData)
                .select()
                .single();

            if (error) throw error;

            // Optimistic update done via subscription or manual append here if needed
            // For now relying on subscription or re-fetch fallback
            // Manually appending for immediate feedback if sub is slow, but sub handles it.
            // Actually, for instant feel:
            const optimisitcMsg: Message = {
                id: data.id,
                content: newMessage,
                sender_id: profile.id,
                created_at: new Date().toISOString(),
                room_id: roomId as string,
                sender: {
                    full_name: profile.name as string,
                    avatar_url: profile.avatar_url as string | undefined
                }
            };
            setMessages(prev => [...prev, optimisitcMsg]);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex h-screen bg-background text-foreground">
                <ChatSidebar activeRoomId={roomId as string} />
                <div className="flex-1 flex flex-col">
                    <div className="h-16 px-6 border-b border-border/40 flex items-center gap-4 bg-background">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-12 w-1/2" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="flex h-screen bg-background text-foreground">
                <ChatSidebar activeRoomId={roomId as string} />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <p className="text-muted-foreground">Room not found</p>
                </div>
            </div>
        );
    }

    const roomName = room.name || "Chat";
    // Sort messages by date
    const dateMessages = [...messages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const [showInfo, setShowInfo] = useState(false);
    const isProjectChat = room.type === 'project';

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
                {/* Sidebar - Hidden on mobile when in a room */}
                <div className="hidden lg:block w-70 xl:w-85 shrink-0 border-r border-border/40 bg-card/20 backdrop-blur-xl">
                    <ChatSidebar activeRoomId={roomId as string} />
                </div>

                <div className="flex-1 flex flex-col min-w-0 bg-background relative z-10">
                    {/* Header - Enterprise Premium */}
                    <header className="h-20 px-6 flex items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Mobile Back Button */}
                            <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground" onClick={() => router.push('/chat')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className={clsx(
                                        "h-11 w-11 border border-primary/20 shadow-lg shadow-primary/5",
                                        isProjectChat ? "rounded-xl" : "rounded-2xl"
                                    )}>
                                        <AvatarImage src={`https://avatar.vercel.sh/${roomName}`} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{roomName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background ring-1 ring-emerald-500/20" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-base font-bold leading-none flex items-center gap-2">
                                        {roomName}
                                        {isProjectChat && <Badge variant="secondary" className="text-[10px] h-4 bg-primary/10 text-primary border-0">Project</Badge>}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1.5 capitalize">
                                        <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {room.members_count || 2} members
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-border" />
                                        <span className="text-[10px] font-medium text-emerald-500">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-1 mr-4 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/40">
                                <Search className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                                <input
                                    placeholder="Search in chat..."
                                    className="bg-transparent border-0 text-[11px] focus:ring-0 w-32 placeholder:text-muted-foreground/50"
                                />
                            </div>
                            <Button
                                variant={showInfo ? "secondary" : "ghost"}
                                size="icon"
                                className="h-10 w-10 text-muted-foreground rounded-xl"
                                onClick={() => setShowInfo(!showInfo)}
                            >
                                <Info className="h-5 w-5" />
                            </Button>
                        </div>
                    </header>

                    {/* Messages Area - Modern Bubbles */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth bg-gradient-to-b from-background via-background to-muted/5">
                        {dateMessages.map((msg, index) => {
                            const isMe = msg.sender_id === profile?.id;
                            const prevMessage = dateMessages[index - 1];
                            const isSequence = prevMessage && prevMessage.sender_id === msg.sender_id && (new Date(msg.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000);

                            return (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        "flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300",
                                        isMe ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    {/* Avatar Column */}
                                    <div className="flex-shrink-0 w-10">
                                        {!isSequence && (
                                            <Avatar className="h-10 w-10 border border-border/40 shadow-sm transition-transform group-hover:scale-105">
                                                <AvatarImage src={msg.sender?.avatar_url} />
                                                <AvatarFallback className="bg-muted text-[10px] font-bold">{msg.sender?.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>

                                    {/* Content Column */}
                                    <div className={clsx(
                                        "flex flex-col max-w-[75%] lg:max-w-[65%]",
                                        isMe ? "items-end" : "items-start"
                                    )}>
                                        {!isSequence && (
                                            <div className={clsx(
                                                "flex items-center gap-2 mb-1 px-1",
                                                isMe ? "flex-row-reverse" : "flex-row"
                                            )}>
                                                <span className="text-[11px] font-bold text-foreground/80">
                                                    {isMe ? 'You' : msg.sender?.full_name}
                                                </span>
                                                <span className="text-[9px] text-muted-foreground font-medium">
                                                    {formatRelativeTime(msg.created_at)}
                                                </span>
                                            </div>
                                        )}

                                        <div className={clsx(
                                            "relative px-4 py-3 text-[13.5px] leading-relaxed shadow-sm transition-all group-hover:shadow-md",
                                            isMe
                                                ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                                                : "bg-card/40 backdrop-blur-md border border-border/40 text-foreground rounded-2xl rounded-tl-none"
                                        )}>
                                            {msg.content}

                                            {/* Hover timestamp or reactions could go here */}
                                        </div>

                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className={clsx(
                                                "flex flex-wrap gap-2 mt-2",
                                                isMe ? "justify-end" : "justify-start"
                                            )}>
                                                {msg.attachments.map((file, i) => (
                                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted/40 backdrop-blur-sm border border-border/20 rounded-xl hover:border-primary/40 transition-colors cursor-pointer group/file">
                                                        <FileText className="h-4 w-4 text-primary" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[11px] font-bold truncate forced-color-adjust-none">{file.name}</p>
                                                            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">{file.size}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area - Premium Float */}
                    <div className="p-6 bg-gradient-to-t from-background to-transparent relative z-20">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative bg-card/40 backdrop-blur-2xl border border-border/60 rounded-[1.5rem] shadow-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all p-2">
                                <div className="flex items-end gap-2 px-2 pb-2 pt-1">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/10 transition-colors">
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={`Message ${roomName}...`}
                                        className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none py-3 px-2 text-sm min-h-[44px] max-h-40 placeholder:text-muted-foreground/50 font-medium"
                                        rows={1}
                                    />
                                    <div className="flex items-center gap-2 mb-1">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-amber-500 rounded-xl hover:bg-amber-500/10 transition-colors hidden sm:flex">
                                            <Smile className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className={clsx(
                                                "h-10 w-10 rounded-xl shadow-lg transition-all transform active:scale-95",
                                                newMessage.trim()
                                                    ? "bg-primary text-primary-foreground scale-100"
                                                    : "bg-muted text-muted-foreground scale-90 opacity-50"
                                            )}
                                            onClick={(e) => handleSendMessage(e)}
                                            disabled={!newMessage.trim() || sending}
                                        >
                                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar - Toggleable */}
                {showInfo && (
                    <aside className="w-80 border-l border-border/40 bg-card/30 backdrop-blur-3xl p-6 flex flex-col gap-8 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">Details</h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setShowInfo(false)}>
                                <Plus className="h-4 w-4 rotate-45" />
                            </Button>
                        </div>

                        {/* Person / Project Profile */}
                        <div className="flex flex-col items-center text-center gap-4">
                            <Avatar className={clsx(
                                "h-24 w-24 border-4 border-primary/10 shadow-2xl",
                                isProjectChat ? "rounded-2xl" : "rounded-[2rem]"
                            )}>
                                <AvatarImage src={`https://avatar.vercel.sh/${roomName}?size=100`} />
                                <AvatarFallback className="text-2xl font-bold">{roomName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="text-xl font-bold">{roomName}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isProjectChat ? 'Project Group' : 'Software Engineer'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About</h5>
                                <p className="text-xs leading-relaxed text-muted-foreground/80">
                                    {isProjectChat
                                        ? "This is the main communication channel for the project development team."
                                        : "Experienced full-stack developer focusing on scalable distributed systems."}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resources</h5>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button variant="outline" size="sm" className="justify-start gap-2 h-9 text-xs border-border/40 hover:bg-background/50">
                                        <FileText className="h-3.5 w-3.5 text-primary" />
                                        Documentation
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start gap-2 h-9 text-xs border-border/40 hover:bg-background/50">
                                        <ImageIcon className="h-3.5 w-3.5 text-violet-500" />
                                        Shared Media
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Button variant="destructive" className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 text-xs h-10 rounded-xl">
                                Block / Leave Room
                            </Button>
                        </div>
                    </aside>
                )}
            </div>
        </TooltipProvider>
    );
}
