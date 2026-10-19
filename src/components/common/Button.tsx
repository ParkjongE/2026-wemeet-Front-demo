import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
}

const VARIANT_CLASS = {
  primary: "bg-coral text-white shadow-sm hover:bg-coral-deep",
  secondary: "bg-mint text-brown shadow-sm hover:bg-mint/80",
  ghost: "bg-white/70 text-brown hover:bg-mint-light",
  danger: "bg-white text-coral-deep ring-1 ring-coral/50 hover:bg-coral-light",
};

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-story transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASS[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <LoaderCircle size={18} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
