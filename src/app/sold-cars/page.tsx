// Path: app/sold-cars/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  MEDIA_BASE_URL,
  fetchSoldVehicles,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

const DEFAULT_LOAD_ERROR =
  "We couldn’t load our sold vehicles right now. Please refresh the page or contact our team for assistance.";

// Set to false if you don't want to show prices on sold cars.
const SHOW_PRICE = true;

const CARS_PER_PAGE = 12;

const fieldClass =
  "h-12 w-full border-2 border-white/10 bg-[#1A1A1A] px-4 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#E31B23] focus:bg-[#202020]";

export default function SoldCarsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const { data } = await fetchSoldVehicles({ signal });
      setVehicles(data ?? []); // API already returns sold cars only
      setIsLoading(false);
    } catch (err) {
      if (isAbortError(err)) return;
      setLoadError((err as ApiError).message || DEFAULT_LOAD_ERROR);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const modelOptions = useMemo(
    () => ["all", ...Array.from(new Set(vehicles.map((v) => v.name)))],
    [vehicles],
  );

  const filteredCars = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = vehicles.filter((car) => {
      const matchesSearch =
        q.length === 0 ||
        [car.name, car.type, car.location].some((value) =>
          (value ?? "").toLowerCase().includes(q),
        );
      const matchesModel =
        selectedModel === "all" || car.name === selectedModel;

      return matchesSearch && matchesModel;
    });

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return Number(b.year) - Number(a.year);
        case "oldest":
          return Number(a.year) - Number(b.year);
        case "price-low":
          return a.price_value - b.price_value;
        case "price-high":
          return b.price_value - a.price_value;
        default:
          return 0;
      }
    });
  }, [vehicles, search, selectedModel, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCars.length / CARS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedModel, sortOrder]);

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * CARS_PER_PAGE;
    return filteredCars.slice(start, start + CARS_PER_PAGE);
  }, [filteredCars, currentPage]);

  const clearFilters = () => {
    setSearch("");
    setSelectedModel("all");
    setSortOrder("newest");
  };

  const hasActiveFilters =
    search.trim() !== "" || selectedModel !== "all" || sortOrder !== "newest";

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
              <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.92] sm:text-6xl lg:text-8xl">
                Cars we&apos;ve
                <span className="block text-[#E31B23]">found homes.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                A look at the vehicles we&apos;ve successfully sold. Every one
                of them went to a happy driver, and yours could be next.
              </p>
            </div>

            {/* Right side: sold count + quick links */}
            <div className="w-full border-t-4 border-[#E31B23] bg-[#161616] lg:w-[400px] lg:shrink-0">
              <div className="p-6 sm:p-7">
                <h2 className="flex items-center gap-3 text-2xl font-bold uppercase">
                  <BadgeCheck size={22} className="text-[#E31B23]" />
                  Sold so far
                </h2>

                <div className="mt-5 border-l-4 border-[#E31B23] bg-[#0B0B0B] p-5">
                  {isLoading ? (
                    <p className="text-sm text-white/60">Counting...</p>
                  ) : loadError ? (
                    <p className="text-sm text-white/60">
                      Count unavailable right now.
                    </p>
                  ) : (
                    <>
                      <p className="text-6xl font-bold leading-none">
                        {vehicles.length}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white/60">
                        vehicle{vehicles.length !== 1 ? "s" : ""} sold
                      </p>
                    </>
                  )}
                </div>

                <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
                  {[
                    { label: "Browse the showroom", href: "/showroom" },
                    { label: "Sell or trade your car", href: "/sell-trade" },
                    { label: "Contact us", href: "/contact" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between gap-4 py-4 text-sm font-bold uppercase transition-colors hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {item.label}
                        <ArrowRight
                          size={18}
                          className="shrink-0 text-[#E31B23] transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        {/* LIST */}
        <section className="bg-[#111111]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            {/* FILTERS */}
            <div className="mb-10 border-t-4 border-[#E31B23] bg-[#161616] p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-3 text-xl font-bold uppercase">
                <SlidersHorizontal size={20} className="text-[#E31B23]" />
                Search &amp; filter
              </h2>

              <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
                <label className="relative block">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#E31B23]"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search model, type, or city"
                    className={`${fieldClass} pl-11`}
                  />
                </label>

                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(event) => setSelectedModel(event.target.value)}
                    className={`${fieldClass} appearance-none pr-10`}
                  >
                    {modelOptions.map((model) => (
                      <option
                        key={model}
                        value={model}
                        className="bg-[#1A1A1A]"
                      >
                        {model === "all" ? "All models" : model}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#E31B23]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    className={`${fieldClass} appearance-none pr-10`}
                  >
                    <option value="newest" className="bg-[#1A1A1A]">
                      Newest first
                    </option>
                    <option value="oldest" className="bg-[#1A1A1A]">
                      Oldest first
                    </option>
                    {SHOW_PRICE && (
                      <>
                        <option value="price-low" className="bg-[#1A1A1A]">
                          Price: low to high
                        </option>
                        <option value="price-high" className="bg-[#1A1A1A]">
                          Price: high to low
                        </option>
                      </>
                    )}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#E31B23]"
                  />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-12 items-center justify-center gap-2 border-2 border-white/20 px-5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#E31B23] hover:bg-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <X size={15} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* CONTENT */}
            {isLoading ? (
              <div className="border-t-4 border-[#E31B23] bg-[#161616] px-6 py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#E31B23]" />
                <p className="mt-6 text-2xl font-bold uppercase">
                  Loading portfolio...
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Gathering our sold vehicles.
                </p>
              </div>
            ) : loadError ? (
              <div className="border-t-4 border-[#E31B23] bg-[#161616] px-6 py-16 text-center">
                <p className="text-2xl font-bold uppercase">
                  Something went wrong
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={() => load()}
                  className="chamfer mt-6 inline-flex items-center gap-2 bg-[#E31B23] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <RotateCcw size={16} />
                  Retry
                </button>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="border-t-4 border-[#E31B23] bg-[#161616] px-6 py-16 text-center">
                <p className="text-2xl font-bold uppercase">
                  {vehicles.length === 0
                    ? "No sold vehicles yet"
                    : "No matching vehicles found"}
                </p>
                <p className="mt-2 text-sm text-white/60">
                  {vehicles.length === 0
                    ? "Our sold vehicles will show up here."
                    : "Try adjusting your filters or searching for a different model."}
                </p>
                {vehicles.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="chamfer mt-6 inline-flex items-center gap-2 bg-[#E31B23] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <X size={15} />
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {paginatedCars.map((car) => {
                    const imageSrc = resolveMediaUrl(car.image, MEDIA_BASE_URL);

                    return (
                      <Link
                        key={car.id}
                        href={`/showroom/car/${car.id}`}
                        className="group flex h-full flex-col overflow-hidden border-t-4 border-transparent bg-[#161616] transition-colors hover:border-[#E31B23] hover:bg-[#1C1C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <div className="relative overflow-hidden bg-[#0B0B0B] p-3">
                          {/* SOLD badge */}
                          <div className="absolute right-0 top-0 z-10 inline-flex items-center gap-1.5 bg-[#E31B23] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                            <BadgeCheck size={13} />
                            Sold
                          </div>

                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={car.name}
                              width={800}
                              height={500}
                              unoptimized
                              className="h-52 w-full object-contain opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                            />
                          ) : (
                            <div className="flex h-52 w-full items-center justify-center text-sm text-white/40">
                              No image available
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <div>
                            <p className="text-sm font-semibold text-[#E31B23]">
                              {car.year} | {car.type}
                            </p>
                            <h3 className="mt-1 text-2xl font-bold uppercase leading-tight">
                              {car.name}
                            </h3>
                            {SHOW_PRICE && (
                              <span className="mt-2 block text-base font-bold text-white/60">
                                <span className="mr-1.5 text-xs font-semibold text-white/45">
                                  Sold at
                                </span>
                                {car.price}
                              </span>
                            )}
                          </div>

                          <div className="mt-auto pt-5">
                            <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
                              <div className="min-w-0 bg-[#0B0B0B] p-3">
                                <span className="block text-xs font-semibold text-white/50">
                                  Mileage
                                </span>
                                <span className="mt-2 block min-h-10 line-clamp-2 font-semibold leading-5 text-white">
                                  {car.mileage}
                                </span>
                              </div>
                              <div className="min-w-0 bg-[#0B0B0B] p-3">
                                <span className="block text-xs font-semibold text-white/50">
                                  Engine
                                </span>
                                <span className="mt-2 block min-h-10 line-clamp-2 font-semibold leading-5 text-white">
                                  {car.engine}
                                </span>
                              </div>
                            </div>

                            <div className="flex min-h-14 items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm text-white/70">
                              <span className="flex min-w-0 items-center gap-2">
                                <MapPin
                                  size={14}
                                  className="shrink-0 text-[#E31B23]"
                                />
                                <span
                                  title={car.location}
                                  className="line-clamp-2 leading-5"
                                >
                                  {car.location}
                                </span>
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-2 font-bold uppercase text-white transition-colors group-hover:text-[#E31B23]">
                                View
                                <ArrowRight
                                  size={16}
                                  className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {filteredCars.length > CARS_PER_PAGE && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      className="inline-flex h-10 items-center justify-center border-2 border-white/20 px-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#E31B23] hover:bg-[#E31B23] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/20 disabled:hover:bg-transparent"
                    >
                      Previous
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            aria-current={
                              currentPage === page ? "page" : undefined
                            }
                            className={`flex h-10 w-10 items-center justify-center text-sm font-bold transition-colors ${
                              currentPage === page
                                ? "bg-[#E31B23] text-white"
                                : "border-2 border-white/20 text-white hover:border-[#E31B23] hover:text-[#E31B23]"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="inline-flex h-10 items-center justify-center border-2 border-white/20 px-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#E31B23] hover:bg-[#E31B23] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/20 disabled:hover:bg-transparent"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* BOTTOM BAND */}
        <section className="bg-[#E31B23] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="text-4xl font-bold uppercase leading-none sm:text-5xl">
                Looking for your next ride?
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-white/90">
                Browse what&apos;s available now, or sell or trade in your
                current car.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className="chamfer inline-flex items-center justify-center gap-2 bg-[#0B0B0B] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View Showroom
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/sell-trade"
                className="chamfer inline-flex items-center justify-center bg-white px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0B] transition-colors hover:bg-[#0B0B0B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sell / Trade
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
