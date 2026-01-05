'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, LayoutDashboard, Rocket, MessageSquare,
    Plus, Settings, Command, X, ArrowRight, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { profile } = useAuth();

    const toggle = useCallback(() => setIsOpen(open => !open), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle, isOpen]);

    const navigate = (path: string) => {
        router.push(path);
        setIsOpen(false);
        setSearch('');
    };

    if (!isOpen) return null;

    const items = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: profile?.role_type === 'founder' ? '/dashboard/founder' : '/dashboard/builder',
            description: 'View your project overview'
        },
        {
            icon: Rocket,
            label: 'Explore Projects',
            path: '/explore',
            description: 'Find new opportunities'
        },
        {
            icon: MessageSquare,
            label: 'Messages',
            path: '/chat',
            description: 'Open communication hub'
        },
        {
            icon: Plus,
            label: 'Create Project',
            path: '/projects/create',
            description: 'Start a new mission'
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/settings',
            description: 'Manage your profile'
        },
    ];

    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-slate-800 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Search Input */}
                <div className="flex items-center px-6 py-5 border-b border-slate-900 group">
                    <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors mr-4" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-white text-lg placeholder:text-slate-700 focus:outline-none font-medium"
                    />
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 border border-slate-900 rounded-lg text-slate-600 text-[10px] font-bold">
                        ESC
                    </div>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto max-h-[60vh] p-3 custom-scrollbar">
                    {filteredItems.length === 0 ? (
                        <div className="py-12 text-center">
                            <Command className="w-12 h-12 text-slate-900 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium">No commands found for "{search}"</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="px-3 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-1">
                                Quick Navigation
                            </div>
                            {filteredItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(item.path)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-900 hover:border-blue-500/30 border border-transparent transition-all group text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors leading-none mb-1">{item.label}</p>
                                            <p className="text-xs text-slate-600 font-medium leading-none">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight className="w-4 h-4 text-blue-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Insight */}
                <div className="px-6 py-4 bg-slate-950 border-t border-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-4 h-4 border border-slate-800 rounded bg-black text-slate-600 text-[9px] font-bold">↵</span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Select</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-4 h-4 border border-slate-800 rounded bg-black text-slate-600 text-[9px] font-bold">↑↓</span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Navigate</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 italic text-[10px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Collective Intelligence v1.0
                    </div>
                </div>
            </div>
        </div>
    );
}
