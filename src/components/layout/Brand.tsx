import { Link } from "react-router-dom";

export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="10" fill="#d4a373" />
      <path d="M9 13.5c4-1.6 7.6-1.2 11 1.2v14.6c-3.4-2.3-7-2.8-11-1.2Z" fill="#fffdf7" />
      <path d="M31 13.5c-4-1.6-7.6-1.2-11 1.2v14.6c3.4-2.3 7-2.8 11-1.2Z" fill="#fbf1e2" />
      <path d="M20 14.7v14.6" stroke="#8b5e34" strokeWidth="1.2" />
      <circle cx="27.5" cy="9.5" r="2.2" fill="#fffdf7" />
    </svg>
  );
}

export default function Brand({ to = "/", size = "md" }: { to?: string; size?: "sm" | "md" }) {
  return (
    <Link to={to} className="flex min-h-11 shrink-0 items-center gap-2" aria-label="하루동화 홈">
      <BrandMark className={size === "sm" ? "h-7 w-7" : "h-8 w-8"} />
      <span className={`font-display tracking-tight text-brown ${size === "sm" ? "text-base" : "text-lg"}`}>
        하루동화
      </span>
    </Link>
  );
}
