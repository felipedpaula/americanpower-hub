/** @jsxImportSource react */
import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 dark:hover:bg-primary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 dark:hover:bg-destructive/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95 dark:border-border dark:hover:bg-secondary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 dark:hover:bg-secondary/60",
    ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95 dark:hover:bg-secondary",
    link: "text-primary underline-offset-4 hover:underline dark:text-blue-400",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
