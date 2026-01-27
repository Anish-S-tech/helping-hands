'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  Package,
  ArrowRight,
  MapPin,
  Users as UsersIcon,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MOCK_PROJECTS } from '@/data/mock-data';

export default function HomePage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  // Get featured projects (first 6 open projects)
  const featuredProjects = MOCK_PROJECTS.filter(p => p.status === 'open').slice(0, 6);

  const handleProjectClick = (projectId: string) => {
    if (!user) {
      // Redirect to auth if not authenticated
      router.push(`/auth?redirect=/projects/${projectId}`);
    } else {
      router.push(`/projects/${projectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              HELPING HANDS
            </span>
            <Badge variant="premium" className="ml-2 text-[9px] font-bold">BETA</Badge>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-9 hidden md:flex" asChild>
              <Link href="/explore">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Explore Projects
              </Link>
            </Button>

            {user ? (
              <Button size="sm" className="h-9" asChild>
                <Link href={profile?.role_type === 'founder' ? '/founder/home' : '/builder/home'}>
                  Go to Dashboard <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-9 hidden md:flex" asChild>
                  <Link href="/auth">Login</Link>
                </Button>
                <Button variant="premium" size="sm" className="h-9" asChild>
                  <Link href="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Discover Amazing <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with founders, join innovative teams, and build the future together
            </p>
          </div>

          {/* Project Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all duration-300 overflow-hidden"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase">
                      {project.sector}
                    </Badge>
                    <Badge
                      variant={project.status === 'open' ? 'default' : 'outline'}
                      className="text-[10px] font-semibold"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </CardHeader>

                <CardContent className="relative space-y-4 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.vision}
                  </p>

                  {/* Project Info */}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{project.phase}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-3 w-3" />
                      <span>{project.member_count} / {project.team_size_needed} members</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills_needed.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-[10px] font-medium">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills_needed.length > 3 && (
                      <Badge variant="outline" className="text-[10px] font-medium">
                        +{project.skills_needed.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="relative pt-0 pb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center group-hover:bg-primary/10 transition-colors"
                  >
                    View Project
                    <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link href="/explore">
                <Sparkles className="mr-2 h-4 w-4" />
                View All Projects
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
