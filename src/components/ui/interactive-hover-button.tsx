import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "secondary";
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", variant = "secondary", className, ...props }, ref) => {
  const isPrimary = variant === "primary";

  return (
    <button
      ref={ref}
      className={cn(
        "group relative h-14 min-w-[220px] cursor-pointer overflow-hidden rounded-full border px-6 text-center text-base font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bvbp-corporate",
        isPrimary
          ? "border-bvbp-growth bg-bvbp-growth text-white shadow-success hover:border-white/80"
          : "border-white/45 bg-white/5 text-white hover:border-bvbp-growth",
        className
      )}
      {...props}
    >
      <span 
        className={cn(
          "absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-all duration-500 ease-out group-hover:left-0 group-hover:scale-[90]",
          isPrimary ? "bg-white" : "bg-bvbp-growth"
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-1",
          isPrimary ? "group-hover:text-bvbp-corporate" : "group-hover:text-white"
        )}
      >
        <span className="w-2.5 transition-all duration-300 group-hover:w-0" aria-hidden="true" />

        <span className="whitespace-nowrap transition-colors duration-300">
          {text}
        </span>

        <ArrowRight 
          className="h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" 
        />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
