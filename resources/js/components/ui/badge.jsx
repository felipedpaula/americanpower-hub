/** @jsxImportSource react */
import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
    outline: "text-foreground border border-input hover:bg-accent/50 shadow-xs dark:border-border",
    success: "bg-green-500/90 text-white hover:bg-green-600 shadow-sm dark:bg-green-600/80",
    warning: "bg-yellow-500/90 text-white hover:bg-yellow-600 shadow-sm dark:bg-yellow-600/80",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
