import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const alertVariants = cva(
    'relative w-full rounded-xl border p-4',
    {
        variants: {
            variant: {
                default: 'bg-slate-800/50 border-slate-700 text-white',
                success: 'bg-green-500/10 border-green-500/30 text-green-300',
                warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
                error: 'bg-red-500/10 border-red-500/30 text-red-300',
                info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const iconMap = {
    default: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
};

export interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
    dismissible?: boolean;
    onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, dismissible, onDismiss, children, ...props }, ref) => {
        const Icon = iconMap[variant || 'default'];

        return (
            <div
                ref={ref}
                role="alert"
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                <div className="flex gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">{children}</div>
                    {dismissible && (
                        <button
                            onClick={onDismiss}
                            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <h5
                ref={ref}
                className={cn('mb-1 font-medium leading-none tracking-tight', className)}
                {...props}
            />
        );
    }
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('text-sm opacity-90', className)}
                {...props}
            />
        );
    }
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
