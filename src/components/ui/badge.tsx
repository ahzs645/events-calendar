import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'default' | 'sm'
}

function Badge({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-300 focus:ring-offset-2",
        {
          'default': "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
          'secondary': "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
          'destructive': "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
          'outline': "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
        }[variant],
        {
          'default': "px-2.5 py-0.5 text-xs",
          'sm': "px-2 py-0.5 text-[10px]",
        }[size],
        className
      )}
      {...props}
    />
  )
}

export { Badge }