import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const isPassword = type === "password"

        return (
            <div className="relative">
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    className={cn(
                        "flex h-11 w-full rounded-lg border border-input bg-background/60 backdrop-blur-sm px-4 py-2 text-sm ring-offset-background",
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70",
                        "transition-all duration-300 ease-out",
                        "hover:border-primary/30 hover:bg-background/80",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50",
                        "focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.1),0_0_20px_hsl(var(--primary)/0.1)]",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
                        error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 cursor-pointer dark:text-zinc-400 dark:hover:text-zinc-300"
                    >
                        {showPassword ? (
                            <Eye className="h-4 w-4" />
                        ) : (
                            <EyeOff className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                        </span>
                    </button>
                )}
                {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
