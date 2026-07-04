import Image from "next/image";
import Logo from "@/components/Logo";
import CreateShirtForm from "@/components/CreateShirtForm";
import LoginForm from "@/components/LoginForm";

const steps = [
  {
    number: "01",
    title: "Claim your shirt",
    text: "Pick a username. That's it — a blank white shirt is yours, waiting at its own link.",
  },
  {
    number: "02",
    title: "Pass the link around",
    text: "https://signout-tan.vercel.app/you goes in the group chat, the class list, wherever your people are.",
  },
  {
    number: "03",
    title: "Watch it fill up",
    text: "Everyone writes, draws, and signs in real ink colors. Nothing you write can be erased by someone else.",
  },
];


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <a
          href="#how-it-works"
          className="text-sm font-medium text-slate-600 hover:text-violet-700"
        >
          How it works
        </a>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="font-hand text-2xl text-violet-600">leave your mark ✦</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              The signout shirt,
              <br />
              <span className="text-violet-600">now digital.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              The final-year tradition you love — friends signing your white
              shirt with markers — reimagined online. One link, endless
              signatures, memories that never fade or wash out.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <CreateShirtForm />
              <LoginForm />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="rounded-[2.5rem] bg-linear-to-b from-white to-slate-100/60 p-6 shadow-[0_30px_80px_-25px_rgba(80,70,180,0.35)]">
              <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: "1 / 1" }}>
                <Image
                  src="/hero-shirt.png"
                  alt="A white signout shirt covered in colorful signatures and doodles"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-slate-200 bg-white py-20 sm:py-28">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 max-w-md text-base text-slate-500">
              No app to install, nothing to sign up for. Three steps and your
              shirt exists.
            </p>

            <ol className="mt-14">
              {steps.map((s, i) => (
                <li
                  key={i}
                  className={`flex gap-6 py-8 sm:gap-10 ${
                    i !== 0 ? "border-t border-dashed border-slate-300" : ""
                  }`}
                >
                  <span className="font-hand shrink-0 text-5xl leading-none text-violet-600/80 sm:text-6xl">
                    {s.number}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400">
        Made with 💜 by Dara and Rex for memories —{" "}
        <span className="font-hand text-base text-slate-500">
          “The best memories are the ones we create together.”
        </span>
      </footer>
    </div>
  );
}
