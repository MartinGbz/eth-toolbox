import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputBigintProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputBigint = React.forwardRef<HTMLInputElement, InputBigintProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        onKeyDown={(e) => {
          if (/^[eE.\+\-]$/.test(e.key)) e.preventDefault(); // Prevents typing e, E, +, -, .
        }}
        onPaste={(e) => {
          if (!/^\d+$/.test(e.clipboardData.getData("text/plain")))
            e.preventDefault(); // Prevents pasting non-numeric values
        }}
        type="number"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputBigint.displayName = "InputBigint";

export { InputBigint };
