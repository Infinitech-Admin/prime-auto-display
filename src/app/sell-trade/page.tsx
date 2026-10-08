// Path: app/sell-trade/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  ChevronDown,
  Users,
  Gauge,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import CTA from "../../components/home/cta";

const PHONE_DISPLAY = "0997 253 0052";
const PHONE_TEL = "+639972530052";

const steps = [
  {
    title: "Tell us about your car",
    copy: "Share the make, model, mileage, condition, and your target timeline. We’ll match you with the best buyer or trade-in option.",
  },
  {
    title: "Get a fair offer",
    copy: "Our valuation experts compare current market demand, vehicle condition, and dealer pricing to price your car competitively.",
  },
  {
    title: "Close with confidence",
    copy: "Choose cash, trade-in, or an upgrade path and finalize the deal with transparent paperwork and no hidden surprises.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    description:
      "We believe the right purchase starts with transparency, clear information, and no pressure. Every recommendation is grounded in your needs, not just the inventory in front of us.",
  },
  {
    icon: BadgeCheck,
    title: "Quality first",
    description:
      "Every car we present is carefully inspected so you can move forward with confidence, whether you're buying your first car or upgrading for the next chapter.",
  },
  {
    icon: Users,
    title: "Client-focused service",
    description:
      "From showroom visits to financing conversations, our team works with patience and precision to make the process feel simple and personal.",
  },
  {
    icon: Sparkles,
    title: "Premium experience",
    description:
      "We combine standout vehicles with thoughtful service, creating a buying experience that feels polished, relaxed, and genuinely professional.",
  },
];

const conditionFactors: Record<string, number> = {
  Excellent: 1,
  Good: 0.82,
  Fair: 0.66,
};

const vehicleTypeFactors: Record<string, number> = {
  Sedan: 1,
  SUV: 1.15,
  Hatchback: 0.88,
  Truck: 1.2,
  Luxury: 1.2,
};

// Placeholder reference prices (PHP) for a brand-new, excellent-condition sedan.
const DEFAULT_BASE_PRICE = 900000;
const brandBasePrices: Record<string, number> = {
  suzuki: 800000,
  nissan: 900000,
  hyundai: 900000,
  kia: 900000,
  mitsubishi: 950000,
  honda: 1050000,
  toyota: 1100000,
  ford: 1100000,
  mazda: 1100000,
  isuzu: 1300000,
  subaru: 1300000,
  audi: 3000000,
  bmw: 3200000,
  lexus: 3200000,
  mercedes: 3400000,
  porsche: 6500000,
};

const getBasePrice = (brand: string) => {
  const normalized = brand.trim().toLowerCase();
  if (!normalized) return DEFAULT_BASE_PRICE;
  const match = Object.keys(brandBasePrices).find((key) =>
    normalized.includes(key),
  );
  return match ? brandBasePrices[match] : DEFAULT_BASE_PRICE;
};

const labelClass =
  "mb-2 flex items-center gap-1 text-sm font-semibold text-white";

const inputClass =
  "h-12 w-full border-2 border-white/10 bg-[#1A1A1A] px-4 text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#E31B23] focus:bg-[#202020]";

const selectClass =
  "h-12 w-full appearance-none border-2 border-white/10 bg-[#1A1A1A] px-4 pr-10 text-white outline-none transition-colors focus:border-[#E31B23] focus:bg-[#202020]";

type FormState = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  type: string;
  condition: string;
  fullName: string;
  phone: string;
  email: string;
};

type SubmitStatus = "idle" | "submitting" | "error" | "success";

const initialForm: FormState = {
  brand: "BMW",
  model: "5 Series",
  year: "2022",
  mileage: "18500",
  type: "Sedan",
  condition: "Excellent",
  fullName: "",
  phone: "",
  email: "",
};

export default function SellTradePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const estimate = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearValue = Number(form.year) || currentYear;
    const mileageValue = Number(form.mileage) || 0;
    const basePrice = getBasePrice(form.brand);
    const age = Math.max(currentYear - yearValue, 0);
    const ageFactor = Math.max(0.45, 1 - age * 0.06);
    const mileageFactor = Math.max(0.5, 1 - mileageValue / 220000);
    const typeFactor = vehicleTypeFactors[form.type] ?? 1;
    const conditionFactor = conditionFactors[form.condition] ?? 1;

    return Math.round(
      basePrice * typeFactor * conditionFactor * ageFactor * mileageFactor,
    );
  }, [form.brand, form.year, form.mileage, form.type, form.condition]);

  const rangeLow = Math.round(estimate * 0.9);
  const rangeHigh = Math.round(estimate * 1.12);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status !== "submitting") setStatus("idle");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    if (
      !form.brand.trim() ||
      !form.model.trim() ||
      !form.year ||
      form.mileage.trim() === "" ||
      !form.fullName.trim()
    ) {
      setErrorMessage("Please complete all required fields.");
      setStatus("error");
      return;
    }

    if (!form.phone.trim() && !form.email.trim()) {
      setErrorMessage("Please provide a phone number or an email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/sell-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          brand: form.brand.trim(),
          model: form.model.trim(),
          year: Number(form.year),
          mileage: Number(form.mileage),
          type: form.type,
          condition: form.condition,
          estimate,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const firstError = data?.errors
          ? (Object.values(data.errors)[0] as string[])?.[0]
          : null;
        setErrorMessage(
          firstError ||
            data?.message ||
            "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch {
      setErrorMessage("Unable to reach the server. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0B0B0B] text-white">
        {/* HEADER */}
        <section className="relative overflow-hidden bg-[#0B0B0B]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 hidden h-full w-72 -skew-x-12 bg-[#E31B23] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-white lg:block"
          />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 lg:py-24 xl:pr-40 2xl:pr-8">
            <div className="lg:min-w-0 lg:flex-1">
              <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.92] sm:text-6xl lg:text-7xl">
                Turn your car into your
                <span className="block text-[#E31B23]">next upgrade.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Get a competitive offer for your vehicle, trade it in for a
                better fit, and move forward without the usual dealership
                pressure.
              </p>
            </div>

            {/* Right side: options + direct line */}
            <div className="w-full border-t-4 border-[#E31B23] bg-[#161616] lg:w-[400px] lg:shrink-0">
              <div className="p-6 sm:p-7">
                <h2 className="text-2xl font-bold uppercase">Pick your path</h2>

                <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
                  {[
                    { label: "Cash", note: "Sell your car outright" },
                    {
                      label: "Trade-in",
                      note: "Put its value toward your next car",
                    },
                    { label: "Upgrade", note: "Move up to a better fit" },
                  ].map((item) => (
                    <li key={item.label} className="py-4">
                      <span className="block text-lg font-bold uppercase leading-tight">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-white/55">
                        {item.note}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#valuation"
                  className="chamfer mt-6 flex items-center justify-center gap-2 bg-[#E31B23] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get my estimate
                  <ArrowRight size={16} />
                </a>

                <a
                  href={`tel:${PHONE_TEL}`}
                  className="mt-5 flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Phone size={18} className="shrink-0 text-[#E31B23]" />
                  <span>
                    Prefer to talk?{" "}
                    <span className="font-bold text-white">
                      {PHONE_DISPLAY}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-[#111111]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold uppercase sm:text-4xl">
              <CarFront size={28} className="text-[#E31B23]" />
              How it works
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="border-t-4 border-[#E31B23] bg-[#161616] p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center bg-[#E31B23] text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold uppercase leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VEHICLE DETAILS + ESTIMATE */}
        <section id="valuation" className="scroll-mt-24 bg-[#0B0B0B]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <form
              onSubmit={handleSubmit}
              className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
            >
              {/* Vehicle details */}
              <div className="border-t-4 border-[#E31B23] bg-[#161616]">
                <div className="border-b border-white/10 px-5 py-6 sm:px-7">
                  <h2 className="flex items-center gap-3 text-3xl font-bold uppercase">
                    <Gauge size={26} className="shrink-0 text-[#E31B23]" />
                    Tell us about your car
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                    Enter your vehicle details to receive an estimated market
                    value.
                  </p>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>
                        Brand
                        <span className="text-[#E31B23]">*</span>
                      </span>
                      <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        placeholder="e.g. BMW"
                        required
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className={labelClass}>
                        Model
                        <span className="text-[#E31B23]">*</span>
                      </span>
                      <input
                        type="text"
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                        placeholder="e.g. 5 Series"
                        required
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className={labelClass}>
                        Year
                        <span className="text-[#E31B23]">*</span>
                      </span>
                      <input
                        type="number"
                        name="year"
                        min="2000"
                        max="2035"
                        value={form.year}
                        onChange={handleChange}
                        placeholder="2023"
                        required
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className={labelClass}>
                        Vehicle type
                        <span className="text-[#E31B23]">*</span>
                      </span>
                      <div className="relative">
                        <select
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          className={selectClass}
                        >
                          <option>Sedan</option>
                          <option>SUV</option>
                          <option>Hatchback</option>
                          <option>Truck</option>
                          <option>Luxury</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#E31B23]"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className={labelClass}>
                        Mileage
                        <span className="text-[#E31B23]">*</span>
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          name="mileage"
                          min="0"
                          value={form.mileage}
                          onChange={handleChange}
                          placeholder="18,500"
                          required
                          className={`${inputClass} pr-14`}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-bold text-white/50">
                          KM
                        </span>
                      </div>
                    </label>

                    <label className="block">
                      <span className={labelClass}>
                        Condition
                        <span className="text-[#E31B23]">*</span>
                      </span>
                      <div className="relative">
                        <select
                          name="condition"
                          value={form.condition}
                          onChange={handleChange}
                          className={selectClass}
                        >
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#E31B23]"
                        />
                      </div>
                    </label>
                  </div>

                  {/* Contact details */}
                  <div className="mt-8 border-t border-white/10 pt-7">
                    <h3 className="flex items-center gap-3 text-xl font-bold uppercase">
                      <UserRound size={20} className="text-[#E31B23]" />
                      Contact details
                    </h3>
                    <p className="mt-2 text-sm text-white/55">
                      So our team can reach you. Phone or email is required.
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <label className="block sm:col-span-2">
                        <span className={labelClass}>
                          Full name
                          <span className="text-[#E31B23]">*</span>
                        </span>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Juan Dela Cruz"
                          autoComplete="name"
                          required
                          className={inputClass}
                        />
                      </label>

                      <label className="block">
                        <span className={labelClass}>Phone</span>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="09XX XXX XXXX"
                          autoComplete="tel"
                          className={inputClass}
                        />
                      </label>

                      <label className="block">
                        <span className={labelClass}>Email</span>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  </div>

                  <p className="mt-7 border-l-4 border-white/20 bg-white/5 px-4 py-3 text-xs leading-5 text-white/60">
                    Your final offer may vary depending on inspection results,
                    vehicle history, documentation, and current market
                    conditions.
                  </p>
                </div>
              </div>

              {/* Estimated value */}
              <div className="border-t-4 border-[#E31B23] bg-[#161616] lg:sticky lg:top-28">
                <div className="p-5 sm:p-7">
                  <h2 className="flex items-center gap-3 text-3xl font-bold uppercase">
                    <BadgeCheck size={26} className="shrink-0 text-[#E31B23]" />
                    Your car value
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    A preliminary estimate based on your vehicle information.
                  </p>

                  {/* Main value */}
                  <div className="mt-6 border-l-4 border-[#E31B23] bg-[#0B0B0B] p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white/60">
                        Estimated market value
                      </p>
                      <span className="bg-[#E31B23] px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Live
                      </span>
                    </div>

                    <p className="mt-3 break-words text-4xl font-bold tracking-tight sm:text-5xl">
                      ₱{estimate.toLocaleString()}
                    </p>

                    <p className="mt-2 text-xs text-white/50">
                      Preliminary estimate. Subject to inspection.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="bg-[#0B0B0B] p-4">
                      <p className="text-xs font-semibold text-white/55">
                        Market range
                      </p>
                      <p className="mt-2 text-base font-bold leading-6">
                        ₱{rangeLow.toLocaleString()}
                        <span className="mx-1 text-[#E31B23]">to</span>₱
                        {rangeHigh.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-[#0B0B0B] p-4">
                      <p className="text-xs font-semibold text-white/55">
                        Vehicle condition
                      </p>
                      <p className="mt-2 text-base font-bold">
                        {form.condition}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="chamfer inline-flex items-center justify-center gap-2 bg-[#E31B23] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                      >
                        {status === "submitting"
                          ? "Submitting..."
                          : "Submit for review"}
                        <ArrowRight size={16} />
                      </button>

                      <Link
                        href="/showroom"
                        className="chamfer inline-flex items-center justify-center gap-2 bg-white px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0B] transition-colors hover:bg-[#E31B23] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <CarFront size={16} />
                        View showroom
                      </Link>
                    </div>

                    {status === "error" && (
                      <p
                        role="alert"
                        className="mt-4 border-l-4 border-[#E31B23] bg-[#E31B23]/15 px-4 py-3 text-sm font-medium text-[#FF8A90]"
                      >
                        {errorMessage}
                      </p>
                    )}

                    {status === "success" && (
                      <p
                        role="status"
                        className="mt-4 border-l-4 border-white bg-white/10 px-4 py-3 text-sm font-medium text-white"
                      >
                        Thanks! Your vehicle details were submitted. Our team
                        will contact you soon.
                      </p>
                    )}

                    {(status === "idle" || status === "submitting") && (
                      <p className="mt-4 text-xs leading-5 text-white/50">
                        Submit your vehicle details for our team to review your
                        estimate.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* WHY US */}
        <section className="bg-[#111111]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2 className="max-w-3xl border-l-8 border-[#E31B23] pl-5 text-3xl font-bold uppercase leading-[1] sm:text-4xl lg:text-5xl">
              A car buying experience built around you.
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="border-t-4 border-transparent bg-[#161616] p-6 transition-colors hover:border-[#E31B23] hover:bg-[#1C1C1C]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center bg-[#E31B23] text-white">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold uppercase leading-tight">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/70">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
