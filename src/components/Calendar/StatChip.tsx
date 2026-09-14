import type { LucideIcon } from "lucide-react";

interface StatChipProps {
  icon: LucideIcon;
  label: string;
  value: string;
  colorClass: string;
}

export default function StatChip({ icon: Icon, label, value, colorClass }: StatChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
        <Icon size={16} className="text-white" />
      </span>
      <div className="leading-tight">
        <p className="font-story text-sm text-brown">{value}</p>
        <p className="text-[11px] text-brown/50">{label}</p>
      </div>
    </div>
  );
}
