import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { ToastContext, type ToastKind } from "./toastContext";

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

const DURATION_MS = 3500;

const KIND_STYLE: Record<ToastKind, { icon: typeof Info; className: string }> = {
  success: { icon: CircleCheck, className: "text-mint-deep" },
  error: { icon: CircleAlert, className: "text-coral-deep" },
  info: { icon: Info, className: "text-brown/60" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, kind }]);
      setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => {
          const { icon: Icon, className } = KIND_STYLE[toast.kind];
          return (
            <div
              key={toast.id}
              role={toast.kind === "error" ? "alert" : "status"}
              className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-sm text-brown shadow-lg ring-1 ring-black/5"
            >
              <Icon size={20} className={`shrink-0 ${className}`} aria-hidden />
              <p className="flex-1">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="알림 닫기"
                className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-brown/40 hover:bg-mint-light"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
