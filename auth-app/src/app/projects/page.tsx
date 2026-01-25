'use client';

import { MainLayout } from '@/components/MainLayout';
import { MOCK_PROJECTS, MOCK_ACTIVE_PROJECTS } from '@/data/mock-data';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { ProjectPhase } from "@/data/mock-data";

export default function ProjectsPage() {
    const userProjects = MOCK_ACTIVE_PROJECTS;

    return (
        <MainLayout>
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Projects</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your active contributions and projects
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/projects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                        </Link>
                    </Button>
                </div>

                <section className="space-y-4">
                    <SectionHeader
                        title="Active Projects"
                        subtitle="Projects you're currently involved in"
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.project_id}
                                title={project.project_title}
                                description={`Role: ${project.role}`}
                                phase={project.phase as ProjectPhase}
                                variant="compact"
                                showActions={false}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
