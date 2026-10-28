import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  backTo?: string;
  actions?: ReactNode;
  eyebrow?: string;
}

export default function PageHeader({ title, description, backTo, actions, eyebrow }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        {backTo && (
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="-ml-2 mb-2 flex min-h-10 items-center gap-0.5 rounded-xl px-2 text-sm font-medium text-brown/55 transition-colors hover:bg-sand-light hover:text-brown"
          >
            <ChevronLeft size={18} aria-hidden />
            뒤로
          </button>
        )}
        {eyebrow && <p className="mb-1 text-sm font-semibold text-sand-ink">{eyebrow}</p>}
        <h1 className="font-display text-2xl leading-snug text-brown sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 text-[15px] leading-relaxed text-brown/60">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
