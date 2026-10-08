// Path: app/blog/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  MEDIA_BASE_URL,
  fetchBlogPosts,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type BlogPost,
} from "@/lib/api";

const DEFAULT_LOAD_ERROR =
  "We couldn’t load the blog right now. Please refresh the page and try again.";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602]";

function Media({ post, className }: { post: BlogPost; className: string }) {
  const img = resolveMediaUrl(post.image, MEDIA_BASE_URL);
  const vid = resolveMediaUrl(post.video, MEDIA_BASE_URL);
  return (
    <div className={`relative overflow-hidden bg-[#2A0A0A] ${className}`}>
      {img ? (
        <Image
          src={img}
          alt={post.title}
          width={1200}
          height={675}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : vid ? (
        <video
          src={`${vid}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-[#FDF5DC]/40">
          No media
        </div>
      )}
      {post.video && (
        <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center bg-[#9B1111] text-white">
          <Play size={18} className="ml-0.5 fill-white" />
        </span>
      )}
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const { data } = await fetchBlogPosts({ signal });
      setPosts(data ?? []);
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

  const [featured, ...rest] = posts;

  const panel =
    "border-t-4 border-[#F9A602] bg-[#2A0A0A] px-6 py-16 text-center";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1C0606] text-[#FDF5DC]">
        <section className="relative overflow-hidden bg-[#1C0606]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 hidden h-full w-72 -skew-x-12 bg-[#9B1111] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-[#F9A602] lg:block"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-4xl border-l-8 border-[#F9A602] pl-5 sm:pl-8">
              <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-8xl">
                News from the lot.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#FDF5DC]/70 sm:text-lg">
                New arrivals, happy deliveries, and what&apos;s happening at
                Prime Auto Display.
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        <section className="bg-[#150404]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            {isLoading ? (
              <div className={panel}>
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#FDF5DC]/15 border-t-[#F9A602]" />
                <p className="mt-6 text-2xl font-black uppercase">
                  Loading posts...
                </p>
              </div>
            ) : loadError ? (
              <div className={panel}>
                <p className="text-2xl font-black uppercase">
                  Couldn&apos;t load posts
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#FDF5DC]/70">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={() => load()}
                  className={`chamfer mt-6 inline-flex items-center gap-2 bg-[#F9A602] px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors hover:bg-[#FDF5DC] ${focus}`}
                >
                  <RotateCcw size={16} />
                  Try again
                </button>
              </div>
            ) : !featured ? (
              <div className={panel}>
                <p className="text-2xl font-black uppercase">No posts yet</p>
                <p className="mt-2 text-sm text-[#FDF5DC]/60">
                  Check back soon for new arrivals and updates.
                </p>
              </div>
            ) : (
              <>
                {/* Featured */}
                <Link
                  href={`/blog/${featured.id}`}
                  className={`group grid overflow-hidden border-t-4 border-[#F9A602] bg-[#2A0A0A] lg:grid-cols-[1.3fr_1fr] ${focus}`}
                >
                  <Media
                    post={featured}
                    className="aspect-video lg:aspect-auto lg:min-h-[380px]"
                  />
                  <div className="flex flex-col justify-center p-6 sm:p-10">
                    <p className="text-sm font-semibold text-[#F9A602]">
                      Latest · {formatDate(featured.created_at)}
                    </p>
                    <h2 className="mt-3 line-clamp-3 text-3xl font-black uppercase leading-tight transition-colors group-hover:text-[#F9A602] sm:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="mt-4 line-clamp-4 text-base leading-7 text-[#FDF5DC]/70">
                      {featured.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                      Read story
                      <ArrowRight
                        size={16}
                        className="text-[#F9A602] transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>

                {rest.length > 0 && (
                  <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {rest.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.id}`}
                        className={`group flex h-full flex-col overflow-hidden border-t-4 border-transparent bg-[#2A0A0A] transition-colors hover:border-[#F9A602] ${focus}`}
                      >
                        <Media post={post} className="aspect-video" />
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <p className="text-sm font-semibold text-[#F9A602]">
                            {formatDate(post.created_at)}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-2xl font-black uppercase leading-tight">
                            {post.title}
                          </h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#FDF5DC]/70">
                            {post.description}
                          </p>
                          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold uppercase tracking-wider transition-colors group-hover:text-[#F9A602]">
                            Read more
                            <ArrowRight
                              size={16}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="bg-[#FDF5DC] text-[#1C0606]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="border-l-8 border-[#9B1111] pl-5">
              <h2 className="text-4xl font-black uppercase leading-none sm:text-5xl">
                See what&apos;s on the lot
              </h2>
              <p className="mt-3 text-base text-[#1C0606]/75">
                Browse the showroom or sell or trade in your car.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className="chamfer inline-flex items-center justify-center bg-[#9B1111] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1C0606]"
              >
                Visit Showroom
              </Link>
              <Link
                href="/sell-trade"
                className="chamfer inline-flex items-center justify-center bg-[#1C0606] px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#FDF5DC] transition-colors hover:bg-[#9B1111]"
              >
                Sell / Trade Car
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
