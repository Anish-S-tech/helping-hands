'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Send,
    Loader2,
    MessageCircle,
    Lock,
    Check,
    CheckCheck,
    Phone,
    Video,
    MoreHorizontal,
    Smile,
    Paperclip,
    ArrowLeft
} from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { MOCK_MESSAGES, MOCK_ROOMS, formatRelativeTime } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    room_id: string;
    sender_id: string;
    sender_name: string;
    sender_role: 'founder' | 'user';
    sender_role_title: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

interface ChatRoom {
    id: string;
    name: string;
    type: 'project' | 'direct';
    project_id?: string;
    project_name?: string;
    is_archived?: boolean;
    members_count?: number;
}

export default function ChatRoomPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const { profile, supabase, loading: authLoading } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const isUserVerified = profile?.email_verified !== false;
    const canSendMessage = isUserVerified;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/auth');
            return;
        }

        if (roomId) {
            fetchRoomAndMessages();

            const typingInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 2000);
                }
            }, 10000);

            return () => clearInterval(typingInterval);
        }
    }, [roomId, profile, authLoading, router]);

    useEffect(scrollToBottom, [messages]);

    const fetchRoomAndMessages = async () => {
        setLoading(true);
        try {
            // Only get direct rooms
            const mockRoom = MOCK_ROOMS.find(r => r.id === roomId && r.type === 'direct');
            if (mockRoom) {
                setRoom({
                    id: mockRoom.id,
                    name: mockRoom.name,
                    type: mockRoom.type,
                    is_archived: mockRoom.is_archived,
                });
            }

            const mockMsgs = MOCK_MESSAGES[roomId as string] || [];
            setMessages(mockMsgs);
        } catch (error) {
            console.error('Error fetching chat data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !profile || sending || !canSendMessage) return;

        setSending(true);
        try {
            const newMsg: Message = {
                id: `new-${Date.now()}`,
                room_id: roomId as string,
                sender_id: profile.id,
                sender_name: profile.name || 'You',
                sender_role: profile.role_type === 'founder' ? 'founder' : 'user',
                sender_role_title: profile.role_type === 'founder' ? 'Founder' : 'Builder',
                content: newMessage.trim(),
                created_at: new Date().toISOString(),
                is_read: false
            };
            setMessages(prev => [...prev, newMsg]);
            setNewMessage('');
            inputRef.current?.focus();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatMessageDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const groupedMessages = messages.reduce((groups, message) => {
        const date = new Date(message.created_at).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {} as Record<string, Message[]>);

    if (loading || authLoading) {
        return (
            <div className="flex h-screen bg-background">
                <ChatSidebar activeRoomId={roomId as string} />
                <div className="flex-1 flex flex-col">
                    <div className="h-16 px-6 border-b flex items-center gap-4 bg-card/30">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="flex h-screen bg-background">
                <ChatSidebar activeRoomId={roomId as string} />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                        <MessageCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Conversation not found</h3>
                    <p className="text-sm text-muted-foreground mb-4">This conversation doesn't exist</p>
                    <Button asChild>
                        <Link href="/chat">Back to Messages</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-background overflow-hidden">
                <ChatSidebar activeRoomId={roomId as string} />

                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-16 px-6 border-b flex items-center justify-between bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm shrink-0">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Back button on mobile */}
                            <Button variant="ghost" size="icon" className="md:hidden" asChild>
                                <Link href="/chat">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>

                            <div className="relative">
                                <Avatar className="h-10 w-10 ring-2 ring-background">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${room.id}`} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 font-semibold">
                                        {room.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold">{room.name}</h2>
                                <p className="text-xs text-emerald-500 font-medium">Online</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Voice call</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Video className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Video call</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>More options</TooltipContent>
                            </Tooltip>
                        </div>
                    </header>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/5">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-8">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mb-6">
                                    <MessageCircle className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Start the conversation</h3>
                                <p className="text-sm text-muted-foreground text-center max-w-sm">
                                    Send a message to {room.name} to get the conversation going
                                </p>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto px-6 py-6">
                                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                    <div key={date}>
                                        {/* Date Separator */}
                                        <div className="flex items-center gap-4 my-6">
                                            <div className="flex-1 h-px bg-border/50" />
                                            <span className="text-[11px] font-medium text-muted-foreground px-3 py-1 rounded-full bg-muted/50">
                                                {formatMessageDate(dateMessages[0].created_at)}
                                            </span>
                                            <div className="flex-1 h-px bg-border/50" />
                                        </div>

                                        {/* Messages */}
                                        {dateMessages.map((message, index) => {
                                            const prevMessage = dateMessages[index - 1];
                                            const isGrouped = prevMessage &&
                                                prevMessage.sender_id === message.sender_id &&
                                                (new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000);
                                            const isOwnMessage = message.sender_id === profile?.id;

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={cn(
                                                        "group relative py-1",
                                                        !isGrouped && "mt-4",
                                                        isOwnMessage ? "flex justify-end" : "flex justify-start"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "flex gap-3 max-w-[75%]",
                                                        isOwnMessage && "flex-row-reverse"
                                                    )}>
                                                        {/* Avatar */}
                                                        <div className="w-9 shrink-0">
                                                            {!isGrouped && (
                                                                <Avatar className="h-9 w-9">
                                                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${message.sender_id}`} />
                                                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 text-xs font-semibold">
                                                                        {message.sender_name.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                        </div>

                                                        {/* Message Bubble */}
                                                        <div className={cn(
                                                            "flex flex-col",
                                                            isOwnMessage ? "items-end" : "items-start"
                                                        )}>
                                                            {!isGrouped && (
                                                                <div className={cn(
                                                                    "flex items-center gap-2 mb-1",
                                                                    isOwnMessage && "flex-row-reverse"
                                                                )}>
                                                                    <span className="text-sm font-semibold">
                                                                        {isOwnMessage ? 'You' : message.sender_name}
                                                                    </span>
                                                                    <Badge
                                                                        variant={message.sender_role === 'founder' ? 'premium' : 'secondary'}
                                                                        className="text-[9px] h-4 px-1.5"
                                                                    >
                                                                        {message.sender_role === 'founder' ? 'Founder' : 'Builder'}
                                                                    </Badge>
                                                                    <span className="text-[10px] text-muted-foreground">
                                                                        {formatMessageTime(message.created_at)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className={cn(
                                                                "px-4 py-2.5 rounded-2xl text-sm",
                                                                isOwnMessage
                                                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                                                    : "bg-muted/80 rounded-bl-md"
                                                            )}>
                                                                <p className="whitespace-pre-wrap leading-relaxed">
                                                                    {message.content}
                                                                </p>
                                                            </div>
                                                            {/* Read receipt for own messages */}
                                                            {isOwnMessage && (
                                                                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                                                    {message.is_read ? (
                                                                        <CheckCheck className="h-3.5 w-3.5 text-primary" />
                                                                    ) : (
                                                                        <Check className="h-3.5 w-3.5" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex items-center gap-3 py-4 animate-fade-in-up">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${room.id}`} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 text-xs font-semibold">
                                                {room.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="px-4 py-3 rounded-2xl bg-muted/80 rounded-bl-md">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-card/30">
                        <div className="max-w-3xl mx-auto">
                            {!canSendMessage ? (
                                <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl border border-dashed">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Verify your email to send messages
                                    </span>
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage}>
                                    <div className="flex items-end gap-3 bg-background border rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all shadow-sm">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                                                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Attach file</TooltipContent>
                                        </Tooltip>

                                        <textarea
                                            ref={inputRef}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={`Message ${room.name}...`}
                                            className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-sm placeholder:text-muted-foreground/50 min-h-[36px] max-h-32 py-2"
                                            rows={1}
                                        />

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                                                    <Smile className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Add emoji</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="submit"
                                                    size="icon"
                                                    className="h-9 w-9 shrink-0 rounded-xl"
                                                    disabled={!newMessage.trim() || sending}
                                                >
                                                    {sending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Send className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Send message</TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <p className="mt-2 text-[10px] text-muted-foreground text-center">
                                        Press Enter to send, Shift+Enter for new line
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
