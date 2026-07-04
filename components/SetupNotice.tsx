import Logo from "@/components/Logo";

export default function SetupNotice({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <h1 className="text-xl font-bold text-slate-900">Almost there 🛠️</h1>
      <p className="max-w-md text-sm text-slate-600">{message}</p>
      <pre className="rounded-xl bg-slate-900 px-5 py-3 text-left text-sm text-slate-100">
        cp .env.example .env.local
      </pre>
    </div>
  );
}
