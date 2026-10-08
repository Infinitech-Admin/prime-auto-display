// Path: app/orders/page.tsx

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  RefreshCw,
  ShoppingBag,
  X,
} from "lucide-react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/context/auth-context";
import { apiRequest, isAbortError } from "@/lib/api";

type OrderStatus =
  | "pending_verification"
  | "confirmed"
  | "rejected"
  | "cancelled";

type Order = {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  downpayment: number;
  balance: number;
  payment_method: "gcash" | "maya" | "bank";
  payment_reference: string | null;
  payment_proof_url: string | null;
  created_at: string;
  items: {
    id: number;
    vehicle_id: number | null;
    name: string;
    unit_price: number;
    quantity: number;
  }[];
};

const LOGIN_HREF = "/login";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602]";
const panel = "border-t-4 border-[#F9A602] bg-[#2A0A0A]";
const btn =
  "chamfer inline-flex items-center gap-2 bg-[#F9A602] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors hover:bg-[#FDF5DC]";

const formatPrice = (v: number) =>
  `₱${v.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const PAYMENT_LABELS: Record<Order["payment_method"], string> = {
  gcash: "GCash",
  maya: "Maya",
  bank: "Bank transfer",
};

const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string; message: string }
> = {
  pending_verification: {
    label: "Verifying payment",
    badge: "bg-[#F9A602] text-[#1C0606]",
    message:
      "We received your order and are checking your payment screenshot. We'll contact you once it's verified.",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-[#FDF5DC] text-[#1C0606]",
    message:
      "Your payment is verified. A sales advisor will contact you about the next steps.",
  },
  rejected: {
    label: "Payment issue",
    badge: "bg-[#9B1111] text-white",
    message:
      "We couldn't verify your payment. Please contact us and send a clearer screenshot.",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-[#FDF5DC]/15 text-[#FDF5DC]/70",
    message: "This order was cancelled.",
  },
};

type StepState = "done" | "current" | "failed" | "todo";
const STEP_LABELS = ["Order placed", "Payment check", "Order confirmed"];

const stepStates = (s: OrderStatus): StepState[] =>
  s === "confirmed"
    ? ["done", "done", "done"]
    : s === "rejected"
      ? ["done", "failed", "todo"]
      : ["done", "current", "todo"];

function Tracker({ status }: { status: OrderStatus }) {
  const states = stepStates(status);
  return (
    <ol className="grid grid-cols-3 gap-2">
      {STEP_LABELS.map((label, i) => {
        const st = states[i];
        const lineOn = i > 0 && states[i - 1] === "done" && st !== "todo";
        const circle =
          st === "done"
            ? "border-[#F9A602] bg-[#F9A602] text-[#1C0606]"
            : st === "current"
              ? "border-[#F9A602] bg-transparent text-[#F9A602]"
              : st === "failed"
                ? "border-[#9B1111] bg-[#9B1111] text-white"
                : "border-[#FDF5DC]/20 text-[#FDF5DC]/40";
        return (
          <li key={label} className="relative flex flex-col items-center">
            {i > 0 && (
              <span
                aria-hidden
                className={`absolute right-1/2 top-4 h-0.5 w-full ${lineOn ? "bg-[#F9A602]" : "bg-[#FDF5DC]/10"}`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center border-2 ${circle}`}
            >
              {st === "done" && <Check size={15} strokeWidth={3} />}
              {st === "current" && <Clock size={15} />}
              {st === "failed" && <X size={15} strokeWidth={3} />}
              {st === "todo" && <span className="text-xs">{i + 1}</span>}
            </span>
            <span
              className={`mt-2 text-center text-xs font-semibold leading-4 ${st === "todo" ? "text-[#FDF5DC]/40" : "text-[#FDF5DC]/85"}`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#FDF5DC]/65">{k}</span>
      <span className={strong ? "font-black text-[#F9A602]" : "font-semibold"}>
        {v}
      </span>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const meta = STATUS_META[order.status] ?? STATUS_META.pending_verification;
  return (
    <article className={`${panel} p-5 sm:p-7`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#FDF5DC]/55">
            Placed on {formatDate(order.created_at)}
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase">
            {order.order_number}
          </h2>
        </div>
        <span
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${meta.badge}`}
        >
          {meta.label}
        </span>
      </div>

      {order.status !== "cancelled" && (
        <div className="mt-6">
          <Tracker status={order.status} />
        </div>
      )}

      <p className="mt-5 border-l-4 border-[#F9A602] bg-[#1C0606] p-4 text-sm leading-6 text-[#FDF5DC]/80">
        {meta.message}
      </p>

      <div className="mt-6 space-y-3 border-t border-[#FDF5DC]/10 pt-5">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="min-w-0">
              {item.vehicle_id ? (
                <Link
                  href={`/showroom/car/${item.vehicle_id}`}
                  className={`block truncate font-bold uppercase transition-colors hover:text-[#F9A602] ${focus}`}
                >
                  {item.name}
                </Link>
              ) : (
                <span className="block truncate font-bold uppercase">
                  {item.name}
                </span>
              )}
              <span className="text-xs text-[#FDF5DC]/55">
                Qty {item.quantity}
              </span>
            </div>
            <span className="shrink-0 font-bold">
              {formatPrice(item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2.5 border-t border-[#FDF5DC]/10 pt-5 text-sm">
        <Row k="Total price" v={formatPrice(order.subtotal)} />
        <Row k="Downpayment (20%)" v={formatPrice(order.downpayment)} strong />
        <Row k="Remaining balance" v={formatPrice(order.balance)} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#FDF5DC]/10 pt-5 text-xs text-[#FDF5DC]/65">
        <span>
          Paid via{" "}
          <span className="font-bold text-[#FDF5DC]">
            {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
          </span>
          {order.payment_reference && <> | Ref {order.payment_reference}</>}
        </span>
        {order.payment_proof_url && (
          <a
            href={order.payment_proof_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 font-bold text-[#F9A602] transition-colors hover:text-[#FDF5DC] ${focus}`}
          >
            View screenshot
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </article>
  );
}

const Skeleton = () => (
  <div className="space-y-5">
    {[0, 1].map((i) => (
      <div key={i} className="h-72 animate-pulse bg-[#2A0A0A]" />
    ))}
  </div>
);

function Empty({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className={`${panel} px-6 py-16 text-center`}>
      <span className="chamfer mx-auto flex h-16 w-16 items-center justify-center bg-[#9B1111] text-[#F9A602]">
        <ShoppingBag size={28} />
      </span>
      <p className="mt-6 text-3xl font-black uppercase">{title}</p>
      <p className="mt-2 text-sm text-[#FDF5DC]/60">{text}</p>
      <Link href={href} className={`${btn} mt-6 ${focus}`}>
        {cta}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setError("");
    try {
      const res = await apiRequest<{ data: Order[] }>("/orders", { signal });
      setOrders(res.data ?? []);
    } catch (err) {
      if (isAbortError(err)) return;
      setError(
        err instanceof Error ? err.message : "Couldn't load your orders.",
      );
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setOrders(null);
      return;
    }
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [authLoading, user, load]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  };

  let content: React.ReactNode;
  if (authLoading || (user && orders === null && !error)) {
    content = <Skeleton />;
  } else if (!user) {
    content = (
      <Empty
        title="Log in to see your orders"
        text="Track the status of your reservations and payments."
        href={LOGIN_HREF}
        cta="Log in"
      />
    );
  } else if (error && orders === null) {
    content = (
      <div className={`${panel} px-6 py-14 text-center`}>
        <p className="text-2xl font-black uppercase">
          Couldn&apos;t load orders
        </p>
        <p className="mt-2 text-sm text-[#FDF5DC]/70">{error}</p>
        <button
          type="button"
          onClick={handleRefresh}
          className={`${btn} mt-6 ${focus}`}
        >
          Try again
        </button>
      </div>
    );
  } else if (orders && orders.length === 0) {
    content = (
      <Empty
        title="No orders yet"
        text="When you reserve a car, you can track it here."
        href="/showroom"
        cta="Browse showroom"
      />
    );
  } else {
    content = (
      <div className="space-y-5">
        {orders?.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    );
  }

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
          <div className="relative mx-auto flex max-w-4xl flex-wrap items-end justify-between gap-4 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="border-l-8 border-[#F9A602] pl-5 sm:pl-8">
              <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
                My orders
              </h1>
              <p className="mt-3 text-base text-[#FDF5DC]/70">
                Follow your reservations from payment to confirmation.
              </p>
            </div>
            {user && orders !== null && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`inline-flex items-center gap-2 border-2 border-[#FDF5DC]/25 px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors hover:border-[#F9A602] hover:text-[#F9A602] disabled:opacity-60 ${focus}`}
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            )}
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        <section className="bg-[#150404]">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            {content}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
