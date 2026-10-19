import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { mascot } from "../../assets/illustrations";

interface AuthLayoutProps {
  title: string;
  description: string;
  illustration?: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  description,
  illustration = mascot.wave,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/intro" className="flex min-h-11 items-center gap-2">
          <img src={mascot.wave} alt="" className="h-8 w-8" />
          <span className="font-story text-base text-brown">하루동화</span>
        </Link>
      </header>
      <main className="mx-auto w-full max-w-md px-4 pb-12 pt-2">
        <div className="rounded-3xl bg-white/80 p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <img src={illustration} alt="" className="animate-mascot-bob mx-auto h-24 w-24" />
            <h1 className="mt-3 font-story text-2xl text-brown">{title}</h1>
            <p className="mt-1.5 text-sm text-brown/60">{description}</p>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
