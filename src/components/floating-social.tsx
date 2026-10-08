"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

const FACEBOOK_URL = "https://www.facebook.com/CapitalJEYCarTrading/";
const INSTAGRAM_URL = "https://www.instagram.com/capitaljautofocus";
const PHONE_NUMBER = "+639972530052"; // 0997 253 0052

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// lucide-react no longer ships brand/logo icons, so these are inline SVGs.
interface BrandIconProps {
  size?: number;
  className?: string;
}

function FacebookIcon({ size = 18, className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.58v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ size = 18, className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export interface FloatingSocialProps {
  facebookHref?: string;
  instagramHref?: string;
  phone?: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ElementType;
  bg: string;
}

export default function FloatingSocial({
  facebookHref = FACEBOOK_URL,
  instagramHref = INSTAGRAM_URL,
  phone = PHONE_NUMBER,
}: FloatingSocialProps) {
  const pathname = usePathname() ?? "";

  // Hide floating social buttons on all admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const links: SocialLink[] = [
    {
      name: "Facebook",
      href: facebookHref,
      icon: FacebookIcon,
      bg: "bg-[#1877F2]",
    },
    {
      name: "Instagram",
      href: instagramHref,
      icon: InstagramIcon,
      bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    },
  ];

  if (phone) {
    links.push({
      name: "Call Us",
      href: `tel:${phone}`,
      icon: Phone,
      bg: "bg-[#E31B23]",
    });
  }

  return (
    <div
      aria-label="Contact us"
      className="fixed right-0 top-1/2 z-40 -translate-y-1/2"
    >
      {/* Black rail with a red edge. Buttons are square, with each brand's own color */}
      <div className="flex flex-col items-center gap-px border-y border-l-4 border-y-white/10 border-l-[#E31B23] bg-[#0B0B0B]">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              aria-label={link.name}
              className={`group relative flex h-11 w-11 items-center justify-center text-white transition-[filter] duration-200 hover:brightness-110 sm:h-12 sm:w-12 ${link.bg} ${focusRing}`}
            >
              <Icon size={18} strokeWidth={2.25} className="sm:h-5 sm:w-5" />

              {/* Tooltip */}
              <span className="pointer-events-none absolute right-full mr-3 translate-x-1 whitespace-nowrap bg-[#0B0B0B] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
