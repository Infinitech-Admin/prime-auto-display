"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Gauge,
  RotateCcw,
  Settings2,
} from "lucide-react";

import {
  MEDIA_BASE_URL,
  fetchVehicles,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

const MAX_FEATURED = 6;

const DEFAULT_LOAD_ERROR =
  "We couldn’t load the featured vehicles right now. Please try again.";

/*
  Prime Auto Display palette
  maroon  #9B1111   hover #B91C1C
  gold    #F9A602
  dark    #1C0606
  cream   #FDF5DC
*/

export default function ShowcaseSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const { data } = await fetchVehicles({ signal });
      setVehicles(data ?? []);
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

  // Available vehicles first (with an image), capped to MAX_FEATURED.
  const cars = useMemo(() => {
    const withImage = vehicles.filter((v) => !!v.image);
    const available = withImage.filter(
      (v) => v.status === "available" && v.stock > 0,
    );
    const pool = available.length > 0 ? available : withImage;

    return pool.slice(0, MAX_FEATURED).map((v) => ({
      id: v.id,
      name: v.name,
      year: v.year,
      type: v.type,
      mileage: v.mileage,
      engine: v.engine,
      horsepower: v.horsepower,
      transmission: v.transmission,
      image: resolveMediaUrl(v.image, MEDIA_BASE_URL),
    }));
  }, [vehicles]);

  const total = cars.length;
  const safeIndex = total > 0 ? Math.min(activeIndex, total - 1) : 0;
  const activeCar = cars[safeIndex];

  const goNext = () => {
    if (total < 2) return;
    setDirection("next");
    setActiveIndex((current) => (current >= total - 1 ? 0 : current + 1));
  };

  const goPrevious = () => {
    if (total < 2) return;
    setDirection("prev");
    setActiveIndex((current) => (current <= 0 ? total - 1 : current - 1));
  };

  useEffect(() => {
    if (isPaused || total < 2) return;

    const interval = window.setInterval(() => {
      setDirection("next");
      setActiveIndex((current) => (current >= total - 1 ? 0 : current + 1));
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, total]);

  const getPosition = (index: number) => {
    let difference = index - safeIndex;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  };

  return (
    <section
      className="relative overflow-hidden bg-[#1C0606] py-16 text-[#FDF5DC]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Maroon glow behind the stage */}
      <div className="pointer-events-none absolute left-1/2 top-[55%] h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9B1111]/35 blur-[150px]" />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl border-l-4 border-[#F9A602] pl-5">
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#FDF5DC] sm:text-5xl lg:text-6xl">
              Drive excellence.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#FDF5DC]/70 sm:text-base">
              A refined collection of premium vehicles, selected for
              performance, design, and lasting value.
            </p>
          </div>

          <Link
            href="/showroom"
            className="group inline-flex items-center gap-2 border-b-2 border-[#F9A602] pb-1 text-base font-bold text-[#F9A602] transition-colors duration-300 hover:border-[#FDF5DC] hover:text-[#FDF5DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F9A602]"
          >
            Visit showroom
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mx-auto mt-16 flex h-[360px] max-w-4xl flex-col items-center justify-center text-center sm:h-[480px] lg:h-[620px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#F9A602]/30 bg-[#9B1111]/20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F9A602]/30 border-t-[#F9A602]" />
            </div>
            <p className="mt-6 text-lg font-semibold text-[#FDF5DC]">
              Loading featured vehicles...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && loadError && (
          <div className="mx-auto mt-16 flex max-w-xl flex-col items-center border-t-4 border-[#9B1111] bg-[#2A0A0A] px-6 py-12 text-center">
            <p className="text-xl font-bold text-[#FDF5DC]">
              Something went wrong
            </p>
            <p className="mt-3 text-sm leading-6 text-[#FDF5DC]/70">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => load()}
              className="chamfer mt-6 inline-flex items-center gap-2 bg-[#F9A602] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors duration-300 hover:bg-[#FDF5DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <RotateCcw size={16} />
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !loadError && total === 0 && (
          <div className="mx-auto mt-16 max-w-xl border border-dashed border-[#F9A602]/30 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[#FDF5DC]">
              No vehicles to feature yet
            </p>
            <p className="mt-2 text-sm text-[#FDF5DC]/70">
              Please check back soon for new arrivals.
            </p>
          </div>
        )}

        {/* Car showcase */}
        {!isLoading && !loadError && total > 0 && activeCar && (
          <div className="relative mt-14">
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrevious}
                  aria-label="Previous vehicle"
                  className="absolute left-1 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#F9A602]/50 bg-[#1C0606]/70 text-[#F9A602] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#F9A602] hover:bg-[#F9A602] hover:text-[#1C0606] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602] sm:left-5 sm:h-12 sm:w-12 lg:left-10"
                >
                  <ArrowLeft size={19} />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next vehicle"
                  className="absolute right-1 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#F9A602]/50 bg-[#1C0606]/70 text-[#F9A602] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#F9A602] hover:bg-[#F9A602] hover:text-[#1C0606] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602] sm:right-5 sm:h-12 sm:w-12 lg:right-10"
                >
                  <ArrowRight size={19} />
                </button>
              </>
            )}

            <div className="relative mx-auto h-[360px] max-w-[1500px] sm:h-[480px] lg:h-[620px]">
              {/* Gold floor line the cars sit on */}
              <div className="pointer-events-none absolute bottom-[14%] left-0 right-0 z-0 h-px bg-gradient-to-r from-transparent via-[#F9A602]/70 to-transparent" />

              {cars.map((car, index) => {
                const position = getPosition(index);

                const isCenter = position === 0;
                const isLeft = position === -1;
                const isRight = position === 1;

                let positionClass = "";

                if (isCenter) {
                  positionClass =
                    "left-1/2 w-[96%] translate-x-[-50%] scale-100 opacity-100 blur-0 z-30 sm:w-[80%] lg:w-[72%]";
                } else if (isLeft) {
                  positionClass =
                    "left-[-18%] w-[58%] translate-x-0 scale-[0.72] opacity-25 blur-[2px] z-10 sm:left-[-12%] sm:w-[55%] sm:scale-[0.78] lg:left-[-8%] lg:w-[48%]";
                } else if (isRight) {
                  positionClass =
                    "left-[118%] w-[58%] translate-x-[-100%] scale-[0.72] opacity-25 blur-[2px] z-10 sm:left-[112%] sm:w-[55%] sm:scale-[0.78] lg:left-[108%] lg:w-[48%]";
                } else {
                  positionClass =
                    "left-1/2 w-[50%] translate-x-[-50%] scale-[0.5] opacity-0 blur-[15px] z-0 pointer-events-none";
                }

                return (
                  <div
                    key={car.id}
                    className={`absolute top-1/2 h-full -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${positionClass}`}
                  >
                    <div className="relative h-full w-full">
                      {/* Floor glow */}
                      {isCenter && (
                        <div className="absolute bottom-[4%] left-1/2 h-16 w-[65%] -translate-x-1/2 rounded-full bg-[#F9A602]/20 blur-3xl transition-opacity duration-700" />
                      )}

                      <Image
                        src={car.image}
                        alt={car.name}
                        fill
                        priority={isCenter}
                        unoptimized
                        className={`relative z-10 object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isCenter
                            ? "scale-125 drop-shadow-[0_40px_40px_rgba(0,0,0,0.85)]"
                            : "drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Car details */}
            <div
              key={`${activeCar.id}-${direction}`}
              className={`relative z-40 mx-auto mt-8 max-w-4xl text-center ${
                direction === "next"
                  ? "animate-[showcaseDetailsNext_500ms_ease-out]"
                  : "animate-[showcaseDetailsPrev_500ms_ease-out]"
              }`}
            >
              <div className="flex items-center justify-center gap-3 text-base text-[#F9A602]">
                <span className="font-semibold">{activeCar.year}</span>
                <span className="h-1 w-1 rounded-full bg-[#FDF5DC]/40" />
                <span>{activeCar.type}</span>
                <span className="h-1 w-1 rounded-full bg-[#FDF5DC]/40" />
                <span>{activeCar.mileage}</span>
              </div>

              <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#FDF5DC] sm:text-4xl">
                {activeCar.name}
              </h3>

              {/* Specs */}
              <div className="mt-6 flex items-center justify-center divide-x divide-[#F9A602]/25">
                <div className="flex items-center gap-2 px-4 sm:px-7">
                  <Gauge size={18} className="text-[#F9A602]" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#FDF5DC]">
                      {activeCar.engine}
                    </p>
                    <p className="text-[11px] text-[#FDF5DC]/60">Engine</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 sm:px-7">
                  <CarFront size={18} className="text-[#F9A602]" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#FDF5DC]">
                      {activeCar.horsepower}
                    </p>
                    <p className="text-[11px] text-[#FDF5DC]/60">Power</p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 px-4 sm:flex sm:px-7">
                  <Settings2 size={18} className="text-[#F9A602]" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#FDF5DC]">
                      {activeCar.transmission}
                    </p>
                    <p className="text-[11px] text-[#FDF5DC]/60">
                      Transmission
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href={`/showroom/car/${activeCar.id}`}
                  className="chamfer group inline-flex items-center gap-3 bg-[#9B1111] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#B91C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  View details
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Dots */}
              {total > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {cars.map((car, index) => (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => {
                        setDirection(index > safeIndex ? "next" : "prev");
                        setActiveIndex(index);
                      }}
                      aria-label={`View ${car.name}`}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === safeIndex
                          ? "w-8 bg-[#F9A602]"
                          : "w-1.5 bg-[#FDF5DC]/25 hover:bg-[#FDF5DC]/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes showcaseDetailsNext {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes showcaseDetailsPrev {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}