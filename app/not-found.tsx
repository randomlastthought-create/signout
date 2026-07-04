import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <h1 className="text-2xl font-bold text-slate-900">
        This shirt doesn&apos;t exist (yet) 👕
      </h1>
      <p className="max-w-md text-slate-600">
        No one has claimed this link. It could be yours — create your own
        signout shirt and start collecting signatures.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700"
      >
        Create my shirt →
      </Link>
    </div>
  );
}
