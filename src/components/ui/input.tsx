import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised px-3 py-2 text-base text-bvbp-ink ring-offset-bvbp-ivory file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-bvbp-ink placeholder:text-bvbp-muted-ink/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-gold/35 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
