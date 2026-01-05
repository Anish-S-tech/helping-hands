import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        const id = React.useId();

        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={id}
                    ref={ref}
                    className={cn(
                        'h-4 w-4 rounded border-slate-600 bg-slate-700 text-purple-500',
                        'focus:ring-2 focus:ring-purple-500 focus:ring-offset-0',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-colors cursor-pointer',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={id}
                        className="ml-2 text-sm font-medium text-slate-300 cursor-pointer"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
