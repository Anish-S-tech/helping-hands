'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    className?: string;
    label?: string;
    variant?: 'default' | 'ghost' | 'outline';
}

export function BackButton({
    className,
    label = 'Back',
    variant = 'ghost'
}: BackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant={variant}
            size="sm"
            onClick={() => router.back()}
            className={cn('gap-2', className)}
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
        </Button>
    );
}
