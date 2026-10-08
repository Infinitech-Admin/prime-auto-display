import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Wordmark } from "@/components/layout/wordmark";

// ---------------------------------------------------------------------------
// Business details
// Anything left empty is hidden automatically instead of showing placeholders.
// ---------------------------------------------------------------------------
const BUSINESS_NAME = "Capital Jey Car Trading";
const FACEBOOK_URL = "https://www.facebook.com/CapitalJEYCarTrading/";
const INSTAGRAM_URL = "https://www.instagram.com/capitaljautofocus";
const ADDRESS_LINE_1 = "Blk 28, Lot 26 Vatican City Drive,";
const ADDRESS_LINE_2 = "BF Resort Village, Talon Dos, Las Piñas City 1747";
const PHONE_DISPLAY = "0997 253 0052";
const PHONE_TEL = "+639972530052";
const EMAIL = "capitaljeycartrading@gmail.com";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS_NAME}, ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`,
)}`;

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Capital Jey Car Trading palette
// black #0B0B0B | red #E31B23 | red hover #FF3B43 | white #FFFFFF
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// Square social buttons in each brand's own color
const socialLink =
  "flex size-10 items-center justify-center text-white transition-[filter] duration-200 hover:brightness-110";

const footerLink = "text-white/60 transition-colors hover:text-white";

const headingClass =
  "text-lg font-bold uppercase tracking-wider text-white after:mt-2 after:block after:h-[3px] after:w-8 after:bg-[#E31B23]";

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] text-white">
      {/* Tire-tread divider, same as the home hero */}
      <div aria-hidden="true" className="tread" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              aria-label={`${BUSINESS_NAME} home`}
              className={`group inline-block ${focusRing}`}
            >
              <Wordmark className="text-4xl" />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              Quality pre-owned vehicles, transparent transactions, and a better
              way to find your next drive.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              {FACEBOOK_URL ? (
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${BUSINESS_NAME} on Facebook`}
                  className={`${socialLink} bg-[#1877F2] ${focusRing}`}
                >
                  <FacebookIcon className="size-4" />
                </a>
              ) : null}

              {INSTAGRAM_URL ? (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${BUSINESS_NAME} on Instagram`}
                  className={`${socialLink} bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] ${focusRing}`}
                >
                  <InstagramIcon className="size-4" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={headingClass}>Explore</h3>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <Link href="/showroom" className={footerLink}>
                  Browse Inventory
                </Link>
              </li>
              <li>
                <Link href="/sell-trade" className={footerLink}>
                  Sell / Trade Car
                </Link>
              </li>
              <li>
                <Link href="/about" className={footerLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLink}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className={headingClass}>Services</h3>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <Link href="/showroom" className={footerLink}>
                  Vehicle Sales
                </Link>
              </li>
              <li>
                <Link href="/sell-trade" className={footerLink}>
                  Vehicle Trade-In
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLink}>
                  Test Drive
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>Contact</h3>

            <div className="mt-6 space-y-4 text-sm">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex gap-3 ${footerLink}`}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#E31B23]" />
                <address className="not-italic">
                  {ADDRESS_LINE_1}
                  <br />
                  {ADDRESS_LINE_2}
                </address>
              </a>

              {PHONE_DISPLAY && PHONE_TEL ? (
                <a
                  href={`tel:${PHONE_TEL}`}
                  className={`flex items-center gap-3 ${footerLink}`}
                >
                  <Phone className="size-4 text-[#E31B23]" />
                  {PHONE_DISPLAY}
                </a>
              ) : null}

              {EMAIL ? (
                <a
                  href={`mailto:${EMAIL}`}
                  className={`flex items-center gap-3 ${footerLink}`}
                >
                  <Mail className="size-4 text-[#E31B23]" />
                  {EMAIL}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-center text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()} {BUSINESS_NAME}. All rights
              reserved.
            </p>
            <span>
              Powered by{" "}
              <Link
                href="https://www.infinitechphil.com/"
                className="transition-colors hover:text-white"
              >
                Infinitech Advertising Corporation
              </Link>
            </span>
          </div>

          <div className="flex justify-center gap-5 sm:justify-end">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="transition-colors hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
