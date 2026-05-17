"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const config = {
    success: { icon: <CheckCircle size={16} />, color: "#00d4ff", border: "rgba(0,212,255,0.25)", glow: "rgba(0,212,255,0.15)" },
    error:   { icon: <XCircle size={16} />,    color: "#ff2d78",  border: "rgba(255,45,120,0.25)", glow: "rgba(255,45,120,0.1)" },
    info:    { icon: <Info size={16} />,        color: "#7c3aed",  border: "rgba(124,58,237,0.25)", glow: "rgba(124,58,237,0.1)" },
  }[toast.type];

  return (
    <div
      className="toast-enter flex items-center gap-3 px-4 py-3 rounded-xl min-w-[280px] max-w-[360px]"
      style={{
        background: "rgba(0,10,30,0.95)",
        border: `1px solid ${config.border}`,
        boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${config.glow}`,
        backdropFilter: "blur(24px)",
      }}
    >
      <span style={{ color: config.color }}>{config.icon}</span>
      <span className="text-sm flex-1" style={{ color: "rgba(226,240,255,0.9)", fontFamily: "var(--font-body)" }}>
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ color: "rgba(226,240,255,0.3)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(226,240,255,0.3)"; }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
