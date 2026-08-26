import React from "react";
import clsx from "clsx";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  interactive = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        interactive ? "glass-panel-interactive" : "glass-panel",
        glow && "hover:border-violet-500/50 hover:shadow-[0_10px_40px_rgba(139,92,246,0.25)]",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
