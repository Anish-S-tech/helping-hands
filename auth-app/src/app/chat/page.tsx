'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MessageSquare, ArrowRight, Loader2, Sparkles, Send, Users } from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { MOCK_ROOMS } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TooltipProvider } from '@/components/ui/tooltip';

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
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <ChatSidebar />

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
                {/* Background decorations - More dynamic */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[20%] right-[-5%] h-[30%] w-[30%] rounded-full bg-violet-500/10 blur-[100px] animate-bounce-slow" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                <div className="max-w-2xl w-full text-center relative z-10 space-y-12">
                    {/* Welcome Header */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent mb-4 shadow-2xl shadow-primary/20 ring-1 ring-primary/20 transform hover:scale-110 transition-transform duration-500">
                            <MessageSquare className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                            Your Communication Hub
                        </h1>
                        <p className="text-lg text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
                            Connect with founders, collaborate with teams, and build the future of technology in real-time.
                        </p>
                    </div>

                    {/* Quick Selection / Discovery */}
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        {/* Featured Channel */}
                        <Card className="group border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
                            onClick={() => suggestedRoom && router.push(`/chat/${suggestedRoom.id}`)}>
                            <CardContent className="p-6 flex flex-col text-left h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">Recommended</Badge>
                                </div>
                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Jump back in</h3>
                                <p className="text-sm text-muted-foreground mb-4">You have {directRooms.reduce((acc, r) => acc + r.unread_count, 0)} unread messages in your conversations.</p>
                                <Button className="mt-auto w-full group-hover:bg-primary transition-all rounded-xl" variant="secondary">
                                    Open Recent Chat
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Join Community */}
                        <Card className="group border-border/40 bg-card/40 backdrop-blur-md hover:border-violet-500/30 transition-all duration-300 cursor-pointer overflow-hidden">
                            <CardContent className="p-6 flex flex-col text-left h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-500">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <Avatar key={i} className="h-6 w-6 border-2 border-card">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=u${i}`} />
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold mb-1 group-hover:text-violet-500 transition-colors">Browse Channels</h3>
                                <p className="text-sm text-muted-foreground mb-4">Explore {MOCK_ROOMS.filter(r => r.type === 'project').length} project communities looking for collaborators.</p>
                                <Button className="mt-auto w-full group-hover:bg-violet-600 group-hover:text-white transition-all rounded-xl" variant="secondary">
                                    Explore Channels
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Builders (Visual element to make it feel alive) */}
                    <div className="pt-8 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-500">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Currently Active Builders</p>
                        <div className="flex items-center gap-4">
                            {MOCK_ROOMS.slice(0, 5).map((room, i) => (
                                <TooltipProvider key={i}>
                                    <div className="relative group">
                                        <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background group-hover:ring-primary transition-all cursor-pointer">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=chat${i}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                                    </div>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Connection Status - More Premium */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold tracking-tight uppercase">Encryption & Real-time Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
