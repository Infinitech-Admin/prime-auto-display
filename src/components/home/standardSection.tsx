"use client";

import {
  ShieldCheck,
  Tags,
  CreditCard,
  RefreshCw,
  Zap,
  Users,
} from "lucide-react";

const standards = [
  {
    icon: ShieldCheck,
    title: "Quality inspected",
    description: "Multi-point checks before every vehicle is listed.",
  },
  {
    icon: Tags,
    title: "Transparent pricing",
    description: "Clear figures with no unnecessary surprises.",
  },
  {
    icon: CreditCard,
    title: "Financing options",
    description: "Flexible plans tailored to your budget.",
  },
  {
    icon: RefreshCw,
    title: "Trade-in available",
    description: "A straightforward path when you're ready to upgrade.",
  },
  {
    icon: Zap,
    title: "Fast transactions",
    description: "Efficient paperwork with dedicated support.",
  },
  {
    icon: Users,
    title: "Trusted experts",
    description: "Guidance from experienced automotive specialists.",
  },
];

export default function StandardSection() {
  return (
    <section className="relative overflow-hidden bg-[#FDF5DC] py-20 text-[#1C0606]">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#1C0606] sm:text-5xl lg:text-6xl">
            Trust, built into
            <span className="block">every detail.</span>
          </h2>

          {/* Maroon + gold rule, echoing the logo shield */}
          <div aria-hidden="true" className="mx-auto mt-6 flex h-1 w-28">
            <span className="w-2/3 bg-[#9B1111]" />
            <span className="w-1/3 bg-[#F9A602]" />
          </div>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#1C0606]/70 sm:text-base">
            Every vehicle and every conversation at Prime Auto Display is
            handled with the same uncompromising standard.
          </p>
        </div>

        {/* Standards grid: 1px gaps over a tinted background make the dividers */}
        <div className="mt-14 grid gap-px border border-[#1C0606]/15 bg-[#1C0606]/15 sm:grid-cols-2 lg:grid-cols-3">
          {standards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative bg-[#FFFBEF] p-7 md:p-8"
              >
                {/* Hover accent runs across the top */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-[#F9A602] transition-all duration-500 group-hover:w-full" />

                <div className="chamfer flex size-12 items-center justify-center bg-[#9B1111]">
                  <Icon className="size-6 text-[#F9A602]" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#1C0606]">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#1C0606]/70">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
