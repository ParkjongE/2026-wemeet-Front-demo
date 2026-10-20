import type { ReactNode } from "react";

export default function Svg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={label} className="h-full w-full overflow-visible">
      {children}
    </svg>
  );
}
