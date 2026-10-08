// Path: app/blog/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  MEDIA_BASE_URL,
  fetchBlogPost,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type BlogPost,
} from "@/lib/api";

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return;
      setIsLoading(true);
      setLoadError(null);

      try {
        const { data } = await fetchBlogPost(id, { signal });
        setPost(data);
        setIsLoading(false);
      } catch (err) {
        if (isAbortError(err)) return;
        const e = err as ApiError;
        setLoadError(
          e.status === 404
            ? "This post doesn’t exist or was removed."
            : e.message || "We couldn’t load this post.",
        );
        setIsLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const imageSrc = post ? resolveMediaUrl(post.image, MEDIA_BASE_URL) : "";
  const videoSrc = post ? resolveMediaUrl(post.video, MEDIA_BASE_URL) : "";

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

          <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowLeft size={16} className="text-[#E31B23]" />
              Back to blog
            </Link>

            {post && (
              <>
                <p className="mt-8 text-sm font-semibold text-[#E31B23]">
                  {new Date(post.created_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h1 className="mt-3 max-w-3xl text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
              </>
            )}
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        {/* CONTENT */}
        <section className="bg-[#111111]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            {isLoading ? (
              <div className="border-t-4 border-[#E31B23] bg-[#161616] px-6 py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#E31B23]" />
                <p className="mt-4 text-sm text-white/60">Loading post...</p>
              </div>
            ) : loadError || !post ? (
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
            ) : (
              <article className="space-y-10">
                {videoSrc ? (
                  <div className="overflow-hidden border-t-4 border-[#E31B23] bg-black">
                    <video
                      src={videoSrc}
                      poster={imageSrc || undefined}
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-video w-full"
                    />
                  </div>
                ) : imageSrc ? (
                  <div className="overflow-hidden border-t-4 border-[#E31B23] bg-[#0B0B0B]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={post.title}
                      className="w-full object-cover"
                    />
                  </div>
                ) : null}

                <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-white/80 sm:text-lg">
                  {post.description}
                </p>
              </article>
            )}
          </div>
        </section>

        {/* BOTTOM BAND */}
        <section className="bg-[#E31B23] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h2 className="text-3xl font-bold uppercase leading-none sm:text-4xl">
              See what&apos;s on the lot
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className="chamfer inline-flex items-center justify-center bg-[#0B0B0B] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Visit Showroom
              </Link>

              <Link
                href="/contact"
                className="chamfer inline-flex items-center justify-center bg-white px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0B] transition-colors hover:bg-[#0B0B0B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
