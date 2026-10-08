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

  One page-load moment: the three headline words rise in one after another,
  then the copy and buttons. Switched off for reduced motion.
*/
const heroAnimations = `
  @keyframes pad-rise { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .pad-rise { animation: pad-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both; }
  @media (prefers-reduced-motion: reduce) {
    .pad-rise { animation: none !important; }
  }
`;

export default function HeroSection() {
  return (
    <section className="bg-[#1C0606]">
      <style>{heroAnimations}</style>

      <div className="relative flex min-h-[620px] items-end overflow-hidden lg:min-h-[86vh]">
        {/* Showroom photo, kept bright so the cars are the hero */}
        <Image
          src="/showroom-collection.jpg"
          alt="Prime Auto Display showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />

        {/* Light tint overall, heavier only at the bottom where the text sits */}
        <div className="absolute inset-0 bg-[#1C0606]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C0606] via-[#1C0606]/70 via-35% to-transparent to-65%" />

        {/* Gold slash, a nod to the stripe on the logo shield */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#F9A602] via-[#F9A602] to-transparent"
        />

        {/* Content: bottom left, so the photo stays clear above */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-40 sm:px-6 lg:px-8 lg:pb-20">
          <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight text-[#FDF5DC] [text-shadow:0_2px_30px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl xl:text-8xl">
            <span
              className="pad-rise block lg:mr-5 lg:inline-block"
              style={{ animationDelay: "0.15s" }}
            >
              Buy it.
            </span>
            <span
              className="pad-rise block lg:mr-5 lg:inline-block"
              style={{ animationDelay: "0.3s" }}
            >
              Sell it.
            </span>
            <span
              className="pad-rise block text-[#F9A602] lg:inline-block"
              style={{ animationDelay: "0.45s" }}
            >
              Trade it.
            </span>
          </h1>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p
              className="pad-rise max-w-xl text-base leading-7 text-[#FDF5DC]/85 lg:text-lg"
              style={{ animationDelay: "0.65s" }}
            >
              Every car is inspected before it reaches our showroom. Looking to
              sell or trade yours? Tell us about it and we&apos;ll take it from
              there.
            </p>

            <div
              className="pad-rise flex flex-col gap-3 sm:flex-row sm:gap-4"
              style={{ animationDelay: "0.8s" }}
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

      {/* Benefits strip: continues the dark of the hero's bottom fade */}
      <div className="bg-[#1C0606]">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-[#FDF5DC]/10 lg:grid-cols-4 lg:divide-x">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-center gap-3 border-t-4 border-transparent px-4 py-5 transition-colors hover:border-[#F9A602] sm:gap-4 sm:px-6 sm:py-6"
            >
              <Icon
                size={28}
                strokeWidth={1.8}
                className="shrink-0 text-[#F9A602]"
              />
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#FDF5DC] sm:text-lg">
                  {title}
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-[#FDF5DC]/65 sm:text-sm">
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
