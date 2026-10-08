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

/*
  Prime Auto Display palette
  dark #1C0606 | page #150404 | panel #2A0A0A | input #2E0C0C
  maroon #9B1111 | gold #F9A602 | cream #FDF5DC | card #FFFBEF
*/

const DEFAULT_LOAD_ERROR =
  "We couldn’t load our sold vehicles right now. Please refresh the page or contact our team for assistance.";

// Set to false if you don't want to show prices on sold cars.
const SHOW_PRICE = true;
const CARS_PER_PAGE = 12;

const ringDark =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602]";
const ringLight =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C0606]";

const fieldClass =
  "h-12 w-full border-2 border-[#FDF5DC]/15 bg-[#2E0C0C] px-4 text-sm text-[#FDF5DC] placeholder:text-[#FDF5DC]/40 outline-none transition-colors focus:border-[#F9A602] focus:bg-[#3A1212]";

const stateBox =
  "border-t-4 border-[#9B1111] bg-[#FFFBEF] px-6 py-16 text-center";
const stateBtn = `chamfer mt-6 inline-flex items-center gap-2 bg-[#9B1111] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1C0606] ${ringLight}`;
const pageBtn =
  "inline-flex h-10 items-center justify-center border-2 border-[#1C0606]/25 px-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors hover:border-[#9B1111] hover:bg-[#9B1111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#1C0606]/25 disabled:hover:bg-transparent disabled:hover:text-[#1C0606]";

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
        [car.name, car.type, car.location].some((v) =>
          (v ?? "").toLowerCase().includes(q),
        );
      return (
        matchesSearch && (selectedModel === "all" || car.name === selectedModel)
      );
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
      <main className="min-h-screen bg-[#1C0606] text-[#FDF5DC]">
        {/* HEADER */}
        <section className="relative overflow-hidden bg-[#1C0606]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 hidden h-full w-72 -skew-x-12 bg-[#9B1111] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-[#F9A602] lg:block"
          />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 lg:py-24 xl:pr-40 2xl:pr-8">
            <div className="lg:min-w-0 lg:flex-1">
              <div className="max-w-4xl border-l-8 border-[#F9A602] pl-5 sm:pl-8">
                <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-8xl">
                  Cars that found homes.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#FDF5DC]/70 sm:text-lg">
                  Every car here went to a happy driver. Your next ride could be
                  on this list.
                </p>
              </div>
            </div>

            <div className="w-full border-t-4 border-[#F9A602] bg-[#2A0A0A] lg:w-[400px] lg:shrink-0">
              <div className="p-6 sm:p-7">
                <h2 className="flex items-center gap-3 text-2xl font-bold uppercase">
                  <BadgeCheck size={22} className="text-[#F9A602]" />
                  Sold so far
                </h2>

                <div className="mt-5 border-l-4 border-[#F9A602] bg-[#1C0606] p-5">
                  {isLoading ? (
                    <p className="text-sm text-[#FDF5DC]/60">Counting...</p>
                  ) : loadError ? (
                    <p className="text-sm text-[#FDF5DC]/60">
                      Count unavailable right now.
                    </p>
                  ) : (
                    <>
                      <p className="text-6xl font-black leading-none text-[#F9A602]">
                        {vehicles.length}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#FDF5DC]/60">
                        vehicle{vehicles.length !== 1 ? "s" : ""} sold
                      </p>
                    </>
                  )}
                </div>

                <ul className="mt-5 divide-y divide-[#FDF5DC]/10 border-y border-[#FDF5DC]/10">
                  {[
                    { label: "Browse the showroom", href: "/showroom" },
                    { label: "Sell or trade your car", href: "/sell-trade" },
                    { label: "Contact us", href: "/contact" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`group flex items-center justify-between gap-4 py-4 text-sm font-bold uppercase transition-colors hover:text-[#F9A602] ${ringDark}`}
                      >
                        {item.label}
                        <ArrowRight
                          size={18}
                          className="shrink-0 text-[#F9A602] transition-transform group-hover:translate-x-1"
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

        {/* LIST: cream, same as the showroom */}
        <section className="bg-[#FDF5DC] text-[#1C0606]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            {/* FILTERS */}
            <div className="mb-10 border-t-4 border-[#F9A602] bg-[#1C0606] p-5 text-[#FDF5DC] sm:p-6">
              <h2 className="mb-4 flex items-center gap-3 text-xl font-bold uppercase">
                <SlidersHorizontal size={20} className="text-[#F9A602]" />
                Search &amp; filter
              </h2>

              <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
                <label className="relative block">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F9A602]"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search model, type, or city"
                    className={`${fieldClass} pl-11`}
                  />
                </label>

                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className={`${fieldClass} appearance-none pr-10`}
                  >
                    {modelOptions.map((model) => (
                      <option
                        key={model}
                        value={model}
                        className="bg-[#2E0C0C]"
                      >
                        {model === "all" ? "All models" : model}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#F9A602]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={`${fieldClass} appearance-none pr-10`}
                  >
                    <option value="newest" className="bg-[#2E0C0C]">
                      Newest first
                    </option>
                    <option value="oldest" className="bg-[#2E0C0C]">
                      Oldest first
                    </option>
                    {SHOW_PRICE && (
                      <>
                        <option value="price-low" className="bg-[#2E0C0C]">
                          Price: low to high
                        </option>
                        <option value="price-high" className="bg-[#2E0C0C]">
                          Price: high to low
                        </option>
                      </>
                    )}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#F9A602]"
                  />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`inline-flex h-12 items-center justify-center gap-2 border-2 border-[#FDF5DC]/25 px-5 text-sm font-bold uppercase tracking-wider transition-colors hover:border-[#F9A602] hover:bg-[#9B1111] ${ringDark}`}
                  >
                    <X size={15} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* CONTENT */}
            {isLoading ? (
              <div className={stateBox}>
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#1C0606]/15 border-t-[#9B1111]" />
                <p className="mt-6 text-2xl font-bold uppercase">
                  Loading sold cars...
                </p>
              </div>
            ) : loadError ? (
              <div className={stateBox}>
                <p className="text-2xl font-bold uppercase">
                  Couldn&apos;t load sold cars
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#1C0606]/70">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={() => load()}
                  className={stateBtn}
                >
                  <RotateCcw size={16} />
                  Try again
                </button>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className={stateBox}>
                <p className="text-2xl font-bold uppercase">
                  {vehicles.length === 0
                    ? "No sold cars yet"
                    : "No matching cars found"}
                </p>
                <p className="mt-2 text-sm text-[#1C0606]/60">
                  {vehicles.length === 0
                    ? "Sold cars will show up here."
                    : "Try a different model or clear your filters."}
                </p>
                {vehicles.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={stateBtn}
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
                        className={`group flex h-full flex-col overflow-hidden border border-t-4 border-[#1C0606]/10 border-t-transparent bg-[#FFFBEF] transition-colors hover:border-t-[#F9A602] ${ringLight}`}
                      >
                        <div className="relative overflow-hidden bg-[#F5E9C8] p-3">
                          <div className="absolute right-0 top-0 z-10 inline-flex items-center gap-1.5 bg-[#1C0606] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F9A602]">
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
                            <div className="flex h-52 w-full items-center justify-center text-sm text-[#1C0606]/40">
                              No image available
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <div>
                            <p className="text-sm font-semibold text-[#9B1111]">
                              {car.year} | {car.type}
                            </p>
                            <h3 className="mt-1 text-2xl font-bold uppercase leading-tight">
                              {car.name}
                            </h3>
                            {SHOW_PRICE && (
                              <span className="mt-2 block text-lg font-black text-[#1C0606]/65">
                                <span className="mr-1.5 text-xs font-semibold text-[#1C0606]/55">
                                  Sold at
                                </span>
                                {car.price}
                              </span>
                            )}
                          </div>

                          <div className="mt-auto pt-5">
                            <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
                              <div className="min-w-0 bg-[#FDF5DC] p-3">
                                <span className="block text-xs font-semibold text-[#1C0606]/55">
                                  Mileage
                                </span>
                                <span className="mt-2 block min-h-10 line-clamp-2 font-semibold leading-5">
                                  {car.mileage}
                                </span>
                              </div>
                              <div className="min-w-0 bg-[#FDF5DC] p-3">
                                <span className="block text-xs font-semibold text-[#1C0606]/55">
                                  Engine
                                </span>
                                <span className="mt-2 block min-h-10 line-clamp-2 font-semibold leading-5">
                                  {car.engine}
                                </span>
                              </div>
                            </div>

                            <div className="flex min-h-14 items-center justify-between gap-3 border-t border-[#1C0606]/10 pt-3 text-sm text-[#1C0606]/70">
                              <span className="flex min-w-0 items-center gap-2">
                                <MapPin
                                  size={14}
                                  className="shrink-0 text-[#9B1111]"
                                />
                                <span
                                  title={car.location}
                                  className="line-clamp-2 leading-5"
                                >
                                  {car.location}
                                </span>
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-2 font-bold uppercase text-[#1C0606] transition-colors group-hover:text-[#9B1111]">
                                Details
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
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`${pageBtn} ${ringLight}`}
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
                            className={`flex h-10 w-10 items-center justify-center text-sm font-bold transition-colors ${ringLight} ${
                              currentPage === page
                                ? "bg-[#9B1111] text-white"
                                : "border-2 border-[#1C0606]/25 hover:border-[#9B1111] hover:text-[#9B1111]"
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
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`${pageBtn} ${ringLight}`}
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
        <section className="bg-[#1C0606]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="border-l-8 border-[#F9A602] pl-5">
              <h2 className="text-4xl font-black uppercase leading-none sm:text-5xl">
                Looking for your next ride?
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#FDF5DC]/75">
                Browse what&apos;s available now, or sell or trade in your
                current car.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className={`chamfer inline-flex items-center justify-center gap-2 bg-[#F9A602] px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors hover:bg-[#FDF5DC] ${ringDark}`}
              >
                View Showroom
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/sell-trade"
                className={`chamfer inline-flex items-center justify-center bg-[#9B1111] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#B91C1C] ${ringDark}`}
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
