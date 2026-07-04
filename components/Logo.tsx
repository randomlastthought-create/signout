import Link from "next/link";

export default function Logo({ size = "text-3xl" }: { size?: string }) {
  return (
    <Link href="/" className="inline-flex items-baseline gap-0.5">
      <span className={`font-hand font-bold text-violet-700 ${size}`}>
        ✦ signout<span className="text-violet-400">.</span>
      </span>
    </Link>
  );
}
