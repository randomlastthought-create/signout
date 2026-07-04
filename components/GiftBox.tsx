"use client";

import { useState } from "react";
import { toast } from "@/components/toast/Toaster";
import type { GiftDetails } from "@/lib/types";

const HAIL_TITLES = [
  "You're a real one! 🥹💜",
  "Certified legend behavior 🏆",
  "Big heart energy! 💸✨",
];

export default function GiftBox({
  gift,
  displayName,
}: {
  gift: GiftDetails;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nudge, setNudge] = useState(true);

  const openModal = () => {
    setNudge(false);
    setOpen(true);
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(gift.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(
        HAIL_TITLES[Math.floor(Math.random() * HAIL_TITLES.length)],
        `Account number copied — ${displayName} will never forget this. 🎁`
      );
    } catch {
      toast.error("Couldn't copy", `Copy it manually: ${gift.accountNumber}`);
    }
  };

  return (
    <>
      {/* Floating gift box — sits above the mobile action bar, clear of the canvas */}
      <button
        onClick={openModal}
        aria-label={`Send ${displayName} a gift`}
        className="group fixed bottom-24 left-3 z-30 flex items-center gap-2 rounded-full bg-violet-600 py-2.5 pl-3 pr-4 text-white shadow-[0_12px_35px_-8px_rgba(124,58,237,0.55)] transition-all hover:scale-105 hover:bg-violet-700 active:scale-95 sm:left-5 lg:bottom-6"
      >
        <span aria-hidden className="animate-gift-wiggle text-xl leading-none">
          🎁
        </span>
        <span className="text-sm font-semibold">Send a gift</span>
      </button>

      {/* Auto nudge — points to the gift box after a few seconds */}
      {nudge && !open && (
        <div className="fixed bottom-40 left-3 z-40 w-62 animate-nudge-in sm:left-5 lg:bottom-24">
          <div className="relative rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_18px_45px_-15px_rgba(80,70,180,0.45)]">
            <button
              onClick={() => setNudge(false)}
              aria-label="Dismiss"
              className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" aria-hidden>
                <path d="M5.5 5.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex items-start gap-2.5">
              <span aria-hidden className="text-2xl leading-none">🎁</span>
              <div className="min-w-0 pr-3">
                <p className="line-clamp-2 text-sm font-bold text-slate-900" title={displayName}>
                  Psst — {displayName} accepts gifts!
                </p>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">
                  Signatures are lovely, but a little something hits different. 💜
                </p>
              </div>
            </div>
            <button
              onClick={openModal}
              className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:scale-[0.98]"
            >
              Send a gift →
            </button>
            {/* Pointer toward the floating button below */}
            <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-violet-100 bg-white" />
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-overlay-in sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Send ${displayName} a gift`}
            onClick={(e) => e.stopPropagation()}
            className="w-full overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_-20px_rgba(80,70,180,0.5)] animate-sheet-up sm:max-w-sm sm:rounded-3xl"
          >
            <div className="relative bg-violet-600 px-6 pb-5 pt-7 text-white sm:pt-6">
              <span
                aria-hidden
                className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/30 sm:hidden"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M5.5 5.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <span aria-hidden className="text-4xl">🎁</span>
              <h3 className="mt-2 line-clamp-2 text-xl font-bold" title={displayName}>
                Spoil {displayName} a little
              </h3>
              <p className="mt-1 text-sm text-white/80">
                Signatures are forever — but a small gift hits different. 💜
              </p>
            </div>

            <div
              className="space-y-3 p-6"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
            >
              <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Bank
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-900" title={gift.bankName}>
                  {gift.bankName}
                </p>
              </div>
              <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account name
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-900" title={gift.accountName}>
                  {gift.accountName}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-violet-500">
                    Account number
                  </p>
                  <p className="mt-0.5 truncate font-mono text-lg font-bold tracking-wider text-violet-900">
                    {gift.accountNumber}
                  </p>
                </div>
                <button
                  onClick={copyAccount}
                  aria-label="Copy account number"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition-all active:scale-90 ${
                    copied
                      ? "bg-emerald-500 shadow-emerald-500/30"
                      : "bg-violet-600 shadow-violet-600/30 hover:bg-violet-700"
                  }`}
                >
                  {copied ? (
                    <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5" aria-hidden>
                      <path d="M4 10.5l4 4L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5" aria-hidden>
                      <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M13 7V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="pt-1 text-center text-xs text-slate-400">
                Any amount counts — it&apos;s the thought that signs the shirt. ✨
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
