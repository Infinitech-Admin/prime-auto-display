// Path: app/cart/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart-context";

const getPriceValue = (price: string) => Number(price.replace(/[₱,]/g, ""));
const formatPrice = (value: number) =>
  `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602]";
const panel = "border-t-4 border-[#F9A602] bg-[#2A0A0A]";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    isHydrated,
  } = useCart();

  const total = useMemo(
    () => items.reduce((s, i) => s + getPriceValue(i.price) * i.quantity, 0),
    [items],
  );
  const downpayment = total * 0.2;

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
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Link
              href="/showroom"
              className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#F9A602] ${focus}`}
            >
              <ArrowLeft size={16} className="text-[#F9A602]" />
              Continue browsing
            </Link>
            <div className="mt-6 border-l-8 border-[#F9A602] pl-5 sm:pl-8">
              <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
                Your cart
              </h1>
              <p className="mt-3 text-base text-[#FDF5DC]/70">
                {!isHydrated
                  ? "Loading your cart..."
                  : totalItems > 0
                    ? `${totalItems} vehicle${totalItems === 1 ? "" : "s"} reserved for review`
                    : "No vehicles added yet"}
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        <section className="bg-[#150404]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            {!isHydrated ? (
              <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="space-y-4">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-36 animate-pulse bg-[#2A0A0A]" />
                  ))}
                </div>
                <div className="h-60 animate-pulse bg-[#2A0A0A]" />
              </div>
            ) : items.length === 0 ? (
              <div className={`${panel} px-6 py-20 text-center`}>
                <span className="chamfer mx-auto flex h-16 w-16 items-center justify-center bg-[#9B1111] text-[#F9A602]">
                  <ShoppingBag size={28} />
                </span>
                <p className="mt-6 text-3xl font-black uppercase">
                  Your cart is empty
                </p>
                <p className="mt-2 text-sm text-[#FDF5DC]/60">
                  Pick a car from the showroom to reserve it.
                </p>
                <Link
                  href="/showroom"
                  className={`chamfer mt-6 inline-flex items-center gap-2 bg-[#F9A602] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors hover:bg-[#FDF5DC] ${focus}`}
                >
                  Browse showroom
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 border-t-4 border-transparent bg-[#2A0A0A] p-4 transition-colors hover:border-[#F9A602] sm:flex-row sm:items-center sm:p-5"
                    >
                      <Link
                        href={`/showroom/car/${item.id}`}
                        className={`relative h-36 w-full shrink-0 overflow-hidden bg-[#1C0606] sm:h-28 sm:w-44 ${focus}`}
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            sizes="176px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#FDF5DC]/40">
                            No image
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#F9A602]">
                          {item.year} | {item.type}
                        </p>
                        <Link
                          href={`/showroom/car/${item.id}`}
                          className="mt-1 block text-2xl font-black uppercase leading-tight transition-colors hover:text-[#F9A602]"
                        >
                          {item.name}
                        </Link>
                        <span className="mt-1 block text-lg font-bold">
                          {item.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
                        <div className="flex items-center border-2 border-[#FDF5DC]/15">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className={`flex h-10 w-10 items-center justify-center transition-colors hover:bg-[#9B1111] ${focus}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className={`flex h-10 w-10 items-center justify-center transition-colors hover:bg-[#9B1111] ${focus}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[#FDF5DC]/60 transition-colors hover:text-[#F9A602] ${focus}`}
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={clearCart}
                    className={`text-sm font-semibold text-[#FDF5DC]/50 transition-colors hover:text-[#F9A602] ${focus}`}
                  >
                    Clear cart
                  </button>
                </div>

                <aside className={`${panel} p-6 sm:p-7 lg:sticky lg:top-28`}>
                  <h2 className="text-2xl font-black uppercase">
                    Order summary
                  </h2>

                  <dl className="mt-5 space-y-3 border-t border-[#FDF5DC]/10 pt-5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-[#FDF5DC]/65">
                        Total ({totalItems} item{totalItems === 1 ? "" : "s"})
                      </dt>
                      <dd className="font-bold">{formatPrice(total)}</dd>
                    </div>
                    <div className="flex items-center justify-between bg-[#F9A602] px-4 py-3 text-[#1C0606]">
                      <dt className="font-semibold">Pay today (20%)</dt>
                      <dd className="text-2xl font-black">
                        {formatPrice(downpayment)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-4 text-xs leading-5 text-[#FDF5DC]/55">
                    The 20% downpayment secures your vehicle. A sales advisor
                    confirms final pricing.
                  </p>

                  <Link
                    href="/checkout"
                    className={`chamfer mt-6 flex w-full items-center justify-center gap-2 bg-[#9B1111] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#F9A602] hover:text-[#1C0606] ${focus}`}
                  >
                    Proceed to checkout
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/showroom"
                    className={`mt-3 flex w-full items-center justify-center border-2 border-[#FDF5DC]/25 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors hover:border-[#F9A602] hover:text-[#F9A602] ${focus}`}
                  >
                    Continue browsing
                  </Link>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
