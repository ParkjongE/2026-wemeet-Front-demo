import { Link } from "react-router-dom";

export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src="/images/haru-book-stack.png"
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      className={`object-contain ${className}`}
    />
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
