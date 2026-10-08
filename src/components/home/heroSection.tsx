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

/*
  Prime Auto Display palette
  maroon #9B1111 (hover #B91C1C) | gold #F9A602 | dark #1C0606 | cream #FDF5DC

  One page-load moment: the speed lines shoot in from the right edge, then the
  headline, copy and buttons settle one after another. Off for reduced motion.
*/
const heroAnimations = `
  @keyframes pad-line  { from { transform: translateX(60%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes pad-rise  { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .pad-line { animation: pad-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
  .pad-rise { animation: pad-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
  @media (prefers-reduced-motion: reduce) {
    .pad-line, .pad-rise { animation: none !important; }
  }
`;

// Tapered gold speed lines, like the motion swoosh behind the car.
function SpeedLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 60"
      className={`h-auto text-[#F9A602] ${className}`}
    >
      <polygon points="0,6 200,24 0,14" fill="currentColor" />
      <polygon points="30,24 200,30 30,34" fill="currentColor" opacity="0.7" />
      <polygon points="0,46 200,36 0,54" fill="currentColor" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-[#1C0606]">
      <style>{heroAnimations}</style>

      <div className="relative flex min-h-[80vh] items-center overflow-hidden">
        {/* Full photo behind the text */}
        <Image
          src="/showroom-collection.jpg"
          alt="Prime Auto Display showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Left-to-right fade keeps the headline readable and the car visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C0606] via-[#1C0606]/75 to-[#1C0606]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C0606]/80 via-transparent to-transparent" />

        {/* Speed lines streaking in from the right edge */}
        <div className="pad-line pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
          <SpeedLines className="w-56 lg:w-96" />
        </div>

        {/* Content (left aligned) */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl border-l-4 border-[#F9A602] pl-5 sm:pl-8">
            <h1
              className="pad-rise text-5xl font-black uppercase leading-[0.95] tracking-tight text-[#FDF5DC] [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-8xl"
              style={{ animationDelay: "0.25s" }}
            >
              Your next car, checked and ready to drive.
            </h1>

            <p
              className="pad-rise mt-6 max-w-xl text-base leading-7 text-[#FDF5DC]/85 lg:text-lg"
              style={{ animationDelay: "0.45s" }}
            >
              Every vehicle is inspected before it reaches the showroom, with
              clear details from your first look to the day you get the keys.
            </p>

            <div
              className="pad-rise mt-9 flex flex-col items-start gap-3 sm:flex-row sm:gap-4"
              style={{ animationDelay: "0.6s" }}
            >
              <Link
                href="/showroom"
                className="chamfer group inline-flex items-center justify-center gap-3 bg-[#F9A602] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors duration-300 hover:bg-[#FDF5DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse cars
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/sell-trade"
                className="chamfer inline-flex items-center justify-center bg-[#9B1111] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#B91C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sell or trade your car
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tire-tread divider */}
      <div aria-hidden="true" className="tread" />

      {/* Benefits strip: cream, so the page flips from the dark hero to the light site */}
      <div className="border-t-4 border-[#F9A602] bg-[#FDF5DC]">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-[#1C0606]/10 lg:grid-cols-4 lg:divide-x">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-center gap-3 border-t-4 border-transparent px-4 py-5 transition-colors hover:border-[#9B1111] sm:gap-4 sm:px-6 sm:py-6"
            >
              <div className="chamfer flex size-11 shrink-0 items-center justify-center bg-[#9B1111]">
                <Icon size={22} strokeWidth={1.8} className="text-[#F9A602]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#1C0606] sm:text-lg">
                  {title}
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-[#1C0606]/65 sm:text-sm">
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
