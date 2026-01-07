import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border border-white/30 bg-transparent pl-8 pr-10 py-5 text-center font-bold text-lg text-white transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Green bullet that expands on hover */}
      <span 
        className="absolute left-5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-bvbp-growth transition-all duration-500 ease-out group-hover:scale-[80] group-hover:left-0"
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {/* Spacer for bullet */}
        <span className="w-3" aria-hidden="true" />
        
        {/* Text */}
        <span className="whitespace-nowrap transition-colors duration-300">
          {text}
        </span>
        
        {/* Arrow - appears on hover */}
        <ArrowRight 
          className="h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" 
        />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
