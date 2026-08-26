import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "violet" | "cyan" | "emerald" | "amber" | "rose" | "slate";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "violet",
  size = "md",
  icon,
  className,
}) => {
  const variants = {
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    slate: "bg-slate-700/30 text-slate-300 border-slate-600/30",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 rounded-full gap-1",
    md: "text-xs px-2.5 py-1 rounded-full gap-1.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium border backdrop-blur-md shrink-0 select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
