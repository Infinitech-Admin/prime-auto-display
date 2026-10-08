// Path: app/about/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BadgeCheck,
  CalendarCheck,
  CarFront,
  Images,
  MapPin,
  Phone,
  Repeat,
  ShieldCheck,
  Users,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import CTA from "../../components/home/cta";

// Source: Capital Jey Car Trading Facebook page.
const BUSINESS = {
  name: "Capital Jey Car Trading",
  address:
    "Blk 28, Lot 26 Vatican City Drive, BF Resort Village, Talon Dos, Las Piñas City, Philippines, 1747",
  phoneDisplay: "0997 253 0052",
  phoneHref: "tel:+639972530052",
  facebook: "https://www.facebook.com/CapitalJEYCarTrading/",
  instagram: "https://www.instagram.com/capitaljautofocus",
};

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.name}, ${BUSINESS.address}`,
)}`;

const facts = [
  { icon: MapPin, text: "Las Piñas City" },
  { icon: Repeat, text: "Buy, sell, and trade in one place" },
  { icon: Images, text: "Photos and videos on every listing" },
  { icon: CalendarCheck, text: "Book a test drive online" },
];

const services = [
  {
    icon: CarFront,
    title: "Buy a car",
    description:
      "Browse the showroom with specs, mileage, photos, and videos shown up front, then pick the one that fits your life and budget.",
    href: "/showroom",
    cta: "Browse the showroom",
  },
  {
    icon: Banknote,
    title: "Sell your car",
    description:
      "Get a quick value estimate online and send your car in for review. Our team will get back to you.",
    href: "/sell-trade",
    cta: "Get a value estimate",
  },
  {
    icon: Repeat,
    title: "Trade it in",
    description:
      "Moving up or switching? Trade in your current car and put it toward your next one.",
    href: "/sell-trade",
    cta: "Start a trade-in",
  },
];

const journeys = [
  {
    tab: "Buying",
    title: "Buying with us",
    steps: [
      "Browse listings with full specs, mileage, photos, and videos.",
      "Message us or book a test drive online.",
      "Visit the showroom and drive it in person.",
    ],
  },
  {
    tab: "Selling or trading in",
    title: "Selling or trading in",
    steps: [
      "Enter your car's details and get a quick value estimate.",
      "Send it in for review.",
      "Our team gets back to you with the next steps.",
    ],
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    description:
      "The right purchase starts with clear information and no pressure. Every recommendation is based on your needs, not just the cars on our lot.",
  },
  {
    icon: BadgeCheck,
    title: "Clear details",
    description:
      "Specs, mileage, photos, and videos are on every listing, so you can decide with confidence whether it's your first car or your next upgrade.",
  },
  {
    icon: Users,
    title: "Friendly service",
    description:
      "From your first message to the final handover, our team is patient, responsive, and easy to talk to.",
  },
];

const socials = [
  { label: "Facebook", href: BUSINESS.facebook },
  { label: "Instagram", href: BUSINESS.instagram },
];

// Focus rings: black on light surfaces, white on dark ones.
const ringLight =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0B]";
const ringDark =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function About() {
  const [activeJourney, setActiveJourney] = useState(0);
  const journey = journeys[activeJourney];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#0B0B0B]">
        {/* HERO: photo, text on the left */}
        <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-[#0B0B0B]">
          <Image
            src="/showroom-collection.jpg"
            alt="Capital Jey showroom"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/75 to-[#0B0B0B]/20" />

          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl border-l-4 border-[#E31B23] pl-6 sm:pl-8">
              <h1 className="text-5xl font-bold uppercase leading-none text-white sm:text-6xl lg:text-7xl">
                Buy. Sell.
                <span className="block text-[#E31B23]">Trade.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
                {BUSINESS.name} is a car dealership in Las Piñas City. We buy,
                sell, and trade cars, with clear details and a straightforward
                path to ownership.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/showroom"
                  className={`chamfer inline-flex items-center justify-center gap-2 bg-[#E31B23] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#FF3B43] ${ringDark}`}
                >
                  Browse the showroom
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/sell-trade"
                  className={`chamfer inline-flex items-center justify-center bg-white px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0B] transition-colors hover:bg-[#F4F4F4] ${ringDark}`}
                >
                  Sell / Trade your car
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div aria-hidden="true" className="tread" />

        {/* FACTS: solid red band */}
        <section className="bg-[#E31B23] text-white">
          <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {facts.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm font-semibold"
              >
                <Icon size={20} className="shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* FIND US: one row, address / phone / directions / socials */}
        <section className="border-b border-[#0B0B0B]/10 bg-[#F4F4F4]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_auto] lg:items-center lg:px-8">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#0B0B0B] text-white">
                <MapPin size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold uppercase">
                  Visit the showroom
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#0B0B0B]/70">
                  {BUSINESS.address}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#0B0B0B] text-white">
                <Phone size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold uppercase">Call us</h2>
                <a
                  href={BUSINESS.phoneHref}
                  className={`mt-1 inline-block text-base font-semibold text-[#E31B23] transition-colors hover:text-[#0B0B0B] ${ringLight}`}
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:col-span-2 lg:col-span-1">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`chamfer inline-flex items-center justify-center gap-2 bg-[#0B0B0B] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#E31B23] ${ringLight}`}
              >
                Get directions
                <ArrowUpRight size={16} />
              </a>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border-2 border-[#0B0B0B] px-4 py-3 text-sm font-bold text-[#0B0B0B] transition-colors hover:bg-[#0B0B0B] hover:text-white ${ringLight}`}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE DO: full-width rows that flip to black on hover */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="max-w-2xl text-4xl font-bold uppercase leading-none sm:text-5xl">
            One dealership for every way you move.
          </h2>

          <ul className="mt-12 border-b border-[#0B0B0B]/15">
            {services.map(({ icon: Icon, title, description, href, cta }) => (
              <li
                key={title}
                className="group grid gap-5 border-t border-[#0B0B0B]/15 px-0 py-8 transition-colors duration-200 hover:bg-[#0B0B0B] hover:text-white md:grid-cols-[0.8fr_1.4fr_auto] md:items-center md:gap-10 md:px-6"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#E31B23] text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="text-2xl font-bold uppercase">{title}</h3>
                </div>

                <p className="text-base leading-7 text-[#0B0B0B]/65 transition-colors group-hover:text-white/70">
                  {description}
                </p>

                <Link
                  href={href}
                  className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#E31B23] transition-colors group-hover:text-white ${ringLight}`}
                >
                  {cta}
                  <ArrowRight size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* HOW IT WORKS: tabs, one path at a time */}
        <section className="bg-[#0B0B0B] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="text-4xl font-bold uppercase leading-none sm:text-5xl">
                How it works
              </h2>

              <div
                role="tablist"
                aria-label="Choose a path"
                className="flex flex-col gap-2 sm:flex-row"
              >
                {journeys.map((item, index) => {
                  const selected = index === activeJourney;

                  return (
                    <button
                      key={item.tab}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveJourney(index)}
                      className={`chamfer px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${ringDark} ${selected ? "bg-[#E31B23] text-white" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"}`}
                    >
                      {item.tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <ol
              role="tabpanel"
              aria-label={journey.title}
              className="mt-12 grid gap-8 md:grid-cols-3"
            >
              {journey.steps.map((step, index) => (
                <li key={step} className="border-t-2 border-white/20 pt-5">
                  <span className="mb-4 flex items-center gap-3">
                    <span className="h-3 w-3 bg-[#E31B23]" />
                    <span className="text-sm font-semibold text-white/60">
                      Step {index + 1}
                    </span>
                  </span>
                  <p className="text-lg leading-7 text-white/90">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* VALUES: statement, then three columns with a red edge */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold uppercase leading-none sm:text-5xl lg:text-6xl">
              We make buying feel confident,{" "}
              <span className="text-[#E31B23]">not complicated.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#0B0B0B]/70 sm:text-lg">
              Whether you&apos;re shopping for a family SUV, a city car, or a
              pickup for work, we help you find something that fits your life
              and your budget.
            </p>
          </div>

          <ul className="mt-14 grid gap-10 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <li key={title} className="border-l-4 border-[#E31B23] pl-6">
                <Icon size={30} className="text-[#0B0B0B]" strokeWidth={1.8} />
                <h3 className="mt-4 text-2xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#0B0B0B]/65">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
