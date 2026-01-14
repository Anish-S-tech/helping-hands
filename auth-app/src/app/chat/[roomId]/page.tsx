'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    Send,
    Loader2,
    Hash,
    Users,
    Lock,
    Archive,
    Check,
    CheckCheck
} from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { MOCK_MESSAGES, MOCK_ROOMS, MOCK_PROJECTS, MOCK_ANNOUNCEMENTS, formatRelativeTime } from '@/data/mock-data';
import { AnnouncementList } from '@/components/AnnouncementCard';
import { ProjectPhaseBadge } from '@/components/ProjectPhaseBadge';
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

    // Check if user can send messages
    const isUserVerified = profile?.email_verified !== false;
    const isProjectArchived = room?.is_archived || false;
    const canSendMessage = isUserVerified && !isProjectArchived;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!authLoading && !profile) {
            router.push('/login/user');
            return;
        }

        if (roomId) {
            fetchRoomAndMessages();

            // Simulate typing indicator occasionally
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
            // Find the mock room
            const mockRoom = MOCK_ROOMS.find(r => r.id === roomId);
            if (mockRoom) {
                // Get project info if it's a project room
                const project = mockRoom.project_id
                    ? MOCK_PROJECTS.find(p => p.id === mockRoom.project_id)
                    : null;

                setRoom({
                    id: mockRoom.id,
                    name: mockRoom.name,
                    type: mockRoom.type,
                    project_id: mockRoom.project_id,
                    project_name: project?.title || mockRoom.project_name,
                    is_archived: mockRoom.is_archived,
                    members_count: mockRoom.members_count
                });
            }

            // Get messages
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
            // Simulate sending
            const newMsg: Message = {
                id: `new-${Date.now()}`,
                room_id: roomId as string,
                sender_id: profile.id,
                sender_name: profile.name || 'You',
                sender_role: profile.role_type === 'founder' ? 'founder' : 'user',
                sender_role_title: profile.role_type === 'founder' ? 'Founder' : 'Member',
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

    // Group messages by date
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
                    <div className="h-14 px-6 border-b flex items-center gap-4 bg-card/30">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
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

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-background overflow-hidden">
                <ChatSidebar activeRoomId={roomId as string} />

                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-14 px-6 border-b flex items-center justify-between bg-card/30 shrink-0">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                                    <Hash className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold">
                                        {room?.type === 'project'
                                            ? room.name.toLowerCase().replace(/\s+/g, '-')
                                            : room?.name
                                        }
                                    </h2>
                                    {room?.project_name && (
                                        <p className="text-xs text-muted-foreground">{room.project_name}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {room?.members_count && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span className="text-xs font-medium">{room.members_count}</span>
                                </div>
                            )}
                            {isProjectArchived && (
                                <Badge variant="secondary" className="text-[10px]">
                                    <Archive className="h-3 w-3 mr-1" />
                                    Archived
                                </Badge>
                            )}
                        </div>
                    </header>

                    {/* Pinned Announcements Banner */}
                    {room?.project_id && MOCK_ANNOUNCEMENTS.filter(a => a.project_id === room.project_id && a.is_pinned).length > 0 && (
                        <div className="px-6 py-3 border-b bg-primary/5">
                            <AnnouncementList
                                announcements={MOCK_ANNOUNCEMENTS}
                                projectId={room.project_id}
                                pinnedOnly={true}
                                maxItems={1}
                                compact={true}
                            />
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-8">
                                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                                    <Hash className="w-7 h-7 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">No messages yet</h3>
                                <p className="text-sm text-muted-foreground">Be the first to start the conversation</p>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto px-6 py-4">
                                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                    <div key={date}>
                                        {/* Date Separator */}
                                        <div className="flex items-center gap-4 my-6">
                                            <div className="flex-1 h-px bg-border" />
                                            <span className="text-xs font-medium text-muted-foreground px-2">
                                                {formatMessageDate(dateMessages[0].created_at)}
                                            </span>
                                            <div className="flex-1 h-px bg-border" />
                                        </div>

                                        {/* Messages for this date */}
                                        {dateMessages.map((message, index) => {
                                            const prevMessage = dateMessages[index - 1];
                                            const isGrouped = prevMessage &&
                                                prevMessage.sender_id === message.sender_id &&
                                                (new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000);

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={cn(
                                                        "group relative py-1.5 px-3 -mx-3 rounded-lg hover:bg-muted/30 transition-colors",
                                                        !isGrouped && "mt-4"
                                                    )}
                                                >
                                                    {/* Message Block */}
                                                    <div className="flex gap-4">
                                                        {/* Avatar or Time */}
                                                        <div className="w-10 shrink-0 flex justify-center">
                                                            {!isGrouped ? (
                                                                <Avatar className="h-10 w-10 rounded-lg">
                                                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${message.sender_id}`} />
                                                                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                                                                        {message.sender_name.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ) : (
                                                                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                                                                    {formatMessageTime(message.created_at)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            {!isGrouped && (
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm font-semibold">
                                                                        {message.sender_name}
                                                                    </span>
                                                                    <Badge
                                                                        variant={message.sender_role === 'founder' ? 'premium' : 'secondary'}
                                                                        className="text-[9px] h-4 px-1.5"
                                                                    >
                                                                        {message.sender_role === 'founder' ? 'Founder' : 'Member'}
                                                                    </Badge>
                                                                    <span className="text-[11px] text-muted-foreground">
                                                                        {formatMessageTime(message.created_at)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                                                {message.content}
                                                            </p>
                                                        </div>

                                                        {/* Read Receipts */}
                                                        <div className="w-5 shrink-0 flex items-end justify-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {message.is_read ? (
                                                                <CheckCheck className="h-3.5 w-3.5 text-primary" />
                                                            ) : (
                                                                <Check className="h-3.5 w-3.5 text-muted-foreground" />
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
                                    <div className="flex items-center gap-3 py-2 px-3 animate-fade-in-up">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-xs text-muted-foreground">Someone is typing...</span>
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
                                <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg border border-dashed">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {!isUserVerified
                                            ? "Verify your email to send messages"
                                            : "This project has been archived"
                                        }
                                    </span>
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage}>
                                    <div className="flex items-end gap-3 bg-background border rounded-xl p-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-all">
                                        <textarea
                                            ref={inputRef}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={`Message ${room?.type === 'project' ? '#' : ''}${room?.name.toLowerCase().replace(/\s+/g, '-') || 'channel'}...`}
                                            className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-sm placeholder:text-muted-foreground/50 min-h-[24px] max-h-32"
                                            rows={1}
                                        />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 shrink-0"
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
