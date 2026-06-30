import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium ring-offset-bvbp-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-gold/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-bvbp-ink/10 bg-transparent text-bvbp-ink hover:bg-bvbp-inset hover:text-bvbp-ink",
        secondary:
          "bg-bvbp-inset text-bvbp-ink hover:bg-bvbp-inset/80",
        ghost: "text-bvbp-ink hover:bg-bvbp-inset hover:text-bvbp-ink",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-white shadow-strong hover:shadow-success hover:scale-105 transform transition-bounce font-semibold",
        success: "bg-success text-success-foreground shadow-success hover:bg-success/90 hover:scale-105 transform transition-bounce font-semibold",
        corporate: "bg-bvbp-corporate text-white hover:bg-bvbp-corporate/90 transition-smooth font-semibold",
        "outline-hero": "border-2 border-bvbp-corporate text-bvbp-corporate bg-transparent hover:bg-bvbp-corporate hover:text-white transition-smooth",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[8px] px-3",
        lg: "h-11 rounded-[8px] px-8",
        xl: "h-14 rounded-[8px] px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
