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
    violet: "bg-violet-100 text-violet-950 border-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500/40 font-bold",
    cyan: "bg-cyan-100 text-cyan-950 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-500/40 font-bold",
    emerald: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/40 font-bold",
    amber: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/40 font-bold",
    rose: "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-500/40 font-bold",
    slate: "bg-slate-200 text-slate-950 border-slate-300 dark:bg-slate-700/30 dark:text-slate-200 dark:border-slate-600/40 font-bold",
  };

  const sizes = {
    sm: "text-[11px] px-2.5 py-0.5 rounded-full gap-1.5",
    md: "text-xs px-3 py-1 rounded-full gap-1.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center border backdrop-blur-md shrink-0 select-none shadow-sm",
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
