import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified vehicles",
    description: "Carefully inspected cars",
  },
  {
    icon: CircleDollarSign,
    title: "Flexible financing",
    description: "Options built around you",
  },
  {
    icon: CarFront,
    title: "Trade-in welcome",
    description: "Upgrade your current vehicle",
  },
  {
    icon: BadgeCheck,
    title: "Easy transactions",
    description: "From inquiry to handover",
  },
];

// One page-load moment: the speed lines shoot in from the edges, then the
// headline and buttons settle. Switched off for reduced motion.
const heroAnimations = `
  @keyframes cj-line-left  { from { transform: translateX(-60%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes cj-line-right { from { transform: translateX(60%);  opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes cj-rise       { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0);  opacity: 1; } }
  .cj-line-left  { animation: cj-line-left 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
  .cj-line-right { animation: cj-line-right 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
  .cj-rise       { animation: cj-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
  @media (prefers-reduced-motion: reduce) {
    .cj-line-left, .cj-line-right, .cj-rise { animation: none !important; }
  }
`;

// Tapered red speed lines, like the swoosh off the "C" in the logo.
function SpeedLines({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 60"
      className={`h-auto w-40 text-[#E31B23] lg:w-72 ${flip ? "-scale-x-100" : ""}`}
    >
      <polygon points="0,6 200,24 0,14" fill="currentColor" />
      <polygon points="30,24 200,30 30,34" fill="currentColor" opacity="0.7" />
      <polygon points="0,46 200,36 0,54" fill="currentColor" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-[#0B0B0B]">
      <style>{heroAnimations}</style>

      <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
        {/* Full photo behind the text */}
        <Image
          src="/showroom-collection.jpg"
          alt="Capital Jey showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0B0B0B]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-[#0B0B0B]/30" />

        {/* Speed lines on both sides */}
        <div className="cj-line-left pointer-events-none absolute left-0 top-1/2 -translate-y-1/2">
          <SpeedLines />
        </div>
        <div className="cj-line-right pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
          <SpeedLines flip />
        </div>

        {/* Content (centered) */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <h1
            className="cj-rise text-5xl font-bold uppercase leading-[0.95] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-8xl"
            style={{ animationDelay: "0.25s" }}
          >
            Your next car,
            <span className="block text-[#E31B23]">checked and ready</span>
            to drive.
          </h1>

          <p
            className="cj-rise mx-auto mt-6 max-w-xl text-base leading-7 text-white/80 lg:text-lg"
            style={{ animationDelay: "0.45s" }}
          >
            Every vehicle is inspected before it reaches the showroom, with
            clear details from your first look to the day you get the keys.
          </p>

          <div
            className="cj-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              href="/showroom"
              className="chamfer group inline-flex items-center justify-center gap-3 bg-[#E31B23] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#FF3B43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Browse cars
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/sell-trade"
              className="chamfer inline-flex items-center justify-center bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0B] transition-colors duration-300 hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sell or trade your car
            </Link>
          </div>
        </div>
      </div>

      {/* Tire-tread divider */}
      <div aria-hidden="true" className="tread" />

      {/* Benefits strip: white, so the page flips from dark hero to light site */}
      <div className="bg-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-[#0B0B0B]/10 lg:grid-cols-4 lg:divide-x">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-center gap-3 border-t-4 border-transparent px-4 py-5 transition-colors hover:border-[#E31B23] sm:gap-4 sm:px-6 sm:py-6"
            >
              <Icon
                size={28}
                strokeWidth={1.8}
                className="shrink-0 text-[#E31B23]"
              />
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#0B0B0B] sm:text-lg">
                  {title}
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-[#0B0B0B]/60 sm:text-sm">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
