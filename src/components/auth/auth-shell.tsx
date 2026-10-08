// Path: components/auth/auth-shell.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/layout/wordmark";

/*
  Prime Auto Display palette
  dark #1C0606 | page #150404 | panel #2A0A0A | input #2E0C0C (focus #3A1212)
  maroon #9B1111 | gold #F9A602 | cream #FDF5DC
*/

/* -------------------------------------------------------------------------- */
/*  Shared class names (same export names as before)                          */
/* -------------------------------------------------------------------------- */

export const authLabelClass = "mb-2 block text-sm font-semibold text-[#FDF5DC]";

export const authInputClass =
  "w-full border-2 border-[#FDF5DC]/15 bg-[#2E0C0C] px-4 py-3.5 text-[#FDF5DC] placeholder:text-[#FDF5DC]/35 outline-none transition-colors focus:border-[#F9A602] focus:bg-[#3A1212] aria-[invalid=true]:border-[#FF5A61]";

export const authErrorClass = "mt-2 text-sm font-medium text-[#FF5A61]";

export const authAlertClass =
  "mb-5 border-l-4 border-[#FF5A61] bg-[#9B1111]/25 px-4 py-3 text-sm font-medium text-[#FFB3B7]";

export const authButtonClass =
  "chamfer inline-flex w-full items-center justify-center gap-2 bg-[#F9A602] px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors hover:bg-[#FDF5DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF5DC] disabled:cursor-not-allowed disabled:bg-[#FDF5DC]/10 disabled:text-[#FDF5DC]/40 disabled:hover:bg-[#FDF5DC]/10 disabled:hover:text-[#FDF5DC]/40";

export const authLinkClass =
  "font-semibold text-[#F9A602] underline underline-offset-2 transition-colors hover:text-[#FDF5DC]";

const focusGold =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F9A602]";

/* -------------------------------------------------------------------------- */
/*  Layout: one centered card on a slanted maroon backdrop                    */
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
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#150404] text-[#FDF5DC]">
      {/* Slanted backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[46rem] -translate-x-1/2 -skew-x-12 bg-[#9B1111] md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[46rem] -translate-x-[calc(50%-2.75rem)] -skew-x-12 border-l-[10px] border-[#F9A602] md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#150404]/70 via-transparent to-[#150404]/80"
      />

      {/* Top bar */}
      <header className="relative flex items-center justify-between gap-4 px-5 py-6 sm:px-10">
        <Link
          href="/"
          aria-label="Prime Auto Display home"
          className={`group ${focusGold}`}
        >
          <Wordmark className="text-3xl sm:text-4xl" />
        </Link>
        <Link
          href="/"
          className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#F9A602] ${focusGold}`}
        >
          <ArrowLeft size={16} className="text-[#F9A602]" />
          Back to website
        </Link>
      </header>

      {/* Card */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-14 pt-4 sm:px-6">
        <div className="w-full max-w-md">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#F9A602]">
            {headline}
          </p>
          <div className="border-t-4 border-[#F9A602] bg-[#2A0A0A] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-9">
            {children}
          </div>
          <p className="mt-5 text-center text-sm leading-6 text-[#FDF5DC]/70">
            {blurb}
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="tread relative" />
    </main>
  );
}
