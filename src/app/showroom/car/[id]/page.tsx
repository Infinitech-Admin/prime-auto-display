// Path: app/showroom/car/[id]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Gauge,
  MapPin,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TestDriveDialog from "@/components/test-drive-dialog";
import FinancingCalculator from "@/components/financing-calculator";
import { useCart } from "@/context/cart-context";
import {
  MEDIA_BASE_URL,
  fetchVehicle,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

type Slide = {
  src: string;
  alt: string;
  /** The vehicle's main/cover photo (shown "contained" instead of cropped). */
  isCover?: boolean;
};

type VideoItem = {
  src: string;
  alt: string;
  poster?: string;
  length?: "short" | "long";
  duration?: string;
};

/** Ilagay ang logo.png sa /public/logo.png */
const LOGO_SRC = "/logo.png";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/* -------------------------------------------------------------------------- */
/*  IMAGE GALLERY (images only)                                               */
/* -------------------------------------------------------------------------- */

function CarGallery({ carName, slides }: { carName: string; slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pointerStartX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const last = slides.length - 1;
  const safeIndex = Math.min(index, last);

  const goNext = () =>
    setIndex((current) => (current >= last ? 0 : current + 1));
  const goPrevious = () =>
    setIndex((current) => (current <= 0 ? last : current - 1));

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }
    if (event.key === "Home") {
      event.preventDefault();
      setIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setIndex(last);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
    setIsDragging(true);
    setDragX(0);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null || !isDragging) return;
    setDragX(event.clientX - pointerStartX.current);
  };

  const finishPointerGesture = (event?: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;

    const delta =
      event && typeof event.clientX === "number"
        ? event.clientX - pointerStartX.current
        : dragX;
    const threshold = 60;

    if (Math.abs(delta) >= threshold) {
      if (delta < 0) goNext();
      else goPrevious();
    }

    pointerStartX.current = null;
    setDragX(0);
    setIsDragging(false);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) =>
    finishPointerGesture(event);

  const handlePointerCancel = () => {
    pointerStartX.current = null;
    setDragX(0);
    setIsDragging(false);
  };

  useEffect(() => {
    thumbRefs.current[safeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [safeIndex]);

  return (
    <div className="overflow-hidden border-t-4 border-[#E31B23] bg-[#161616] p-3 sm:p-5">
      {/* Media */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${carName} photos`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`relative overflow-hidden bg-[#0B0B0B] ${focusRing}`}
      >
        {/* Sliding area */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`touch-pan-y select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <div
            className="flex will-change-transform"
            style={{
              transform: `translate3d(calc(${-safeIndex * 100}% + ${dragX}px), 0, 0)`,
              transition: isDragging
                ? "none"
                : "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={`${i}-${slide.src}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
                aria-hidden={i !== safeIndex}
                className="relative h-[300px] w-full shrink-0 sm:h-[420px] md:h-[480px] lg:h-[560px]"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  unoptimized
                  sizes="(min-width: 1024px) 60vw, (min-width: 640px) 90vw, 100vw"
                  draggable={false}
                  className={`relative z-10 ${slide.isCover ? "object-contain p-4 sm:p-6" : "object-cover"}`}
                />
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            {/* PREVIOUS BUTTON */}
            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous photo"
              className={`absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-[#0B0B0B]/80 text-white transition-colors hover:bg-[#E31B23] active:scale-95 sm:left-4 sm:h-11 sm:w-11 ${focusRing}`}
            >
              <ArrowLeft size={18} />
            </button>

            {/* NEXT BUTTON */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className={`absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-[#0B0B0B]/80 text-white transition-colors hover:bg-[#E31B23] active:scale-95 sm:right-4 sm:h-11 sm:w-11 ${focusRing}`}
            >
              <ArrowRight size={18} />
            </button>
          </>
        )}

        {/* COUNTER */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-20 bg-[#E31B23] px-3 py-1.5 text-xs font-bold text-white">
          {safeIndex + 1} / {slides.length}
        </div>

        {/* Swipe hint */}
        {safeIndex === 0 && slides.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 bg-[#0B0B0B]/80 px-3 py-1.5 text-xs font-semibold text-white/80 sm:block">
            Swipe to explore
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div
          ref={stripRef}
          className="relative mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-4 sm:gap-3"
        >
          {slides.map((slide, i) => {
            const isActive = i === safeIndex;

            return (
              <button
                key={`${i}-${slide.src}`}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={isActive}
                className={`relative h-14 w-20 shrink-0 overflow-hidden border-2 bg-[#0B0B0B] transition-all duration-300 sm:h-20 sm:w-28 ${isActive ? "border-[#E31B23] opacity-100" : "border-transparent opacity-50 hover:opacity-100"} ${focusRing}`}
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="112px"
                  className={
                    slide.isCover ? "object-contain p-1" : "object-cover"
                  }
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  VIDEO SECTION (separate from the photo gallery)                           */
/* -------------------------------------------------------------------------- */

function VideoSection({
  carName,
  videos,
}: {
  carName: string;
  videos: VideoItem[];
}) {
  const [index, setIndex] = useState(0);

  const safeIndex = Math.min(index, videos.length - 1);
  const active = videos[safeIndex];
  const isLong = active.length === "long";

  return (
    <section
      aria-label={`${carName} videos`}
      className="border-t-4 border-[#E31B23] bg-[#161616] p-3 sm:p-5"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3 px-1 sm:mb-5">
        <h2 className="flex items-center gap-3 text-xl font-bold uppercase">
          <Video className="text-[#E31B23]" size={20} />
          Videos
        </h2>

        <span className="bg-[#0B0B0B] px-3 py-1.5 text-xs font-bold text-white">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </span>
      </div>

      {/* Player */}
      <div className="relative overflow-hidden bg-[#0B0B0B]">
        <div className="relative aspect-video w-full">
          {/* key forces a fresh <video> whenever the selection changes */}
          <video
            key={active.src}
            src={active.src}
            poster={active.poster}
            muted
            autoPlay={!isLong}
            loop={!isLong}
            controls={isLong}
            playsInline
            preload="metadata"
            aria-label={active.alt}
            className="h-full w-full bg-[#0B0B0B] object-cover"
          />

          {active.duration && (
            <span className="pointer-events-none absolute left-0 top-0 z-20 bg-[#E31B23] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              {isLong ? "Full walkthrough" : "Clip"} · {active.duration}
            </span>
          )}
        </div>
      </div>

      {/* Video list */}
      {videos.length > 1 && (
        <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-4 sm:gap-3">
          {videos.map((video, i) => {
            const isActive = i === safeIndex;
            const hasPoster = !!video.poster;

            return (
              <button
                key={`${i}-${video.src}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Play video ${i + 1}`}
                aria-current={isActive}
                className={`relative h-14 w-20 shrink-0 overflow-hidden border-2 bg-[#0B0B0B] transition-all duration-300 sm:h-20 sm:w-28 ${isActive ? "border-[#E31B23] opacity-100" : "border-transparent opacity-50 hover:opacity-100"} ${focusRing}`}
              >
                {/* Logo fallback (kita kung walang poster / hindi pa loaded ang video frame) */}
                <Image
                  src={LOGO_SRC}
                  alt=""
                  fill
                  unoptimized
                  sizes="112px"
                  className="object-contain p-3 opacity-70"
                />

                {/* Poster kung meron, kung wala, first frame ng video */}
                {hasPoster ? (
                  <Image
                    src={video.poster!}
                    alt=""
                    fill
                    unoptimized
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={`${video.src}#t=0.5`}
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                )}

                <span className="absolute inset-0 z-10 flex items-center justify-center bg-[#0B0B0B]/40">
                  <Play size={16} className="fill-white text-white" />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

export default function CarDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [car, setCar] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [testDriveOpen, setTestDriveOpen] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setLoadError("Vehicle ID is missing.");
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(null);

    fetchVehicle(id, { signal: controller.signal })
      .then(({ data }) => {
        setCar(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        const apiErr = err as ApiError;
        setCar(null);
        setLoadError(
          apiErr.status === 404
            ? "The vehicle you’re looking for may have been sold or moved. Explore our current inventory and we’ll help you find a great alternative."
            : apiErr.message ||
                "We couldn’t load this vehicle details page right now. Please try again or browse the showroom.",
        );
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  const carImage = car ? resolveMediaUrl(car.image, MEDIA_BASE_URL) : "";

  // Cover image first, then every uploaded gallery IMAGE.
  const slides = useMemo<Slide[]>(() => {
    if (!car) return [];

    const gallery: Slide[] = (car.galleryMedia ?? [])
      .filter((m) => m.type === "image")
      .map((m) => ({
        src: resolveMediaUrl(m.src, MEDIA_BASE_URL),
        alt: m.alt || `${car.name} photo`,
      }));

    return carImage
      ? [
          {
            src: carImage,
            alt: `${car.name} main view`,
            isCover: true,
          },
          ...gallery,
        ]
      : gallery;
  }, [car, carImage]);

  // Every uploaded gallery VIDEO goes to its own section.
  const videos = useMemo<VideoItem[]>(() => {
    if (!car) return [];

    return (car.galleryMedia ?? [])
      .filter((m) => m.type === "video")
      .map((m) => ({
        src: resolveMediaUrl(m.src, MEDIA_BASE_URL),
        poster: m.poster
          ? resolveMediaUrl(m.poster, MEDIA_BASE_URL)
          : undefined,
        alt: m.alt || `${car.name} video`,
        length: m.length ?? undefined,
        duration: m.duration ?? undefined,
      }));
  }, [car]);

  const unavailable = !car || car.status !== "available" || car.stock <= 0;

  const handleAddToCart = () => {
    if (!car || unavailable) return;

    addToCart({
      id: car.id,
      name: car.name,
      price: car.price,
      image: carImage,
      year: car.year,
      type: car.type,
      stock: car.stock,
    });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#0B0B0B] px-4 text-white">
          <div className="w-full max-w-md border-t-4 border-[#E31B23] bg-[#161616] px-6 py-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#E31B23]" />
            <p className="mt-6 text-2xl font-bold uppercase">Loading vehicle</p>
            <p className="mt-2 text-sm text-white/60">
              Preparing the latest details for you.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loadError || !car) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#0B0B0B] px-4 text-white">
          <div className="w-full max-w-lg border-t-4 border-[#E31B23] bg-[#161616] px-6 py-12 text-center">
            <p className="text-sm font-bold text-[#E31B23]">
              Vehicle unavailable
            </p>
            <h1 className="mt-4 text-3xl font-bold uppercase leading-tight">
              We couldn’t find this car
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              {loadError ||
                "The vehicle you’re looking for may have been sold or moved. Explore our current inventory and we’ll help you find a great alternative."}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className="chamfer inline-flex items-center justify-center bg-[#E31B23] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse showroom
              </Link>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="chamfer inline-flex items-center justify-center gap-2 bg-white px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0B] transition-colors hover:bg-[#E31B23] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <RotateCcw size={16} />
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const statusLabel =
    car.status === "sold"
      ? "Sold"
      : car.status === "reserved"
        ? "Reserved"
        : car.stock <= 0
          ? "Out of stock"
          : "Not available";

  const specs = [
    { label: "Mileage", value: car.mileage },
    { label: "Engine", value: car.engine },
    { label: "Power", value: car.horsepower },
    { label: "Transmission", value: car.transmission },
    {
      label: "Availability",
      value: unavailable ? statusLabel : `${car.stock} in stock`,
    },
  ];

  const highlights = [
    { icon: Gauge, label: "Engine", value: car.engine },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: MapPin, label: "Location", value: car.location },
    { icon: Sparkles, label: "Fuel", value: car.fuel },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0B0B] text-white">
        {/* HEADER STRIP */}
        <section className="relative overflow-hidden bg-[#0B0B0B]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 hidden h-full w-72 -skew-x-12 bg-[#E31B23] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-white lg:block"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
              href="/showroom"
              className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-[#E31B23] ${focusRing}`}
            >
              <ArrowLeft size={16} className="text-[#E31B23]" />
              Back to showroom
            </Link>
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        <div className="bg-[#111111]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            {/* Vehicle Area */}
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-8">
              {/* Media column: photos, then videos */}
              <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1 lg:space-y-8">
                {slides.length > 0 ? (
                  <CarGallery key={car.id} carName={car.name} slides={slides} />
                ) : (
                  <div className="flex h-[300px] items-center justify-center border-t-4 border-[#E31B23] bg-[#161616] text-sm text-white/50 sm:h-[420px] lg:h-[560px]">
                    No photos available yet
                  </div>
                )}

                {videos.length > 0 && (
                  <VideoSection
                    key={`videos-${car.id}`}
                    carName={car.name}
                    videos={videos}
                  />
                )}
              </div>

              {/* Right column: spans both rows so sticky works the whole way down */}
              <div className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:space-y-8">
                {/* Vehicle Info */}
                <aside className="border-t-4 border-[#E31B23] bg-[#161616] p-5 sm:p-6">
                  {/* Badge */}
                  <div className="mb-4 flex items-center justify-between gap-3">
                    {car.badge ? (
                      <span className="bg-[#E31B23] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        {car.badge}
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className="flex items-center gap-1 text-sm font-semibold text-white">
                      <Star
                        size={14}
                        fill="currentColor"
                        className="text-[#E31B23]"
                      />
                      Featured
                    </span>
                  </div>

                  {/* Vehicle Type */}
                  <p className="text-sm font-semibold text-[#E31B23]">
                    {car.year} | {car.type}
                  </p>

                  {/* Name */}
                  <h1 className="mt-2 text-3xl font-bold uppercase leading-[0.95] sm:text-4xl">
                    {car.name}
                  </h1>

                  {/* Price */}
                  <div className="mt-5 flex flex-wrap items-end gap-2 sm:mt-6 sm:gap-3">
                    <span className="text-4xl font-bold text-white sm:text-5xl">
                      {car.price}
                    </span>
                    <span className="pb-1.5 text-sm text-white/55">
                      Starting price
                    </span>
                  </div>

                  {/* Specifications */}
                  <div className="mt-6 space-y-3 border-y border-white/10 py-5 text-sm sm:mt-7 sm:py-6 sm:text-base">
                    {specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-white/55">{spec.label}</span>
                        <span className="text-right font-semibold text-white">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    disabled={unavailable}
                    onClick={handleAddToCart}
                    className={`chamfer mt-6 flex w-full items-center justify-center gap-2 bg-[#E31B23] px-5 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#E31B23] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:hover:bg-white/10 disabled:hover:text-white/40 ${focusRing}`}
                  >
                    {unavailable
                      ? statusLabel
                      : justAdded
                        ? "Added to cart ✓"
                        : "Add to Cart"}
                  </button>

                  {/* CTA */}
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <button
                      type="button"
                      disabled={car.status === "sold"}
                      onClick={() => setTestDriveOpen(true)}
                      className={`chamfer inline-flex items-center justify-center bg-white px-5 py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0B] transition-colors hover:bg-[#E31B23] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                    >
                      Book a test drive
                    </button>

                    <Link
                      href="/showroom"
                      className={`inline-flex items-center justify-center border-2 border-white/25 px-5 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#E31B23] hover:bg-[#E31B23] ${focusRing}`}
                    >
                      Browse more cars
                    </Link>
                  </div>
                </aside>

                {/* Financing (under the info card) */}
                <FinancingCalculator
                  key={`financing-${car.id}`}
                  carName={car.name}
                  price={car.price}
                  year={car.year}
                />
              </div>

              {/* Highlights: sits under the media, filling the left column */}
              <section className="min-w-0 border-t-4 border-[#E31B23] bg-[#161616] p-5 sm:p-8 lg:col-start-1 lg:row-start-2">
                <h2 className="flex items-center gap-3 text-2xl font-bold uppercase">
                  <Sparkles className="text-[#E31B23]" size={22} />
                  Vehicle highlights
                </h2>

                {/* Description */}
                {car.description && (
                  <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-white/75 sm:text-base">
                    {car.description}
                  </p>
                )}

                {/* Specs Grid (narrower column now, so 2 cols until xl) */}
                <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2 xl:grid-cols-4">
                  {highlights.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="border-l-4 border-[#E31B23] bg-[#0B0B0B] p-4"
                    >
                      <Icon className="text-[#E31B23]" size={18} />
                      <p className="mt-3 text-sm text-white/55">{label}</p>
                      <p className="mt-1 break-words text-lg font-bold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <TestDriveDialog
        open={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        vehicle={{ id: car.id, name: car.name }}
      />

      <Footer />
    </>
  );
}
