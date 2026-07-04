"use client";

import { useState } from "react";
import Spinner from "@/components/Spinner";
import { toast } from "@/components/toast/Toaster";
import type { GiftDetails } from "@/lib/types";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:text-sm";

export default function GiftSettings({
  username,
  displayName,
  initialGift,
}: {
  username: string;
  displayName: string;
  initialGift: GiftDetails | null;
}) {
  const [gift, setGift] = useState<GiftDetails | null>(initialGift);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bankName, setBankName] = useState(initialGift?.bankName ?? "");
  const [accountName, setAccountName] = useState(initialGift?.accountName ?? displayName);
  const [accountNumber, setAccountNumber] = useState(initialGift?.accountNumber ?? "");

  const openSheet = () => {
    setBankName(gift?.bankName ?? "");
    setAccountName(gift?.accountName ?? displayName);
    setAccountNumber(gift?.accountNumber ?? "");
    setError(null);
    setOpen(true);
  };

  const patchGift = async (next: GiftDetails | null) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/shirts/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gift: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save your details.");
      setGift(next);
      setOpen(false);
      toast.success(
        next ? "Gift details saved 🎁" : "Gift details removed",
        next
          ? "Loved ones can now send you gifts from your shirt page."
          : "The gift box is now hidden from your shirt page."
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error("Couldn't save", message);
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    if (!bankName.trim() || !accountName.trim()) {
      setError("Bank name and account name are both needed.");
      return;
    }
    if (!/^[0-9]{6,20}$/.test(accountNumber.trim())) {
      setError("Account number should be 6-20 digits.");
      return;
    }
    patchGift({
      bankName: bankName.trim(),
      accountName: accountName.trim(),
      accountNumber: accountNumber.trim(),
    });
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-lg">🎁</span>
          <p className="text-sm font-semibold text-slate-900">Gifting</p>
        </div>

        {gift ? (
          <>
            <p className="mt-1 text-xs text-slate-500">
              Loved ones can send you gifts from your shirt page.
            </p>
            <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-sm">
              <p className="text-slate-700">
                <span className="text-slate-400">Bank · </span>
                {gift.bankName}
              </p>
              <p className="text-slate-700">
                <span className="text-slate-400">Name · </span>
                {gift.accountName}
              </p>
              <p className="font-mono font-semibold text-violet-700">
                {gift.accountNumber}
              </p>
            </div>
            <button
              onClick={openSheet}
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-violet-300 hover:text-violet-700 active:scale-[0.98]"
            >
              Edit gift details
            </button>
          </>
        ) : (
          <>
            <p className="mt-1 text-xs text-slate-500">
              Add your account details so family and friends can send you gifts. 💜
            </p>
            <button
              onClick={openSheet}
              className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              Add gift details 🎁
            </button>
          </>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-overlay-in sm:items-center sm:p-4"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit gift details"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full rounded-t-3xl bg-white p-6 pt-7 shadow-[0_30px_80px_-20px_rgba(80,70,180,0.5)] animate-sheet-up sm:max-w-sm sm:rounded-3xl sm:pt-6"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-slate-200 sm:hidden"
            />
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                🎁
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {gift ? "Edit gift details" : "Add gift details"}
                </h3>
                <p className="mt-0.5 text-sm leading-snug text-slate-500">
                  A little gift box will appear on your shirt page for loved ones. 💜
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Bank name</span>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  maxLength={50}
                  placeholder="e.g. GTBank"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Account name</span>
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Akara Balogun"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Account number</span>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 20))}
                  inputMode="numeric"
                  placeholder="e.g. 0123456789"
                  className={`${inputClass} font-mono tracking-wide`}
                />
              </label>
            </div>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={save}
              disabled={saving}
              className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="text-base" /> Saving…
                </span>
              ) : (
                "Save gift details 🎁"
              )}
            </button>
            {gift && (
              <button
                onClick={() => patchGift(null)}
                disabled={saving}
                className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                Remove gift details
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
