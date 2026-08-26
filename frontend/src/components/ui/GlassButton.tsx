import React from "react";
import clsx from "clsx";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-base rounded-2xl gap-2.5 font-medium",
  };

  const variantClasses = {
    primary: "liquid-btn-primary font-semibold",
    secondary: "liquid-btn-secondary font-semibold",
    ghost: "bg-transparent hover:bg-slate-500/10 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-transparent hover:border-slate-300 dark:hover:border-white/10 font-semibold",
    danger: "bg-red-500/15 hover:bg-red-500/25 text-red-800 dark:text-red-300 border border-red-500/30 font-semibold",
    emerald: "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 font-semibold",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
