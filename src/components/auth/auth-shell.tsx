// components/auth/auth-shell.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Shared class names (same export names as before)                          */
/* -------------------------------------------------------------------------- */

export const authLabelClass = "mb-2 block text-sm font-semibold text-white";

export const authInputClass =
  "w-full border-2 border-white/10 bg-[#1A1A1A] px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#9B1111] focus:bg-[#202020] aria-[invalid=true]:border-[#9B1111]";

export const authErrorClass = "mt-2 text-sm font-medium text-[#FF5A61]";

export const authAlertClass =
  "mb-5 border-l-4 border-[#9B1111] bg-[#9B1111]/15 px-4 py-3 text-sm font-medium text-[#FF8A90]";

export const authButtonClass =
  "chamfer inline-flex w-full items-center justify-center gap-2 bg-[#9B1111] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#9B1111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:hover:bg-white/10 disabled:hover:text-white/40";

export const authLinkClass =
  "font-semibold text-[#9B1111] underline underline-offset-2 transition-colors hover:text-white";

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */

export function AuthShell({
  headline,
  blurb,
  children,
}: {
  headline: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-[#1C0606] text-white lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#1C0606] px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 hidden h-full w-28 -skew-x-12 bg-[#9B1111] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-0 hidden h-full w-4 -skew-x-12 bg-white lg:block"
        />

        <div className="relative flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label="Prime Auto Display Car Trading home"
          >
            <Image
              src="/logo.png"
              alt=""
              width={44}
              height={44}
              unoptimized
              className="h-11 w-11 object-contain"
            />
            <span className="text-lg font-bold uppercase leading-none">
              Capital <span className="text-[#9B1111]">Jey</span>
              <span className="mt-1 block text-[10px] font-semibold tracking-[0.3em] text-white/60">
                Car Trading
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-[#9B1111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:hidden"
          >
            <ArrowLeft size={16} className="text-[#9B1111]" />
            Home
          </Link>
        </div>

        <div className="relative py-12 lg:max-w-xl lg:py-0 lg:pr-16">
          <h2 className="text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
            {headline}
          </h2>
          <span
            aria-hidden="true"
            className="mt-6 block h-2 w-24 bg-[#9B1111]"
          />
          <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg">
            {blurb}
          </p>
        </div>

        <Link
          href="/"
          className="relative hidden w-fit items-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-[#9B1111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:inline-flex"
        >
          <ArrowLeft size={16} className="text-[#9B1111]" />
          Back to website
        </Link>

        <div
          aria-hidden="true"
          className="tread absolute inset-x-0 bottom-0 lg:hidden"
        />
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-[#111111] px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
        <div className="w-full max-w-md border-t-4 border-[#9B1111] bg-[#161616] p-6 sm:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}
