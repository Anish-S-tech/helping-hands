'use client';

import { MainLayout } from '@/components/MainLayout';
import { MOCK_TEAM_MEMBERS } from '@/data/mock-data';
import { SectionHeader } from '@/components/SectionHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function TeamPage() {
    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Team</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your team members across all projects
                    </p>
                </div>

                <section className="space-y-4">
                    <SectionHeader
                        title="Team Members"
                        badge={{ label: `${MOCK_TEAM_MEMBERS.length} members`, variant: "secondary" }}
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MOCK_TEAM_MEMBERS.map((member) => (
                            <Link key={member.id} href={`/profile/${member.user_id}`}>
                                <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-all">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={member.avatar_url} />
                                        <AvatarFallback>
                                            {member.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{member.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                                    </div>
                                    <Badge variant={member.role_badge === 'founder' ? 'premium' : 'secondary'} className="text-[10px]">
                                        {member.role_badge}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
