// Path: app/blog/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper, Play, RotateCcw } from "lucide-react";
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

  const latest = !isLoading && !loadError ? posts[0] : undefined;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1C0606] text-white">
        {/* HEADER */}
        <section className="relative overflow-hidden bg-[#1C0606]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 hidden h-full w-72 -skew-x-12 bg-[#9B1111] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-white lg:block"
          />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 lg:py-24 xl:pr-40 2xl:pr-8">
            <div className="lg:min-w-0 lg:flex-1">
              <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.92] sm:text-6xl lg:text-8xl">
                News, stories
                <span className="block text-[#F9A602]">&amp; updates.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Fresh arrivals, deliveries, and behind-the-scenes from Capital
                Jey Car Trading.
              </p>
            </div>

            {/* Right side: latest post + quick links */}
            <div className="w-full border-t-4 border-[#9B1111] bg-[#161616] lg:w-[400px] lg:shrink-0">
              <div className="p-6 sm:p-7">
                <h2 className="flex items-center gap-3 text-2xl font-bold uppercase">
                  <Newspaper size={22} className="text-[#9B1111]" />
                  Latest post
                </h2>

                {latest ? (
                  <Link
                    href={`/blog/${latest.id}`}
                    className="group mt-5 block border-y border-white/10 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="block text-sm text-white/55">
                      {formatDate(latest.created_at)}
                    </span>
                    <span className="mt-2 line-clamp-3 block text-xl font-bold uppercase leading-tight transition-colors group-hover:text-[#9B1111]">
                      {latest.title}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#9B1111]">
                      Read it
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                ) : (
                  <p className="mt-5 border-y border-white/10 py-5 text-sm leading-6 text-white/70">
                    {isLoading
                      ? "Loading the latest post..."
                      : "New posts will show up here."}
                  </p>
                )}

                <ul className="mt-2 divide-y divide-white/10">
                  {[
                    { label: "Browse the showroom", href: "/showroom" },
                    { label: "Sell or trade your car", href: "/sell-trade" },
                    { label: "Contact us", href: "/contact" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between gap-4 py-4 text-sm font-bold uppercase transition-colors hover:text-[#9B1111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {item.label}
                        <ArrowRight
                          size={18}
                          className="shrink-0 text-[#9B1111] transition-transform group-hover:translate-x-1"
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

        {/* POSTS */}
        <section className="bg-[#111111]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            {isLoading ? (
              <div className="border-t-4 border-[#9B1111] bg-[#161616] px-6 py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#9B1111]" />
                <p className="mt-6 text-2xl font-bold uppercase">
                  Loading posts...
                </p>
              </div>
            ) : loadError ? (
              <div className="border-t-4 border-[#9B1111] bg-[#161616] px-6 py-16 text-center">
                <p className="text-2xl font-bold uppercase">
                  Something went wrong
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={() => load()}
                  className="chamfer mt-6 inline-flex items-center gap-2 bg-[#9B1111] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#9B1111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <RotateCcw size={16} />
                  Retry
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="border-t-4 border-[#9B1111] bg-[#161616] px-6 py-16 text-center">
                <p className="text-2xl font-bold uppercase">No posts yet</p>
                <p className="mt-2 text-sm text-white/60">
                  Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => {
                  const imageSrc = resolveMediaUrl(post.image, MEDIA_BASE_URL);
                  const hasVideo = Boolean(post.video);

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="group flex h-full flex-col overflow-hidden border-t-4 border-transparent bg-[#161616] transition-colors hover:border-[#9B1111] hover:bg-[#1C1C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <div className="relative aspect-video overflow-hidden bg-[#1C0606]">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={post.title}
                            width={800}
                            height={450}
                            unoptimized
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : hasVideo ? (
                          <video
                            src={`${resolveMediaUrl(post.video, MEDIA_BASE_URL)}#t=0.1`}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                            No media
                          </div>
                        )}

                        {hasVideo && (
                          <span className="absolute inset-0 flex items-center justify-center bg-[#1C0606]/40">
                            <span className="flex h-14 w-14 items-center justify-center bg-[#9B1111] text-white">
                              <Play
                                size={22}
                                className="ml-0.5 fill-white text-white"
                              />
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <p className="text-sm font-semibold text-[#9B1111]">
                          {formatDate(post.created_at)}
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-2xl font-bold uppercase leading-tight">
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">
                          {post.description}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold uppercase tracking-wider text-white transition-colors group-hover:text-[#9B1111]">
                          Read more
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
