import { CircleAlert, CircleCheck, Hourglass, LoaderCircle } from "lucide-react";
import type { StorybookStatus } from "../../types";

const STATUS: Record<StorybookStatus, { label: string; icon: typeof Hourglass; className: string }> = {
  queued: { label: "준비 중", icon: Hourglass, className: "bg-yellow-light text-brown/70" },
  processing: { label: "만드는 중", icon: LoaderCircle, className: "bg-mint-light text-mint-deep" },
  completed: { label: "완성", icon: CircleCheck, className: "bg-mint text-brown" },
  failed: { label: "실패", icon: CircleAlert, className: "bg-coral-light text-coral-deep" },
};

export default function StatusBadge({ status }: { status: StorybookStatus }) {
  const { label, icon: Icon, className } = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      <Icon size={13} aria-hidden className={status === "processing" ? "animate-spin" : ""} />
      {label}
    </span>
  );
}
