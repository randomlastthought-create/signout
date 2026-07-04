"use client";

import { useSyncExternalStore } from "react";

type ToastKind = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  duration: number;
  leaving: boolean;
};

/* Module-level store so any component can fire a toast
   without providers or prop-drilling. */
let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function dismiss(id: number) {
  const item = toasts.find((t) => t.id === id);
  if (!item || item.leaving) return;
  toasts = toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t));
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 220);
}

function push(kind: ToastKind, title: string, description?: string, durationOverride?: number) {
  const id = nextId++;
  const duration = durationOverride ?? (kind === "error" ? 5000 : 3800);
  toasts = [...toasts, { id, kind, title, description, duration, leaving: false }].slice(-4);
  emit();
  setTimeout(() => dismiss(id), duration);
  return id;
}

export const toast = {
  success: (title: string, description?: string, duration?: number) =>
    push("success", title, description, duration),
  error: (title: string, description?: string, duration?: number) =>
    push("error", title, description, duration),
  info: (title: string, description?: string, duration?: number) =>
    push("info", title, description, duration),
  dismiss,
};

const KIND_STYLES: Record<ToastKind, { badge: string; bar: string; icon: React.ReactNode }> = {
  success: {
    badge: "bg-linear-to-br from-emerald-400 to-green-600",
    bar: "bg-emerald-500",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
        <path d="M4 10.5l4 4L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    badge: "bg-linear-to-br from-rose-400 to-red-600",
    bar: "bg-rose-500",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
        <path d="M10 5v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  info: {
    badge: "bg-linear-to-br from-slate-700 to-slate-900",
    bar: "bg-slate-800",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
        <circle cx="10" cy="5.5" r="1.4" fill="currentColor" />
        <path d="M10 9v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

function useToasts() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toasts,
    () => toasts
  );
}

export default function Toaster() {
  const items = useToasts();
  if (items.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:bottom-4 sm:right-4"
    >
      {items.map((t) => {
        const s = KIND_STYLES[t.kind];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto relative flex w-full max-w-sm items-center gap-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-3.5 pr-2 shadow-[0_12px_40px_-12px_rgba(80,70,180,0.4)] backdrop-blur-md ${
              t.leaving ? "animate-toast-out" : "animate-toast-in"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${s.badge}`}
            >
              {s.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{t.title}</p>
              {t.description && (
                <p className="text-xs leading-snug text-slate-500">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
                <path d="M5.5 5.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <span
              className={`absolute bottom-0 left-0 h-0.5 rounded-full ${s.bar}`}
              style={{ animation: `toast-bar ${t.duration}ms linear forwards` }}
            />
          </div>
        );
      })}
    </div>
  );
}
