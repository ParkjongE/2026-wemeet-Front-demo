import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
  size?: "md" | "lg" | "sm";
  loading?: boolean;
}

const VARIANT_CLASS = {
  primary: "bg-sand text-brown shadow-sm hover:bg-sand-strong active:bg-sand-strong",
  dark: "bg-brown text-white shadow-sm hover:bg-brown/90",
  secondary: "bg-white text-brown ring-1 ring-hairline shadow-sm hover:bg-sand-light",
  ghost: "bg-transparent text-brown/70 hover:bg-sand-light hover:text-brown",
  danger: "bg-white text-error ring-1 ring-error/30 hover:bg-error-light",
};

const SIZE_CLASS = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-5 text-[15px]",
  lg: "min-h-14 px-7 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
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
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:cursor-not-allowed disabled:opacity-45",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <LoaderCircle size={18} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
