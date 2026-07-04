"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { toast } from "@/components/toast/Toaster";

const slugify = (v: string) =>
  v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20);

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:text-sm";

export default function CreateShirtForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [giftOpen, setGiftOpen] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [giftError, setGiftError] = useState<string | null>(null);

  const onNameChange = (v: string) => {
    setDisplayName(v);
    if (!touched) setUsername(slugify(v));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    setGiftError(null);
    if (!accountName) setAccountName(displayName.trim());
    setGiftOpen(true);
  };

  const createShirt = async (withGift: boolean) => {
    if (withGift) {
      if (!bankName.trim() || !accountName.trim()) {
        setGiftError("Bank name and account name are both needed.");
        return;
      }
      if (!/^[0-9]{6,20}$/.test(accountNumber.trim())) {
        setGiftError("Account number should be 6-20 digits.");
        return;
      }
    }
    setGiftError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/shirts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          username,
          gift: withGift
            ? {
                bankName: bankName.trim(),
                accountName: accountName.trim(),
                accountNumber: accountNumber.trim(),
              }
            : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      toast.success(
        "Your shirt is ready! 👕",
        withGift
          ? "Signatures and gifts, all in one link. Go share it!"
          : "Copy your link and start collecting signatures."
      );
      router.push(`/${data.username}/dashboard`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setGiftOpen(false);
      setError(message);
      toast.error("Couldn't create your shirt", message);
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-7 shadow-xl shadow-violet-200/40"
      >
        <h2 className="text-lg font-bold text-slate-900">Create your shirt 👕</h2>
        <p className="mt-1 text-sm text-slate-500">
          Free forever. No account needed.
        </p>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">Display name</span>
          <input
            value={displayName}
            onChange={(e) => onNameChange(e.target.value)}
            required
            maxLength={50}
            placeholder="e.g. Akara"
            className={inputClass}
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            value={username}
            onChange={(e) => {
              setTouched(true);
              setUsername(slugify(e.target.value));
            }}
            required
            minLength={3}
            maxLength={20}
            placeholder="e.g. akara"
            className={`${inputClass} font-mono`}
          />
        </label>

        <div className="mt-3 rounded-xl bg-violet-50 px-4 py-2.5 text-sm">
          <span className="text-violet-600/70">Your shareable link: </span>
          <span className="font-mono font-semibold text-violet-800">
            signout.app/{username || "username"}
          </span>
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="text-base" /> Creating your shirt…
            </span>
          ) : (
            "Get my shirt →"
          )}
        </button>
      </form>

      {giftOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-overlay-in sm:items-center sm:p-4"
          onClick={() => !loading && setGiftOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add gift details"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full rounded-t-3xl bg-white p-6 pt-7 shadow-[0_30px_80px_-20px_rgba(80,70,180,0.5)] animate-sheet-up sm:max-w-sm sm:rounded-3xl sm:pt-6"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-slate-200 sm:hidden"
            />
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-2xl shadow-lg shadow-violet-500/30">
                🎁
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">One last thing…</h3>
                <p className="mt-0.5 text-sm leading-snug text-slate-500">
                  Want loved ones to send you gifts? Add your account details and
                  a little gift box will live on your shirt page. 💜
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

            {giftError && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                {giftError}
              </p>
            )}

            <button
              onClick={() => createShirt(true)}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:from-violet-700 hover:to-fuchsia-700 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="text-base" /> Creating your shirt…
                </span>
              ) : (
                "Add gifts & get my shirt 🎁"
              )}
            </button>
            <button
              onClick={() => createShirt(false)}
              disabled={loading}
              className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-60"
            >
              Skip — just my shirt
            </button>
          </div>
        </div>
      )}
    </>
  );
}
