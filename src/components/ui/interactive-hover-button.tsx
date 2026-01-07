import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  hoverColor?: "green" | "white";
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", hoverColor = "green", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-full border border-white/30 bg-transparent px-8 py-4 text-center font-bold text-lg text-white transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Default state text */}
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      {/* Hover state content */}
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span className={cn(
          hoverColor === "green" ? "text-white" : "text-bvbp-corporate"
        )}>
          {text}
        </span>
        <ArrowRight className={cn(
          "h-5 w-5",
          hoverColor === "green" ? "text-white" : "text-bvbp-corporate"
        )} />
      </div>

      {/* Background that slides up on hover */}
      <div
        className={cn(
          "absolute left-[0%] top-[40%] -z-10 h-full w-full -translate-x-[0%] translate-y-[0%] scale-x-0 scale-y-0 rounded-lg transition-transform duration-300 group-hover:scale-x-100 group-hover:scale-y-100 group-hover:top-[0%]",
          hoverColor === "green" ? "bg-bvbp-growth" : "bg-white"
        )}
      />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
