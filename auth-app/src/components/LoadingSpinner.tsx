'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fullScreen?: boolean;
    text?: string;
}

export function LoadingSpinner({
    size = 'md',
    className,
    fullScreen = false,
    text,
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const spinner = (
        <div className={cn('flex flex-col items-center gap-3', className)}>
            <Loader2 className={cn('text-purple-400 animate-spin', sizeClasses[size])} />
            {text && <p className="text-slate-400 text-sm">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
}
